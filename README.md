# Roblox Boosting

Starter web app for managing Roblox boosting orders with customer and staff accounts.
Purple/dark UI, Next.js App Router, Supabase Auth + Postgres.

## Setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key.
4. Install Node.js 20+, then run:
   ```bash
   npm install
   npm run dev
   ```
5. Open http://localhost:3000.

## First admin
Create an account through the sign-up page, then run this SQL in Supabase (replace the email):
```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

## Security notes
- This app does not collect Roblox passwords, session cookies, or `.ROBLOSECURITY`.
- Customers sign in to Roblox themselves on the official Roblox website.
- The app stores only the Roblox username supplied for the order, order progress, and normal shop account data.
- Before production, configure Supabase Auth email settings, add your production URL to redirect URLs, and review RLS policies.
