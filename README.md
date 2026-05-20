# AI-Powered ORM / UCOrm

MVP dashboard for managing customer reviews with AI-generated response drafts.

## Day 1 Scope

- Next.js App Router with TypeScript.
- Tailwind CSS styling.
- Feature-based `reviews` module structure.
- Mock review queue with the main UI flow:
  - Enter Place ID.
  - Fetch mock reviews.
  - Generate mock AI replies.
  - Select one reply.
  - Approve the review.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  features/
    reviews/
      components/
      data/
      constants.ts
      types.ts
  lib/
    cn.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` when the API/database work starts.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GOOGLE_PLACES_API_KEY=
```
