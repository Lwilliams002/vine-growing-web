# The Vine Website

i need to make this church a website, the church is called The Vine Apostolic Church at 14615 Aldine Westfield Rd, Houston, TX 77039. use the images from here https://www.facebook.com/thevinehouston/photos

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c232c554-3a9f-4a52-beb1-afbef762552e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Announcements (pastor admin)

The pastor can post announcements and events without touching code:

1. Go to `/admin` on the live site (there is also a small "Admin" link in the footer).
2. Sign in with the church admin email and password.
3. Click **Nuevo anuncio**, fill in a title and text, optionally an event date, time, and a link,
   then **Guardar**.

Announcements appear on the home page (up to three, pinned first) and on the Events page.
Events with a date disappear on their own once the date has passed. Use the eye icon to hide
something without deleting it, and the pin to keep it at the top.

### One-time setup (Supabase, free tier)

1. Create a project at https://supabase.com (free plan is enough).
2. In the dashboard open **SQL Editor -> New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates the `announcements` table with
   row-level security (public can read, only signed-in users can write).
3. In **Authentication -> Providers -> Email**, turn off "Allow new users to sign up" so only
   accounts you create can log in. Then in **Authentication -> Users -> Add user**, create the
   pastor's login with an email and password.
4. In **Project Settings -> API**, copy the Project URL and the `anon` public key into the
   environment (see `.env.example`): `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   Set the same two variables wherever the site is built (Lovable / Cloudflare).

Both values are safe to expose in the browser; the SQL policies decide what the anon key can do.

## Test link on GitHub Pages

Every push to `main` also publishes a static copy of the site to GitHub Pages via
`.github/workflows/pages.yml`, at `https://lwilliams002.github.io/vine-growing-web/`.
This is a preview for testing; the real deployment stays on Lovable / Cloudflare.

One-time setup in the GitHub repo:

1. **Settings -> Pages -> Build and deployment -> Source:** choose **GitHub Actions**.
2. **Settings -> Secrets and variables -> Actions -> New repository secret**, add:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (from Lovable Cloud, or the
     Supabase dashboard under Project Settings -> API).
3. Push to `main` (or run the workflow from the Actions tab). The first run takes a couple of
   minutes; the link is shown on the workflow's deploy step.

Locally the same export is produced with `GITHUB_PAGES_BASE=/vine-growing-web/ bun run build`
and lands in `.output/public`.

## Live stream (pastor admin)

The **En Vivo / Live** card at the top of `/admin` controls the live player on the site:

1. Start the live video on the Facebook page as usual.
2. Open the live post on Facebook, copy its link (it looks like
   `https://www.facebook.com/thevinehouston/videos/1234567890`), paste it into
   **Enlace del video en vivo**, tick **Estamos en vivo ahora**, and save.
   The home page shows a red "Estamos en vivo" bar and `/live` plays the stream inside the site.
3. When the service ends, untick the box, paste the same link into **Último mensaje**, give it a
   title, and save. That video then plays on Home, Mensajes, and En Vivo until the next service.

Facebook only allows embedding a specific video link, not "whatever is live right now", which is
why step 2 is needed each time. This needs the `site_settings` block from `supabase/schema.sql`
to have been run once in the Supabase SQL editor.
