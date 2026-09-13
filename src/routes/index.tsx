import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CHURCH, MINISTRIES, SERVICES, SITE_URL } from "@/lib/church";
import { fetchPublicAnnouncements } from "@/lib/announcements";
import { useAnnouncements } from "@/lib/use-announcements";
import { fetchSettings, isFacebookVideoUrl } from "@/lib/settings";
import { useSettings } from "@/lib/use-settings";
import { FacebookVideo } from "@/components/site/FacebookVideo";
import { useLang } from "@/lib/i18n";
import { AnnouncementList } from "@/components/site/Announcements";
import { PlanYourVisit } from "@/components/site/PlanYourVisit";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import heroImg from "@/assets/hero-pastor.jpg";
import churchBuildingImg from "@/assets/church-building.jpg";
import worshipInsideImg from "@/assets/worship-inside.jpg";
import sermonVideo from "@/assets/sermon-video.mp4";
import galleryWide from "@/assets/sanctuary-wide.jpg";
import galleryBaptism from "@/assets/baptism.jpg";
import galleryKids from "@/assets/kids-worship.jpg";
import galleryPrayer from "@/assets/prayer-hands.jpg";
import galleryWorship from "@/assets/worship-woman-hands.jpg";
import galleryCongregation from "@/assets/congregation-worship.jpg";
import ministryYouth from "@/assets/hands-raised-wide.jpg";
import ministryLadies from "@/assets/worship-singers.jpg";
import ministryKids from "@/assets/kids-group.jpg";

const MINISTRY_IMAGES = {
  "01": ministryYouth,
  "02": ministryLadies,
  "03": ministryKids,
} as const;

const GALLERY = [
  { src: galleryWide, alt: "Sunday worship service at The Vine Apostolic Church" },
  { src: galleryWorship, alt: "Woman worshipping with hands raised" },
  { src: galleryBaptism, alt: "Baptism in the name of Jesus" },
  { src: galleryKids, alt: "Children worshipping during service" },
  { src: galleryPrayer, alt: "Family praying together" },
  { src: galleryCongregation, alt: "Congregation worshipping together on a Sunday" },
] as const;

const TITLE = "The Vine Apostolic Church | Houston, TX";
const DESCRIPTION =
  "Apostolic church in north Houston. Sunday worship 9:00 AM in English and 11:30 AM en Español, Wednesday prayer night 7:30 PM, at 14615 Aldine Westfield Rd. Bilingual services — servicios bilingües.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Church",
          name: CHURCH.name,
          url: SITE_URL,
          image: `${SITE_URL}/og-image.jpg`,
          address: {
            "@type": "PostalAddress",
            streetAddress: CHURCH.address,
            addressLocality: "Houston",
            addressRegion: "TX",
            postalCode: "77039",
            addressCountry: "US",
          },
          email: CHURCH.email,
          sameAs: [CHURCH.facebook],
        }),
      },
    ],
  }),
  // Up to three current announcements for the home page. Cached briefly so
  // back/forward navigation doesn't refetch on every visit.
  loader: async () => {
    const [announcements, settings] = await Promise.all([
      fetchPublicAnnouncements(3),
      fetchSettings(),
    ]);
    return { announcements, settings };
  },
  staleTime: 60_000,
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const announcements = useAnnouncements(data.announcements, 3);
  const settings = useSettings(data.settings);
  const { t } = useLang();
  const isLive = settings.is_live && isFacebookVideoUrl(settings.live_video_url);
  const sermonUrl = isFacebookVideoUrl(settings.latest_sermon_url)
    ? settings.latest_sermon_url
    : "";

  return (
    <>
      <SiteHeader />

      {/* Live banner (toggled from /admin) */}
      {isLive ? (
        <Link
          to="/live"
          className="flex items-center justify-center gap-4 bg-destructive px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors hover:bg-foreground hover:text-background"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          {t("Estamos en vivo ahora — ver →", "We're live now — watch →")}
        </Link>
      ) : null}

      {/* Hero */}
      <section className="relative flex h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt={t(
              "Pastor sonriendo mientras predica en The Vine Apostolic Church",
              "Pastor smiling while preaching at The Vine Apostolic Church",
            )}
            width={1920}
            height={1280}
            className="animate-zoom size-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="animate-fade-up relative z-10 max-w-4xl px-6 text-center">
          <span className="eyebrow mb-6 block text-primary">
            {t(
              "Houston, Texas — Apostólica y Pentecostal",
              "Houston, Texas — Apostolic & Pentecostal",
            )}
          </span>
          <h1 className="text-balance font-display text-7xl uppercase leading-[0.85] tracking-tighter md:text-[10rem]">
            The Vine <span className="text-primary">Apostolic</span> Church
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-foreground/70 md:text-xl">
            {t(
              "Un lugar para encontrar vida, propósito y el poder del Espíritu Santo.",
              "A place to find life, purpose, and the power of the Holy Spirit.",
            )}
          </p>
        </div>
      </section>

      {/* Service times */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="mx-auto max-w-6xl bg-primary p-1">
          <div className="flex flex-col divide-y divide-border bg-background p-8 md:flex-row md:divide-x md:divide-y-0 md:p-12">
            <div className="flex-1 pb-8 md:pb-0 md:pr-12">
              <h2 className="mb-6 flex items-center gap-3 font-display text-4xl uppercase">
                <span className="size-3 bg-primary" /> {t("Horarios", "Services")}
              </h2>
              <div className="space-y-6">
                {SERVICES.map((s) => (
                  <div key={`${s.day.es}-${s.time}`}>
                    <div className="flex items-end justify-between border-b border-border pb-2">
                      <span className="font-display text-2xl uppercase">{t(s.day)}</span>
                      <span className="font-mono text-primary">{s.time}</span>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {t(s.detail)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between pt-8 md:pl-12 md:pt-0">
              <div>
                <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t("Ubicación", "Location")}
                </h3>
                <p className="text-balance font-display text-2xl uppercase leading-tight">
                  {CHURCH.address}
                  <br />
                  {CHURCH.city}
                </p>
              </div>
              <a
                href={CHURCH.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex items-center gap-4"
              >
                <span className="flex size-12 items-center justify-center bg-primary font-bold text-primary-foreground">
                  →
                </span>
                <span className="font-mono text-xs uppercase tracking-widest underline decoration-primary/30 underline-offset-4 transition-colors group-hover:text-primary">
                  {t("Cómo llegar", "Get directions")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements (managed by the pastor at /admin) */}
      {announcements.length > 0 ? (
        <section className="px-6 pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display text-5xl uppercase tracking-tighter md:text-6xl">
                {t("Anuncios", "Announcements")}
              </h2>
              <Link
                to="/events"
                className="eyebrow mb-3 text-muted-foreground transition-colors hover:text-primary"
              >
                {t("Ver todos →", "See all →")}
              </Link>
            </div>
            <AnnouncementList items={announcements} />
          </div>
        </section>
      ) : null}

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
          {/* Images */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
            <div className="overflow-hidden rounded-2xl md:rounded-3xl">
              <img
                src={worshipInsideImg}
                alt="Congregation worshipping inside The Vine Apostolic Church"
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover md:aspect-[3/4]"
              />
            </div>
            <div className="mx-auto w-3/4 overflow-hidden rounded-2xl md:mx-0 md:w-full md:rounded-3xl">
              <img
                src={churchBuildingImg}
                alt="The Vine Apostolic Church building exterior in Houston"
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover md:aspect-[3/4]"
              />
            </div>
          </div>

          {/* Text */}
          <div className="md:pl-4 lg:pl-8">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t("Quiénes somos", "Who we are")}
            </p>
            <h2 className="mb-8 font-display text-5xl uppercase leading-[0.9] md:text-6xl lg:text-7xl">
              {t("Nuestra", "Our")}{" "}
              <span className="text-primary">{t("Identidad", "Identity")}</span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-foreground/80">
                {t(
                  "Somos una comunidad apasionada por la presencia de Dios, arraigada en la verdad Apostólica y comprometida con la transformación de nuestra ciudad en Houston.",
                  "We are a community passionate about God's presence, rooted in Apostolic truth, and committed to transforming our city of Houston.",
                )}
              </p>
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-block w-full rounded-xl border border-border px-8 py-4 text-center font-mono text-xs uppercase tracking-widest transition-all hover:bg-foreground hover:text-background md:w-auto"
                >
                  {t("Conoce más", "Learn more")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First-time visitors */}
      <PlanYourVisit compact />

      {/* Ministries */}
      <section className="bg-card px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-6xl uppercase tracking-tighter">
              {t("Ministerios", "Ministries")}
            </h2>
            <span className="eyebrow mb-4 text-muted-foreground">
              {t("Grupos y ministerios", "Groups & ministries")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
            {MINISTRIES.map((m) => (
              <Link
                key={m.number}
                to="/ministries"
                hash={m.slug}
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden border border-border bg-background p-8 md:aspect-[3/4]"
              >
                <img
                  src={MINISTRY_IMAGES[m.number]}
                  alt=""
                  width={1200}
                  height={1600}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10 transition-opacity duration-500 group-hover:via-background/40" />
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />

                <span className="relative z-10 inline-flex size-10 items-center justify-center bg-primary font-mono text-xs font-bold text-primary-foreground">
                  {m.number}
                </span>
                <div className="relative z-10">
                  <h3 className="mb-2 text-balance font-display text-4xl uppercase leading-none transition-colors group-hover:text-primary md:text-3xl lg:text-4xl">
                    {t(m.title)}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-foreground/70">
                    {m.subtitle}
                  </p>
                  <span className="mt-5 inline-block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-primary opacity-0 transition-all duration-500 group-hover:opacity-100">
                    {t("Conoce más →", "Learn more →")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-6xl uppercase tracking-tighter">
              {t("Vida en La Vid", "Life at The Vine")}
            </h2>
            <span className="eyebrow mb-4 text-muted-foreground">
              {t("Nuestra comunidad", "Our community")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
            {GALLERY.map((img) => (
              <img
                key={img.alt}
                src={img.src}
                alt={img.alt}
                width={1200}
                height={1600}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sermon */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="mx-auto grid max-w-6xl border border-border bg-background md:grid-cols-2">
          <div className="p-12 md:p-20">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-primary">
              {t("Última Palabra", "Latest Word")}
            </span>
            <h2 className="mb-8 text-balance font-display text-5xl uppercase leading-none md:text-6xl">
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
                to="/sermons"
                className="inline-block bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {t("Ver mensaje", "Watch now")}
              </Link>
              <Link
                to="/live"
                className="inline-block border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                {t("En Vivo", "Live")}
              </Link>
            </div>
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center bg-card p-1">
            {sermonUrl ? (
              <FacebookVideo
                url={sermonUrl}
                title={settings.latest_sermon_title || t("Último mensaje", "Latest message")}
                className="self-center"
              />
            ) : (
              <video
                src={sermonVideo}
                controls
                playsInline
                preload="metadata"
                className="size-full object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Email signup */}
      <NewsletterSignup />

      {/* Prayer CTA */}
      <section className="bg-primary px-6 py-20 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="eyebrow mb-4 block opacity-70">{t("Oración", "Prayer")}</span>
            <h2 className="text-balance font-display text-4xl uppercase leading-none md:text-6xl">
              {t("¿Necesitas oración?", "Need prayer?")}
            </h2>
            <p className="mt-4 max-w-xl font-mono text-sm italic opacity-80">
              {t(
                "Envíanos tu petición y nuestro equipo pastoral orará por ti esta semana.",
                "Send us your request and our pastoral team will pray for you this week.",
              )}
            </p>
          </div>
          <Link
            to="/prayer"
            className="inline-block bg-primary-foreground px-10 py-5 font-display uppercase tracking-widest text-primary transition-colors hover:bg-foreground hover:text-background"
          >
            {t("Enviar petición", "Send a request")}
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
