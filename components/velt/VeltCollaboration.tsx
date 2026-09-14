"use client";

import { VeltComments } from "@veltdev/react";
import VeltInitializeDocument from "./VeltInitializeDocument";
import VeltUnstyledMode from "./VeltUnstyledMode";
import SeedAgentComments from "./SeedAgentComments";
import { AgentRunController } from "./AgentRunController";
import { ContactsRegistrar } from "./ContactsRegistrar";
import { VeltCustomization } from "./ui-customization";
import { CommentsPanel } from "./CommentsPanel";

// [Velt] Mounts the comments feature, the UI customization and the host drawer.
export function VeltCollaboration({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (updater: (open: boolean) => boolean) => void;
}) {
  return (
    <>
      <VeltUnstyledMode /> {/* [Velt] Author against the unstyled DOM */}
      <VeltInitializeDocument /> {/* [Velt] Initialize the document */}
      <SeedAgentComments /> {/* Seeds the demo's agent findings */}
      <AgentRunController /> {/* Turns action-chip clicks into backend writes */}
      <ContactsRegistrar /> {/* Registers the demo's @mention contacts */}
      <VeltComments
        shadowDom={false}
        popoverMode={true}
        commentPlaceholder="Comment or tag others with @"
        replyPlaceholder="Reply"
        paginatedContactList={true}
        visibilityOptions={true}
        /* the design draws the composer's assign control as a checkbox */
        assignToType="checkbox"
      />
      <VeltCustomization /> {/* [Velt] Customize the UI */}
      <CommentsPanel open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  );
}

export default VeltCollaboration;
