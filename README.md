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

## Announcements, live stream, and subscribers (pastor admin)

The site's editable content lives on the same Cloudflare Worker as the Vine Life Groups app
(`vine-life-groups-app/api`, live at https://api.thevineapostolic.com, routes under `/site/*`).
There is one login for both: the pastor signs up in the app, is promoted to `super_admin`,
and then signs in at `/admin` on the website with that same email and password.

1. Go to `/admin` (there is also a small "Admin" link in the footer) and sign in.
2. **Nuevo anuncio** creates an announcement (title, text, optional date, time, link). Dated
   events disappear from the public site once the date passes; the eye icon hides one without
   deleting it; the pin keeps it at the top.
3. The **En Vivo** card holds the live-stream and latest-sermon links; **Suscriptores** lists
   people who left their email on the home page.

Announcements show on the home page (the next one) and on the Events page (all of them).

Local development against a local API: run `npm run dev` in `vine-life-groups-app/api`, then set
`VITE_API_URL=http://localhost:8787` in `.env` (see `.env.example`).

## Test link on GitHub Pages

Every push to `main` also publishes a static copy of the site to GitHub Pages via
`.github/workflows/pages.yml`, at `https://lwilliams002.github.io/vine-growing-web/`.
This is a preview for testing; the real deployment stays on Lovable / Cloudflare.

One-time setup in the GitHub repo:

1. **Settings -> Pages -> Build and deployment -> Source:** choose **GitHub Actions**.
2. Push to `main` (or run the workflow from the Actions tab). The first run takes a couple of
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
why step 2 is needed each time.
