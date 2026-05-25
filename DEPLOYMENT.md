# KartoFert Deployment

## Free stack

- GitHub: source repository
- Vercel: Next.js hosting
- Supabase: optional, only when orders/products need server-side storage

## Vercel settings

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output: Next.js default

## Notes

- Current cart, admin edits and checkout data use browser `localStorage`.
- Supabase is not required for the current demo flow.
- Add Supabase later for persistent orders, admin auth, product prices and leads.
