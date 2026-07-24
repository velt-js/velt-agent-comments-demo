"use client";
import { useEffect, useRef } from "react";
import {
  VeltComments,
  VeltCommentsSidebar,
  useVeltEventCallback,
} from "@veltdev/react";
import VeltInitializeDocument from "./VeltInitializeDocument";
import SeedAgentComments from "./SeedAgentComments";
import CommentContextTagger from "./CommentContextTagger";
import { ContactsRegistrar } from "./ContactsRegistrar";
import { VeltCustomization } from "./ui-customization/VeltCustomization";

// Right-anchored comments drawer hosting the embedded page-mode sidebar.
// Ported from altana-wireframes: sorting, the resolved view, and the "Only your
// mentions" filter are SDK-native (MinimalFilterDropdown items in the sidebar
// wireframe), so the only host logic left is the Cancel escape hatch and the
// "C" keyboard shortcut.
function Panel({ open }: { open: boolean }) {
  const buttonEvent = useVeltEventCallback("veltButtonClick");
  const railRef = useRef<HTMLDivElement>(null);

  // Cancel (hw-cancel VeltButtonWireframe) → clear + collapse the composer.
  // Deferred via timeout: the hook delivers an external event, not derived
  // state.
  useEffect(() => {
    if (buttonEvent?.buttonContext?.clickedButtonId !== "hw-cancel") return;
    const apply = window.setTimeout(() => {
      // clearComposer() requires a targetComposerElementId the v1 composers
      // don't expose. Clearing via editing commands fires the input events
      // Velt listens to, then the blur collapses the composer. The event
      // carries commentAnnotation when Cancel sits in a thread's reply
      // composer — scope to that dialog; otherwise it's the page-mode composer.
      const scope = buttonEvent?.commentAnnotation
        ? railRef.current?.querySelector(
            ".velt-comment-dialog--sidebar-mode.velt-comment-dialog--selected",
          )
        : railRef.current?.querySelector(".velt-sidebar-page-mode-composer");
      const input = scope?.querySelector<HTMLElement>(
        ".velt-comment-dialog-composer.velt-composer-open .velt-composer-input--message, .velt-composer-input--message",
      );
      if (input && (input.textContent ?? "").length > 0) {
        input.focus();
        document.execCommand("selectAll", false);
        document.execCommand("delete", false);
      }
      // Escape collapses Velt's composer-open state; blur drops the caret.
      input?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      (document.activeElement as HTMLElement | null)?.blur();
      input?.blur();
      // Velt resets composerInOpenState in its dialog click handler only when
      // the composer is empty — Cancel's own click ran before the clear, so
      // re-dispatch a click outside the composer now that it is.
      scope
        ?.querySelector(".hw-card")
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }, 0);
    return () => window.clearTimeout(apply);
  }, [buttonEvent]);

  // "Hit C to leave a comment" — focus the page-mode composer input.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.closest('input, textarea, [contenteditable="true"]');
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        railRef.current
          ?.querySelector<HTMLElement>(
            ".velt-sidebar-page-mode-composer .velt-composer-input--message, .velt-sidebar-page-mode-composer [contenteditable]",
          )
          ?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const veltButtonClickEventData = useVeltEventCallback('veltButtonClick');
    useEffect(() => {
    if (veltButtonClickEventData) {
        if (veltButtonClickEventData.buttonContext?.clickedButtonId === 'custom-button') {
            console.log('custom button clicked');
        }
    }
    }, [veltButtonClickEventData]);

  return (
    <div
      className="hw-rail"
      ref={railRef}
      style={{
        width: open ? 354 : 0,
        boxShadow: open ? "-10px 0 28px rgba(0, 0, 0, 0.16)" : "none",
      }}
    >
      <div className="hw-rail-inner">
        <VeltCommentsSidebar
          embedMode={true}
          pageMode={true}
          shadowDom={false}
          defaultMinimalFilter="open"
          sortBy="createdAt"
          sortOrder="desc"
        />
      </div>
    </div>
  );
}

export function VeltCollaboration({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <>
      <VeltInitializeDocument />
      <SeedAgentComments />
      <CommentContextTagger />
      <ContactsRegistrar />
      {/* [Velt] Private comments (beta).
          `visibilityOptions` renders the visibility banner under the composer with
          four levels — public, organization-private, restricted-self, restricted —
          plus an inline user-picker for `restricted`. The chosen visibility is
          stored on the annotation (visibilityConfig) and enforced on read, so a
          private/org-private comment is hidden from users who aren't permitted.
          The Private Comments beta must also be enabled in the Velt Console for
          the API key (see README → Console configuration). */}
      <VeltComments
        shadowDom={false}
        commentPlaceholder="Comment or tag others with @"
        replyPlaceholder="Reply..."
        collapsedComments={true}
        collapsedRepliesPreview={true}
        paginatedContactList={true}
        visibilityOptions={true}
      />
      <VeltCustomization />
      <Panel open={sidebarOpen} />
    </>
  );
}

export default VeltCollaboration;
