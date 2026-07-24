/**
 * Demo agent text-comment payloads for the Altana legal document viewer.
 *
 * Shaped like production Superflow / Velt agent findings: text-anchored
 * suggestions with rich HTML, agent reason metadata, and targetText pins.
 *
 * @see https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature/comment-annotations/add-comment-annotations
 */

export const SEED_ORGANIZATION_ID = "owner-org-1";
export const SEED_DOCUMENT_ID = "altana-doc-7";

// Access Context (catalog) each seeded finding is tagged with. This lets the
// seeded agent comments demonstrate feature-level filtering: a user only sees a
// finding if their catalogAccess (see components/velt/accessModel.ts) includes
// its catalog. finding #1 → APAC, finding #2 → EMEA.
export const SEED_CATALOG_FIELD = "catalogId";
const SEED_CATALOG_APAC = "catalog-apac";
const SEED_CATALOG_EMEA = "catalog-emea";

// Bumped whenever the seed content OR its context changes so the client re-seeds.
export const SEED_VERSION = "text-v4-context";

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
] as const;

export const AGENT_COMMENT_SEEDS = [
  {
    type: "suggestion",
    // Access Context tag → only users with APAC catalog access see this finding.
    context: {
      access: {
        [SEED_CATALOG_FIELD]: SEED_CATALOG_APAC,
      },
    },
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
    // Access Context tag → only users with EMEA catalog access see this finding.
    context: {
      access: {
        [SEED_CATALOG_FIELD]: SEED_CATALOG_EMEA,
      },
    },
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
] as const;

export const AGENT_COMMENT_SEED_COUNT = AGENT_COMMENT_SEEDS.length;
