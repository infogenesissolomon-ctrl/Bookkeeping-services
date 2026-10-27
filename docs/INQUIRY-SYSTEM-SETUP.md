# Contact inquiries and admin dashboard: setup

The Contact page saves inquiries to a Supabase database through a Vercel function, and `/admin/` lets you sign in to read and manage them. Nothing works on the live site until the steps below are done. Until then, the form shows "The inquiry form is temporarily unavailable" and `/admin/` shows "Admin isn't set up yet".

## How it fits together

| Part | File | What it does |
| --- | --- | --- |
| Contact form | `pages/contact/index.html`, `script.js` | Validates fields, sends JSON to `/api/inquiries`, shows the thank-you panel only after the server confirms the save. |
| Submission API | `api/inquiries.js` | Validates and cleans input, blocks the hidden spam field and too-fast submissions, allows 3 inquiries per 10 minutes per visitor (by a hashed IP; the raw IP is never stored), then inserts the row with the secret key. |
| Admin config | `api/admin-config.js` | Gives the admin page the Supabase URL and publishable key. Both are designed to be public. |
| Admin dashboard | `admin/index.html`, `admin/admin.js`, `admin/admin.css` | Supabase email and password sign-in, then reads and updates inquiries with your login token. |
| Database | `supabase/migrations/20261027000000_create_inquiries.sql` | `inquiries` and `admin_users` tables, row level security, and permissions. |

Access rules, enforced by the database itself:

- Public visitors have no access to the table at all. Inquiries are inserted only by the server function, using the secret key.
- Signed-in accounts that are not in `admin_users` see no rows.
- Admins can read inquiries, change only the `status` column, and delete inquiries.

## 1. Create the Supabase project

1. Sign in at https://supabase.com and create a new project. Pick the region closest to you and save the database password somewhere safe.
2. Open **SQL Editor**, choose **New query**, paste the whole of `supabase/migrations/20261027000000_create_inquiries.sql`, and click **Run**. It should finish with "Success. No rows returned".

## 2. Turn off public sign-up

Go to **Authentication → Sign In / Providers** (named **Providers** or **Settings** in some versions):

- Keep **Email** enabled.
- Turn **off** "Allow new users to sign up".

With sign-up off, the only accounts are the ones you create yourself.

## 3. Create your admin account

1. Go to **Authentication → Users → Add user → Create new user**. Enter your email address and a strong, unique password, and tick **Auto Confirm User**.
2. In **SQL Editor**, run the following, replacing the email address with yours:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'your-admin-email@example.com';
   ```

   It should report `1 row` inserted. To remove admin access later, delete that row from `admin_users`.

## 4. Copy the keys

Go to **Project Settings → API Keys** (or **Data API**):

- **Project URL**, for example `https://abcd1234.supabase.co`
- **Publishable key** (`sb_publishable_…`). If your project only shows legacy keys, use the **anon** key.
- **Secret key** (`sb_secret_…`). With legacy keys, use **service_role**. Keep this one private: never put it in a file you commit or in browser code.

## 5. Add the environment variables in Vercel

In Vercel, open the project and go to **Settings → Environment Variables**. Add these three for **Production**, and for **Preview** if you test there:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable (or anon) key |
| `SUPABASE_SECRET_KEY` | Secret (or service_role) key. Mark it **Sensitive**. |

Then redeploy: **Deployments → … → Redeploy**, or push a commit. Environment variables only take effect on a new deployment.

`.env.example` lists the same names with placeholder values. `.env` files are already in `.gitignore`.

## 6. Test locally (optional)

```bash
npm i -g vercel        # once
vercel link            # connect this folder to the Vercel project
vercel env pull .env.local
vercel dev             # serves the site and the /api functions, usually on http://localhost:3000
```

Then open `http://localhost:3000/pages/contact/` and `http://localhost:3000/admin/`. Note that test inquiries go into your real Supabase project.

## 7. Production checklist

Run through these after deploying:

1. **Valid inquiry:** submit an inquiry on `/pages/contact/` with a test name. You should see the thank-you panel. Check that the row appears in **Supabase → Table Editor → inquiries**.
2. **Validation:** submit with empty fields and with an invalid email. You should see inline errors, and no row should be saved.
3. **Admin sign-in:** sign in at `/admin/` with your admin account. The counts should match the table.
4. **Manage an inquiry:** search, filter, open the test inquiry, change its status (the counts should update), then delete it.
5. **Non-admin account:** if you created one, signing in with it should show "This account isn't authorized to view inquiries".
6. **Database denies the public:** run the following, replacing `PROJECT` and `PUBLISHABLE_KEY`:

   ```bash
   curl "https://PROJECT.supabase.co/rest/v1/inquiries?select=*" -H "apikey: PUBLISHABLE_KEY"
   ```

   You should get `401` or "permission denied", and no data.
7. **Log out:** after logging out, reloading `/admin/` should show the sign-in screen.

## Notes

- **Custom Supabase domain:** if you set one up, add it to `connect-src` in the admin Content-Security-Policy in `vercel.json`.
- **Sessions:** the dashboard keeps your session only for the browser tab (`sessionStorage`). Closing the tab signs you out.
- **Leaked secret key:** rotate it in Supabase, update `SUPABASE_SECRET_KEY` in Vercel, and redeploy.
- **Email notifications:** Supabase doesn't email you about new inquiries out of the box. Check `/admin/`, or ask for an email notification step to be added later.
