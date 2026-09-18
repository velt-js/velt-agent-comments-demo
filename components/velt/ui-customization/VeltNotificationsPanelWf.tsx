"use client";

import { VeltData, VeltIf, VeltNotificationsPanelWireframe } from "@veltdev/react";

const DocumentItem = VeltNotificationsPanelWireframe.Content.Documents.List.Item;

// Registered at the VeltWireframe root. Only the document row's count changes:
// the design shows a blue dot and "2 New" where Velt writes "2 Unread"
export function VeltNotificationsPanelWf() {
    return (
        <DocumentItem.Count>
            <VeltIf condition="{document.unreadNotificationsCount} > 0">
                <span className="vc-notif-new">
                    <span className="vc-notif-new-dot" aria-hidden="true" />
                    <VeltData field="document.unreadNotificationsCount" /> New
                </span>
            </VeltIf>
        </DocumentItem.Count>
    );
}

export default VeltNotificationsPanelWf;
