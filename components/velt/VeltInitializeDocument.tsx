"use client";

import { useEffect } from "react";
import { useCurrentUser, useSetDocuments } from "@veltdev/react";
import { setDocumentsConfigByUserId } from "./users";
import { SetDocumentsRequestOptions } from "@veltdev/types";

// [Velt] Initialize Velt document
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

    // A `?documentId=` in the URL overrides the configured id, for an isolated doc
    const override = new URLSearchParams(window.location.search).get("documentId");

    setDocuments(
      cfg.documents.map((doc) => ({
        id: override ?? doc.id,
        metadata: { documentName: override ? `Run ${override}` : doc.name },
      })),
      options,
    );
  }, [setDocuments, userId]);

  return null;
}
