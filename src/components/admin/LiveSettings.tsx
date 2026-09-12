import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DEFAULT_SETTINGS,
  fetchSettings,
  isFacebookVideoUrl,
  saveSettings,
  type SiteSettings,
} from "@/lib/settings";

const fieldClass =
  "rounded-none border-border bg-background px-4 py-6 font-body text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary";

/** Admin card: "we are live" switch plus the live and latest-sermon links. */
export function LiveSettings() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings().then((s) => {
      setForm(s);
      setLoaded(true);
    });
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setMessage(null);
  }

  const liveUrlBad = form.live_video_url.trim() !== "" && !isFacebookVideoUrl(form.live_video_url);
  const sermonUrlBad =
    form.latest_sermon_url.trim() !== "" && !isFacebookVideoUrl(form.latest_sermon_url);
  const liveWithoutUrl = form.is_live && form.live_video_url.trim() === "";

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (liveUrlBad || sermonUrlBad || liveWithoutUrl) return;
    setBusy(true);
    setMessage(null);
    try {
      await saveSettings(form);
      setMessage({ kind: "ok", text: "Guardado. / Saved." });
    } catch (err) {
      console.error(err);
      setMessage({ kind: "error", text: "No se pudo guardar. / Could not save." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSave}
      className={`mt-12 border bg-card p-6 md:p-10 ${form.is_live ? "border-destructive" : "border-border"}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Radio className={`size-5 ${form.is_live ? "text-destructive" : "text-primary"}`} />
          <h2 className="font-display text-3xl uppercase">En Vivo / Live</h2>
        </div>
        <label className="flex items-center gap-3 text-sm text-foreground/80">
          <Checkbox
            checked={form.is_live}
            disabled={!loaded}
            onCheckedChange={(v) => set("is_live", v === true)}
            className="rounded-none border-border data-[state=checked]:bg-destructive data-[state=checked]:text-white"
          />
          Estamos en vivo ahora / We are live now
        </label>
      </div>

      <p className="mt-4 text-sm text-foreground/60">
        Cuando inicies la transmisión en Facebook, copia el enlace del video en vivo, pégalo aquí y
        marca &ldquo;Estamos en vivo&rdquo;. Al terminar, desmárcalo y pega el enlace del video en
        &ldquo;Último mensaje&rdquo;.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <Label htmlFor="live_video_url" className="eyebrow mb-3 block text-muted-foreground">
            Enlace del video en vivo / Live video link
          </Label>
          <Input
            id="live_video_url"
            type="url"
            placeholder="https://www.facebook.com/thevinehouston/videos/…"
            value={form.live_video_url}
            disabled={!loaded}
            onChange={(e) => set("live_video_url", e.target.value)}
            className={fieldClass}
          />
          {liveUrlBad ? (
            <Hint error>
              Debe ser un enlace de video de Facebook. / Must be a Facebook video link.
            </Hint>
          ) : liveWithoutUrl ? (
            <Hint error>Pega el enlace del video en vivo. / Paste the live video link.</Hint>
          ) : null}
        </div>
        <div>
          <Label htmlFor="latest_sermon_url" className="eyebrow mb-3 block text-muted-foreground">
            Último mensaje (video) / Latest sermon link
          </Label>
          <Input
            id="latest_sermon_url"
            type="url"
            placeholder="https://www.facebook.com/thevinehouston/videos/…"
            value={form.latest_sermon_url}
            disabled={!loaded}
            onChange={(e) => set("latest_sermon_url", e.target.value)}
            className={fieldClass}
          />
          {sermonUrlBad ? (
            <Hint error>
              Debe ser un enlace de video de Facebook. / Must be a Facebook video link.
            </Hint>
          ) : (
            <Hint>Se muestra en Inicio, Mensajes y En Vivo cuando no hay transmisión.</Hint>
          )}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="latest_sermon_title" className="eyebrow mb-3 block text-muted-foreground">
            Título del último mensaje / Latest sermon title
          </Label>
          <Input
            id="latest_sermon_title"
            placeholder="Ej. El Poder del Espíritu Santo"
            value={form.latest_sermon_title}
            disabled={!loaded}
            onChange={(e) => set("latest_sermon_title", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy || !loaded || liveUrlBad || sermonUrlBad || liveWithoutUrl}
          className="bg-primary px-8 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-60"
        >
          {busy ? "Guardando… / Saving…" : "Guardar / Save"}
        </button>
        {message ? (
          <p
            role="status"
            className={`font-mono text-xs ${message.kind === "ok" ? "text-primary" : "text-destructive"}`}
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Hint({ children, error }: { children: React.ReactNode; error?: boolean }) {
  return (
    <p
      className={`mt-2 font-mono text-[10px] ${error ? "text-destructive" : "text-muted-foreground/70"}`}
    >
      {children}
    </p>
  );
}
