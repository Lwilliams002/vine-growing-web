import { Pin } from "lucide-react";

import type { Announcement } from "@/lib/announcements";

const MONTHS_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
const DAYS_ES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

/** Splits "YYYY-MM-DD" into display parts without timezone drift. */
export function eventDateParts(iso: string): { day: string; month: string; weekday: string } {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  return {
    day: String(d ?? ""),
    month: MONTHS_ES[(m ?? 1) - 1] ?? "",
    weekday: DAYS_ES[date.getDay()] ?? "",
  };
}

export function AnnouncementCard({ a }: { a: Announcement }) {
  const date = a.event_date ? eventDateParts(a.event_date) : null;

  return (
    <article className="group relative flex gap-6 border border-border bg-card p-6 transition-colors hover:border-primary/60 md:p-8">
      <div className="flex w-16 shrink-0 flex-col items-center justify-start border-r border-border pr-6 text-center">
        {date ? (
          <>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {date.weekday}
            </span>
            <span className="font-display text-4xl leading-none text-primary">{date.day}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {date.month}
            </span>
          </>
        ) : (
          <span className="font-mono text-[10px] uppercase leading-tight tracking-widest text-primary">
            Aviso
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-balance font-display text-2xl uppercase leading-none">{a.title}</h3>
          {a.is_pinned ? (
            <Pin className="size-4 shrink-0 text-primary" aria-label="Fijado / Pinned" />
          ) : null}
        </div>
        {a.event_time ? (
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-primary">
            {a.event_time}
          </p>
        ) : null}
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/70">
          {a.body}
        </p>
        {a.link_url ? (
          <a
            href={a.link_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
          >
            {a.link_label || "Más información / Learn more"} →
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function AnnouncementList({
  items,
  emptyText,
}: {
  items: Announcement[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return emptyText ? (
      <p className="border border-dashed border-border p-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {emptyText}
      </p>
    ) : null;
  }
  return (
    <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <AnnouncementCard key={a.id} a={a} />
      ))}
    </div>
  );
}
