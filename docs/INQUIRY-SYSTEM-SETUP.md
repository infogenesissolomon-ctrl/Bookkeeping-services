# Contact inquiries and admin dashboard: setup

The Contact page saves inquiries to a Supabase database through a Vercel function, and `/admin/` lets you sign in to read and manage them. Nothing works on the live site until the steps below are done. Until then, the form shows "The inquiry form is temporarily unavailable" and `/admin/` shows "Admin isn't set up yet".

## How it fits together

| Part | File | What it does |
| --- | --- | --- |
| Contact form | `pages/contact/index.html`, `script.js` | Validates fields, sends JSON to `/api/inquiries`, shows the thank-you panel only after the server confirms the save. |
| Submission API | `api/inquiries.js` | Validates and cleans input, blocks the hidden spam field and too-fast submissions, allows 3 inquiries per 10 minutes per visitor (by a hashed IP; the raw IP is never stored), then inserts the row with the secret key. After the row is saved, it emails you a notification. |
| Notification email | `api/_notify.js`, `api/_email.js` | Sends "New Website Inquiry — [Service]" to `ADMIN_NOTIFICATION_EMAIL` through Gmail and records the result on the inquiry (`sent`, `failed`, or `not_configured`). A failure never affects the saved inquiry. |
| Retry notification | `api/retry-notification.js` | Admin only. Resends a failed or unsent notification. Two clicks can't send it twice. |
| Reply API | `api/replies.js` | Admin only. Emails your reply to the inquiry's own email address (it can't send anywhere else), saves it in `inquiry_replies`, and sets the inquiry to Replied only after Gmail accepts the message. |
| Admin config | `api/admin-config.js` | Gives the admin page the Supabase URL and publishable key. Both are designed to be public. |
| Admin dashboard | `admin/index.html`, `admin/admin.js`, `admin/admin.css` | Supabase email and password sign-in, then reads and updates inquiries with your login token, and sends replies through `/api/replies`. |
| Database | `supabase/migrations/20261027000000_create_inquiries.sql`, `supabase/migrations/20261027010000_add_notifications_and_replies.sql` | `inquiries`, `admin_users`, and `inquiry_replies` tables, row level security, and permissions. |

Access rules, enforced by the database itself:

- Public visitors have no access to the table at all. Inquiries are inserted only by the server function, using the secret key.
- Signed-in accounts that are not in `admin_users` see no rows.
- Admins can read inquiries, change only the `status` column, and delete inquiries.
- Reply history (`inquiry_replies`) is readable by admins only. Nobody can write to it from the browser; only `/api/replies` does, with the secret key, after checking that the request comes from a signed-in admin.

## 1. Create the Supabase project

1. Sign in at https://supabase.com and create a new project. Pick the region closest to you and save the database password somewhere safe.
2. Open **SQL Editor**, choose **New query**, paste the whole of `supabase/migrations/20261027000000_create_inquiries.sql`, and click **Run**. It should finish with "Success. No rows returned".
3. Do the same with `supabase/migrations/20261027010000_add_notifications_and_replies.sql`. Run the files in this order.

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

## 5b. Set up email (Gmail)

Notifications and client replies are sent from your Gmail account, so replies look like normal mail from you, appear in your Gmail **Sent** folder, and the client's answer comes back to your inbox.

1. Turn on 2-Step Verification for the Google account: https://myaccount.google.com/signinoptions/twosv
2. Create an App password: https://myaccount.google.com/apppasswords. Name it `Website`, click **Create**, and copy the 16-character password. You won't see it again. (If the page says App passwords aren't available, 2-Step Verification isn't on yet.)
3. In Vercel → **Settings → Environment Variables**, add for **Production** (and **Preview** if you test there):

| Name | Value |
| --- | --- |
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | The 16-character app password. Mark it **Sensitive**. |
| `ADMIN_NOTIFICATION_EMAIL` | Where new-inquiry notifications go. Optional; defaults to `GMAIL_USER`. |
| `EMAIL_FROM_NAME` | Optional sender name. Defaults to "Genesis Solomon". |
| `SITE_URL` | Optional. The address used in the notification's dashboard link. Defaults to the Vercel production URL. |

4. Redeploy.

Good to know:

- **Gmail accepting a message doesn't guarantee delivery.** The dashboard says "sent" once Gmail accepts the email; the recipient's mail server can still bounce it or file it as spam. Bounces arrive in your Gmail inbox.
- **Limits.** Gmail allows about 500 emails a day from a personal account, far more than this site needs.
- **Changing your Google password** revokes app passwords. Create a new one and update `GMAIL_APP_PASSWORD` in Vercel, then redeploy.
- **If email isn't set up**, inquiries are still saved; the dashboard shows "Not sent: email wasn't set up" with a **Send now** button, and replying shows a clear error.

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
8. **Notification:** after step 1, a "New Website Inquiry — [Service]" email should arrive at `ADMIN_NOTIFICATION_EMAIL`, and the inquiry's details panel should show "Email notification to you: Sent". Clicking **Reply** in Gmail on that notification goes to the client.
9. **Reply:** open the test inquiry, click **Reply**, send a short message to an address you own. It should arrive from your Gmail, show as **Sent** under Replies, and the status should change to Replied.

## Notes

- **Custom Supabase domain:** if you set one up, add it to `connect-src` in the admin Content-Security-Policy in `vercel.json`.
- **Sessions:** the dashboard keeps your session only for the browser tab (`sessionStorage`). Closing the tab signs you out.
- **Leaked secret key:** rotate it in Supabase, update `SUPABASE_SECRET_KEY` in Vercel, and redeploy.
- **Free Supabase projects pause** after about a week without activity. If the form or dashboard stops working, open the Supabase dashboard and click **Restore project**.
- **No automatic replies to clients.** Clients only receive email when you click **Send Reply**; new inquiries only notify you.
