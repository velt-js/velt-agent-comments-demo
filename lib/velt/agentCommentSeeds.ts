/**
 * Demo agent text-comment payloads for the Altana legal document viewer.
 *
 * Shaped like production Superflow / Velt agent findings: text-anchored
 * suggestions with rich HTML, agent reason metadata, and targetText pins.
 *
 * @see https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature/comment-annotations/add-comment-annotations
 */

import { OPENING_ACTIONS, SUGGESTION_ACTIONS } from "./agentRunScript";

export const SEED_ORGANIZATION_ID = "owner-org-1";
export const SEED_DOCUMENT_ID = "altana-doc-100";

export const SEED_VERSION = "text-v6";

export const DEMO_AGENT_USER = {
  userId: "altana-review-agent",
  name: "Altana Review Agent",
  email: "agents@altana.demo",
} as const;

export const DEMO_AGENT = {
  agentSource: "external",
  agentId: "altana-review-agent",
  agentName: "Altana Review Agent",
} as const;

/**
 * Builds Superflow-style plain text + HTML comment bodies.
 */
function buildAgentCommentContent(options: {
  title: string;
  description: string;
  suggestion: string;
}): { commentText: string; commentHtml: string } {
  const { title, description, suggestion } = options;
  const commentText = `${title}: ${description} — Suggestion: ${suggestion}`;
  const commentHtml =
    `<b>${title}</b><br>${description}<br><br>` +
    `<b>Suggestion:</b> ${suggestion}`;

  return { commentText, commentHtml };
}

const QUALITY_AGREEMENT_TARGET =
  "Quality Agreement (as defined below)";

const ANTI_PHGF_TARGET = "Anti-PHGF Antigen";

export const AGENT_COMMENT_FINDING_IDS = [
  "altana-finding-quality-agreement",
  "altana-finding-anti-phgf",
  "altana-finding-api-source",
] as const;

/*
 * NO IN-FLIGHT SEED — deliberately, after testing it (2026-08-31).
 *
 * A suggestion whose ONLY comment is a content-less progress comment is created
 * successfully on the server but NEVER RENDERS in the normal listener flow: the
 * split empties `annotation.comments`, and the pre-existing empty-annotation drop
 * in `filterUserDraftComments` then removes the annotation entirely. The SDK
 * documents this as EC-006 and logs it (debug-mode only) —
 * `comment.service.ts`: "annotation has only content-less progress comments and
 * will not render until the agent completes".
 *
 * So the in-flight card is only reachable when the annotation is mounted
 * EXPLICITLY by id (`<VeltCommentThread annotationId=… />`), which is what the
 * harness spec TC1162 does. Seeding one here would put a card in the client demo
 * that silently never appears — worse than not demoing it.
 *
 * The demonstrable half is AC-061: a suggestion card WITH content plus a live
 * progress row. That is the "Re-analyze" chip.
 */

const API_SOURCE_TARGET = "Active Pharmaceutical Ingredient (API)";

export const AGENT_COMMENT_SEEDS = [
  {
    type: "suggestion",
    targetElement: {
      targetText: QUALITY_AGREEMENT_TARGET,
      occurrence: 1,
      selectAllContent: false,
    },
    commentData: [
      {
        ...buildAgentCommentContent({
          title: "Missing definition",
          description:
            'Section 1 references the "Quality Agreement (as defined below)", but Section 2 does not define "Quality Agreement". The incorporated agreement is therefore unidentified.',
          suggestion:
            "Add a Quality Agreement definition in Section 2 or cross-reference the executed quality agreement exhibit.",
        }),
        from: {
          userId: DEMO_AGENT_USER.userId,
          name: DEMO_AGENT_USER.name,
          email: DEMO_AGENT_USER.email,
        },
        isCommentResolverUsed: false,
        isCommentTextAvailable: true,
        agent: {
          ...DEMO_AGENT,
          executionId: `${SEED_VERSION}-001`,
          url: "/",
          reason: {
            findingId: AGENT_COMMENT_FINDING_IDS[0],
            findingType: "text",
            title: "Missing definition",
            description:
              'Section 1 references the "Quality Agreement (as defined below)", but Section 2 does not define "Quality Agreement".',
            severity: "medium",
            suggestion:
              "Add a Quality Agreement definition in Section 2 or cross-reference the executed quality agreement exhibit.",
            htmlSnippet: `<span>${QUALITY_AGREEMENT_TARGET}</span>`,
            htmlSelector: ".hv-doc-page h5 + p.hv-doc-line",
            issueType: "definition",
            confidence: 96,
            source: "instructions",
          },
        },
      },
    ],
  },
  {
    type: "suggestion",
    targetElement: {
      targetText: ANTI_PHGF_TARGET,
      occurrence: 1,
      selectAllContent: false,
    },
    commentData: [
      {
        ...buildAgentCommentContent({
          title: "Inconsistent defined term",
          description:
            'Section 2.2 defines "Anti-PHGF Antigen" as a PDGF-based growth factor, but the acronym "PHGF" does not match "PDGF" used in the definition.',
          suggestion:
            'Confirm the intended defined term and align the label with the underlying growth factor (for example, "Anti-PDGF Antigen").',
        }),
        from: {
          userId: DEMO_AGENT_USER.userId,
          name: DEMO_AGENT_USER.name,
          email: DEMO_AGENT_USER.email,
        },
        isCommentResolverUsed: false,
        isCommentTextAvailable: true,
        // CUSTOM accept/reject on this card only. The SDK retires its built-in
        // buttons as soon as any action list is declared, so this card is driven
        // entirely by the host — while the "Missing definition" seed below keeps
        // Velt's built-ins, giving a side-by-side comparison in one document.
        actions: SUGGESTION_ACTIONS,
        agent: {
          ...DEMO_AGENT,
          executionId: `${SEED_VERSION}-002`,
          url: "/",
          reason: {
            findingId: AGENT_COMMENT_FINDING_IDS[1],
            findingType: "text",
            title: "Inconsistent defined term",
            description:
              'The defined term "Anti-PHGF Antigen" is described as a PDGF bispecific growth factor, creating acronym ambiguity in the definitions section.',
            severity: "high",
            suggestion:
              'Confirm the intended defined term and align the label with the underlying growth factor (for example, "Anti-PDGF Antigen").',
            htmlSnippet: `<span>“${ANTI_PHGF_TARGET}” means</span>`,
            htmlSelector: ".hv-doc-page .hv-doc-line:nth-of-type(7)",
            issueType: "terminology",
            confidence: 98,
            source: "instructions",
          },
        },
      },
    ],
  },
  {
    /**
     * The THIRD finding, and the only one that is NOT a suggestion.
     *
     * `type` is deliberately omitted (so it persists as a normal comment) because
     * customer action chips mount on THREAD ROWS and PROGRESS ROWS only —
     * `velt-comment-dialog-actions-internal` appears in exactly two SDK templates
     * (`comment-dialog-thread-card` and `comment-dialog-progress`) and NOT in the
     * suggestion card, whose footer renders only the built-in accept/reject.
     * A suggestion-typed annotation takes the whole dialog over, so chips placed
     * on it would never render. Keeping the two findings above as suggestions and
     * this one as a conversation is also the truer product story: a finding is
     * something you accept or reject; a deep dive is something you talk to.
     */
    targetElement: {
      targetText: API_SOURCE_TARGET,
      occurrence: 1,
      selectAllContent: false,
    },
    commentData: [
      {
        commentText:
          'Unverified source: Section 2.3 defers the API definition to the Quality Agreement, ' +
          'which this document never defines. I can trace every reference if you want the full picture.',
        commentHtml:
          '<b>Unverified source</b><br>Section 2.3 defers the API definition to the Quality Agreement, ' +
          'which this document never defines.<br><br>I can trace every reference if you want the full picture.',
        from: {
          userId: DEMO_AGENT_USER.userId,
          name: DEMO_AGENT_USER.name,
          email: DEMO_AGENT_USER.email,
        },
        isCommentResolverUsed: false,
        isCommentTextAvailable: true,
        // The demo's entry point. Clicking "Dig Deeper" fires `commentActionClicked`,
        // which AgentRunController turns into a real backend run.
        actions: OPENING_ACTIONS,
        agent: {
          ...DEMO_AGENT,
          executionId: `${SEED_VERSION}-003`,
          url: "/",
          reason: {
            findingId: AGENT_COMMENT_FINDING_IDS[2],
            findingType: "text",
            title: "Unverified source",
            description:
              'Section 2.3 defers the API definition to an undefined Quality Agreement.',
            severity: "medium",
            suggestion: "Define the Quality Agreement or attach the executed exhibit.",
            htmlSnippet: `<span>${API_SOURCE_TARGET}</span>`,
            htmlSelector: ".hv-doc-page .hv-doc-line:last-of-type",
            issueType: "definition",
            confidence: 91,
            source: "instructions",
          },
        },
      },
    ],
  },
] as const;

export const AGENT_COMMENT_SEED_COUNT = AGENT_COMMENT_SEEDS.length;
