"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";
import { VcDotsThreeIcon } from "./VcIcons";

// ══ fam-comment-dialog-options-drodpwon / surface-options-menu ═══════════════
//
//   figma 872:22294 (states board) · 872:22362 (flows board, anchored inside the
//   358px popover at 113,37) · 890:23213 (app context)
//   THREE rows, in this order:  Mark as Unread · Copy Link · Delete
//
// The THREAD-level options dropdown, nested inside every comment-dialog variant
// that needs it (the floating popover's header and the focused thread's header),
// never registered at the VeltWireframe root — a root-level registration would
// become a global key and shadow the nested copies ("don't register the same
// component both ways", wireframes.md §3).
//
// Mounted on the ROOT-LEVEL `Options` slot (NOT `ThreadCard.Options`): this is the
// one kebab per THREAD. The per-COMMENT kebab is a different slot and lives in
// VcCommentActions.tsx.
//
// ── Why this is now exactly the design's three rows ──────────────────────────
// It used to carry a fourth row, `Assign to me`, added as a workaround while the
// native assignee picker was believed to be broken. Both halves of that decision
// are now settled by the designers in Figma:
//
//   #5  (pinned on this very dropdown) — "I think whatever default options Velt
//       has for this kind of action is good with us, this is just illustrative."
//   #10 — "For Assigning Comment, should it be from Three dot menu, or through
//       composer?" → Imogen Todd: "I think through the COMPOSER would make
//       sense." Rakesh Goyal then linked two live builds where Velt's own
//       composer assign UI works, and Imogen picked one.
//
// So assignment moves to the composer (`Composer.AssignUser`, see
// VeltComposerWf.tsx) and this menu goes back to the three rows the frame draws.
// The host-side `assignUser()` bridge that backed the old row is gone with it.
//
// `Edit` is not here either: it is per-comment, and #7 puts it on the comment's
// own hover kebab.

export function VcOptionsMenu() {
    return (
        <VeltCommentDialogWireframe.Options className="vc-options">
            <VeltCommentDialogWireframe.Options.Trigger className="vc-options-trigger">
                <VcDotsThreeIcon />
            </VeltCommentDialogWireframe.Options.Trigger>
            {/* Options.Content — THIS is the floating 200px menu surface that
                carries the chrome (R23/M2b): never .vc-options, never the trigger. */}
            <VeltCommentDialogWireframe.Options.Content className="vc-options-menu">
                {/* MarkAsRead is the SDK's toggle host; its label is our own text.
                    (The previous build wrapped this in a hand-written
                    `velt-comment-dialog-options-dropdown-content-mark-as-read-mark-unread-wireframe`
                    element taken from a stale slot list — that tag is NOT in the
                    6.0.11 registry, so it rendered as inert markup that happened to
                    pass the label through. Removed; the label now sits directly in
                    the real slot.) */}
                <VeltCommentDialogWireframe.Options.Content.MarkAsRead className="vc-menu-item-markasread">
                    <span className="vc-menu-label">Mark as Unread</span>
                </VeltCommentDialogWireframe.Options.Content.MarkAsRead>
                <VeltCommentDialogWireframe.CopyLink className="vc-menu-item-copylink">
                    <span className="vc-menu-label">Copy Link</span>
                </VeltCommentDialogWireframe.CopyLink>
                {/* Delete renders NOTHING unless its canonical sub-slots are declared
                    (live-verified: bare `Delete` + a child span → 0x0, empty). The SDK
                    picks Comment vs Thread per annotation, so both are declared and each
                    carries the design's single "Delete" label — only one ever renders. */}
                <VeltCommentDialogWireframe.Options.Content.Delete className="vc-menu-item-delete">
                    <VeltCommentDialogWireframe.Options.Content.Delete.Thread>
                        <span className="vc-menu-label">Delete</span>
                    </VeltCommentDialogWireframe.Options.Content.Delete.Thread>
                    <VeltCommentDialogWireframe.Options.Content.Delete.Comment>
                        <span className="vc-menu-label">Delete</span>
                    </VeltCommentDialogWireframe.Options.Content.Delete.Comment>
                </VeltCommentDialogWireframe.Options.Content.Delete>
            </VeltCommentDialogWireframe.Options.Content>
        </VeltCommentDialogWireframe.Options>
    );
}

export default VcOptionsMenu;
