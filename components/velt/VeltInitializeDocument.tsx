"use client";

import { useEffect } from "react";
import { useCurrentUser, useSetDocuments } from "@veltdev/react";
import { setDocumentsConfigByUserId } from "./users";
import { SetDocumentsRequestOptions } from "@veltdev/types";

// [Velt] Initialize Velt document.
//
// We wait for `useCurrentUser` to emit so we know which user is signed in,
// then call setDocuments with the per-user config from users.ts. This lets
// User 2 (in customer-org-1) be scoped onto a document inside owner-org-1
// via the optional `organizationId` option, exercising the cross-org
// Permission Provider path.
export default function VeltInitializeDocument() {
  const currentUser = useCurrentUser();
  const userId = currentUser?.userId;

  const { setDocuments } = useSetDocuments();

  useEffect(() => {
    if (!userId) return;
    const cfg = setDocumentsConfigByUserId[userId];
    if (!cfg) return;

    const options: SetDocumentsRequestOptions = {
      optimisticPermissions: false,
    };
    if (cfg.organizationId) options.organizationId = cfg.organizationId;

    setDocuments(
      cfg.documents.map((doc) => ({
        id: doc.id,
        metadata: { documentName: doc.name },
      })),
      options,
    );
  }, [setDocuments, userId]);

  return null;
}
