"use client";

// [Velt] The host half of the comment progress + actions demo.
//
// Velt renders customer-defined action chips from `comment.actions` and emits
// `commentActionClicked` when one is pressed. It writes NOTHING itself — every
// consequence below is ours. That is the whole contract, and it is what makes
// these chips safe to put on an agent comment: no accidental annotation mutation.
//
// This component owns the run's PACING (see AGENT_STEP_INTERVAL_MS) so that
// "Stop" can genuinely stop it. All writes go through /api/velt/agent-run.

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
  /** Which script this run follows — decides the step count and the copy. */
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

  // Public client API (SDK 6.0.8+). These perform exactly the write Velt's own
  // ✓/✗ buttons perform — `suggestion.status` AND the `type` flip that retires
  // the card — so a customer who replaces the built-ins with their own chips
  // loses nothing. Earlier this demo had to go through a server-side REST call,
  // which needed a workspace key and could never have shipped to a browser.
  const { acceptSuggestion } = useAcceptSuggestion();
  const { rejectSuggestion } = useRejectSuggestion();

  // One run at a time is enough for a demo, and a single ref keeps Stop simple:
  // it has exactly one timer to clear and one comment to cancel.
  const runRef = useRef<RunState | null>(null);

  const clearRunTimer = useCallback(() => {
    const run = runRef.current;
    if (run?.timer != null) {
      window.clearTimeout(run.timer);
      run.timer = null;
    }
  }, []);

  // Stop the timer if the page goes away mid-run.
  useEffect(() => clearRunTimer, [clearRunTimer]);

  /**
   * A sleep that Stop can interrupt.
   *
   * The timeout id is parked on the run so `stopRun` can clear it, and the
   * promise resolves `false` when the run was cancelled — which is what lets the
   * driver below bail out between steps instead of finishing a stopped run.
   */
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

      // One linear driver rather than a self-scheduling callback: the whole run
      // reads top-to-bottom, and every await is a place Stop can win.
      for (let step = 1; step <= stepCount; step++) {
        const alive = await pause(run, AGENT_STEP_INTERVAL_MS);
        if (!alive || run.cancelled) return;

        run.stepIndex = step;

        if (step < stepCount) {
          await postRun({ phase: "advance", annotationId, commentId, stepIndex: step, script });
          continue;
        }

        // Past the last step: the answer lands on the SAME comment.
        await postRun({ phase: "complete", annotationId, commentId, script });
      }

      if (runRef.current === run) runRef.current = null;
    },
    [pause],
  );

  /**
   * Stop a run — including one this component never started.
   *
   * `fallback` is the target carried by the Stop chip's own click event. It is
   * what makes the button work at all after a reload: the pacing lives in this
   * component, so `runRef` is empty on a fresh page, and the previous version
   * returned early whenever it was — which is exactly the reported "Stop does
   * nothing". The progress row belongs to a real comment on the server, so the
   * cancel has to be sent from whatever identifiers are to hand, not only from
   * local state.
   */
  const stopRun = useCallback(
    async (fallback?: { annotationId?: string; commentId?: number }) => {
      const run = runRef.current;
      const annotationId = run?.annotationId ?? fallback?.annotationId;
      const commentId = run?.commentId ?? fallback?.commentId;

      if (run) {
        // Flip the flag BEFORE clearing the timer and before the await: a pause
        // that resolves during the network round trip must see a cancelled run.
        run.cancelled = true;
        clearRunTimer();
        runRef.current = null;
      }

      if (!annotationId || typeof commentId !== "number") return;
      await postRun({ phase: "cancel", annotationId, commentId });
    },
    [clearRunTimer],
  );

  // ── REAP ORPHANED RUNS ──────────────────────────────────────────────────────
  //
  // `phase: 'start'` ADDS A COMMENT whose only content is the progress object,
  // and every later phase UPDATES that comment. The pacing, though, lives in
  // this component — so a run interrupted by a reload or a closed tab can never
  // advance or complete, and its comment is stranded at `state: 'active'`
  // forever. That is the "it's always visible" report: the rows on screen were
  // real comments left behind by runs whose browser had gone away, and nothing
  // in the system was ever going to finish them.
  //
  // Reaped from the FIRST annotations emission only, and never again. A run
  // cannot outlive the page, so anything already active when this component
  // mounts is orphaned by definition — while anything that appears later was
  // started by this session and must be left alone.
  //
  // Doing it per-emission instead was tried and broke Re-analyze outright:
  // `startRun` sets `runRef` only AFTER the start round-trip returns, so between
  // the server creating the comment and the ref being assigned there is a window
  // where a perfectly live run looks orphaned — and the reaper cancelled the run
  // it had just started. Measured: the progress row never appeared at all.
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
        // Pass the event's own target: on a fresh page this is the ONLY way to
        // reach the comment the row belongs to.
        void stopRun({ annotationId, commentId });
        break;

      case ACTION_IDS.COPY_RESPONSE:
        // The chip is ours to interpret however we like — Velt only told us it
        // was pressed.
        void navigator.clipboard?.writeText(DEEP_DIVE_ANSWER.text).catch(() => {});
        console.log("[AgentRun] response copied to clipboard");
        break;

      case ACTION_IDS.SHARE_SLACK:
        // Stub: a real integration would POST to the customer's Slack webhook.
        console.log("[AgentRun] would share to Slack:", DEEP_DIVE_ANSWER.text.slice(0, 80) + "…");
        break;

      case ACTION_IDS.RE_ANALYZE:
        // Runs ON the suggestion card. The card keeps rendering its finding while
        // the progress row reports underneath it — one annotation, both rows.
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
    // `actionEvent` is an external event, not derived state — react to each new
    // object identity and nothing else.
  }, [actionEvent, startRun, stopRun, acceptSuggestion, rejectSuggestion]);

  return null;
}

export default AgentRunController;
