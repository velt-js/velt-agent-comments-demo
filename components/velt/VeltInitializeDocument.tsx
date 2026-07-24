"use client";

import { useEffect } from "react";
import { useCurrentUser, useSetDocuments } from "@veltdev/react";
import { setDocumentsConfigByUserId } from "./users";
import { CATALOG_ACCESS_FIELD } from "./accessModel";
import { SetDocumentsRequestOptions } from "@veltdev/types";

// [Velt] Initialize Velt document.
//
// We wait for `useCurrentUser` to emit so we know which user is signed in, then
// call setDocuments with the per-user config derived from the access model. This
// call exercises three access-control features at once:
//
//   • organizationId — lets a customer-org-1 guest (User 2/4) be scoped onto a
//     document that lives in owner-org-1, forcing a cross-org Permission Provider
//     check.
//   • folderId — subscribes within a folder, so the resource hierarchy
//     (Organization → Folder → Document) is exercised and folder grants matter.
//   • context.access.catalogId — the Access Context. Values are passed as an
//     ARRAY; Velt converts each value into its own `type: "context"` permission
//     request, and only fetches comments whose catalog the user can access.
//     (Requires permissionProvider.isContextEnabled: true — see app/page.tsx.)
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
    if (cfg.folderId) options.folderId = cfg.folderId;
    if (cfg.catalogs.length > 0) {
      // Filter comments by the catalogs this user is allowed to see. Each value
      // becomes a separate context permission request to the Permission Provider.
      options.context = {
        access: {
          [CATALOG_ACCESS_FIELD]: cfg.catalogs,
        },
      };
    }

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
