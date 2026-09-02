# Agent Comments — Progress, Custom Actions & Suggestions

This demo shows how an AI agent participates in a Velt comment thread the same way a
person does: it posts findings, reports what it is doing while it works, and offers
buttons that your own application defines and handles.

Everything here uses public Velt APIs. Requires `@veltdev/react` **6.0.9-beta.1** or later.

---

## What you can see in the demo

Open the document and the comments panel shows three agent findings:

| Finding | Type | Buttons |
|---|---|---|
| "Unverified source" | Comment thread | **Dig Deeper**, **Log** |
| "Inconsistent defined term" | Suggestion card | **Approve**, **Dismiss**, **Re-analyze** |
| "Missing definition" | Suggestion card | Velt's built-in accept / reject |

Two of them are suggestions and one is an ordinary thread, so you can compare the
surfaces side by side. The two suggestion cards deliberately differ: one defines its
own buttons, the other uses Velt's built-in pair. Both end in exactly the same state.

### Try these

1. **Click "Dig Deeper"** on the first finding. A progress row appears and updates
   through several steps, then the agent's answer replaces it and a new set of buttons
   appears (Copy Response, Share in Slack, Log).
2. **Click "Stop"** while a run is in progress. It stops.
3. **Click "Re-analyze"** on the second finding. The progress row appears *inside* the
   suggestion card, underneath the finding, which stays readable the whole time.
4. **Click "Approve" or "Dismiss"** on the second finding, and the built-in ✓ / ✕ on the
   third. Both resolve the suggestion identically.

---

## The three capabilities

### 1. Progress — showing that the agent is working

A comment can carry a `progress` object describing what the agent is doing. Velt renders
it as a live row in the thread, and updates it in place as you push changes. The comment
carries no text while the run is in flight; when the answer is ready you write the text
onto that **same comment** and mark the run complete.

```jsonc
{
  "commentId": 1730000000000,
  "from": { "userId": "altana-review-agent", "name": "Altana Review Agent" },
  // No commentText while running — that is what makes this render as a progress row.
  "progress": {
    "state": "active",
    "steps": [{ "label": "Reading Section 1 (Scope of Agreement)…", "state": "active" }]
  }
}
```

Advance it by updating the same comment with new steps, and finish by adding the text
and setting `state` to `"completed"`. Because the answer lands on the comment the run
started from, it appears where the reader is already looking rather than jumping to the
bottom of the thread.

`state` also accepts `"cancelled"` — that is what the **Stop** button writes.

### 2. Custom actions — your buttons, your behaviour

Any comment can declare a list of actions. Velt renders them as chips and tells you when
one is clicked. **Velt performs no action of its own** — every consequence is yours,
which is what makes these safe to put on an agent comment.

```ts
// Declared on the comment
actions: [
  { id: 'dig-deeper', label: 'Dig Deeper' },
  { id: 'log',        label: 'Log' },
]
```

```tsx
// Handled in your app
const actionEvent = useCommentActionCallback('commentActionClicked');

useEffect(() => {
  if (!actionEvent) return;
  const { actionId, annotationId, commentId } = actionEvent;
  switch (actionId) {
    case 'dig-deeper': startRun(annotationId); break;
    case 'log':        recordToYourSystem(annotationId, commentId); break;
  }
}, [actionEvent]);
```

Because the action list lives on the comment, you can change the buttons as the
conversation moves. This demo swaps them three times in a single run:

| Stage | Buttons |
|---|---|
| Agent's opening message | Dig Deeper · Log |
| While running | Stop |
| Answer delivered | Copy Response · Share in Slack · Log |

You own the whole lifecycle, including clearing or replacing the actions once a finding
has been dealt with.

### 3. Suggestions — accept and reject from your own UI

A suggestion is an annotation the reader can accept or reject. Velt ships built-in
✓ / ✕ buttons, and if you declare your own actions on a suggestion card, yours replace
them — so you can use your product's own wording ("Approve", "Dismiss").

When you do that, resolve the suggestion through the client SDK:

```tsx
const { acceptSuggestion } = useAcceptSuggestion();
const { rejectSuggestion } = useRejectSuggestion();

await acceptSuggestion({ annotationId });
await rejectSuggestion({ annotationId, reason: 'dismissed from the demo' });
```

These perform exactly the same write the built-in buttons perform, so a card resolved by
your button and one resolved by Velt's end in the same state. Accepting retires the
suggestion card and the annotation continues as an ordinary comment thread.

> `acceptCommentAnnotation` and `rejectCommentAnnotation` are the previous generation of
> this API and are now deprecated. Use `acceptSuggestion` / `rejectSuggestion`.

---

## How the demo is put together

### Rendering

Velt renders progress rows and action chips into slots you place in your wireframes.
Two mounts do this:

| Mount | File | Renders |
|---|---|---|
| `<VeltCommentDialogActionsWireframe />` | `components/velt/ui-customization/ThreadCardWf.tsx` | Action chips on a thread comment |
| `<VeltCommentDialogProgressWireframe />` | `components/velt/ui-customization/VeltCommentDialogWf.tsx` | The live progress row |

Place them where you want the chips and the row to appear; the surrounding markup and
styling are entirely yours.

### The agent side

| File | Role |
|---|---|
| `lib/velt/agentRunScript.ts` | The script — action ids, labels, step text, and what the agent says |
| `components/velt/AgentRunController.tsx` | Handles chip clicks, paces the run, calls accept / reject |
| `app/api/velt/agent-run/route.ts` | Server-side writes for each phase of a run |
| `lib/velt/agentCommentSeeds.ts` | The three findings the demo starts with |

`agentRunScript.ts` is the only file you need to edit to change what the demo *says* —
the step text, the answers, and the button labels all live there.

**Agent identity is set server-side.** A comment written from your backend keeps the
`from` you give it, which is how these appear as "Altana Review Agent" rather than as the
signed-in user. That is why the run phases go through an API route rather than the
browser.

### A run, end to end

```
User clicks "Dig Deeper"
        │
        ▼
Velt emits commentActionClicked ──► your handler decides what to do
        │
        ▼
POST /api/velt/agent-run  { phase: 'start' }     → adds a comment carrying progress
        │                                           (live row appears in the thread)
        ├─ { phase: 'advance' } × N                → row updates in place
        │
        ▼
POST /api/velt/agent-run  { phase: 'complete' }  → answer text lands on the SAME
                                                    comment; row is replaced and the
                                                    completion buttons appear
```

`{ phase: 'cancel' }` ends a run early and is what **Stop** triggers.

---

## Running it locally

```bash
npm install
npm run dev
```

Then open the app, pick a user from the top-right selector, and open the comments panel.
The three findings are seeded automatically on first load.
