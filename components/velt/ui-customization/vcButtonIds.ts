// VeltButtonWireframe ids. A wireframe button can't carry a React handler — its
// `id` on the `veltButtonClick` event is the only thing that reaches the host —
// so these literals are shared rather than typed on both sides.

/** Comment dialog header → open the host's comments drawer. */
export const OPEN_SIDEBAR_BUTTON = "vc-open-sidebar";

/**
 * The control band's second button and the one row in the menu it opens.
 *
 * The design calls it "Columns" because that band is Altana's table component
 * reused in the drawer; over a list of comments it opens display options
 * instead. There's no SDK slot for a second band control, so both are
 * VeltButtonWireframes driven by the host.
 */
export const DISPLAY_OPTIONS_BUTTON = "vc-display-options";
export const DISPLAY_MARK_ALL_READ = "vc-mark-all-read";
