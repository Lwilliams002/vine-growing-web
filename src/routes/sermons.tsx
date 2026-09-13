import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { FacebookVideo } from "@/components/site/FacebookVideo";
import { CHURCH, SITE_URL } from "@/lib/church";
import { fetchSettings, isFacebookVideoUrl } from "@/lib/settings";
import { useSettings } from "@/lib/use-settings";
import { useLang, type Bilingual } from "@/lib/i18n";
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

const SERMONS: { title: string; verse: Bilingual; date: Bilingual }[] = [
  {
    title: "El Poder del Espíritu Santo",
    verse: { es: "2 Timoteo 1:7", en: "2 Timothy 1:7" },
    date: { es: "Domingo", en: "Sunday" },
  },
  {
    title: "Permanece en la Vid",
    verse: { es: "Juan 15:5", en: "John 15:5" },
    date: { es: "Domingo", en: "Sunday" },
  },
  {
    title: "Fe Que No Se Rinde",
    verse: { es: "Hebreos 11:1", en: "Hebrews 11:1" },
    date: { es: "Domingo", en: "Sunday" },
  },
];

function Sermons() {
  const settings = useSettings(Route.useLoaderData());
  const { t } = useLang();
  const sermonUrl = isFacebookVideoUrl(settings.latest_sermon_url)
    ? settings.latest_sermon_url
    : "";
  const isLive = settings.is_live && isFacebookVideoUrl(settings.live_video_url);

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={t("Última Palabra", "Latest Word")}
        title={t("Mensajes", "Sermons")}
        intro={t(
          "Cada semana predicamos la Palabra sin diluirla. Cada servicio se transmite en vivo y queda guardado aquí y en nuestra página de Facebook.",
          "Every week we preach the Word without watering it down. Every service is streamed live and archived here and on our Facebook page.",
        )}
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
            {t("Estamos en vivo ahora →", "We're live now →")}
          </Link>
        ) : null}

        <div className="grid border border-border bg-card md:grid-cols-2">
          <div className="p-12 md:p-16">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-primary">
              {t("Mensaje Destacado", "Featured Message")}
            </span>
            <h2 className="mb-6 text-balance font-display text-5xl uppercase leading-none">
              {settings.latest_sermon_title || "El Poder del Espíritu Santo"}
            </h2>
            <p className="mb-10 font-mono text-sm italic text-foreground/60">
              {t(
                "“Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.”",
                "“For God has not given us a spirit of fear, but of power and of love and of a sound mind.”",
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/live"
                className="inline-block bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {t("En Vivo", "Live")}
              </Link>
              <a
                href={CHURCH.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                {t("Ver en Facebook", "Watch on Facebook")}
              </a>
            </div>
          </div>
          {sermonUrl ? (
            <div className="flex items-center bg-black">
              <FacebookVideo
                url={sermonUrl}
                title={settings.latest_sermon_title || t("Último mensaje", "Latest message")}
              />
            </div>
          ) : (
            <img
              src={sermonImg}
              alt={t(
                "Pastor predicando desde la plataforma en The Vine",
                "Pastor preaching from the stage at The Vine",
              )}
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
                  {t(s.verse)}
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {t(s.date)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
