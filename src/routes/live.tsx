import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FacebookPageFeed, FacebookVideo } from "@/components/site/FacebookVideo";
import { CHURCH, SERVICES, SITE_URL } from "@/lib/church";
import { fetchSettings, isFacebookVideoUrl } from "@/lib/settings";
import { useSettings } from "@/lib/use-settings";

const TITLE = "En Vivo / Live Stream | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Mira el servicio en vivo de The Vine Apostolic Church desde cualquier lugar. Watch our Sunday and Wednesday services live from Houston.";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/live` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/live` }],
  }),
  loader: () => fetchSettings(),
  staleTime: 30_000,
  component: Live,
});

function Live() {
  const settings = useSettings(Route.useLoaderData());
  const liveUrl =
    settings.is_live && isFacebookVideoUrl(settings.live_video_url) ? settings.live_video_url : "";
  const replayUrl = isFacebookVideoUrl(settings.latest_sermon_url)
    ? settings.latest_sermon_url
    : "";
  const videoUrl = liveUrl || replayUrl;

  return (
    <>
      <SiteHeader />

      <section className="border-b border-border bg-card px-6 pb-16 pt-20">
        <div className="mx-auto max-w-6xl">
          {liveUrl ? (
            <span className="mb-6 inline-flex items-center gap-3 bg-destructive px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              En vivo ahora / Live now
            </span>
          ) : (
            <span className="eyebrow mb-6 block text-primary">En Vivo / Live</span>
          )}
          <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter md:text-8xl">
            {liveUrl ? "Estamos en vivo" : "Servicio en vivo"}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-foreground/70">
            {liveUrl
              ? "Bienvenido. Acompáñanos desde donde estés. / Welcome, join us from wherever you are."
              : "Transmitimos cada servicio en vivo. Mientras tanto, mira el mensaje más reciente. / We stream every service live. Until then, watch the latest message."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {videoUrl ? (
          <FacebookVideo
            url={videoUrl}
            title={liveUrl ? "Servicio en vivo" : settings.latest_sermon_title || "Último mensaje"}
            autoplay={Boolean(liveUrl)}
            className="ring-1 ring-border"
          />
        ) : (
          <div className="grid gap-1 md:grid-cols-2">
            <div className="border border-border bg-card p-10">
              <h2 className="font-display text-3xl uppercase">Próximo servicio</h2>
              <p className="mt-3 text-sm text-foreground/60">
                Aún no hay video configurado. Síguenos en Facebook para la transmisión. / No video
                set up yet; follow us on Facebook for the stream.
              </p>
            </div>
            <FacebookPageFeed className="ring-1 ring-border" />
          </div>
        )}

        {!liveUrl && replayUrl && settings.latest_sermon_title ? (
          <p className="mt-6 font-display text-2xl uppercase">{settings.latest_sermon_title}</p>
        ) : null}

        <div className="mt-16 grid gap-12 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <h2 className="mb-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Horarios de transmisión / Stream schedule
            </h2>
            <div className="divide-y divide-border border-y border-border">
              {SERVICES.map((s) => (
                <div key={`${s.day}-${s.time}`} className="flex items-end justify-between py-5">
                  <div>
                    <span className="font-display text-2xl uppercase">{s.day}</span>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {s.detail}
                    </p>
                  </div>
                  <span className="font-mono text-primary">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={CHURCH.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-primary px-8 py-4 text-center font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Ver en Facebook
            </a>
            <Link
              to="/prayer"
              className="inline-block border border-border px-8 py-4 text-center font-mono text-xs uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
            >
              Pedir oración / Request prayer
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
