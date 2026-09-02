// [Velt] Scripted agent run — the backend half of the progress + actions demo.
//
// POST /api/velt/agent-run drives ONE comment through a full progress lifecycle
// using the Velt REST API, exactly as a customer's own agent backend would:
//
//   { phase: 'start'    }  -> comments/add     progress.state 'active' + [Stop]
//   { phase: 'advance'  }  -> comments/update  progress.steps advanced
//   { phase: 'complete' }  -> comments/update  commentText + 'completed' + [Copy/Share/Log]
//   { phase: 'cancel'   }  -> comments/update  progress.state 'cancelled'
//
// WHY REST AND NOT THE CLIENT SDK: on the SDK path `from` is always overwritten
// with the acting user (the impersonation boundary), so a browser-side
// `addComment` would attribute the run to the signed-in human instead of the
// agent. Agent attribution is REST-only. This also keeps VELT_AUTH_TOKEN server-side.
//
// WHY THE CLIENT PACES IT: the browser owns the timer and calls 'advance'
// itself, rather than this route sleeping through a 30s run. That is what makes
// the Stop chip real — cancelling clears a live timer instead of pretending.
//
// Docs: https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature

import type { NextRequest } from "next/server";
import {
  ANSWER_ACTIONS,
  DEEP_DIVE_AGENT,
  DEEP_DIVE_ANSWER,
  DEEP_DIVE_STEPS,
  RE_ANALYZE_ANSWER,
  RE_ANALYZE_STEPS,
  RUNNING_ACTIONS,
  SUGGESTION_ACTIONS,
} from "@/lib/velt/agentRunScript";
import {
  SEED_DOCUMENT_ID,
  SEED_ORGANIZATION_ID,
} from "@/lib/velt/agentCommentSeeds";

const VELT_API_BASE = "https://api.velt.dev";
const ADD_COMMENT_URL = `${VELT_API_BASE}/v2/commentannotations/comments/add`;
const UPDATE_COMMENT_URL = `${VELT_API_BASE}/v2/commentannotations/comments/update`;

type Phase = "start" | "advance" | "complete" | "cancel";

/**
 * Which script the run follows.
 *
 * `deep-dive` runs on a normal thread; `re-analyze` runs on a SUGGESTION card,
 * where the row renders inside the card itself. The only real difference is the
 * copy and the actions written on completion — the lifecycle is identical, which
 * is the point: one annotation, one comment, same three phases.
 */
type RunScript = "deep-dive" | "re-analyze";

function scriptFor(script: RunScript | undefined) {
  return script === "re-analyze"
    ? { steps: RE_ANALYZE_STEPS, answer: RE_ANALYZE_ANSWER, doneActions: SUGGESTION_ACTIONS }
    : { steps: DEEP_DIVE_STEPS, answer: DEEP_DIVE_ANSWER, doneActions: ANSWER_ACTIONS };
}

interface RunRequestBody {
  phase?: Phase;
  script?: RunScript;
  annotationId?: string;
  /** Allocated by 'start' and echoed back by the client on every later phase. */
  commentId?: number;
  /** 0-based index into DEEP_DIVE_STEPS. Required for 'advance'. */
  stepIndex?: number;
  organizationId?: string;
  documentId?: string;
}

function veltHeaders(): HeadersInit | null {
  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY;
  const authToken = process.env.VELT_AUTH_TOKEN;
  if (!apiKey || !authToken) return null;
  return {
    "Content-Type": "application/json",
    "x-velt-api-key": apiKey,
    "x-velt-auth-token": authToken,
  };
}

async function veltPost(url: string, headers: HeadersInit, data: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, json };
}

/**
 * The step list for one push, in the SDK's "replace" authoring pattern: a
 * single-element array whose one entry is `active`. Simplest of the three
 * supported patterns and the right one when we are not building a trace UI.
 */
function stepsForIndex(stepIndex: number, steps: readonly string[]) {
  const label = steps[stepIndex] ?? steps[steps.length - 1];
  return [{ label, state: "active" as const }];
}

export async function POST(request: NextRequest) {
  try {
    const headers = veltHeaders();
    if (!headers) {
      return Response.json(
        { error: "Server missing NEXT_PUBLIC_VELT_API_KEY or VELT_AUTH_TOKEN" },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as RunRequestBody;
    const phase = body.phase;
    const annotationId = body.annotationId;
    const organizationId = body.organizationId ?? SEED_ORGANIZATION_ID;
    const documentId = body.documentId ?? SEED_DOCUMENT_ID;

    if (!annotationId) {
      return Response.json({ error: "annotationId is required" }, { status: 400 });
    }

    const base = { organizationId, documentId, annotationId };
    const { steps, answer, doneActions } = scriptFor(body.script);

    if (phase === "start") {
      // The caller allocates the commentId so every later phase can target the
      // SAME comment. Preserving it (and its createdAt) is what stops the
      // finished answer from jumping to the bottom of the thread when it lands.
      const commentId = Date.now();
      const { ok, status, json } = await veltPost(ADD_COMMENT_URL, headers, {
        ...base,
        comments: [
          {
            commentId,
            from: { ...DEEP_DIVE_AGENT },
            isCommentResolverUsed: false,
            isCommentTextAvailable: true,
            // No commentText / commentHtml: a progress comment must be
            // CONTENT-LESS to be split out of the thread and rendered as a
            // progress row. Adding text here renders BOTH rows instead.
            progress: {
              state: "active",
              steps: stepsForIndex(0, steps),
              startedAt: Date.now(),
            },
            actions: RUNNING_ACTIONS,
          },
        ],
      });
      if (!ok) {
        console.error("[agent-run] start failed", status, json);
        return Response.json({ error: "start failed", status, details: json }, { status: 502 });
      }
      return Response.json({ phase, commentId, totalSteps: steps.length });
    }

    const commentId = body.commentId;
    if (typeof commentId !== "number") {
      return Response.json({ error: "commentId is required for this phase" }, { status: 400 });
    }

    if (phase === "advance") {
      const stepIndex = typeof body.stepIndex === "number" ? body.stepIndex : 0;
      const { ok, status, json } = await veltPost(UPDATE_COMMENT_URL, headers, {
        ...base,
        commentIds: [commentId],
        updatedData: {
          progress: { state: "active", steps: stepsForIndex(stepIndex, steps) },
          actions: RUNNING_ACTIONS,
        },
      });
      if (!ok) {
        console.error("[agent-run] advance failed", status, json);
        return Response.json({ error: "advance failed", status, details: json }, { status: 502 });
      }
      return Response.json({ phase, commentId, stepIndex });
    }

    if (phase === "complete") {
      const { ok, status, json } = await veltPost(UPDATE_COMMENT_URL, headers, {
        ...base,
        commentIds: [commentId],
        updatedData: {
          commentText: answer.text,
          commentHtml: answer.html,
          // 'completed' is written explicitly rather than by deleting the field:
          // a Firestore merge write cannot remove a key, which is why
          // CommentProgress.state is required rather than presence-based.
          progress: { state: "completed", steps: [{ label: "Done", state: "completed" }] },
          actions: doneActions,
        },
      });
      if (!ok) {
        console.error("[agent-run] complete failed", status, json);
        return Response.json({ error: "complete failed", status, details: json }, { status: 502 });
      }
      return Response.json({ phase, commentId });
    }

    if (phase === "cancel") {
      // An explicit terminal state, which is faster and more accurate than
      // waiting for the SDK's staleness fail-safe (default 10 min).
      const { ok, status, json } = await veltPost(UPDATE_COMMENT_URL, headers, {
        ...base,
        commentIds: [commentId],
        updatedData: {
          progress: { state: "cancelled", steps: [{ label: "Stopped", state: "failed" }] },
          actions: [],
        },
      });
      if (!ok) {
        console.error("[agent-run] cancel failed", status, json);
        return Response.json({ error: "cancel failed", status, details: json }, { status: 502 });
      }
      return Response.json({ phase, commentId });
    }

    return Response.json({ error: `unknown phase '${phase}'` }, { status: 400 });
  } catch (error) {
    console.error("[agent-run] unexpected error", error);
    return Response.json({ error: "agent run failed" }, { status: 500 });
  }
}
