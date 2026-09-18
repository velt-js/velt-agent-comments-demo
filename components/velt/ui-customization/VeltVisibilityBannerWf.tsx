"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";
import { ChevronDownIcon, LockIcon } from "./icons";

const Banner = VeltCommentDialogWireframe.VisibilityBanner;

// Registered at the VeltWireframe root, not inside the dialog: the banner itself
// stays Velt's (it also hosts the Selected People / Teams pickers), and only
// these two pieces take the design's markup.
export function VeltVisibilityBannerWf() {
    return (
        <>
            <Banner.Icon>
                <LockIcon />
            </Banner.Icon>
            <Banner.Dropdown.Trigger>
                <Banner.Dropdown.Trigger.Label />
                <Banner.Dropdown.Trigger.Icon>
                    <ChevronDownIcon />
                </Banner.Dropdown.Trigger.Icon>
            </Banner.Dropdown.Trigger>
        </>
    );
}

export default VeltVisibilityBannerWf;
