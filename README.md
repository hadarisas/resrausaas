# RestaurantSaaS

A multi-tenant SaaS platform where each restaurant gets a public-facing landing page, online reservation form, and a private admin dashboard for managing menus, reservations, and revenue.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Supabase Setup](#supabase-setup)
- [Local Development](#local-development)
- [Vercel Deployment](#vercel-deployment)
- [Super Admin Seed](#super-admin-seed)
- [Platform administration (super admin)](#platform-administration-super-admin)
- [Restaurant Demo Seed](#restaurant-demo-seed)
- [Environment Variables](#environment-variables)
- [RLS Policy Summary](#rls-policy-summary)
- [Themes](#themes)

---

## How It Works

### Multi-tenancy

Every restaurant is a row in the `restaurants` table, isolated by `restaurant_id`. Supabase Row Level Security (RLS) enforces this at the database level — a logged-in owner can only read and write their own data, and anonymous visitors can only see published restaurants.

### Auto-provisioning on signup

When a new user signs up, a PostgreSQL trigger (`handle_new_user`) fires automatically on `auth.users` INSERT. It:

1. Derives a unique URL slug from the email address (e.g. `john@example.com` → `john`)
2. Creates a `restaurants` row with default settings
3. Seeds 7 `opening_hours` rows (Mon–Sat 09:00–22:00, Sunday closed)
4. Creates a `profiles` row linked to that restaurant with `role = 'owner'`

The owner lands directly on the dashboard after signup — no manual setup required.

### Public landing pages

Each restaurant is reachable at `/<slug>`. Pages use Incremental Static Regeneration (ISR, `revalidate = 60`) so they are fast and SEO-friendly. The theme (`fine-dining`, `fast-food`, `traditional`, `modern`, `minimal`, `lifestyle-cafe`) is stored in the DB and controls the full visual layout served to guests. Each page includes JSON-LD structured data and Open Graph metadata.

### Admin dashboard

Protected by middleware — unauthenticated requests to `/dashboard/*` redirect to `/login`. The dashboard has five sections:

| Section      | What it does                                                                   |
| ------------ | ------------------------------------------------------------------------------ |
| Overview     | Today's stats, upcoming reservations, 7-day revenue sparkline                  |
| Reservations | Full table with date/status filters, inline status updates, edit/delete        |
| Menu         | Category accordion, item cards, image uploads to Supabase Storage              |
| Revenue      | Bar chart (daily/weekly/monthly), manual entry form                            |
| Settings     | Restaurant info, logo upload, opening hours grid, theme picker, publish toggle |

### Storage

Images (logos, menu photos) are uploaded to Supabase Storage buckets (`restaurant-logos`, `menu-images`). Upload policies are scoped so each owner can only write to their own folder (`{restaurantId}/...`). Both buckets are public-read for guests.

---

## Tech Stack

| Layer        | Choice                                 |
| ------------ | -------------------------------------- |
| Framework    | Next.js 14 App Router                  |
| Styling      | Tailwind CSS + Radix UI primitives     |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Auth         | Supabase Auth (email/password)         |
| Forms        | React Hook Form + Zod                  |
| Charts       | Recharts                               |
| Icons        | lucide-react                           |
| Hosting      | Vercel                                 |

---

## Project Structure

```
resrausaas/
├── supabase/migrations/
│   ├── 001_schema.sql      # Tables, enums, indexes, triggers
│   ├── 002_rls.sql         # RLS policies + storage buckets
│   ├── 004_access_platform_admin.sql  # Trial/subscription access + platform_admins + RLS updates
│   └── 003_seed.sql        # Demo restaurant data (optional)
├── middleware.ts            # Route protection
└── src/
    ├── app/
    │   ├── (public)/        # Marketing page, login, signup, /[slug]
    │   └── (dashboard)/     # Protected admin routes
    ├── components/          # auth/, dashboard/, menu/, reservations/, revenue/, settings/, ui/
    ├── themes/              # 6 public page themes
    ├── lib/
    │   ├── actions/         # Server actions (auth, menu, reservations, revenue, settings)
    │   ├── queries/         # Read helpers (dashboard, menu, restaurant, revenue)
    │   ├── supabase/        # server.ts (SSR client), client.ts (browser singleton)
    │   ├── utils/           # format.ts, storage.ts
    │   └── validations/     # Zod schemas
    └── types/               # database.ts, actions.ts, domain types
```

---

## Supabase Setup

### 1. Create a project

Go to [supabase.com](https://supabase.com), create a new project, and note your **Project URL** and **API keys** from **Settings → API**.

### 2. Run migrations in order

Open the **SQL Editor** in the Supabase dashboard and run each file by pasting its contents and clicking **Run**.

**Step 1 — `supabase/migrations/001_schema.sql`**

Creates:

- 4 custom enums: `reservation_status`, `user_role`, `restaurant_theme` (includes `fine-dining`, `fast-food`, `traditional`, `modern`, `minimal`, and `lifestyle-cafe`), `day_of_week`
- 7 tables: `restaurants`, `profiles`, `menu_categories`, `menu_items`, `opening_hours`, `reservations`, `revenue_entries`
- All indexes and foreign keys
- `set_updated_at()` trigger applied to all mutable tables
- `handle_new_user()` trigger that auto-provisions a restaurant on every new signup

**Step 2 — `supabase/migrations/002_rls.sql`**

Creates:

- Helper functions `get_my_restaurant_id()` and `get_my_role()` (STABLE SECURITY DEFINER)
- RLS policies on all 7 tables
- Storage buckets `restaurant-logos` and `menu-images` (public read, scoped uploads)

**Step 3 — `supabase/migrations/004_access_platform_admin.sql`** (run after 001 and 002)

Creates:

- Enum `restaurant_access_status` (`trial`, `active`, `readonly`, `suspended`) and columns on `restaurants`: `trial_ends_at`, `subscription_ends_at`, `access_status`, `billing_notes`
- Table `platform_admins` (links `auth.users` who may manage all tenants)
- SQL helpers: `is_platform_admin()`, `restaurant_has_full_access()`, `restaurant_entitlement_public()`, `sync_restaurant_access_if_expired(uuid)`
- Updates `handle_new_user()` so new signups get a **14-day trial** (`access_status = trial`)
- Backfills existing restaurants as **grandfathered active** (far-future `subscription_ends_at`)
- Replaces affected RLS policies so anonymous reads and authenticated writes respect trial/subscription; platform admins can `SELECT`/`UPDATE` all restaurants

Then optionally run **`003_seed.sql`** for demo data (see [Restaurant Demo Seed](#restaurant-demo-seed)).

**Optional / follow-up migrations**

| File | When to run |
| ---- | ----------- |
| `005_seed_aurelia_demo.sql` | Optional richer demo tenant (see repo comments in that file). |
| `006_lifestyle_cafe_theme.sql` | **Only if** your database was created from an **older** `001_schema.sql` that did not list `lifestyle-cafe` on `restaurant_theme`. It adds the enum value idempotently. **Skip** if Step 1 used the current `001_schema.sql` (the value is already defined there). |
| `007_public_brochure_and_reservations.sql` | **If** you already ran `001`–`004` before this file existed: updates public RLS so **read-only** tenants keep a visible brochure site while **online reservations** stay gated to active trial/paid plans; stops auto-unpublishing on expiry. |
| `008_platform_tenant_owner_directory.sql` | Adds `platform_tenant_owner_directory()` so the **platform admin** UI can list each tenant’s **owner full name** (from `profiles`) and **login email** (from `auth.users`). |
| `009_platform_tenant_owner_directory_fix.sql` | Fixes the RPC so the caller is resolved when `auth.uid()` is null inside `SECURITY DEFINER`, and adds **RLS** so platform admins can read `profiles` for name fallback. |

If the app errors with `invalid input value for enum restaurant_theme: "lifestyle-cafe"`, run `006_lifestyle_cafe_theme.sql` once in the SQL Editor (or add the value manually as described in that migration).

### 3. Configure Auth

In **Authentication → URL Configuration** set:

- **Site URL** → `http://localhost:3000`
- **Redirect URLs** → add `http://localhost:3000/api/auth/callback`

Update both values to your Vercel URL after deploying.

### 4. Verify the trigger

Sign up once through the app, then run this in the SQL Editor to confirm auto-provisioning worked:

```sql
SELECT p.id AS user_id, p.role, r.slug, r.name, r.is_published
FROM profiles p
JOIN restaurants r ON r.id = p.restaurant_id
LIMIT 5;
```

---

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd resrausaas

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

```bash
npm run dev          # Dev server with hot reload
npm run build        # Production build
npm run start        # Start production server locally
npm run type-check   # TypeScript check with no emit
npm run lint         # ESLint
```

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your repository
2. Framework preset: **Next.js** (auto-detected)
3. Add environment variables under **Environment Variables**:

| Key                             | Value                             |
| ------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key              |
| `SUPABASE_SERVICE_ROLE_KEY`     | Your service role key             |
| `NEXT_PUBLIC_SITE_URL`          | `https://your-project.vercel.app` |

4. Click **Deploy**

### 3. Update Supabase Auth URLs

After the first deploy, go to **Supabase → Authentication → URL Configuration** and update:

- **Site URL** → `https://your-project.vercel.app`
- **Redirect URLs** → add `https://your-project.vercel.app/api/auth/callback`

### 4. Smoke test

1. Sign up at `/signup`
2. Confirm you land on `/dashboard`
3. Go to **Settings**, fill in the restaurant name, toggle **Published**
4. Visit `https://your-project.vercel.app/<your-slug>` — the public page should render

---

## Super Admin Seed

This section is for **seeding a demo restaurant owner** in SQL (optional). For **platform-wide administration** (listing all restaurants, subscription dates, billing notes), use migration **004** and the **platform admin** UI — see [Platform administration (super admin)](#platform-administration-super-admin).

To create a pre-seeded owner account for demos or staging, follow these steps.

### Step 1 — Create the auth user

Option A (recommended): Sign up normally through `http://localhost:3000/signup`. The trigger fires automatically and creates the restaurant and profile.

Option B: In **Supabase → Authentication → Users**, click **Add user → Create new user**, fill in email + password, and note the generated **User UUID**.

### Step 2 — Verify auto-provisioning

Run this in the SQL Editor to confirm both rows were created:

```sql
-- Replace with your actual UUID
SELECT
  p.id             AS user_id,
  p.role,
  r.id             AS restaurant_id,
  r.slug,
  r.name,
  r.is_published
FROM profiles p
JOIN restaurants r ON r.id = p.restaurant_id
WHERE p.id = '<YOUR_USER_UUID>';
```

### Step 3 — Customise the restaurant

```sql
-- Update the auto-generated restaurant with your preferred values
UPDATE restaurants
SET
  name           = 'My Demo Restaurant',
  slug           = 'my-demo',           -- must be unique
  cuisine_type   = 'International',
  address        = '1 Main Street',
  city           = 'Your City',
  phone          = '+1 555 000 0000',
  email          = 'demo@example.com',
  theme          = 'modern',
  is_published   = true,
  max_party_size = 20
WHERE id = (
  SELECT restaurant_id FROM profiles WHERE id = '<YOUR_USER_UUID>'
);
```

### Step 4 — Full super-admin seed script

Save this as `supabase/seeds/super_admin.sql`. Replace `<YOUR_USER_UUID>` with the real value, then run it in the SQL Editor.

```sql
-- ============================================================
-- Super Admin Seed
-- Prerequisites: migrations 001 + 002 applied, auth user exists
-- Replace <YOUR_USER_UUID> before running
-- ============================================================

DO $$
DECLARE
  v_user_id       UUID := '<YOUR_USER_UUID>';
  v_restaurant_id UUID;
BEGIN
  SELECT restaurant_id INTO v_restaurant_id
  FROM profiles
  WHERE id = v_user_id;

  IF v_restaurant_id IS NULL THEN
    RAISE EXCEPTION
      'No restaurant found for user %. '
      'Did the handle_new_user trigger fire?', v_user_id;
  END IF;

  UPDATE restaurants SET
    name           = 'Admin Demo Restaurant',
    slug           = 'admin-demo',
    description    = 'Platform administrator demo account.',
    cuisine_type   = 'International',
    address        = '1 Platform Street',
    city           = 'Demo City',
    phone          = '+1 555 000 0000',
    email          = 'admin@example.com',
    theme          = 'modern',
    is_published   = false,
    max_party_size = 20
  WHERE id = v_restaurant_id;

  UPDATE profiles SET
    role      = 'owner',
    full_name = 'Platform Admin'
  WHERE id = v_user_id;

  RAISE NOTICE 'Done. restaurant_id = %', v_restaurant_id;
END $$;
```

**How to run:**

1. **Supabase → SQL Editor → New query**
2. Paste the script above, replace `<YOUR_USER_UUID>`
3. Click **Run**
4. Check the **Messages** tab — you should see `Done. restaurant_id = <uuid>`

---

## Platform administration (super admin)

After **`004_access_platform_admin.sql`** is applied, you can manage every restaurant from a separate sign-in URL (same Supabase Auth users table; access is gated by a row in `platform_admins`).

### Login URL

| Environment | URL |
| ----------- | --- |
| Local dev | [http://localhost:3000/platform/login](http://localhost:3000/platform/login) |
| Production | `https://<your-domain>/platform/login` |

Restaurant owners continue to use [`/login`](http://localhost:3000/login) → `/dashboard`. Do not share the platform URL publicly; treat it like an admin console.

Unauthenticated visitors to `/platform/*` (except `/platform/login`) are redirected to the platform login page. Users who sign in with a **non-admin** account are signed out on that flow and shown an error.

### 1. Grant platform admin to a user

The user must already exist in **Authentication → Users** (e.g. they signed up at `/signup`).

1. Copy their **User UUID** from Supabase **Authentication → Users**.
2. In the **SQL Editor**, run:

```sql
INSERT INTO platform_admins (user_id)
VALUES ('<PASTE_USER_UUID_HERE>')
ON CONFLICT (user_id) DO NOTHING;
```

3. Sign in at **`/platform/login`** with that user’s email and password.
4. You should be redirected to **`/platform`**, which lists all restaurants and lets you edit **access status**, **subscription end date**, and **billing notes**.

To revoke access, delete the row:

```sql
DELETE FROM platform_admins WHERE user_id = '<USER_UUID>';
```

### 2. Auth redirects (optional)

Platform login uses the same Supabase session and callback as the rest of the app (`/api/auth/callback`). No extra **Redirect URLs** are required beyond what you already configured for local and production Site URLs.

---

## Restaurant Demo Seed

`supabase/migrations/003_seed.sql` populates a demo restaurant called **Bella Vista Ristorante** with realistic Italian menu data, upcoming reservations, and 30 days of revenue.

### What it seeds

| Data            | Details                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Restaurant      | Bella Vista Ristorante, slug `demo`, theme `fine-dining`, published                                                                                |
| Menu categories | Antipasti, Primi Piatti, Secondi Piatti, Dolci                                                                                                     |
| Menu items      | 10 items — Bruschetta, Caprese, Carpaccio, Tagliatelle al Ragù, Cacio e Pepe, Risotto ai Funghi, Branzino, Costata di Manzo, Tiramisù, Panna Cotta |
| Reservations    | 5 upcoming reservations (today +1 to +4 days, mix of pending/confirmed, party sizes 2–8)                                                           |
| Revenue entries | 30 days of daily revenue, random amounts €500–€3000, category `general`                                                                            |

### Prerequisites

1. Migrations **001** and **002** must be applied. Use **004** in production for access control and platform admin; run **004** before or after **003** (both orders work; 004 backfills existing `restaurants` rows).
2. At least one auth user must exist (the seed attaches data to the first owner profile it finds)

### How to run

1. Open **Supabase → SQL Editor → New query**
2. Paste the full contents of `supabase/migrations/003_seed.sql`
3. Click **Run**
4. Visit `http://localhost:3000/demo` — the public page for Bella Vista should render

### Targeting a specific user

If you have multiple users and want to seed a specific one, find their `restaurant_id` first:

```sql
SELECT restaurant_id FROM profiles WHERE id = '<YOUR_USER_UUID>';
```

Then at the top of `003_seed.sql`, replace the initial `SELECT` that picks the target restaurant with:

```sql
v_restaurant_id := '<THE_RESTAURANT_ID_FROM_ABOVE>';
```

### Resetting demo data

To wipe all seeded data and start fresh:

```sql
-- Replace <RESTAURANT_ID> with the value from your restaurants table
DELETE FROM revenue_entries  WHERE restaurant_id = '<RESTAURANT_ID>';
DELETE FROM reservations     WHERE restaurant_id = '<RESTAURANT_ID>';
DELETE FROM menu_items       WHERE restaurant_id = '<RESTAURANT_ID>';
DELETE FROM menu_categories  WHERE restaurant_id = '<RESTAURANT_ID>';

UPDATE restaurants SET
  name         = 'My Restaurant',
  slug         = NULL,   -- will be regenerated on next seed run
  is_published = false
WHERE id = '<RESTAURANT_ID>';
```

Then re-run `003_seed.sql`.

---

## Environment Variables

| Variable                        | Required | Description                                                                    |
| ------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL — safe for the browser                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Anon key — enforces RLS, safe for the browser                                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Service role key — bypasses RLS, **server-only, never expose to the browser**  |
| `NEXT_PUBLIC_SITE_URL`          | Yes      | Canonical URL used for Open Graph, JSON-LD structured data, and auth redirects |

---

## RLS Policy Summary

| Table             | Anonymous                               | Authenticated (any role)     | Owner only               |
| ----------------- | --------------------------------------- | ---------------------------- | ------------------------ |
| `restaurants`     | SELECT published                        | SELECT + UPDATE own          | —                        |
| `profiles`        | —                                       | SELECT + UPDATE own row      | SELECT all in restaurant |
| `menu_categories` | SELECT active (published restaurant)    | SELECT + INSERT + UPDATE own | DELETE                   |
| `menu_items`      | SELECT available (published restaurant) | SELECT + INSERT + UPDATE own | DELETE                   |
| `opening_hours`   | SELECT (published restaurant)           | SELECT + INSERT + UPDATE own | DELETE                   |
| `reservations`    | INSERT (published restaurant only)      | SELECT + INSERT + UPDATE own | DELETE                   |
| `revenue_entries` | —                                       | —                            | Full CRUD                |

After **`004_access_platform_admin.sql`**, policies also enforce **trial/subscription** for public reads and owner writes, and grant **platform admins** (rows in `platform_admins`) `SELECT`/`UPDATE` on all `restaurants`. See that migration for the full policy set.

---

## Themes

Six visual themes are available per restaurant, selectable from the Settings page:

| Theme            | Visual language                                                   |
| ---------------- | ----------------------------------------------------------------- |
| `fine-dining`    | Dark stone background, Playfair Display serif, gold/amber accents |
| `fast-food`      | Bold red/yellow palette, rounded corners, high-contrast CTAs      |
| `traditional`    | Warm cream background, serif body copy, brown borders             |
| `modern`         | White space, sharp sans-serif, indigo/slate accents               |
| `minimal`        | Pure white, monospace accents, no decoration                      |
| `lifestyle-cafe` | Soft blush/stone palette, rose accents, light café aesthetic        |

Theme changes appear on the public page within 60 seconds (ISR revalidation window).
