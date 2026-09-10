"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";
import { VcDotsThreeIcon } from "./VcIcons";

// ═══ per-comment hover kebab ══════════════════════════════════════════════════
//
//   890:23218  `Hover Options, my comment` — a 200x90 menu:  Edit · Delete
//   890:23222  text layer: "hover, if my comment"
//   Figma #7:  "Can we add Three Dot menu here as well? So that user can edit or
//              delete specific reply." → Imogen Todd: "I was thinking that could
//              appear on hover!"
//
// ── NO REACTIONS (removed) ───────────────────────────────────────────────────
// This file used to branch on comment ownership and show a reaction smiley on
// other people's comments, on the strength of the `Icon / Smiley` node in the
// card frames and the "hover, if not my comment" text layer. That was an
// over-read of a design-system node. Checked against both sections:
//
//   · "reaction" / "emoji" / "thumbs"     → 0 occurrences, anywhere
//   · `Icon / Smiley`                     → 4 occurrences, ALL hidden="true"
//   · a reaction pill / count / picker    → drawn in no frame
//
// So reactions are not a requirement of this design, and everything that served
// them is gone: the ownership `VeltIf`, `ThreadCard.ReactionTool`, the applied
// `ThreadCard.Reactions` rows in all three dialog variants, and their CSS.
// The hover affordance is now just the kebab, on every comment — Velt decides
// which rows the menu offers for a comment you do not own.
//
// CLASS NAMES stay `vc-comment-*` (never `vc-options-*`): the smoke check
// `fam-comment-dialog-options-drodpwon/affordances-once` asserts exactly ONE
// `.vc-options-trigger` inside an open dialog, and reusing that class would
// flip it to FAIL.

/**
 * The hover row pinned to the top-right of a ThreadCard, out of flow.
 *
 * ── OWN COMMENTS ONLY (`veltIf` on the Options slot) ─────────────────────────
 * Both rows this menu offers are owner-only: Velt's `Edit` and `Delete` slots
 * self-gate to nothing on a comment you did not write. The menu itself does NOT
 * self-gate, so on another user's comment the kebab still rendered and opened an
 * EMPTY 200px panel — a grey box over the card with no rows in it.
 * Gating the whole `Options` slot on authorship removes the affordance instead
 * of leaving a dead one: no rows available → no kebab. `{commentObj}` is the
 * per-comment context inside a ThreadCard (the same variable `VeltData
 * field="commentObj.from.name"` reads), so this resolves per ROW, not per
 * thread — a reply of mine under someone else's root comment keeps its kebab.
 */
export function VcCommentActions() {
    return (
        <div className="vc-comment-actions">
            <VeltCommentDialogWireframe.ThreadCard.Options
                className="vc-comment-options"
                veltIf="{commentObj.from.userId} === {user.userId}"
            >
                <VeltCommentDialogWireframe.ThreadCard.Options.Trigger className="vc-comment-options-trigger">
                    <VcDotsThreeIcon />
                </VeltCommentDialogWireframe.ThreadCard.Options.Trigger>
                <VeltCommentDialogWireframe.ThreadCard.Options.Content className="vc-options-menu">
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit className="vc-menu-item-edit">
                        <span className="vc-menu-label">Edit</span>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit>
                    {/* Delete renders NOTHING unless its canonical sub-slots are
                        declared (live-verified). This menu is per-COMMENT, so
                        `.Comment` is the one that normally paints; `.Thread` is
                        declared too so a single-comment thread still gets a working
                        row instead of an empty one. */}
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete className="vc-menu-item-delete">
                        <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Comment>
                            <span className="vc-menu-label">Delete</span>
                        </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Comment>
                        <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Thread>
                            <span className="vc-menu-label">Delete</span>
                        </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete.Thread>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete>
                </VeltCommentDialogWireframe.ThreadCard.Options.Content>
            </VeltCommentDialogWireframe.ThreadCard.Options>
        </div>
    );
}

/**
 * The edit field's host, mounted as a SIBLING of the message row (not inside the
 * hover group) so the editor takes the message's place in flow rather than being
 * absolutely positioned with the kebab. Declaring it is what makes the `Edit` row
 * above do anything at all — without it the SDK enters edit mode, the message row
 * disappears, and there is nowhere for the editor to mount.
 */
export function VcEditComposer() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.EditComposer className="vc-edit-composer" />
    );
}

export default VcCommentActions;
