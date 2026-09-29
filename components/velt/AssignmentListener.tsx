"use client";

import { useEffect, useEffectEvent } from "react";
import { useCommentEventCallback } from "@veltdev/react";
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
  // Each hook returns the latest event of its kind, or null before the first one.
  // A new comment or reply. A new thread fires this too, right after
  // addCommentAnnotation and with the same flag, so addCommentAnnotation is left
  // out: listening to both would handle one assignment twice.
  const addCommentEvent = useCommentEventCallback("addComment");
  // An edited comment
  const updateCommentEvent = useCommentEventCallback("updateComment");

  // Reads the latest onAssigneeChanged without making it an effect dependency,
  // so each event is handled exactly once
  const handle = useEffectEvent(
    (eventName: "addComment" | "updateComment", event: AddCommentEvent | UpdateCommentEvent) => {
      // Demo logging: every add or edit, so the payload can be inspected in the console
      console.log(`[Velt] ${eventName}`, {
        annotationId: event.annotationId,
        isAssigneeChanged: event.isAssigneeChanged,
        event,
      });
      if (!event.isAssigneeChanged) return;

      const assignee = event.commentAnnotation?.assignedTo;
      const context = event.commentAnnotation?.context;
      // Demo logging: this event assigned someone new, or removed the assignee
      console.log(
        `[Velt] ${eventName}: assignee changed to`,
        assignee ? assignee.name || assignee.email || assignee.userId : "nobody (removed)",
        { annotationId: event.annotationId, assignee, context },
      );

      onAssigneeChanged({ annotationId: event.annotationId, context, assignee });
    },
  );

  // Runs once per new event object
  useEffect(() => {
    if (addCommentEvent) handle("addComment", addCommentEvent);
  }, [addCommentEvent]);

  useEffect(() => {
    if (updateCommentEvent) handle("updateComment", updateCommentEvent);
  }, [updateCommentEvent]);

  return null;
}

export default AssignmentListener;
