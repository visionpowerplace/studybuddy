
# Study Buddy — Next.js Edition

Patient, encouraging AI tutor that explains difficult topics fast in 3 layers.

## Quick Deploy to Vercel (1-click)

1. Push this folder to GitHub
2. Go to vercel.com/new → Import your repo
3. Deploy → Live! Add custom domain in Settings → Domains

Or via CLI:
```bash
npm i -g vercel
vercel --prod
```

## Local dev
```bash
npm install
npm run dev
```

## Monetize Next Steps

This version uses template logic (no API costs). To make it truly AI:

1. **Add OpenAI API**
   - Create `/app/api/explain/route.ts`
   - Call `openai.chat.completions.create` with prompt: "You are Study Buddy..."
   - Replace `generateExplanation()` with fetch to your API

2. **Add Paywall**
   - `npm install stripe @clerk/nextjs` or `supabase`
   - In `page.tsx`, add:
     ```ts
     if (freeUses > 3) showPaywall()
     ```
   - Stripe Checkout link: dashboard.stripe.com → Create product $9/mo

3. **Env vars** (Vercel → Settings → Environment Variables):
   ```
   OPENAI_API_KEY=sk-...
   STRIPE_SECRET_KEY=sk_...
   ```

## Folder structure
- app/page.tsx → main UI (converted from Meta AI artifact)
- app/globals.css → Tailwind
- Ready for Vercel, Netlify, Cloudflare Pages

Built from Meta AI artifact → production Next.js.
