"use client";

// [Velt] Access Context tagger for new comments.
//
// The customer's authoritative feature-level access layer works like this:
//   1. Every comment is tagged at creation with `context.access.catalogId`.
//   2. `permissionProvider.isContextEnabled: true` makes Velt ask the Permission
//      Provider whether a user may see each catalog's feature data.
//   3. Because other features inherit a comment's context, NOTIFICATIONS for that
//      comment are automatically filtered by the same catalog — this is the key
//      driver for them: the notification bell is global/cross-document, so without
//      context filtering a user could be notified about catalogs they can't see.
//
// Here we attach the context when a comment annotation is added, using the active
// catalog chosen in the header. Per the docs, pass a string/number (NOT an array)
// at creation time.
//
// Docs: https://velt.dev/docs/key-concepts/overview#d-set-feature-level-permissions-using-access-context

import { useEffect } from "react";
import { useCommentEventCallback } from "@veltdev/react";
import { useActiveCatalog } from "./CatalogContext";
import { CATALOG_ACCESS_FIELD } from "./accessModel";

export default function CommentContextTagger() {
  const addEvent = useCommentEventCallback("addCommentAnnotation");
  const { activeCatalogId } = useActiveCatalog();

  useEffect(() => {
    if (!addEvent?.addContext) return;
    // Tag the just-added annotation with the active catalog. Notifications for
    // this comment inherit the same access context automatically.
    addEvent.addContext({
      access: {
        [CATALOG_ACCESS_FIELD]: activeCatalogId,
      },
    });
    // `activeCatalogId` intentionally omitted: we tag with the catalog that was
    // active WHEN the comment was created (the event fires once per add).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvent]);

  return null;
}
