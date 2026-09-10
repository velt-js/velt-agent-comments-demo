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

/**
 * The sidebar's `For You | Everything` tab pair (872:21415).
 *
 * Both pills share ONE group and `type="single-select"`, which is what makes
 * Velt treat them as radio siblings: it tracks which is active, paints the
 * selection state, and reports it back as
 * `buttonContext.selections[SIDEBAR_SCOPE_GROUP]`. The host never holds this in
 * React state — it only reacts to the change by applying a sidebar filter.
 */
export const SIDEBAR_SCOPE_GROUP = "vc-sidebar-scope";
export const SIDEBAR_SCOPE_FOR_YOU = "vc-tab-for-you";
export const SIDEBAR_SCOPE_EVERYTHING = "vc-tab-everything";
