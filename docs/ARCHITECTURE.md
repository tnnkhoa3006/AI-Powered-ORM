# Architecture Notes

This project is organized around a feature-first structure so the review workflow is easy to inspect and extend.

## Main Flow

```text
Dashboard UI
-> src/features/reviews/api/reviews-client.ts
-> src/app/api/reviews/fetch/route.ts
-> src/features/reviews/server/fetch-reviews-service.ts
-> sample review data
-> src/features/reviews/server/review-repository.ts
-> Supabase reviews table
```

If Supabase environment variables are missing, the repository falls back to an in-memory mock store. This keeps the MVP demo usable while external services are being configured.

## Key Layers

- `src/app`: Next.js App Router entry points and API routes.
- `src/features/reviews/components`: UI components for the review dashboard.
- `src/features/reviews/api`: Browser-side API wrappers.
- `src/features/reviews/server`: Server-only review fetch service, data access, and mapping logic.
- `src/features/reviews/schemas.ts`: Request validation with Zod.
- `src/lib/supabase`: Supabase server client and database types.
- `supabase/migrations`: Database schema SQL.
- `supabase/seed.sql`: Sample data for demo and development.

## Current MVP Scope

- Reviews are stored in Supabase.
- `GET /api/reviews` reads reviews by Place ID.
- `POST /api/reviews` saves sample reviews for a Place ID.
- `POST /api/reviews/fetch` saves sample reviews for the requested Place ID.
- AI generation and approval are still client-side mock behavior and will be moved to API/database flows in the next tasks.

## Interview Talking Points

- The app uses API routes as a backend layer, so secret keys are never exposed to the browser.
- Zod validates incoming API payloads before inserting into the database.
- A repository layer hides whether data comes from Supabase or mock fallback.
- Sample reviews keep the MVP demo deterministic and avoid Google Places billing during development.
- Database schema and seed data are versioned in the repo for reproducible setup.
