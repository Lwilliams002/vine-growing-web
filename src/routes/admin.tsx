import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Session } from "@supabase/supabase-js";
import { Eye, EyeOff, LogOut, Pencil, Pin, Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CHURCH } from "@/lib/church";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  EMPTY_FORM,
  announcementFormSchema,
  createAnnouncement,
  deleteAnnouncement,
  fetchAllAnnouncements,
  toForm,
  updateAnnouncement,
  type Announcement,
  type AnnouncementForm,
} from "@/lib/announcements";
import { eventDateParts } from "@/components/site/Announcements";
import { LiveSettings } from "@/components/admin/LiveSettings";
import { Subscribers } from "@/components/admin/Subscribers";
import logo from "@/assets/vine-logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Anuncios (Admin) | The Vine" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const fieldClass =
  "rounded-none border-border bg-background px-4 py-6 font-body text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary";

function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setSession(null);
      return;
    }
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full bg-foreground p-0.5"
          />
          <span className="font-display text-lg uppercase tracking-wider">{CHURCH.shortName}</span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Admin
          </span>
        </Link>
        {session ? (
          <button
            type="button"
            onClick={() => getSupabase()?.auth.signOut()}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <LogOut className="size-3.5" /> Salir / Sign out
          </button>
        ) : null}
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {!isSupabaseConfigured ? (
          <Notice>
            El panel aún no está conectado a la base de datos. / The admin panel is not connected to
            the database yet.
          </Notice>
        ) : session === undefined ? (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Cargando… / Loading…
          </p>
        ) : session ? (
          <Dashboard />
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-border bg-card p-6 text-sm leading-relaxed text-foreground/70">
      {children}
    </p>
  );
}

/* ---------------- Login ---------------- */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setError(null);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("Correo o contraseña incorrectos. / Wrong email or password.");
  }

  return (
    <div className="mx-auto max-w-md">
      <span className="eyebrow mb-4 block text-primary">Acceso / Sign in</span>
      <h1 className="font-display text-5xl uppercase leading-none">Anuncios</h1>
      <p className="mt-4 text-sm text-foreground/60">
        Inicia sesión para publicar y editar los anuncios del sitio.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <div>
          <Label htmlFor="email" className="eyebrow mb-3 block text-muted-foreground">
            Correo / Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <Label htmlFor="password" className="eyebrow mb-3 block text-muted-foreground">
            Contraseña / Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>
        {error ? (
          <p role="alert" className="font-mono text-xs text-destructive">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-primary px-8 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-60"
        >
          {busy ? "Entrando… / Signing in…" : "Entrar / Sign in"}
        </button>
      </form>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await fetchAllAnnouncements());
    } catch (err) {
      console.error(err);
      setLoadError("No se pudieron cargar los anuncios. / Could not load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  function startNew() {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(a: Announcement) {
    setEditing(a);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSaved() {
    setShowForm(false);
    setEditing(null);
    await reload();
  }

  async function togglePublished(a: Announcement) {
    await updateAnnouncement(a.id, { ...toForm(a), is_published: !a.is_published });
    await reload();
  }

  async function remove(a: Announcement) {
    if (!window.confirm(`¿Eliminar "${a.title}"? / Delete "${a.title}"?`)) return;
    await deleteAnnouncement(a.id);
    await reload();
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="eyebrow mb-4 block text-primary">Panel / Dashboard</span>
          <h1 className="font-display text-5xl uppercase leading-none">Anuncios</h1>
          <p className="mt-3 max-w-xl text-sm text-foreground/60">
            Lo que publiques aquí aparece en la página principal y en Eventos. Los eventos con fecha
            se ocultan solos cuando la fecha ya pasó.
          </p>
        </div>
        {!showForm ? (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 bg-primary px-6 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <Plus className="size-4" /> Nuevo anuncio
          </button>
        ) : null}
      </div>

      <LiveSettings />
      <Subscribers />

      {showForm ? (
        <AnnouncementEditor
          key={editing?.id ?? "new"}
          initial={editing ? toForm(editing) : EMPTY_FORM}
          editingId={editing?.id ?? null}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={onSaved}
        />
      ) : null}

      <section className="mt-12">
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Todos los anuncios / All announcements ({items.length})
        </h2>
        {loadError ? <Notice>{loadError}</Notice> : null}
        {loading && items.length === 0 ? (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Cargando… / Loading…
          </p>
        ) : items.length === 0 && !loadError ? (
          <Notice>
            Todavía no hay anuncios. Pulsa &ldquo;Nuevo anuncio&rdquo; para crear el primero. / No
            announcements yet. Click &ldquo;Nuevo anuncio&rdquo; to create the first one.
          </Notice>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {items.map((a) => (
              <AdminRow
                key={a.id}
                a={a}
                onEdit={() => startEdit(a)}
                onToggle={() => togglePublished(a)}
                onDelete={() => remove(a)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AdminRow({
  a,
  onEdit,
  onToggle,
  onDelete,
}: {
  a: Announcement;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const date = a.event_date ? eventDateParts(a.event_date) : null;
  const past = a.event_date ? a.event_date < new Date().toISOString().slice(0, 10) : false;

  return (
    <li
      className={`flex flex-col gap-4 py-5 md:flex-row md:items-center ${a.is_published ? "" : "opacity-50"}`}
    >
      <div className="w-20 shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {date ? `${date.day} ${date.month}` : "Aviso"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl uppercase">{a.title}</h3>
          {a.is_pinned ? <Pin className="size-3.5 text-primary" aria-label="Fijado" /> : null}
          {!a.is_published ? <Tag>Borrador / Draft</Tag> : null}
          {past ? <Tag>Pasado / Past</Tag> : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{a.body}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <IconButton label="Editar / Edit" onClick={onEdit}>
          <Pencil className="size-4" />
        </IconButton>
        <IconButton
          label={a.is_published ? "Ocultar / Hide" : "Publicar / Publish"}
          onClick={onToggle}
        >
          {a.is_published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </IconButton>
        <IconButton label="Eliminar / Delete" onClick={onDelete} danger>
          <Trash2 className="size-4" />
        </IconButton>
      </div>
    </li>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}

function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex size-10 items-center justify-center border border-border transition-colors ${
        danger
          ? "text-muted-foreground hover:border-destructive hover:text-destructive"
          : "text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------- Editor ---------------- */

function AnnouncementEditor({
  initial,
  editingId,
  onCancel,
  onSaved,
}: {
  initial: AnnouncementForm;
  editingId: string | null;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}) {
  const [saveError, setSaveError] = useState<string | null>(null);
  const { register, handleSubmit, formState, setValue, watch } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: initial,
  });
  const { errors, isSubmitting } = formState;
  const isPinned = watch("is_pinned");
  const isPublished = watch("is_published");

  async function onSubmit(data: AnnouncementForm) {
    setSaveError(null);
    try {
      if (editingId) await updateAnnouncement(editingId, data);
      else await createAnnouncement(data);
      await onSaved();
    } catch (err) {
      console.error(err);
      setSaveError("No se pudo guardar. Intenta de nuevo. / Could not save. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-10 space-y-8 border border-primary/40 bg-card p-6 md:p-10"
    >
      <h2 className="font-display text-3xl uppercase">
        {editingId ? "Editar anuncio" : "Nuevo anuncio"}
      </h2>

      <Field label="Título / Title *" htmlFor="title" error={errors.title?.message}>
        <Input
          id="title"
          className={fieldClass}
          placeholder="Ej. Noche de Alabanza"
          {...register("title")}
        />
      </Field>

      <Field label="Texto / Text *" htmlFor="body" error={errors.body?.message}>
        <Textarea
          id="body"
          rows={5}
          className={`${fieldClass} min-h-32 resize-y`}
          placeholder="Qué, cuándo, dónde y para quién. / What, when, where, and who it's for."
          {...register("body")}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label="Fecha del evento / Event date"
          htmlFor="event_date"
          hint="Opcional. Se oculta solo cuando pasa. / Optional. Hides itself after it passes."
          error={errors.event_date?.message}
        >
          <Input id="event_date" type="date" className={fieldClass} {...register("event_date")} />
        </Field>
        <Field label="Hora / Time" htmlFor="event_time" hint="Opcional, ej. 7:30 PM">
          <Input
            id="event_time"
            className={fieldClass}
            placeholder="7:30 PM"
            {...register("event_time")}
          />
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label="Enlace / Link"
          htmlFor="link_url"
          hint="Opcional: post de Facebook, formulario, etc."
          error={errors.link_url?.message}
        >
          <Input
            id="link_url"
            type="url"
            className={fieldClass}
            placeholder="https://"
            {...register("link_url")}
          />
        </Field>
        <Field
          label="Texto del enlace / Link text"
          htmlFor="link_label"
          hint="Opcional, ej. Regístrate"
        >
          <Input
            id="link_label"
            className={fieldClass}
            placeholder="Ver en Facebook"
            {...register("link_label")}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        <label className="flex items-center gap-3 text-sm text-foreground/80">
          <Checkbox
            checked={isPinned}
            onCheckedChange={(v) => setValue("is_pinned", v === true)}
            className="rounded-none border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          Fijar arriba / Pin to top
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground/80">
          <Checkbox
            checked={isPublished}
            onCheckedChange={(v) => setValue("is_published", v === true)}
            className="rounded-none border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          Publicado (visible en el sitio) / Published
        </label>
      </div>

      {saveError ? (
        <p role="alert" className="font-mono text-xs text-destructive">
          {saveError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary px-8 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-60"
        >
          {isSubmitting ? "Guardando… / Saving…" : "Guardar / Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancelar / Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="eyebrow mb-3 block text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 font-mono text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
