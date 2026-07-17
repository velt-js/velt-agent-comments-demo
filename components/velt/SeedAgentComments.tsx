"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@veltdev/react";
import { setDocumentsConfigByUserId, users } from "./users";

const AGENT_COMMENTS_ENDPOINT = "/api/velt/agent-comments";

/**
 * Builds a sessionStorage key so seeding runs once per org/document per tab.
 */
function buildSeedSessionKey(
  organizationId: string,
  documentId: string,
): string {
  return `velt-agent-seeds:${organizationId}:${documentId}`;
}

/**
 * Triggers demo agent comment seeding after the signed-in user lands on a document.
 *
 * The Next.js API route calls Velt's REST API server-side — no curl or manual
 * steps required for client demos.
 */
export default function SeedAgentComments() {
  const currentUser = useCurrentUser();
  const userId = currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const seedAgentComments = async () => {
      try {
        const userConfig = setDocumentsConfigByUserId[userId];
        const userRecord = users[userId];
        const primaryDocument = userConfig?.documents?.[0];

        if (!userConfig || !userRecord || !primaryDocument) {
          return;
        }

        const organizationId =
          userConfig.organizationId ?? userRecord.organizationId;
        const documentId = primaryDocument.id;
        const sessionKey = buildSeedSessionKey(organizationId, documentId);

        if (sessionStorage.getItem(sessionKey) === "done") {
          return;
        }

        const response = await fetch(AGENT_COMMENTS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organizationId, documentId }),
        });

        if (!response.ok) {
          console.warn(
            "[SeedAgentComments] seed request failed",
            response.status,
          );
          return;
        }

        sessionStorage.setItem(sessionKey, "done");
      } catch (error) {
        console.warn("[SeedAgentComments] seed request error", error);
      }
    };

    void seedAgentComments();
  }, [userId]);

  return null;
}
