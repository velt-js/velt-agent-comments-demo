"use client";

import { VeltNotificationsToolWireframe } from "@veltdev/react";
import { BellIcon } from "./icons";

const Tool = VeltNotificationsToolWireframe;

// Registered at the VeltWireframe root, so only the glyphs change: the bell
// matches the header's chat icon, and unread is the header's blue dot
export function VeltNotificationsToolWf() {
    return (
        <>
            <Tool.Icon>
                <BellIcon />
            </Tool.Icon>
            <Tool.UnreadIcon>
                <BellIcon />
                <span className="vc-notif-dot" aria-hidden="true" />
            </Tool.UnreadIcon>
        </>
    );
}

export default VeltNotificationsToolWf;
