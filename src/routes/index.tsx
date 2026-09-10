import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CHURCH, MINISTRIES, SERVICES } from "@/lib/church";
import heroImg from "@/assets/hero-pastor.png.asset.json";
import churchBuildingImg from "@/assets/church-building.png.asset.json";
import worshipInsideImg from "@/assets/worship-inside.jpg.asset.json";
import sermonImg from "@/assets/sermon-still.jpg";

const TITLE = "The Vine Apostolic Church | Houston, TX";
const DESCRIPTION =
  "Apostolic church in north Houston. Sunday worship 10:00 AM, Wednesday Bible study 7:30 PM at 14615 Aldine Westfield Rd. Bilingual services — servicios bilingües.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Church",
          name: CHURCH.name,
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
  component: Home,
});

function Home() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg.url}
            alt="Pastor smiling while preaching at The Vine Apostolic Church pulpit"
            width={1920}
            height={1280}
            className="animate-zoom size-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="animate-fade-up relative z-10 max-w-4xl px-6 text-center">
          <span className="eyebrow mb-6 block text-primary">
            Houston, Texas — Apostolic &amp; Pentecostal
          </span>
          <h1 className="text-balance font-display text-7xl uppercase leading-[0.85] tracking-tighter md:text-[10rem]">
            The Vine <span className="text-primary">Apostolic</span> Church
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-foreground/70 md:text-xl">
            Un lugar para encontrar vida, propósito y el poder del Espíritu Santo.
            <span className="mt-2 block font-mono text-sm italic text-muted-foreground">
              A place to find life, purpose, and the power of the Holy Spirit.
            </span>
          </p>
        </div>
      </section>

      {/* Service times */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="mx-auto max-w-6xl bg-primary p-1">
          <div className="flex flex-col divide-y divide-border bg-background p-8 md:flex-row md:divide-x md:divide-y-0 md:p-12">
            <div className="flex-1 pb-8 md:pb-0 md:pr-12">
              <h2 className="mb-6 flex items-center gap-3 font-display text-4xl uppercase">
                <span className="size-3 bg-primary" /> Horarios / Services
              </h2>
              <div className="space-y-6">
                {SERVICES.map((s) => (
                  <div key={s.day}>
                    <div className="flex items-end justify-between border-b border-border pb-2">
                      <span className="font-display text-2xl uppercase">{s.day}</span>
                      <span className="font-mono text-primary">{s.time}</span>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {s.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between pt-8 md:pl-12 md:pt-0">
              <div>
                <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Ubicación / Location
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
                  Obtener Direcciones / Get Directions
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
          {/* Images */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
            <div className="overflow-hidden rounded-2xl md:rounded-3xl">
              <img
                src={worshipInsideImg.url}
                alt="Congregation worshipping inside The Vine Apostolic Church"
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover md:aspect-[3/4]"
              />
            </div>
            <div className="mx-auto w-3/4 overflow-hidden rounded-2xl md:mx-0 md:w-full md:rounded-3xl">
              <img
                src={churchBuildingImg.url}
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
              Our Identity
            </p>
            <h2 className="mb-8 font-display text-5xl uppercase leading-[0.9] md:text-6xl lg:text-7xl">
              Nuestra <span className="text-primary">Identidad</span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-foreground/80">
                Somos una comunidad apasionada por la presencia de Dios, arraigada en la
                verdad Apostólica y comprometida con la transformación de nuestra ciudad
                en Houston.
              </p>
              <div className="border-l border-primary/30 pl-4">
                <p className="font-mono text-sm italic leading-relaxed text-muted-foreground">
                  We are a community passionate about God&apos;s presence, rooted in
                  Apostolic truth, and committed to transforming our city of Houston.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-block w-full rounded-xl border border-border px-8 py-4 text-center font-mono text-xs uppercase tracking-widest transition-all hover:bg-foreground hover:text-background md:w-auto"
                >
                  Conoce Más / Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="bg-card px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex items-end justify-between">
            <h2 className="font-display text-6xl uppercase tracking-tighter">
              Ministerios
            </h2>
            <span className="eyebrow mb-4 text-muted-foreground">
              Groups &amp; Ministries
            </span>
          </div>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
            {MINISTRIES.map((m) => (
              <Link
                key={m.number}
                to="/ministries"
                className="group flex aspect-square flex-col justify-between border border-border bg-background p-8 transition-colors hover:bg-primary/5"
              >
                <span className="font-mono text-xs text-primary">{m.number}</span>
                <div>
                  <h3 className="mb-2 font-display text-3xl uppercase transition-colors group-hover:text-primary">
                    {m.title}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {m.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sermon */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="mx-auto grid max-w-6xl border border-border bg-background md:grid-cols-2">
          <div className="p-12 md:p-20">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-primary">
              Última Palabra / Latest Word
            </span>
            <h2 className="mb-8 text-balance font-display text-5xl uppercase leading-none md:text-6xl">
              El Poder del Espíritu Santo
            </h2>
            <p className="mb-10 font-mono text-sm italic text-foreground/60">
              &ldquo;Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de
              amor y de dominio propio.&rdquo;
            </p>
            <Link
              to="/sermons"
              className="inline-block bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Ver Mensaje / Watch Now
            </Link>
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center bg-card p-1">
            <img
              src={sermonImg}
              alt="Pastor preaching into a microphone"
              width={800}
              height={600}
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-20 items-center justify-center rounded-full border border-primary bg-primary/20 backdrop-blur-sm">
                <div className="ml-2 size-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Reel */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Síguenos / Follow Us
          </p>
          <h2 className="mb-8 font-display text-4xl uppercase leading-[0.9] md:text-5xl">
            Únete a <span className="text-primary">Nuestra Familia</span>
          </h2>
          <div className="mx-auto aspect-[267/476] w-full max-w-[320px] overflow-hidden rounded-2xl bg-card ring-1 ring-border">
            <iframe
              src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2055280448536382%2F&show_text=false&width=267&t=0"
              width="267"
              height="476"
              style={{ border: "none", overflow: "hidden", width: "100%", height: "100%" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="The Vine Apostolic Church Facebook Reel"
            />
          </div>
          <a
            href={CHURCH.facebook}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-xl border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
          >
            Ver Más en Facebook / More on Facebook
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
