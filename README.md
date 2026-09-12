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
