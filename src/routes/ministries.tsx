import { createFileRoute, Link } from "@tanstack/react-router";
import { HandHeart, Megaphone, Music, Video } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { MINISTRIES, SERVE_TEAMS, SITE_URL } from "@/lib/church";
import youthImg from "@/assets/hands-raised-man.jpg";
import ladiesImg from "@/assets/worship-woman-hands.jpg";
import kidsImg from "@/assets/kids-worship.jpg";

// Different photos than the home-page teaser cards so the page feels new.
const MINISTRY_IMAGES = {
  "01": { src: youthImg, alt: "Young adults worshipping with hands raised" },
  "02": { src: ladiesImg, alt: "Woman worshipping with hands lifted" },
  "03": { src: kidsImg, alt: "Children worshipping during Sunday service" },
} as const;

const TEAM_ICONS = [Music, Video, HandHeart, Megaphone] as const;

const TITLE = "Ministries | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Youth, ladies, and kids ministries at The Vine Apostolic Church in Houston, plus worship, media, hospitality, and outreach teams. Ministerios para jóvenes, damas y niños.";

export const Route = createFileRoute("/ministries")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/ministries` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ministries` }],
  }),
  component: Ministries,
});

function Ministries() {
  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Groups & Ministries"
        title="Ministerios"
        intro="Encuentra tu lugar en la familia. Every ministry is a doorway into community, discipleship, and service."
      />

      {/* Jump links */}
      <nav
        aria-label="Ministries"
        className="sticky top-[73px] z-40 border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl gap-8 overflow-x-auto px-6 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {MINISTRIES.map((m) => (
            <a
              key={m.slug}
              href={`#${m.slug}`}
              className="whitespace-nowrap transition-colors hover:text-primary"
            >
              <span className="mr-2 text-primary">{m.number}</span>
              {m.title}
            </a>
          ))}
          <a href="#servir" className="whitespace-nowrap transition-colors hover:text-primary">
            <span className="mr-2 text-primary">04</span>Sirve / Serve
          </a>
        </div>
      </nav>

      {/* One full section per ministry, alternating photo side */}
      <div className="divide-y divide-border">
        {MINISTRIES.map((m, i) => {
          const img = MINISTRY_IMAGES[m.number];
          const flip = i % 2 === 1;
          return (
            <section
              key={m.slug}
              id={m.slug}
              className="scroll-mt-32 px-6 py-24 md:py-32"
              style={{ backgroundColor: flip ? "var(--card)" : undefined }}
            >
              <div
                className={`mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20 ${
                  flip ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative overflow-hidden ring-1 ring-border">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={1200}
                    height={1500}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <span className="absolute left-0 top-0 inline-flex size-14 items-center justify-center bg-primary font-mono text-sm font-bold text-primary-foreground">
                    {m.number}
                  </span>
                </div>

                <div>
                  <span className="eyebrow mb-4 block text-primary">{m.subtitle}</span>
                  <h2 className="text-balance font-display text-5xl uppercase leading-[0.9] md:text-6xl">
                    {m.title}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-foreground/70">{m.body}</p>

                  <dl className="mt-10 space-y-8 border-l border-primary/30 pl-6">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Para quién / Who
                    </dt>
                    <dd className="-mt-6 text-sm text-foreground/80">{m.audience}</dd>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Qué esperar / What to expect
                    </dt>
                    <dd className="-mt-6">
                      <ul className="space-y-2 text-sm text-foreground/80">
                        {m.highlights.map((h) => (
                          <li key={h} className="flex gap-3">
                            <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </dl>

                  <Link
                    to="/contact"
                    className="mt-10 inline-block bg-primary px-8 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    Conéctate / Get Connected
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Serve teams */}
      <section id="servir" className="scroll-mt-32 border-t border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-5xl uppercase tracking-tighter md:text-6xl">
              Sirve con nosotros
            </h2>
            <span className="eyebrow mb-3 text-muted-foreground">Serve teams</span>
          </div>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {SERVE_TEAMS.map((t, i) => {
              const Icon = TEAM_ICONS[i] ?? Music;
              return (
                <div
                  key={t.title}
                  className="group border border-border bg-card p-8 transition-colors hover:border-primary"
                >
                  <Icon className="size-8 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-8 font-display text-2xl uppercase">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">{t.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-border p-10 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-3xl uppercase">¿Quieres servir?</h3>
              <p className="mt-2 max-w-xl text-sm text-foreground/60">
                Escríbenos y te conectamos con un equipo. Tell us where you'd like to help and we'll
                get you plugged in.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-block shrink-0 bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
