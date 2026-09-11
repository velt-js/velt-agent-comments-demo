// ═══ VeltButtonWireframe ids — the wireframe↔host contract ═══════════════════
//
// A `VeltButtonWireframe` cannot carry a React handler (R4): the only thing that
// crosses from wireframe markup to the host is its `id`, on the
// `veltButtonClick` event. That makes every id a two-sided contract — the
// wireframe declares it, the host branches on it — so the literals live here
// rather than being typed twice and drifting.
//
// Renaming any of these is a breaking change on BOTH sides.

/** Sidebar header → open the host's comments drawer (comment dialog header). */
export const OPEN_SIDEBAR_BUTTON = "vc-open-sidebar";

/** Composer escape hatch → clear + collapse the composer. */
export const CANCEL_COMPOSER_BUTTON = "hw-cancel";

/* The sidebar's `For You | Everything` tab pair (SIDEBAR_SCOPE_*) lived here.
   Both the pills and the `setCommentSidebarFilters` bridge they drove are gone:
   the V2 drawer (44:22040) hides `Tab Bar Secondary` and replaces that row with
   `Table Controls` (44:21925), and the `involved` filter the "For You" pill was
   reimplementing by hand is a native option inside the funnel's filter panel. */

/**
 * The control band's SECOND 32x32 button (44:21925 `Columns`, Icon/Sliders) and
 * the two rows in the menu it opens.
 *
 * The frame calls it `Columns` because Table Controls is Altana's own TABLE
 * component reused in the drawer; a column chooser means nothing over a list of
 * comments, so the button keeps the drawn chrome and opens the display options
 * this surface actually has. There is no Velt slot for a second band control —
 * `MinimalActionsDropdown`, `MinimalFilterDropdown`, `ActionButton`,
 * `FullscreenButton` and `ResetFilterButton` were each mounted here and measured
 * 0x0, the first two being multi-thread COMMENT DIALOG slots re-exported on the
 * sidebar namespace — so the button and its menu are `VeltButtonWireframe`s and
 * the behaviour is the host's, exactly like `vc-open-sidebar`.
 */
export const DISPLAY_OPTIONS_BUTTON = "vc-display-options";

/**
 * The menu's single row.
 *
 * `type="button"`, not a toggle: this is an ACTION, so it has no on/off state to
 * paint and the menu closes once it has run.
 *
 * There is no bulk API — `CommentElement` exposes only `markAsRead(annotationId)`
 * — so the host walks the annotations it already has from `useCommentAnnotations()`
 * and calls it per thread. (Velt's own `MinimalActionsDropdown.Content.MarkAllRead`
 * slot exists but never renders in this sidebar: it is a multi-thread COMMENT
 * DIALOG slot, measured 0x0 here.)
 */
export const DISPLAY_MARK_ALL_READ = "vc-mark-all-read";
