"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";

// [Velt] The restricted-audience strip (82:14236). Self-gating: nothing renders
// on a thread everyone can see, and the SDK also gates it on the project's
// private-comments flag.
//
// Declared WITHOUT children on purpose. `Content` builds its own four audience
// rows (Me / Selected People / Selected Teams / Everyone) plus the separator and
// the selected tick, and the banner anchors its people and team pickers to the
// trigger from inside that same template — a wireframe of our own would replace
// all of it. So the strip takes its chrome from styles.css instead, keyed on the
// SDK's classes. The design carries no dropdown, so the menu follows the app's
// own menu chrome.
export function VeltVisibilityBannerWf() {
    return <VeltCommentDialogWireframe.VisibilityBanner className="vc-visibility" />;
}

export default VeltVisibilityBannerWf;
