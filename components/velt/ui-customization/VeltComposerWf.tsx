"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";

// ═══ fam-composer / surface-composer-dialog + surface-composer-page ═══════════
//
// ONE composer chrome, TWO surfaces (plan-structure buildOrder #2):
//
//   • surface-composer-dialog  — figma 872:22157, 326x32, placeholder "Reply".
//       The reply composer at the root of the comment dialog. Mounted from
//       VeltCommentDialogWf via <VcDialogComposer/>.
//   • surface-composer-page    — figma 872:22156, 368x32, placeholder "New Comment".
//       The sidebar's page-mode composer. Velt renders it by cloning the
//       COMMENT-DIALOG wireframe in the variant named by the host's
//       `pageModeComposerVariant` prop, so it needs its OWN registration —
//       <VeltPageModeComposerWf/>, a direct child of the VeltWireframe registry.
//
// ── The variant contract (knowledge trap `page-mode-composer-variant-unregistered`)
// <VeltCommentsSidebar pageModeComposerVariant="pageModeComposer"> is ALREADY set
// on the host (components/velt/VeltCollaboration.tsx). The prop ALONE is not enough:
// with no matching <VeltCommentDialogWireframe variant="pageModeComposer"> in the
// registry Velt falls back to an empty default dialog shell and the composer renders
// 368x0 with no contenteditable. The variant STRING below must stay character-identical
// to that host prop (it is the registry key `component---pageModeComposer`).
//
// ── Why the page-mode variant declares ONLY the Composer
// A root wireframe is a CONTAINER: declaring it means you own its whole child tree and
// undeclared structural children are dropped, NOT defaulted. That is exactly what the
// design wants here — frame 872:22156 is a bare 368x32 pill with nothing above or below
// it — so the variant deliberately renders the Composer and nothing else. The base
// (no-variant) VeltCommentDialogWf keeps the full dialog for every other context.
//
// ── Class contract (plan-structure vcClasses — never rename these)
//   dialog : .vc-composer      → Composer host
//            .vc-composer-field  → own pill div        (326x32)
//            .vc-composer-input  → Composer.Input host
//   page   : .vc-composer-page       → PageModeComposer host (set in VeltCommentSidebarWf)
//            .vc-composer-page-field → Composer host, IS the pill (368x32)
//            .vc-composer-page-input → Composer.Input host
//   shared : .vc-send-slot / .vc-send   (the send chrome is painted on Velt's own
//                                        button class — the slot is self-closing)
// The page-mode classes exist ONLY inside the variant registration, so they can never
// leak into the dialog composer (smoke step `every-dialog-context` asserts exactly that).
//
// ── What is deliberately NOT mounted (R7: omitted, never display:none)
// Composer.Avatar, Composer.Attachments, Composer.FormatToolbar, Composer.Recordings,
// Composer.PrivateBadge. Neither frame draws any of them; the design is a single-row
// pill holding an input and one send control.
// Composer.AssignUser IS mounted — see the AssignUser() note below (Figma #10).
//
// NOTE: no cosmetic CSS is written for any of these classes at this stage — every value
// above lives in the mock (mocks/fam-composer.html) and is decided by the style planner
// (4b) against the DOM snapshot.

/**
 * The send affordance: own `.vc-send-slot` wrapper → `Composer.ActionButton` →
 * own base/icon nodes carrying the design's exported ArrowUp glyph.
 *
 * `type="submit"` is REQUIRED on ActionButton — the slot's `type` selects which
 * composer action it is, and omitting it threw NG0950 ~260x/sec in a prior run.
 *
 * The Figma tree keeps `container`(24x16) > `Button`(24x24) > `base`(24x24) > `Icon`(16x16)
 * as four distinct nodes because the button overflows its stretched slot by design
 * (slot content box 8px tall, button 24px, both vertically centred → button spans y 4..28
 * exactly as the spec box says). `.vc-send-slot` keeps that overflow; the inner two
 * are collapsed onto Velt's own button in CSS, since markup inside this slot breaks
 * submit (see below).
 */
function SendButton() {
    return (
        <div className="vc-send-slot">
            {/* SELF-CLOSING, and the arrow is painted by CSS.
                This is the wireframe gotchas' explicit rule for this slot —
                "leave `Composer.ActionButton` SELF-CLOSING; paint the arrow with
                CSS. Injecting a child into ActionButton is dropped by the clone
                and can kill the native submit in the reply composer" — and this
                build hit exactly that. The previous version nested
                `<span class="vc-send-base"><span class="vc-send-icon">…` inside
                the slot; those spans covered Velt's own button
                (`elementsFromPoint` at the button's centre returned
                `span.vc-send-icon`, not the button), and a real click on the
                REPLY composer's send did nothing — the text stayed in the field,
                the button reported `disabled=false`, and no comment was posted.
                The page-mode composer happened to keep working, which is why it
                went unnoticed.
                The design's chrome (24x24 white box, 1px #e6e6e6, radius 6, and
                the 16px ArrowUp) is now drawn on the live button class in
                styles.css, which survives the clone. */}
            <VeltCommentDialogWireframe.Composer.ActionButton type="submit" className="vc-send" />
        </div>
    );
}

/**
 * The `@` — `tabler-icon-at`, 24x24, first in the 56px tools group of every
 * expanded composer frame on the Design Suggestion board (e.g. 8:28251).
 *
 * It is Velt's own `Composer.ActionButton` under a different `type`, not a
 * control of ours: `type` is what selects WHICH composer action a button is, and
 * the SDK's union for it is
 *   userMentions | autocomplete | file | audio | video | screen | submit |
 *   attachments | format
 * so `userMentions` IS the @ (the send arrow above is `submit`). One line, and
 * it stays wired to the SDK's own autocomplete. Self-closing for the same
 * reason the send button is — markup inside this slot covers Velt's button and
 * kills the click (that is documented on SendButton below).
 *
 * The glyph is painted in CSS, like the arrow.
 */
function MentionButton() {
    return (
        <VeltCommentDialogWireframe.Composer.ActionButton
            type="userMentions"
            className="vc-mention-btn"
        />
    );
}

/**
 * The pill's interior, shared verbatim by both surfaces: the Velt input on the left,
 * the send control on the right.
 *
 * `Composer.Input` is left CHILDLESS on purpose — it renders Velt's real contenteditable
 * editor plus its placeholder, and the placeholder STRING comes from the host props
 * (`replyPlaceholder="Reply"` / `commentPlaceholder="New Comment"`), which are already
 * wired. Giving it children would replace the editor and break typing/submit. That is
 * also why the design's `Text` and `Cursor/Leading` nodes get no own element here: the
 * live text node and caret are Velt's, and the style planner binds those two rows to the
 * real internals it reads from the DOM snapshot.
 */
function ComposerFieldContents({ inputClass, placeholder }: { inputClass: string; placeholder?: string }) {
    return (
        <>
            <VeltCommentDialogWireframe.Composer.Input className={inputClass} placeholder={placeholder} />
            {/* ── the pill's SECOND ROW (Design Suggestion 8:28539) ─────────────
                Four composer frames on that board draw the same thing, and all
                four put it INSIDE the pill rather than above it:
                    8:28235  no mention          → row is just the tools
                    7:28165  one mention, off    → ☐ Assign on send
                    7:28209  one mention, on     → ☑ Assign on send
                    8:28965  many mentions       → ☑ Auto-Assign to [imogen ⌄]
                `Frame 1707478035` is that row: 294x24 at the pill's bottom, with
                the assign control at x=0 and a 56px tools group at x=238 (the @
                at 0 and the send button at 32).

                This supersedes Figma #10's "strip ABOVE the input" — the layout
                Imogen picked in that thread is the one the board then drew, and
                the board draws it on the pill's own bottom row. The old position
                also cost a whole 26px band above every focused composer.

                `.vc-composer-actions` is `display: contents` at rest, so the
                resting pill stays the single 32px row the sidebar and drawer
                frames measure, and only becomes a real row once the composer is
                focused or has somebody to assign. */}
            <div className="vc-composer-actions">
                <AssignUser />
                <div className="vc-composer-tools">
                    <MentionButton />
                    <SendButton />
                </div>
            </div>
        </>
    );
}

/**
 * ── ASSIGN, through the composer (Figma thread #10) ──────────────────────────
 *
 * The thread ran: "For Assigning Comment, should it be from Three dot menu, or
 * through composer? UI needed for Assign Flow" → Imogen Todd: "I think through
 * the composer would make sense. As in 'send' and 'send and assign'. I can mock
 * this up, unless you already have defaults" → Rakesh Goyal posted two live
 * builds of Velt's own composer assign UI (an inline `Assign to <mentioned user>
 * ⌄` strip above the input, and the default bordered `Assign to` dropdown below
 * it) → Imogen: "I really like that first one!"
 *
 * So the affordance is Velt's native one, not the split "Send and Assign" button
 * that the `Assigning Objects` section (890:23224) mocks up — and thread #13 is
 * Imogen herself flagging that mock as unreconciled: "I would have to think about
 * how this kind of assignment would work with the Velt assignment of a comment
 * that you were showing previously, Rakesh." Building the split button now would
 * be building the half of the conversation that was superseded.
 *
 * `Composer.AssignUser` is that native slot. It self-gates — it renders only once
 * the composer holds a mention to assign — so on an empty composer it is 0x0 and
 * the 32px pill keeps the geometry the frames measure.
 *
 * UPDATED (Design Suggestion 8:28539): it is no longer a sibling ABOVE the pill.
 * The four composer frames on that board draw the control on the pill's own
 * bottom row, left of the @ and send buttons, so it is mounted inside
 * `.vc-composer-actions` — see ComposerFieldContents. `setAssignToType({ type:
 * 'checkbox' })` (VeltCollaboration) is what makes Velt render it as the board's
 * checkbox rather than the older `Assign to <user> ⌄` dropdown.
 *
 * NOTE for the record: the repo previously carried a blocker note saying this
 * picker "never opens in 6.0.11", and shipped an `Assign to me` kebab row as a
 * workaround. The two builds Rakesh linked run the same SDK line with the picker
 * working, so that note describes OUR wiring, not an SDK gap — the slot was never
 * declared inside the composer template that replaced Velt's default one. It is
 * declared now, and the workaround row is gone.
 */
function AssignUser() {
    return <VeltCommentDialogWireframe.Composer.AssignUser className="vc-assign-user" />;
}

/**
 * surface-composer-dialog — figma 872:22157.
 * Mounted INSIDE VeltCommentDialogWf (the Composer is a root-level dialog slot and a
 * singleton, so it must not be registered separately).
 */
export function VcDialogComposer() {
    return (
        <VeltCommentDialogWireframe.Composer className="vc-composer">
            <div className="vc-composer-field">
                <ComposerFieldContents inputClass="vc-composer-input" />
            </div>
        </VeltCommentDialogWireframe.Composer>
    );
}

/**
 * surface-composer-page — figma 872:22156.
 * A SECOND registration of the comment-dialog wireframe under the variant the sidebar's
 * `pageModeComposerVariant` prop names. Registered at the root of the VeltWireframe registry.
 *
 * Here the Composer host IS the pill (no extra own div): plan-structure maps
 * `.vc-composer-page-field` straight onto `VeltCommentDialogWireframe.Composer` for this
 * surface, because in page mode nothing else shares the composer's box.
 */
export function VeltPageModeComposerWf() {
    return (
        <VeltCommentDialogWireframe variant="pageModeComposer">
            <VeltCommentDialogWireframe.Composer className="vc-composer-page-field">
                {/* placeholder — set on the SLOT, not left to the host prop.
                    LIVE-VERIFIED: `<VeltCommentsSidebar commentPlaceholder="New Comment">` does
                    NOT reach this composer. The page-mode composer resolves its placeholder from
                    <VeltComments commentPlaceholder> instead, so it painted the product's generic
                    "Comment or tag others with @" (measured before AND after this variant was
                    registered, so the variant is not the cause). `Composer.Input` exposes its own
                    `placeholder` prop (IVeltCommentDialogComposerInputProps) — a real SDK prop, and
                    the fix lives entirely inside the wireframe. It cannot leak to the dialog
                    composer, which is a different registration and correctly renders the design's
                    "Reply" from `replyPlaceholder`. Value is verbatim from frame 872:22156. */}
                <ComposerFieldContents inputClass="vc-composer-page-input" placeholder="New Comment" />
            </VeltCommentDialogWireframe.Composer>
        </VeltCommentDialogWireframe>
    );
}

export default VeltPageModeComposerWf;
