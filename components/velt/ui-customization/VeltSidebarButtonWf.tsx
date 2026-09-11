"use client";

import { VeltSidebarButtonWireframe } from "@veltdev/react";
import { VcChatTeardropIcon, VcChatTeardropOutlineIcon } from "./VcIcons";

// ═══ surface-sidebar-button ═══════════════════════════════════════════════════
//
//   design: "Passport Manager + Comments V2 side sheet open" (2:7495) →
//           View → Page Header → App Header → Actions → the comments control,
//           drawn as a bare dark chat-bubble glyph with a small blue dot at its
//           top-right. No plate, no border, no background — unlike every other
//           chip in that row.
//
// This surface did not exist before. The app bar carried a HOST `<button
// className="hw-sidebar-toggle">` — a 34x34 beige rounded square holding a
// panel-toggle glyph — whose own stylesheet comment said "custom button, not the
// Velt SDK button, since the sidebar is embedded". That reasoning does not hold:
// `VeltSidebarButton` renders wherever it is mounted and `VeltSidebarButtonWireframe`
// replaces its entire template, so the embedded sidebar is no obstacle to using
// the real component — and using it is the point of this demo.
//
// ── What each slot is for
// `Icon`       — the glyph. Declared WITH our own child, which is what replaces
//                Velt's default bubble with the design's.
// `UnreadIcon` — the blue dot. SELF-GATING: Velt renders it only while the
//                current user has unread comments, so it costs nothing when
//                everything is read and no `VeltIf` of ours is needed.
// `CommentsCount` is deliberately NOT mounted — the design draws a dot, not a
// number, and an undeclared slot is dropped rather than defaulted back in (R7:
// omit, never `display: none`).
//
// ── Why the dot is OUR element and not Velt's own
// `UnreadIcon` is declared with a child span rather than left childless: left
// childless Velt paints its default indicator, which is a filled circle in its
// own blue at its own size. The design's is 8px `#0589ff` — the same token the
// sidebar cards' unread dot uses (`--vc-unread-dot`) — so supplying the element
// keeps one unread colour across the whole product.
export function VeltSidebarButtonWf() {
  return (
    <VeltSidebarButtonWireframe>
      <span className="hw-sb-btn">
        {/* BOTH weights, one shown at a time. Design 37:20702 gives this control
            two states — the teardrop is OUTLINED while the panel is shut and
            SOLID once it is open — and the state lives on the host wrapper
            (`.hw-sidebar-toggle--active`, driven by the same `sidebarOpen` that
            moves the rail), so the swap is a CSS one and neither glyph needs a
            `VeltIf`. Rendering both is what lets the switch be pure CSS: the
            wireframe has no access to the host's open state. */}
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
