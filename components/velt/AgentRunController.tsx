"use client";

// [Velt] The host half of the comment progress + actions demo

import { useCallback, useEffect, useRef } from "react";
import {
  useAcceptSuggestion,
  useCommentActionCallback,
  useCommentAnnotations,
  useRejectSuggestion,
} from "@veltdev/react";
import {
  ACTION_IDS,
  AGENT_STEP_INTERVAL_MS,
  DEEP_DIVE_ANSWER,
  DEEP_DIVE_STEPS,
  RE_ANALYZE_STEPS,
} from "@/lib/velt/agentRunScript";

const AGENT_RUN_ENDPOINT = "/api/velt/agent-run";

interface RunState {
  annotationId: string;
  commentId: number;
  stepIndex: number;
  timer: number | null;
  cancelled: boolean;
  /* Which script this run follows — decides the step count and the copy */
  script: "deep-dive" | "re-analyze";
}

async function postRun(payload: Record<string, unknown>) {
  const response = await fetch(AGENT_RUN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    console.warn("[AgentRun] request failed", payload.phase, response.status, json);
    return null;
  }
  return json as Record<string, unknown>;
}

export function AgentRunController() {
  const actionEvent = useCommentActionCallback("commentActionClicked");

  // These perform exactly the write Velt's own accept/reject buttons do
  const { acceptSuggestion } = useAcceptSuggestion();
  const { rejectSuggestion } = useRejectSuggestion();

  // One run at a time is enough for a demo, and a single ref keeps Stop simple
  const runRef = useRef<RunState | null>(null);

  const clearRunTimer = useCallback(() => {
    const run = runRef.current;
    if (run?.timer != null) {
      window.clearTimeout(run.timer);
      run.timer = null;
    }
  }, []);

  // Stop the timer if the page goes away mid-run
  useEffect(() => clearRunTimer, [clearRunTimer]);

  /* A sleep that Stop can interrupt */
  const pause = useCallback((run: RunState, ms: number) => {
    return new Promise<boolean>((resolve) => {
      run.timer = window.setTimeout(() => {
        run.timer = null;
        resolve(!run.cancelled);
      }, ms);
    });
  }, []);

  const startRun = useCallback(
    async (annotationId: string, script: "deep-dive" | "re-analyze" = "deep-dive") => {
      if (runRef.current && !runRef.current.cancelled) {
        console.warn("[AgentRun] a run is already in flight — ignoring");
        return;
      }

      const started = await postRun({ phase: "start", annotationId, script });
      const commentId = started?.commentId;
      if (typeof commentId !== "number") return;

      const run: RunState = { annotationId, commentId, stepIndex: 0, timer: null, cancelled: false, script };
      const stepCount = script === "re-analyze" ? RE_ANALYZE_STEPS.length : DEEP_DIVE_STEPS.length;
      runRef.current = run;

      // One linear driver rather than a self-scheduling callback
      for (let step = 1; step <= stepCount; step++) {
        const alive = await pause(run, AGENT_STEP_INTERVAL_MS);
        if (!alive || run.cancelled) return;

        run.stepIndex = step;

        if (step < stepCount) {
          await postRun({ phase: "advance", annotationId, commentId, stepIndex: step, script });
          continue;
        }

        // Past the last step: the answer lands on the SAME comment
        await postRun({ phase: "complete", annotationId, commentId, script });
      }

      if (runRef.current === run) runRef.current = null;
    },
    [pause],
  );

  /* Stop a run — including one this component never started */
  const stopRun = useCallback(
    async (fallback?: { annotationId?: string; commentId?: number }) => {
      const run = runRef.current;
      const annotationId = run?.annotationId ?? fallback?.annotationId;
      const commentId = run?.commentId ?? fallback?.commentId;

      if (run) {
        // Flip the flag before clearing the timer and before the await
        run.cancelled = true;
        clearRunTimer();
        runRef.current = null;
      }

      if (!annotationId || typeof commentId !== "number") return;
      await postRun({ phase: "cancel", annotationId, commentId });
    },
    [clearRunTimer],
  );

  // Reap orphaned runs
  const annotations = useCommentAnnotations();
  const reapedRef = useRef(false);

  useEffect(() => {
    if (reapedRef.current) return;
    if (!annotations) return;
    reapedRef.current = true;

    for (const annotation of annotations) {
      for (const comment of annotation.comments ?? []) {
        if (comment.progress?.state !== "active") continue;
        console.log(
          "[AgentRun] reaping orphaned run",
          `${annotation.annotationId}:${comment.commentId}`,
        );
        void postRun({
          phase: "cancel",
          annotationId: annotation.annotationId,
          commentId: comment.commentId,
        });
      }
    }
  }, [annotations]);

  useEffect(() => {
    if (!actionEvent) return;

    const { actionId, annotationId, scope, commentId, action, actionUser } = actionEvent;

    switch (actionId) {
      case ACTION_IDS.DIG_DEEPER:
        void startRun(annotationId);
        break;

      case ACTION_IDS.STOP:
        // Pass the event's own target — on a fresh page it is the only handle we get
        void stopRun({ annotationId, commentId });
        break;

      case ACTION_IDS.COPY_RESPONSE:
        // The chip is ours to interpret; Velt only reports that it was pressed
        void navigator.clipboard?.writeText(DEEP_DIVE_ANSWER.text).catch(() => {});
        console.log("[AgentRun] response copied to clipboard");
        break;

      case ACTION_IDS.SHARE_SLACK:
        // Stub: a real integration would POST to the customer's Slack webhook
        console.log("[AgentRun] would share to Slack:", DEEP_DIVE_ANSWER.text.slice(0, 80) + "…");
        break;

      case ACTION_IDS.RE_ANALYZE:
        // Runs on the suggestion card, which keeps its finding readable throughout
        void startRun(annotationId, "re-analyze");
        break;

      case ACTION_IDS.ACCEPT:
        void acceptSuggestion({ annotationId })
          .then((r) => console.log("[AgentRun] acceptSuggestion() ->", r))
          .catch((e) => console.warn("[AgentRun] acceptSuggestion failed", e));
        break;

      case ACTION_IDS.REJECT:
        void rejectSuggestion({ annotationId, reason: "dismissed from the demo" })
          .then((r) => console.log("[AgentRun] rejectSuggestion() ->", r))
          .catch((e) => console.warn("[AgentRun] rejectSuggestion failed", e));
        break;

      case ACTION_IDS.LOG:
        console.log("[AgentRun] action clicked", {
          actionId,
          scope,
          annotationId,
          commentId,
          label: action?.label,
          metadata: action?.metadata,
          clickedBy: actionUser?.userId,
        });
        break;

      default:
        console.log("[AgentRun] unhandled action", actionId);
    }
    // `actionEvent` is an external event, not derived state
  }, [actionEvent, startRun, stopRun, acceptSuggestion, rejectSuggestion]);

  return null;
}

export default AgentRunController;
