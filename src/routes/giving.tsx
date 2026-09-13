import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { CHURCH, SITE_URL } from "@/lib/church";
import { useLang } from "@/lib/i18n";

const TITLE = "Giving | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Support the ministry of The Vine Apostolic Church in Houston with your tithes and offerings. Diezmos y ofrendas.";

export const Route = createFileRoute("/giving")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/giving` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/giving` }],
  }),
  component: Giving,
});

function Giving() {
  const { t } = useLang();

  const ways = [
    {
      number: "01",
      title: t("En el Servicio", "At the Service"),
      body: t(
        "Trae tu diezmo u ofrenda a cualquiera de nuestros servicios semanales.",
        "Bring your tithe or offering to any of our weekly services.",
      ),
    },
    {
      number: "02",
      title: t("Por Correo", "By Mail"),
      body: `${CHURCH.address}, ${CHURCH.city}`,
    },
    {
      number: "03",
      title: t("En Línea", "Online"),
      body: t(
        "Da de forma segura en línea con tarjeta o cuenta bancaria, en cualquier momento.",
        "Give securely online with a card or bank account, anytime.",
      ),
      href: CHURCH.givingUrl,
      cta: t("Donar en Línea", "Give Online"),
    },
  ];

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={t("Diezmos y Ofrendas", "Tithes and Offerings")}
        title={t("Apoye La Misión", "Support the Mission")}
        intro={t(
          "Tu generosidad sostiene la obra en Houston: alcance comunitario, ministerio de niños y misiones.",
          "Your generosity sustains the work in Houston: community outreach, kids ministry, and missions.",
        )}
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {ways.map((w) => (
            <div key={w.number} className="border border-border bg-card p-10">
              <span className="font-mono text-xs text-primary">{w.number}</span>
              <h2 className="mb-3 mt-10 font-display text-2xl uppercase">{w.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/60">{w.body}</p>
              {"href" in w ? (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-block bg-primary px-8 py-3 font-display text-sm uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  {w.cta}
                </a>
              ) : null}
            </div>
          ))}
        </div>

        <blockquote className="mx-auto mt-24 max-w-2xl text-center font-mono text-sm italic text-foreground/60">
          {t(
            "“Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.”",
            "“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”",
          )}
          <span className="mt-4 block not-italic uppercase tracking-widest text-primary">
            {t("2 Corintios 9:7", "2 Corinthians 9:7")}
          </span>
        </blockquote>
      </section>

      <SiteFooter />
    </>
  );
}
