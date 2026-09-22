import { Link } from "@tanstack/react-router";

import logo from "@/assets/vine-logo.png";
import { CHURCH } from "@/lib/church";
import { useLang, type Bilingual } from "@/lib/i18n";

const LINKS: readonly { to: string; label: Bilingual }[] = [
  { to: "/giving", label: { es: "Donar", en: "Give" } },
  { to: "/ministries", label: { es: "Ministerios", en: "Ministries" } },
  { to: "/events", label: { es: "Eventos", en: "Events" } },
  { to: "/live", label: { es: "En Vivo", en: "Live" } },
  { to: "/prayer", label: { es: "Oración", en: "Prayer" } },
  { to: "/contact", label: { es: "Contacto", en: "Contact" } },
  { to: "/privacy", label: { es: "Privacidad", en: "Privacy" } },
];

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="bg-surface-deep px-6 pb-16 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-20 border-b border-border pb-20 md:flex-row">
          <div className="max-w-xs">
            <img
              src={logo}
              alt={`${CHURCH.name} logo`}
              width={64}
              height={64}
              loading="lazy"
              className="mb-8 size-16 rounded-full bg-foreground p-1"
            />
            <h3 className="mb-4 font-display text-3xl uppercase tracking-tighter">
              The Vine Houston
            </h3>
            <p className="font-mono text-xs uppercase leading-loose tracking-widest text-muted-foreground">
              {t(
                "Estableciendo el Reino de Dios en la ciudad espacial.",
                "Establishing God's Kingdom in the Space City.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-20">
            <div>
              <h4 className="mb-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t("Enlaces", "Quick links")}
              </h4>
              <ul className="space-y-4 font-display text-lg uppercase">
                {LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition-colors hover:text-primary">
                      {t(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t("Contacto", "Contact")}
              </h4>
              <address className="font-display text-lg uppercase not-italic leading-tight text-foreground/70">
                {CHURCH.address}
                <br />
                {CHURCH.city}
                <br />
                <a
                  href={`tel:${CHURCH.phone}`}
                  className="mt-6 block font-mono text-[10px] tracking-normal text-primary"
                >
                  {CHURCH.phoneDisplay}
                </a>
                <a
                  href={`https://wa.me/${CHURCH.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block font-mono text-[10px] tracking-normal text-primary"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${CHURCH.email}`}
                  className="mt-2 block font-mono text-[10px] lowercase tracking-normal text-primary"
                >
                  {CHURCH.email}
                </a>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-8 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} {CHURCH.name}.{" "}
            {t("Todos los derechos reservados.", "All rights reserved.")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-colors hover:text-primary"
            >
              Admin
            </Link>
            <a
              href={CHURCH.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex size-8 items-center justify-center rounded-full border border-border font-mono text-[10px] text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              FB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
