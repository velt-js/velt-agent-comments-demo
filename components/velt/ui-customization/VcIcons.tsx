"use client";

// Icons for the `vc-*` customization layer — transcribed VERBATIM from the design's
// exported SVGs (R17). Do not redraw, do not recolour, do not re-path: `icon-lint.mjs`
// diffs these against `.velt-customize/phases/WYAWuEm8DrIk-872-20766/assets/*.svg`.

/** DotsThree — Options.Trigger kebab.
 *  source: assets/icon-dotsthree-I872-21801-251-19661.svg (spec node I872:21801;251:19661) */
export function VcDotsThreeIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M11.9999 13C12.5619 13 13.0175 12.5523 13.0175 12C13.0175 11.4477 12.5619 11 11.9999 11C11.438 11 10.9824 11.4477 10.9824 12C10.9824 12.5523 11.438 13 11.9999 13Z" fill="#333333" />
            <path d="M5.98239 13C6.54436 13 6.99993 12.5523 6.99993 12C6.99993 11.4477 6.54436 11 5.98239 11C5.42041 11 4.96484 11.4477 4.96484 12C4.96484 12.5523 5.42041 13 5.98239 13Z" fill="#333333" />
            <path d="M18.0175 13C18.5794 13 19.035 12.5523 19.035 12C19.035 11.4477 18.5794 11 18.0175 11C17.4555 11 16.9999 11.4477 16.9999 12C16.9999 12.5523 17.4555 13 18.0175 13Z" fill="#333333" />
        </svg>
    );
}

/** ArrowUp — the composer send glyph, shared by BOTH composer frames.
 *  source: assets/icon-arrowup-I872-22124-14544-410091-2932-14675-2932-14625.svg (dialog, 872:22157)
 *          assets/icon-arrowup-I872-22140-14544-410091-2932-14675-2932-14625.svg (page-mode, 872:22156)
 *  The two exports are BYTE-IDENTICAL, so one component serves both surfaces. */
export function VcArrowUpIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8 13.5V2.5M12.5 7L8 2.5L3.5 7" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Sparkles — the AGENT avatar glyph inside the sidebar card's purple circle.
 *  source: assets/icon-sparkles-I872-21761-251-24497.svg (spec node I872:21761;251:24497) */
export function VcSparklesIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clipPath="url(#vc-sparkles-clip)">
                <path d="M9.74995 6.75C9.7509 6.9029 9.70445 7.05233 9.61698 7.17774C9.52951 7.30316 9.40533 7.39838 9.26151 7.45031L6.8437 8.34375L5.95308 10.7634C5.90034 10.9067 5.80491 11.0304 5.67968 11.1177C5.55446 11.2051 5.40545 11.2519 5.25277 11.2519C5.10008 11.2519 4.95108 11.2051 4.82585 11.1177C4.70062 11.0304 4.60519 10.9067 4.55245 10.7634L3.6562 8.34375L1.23651 7.45312C1.09323 7.40038 0.969574 7.30496 0.882227 7.17973C0.79488 7.0545 0.748047 6.90549 0.748047 6.75281C0.748047 6.60013 0.79488 6.45112 0.882227 6.32589C0.969574 6.20066 1.09323 6.10524 1.23651 6.0525L3.6562 5.15625L4.54683 2.73656C4.59957 2.59328 4.69499 2.46962 4.82022 2.38227C4.94545 2.29493 5.09446 2.24809 5.24714 2.24809C5.39982 2.24809 5.54883 2.29493 5.67406 2.38227C5.79929 2.46962 5.89471 2.59328 5.94745 2.73656L6.8437 5.15625L9.26339 6.04688C9.40731 6.09928 9.53141 6.19506 9.61856 6.32101C9.70572 6.44695 9.75163 6.59685 9.74995 6.75ZM7.12495 2.25H7.87495V3C7.87495 3.09946 7.91446 3.19484 7.98479 3.26516C8.05511 3.33549 8.1505 3.375 8.24995 3.375C8.34941 3.375 8.44479 3.33549 8.51512 3.26516C8.58544 3.19484 8.62495 3.09946 8.62495 3V2.25H9.37495C9.47441 2.25 9.56979 2.21049 9.64012 2.14016C9.71044 2.06984 9.74995 1.97446 9.74995 1.875C9.74995 1.77554 9.71044 1.68016 9.64012 1.60984C9.56979 1.53951 9.47441 1.5 9.37495 1.5H8.62495V0.75C8.62495 0.650544 8.58544 0.555161 8.51512 0.484835C8.44479 0.414509 8.34941 0.375 8.24995 0.375C8.1505 0.375 8.05511 0.414509 7.98479 0.484835C7.91446 0.555161 7.87495 0.650544 7.87495 0.75V1.5H7.12495C7.0255 1.5 6.93011 1.53951 6.85979 1.60984C6.78946 1.68016 6.74995 1.77554 6.74995 1.875C6.74995 1.97446 6.78946 2.06984 6.85979 2.14016C6.93011 2.21049 7.0255 2.25 7.12495 2.25ZM11.25 3.75H10.875V3.375C10.875 3.27554 10.8354 3.18016 10.7651 3.10984C10.6948 3.03951 10.5994 3 10.5 3C10.4005 3 10.3051 3.03951 10.2348 3.10984C10.1645 3.18016 10.125 3.27554 10.125 3.375V3.75H9.74995C9.6505 3.75 9.55511 3.78951 9.48479 3.85984C9.41446 3.93016 9.37495 4.02554 9.37495 4.125C9.37495 4.22446 9.41446 4.31984 9.48479 4.39016C9.55511 4.46049 9.6505 4.5 9.74995 4.5H10.125V4.875C10.125 4.97446 10.1645 5.06984 10.2348 5.14016C10.3051 5.21049 10.4005 5.25 10.5 5.25C10.5994 5.25 10.6948 5.21049 10.7651 5.14016C10.8354 5.06984 10.875 4.97446 10.875 4.875V4.5H11.25C11.3494 4.5 11.4448 4.46049 11.5151 4.39016C11.5854 4.31984 11.625 4.22446 11.625 4.125C11.625 4.02554 11.5854 3.93016 11.5151 3.85984C11.4448 3.78951 11.3494 3.75 11.25 3.75Z" fill="#F9F9F9" />
            </g>
            <defs>
                <clipPath id="vc-sparkles-clip">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

/** ArrowBendDownRight — the thread-level ToggleReply glyph on the collapsed sidebar card.
 *  source: assets/icon-arrowbenddownright-872-21789.svg (spec node 872:21789)
 *  DI-7: designSpec.iconAssignments routed this to the PER-COMMENT ThreadCard.Reply;
 *  plan-structure re-routes it to ToggleReply.Icon (once per thread). */
export function VcArrowBendDownRightIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13.75 15.625L17.5 11.875L13.75 8.125M17.5 11.875H10C8.01088 11.875 6.10322 11.0848 4.6967 9.6783C3.29018 8.27178 2.5 6.36412 2.5 4.375" stroke="#767676" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** SidebarSimple — the dialog header's "open in sidebar" affordance.
 *  source: assets/icon-sidebarsimple-I872-21801-251-19666.svg (spec node I872:21801;251:19666) */
export function VcSidebarSimpleIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8.25 4.5V19.5M3.75 4.5H20.25C20.6642 4.5 21 4.83579 21 5.25V18.75C21 19.1642 20.6642 19.5 20.25 19.5H3.75C3.33579 19.5 3 19.1642 3 18.75V5.25C3 4.83579 3.33579 4.5 3.75 4.5Z" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   Phase-B icons (flows board 872:20767 · sections 890:22520 / 890:23224).
   Same Phosphor "regular" idiom as the exported glyphs above — 24px box,
   1px stroke, round caps/joins, #333333 — so the new chrome matches the
   design system's own icon set rather than introducing a second style.
   ──────────────────────────────────────────────────────────────────────── */

/** X — the sidebar header's close affordance (872:21414 `Icon / X`, 24x24 @ 360,12).
 *  source: asset dc46de70-9cb6-4d94-95a9-7a6c0bde9f3a.svg — verified byte-identical
 *  to the drawer's own X (e16320e0-…), so one component serves both headers. */
export function VcXIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M18.75 5.25L5.25 18.75M18.75 18.75L5.25 5.25" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** CaretLeft — the focused-thread header's back affordance ("‹ Comment Thread").
 *  source: Comment Drawer 872:21603 (asset 5bbfedb2-3d74-4174-b68f-d03d7ffc3c82.svg) —
 *  verified verbatim. Not currently mounted: the BackButton slot renders Velt's own
 *  caret and drops children, so the live glyph is Velt's (see styles.css note 6). */
export function VcCaretLeftIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 19.5L7.5 12L15 4.5" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** MagnifyingGlass — the sidebar control row's search trigger.
 *  source: `Icon Leading` inside Tab Bar Secondary 872:21415 (asset
 *  b55319af-4f7b-4e55-a1a7-1d319b1b1da9.svg) — VERBATIM. Note this one exports on a
 *  16px viewBox, not 24: the search button is a `.Button / base` with an explicit
 *  16px leading icon, so the box is part of the spec, and the stroke is #1A1A1A
 *  rather than the #333333 the 24px header glyphs use. */
export function VcMagnifyingGlassIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10.5356 10.5356L14 14M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** CheckCircle — resolve, in the focused-thread header (`‹ Comment Thread  ⋯ ✓ ✕`).
 *  source: Comment Drawer 872:21603 (asset 22077296-65b5-41fc-a551-0772df919de8.svg) —
 *  VERBATIM. The first hand-drawn attempt put the tick's vertices at 11.25,15.75 /
 *  16.5,9.75 and drew the ring as a separate <circle>; the export is one path with
 *  the tick at 10.5,15 / 15.75,9.75. */
export function VcCheckCircleIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8.25 12.75L10.5 15L15.75 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** ChatTeardrop (fill) — the app bar's comments control.
 *  Phosphor, the icon family the rest of this file uses (FunnelSimple, Sliders,
 *  MagnifyingGlass, CheckCircle), kept on its native 256 grid so the path is the
 *  vendor's verbatim rather than a hand-rescaled approximation. The shape is a
 *  disc with a square bottom-left corner — the design's bubble-with-a-tail. */
export function VcChatTeardropIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Z" />
        </svg>
    );
}

/** ArrowCounterClockwise — reopen (the resolved counterpart of CheckCircle). */
export function VcArrowCounterClockwiseIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.32 9.44H2.57V5.69" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.32 9.44a8.06 8.06 0 1 1-1.02 6.19" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Phosphor FunnelSimple — the design's `Filters` control (44:22045). */
export function VcFunnelSimpleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <path
                d="M39.99 64a8 8 0 0 1 8-8h160a8 8 0 0 1 0 16h-160a8 8 0 0 1-8-8Zm32 72h96a8 8 0 0 0 0-16h-96a8 8 0 0 0 0 16Zm64 48h-32a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16Z"
                fill="currentColor"
            />
        </svg>
    );
}

/** Phosphor Sliders — the design's `Columns` control (44:22045). */
export function VcSlidersIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <path
                d="M40 88h33.02a32 32 0 0 0 61.96 0H216a8 8 0 0 0 0-16h-81.02a32 32 0 0 0-61.96 0H40a8 8 0 0 0 0 16Zm64-24a16 16 0 1 1-16 16 16 16 0 0 1 16-16Zm112 104h-33.02a32 32 0 0 0-61.96 0H40a8 8 0 0 0 0 16h81.02a32 32 0 0 0 61.96 0H216a8 8 0 0 0 0-16Zm-64 24a16 16 0 1 1 16-16 16 16 0 0 1-16 16Z"
                fill="currentColor"
            />
        </svg>
    );
}
