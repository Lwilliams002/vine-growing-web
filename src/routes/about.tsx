import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { Beliefs } from "@/components/site/Beliefs";
import { SITE_URL } from "@/lib/church";
import { useLang } from "@/lib/i18n";
import baptismImg from "@/assets/baptism.jpg";
import congregationImg from "@/assets/congregation-worship.jpg";
import handsRaisedImg from "@/assets/hands-raised-man.jpg";
import pastorPrayerImg from "@/assets/pastor-suit.jpg";

const TITLE = "About Us & What We Believe | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Who we are and what we believe: an Apostolic, Spirit-filled, bilingual congregation in north Houston, part of the Apostolic Assembly of the Faith in Christ Jesus.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: About,
});

function About() {
  const { t } = useLang();

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={t("Nosotros", "About us")}
        title={t("Una Vid Que Permanece", "A Vine That Remains")}
        intro={t(
          "The Vine Apostolic Church es una familia llena del Espíritu en el norte de Houston. Somos una iglesia bilingüe donde cada persona, de cualquier edad o trasfondo, encuentra un lugar en la mesa.",
          "The Vine Apostolic Church is a Spirit-filled family in north Houston. We're a bilingual church where every person, of any age or background, finds a place at the table.",
        )}
      />

      <section className="mx-auto grid max-w-6xl gap-20 px-6 py-24 md:grid-cols-2 md:items-center">
        <img
          src={baptismImg}
          alt={t(
            "Pastor bautizando a un nuevo creyente en The Vine",
            "Pastor baptizing a new believer at The Vine",
          )}
          width={800}
          height={1000}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover ring-1 ring-border"
        />
        <div className="space-y-6 leading-relaxed text-foreground/70">
          <h2 className="font-display text-4xl uppercase leading-none text-foreground">
            {t("Nuestra", "Our")} <span className="text-primary">{t("Historia", "Story")}</span>
          </h2>
          <p>
            {t(
              "Nacimos del deseo de ver familias restauradas por el poder del evangelio. Cada domingo nos reunimos en Aldine Westfield Road para adorar, escuchar la Palabra y orar los unos por los otros.",
              "We were born from a desire to see families restored by the power of the gospel. Every Sunday we gather on Aldine Westfield Road to worship, hear the Word, and pray for one another.",
            )}
          </p>
          <p className="font-mono text-sm italic">
            {t(
              "Los visitantes son familia desde el primer saludo.",
              "Guests are family from the first handshake.",
            )}
          </p>
          <a
            href="#creemos"
            className="inline-block border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
          >
            {t("Lo que creemos ↓", "What we believe ↓")}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {t("Nuestra Familia", "Our Family")}
        </p>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {[
            { src: congregationImg, alt: "Congregation worshipping together on a Sunday" },
            { src: handsRaisedImg, alt: "Congregation worshipping with hands raised" },
            { src: pastorPrayerImg, alt: "Pastor praying with the congregation" },
          ].map((img) => (
            <img
              key={img.alt}
              src={img.src}
              alt={img.alt}
              width={1200}
              height={1600}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover ring-1 ring-border"
            />
          ))}
        </div>
      </section>

      <Beliefs />

      <SiteFooter />
    </>
  );
}
