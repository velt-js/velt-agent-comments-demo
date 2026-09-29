"use client";

import { useEffect } from "react";
import { useVeltClient } from "@veltdev/react";
import type { AddCommentEvent, UpdateCommentEvent, User } from "@veltdev/types";

// What the host app hears when a comment's assignee changes
export interface AssignmentChange {
  annotationId: string;
  // Whatever the comment tool was given, e.g. { productId, productName } for a table cell
  context: unknown;
  // The new assignee, or undefined when the assignee was removed
  assignee: User | undefined;
}

// [Velt] Tells the host app when a comment is assigned or unassigned.
//
// Since SDK 6.0.15 the addComment and updateComment events carry `isAssigneeChanged`:
// true when that comment assigned someone new or removed the assignee. The current
// assignee is on `commentAnnotation.assignedTo`. Everything after that is host app
// logic, passed in as `onAssigneeChanged`.
//
// The event fires in the browser of the person who made the change. To show it to
// everyone, save it through the host app's own backend in `onAssigneeChanged`.
//
// An assignment made on its own, outside a comment, arrives as a separate
// `assignUser` event, which this demo does not listen to.
export function AssignmentListener({
  onAssigneeChanged,
}: {
  onAssigneeChanged: (change: AssignmentChange) => void;
}) {
  const { client } = useVeltClient();

  useEffect(() => {
    const commentElement = client?.getCommentElement();
    if (!commentElement) return;

    const report = (event: AddCommentEvent | UpdateCommentEvent) => {
      if (!event?.isAssigneeChanged) return;
      onAssigneeChanged({
        annotationId: event.annotationId,
        context: event.commentAnnotation?.context,
        assignee: event.commentAnnotation?.assignedTo,
      });
    };

    // A new comment or reply. A new thread fires this too, right after
    // addCommentAnnotation and with the same flag, so addCommentAnnotation is left
    // out: listening to both would handle one assignment twice.
    const added = commentElement.on("addComment").subscribe(report);
    // An edited comment
    const updated = commentElement.on("updateComment").subscribe(report);

    return () => {
      added?.unsubscribe();
      updated?.unsubscribe();
    };
  }, [client, onAssigneeChanged]);

  return null;
}

export default AssignmentListener;
