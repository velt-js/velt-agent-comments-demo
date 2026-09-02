This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Altana demo for Velt comments and agent findings integration.

## Getting Started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Add your Velt API key and auth token from the [Velt Console](https://console.velt.dev).

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in as a user, and open the comments sidebar. Two demo agent findings are seeded automatically — no curl or manual API calls required.

## Agent comments integration

This demo shows how to add agent findings from your **Next.js backend** using the [Velt Add Comment Annotations REST API](https://velt.dev/docs/api-reference/rest-apis/v2/comments-feature/comment-annotations/add-comment-annotations).

| File | Role |
|------|------|
| `lib/velt/agentCommentSeeds.ts` | Hard-coded demo findings — replace with your agent output |
| `app/api/velt/agent-comments/route.ts` | Server-side Velt REST API call (keeps secrets off the client) |
| `components/velt/SeedAgentComments.tsx` | Triggers seeding after sign-in |

**Flow:** user signs in → document loads → `SeedAgentComments` POSTs to `/api/velt/agent-comments` → route checks for existing agent comments → creates two `type: "suggestion"` annotations if needed.

**Self-hosting note:** leave `NEXT_PUBLIC_SELF_HOSTING_BASE_URL` unset for this demo. Agent comments seeded via the REST API are stored in Velt cloud; if comment data providers point at the Django backend, seeded findings will not appear in the UI.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
