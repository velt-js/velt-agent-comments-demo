/**
 * Demo agent comment payloads for the Altana legal document viewer.
 *
 * Replace these hard-coded findings with output from your agent pipeline in
 * production. Each entry becomes one `type: "suggestion"` annotation via the
 * Velt Add Comment Annotations REST API.
 *
 * @see https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature/comment-annotations/add-comment-annotations
 */

export const SEED_ORGANIZATION_ID = "owner-org-1";
export const SEED_DOCUMENT_ID = "altana-doc-7";

export const DEMO_AGENT = {
  agentSource: "external",
  agentName: "Contract Review Agent",
  agentId: "contract-review-agent",
} as const;

export const AGENT_COMMENT_SEEDS = [
  {
    type: "suggestion",
    commentData: [
      {
        commentText:
          "Section 2.2 defines “Anti-PHGF Antigen” as a PDGF-based growth factor — the acronyms don't match. Confirm whether the defined term should be “Anti-PDGF Antigen”.",
        from: { userId: DEMO_AGENT.agentId, name: DEMO_AGENT.agentName },
        agent: {
          ...DEMO_AGENT,
          executionId: "run_demo_001",
          reason: {
            title: "Inconsistent defined term",
            description:
              "The defined term “Anti-PHGF Antigen” is described as a PDGF bispecific growth factor. Mismatched acronyms in definitions create ambiguity in scope.",
            severity: "high",
            findingType: "text",
          },
        },
      },
    ],
  },
  {
    type: "suggestion",
    commentData: [
      {
        commentText:
          'Section 1 incorporates the “Quality Agreement (as defined below)”, but no definition of “Quality Agreement” appears in Section 2. Add the definition or a cross-reference.',
        from: { userId: DEMO_AGENT.agentId, name: DEMO_AGENT.agentName },
        agent: {
          ...DEMO_AGENT,
          executionId: "run_demo_002",
          reason: {
            title: "Missing definition",
            description:
              "A term referenced with “as defined below” has no corresponding definition, leaving the incorporated Quality Agreement unidentified.",
            severity: "medium",
            findingType: "text",
          },
        },
      },
    ],
  },
] as const;

export const AGENT_COMMENT_SEED_COUNT = AGENT_COMMENT_SEEDS.length;
