/**
 * The scripted "deep dive" agent run for the Altana demo.
 *
 * This is the only file you need to edit to change what the demo SAYS. The
 * mechanics live in `app/api/velt/agent-run/route.ts` (the writes) and
 * `components/velt/AgentRunController.tsx` (the pacing + the click handling).
 *
 * Shape of a run, all on ONE comment (SDK spec AC-032 — the answer must not
 * become a new comment when it lands, or it visibly jumps to the bottom of the
 * thread):
 *
 *   comments/add     progress.state = 'active'     + actions: [Stop]
 *   comments/update  progress.steps advanced       (repeat per step)
 *   comments/update  commentText + state 'completed' + actions: [Copy, Share, Log]
 *
 * @see https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature
 */

/** Action ids. The host switches on these in AgentRunController. */
export const ACTION_IDS = {
  DIG_DEEPER: 'dig-deeper',
  STOP: 'stop',
  COPY_RESPONSE: 'copy-response',
  SHARE_SLACK: 'share-slack',
  LOG: 'log',
  /**
   * Custom accept/reject on a suggestion card.
   *
   * These replace Velt's built-in ✓/✗ on whichever card declares them (the SDK
   * retires the built-ins as soon as ANY action list is declared). The host
   * resolves them through `useAcceptSuggestion` / `useRejectSuggestion`, which
   * perform exactly the same write the built-in buttons do — that equivalence is
   * the whole reason replacing them is safe.
   */
  ACCEPT: 'accept',
  REJECT: 'reject',
  /**
   * Re-run the analysis on a SUGGESTION card.
   *
   * Demonstrates that a progress row renders inside the card itself — the card
   * keeps showing its finding while a live run reports underneath it, from ONE
   * annotation. Before this SDK iteration the progress primitive was unreachable
   * on that surface: the dialog branches @if/@else on isSuggestionComment(), so
   * suggestion mode never rendered the threads container the row lived in.
   */
  RE_ANALYZE: 're-analyze',
} as const;

/**
 * Minimum gap between progress writes.
 *
 * NOT a cosmetic choice. Velt has a known rapid-update render race
 * (`docs/comment-progress-rapid-update-race.md` in the SDK repo, deferred by
 * decision): a server-confirmed snapshot for write N can arrive AFTER write
 * N+1's optimistic render and re-park the comment as a progress row. The E2E
 * harness hit it and solved it with the same 6s floor. It also reads better —
 * steps that flick past in 300ms look like a glitch, not like thinking.
 */
export const AGENT_STEP_INTERVAL_MS = 6000;

/** The agent identity shown on the row. REST-only — the SDK path overwrites `from`. */
export const DEEP_DIVE_AGENT = {
  userId: 'altana-review-agent',
  name: 'Altana Review Agent',
  email: 'agents@altana.demo',
} as const;

/**
 * The steps, in order. The LAST one is still showing when the answer lands.
 *
 * Authored in the "replace" pattern (one-element array per push) — the simplest
 * of the three the SDK supports, and the one that keeps no history we would not
 * use. See `CommentProgress.steps` in @veltdev/types for append/checklist.
 */
export const DEEP_DIVE_STEPS: readonly string[] = [
  'Reading Section 1 (Scope of Agreement)…',
  'Cross-referencing defined terms in Section 2…',
  'Searching Section 2 for a "Quality Agreement" definition…',
  'Checking the Exhibit list for an executed quality agreement…',
  'Drafting the response…',
];

/** What the agent finally says. */
export const DEEP_DIVE_ANSWER = {
  text:
    'Deep dive complete. "Quality Agreement" is referenced 3 times (Sections 1, 2.3 and 4.1) ' +
    'but never defined, and no quality agreement appears in the Exhibit list. ' +
    'Risk: the incorporated document is unidentifiable, so Section 2.3\'s API definition has no source. ' +
    'Recommendation: add a definition in Section 2 and attach the executed agreement as an Exhibit.',
  html:
    '<b>Deep dive complete.</b><br>' +
    '"Quality Agreement" is referenced <b>3 times</b> (Sections 1, 2.3 and 4.1) but never defined, ' +
    'and no quality agreement appears in the Exhibit list.<br><br>' +
    '<b>Risk:</b> the incorporated document is unidentifiable, so Section 2.3\'s API definition has no source.<br><br>' +
    '<b>Recommendation:</b> add a definition in Section 2 and attach the executed agreement as an Exhibit.',
} as const;

/**
 * Chips on the live progress row.
 *
 * Comment-level ONLY, and that is load-bearing: annotation-level actions
 * deliberately never inherit onto a progress row (SDK AC-043), because
 * "Copy Response" on a run whose response does not exist yet is nonsense.
 */
export const RUNNING_ACTIONS = [
  { id: ACTION_IDS.STOP, label: 'Stop' },
] as const;

/** Chips on the finished answer. */
export const ANSWER_ACTIONS = [
  { id: ACTION_IDS.COPY_RESPONSE, label: 'Copy Response' },
  { id: ACTION_IDS.SHARE_SLACK, label: 'Share in Slack' },
  { id: ACTION_IDS.LOG, label: 'Log' },
] as const;

/** Chips on the agent's opening message — the demo's entry point. */
export const OPENING_ACTIONS = [
  { id: ACTION_IDS.DIG_DEEPER, label: 'Dig Deeper' },
  { id: ACTION_IDS.LOG, label: 'Log' },
] as const;

/**
 * Chips for the suggestion card that demonstrates CUSTOM accept/reject.
 *
 * The other seeded suggestion deliberately keeps Velt's built-in buttons, so the
 * demo shows both vocabularies side by side and they end in the same state.
 */
export const SUGGESTION_ACTIONS = [
  { id: ACTION_IDS.ACCEPT, label: 'Approve' },
  { id: ACTION_IDS.REJECT, label: 'Dismiss' },
  { id: ACTION_IDS.RE_ANALYZE, label: 'Re-analyze' },
] as const;

/** Steps for the in-card re-analysis (AC-061). Shorter than the deep dive. */
export const RE_ANALYZE_STEPS: readonly string[] = [
  'Re-reading Section 2.2…',
  'Comparing PHGF and PDGF usage…',
  'Updating the finding…',
];

export const RE_ANALYZE_ANSWER = {
  text: 'Re-analysis complete. "Anti-PHGF Antigen" appears once; "PDGF" appears twice in the same clause. The acronym is almost certainly a typo for "Anti-PDGF Antigen".',
  html: '<b>Re-analysis complete.</b><br>"Anti-PHGF Antigen" appears once; "PDGF" appears twice in the same clause. The acronym is almost certainly a typo for <b>"Anti-PDGF Antigen"</b>.',
} as const;
