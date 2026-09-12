"use client";

import { VeltSidebarButtonWireframe } from "@veltdev/react";
import { VcChatTeardropIcon, VcChatTeardropOutlineIcon } from "./VcIcons";

// The app bar's comments toggle. Uses the real SDK button rather than a host one
// so the unread state comes for free.
//
// `Icon` carries our own glyph, which is what replaces Velt's default bubble.
// `UnreadIcon` self-gates — Velt renders it only while the signed-in user has
// unread comments — and is given our own 8px dot so the unread blue matches the
// sidebar cards'. `CommentsCount` is not mounted: the design draws a dot, not a
// number.
export function VeltSidebarButtonWf() {
  return (
    <VeltSidebarButtonWireframe>
      <span className="hw-sb-btn">
        {/* Both weights render and CSS picks one: the design outlines the
            teardrop while the panel is shut and fills it once open, and that
            state lives on the host wrapper, which a wireframe can't read. */}
        <VeltSidebarButtonWireframe.Icon className="hw-sb-icon">
          <span className="hw-sb-glyph hw-sb-glyph--outline">
            <VcChatTeardropOutlineIcon />
          </span>
          <span className="hw-sb-glyph hw-sb-glyph--fill">
            <VcChatTeardropIcon />
          </span>
        </VeltSidebarButtonWireframe.Icon>
        <VeltSidebarButtonWireframe.UnreadIcon className="hw-sb-unread">
          <span className="hw-sb-dot" aria-hidden="true" />
        </VeltSidebarButtonWireframe.UnreadIcon>
      </span>
    </VeltSidebarButtonWireframe>
  );
}

export default VeltSidebarButtonWf;
