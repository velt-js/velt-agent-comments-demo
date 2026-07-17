// [Velt] Agent comments seeder.
//
// POST /api/velt/agent-comments adds demo agent findings to a document via
// Velt's Add Comment Annotations REST API. Called automatically from the app
// after sign-in (see components/velt/SeedAgentComments.tsx).
//
// Docs: https://velt.dev/docs/ai/agent-comments
//
// NOTE (self-hosting): when comment data providers point at your own backend,
// REST-created comments must set isCommentResolverUsed and isCommentTextAvailable.
// See https://docs.velt.dev/self-host-data/comments

import type { NextRequest } from "next/server";
import {
  AGENT_COMMENT_FINDING_IDS,
  AGENT_COMMENT_SEEDS,
  SEED_DOCUMENT_ID,
  SEED_ORGANIZATION_ID,
} from "@/lib/velt/agentCommentSeeds";

const VELT_ADD_ANNOTATIONS_URL =
  "https://api.velt.dev/v2/commentannotations/add";
const VELT_GET_ANNOTATIONS_URL =
  "https://api.velt.dev/v2/commentannotations/get";

interface SeedRequestBody {
  organizationId?: string;
  documentId?: string;
  force?: boolean;
}

interface VeltCredentials {
  apiKey: string;
  authToken: string;
}

/**
 * Builds Velt REST API auth headers for server-side calls.
 */
function buildVeltHeaders(credentials: VeltCredentials): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-velt-api-key": credentials.apiKey,
    "x-velt-auth-token": credentials.authToken,
  };
}

/**
 * Reads Velt API credentials from server environment variables.
 */
function getVeltCredentials(): VeltCredentials | null {
  try {
    const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY;
    const authToken = process.env.VELT_AUTH_TOKEN;
    if (!apiKey || !authToken) {
      return null;
    }
    return { apiKey, authToken };
  } catch {
    return null;
  }
}

/**
 * Returns true when the document already has the current demo text findings.
 */
async function hasExistingAgentComments(
  credentials: VeltCredentials,
  organizationId: string,
  documentId: string,
): Promise<boolean> {
  try {
    const response = await fetch(VELT_GET_ANNOTATIONS_URL, {
      method: "POST",
      headers: buildVeltHeaders(credentials),
      body: JSON.stringify({
        data: {
          organizationId,
          documentId,
          agentComments: true,
        },
      }),
    });

    const json = (await response.json().catch(() => null)) as {
      result?: { data?: unknown[] };
    } | null;

    if (!response.ok) {
      return false;
    }

    const annotations = json?.result?.data;
    if (!Array.isArray(annotations)) {
      return false;
    }

    const findingIds = new Set<string>();

    for (const annotation of annotations) {
      if (typeof annotation !== "object" || annotation === null) {
        continue;
      }

      const record = annotation as {
        agent?: { reason?: { findingId?: string } };
        comments?: Array<{ agent?: { reason?: { findingId?: string } } }>;
      };

      const rootFindingId = record.agent?.reason?.findingId;
      if (rootFindingId) {
        findingIds.add(rootFindingId);
      }

      for (const comment of record.comments ?? []) {
        const commentFindingId = comment.agent?.reason?.findingId;
        if (commentFindingId) {
          findingIds.add(commentFindingId);
        }
      }
    }

    return AGENT_COMMENT_FINDING_IDS.every((findingId) =>
      findingIds.has(findingId),
    );
  } catch {
    return false;
  }
}

/**
 * Seeds hard-coded agent comment annotations on the target document.
 */
async function seedAgentComments(
  credentials: VeltCredentials,
  organizationId: string,
  documentId: string,
) {
  const response = await fetch(VELT_ADD_ANNOTATIONS_URL, {
    method: "POST",
    headers: buildVeltHeaders(credentials),
    body: JSON.stringify({
      data: {
        organizationId,
        documentId,
        createOrganizationIfNotExists: true,
        createDocumentIfNotExists: true,
        commentAnnotations: AGENT_COMMENT_SEEDS,
      },
    }),
  });

  const json = await response.json().catch(() => null);
  return { response, json };
}

/**
 * POST /api/velt/agent-comments
 *
 * Idempotently adds demo agent findings for client integration demos.
 */
export async function POST(request: NextRequest) {
  try {
    const credentials = getVeltCredentials();
    if (!credentials) {
      return Response.json(
        { error: "Server missing NEXT_PUBLIC_VELT_API_KEY or VELT_AUTH_TOKEN" },
        { status: 500 },
      );
    }

    let organizationId = SEED_ORGANIZATION_ID;
    let documentId = SEED_DOCUMENT_ID;
    let force = false;

    try {
      const payload = (await request.json()) as SeedRequestBody;
      organizationId = payload.organizationId ?? organizationId;
      documentId = payload.documentId ?? documentId;
      force = payload.force ?? false;
    } catch {
      // Empty body is fine — defaults apply.
    }

    const alreadySeeded =
      !force &&
      (await hasExistingAgentComments(
        credentials,
        organizationId,
        documentId,
      ));

    if (alreadySeeded) {
      return Response.json({
        seeded: false,
        reason: "already-seeded",
        organizationId,
        documentId,
      });
    }

    const { response, json } = await seedAgentComments(
      credentials,
      organizationId,
      documentId,
    );

    if (!response.ok) {
      console.error("[velt-agent-comments] Velt API rejected request", {
        status: response.status,
        body: json,
      });
      return Response.json(
        {
          error: "Velt agent comment creation failed",
          upstreamStatus: response.status,
          details: json,
        },
        { status: 502 },
      );
    }

    return Response.json({
      seeded: true,
      organizationId,
      documentId,
      result: json,
    });
  } catch (error) {
    console.error("[velt-agent-comments] Unexpected error", error);
    return Response.json(
      { error: "Failed to seed agent comments" },
      { status: 500 },
    );
  }
}
