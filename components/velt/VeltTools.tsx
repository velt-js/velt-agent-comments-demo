"use client";
import { VeltSidebarButton, VeltNotificationsTool } from "@veltdev/react";

function VeltTools() {
  return (
    <>
      <VeltNotificationsTool enableCrossOrganization={true} />
      <VeltSidebarButton />
    </>
  );
}

export default VeltTools;
