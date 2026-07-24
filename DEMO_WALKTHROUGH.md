# Demo Walkthrough — Velt access-control reproduction (plain English)

This guide explains, in plain language, **what this demo does**, **why we built it**, and
**how you can try every feature yourself**. No prior Velt knowledge required.

> For the short technical version see [`README.md`](README.md). This file is the friendly,
> step-by-step tour.

---

## 1. Why this demo exists

A customer of ours (running their own app on Velt) reported two problems they couldn't
solve, and we couldn't log into their environment to see it. So instead we rebuilt **their
exact setup inside our own demo**, turning on all the same Velt features at once. Now the
Velt team can click around, watch what happens, and figure out where things go wrong —
without needing the customer's app.

The two problems the customer reported:

1. **A "read-only for the whole company" login gets rejected.** When they create a login
   token that says "this person can view everything in the organization, but edit nothing,"
   the app refuses it with the error *"Invalid user token."* Oddly, the same token works if
   you change "view" to "edit," or if you add even one folder to it.
2. **Velt's own background saves fail for some users.** As soon as certain users open a
   document, Velt tries to save some behind-the-scenes bookkeeping data and gets a
   *"Missing or insufficient permissions"* error, plus a failure in the part that encrypts
   comments.

This demo recreates the conditions for both, so we can observe them live.

---

## 2. The Velt features we turned on (all together)

Real apps rarely use just one Velt feature. The customer uses six at once, and so does this
demo now:

| Feature | Plain-English meaning |
|---------|------------------------|
| **Permission Provider** | Velt asks *our* server "is this person allowed to see this?" in real time, instead of us pre-loading a list into Velt. Our server is the source of truth. |
| **Access Context (catalogs)** | Every comment is stamped with a "catalog" label (think: which product line or region it belongs to). People only see comments for catalogs they're allowed into — and, importantly, they only get **notifications** for those catalogs too. |
| **Viewer vs. Editor roles** | Some people can only read; others can read and write. |
| **Organization-private documents** | By default a document is only visible to people in the same organization that owns it. Outsiders (guests) need to be explicitly let in. |
| **Folders** | Documents live in folders, and you can grant someone access to a whole folder at once (like shared folders in Google Drive). |
| **Private comments** | A comment's author can choose who sees it: everyone, just their organization, or specific people. |

Everything Velt-related lives under the `components/velt/`, `lib/velt/`, and
`app/api/velt/` folders, and the rules for *who can do what* all live in **one file**:
`components/velt/accessModel.ts`.

---

## 3. What we added (in the app)

- **Five demo people ("User 1" through "User 5")**, each set up differently on purpose so
  every feature — and both reported bugs — can be triggered by simply signing in as the
  right person.
- **A "catalog" picker in the top bar** — lets you choose which catalog label your *new*
  comments get stamped with.
- **A "Velt permissions debug" panel in the bottom-left corner** — the star of the show.
  Open it and you'll see, updating live:
  - the signed-in person's login details (their roles and which catalogs they can see),
  - what Velt currently thinks they're allowed to do,
  - and a running list of every "is this allowed?" question Velt asked, with the yes/no
    answer color-coded (green = allowed, red = denied).
- **Sample AI "findings"** that get added to the document automatically, each stamped with
  a catalog, so you can watch catalog-filtering in action without typing anything.

---

## 4. Meet the five demo users

Pick these from the **"Sign in as"** dropdown in the top-right.

| Sign in as | In plain English | What it's for |
|------------|------------------|---------------|
| **User 1** | Full editor. Can see and edit everything, in both catalogs (APAC + EMEA). | The "everything works" baseline. |
| **User 2** | An outside guest (from a different company) who was invited to edit one folder. Can only see **APAC** comments. | Shows a guest getting in cross-company, and only seeing one catalog. |
| **User 3** | A **read-only** person, allowed into **EMEA** only. | The one to watch for **Bug #2** (background-save failures for read-only users). |
| **User 4** | The **"view the whole company, edit nothing"** login — and nothing else. | Reproduces **Bug #1** (the rejected token). |
| **User 5** | A full editor, but with **no catalog access at all**. | Shows that even an editor sees **no** comments/notifications if they aren't allowed into any catalog. |

---

## 5. How to run it

1. Copy the example settings file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste in your Velt **API key** and **auth token** (from
   https://console.velt.dev).
3. In the Velt Console, turn on the four settings listed at the bottom of `.env.example`:
   - **Require JWT Token** = on
   - **Default Document Access Type** = `organizationPrivate`
   - **Real-Time Permission Provider** = enabled
   - **Private Comments (beta)** = enabled

   > These live in the Console (not in the code), and the demo won't behave correctly
   > without them. During local development you do **not** need a public URL or tunnel for
   > the Permission Provider — the demo answers permission questions right in your browser.
4. Start it:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000, and open the **"Velt permissions debug"** panel in the
   bottom-left so you can watch what happens as you click around.

---

## 6. Try each feature (step by step)

### A. Roles: editor vs. viewer
1. Sign in as **User 1** (editor). Open the comments panel (top-right toggle). You can add
   and reply to comments.
2. Sign out, sign in as **User 3** (read-only). You can read comments but the tools for
   creating/editing are limited.
3. Open the debug panel — notice the "role" column shows **editor** for User 1 and
   **viewer** for User 3.

### B. Folders
- In the debug panel's "JWT resources" list you'll see entries like
  `folder:folder-manufacturing (editor)`. That's the person being granted a whole folder.
  User 1 has two folders; User 4 has none. This is what "folder access" looks like.

### C. Organization-private + guests (cross-company access)
- **User 2** and **User 4** belong to a *different* company than the one that owns the
  document. Because documents are "organization-private," Velt has to ask our Permission
  Provider whether these outsiders are allowed in. Watch the debug panel when you sign in as
  User 2 — you'll see the document check come through and get approved.

### D. Access Context (catalogs) — filtering comments
1. Sign in as **User 1** (sees both catalogs). Two sample AI findings appear on the
   document — one stamped **APAC**, one stamped **EMEA**.
2. Sign out, sign in as **User 2** (APAC only). You'll see the **APAC** finding but **not**
   the EMEA one.
3. Sign in as **User 3** (EMEA only) — now it's the opposite.
4. In the debug panel, the "context" rows show the catalog checks: green for the catalog the
   person is allowed into, red for the one they aren't.

### E. Access Context — tagging your own comments
1. In the top bar, use the **"New comments →"** picker to choose **APAC** or **EMEA**.
2. Add a comment. It's now stamped with that catalog.
3. Sign in as someone who can't see that catalog — your comment is hidden from them.

### F. Notifications follow the catalog rules
- Notifications inherit a comment's catalog automatically. So if User 1 (APAC) mentions
  someone in an APAC comment, a person who isn't allowed into APAC won't get pinged about
  it. This is the customer's main reason for using catalogs: a company-wide notification
  bell that never leaks across catalogs. **User 5** (no catalog access) is the clearest
  test — they should receive no catalog-tagged notifications at all.

### G. Private comments
1. Sign in as **User 1**. When writing a comment, use the visibility control under the
   composer to mark it **organization-private** or **restricted** (specific people).
2. Sign in as someone who shouldn't see it — the comment is hidden.

---

## 7. Reproducing the two reported bugs

Keep the **debug panel** open and also open your browser's **Network tab** (DevTools) for
these.

### Bug #1 — the "view everything, edit nothing" login is rejected
- Sign in as **User 4**. Their login token says only "viewer of the whole organization,"
  with nothing else attached — exactly the shape the customer said gets rejected.
- Watch for the sign-in request (`generate_token`) and the follow-up checks
  (`validateclient`, `/v2/core/a`). If the customer's bug reproduces, you'll see the
  *"Invalid user token"* error here.
- Compare with **User 3** (read-only **plus** a folder), which the customer said works, and
  with the editors.

### Bug #2 — background saves fail for read-only users
- Sign in as **User 3** (read-only) and open the document.
- Watch the browser console and Network tab for *"Missing or insufficient permissions"*
  errors on Velt's own saves (organization/document bookkeeping) and a failure on the
  comment-encryption request (`/v1/sed`).
- The debug panel shows exactly what role Velt resolved for this person at that moment.

> **If a bug does *not* show up here, that's still useful.** It tells us the problem isn't
> the login-token shape or the roles by themselves (which matches Velt's own early
> hypothesis that "the token is fine, the real error is elsewhere"). In that case the debug
> panel plus the Network tab point us to where to look next.

---

## 8. Good to know

- **You need a real Velt API key and the Console settings above** to see the full behavior.
  Without them the page still loads and you can see the layout, but sign-in and permission
  checks won't run for real.
- **This demo can only *reproduce and observe* the bugs — it can't fix them**, because the
  failing behavior is inside Velt's own SDK/backend. The value is that it recreates the
  customer's exact conditions in an environment we control.
- All the "who can do what" rules are in `components/velt/accessModel.ts`. Change a user's
  roles or catalogs there and everything else (the login token, the permission answers, the
  document subscription, the UI labels) updates to match.
