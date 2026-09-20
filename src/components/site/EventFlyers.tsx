import { useLang } from "@/lib/i18n";
import type { Flyer } from "@/lib/flyers";
import { eventDateParts } from "./Announcements";

/** One flyer: the image opens full size in a new tab. */
export function FlyerCard({ flyer, featured = false }: { flyer: Flyer; featured?: boolean }) {
  const { t, lang } = useLang();
  const src = flyer.image[lang];
  const date = eventDateParts(flyer.date);
  return (
    <article className="group border border-border bg-card transition-colors hover:border-primary/60">
      <a href={src} target="_blank" rel="noreferrer" aria-label={t(flyer.title)}>
        <img
          src={src}
          alt={t(flyer.title)}
          width={flyer.size.width}
          height={flyer.size.height}
          loading={featured ? "eager" : "lazy"}
          className="w-full object-cover"
        />
      </a>
      <div className="flex gap-6 p-6 md:p-8">
        <div className="flex w-16 shrink-0 flex-col items-center border-r border-border pr-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {date.month}
          </span>
          <span className="font-display text-4xl leading-none text-primary">{date.day}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {date.weekday}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-balance font-display text-2xl uppercase leading-none">
            {t(flyer.title)}
          </h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-primary">
            {flyer.time}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/70">{t(flyer.detail)}</p>
        </div>
      </div>
    </article>
  );
}

export function FlyerGrid({ flyers }: { flyers: Flyer[] }) {
  if (flyers.length === 0) return null;
  return (
    <div className="grid gap-1 md:grid-cols-2">
      {flyers.map((f) => (
        <FlyerCard key={f.id} flyer={f} />
      ))}
    </div>
  );
}
