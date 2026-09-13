import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone } from "lucide-react";

import logo from "@/assets/vine-logo.png";
import { CHURCH } from "@/lib/church";
import { LanguageToggle, useLang, type Bilingual } from "@/lib/i18n";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV: readonly { to: string; label: Bilingual }[] = [
  { to: "/about", label: { es: "Nosotros", en: "About" } },
  { to: "/ministries", label: { es: "Ministerios", en: "Ministries" } },
  { to: "/sermons", label: { es: "Mensajes", en: "Sermons" } },
  { to: "/live", label: { es: "En Vivo", en: "Live" } },
  { to: "/events", label: { es: "Eventos", en: "Events" } },
  { to: "/prayer", label: { es: "Oración", en: "Prayer" } },
  { to: "/contact", label: { es: "Contacto", en: "Contact" } },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={logo}
          alt={`${CHURCH.name} logo`}
          width={40}
          height={40}
          className="size-10 rounded-full bg-foreground p-0.5"
        />
        <span className="font-display text-xl uppercase tracking-wider">{CHURCH.shortName}</span>
      </Link>

      <div className="hidden gap-7 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: "text-primary" }}
            className="transition-colors hover:text-primary"
          >
            {t(item.label)}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`tel:${CHURCH.phone}`}
          className="hidden items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground transition-colors hover:text-primary xl:flex"
          aria-label={`${t("Llamar", "Call")} ${CHURCH.phoneDisplay}`}
        >
          <Phone className="size-3.5" /> {CHURCH.phoneDisplay}
        </a>
        <LanguageToggle className="hidden md:inline-flex" />
        <Link
          to="/giving"
          className="bg-foreground px-5 py-2 font-display text-xs uppercase tracking-widest text-background transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {t("Donar", "Give")}
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex size-10 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
            aria-label={t("Abrir menú", "Open menu")}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-border bg-background sm:max-w-sm">
            <div className="flex items-center justify-between pr-8">
              <SheetTitle className="font-display text-2xl uppercase tracking-wider">
                {CHURCH.shortName}
              </SheetTitle>
              <LanguageToggle />
            </div>
            <ul className="mt-10 space-y-6 font-display text-3xl uppercase">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "text-primary" }}
                    className="block transition-colors hover:text-primary"
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/giving"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-primary" }}
                  className="block transition-colors hover:text-primary"
                >
                  {t("Donar", "Give")}
                </Link>
              </li>
            </ul>
            <div className="mt-10 grid grid-cols-2 gap-2">
              <a
                href={`tel:${CHURCH.phone}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                <Phone className="size-3.5" /> {t("Llamar", "Call")}
              </a>
              <a
                href={`https://wa.me/${CHURCH.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle className="size-3.5" /> WhatsApp
              </a>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase leading-loose tracking-widest text-muted-foreground">
              {CHURCH.address}
              <br />
              {CHURCH.city}
              <br />
              {CHURCH.phoneDisplay}
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
