import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { FacebookVideo } from "@/components/site/FacebookVideo";
import { CHURCH, SITE_URL } from "@/lib/church";
import { fetchSettings, isFacebookVideoUrl } from "@/lib/settings";
import { useSettings } from "@/lib/use-settings";
import sermonImg from "@/assets/pastor-stage.jpg";

const TITLE = "Sermons & Media | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Watch and listen to recent messages from The Vine Apostolic Church in Houston. Mensajes recientes de la Palabra.";

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/sermons` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/sermons` }],
  }),
  loader: () => fetchSettings(),
  staleTime: 60_000,
  component: Sermons,
});

const SERMONS = [
  {
    title: "El Poder del Espíritu Santo",
    verse: "2 Timoteo 1:7",
    date: "Domingo / Sunday",
  },
  { title: "Permanece en la Vid", verse: "Juan 15:5", date: "Domingo / Sunday" },
  { title: "Fe Que No Se Rinde", verse: "Hebreos 11:1", date: "Domingo / Sunday" },
];

function Sermons() {
  const settings = useSettings(Route.useLoaderData());
  const sermonUrl = isFacebookVideoUrl(settings.latest_sermon_url)
    ? settings.latest_sermon_url
    : "";
  const isLive = settings.is_live && isFacebookVideoUrl(settings.live_video_url);

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Última Palabra / Latest Word"
        title="Mensajes"
        intro="Cada semana predicamos la Palabra sin diluirla. Every service is streamed live and archived here and on our Facebook page."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        {isLive ? (
          <Link
            to="/live"
            className="mb-8 flex items-center justify-center gap-4 bg-destructive px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors hover:bg-foreground hover:text-background"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            Estamos en vivo ahora / We are live now →
          </Link>
        ) : null}

        <div className="grid border border-border bg-card md:grid-cols-2">
          <div className="p-12 md:p-16">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-primary">
              Mensaje Destacado
            </span>
            <h2 className="mb-6 text-balance font-display text-5xl uppercase leading-none">
              {settings.latest_sermon_title || "El Poder del Espíritu Santo"}
            </h2>
            <p className="mb-10 font-mono text-sm italic text-foreground/60">
              &ldquo;Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de
              dominio propio.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/live"
                className="inline-block bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                En Vivo / Live
              </Link>
              <a
                href={CHURCH.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                Ver en Facebook
              </a>
            </div>
          </div>
          {sermonUrl ? (
            <div className="flex items-center bg-black">
              <FacebookVideo
                url={sermonUrl}
                title={settings.latest_sermon_title || "Último mensaje"}
              />
            </div>
          ) : (
            <img
              src={sermonImg}
              alt="Pastor preaching from the stage at The Vine Apostolic Church"
              width={1200}
              height={1600}
              loading="lazy"
              className="size-full min-h-[360px] object-cover object-top"
            />
          )}
        </div>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {SERMONS.map((s) => (
            <div
              key={s.title}
              className="flex flex-col gap-2 py-8 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <h3 className="font-display text-2xl uppercase">{s.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.verse}
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {s.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
