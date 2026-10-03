
# Study Buddy — Real AI + Stripe Edition

Now with **real OpenAI GPT-4o-mini** + **Stripe $9/mo paywall**.

## 1. Env vars needed (Vercel → Settings → Environment Variables)

```
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com (or your vercel.app URL)
```

Get keys:
- OpenAI: platform.openai.com → API keys → Create
- Stripe: dashboard.stripe.com → Developers → API keys

## 2. Deploy

Push to GitHub then vercel.com/new → Import

Or:
```
npm install
npm run build
vercel --prod
```

## 3. Monetization Logic

- 3 free explanations stored in localStorage (`sb_free_uses`)
- After 3, paywall modal → Stripe Checkout
- On success `?success=true` → sets `sb_pro=true` in localStorage
- Upgrade to real auth later: add Clerk or Supabase, replace localStorage with DB check of stripe subscription.

### To make it production-secure:
- Replace localStorage pro check with Stripe webhook:
  Create `/app/api/webhook/route.ts` that listens to `checkout.session.completed`
  Store customer email + subscription in Vercel KV / Supabase.

## 4. Costs
- OpenAI gpt-4o-mini: ~ $0.001 per explanation → ~1000 explanations for $1
- Stripe fee: 2.9% + 30c
- Vercel hosting: free tier enough for start

## Test Stripe
Use card 4242 4242 4242 4242, any future date, CVC 123 to test.

Ready to monetize!
