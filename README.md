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

## Day 2 Scope

- Supabase schema for the `reviews` table.
- Seed SQL with sample reviews.
- Server-side Supabase client using `SUPABASE_SERVICE_ROLE_KEY`.
- `/api/reviews` endpoint:
  - `GET /api/reviews?placeId=...` reads reviews.
  - `POST /api/reviews` saves/upserts reviews.
- Mock fallback when Supabase environment variables are not configured.

## Day 3 Scope

- `POST /api/reviews/fetch` fetches reviews for a Place ID.
- Uses sample review data for the MVP to avoid Google Places billing and API restrictions.
- Saves sample reviews into Supabase through the same repository layer.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

```text
supabase/
  migrations/
    0001_create_reviews.sql
  seed.sql
src/
  app/api/reviews/
    fetch/
    route.ts
  app/
    globals.css
    layout.tsx
    page.tsx
  features/
    reviews/
      api/
      components/
      data/
      server/
      constants.ts
      schemas.ts
      types.ts
  lib/
    supabase/
    cn.ts
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the review flow and layer responsibilities.

## Environment Variables

Copy `.env.example` to `.env.local` when the API/database work starts.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_create_reviews.sql` in the SQL Editor.
3. Run `supabase/seed.sql` to insert sample reviews.
4. Set these variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The app will use a mock in-memory store if these variables are missing, so local UI work can continue before Supabase is configured.
