import { useCallback, useEffect, useState } from "react";
import { Copy, Mail, Trash2 } from "lucide-react";

import { deleteSubscriber, fetchSubscribers, type Subscriber } from "@/lib/subscribers";

/** Admin card: who signed up for announcements, with one-click copy for email. */
export function Subscribers() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const reload = useCallback(async () => {
    try {
      setItems(await fetchSubscribers());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista. / Could not load the list.");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(items.map((s) => s.email).join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar. / Could not copy.");
    }
  }

  async function remove(s: Subscriber) {
    if (!window.confirm(`¿Quitar ${s.email}? / Remove ${s.email}?`)) return;
    await deleteSubscriber(s.id);
    await reload();
  }

  return (
    <section className="mt-12 border border-border bg-card p-6 md:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Mail className="size-5 text-primary" />
          <h2 className="font-display text-3xl uppercase">
            Suscriptores{" "}
            <span className="font-mono text-base text-muted-foreground">({items.length})</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyAll}
            disabled={items.length === 0}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <Copy className="size-3.5" />{" "}
            {copied ? "Copiado / Copied" : "Copiar correos / Copy emails"}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {open ? "Ocultar / Hide" : "Ver lista / Show list"}
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-foreground/60">
        Personas que dejaron su correo en el sitio para recibir anuncios. Copia la lista y pégala en
        BCC al enviar un correo.
      </p>
      {error ? (
        <p role="alert" className="mt-4 font-mono text-xs text-destructive">
          {error}
        </p>
      ) : null}
      {open ? (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {items.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="truncate">{s.email}</span>
              <button
                type="button"
                aria-label={`Quitar ${s.email}`}
                onClick={() => remove(s)}
                className="inline-flex size-8 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Nadie todavía / Nobody yet
            </li>
          ) : null}
        </ul>
      ) : null}
    </section>
  );
}
