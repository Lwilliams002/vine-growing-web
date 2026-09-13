import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { SITE_URL } from "@/lib/church";
import { useLang, type Bilingual } from "@/lib/i18n";
import baptismImg from "@/assets/baptism.jpg";
import congregationImg from "@/assets/congregation-worship.jpg";
import handsRaisedImg from "@/assets/hands-raised-man.jpg";
import pastorPrayerImg from "@/assets/pastor-suit.jpg";

const TITLE = "About Us | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Who we are: an Apostolic, Spirit-filled, bilingual congregation in north Houston rooted in the doctrine of the apostles.";

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

const BELIEFS: { number: string; title: Bilingual; body: Bilingual }[] = [
  {
    number: "01",
    title: { es: "La Palabra", en: "The Word" },
    body: {
      es: "Creemos que la Biblia es la Palabra inspirada de Dios, nuestra única regla de fe y conducta.",
      en: "We believe the Bible is the inspired Word of God, our only rule of faith and conduct.",
    },
  },
  {
    number: "02",
    title: { es: "Un Solo Dios", en: "One God" },
    body: {
      es: "Creemos en un solo Dios, manifestado en Jesucristo, en quien habita corporalmente toda la plenitud de la Deidad.",
      en: "We believe in one God, revealed in Jesus Christ, in whom all the fullness of the Godhead dwells bodily.",
    },
  },
  {
    number: "03",
    title: { es: "Nuevo Nacimiento", en: "New Birth" },
    body: {
      es: "Arrepentimiento, bautismo en el nombre de Jesucristo y la llenura del Espíritu Santo.",
      en: "Repentance, baptism in the name of Jesus Christ, and the infilling of the Holy Spirit.",
    },
  },
  {
    number: "04",
    title: { es: "Vida Santa", en: "Holy Living" },
    body: {
      es: "Una vida transformada, dedicada a la oración, a la comunión y al servicio a nuestra ciudad.",
      en: "A transformed life devoted to prayer, fellowship, and serving our city.",
    },
  },
];

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

      <section className="bg-card px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 font-display text-5xl uppercase tracking-tighter">
            {t("Lo Que Creemos", "What We Believe")}
          </h2>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {BELIEFS.map((b) => (
              <div key={b.number} className="border border-border bg-background p-10">
                <span className="font-mono text-xs text-primary">{b.number}</span>
                <h3 className="mb-3 mt-6 font-display text-2xl uppercase">{t(b.title)}</h3>
                <p className="text-sm leading-relaxed text-foreground/60">{t(b.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
