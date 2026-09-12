import { Baby, Car, Clock, Languages, Shirt, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { CHURCH } from "@/lib/church";

type Item = { icon: LucideIcon; title: string; es: string; en: string };

const ITEMS: Item[] = [
  {
    icon: Shirt,
    title: "¿Qué me pongo? / What do I wear?",
    es: "Ven tal como eres. Verás desde trajes hasta jeans; lo importante es que vengas.",
    en: "Come as you are. You'll see everything from suits to jeans. What matters is that you come.",
  },
  {
    icon: Car,
    title: "Estacionamiento / Parking",
    es: "Estacionamiento gratuito en el mismo edificio sobre Aldine Westfield Rd. Llega 10 minutos antes y te ayudamos a ubicarte.",
    en: "Free parking on site at Aldine Westfield Rd. Arrive 10 minutes early and our greeters will point you the right way.",
  },
  {
    icon: Baby,
    title: "Niños / Kids",
    es: "Vine Kids recibe a niños de 3 a 11 años durante el servicio dominical, en un espacio seguro con maestros dedicados. Los bebés son bienvenidos contigo en el santuario.",
    en: "Vine Kids welcomes ages 3 to 11 during the Sunday service in a safe room with dedicated teachers. Babies are welcome with you in the sanctuary.",
  },
  {
    icon: Clock,
    title: "¿Cuánto dura? / How long is it?",
    es: "Alrededor de 90 minutos: alabanza, un mensaje de la Palabra y un tiempo de oración.",
    en: "About 90 minutes: worship, a message from the Word, and a time of prayer.",
  },
  {
    icon: Languages,
    title: "Idioma / Language",
    es: "9:00 AM en inglés y 11:30 AM en español. Eres bienvenido en cualquiera de los dos, sin importar tu idioma.",
    en: "9:00 AM in English and 11:30 AM in Spanish. You're welcome at either, whatever language you speak.",
  },
];

export function PlanYourVisit({ compact = false }: { compact?: boolean }) {
  return (
    <section id="visita" className="scroll-mt-32 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow mb-4 block text-primary">Primera vez / First time?</span>
            <h2 className="text-balance font-display text-5xl uppercase leading-[0.9] tracking-tighter md:text-6xl">
              Planea tu visita
            </h2>
          </div>
          <p className="max-w-sm text-sm text-foreground/60 md:text-right">
            Lo que la mayoría quiere saber antes de venir.
            <span className="block font-mono text-xs italic text-muted-foreground">
              What most people want to know before they come.
            </span>
          </p>
        </div>

        <div
          className={`grid gap-1 sm:grid-cols-2 ${compact ? "lg:grid-cols-5" : "lg:grid-cols-3"}`}
        >
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="border border-border bg-card p-7 transition-colors hover:border-primary/60"
              >
                <Icon className="size-7 text-primary" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-xl uppercase leading-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.es}</p>
                <p className="mt-2 font-mono text-xs italic leading-relaxed text-muted-foreground">
                  {item.en}
                </p>
              </div>
            );
          })}
          {!compact ? (
            <div className="flex flex-col justify-between border border-primary bg-primary p-7 text-primary-foreground">
              <div>
                <h3 className="font-display text-2xl uppercase leading-tight">
                  ¿Otra pregunta? / Another question?
                </h3>
                <p className="mt-3 text-sm opacity-80">
                  Llámanos, escríbenos por WhatsApp o pasa a saludar el domingo.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${CHURCH.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary-foreground px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-foreground hover:text-background"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${CHURCH.phone}`}
                  className="border border-primary-foreground/40 px-5 py-3 text-center font-mono text-xs uppercase tracking-widest transition-colors hover:bg-primary-foreground hover:text-primary"
                >
                  Llamar {CHURCH.phoneDisplay}
                </a>
              </div>
            </div>
          ) : null}
        </div>

        {compact ? (
          <Link
            to="/contact"
            hash="visita"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            Más detalles y cómo llegar / Details &amp; directions →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
