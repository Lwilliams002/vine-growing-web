import { Link } from "@tanstack/react-router";
import logo from "@/assets/vine-logo.png.asset.json";
import { CHURCH } from "@/lib/church";

const NAV = [
  { to: "/about", label: "Nosotros" },
  { to: "/ministries", label: "Ministries" },
  { to: "/sermons", label: "Sermons" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={logo.url}
          alt={`${CHURCH.name} logo`}
          width={40}
          height={40}
          className="size-10 rounded-full bg-foreground p-0.5"
        />
        <span className="font-display text-xl uppercase tracking-wider">
          {CHURCH.shortName}
        </span>
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

      <Link
        to="/giving"
        className="bg-foreground px-5 py-2 font-display text-xs uppercase tracking-widest text-background transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Donar
      </Link>
    </nav>
  );
}
