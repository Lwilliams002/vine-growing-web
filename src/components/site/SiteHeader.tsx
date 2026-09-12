import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone } from "lucide-react";

import logo from "@/assets/vine-logo.png";
import { CHURCH } from "@/lib/church";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/about", label: "Nosotros" },
  { to: "/ministries", label: "Ministries" },
  { to: "/sermons", label: "Sermons" },
  { to: "/live", label: "En Vivo" },
  { to: "/events", label: "Events" },
  { to: "/prayer", label: "Oración" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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

      <div className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: "text-primary" }}
            className="transition-colors hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`tel:${CHURCH.phone}`}
          className="hidden items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground transition-colors hover:text-primary lg:flex"
          aria-label={`Llamar / Call ${CHURCH.phoneDisplay}`}
        >
          <Phone className="size-3.5" /> {CHURCH.phoneDisplay}
        </a>
        <Link
          to="/giving"
          className="bg-foreground px-5 py-2 font-display text-xs uppercase tracking-widest text-background transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Donar
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex size-10 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-border bg-background sm:max-w-sm">
            <SheetTitle className="font-display text-2xl uppercase tracking-wider">
              {CHURCH.shortName}
            </SheetTitle>
            <ul className="mt-10 space-y-6 font-display text-3xl uppercase">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "text-primary" }}
                    className="block transition-colors hover:text-primary"
                  >
                    {item.label}
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
                  Donar / Give
                </Link>
              </li>
            </ul>
            <div className="mt-10 grid grid-cols-2 gap-2">
              <a
                href={`tel:${CHURCH.phone}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                <Phone className="size-3.5" /> Llamar
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
