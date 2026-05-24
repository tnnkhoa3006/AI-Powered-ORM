# AI-Powered ORM / UCOrm

AI-Powered ORM is an MVP dashboard for Online Reputation Management. The app helps a business fetch customer reviews, generate AI reply suggestions, choose one response, and move toward a review approval workflow.

The current MVP focuses on a practical full-stack flow:

```text
Enter Place ID or SerpApi data_id
-> Fetch reviews
-> Save reviews to Supabase
-> Display review queue
-> Generate AI replies
-> Show standard / friendly / solution reply options
-> Select a reply for approval
```

## Features

- One-page review management dashboard.
- Fetch reviews through SerpApi Google Maps Reviews API.
- Accepts Google Maps `place_id` or SerpApi `data_id`.
- Falls back to sample reviews if SerpApi is not configured or unavailable.
- Stores reviews in Supabase.
- Generates three AI reply suggestions:
  - `standard`
  - `friendly`
  - `solution`
- Uses OpenAI-compatible Chat Completions API with JSON schema response formatting.
- Validates AI output again with Zod before saving.
- Falls back to deterministic mock replies if AI provider is not configured or unavailable.
- Keeps API keys server-side only.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- SerpApi
- OpenAI-compatible Chat Completions API
- Zod
- ESLint

## Architecture

The project uses a feature-first structure. Review-specific UI, API wrappers, server services, schemas, and data mappers live under `src/features/reviews`.

```text
src/
  app/
    api/
      reviews/
        route.ts
        fetch/
          route.ts
        [reviewId]/
          generate-ai/
            route.ts
    layout.tsx
    page.tsx
  features/
    reviews/
      api/
        reviews-client.ts
      components/
      data/
        mock-reviews.ts
      server/
        ai-reply-prompts.ts
        fetch-reviews-service.ts
        generate-ai-service.ts
        openai-reply-client.ts
        review-mapper.ts
        review-repository.ts
        serpapi-reviews-client.ts
      schemas.ts
      types.ts
  lib/
    openai/
    serpapi/
    supabase/
supabase/
  migrations/
  seed.sql
docs/
  ARCHITECTURE.md
```

Main fetch flow:

```text
Dashboard
-> reviews-client.ts
-> POST /api/reviews/fetch
-> fetch-reviews-service.ts
-> SerpApi or sample fallback
-> review-repository.ts
-> Supabase reviews table
```

Main AI flow:

```text
Generate AI button
-> reviews-client.ts
-> POST /api/reviews/[reviewId]/generate-ai
-> generate-ai-service.ts
-> OpenAI-compatible provider or mock fallback
-> review-repository.ts
-> Supabase reviews.ai_replies
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for additional layer notes.

## Database

The main table is `reviews`.

Important columns:

- `id`
- `external_review_id`
- `place_id`
- `author_name`
- `rating`
- `content`
- `status`
- `ai_replies`
- `selected_tone`
- `selected_reply`
- `reviewed_at`
- `created_at`
- `updated_at`

Create the table by running:

```text
supabase/migrations/0001_create_reviews.sql
```

Optional seed data:

```text
supabase/seed.sql
```

## Environment Variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SERPAPI_API_KEY=
SERPAPI_SEARCH_ENDPOINT=https://serpapi.com/search
SERPAPI_HL=vi

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_CHAT_COMPLETIONS_ENDPOINT=https://api.openai.com/v1/chat/completions
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is used only by server API routes.
- `SERPAPI_API_KEY` is optional. Without it, fetch falls back to sample reviews.
- `OPENAI_API_KEY` is optional. Without it, AI generation falls back to mock replies.
- `OPENAI_CHAT_COMPLETIONS_ENDPOINT` can point to OpenAI or another OpenAI-compatible provider.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run:

```text
supabase/migrations/0001_create_reviews.sql
```

4. Optionally run:

```text
supabase/seed.sql
```

5. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

If Supabase env variables are missing, the app uses an in-memory mock store so local development can continue.

## SerpApi Setup

Add your SerpApi key to `.env.local`:

```bash
SERPAPI_API_KEY=your-serpapi-key
SERPAPI_SEARCH_ENDPOINT=https://serpapi.com/search
SERPAPI_HL=vi
```

The dashboard input accepts:

- Google Maps `place_id`, for example `ChIJ...`
- SerpApi `data_id`, for example `0x89c259af336b3341:0xa4969e07ce3108de`

The fetch service requests Google Maps reviews through SerpApi, sorts by newest first, filters reviews that have text content, paginates when needed, and stores up to 5 reviews.

## AI Provider Setup

For OpenAI:

```bash
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_CHAT_COMPLETIONS_ENDPOINT=https://api.openai.com/v1/chat/completions
```

For an OpenAI-compatible provider, keep the same API key/model pattern and replace:

```bash
OPENAI_CHAT_COMPLETIONS_ENDPOINT=https://your-provider.example/v1/chat/completions
```

Prompt and response schema configuration live in:

```text
src/features/reviews/server/ai-reply-prompts.ts
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## API Routes

### Get Reviews

```http
GET /api/reviews?placeId=PLACE_ID
```

Returns reviews for the requested place.

### Save Reviews

```http
POST /api/reviews
```

Body:

```json
{
  "reviews": [
    {
      "placeId": "PLACE_ID",
      "authorName": "Customer",
      "rating": 4,
      "content": "Review content",
      "status": "Pending"
    }
  ]
}
```

### Fetch Reviews

```http
POST /api/reviews/fetch
```

Body:

```json
{
  "placeId": "ChIJ..."
}
```

Uses SerpApi when configured, otherwise sample data.

### Generate AI Replies

```http
POST /api/reviews/:reviewId/generate-ai
```

Generates and saves:

```json
{
  "standard": "...",
  "friendly": "...",
  "solution": "..."
}
```

## Current MVP Limitations

- The app does not publish replies back to Google Maps.
- Approval is currently handled in the dashboard UI state and is intended to be moved fully into a database-backed API flow next.
- SerpApi availability and returned review count depend on the target place and review text availability.

## Verification

Before submitting or deploying, run:

```bash
npm run lint
npm run build
```
