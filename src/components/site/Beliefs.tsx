import { BookOpen } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BELIEFS, BELIEFS_SOURCE, scriptureUrl } from "@/lib/beliefs";
import { useLang } from "@/lib/i18n";

/**
 * The 19 doctrinal principles of the Apostolic Assembly of the Faith in
 * Christ Jesus, word for word, with each article's scripture shown as sources.
 */
export function Beliefs() {
  const { t, lang } = useLang();

  return (
    <section id="creemos" className="scroll-mt-32 bg-card px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow mb-4 block text-primary">
              {t("Nuestra doctrina", "Our doctrine")}
            </span>
            <h2 className="text-balance font-display text-5xl uppercase leading-[0.9] tracking-tighter md:text-6xl">
              {t("Lo Que Creemos", "What We Believe")}
            </h2>
          </div>
          <p className="max-w-md text-sm text-foreground/60 md:text-right">
            {t(
              "Los 19 principios doctrinales de la Asamblea Apostólica de la Fe en Cristo Jesús, de la cual somos parte.",
              "The 19 doctrinal principles of the Apostolic Assembly of the Faith in Christ Jesus, of which we are a part.",
            )}
          </p>
        </div>

        <Accordion type="single" collapsible className="border-t border-border">
          {BELIEFS.map((b) => {
            const paragraphs = b.paragraphs[lang];
            const refs = b.scripture[lang];
            const id = String(b.n).padStart(2, "0");
            return (
              <AccordionItem key={b.n} value={id} className="border-border">
                <AccordionTrigger className="gap-6 py-6 text-left hover:no-underline [&>svg]:size-5 [&>svg]:text-primary">
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-primary">{id}</span>
                    <span className="font-display text-2xl uppercase leading-none md:text-3xl">
                      {t(b.title)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-10">
                  <div className="grid gap-10 md:grid-cols-[1fr_260px] md:pl-11">
                    <div className="space-y-4 text-base leading-relaxed text-foreground/80">
                      {paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    {refs.length > 0 ? (
                      <aside className="border-l border-primary/30 pl-6 md:border-l-0 md:border-t-0 md:pl-0">
                        <h4 className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          <BookOpen className="size-3.5 text-primary" />
                          {t("Fuente bíblica", "Scripture")}
                        </h4>
                        <ul className="flex flex-wrap gap-2">
                          {refs.map((r) => (
                            <li key={r.label}>
                              <a
                                href={scriptureUrl(r, lang)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block border border-border bg-background px-3 py-1.5 font-mono text-[11px] tracking-wide text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                              >
                                {r.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </aside>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <p className="mt-10 font-mono text-[10px] uppercase leading-loose tracking-widest text-muted-foreground">
          {t("Texto oficial de la", "Official text of the")}{" "}
          <a
            href={BELIEFS_SOURCE.url[lang]}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            {BELIEFS_SOURCE.name[lang]}
          </a>
          . {t("Versículos en", "Verses open in")} {lang === "es" ? "Reina-Valera 1960" : "KJV"}.
        </p>
      </div>
    </section>
  );
}
