import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { SITE_URL } from "@/lib/church";
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

const BELIEFS = [
  {
    number: "01",
    title: "La Palabra / The Word",
    body: "Creemos que la Biblia es la Palabra inspirada de Dios, nuestra única regla de fe y conducta.",
  },
  {
    number: "02",
    title: "Un Solo Dios / One God",
    body: "Creemos en un solo Dios, manifestado en Jesucristo, en quien habita corporalmente toda la plenitud de la Deidad.",
  },
  {
    number: "03",
    title: "Nuevo Nacimiento",
    body: "Arrepentimiento, bautismo en el nombre de Jesucristo y la llenura del Espíritu Santo.",
  },
  {
    number: "04",
    title: "Vida Santa / Holy Living",
    body: "Una vida transformada, dedicada a la oración, a la comunión y al servicio a nuestra ciudad.",
  },
];

function About() {
  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Nosotros / About"
        title="Una Vid Que Permanece"
        intro="The Vine Apostolic Church is a Spirit-filled family in north Houston. Somos una iglesia bilingüe donde cada persona — de cualquier edad o trasfondo — encuentra un lugar en la mesa."
      />

      <section className="mx-auto grid max-w-6xl gap-20 px-6 py-24 md:grid-cols-2 md:items-center">
        <img
          src={baptismImg}
          alt="Pastor baptizing a new believer at The Vine Apostolic Church"
          width={800}
          height={1000}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover ring-1 ring-border"
        />
        <div className="space-y-6 leading-relaxed text-foreground/70">
          <h2 className="font-display text-4xl uppercase leading-none text-foreground">
            Nuestra <span className="text-primary">Historia</span>
          </h2>
          <p>
            Nacimos del deseo de ver familias restauradas por el poder del evangelio. Cada domingo
            nos reunimos en Aldine Westfield Road para adorar, escuchar la Palabra y orar los unos
            por los otros.
          </p>
          <p className="font-mono text-sm italic">
            We gather every week on Aldine Westfield Road to worship, hear the Word, and pray for
            one another. Guests are family from the first handshake.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Nuestra Familia / Our Family
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
          <h2 className="mb-16 font-display text-5xl uppercase tracking-tighter">Lo Que Creemos</h2>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {BELIEFS.map((b) => (
              <div key={b.number} className="border border-border bg-background p-10">
                <span className="font-mono text-xs text-primary">{b.number}</span>
                <h3 className="mb-3 mt-6 font-display text-2xl uppercase">{b.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/60">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
