"use client";

import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";
import { VcDotsThreeIcon } from "./VcIcons";

// ═══ per-comment hover kebab ══════════════════════════════════════════════════
//
//   890:23218  `Hover Options, my comment` — a 200x90 menu:  Edit · Delete
//   890:23222  text layer: "hover, if my comment"
//   Figma #7:  "Can we add Three Dot menu here as well? So that user can edit or
//              delete specific reply." → Imogen Todd: "I was thinking that could
//              appear on hover!"
//
// ── REACTIONS (restored) ─────────────────────────────────────────────────────
// This file used to carry a reaction smiley and it was REMOVED, on the reasoning
// that the Altana sections drew no reaction pill, no count and no picker, and
// that every `Icon / Smiley` node in them was `hidden="true"`. The hidden flag
// was the giveaway and it was read backwards: those nodes are hidden because the
// frame draws the RESTING state, and the affordance is a HOVER one — the design
// file's own text layer next to it says so ("hover, if not my comment").
//
// Design review closed it: "They have reaction button, missing in our wireframes"
// (miri, 1:29 PM), with a screenshot of the smiley appearing on a comment row and
// that same annotation arrowed at it. The Design Suggestion board added the
// resting half too — frame `Reaction` 4:27616 draws the chips row this hover
// affordance produces, which is what `.vc-reactions` below is built from.
//
// So both halves are back: `ReactionTool` here (hover, NOT my comment) and
// `ThreadCard.Reactions` under the message on every comment — see VcReactions.
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

            {/* ── the add-reaction smiley ──────────────────────────────────────
                The EXACT complement of the kebab above: `Icon / Smiley` sits at
                x=286 of the 294px text column in frame 4:28053 — the same
                top-right corner, hidden at rest — and the annotation beside it
                reads "hover, if not my comment". So the two affordances never
                appear together, and neither is ever a dead control:
                    my comment      → kebab (Edit · Delete)
                    someone else's  → add reaction
                `{commentObj}` is the per-COMMENT context inside a ThreadCard, so
                this resolves per row: my reply under your comment gets the kebab,
                your reply under mine gets the smiley.
                Left SELF-CLOSING — the slot renders Velt's own picker trigger and
                owns the popup; a child here would cover the button the same way
                it did on `Composer.ActionButton`. The glyph is painted in CSS.

                The `<VeltIf>` WRAPPER, not the `veltIf` attribute the kebab uses:
                measured side by side on the same row, the attribute honours `===`
                (the kebab correctly vanished on the agent's comment) and IGNORES
                `!==` — the smiley showed on all 6 comments including my own, a
                24x24 box that does nothing. The wrapper handles both. It clones in
                as an `app-if` element, so the stylesheet gives it
                `display: contents` to keep this a flex row. */}
            <VeltIf condition="{commentObj.from.userId} !== {user.userId}">
                <VeltCommentDialogWireframe.ThreadCard.ReactionTool className="vc-reaction-tool" />
            </VeltIf>
        </div>
    );
}

/**
 * The reactions row itself — the chips a reaction produces, under the message.
 *
 * Frame 4:28071 draws it as a 24px row in the text column: `[1 👍] [3 👋] [☺]`,
 * 4px apart, each chip white with a 1px hairline, and the chip you reacted to
 * outlined in the design blue instead.
 *
 * NOT gated on authorship, unlike the tool above: other people react to MY
 * comments too, and those chips have to show. It self-gates on emptiness — Velt
 * marks the thread card `velt-reactions="0"` when there are none — so a comment
 * nobody has reacted to keeps exactly the geometry it has now.
 */
export function VcReactions() {
    return (
        <VeltCommentDialogWireframe.ThreadCard.Reactions className="vc-reactions" />
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
