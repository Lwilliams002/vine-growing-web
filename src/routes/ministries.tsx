import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { MINISTRIES } from "@/lib/church";

const TITLE = "Ministries | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Youth, ladies, and kids ministries at The Vine Apostolic Church in Houston. Ministerios para jóvenes, damas y niños.";

export const Route = createFileRoute("/ministries")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ministries" },
    ],
    links: [{ rel: "canonical", href: "/ministries" }],
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

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {MINISTRIES.map((m) => (
            <article
              key={m.number}
              className="flex flex-col justify-between border border-border bg-card p-10"
            >
              <span className="font-mono text-xs text-primary">{m.number}</span>
              <div className="mt-16">
                <h2 className="mb-2 font-display text-3xl uppercase">{m.title}</h2>
                <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
                  {m.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-foreground/60">{m.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 border border-border p-12 text-center">
          <h2 className="font-display text-4xl uppercase">¿Quieres servir?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/60">
            Worship, hospitality, media, and outreach teams are always growing. Escríbenos
            y te conectamos con un equipo.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Contáctanos
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
