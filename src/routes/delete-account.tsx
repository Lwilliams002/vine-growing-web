import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, Smartphone, Trash2 } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CHURCH, SITE_URL } from "@/lib/church";
import { useLang, type Lang } from "@/lib/i18n";

const APP_NAME = "Vine Life Groups";
const TITLE = `Delete your ${APP_NAME} account | The Vine Apostolic Church`;
const DESCRIPTION =
  "How to delete your Vine Life Groups account and data, in the app or from this page. Cómo eliminar tu cuenta de Vine Life Groups.";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/delete-account` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/delete-account` }],
  }),
  component: DeleteAccount,
});

type Result = { ok: true } | { ok: false; error: string };

/** Signs in with the app's credentials, then deletes the account and everything it owns. */
async function deleteAccount(email: string, password: string, lang: Lang): Promise<Result> {
  const msg = (es: string, en: string) => (lang === "es" ? es : en);
  const base = CHURCH.appApiUrl;
  try {
    const signIn = await fetch(`${base}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    if (signIn.status === 401 || signIn.status === 400) {
      return {
        ok: false,
        error: msg("Correo o contraseña incorrectos.", "Wrong email or password."),
      };
    }
    if (!signIn.ok) throw new Error(`sign-in ${signIn.status}`);
    const { token } = (await signIn.json()) as { token: string };

    const del = await fetch(`${base}/auth/account`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!del.ok) throw new Error(`delete ${del.status}`);
    return { ok: true };
  } catch (err) {
    console.error("Account deletion failed", err);
    return {
      ok: false,
      error: msg(
        `No pudimos completar la eliminación. Intenta de nuevo o escríbenos a ${CHURCH.email}.`,
        `We couldn't complete the deletion. Please try again or email us at ${CHURCH.email}.`,
      ),
    };
  }
}

const fieldClass =
  "rounded-none border-border bg-background px-4 py-6 font-body text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary";

function DeleteAccount() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "done" } | { kind: "error"; text: string }
  >({
    kind: "idle",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm || busy) return;
    setBusy(true);
    setState({ kind: "idle" });
    const result = await deleteAccount(email, password, lang);
    setBusy(false);
    if (result.ok) {
      setState({ kind: "done" });
      setEmail("");
      setPassword("");
    } else {
      setState({ kind: "error", text: result.error });
    }
  }

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={APP_NAME}
        title={t("Eliminar tu cuenta", "Delete your account")}
        intro={t(
          "Puedes borrar tu cuenta de la app y todos tus datos en cualquier momento. La eliminación es inmediata y no se puede deshacer.",
          "You can erase your app account and all of your data at any time. Deletion is immediate and cannot be undone.",
        )}
      />

      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
        <div className="space-y-12">
          <div>
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl uppercase">
              <Smartphone className="size-6 text-primary" />
              {t("Desde la app", "In the app")}
            </h2>
            <ol className="space-y-4 text-foreground/80">
              {[
                t("Abre la app y toca la pestaña Perfil.", "Open the app and tap the Profile tab."),
                t("Toca “Eliminar cuenta”.", "Tap “Delete account”."),
                t(
                  "Confirma. Tu cuenta se borra al instante.",
                  "Confirm. Your account is erased instantly.",
                ),
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl uppercase">
              <ShieldAlert className="size-6 text-primary" />
              {t("Qué se borra", "What gets erased")}
            </h2>
            <ul className="space-y-3 text-foreground/80">
              {[
                t(
                  "Tu perfil: correo, nombre, teléfono, género y estado de bautismo.",
                  "Your profile: email, name, phone, gender, and baptism status.",
                ),
                t(
                  "Tus membresías, solicitudes de ingreso y registros de asistencia.",
                  "Your memberships, join requests, and attendance records.",
                ),
                t(
                  "Tus sesiones activas en todos los dispositivos.",
                  "Your active sessions on every device.",
                ),
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-foreground/60">
              {t(
                "Los anuncios y documentos que hayas publicado como líder permanecen en el grupo, pero dejan de estar vinculados a ti. Más detalles en la",
                "Announcements and documents you posted as a leader stay with the group but are no longer linked to you. More detail in the",
              )}{" "}
              <Link
                to="/privacy"
                hash="retencion"
                className="text-primary underline underline-offset-4"
              >
                {t("política de privacidad", "privacy policy")}
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="border border-border bg-card p-8 md:p-12">
          {state.kind === "done" ? (
            <div className="animate-fade-up">
              <span className="eyebrow mb-6 block text-primary">{t("Listo", "Done")}</span>
              <h2 className="font-display text-4xl uppercase leading-none">
                {t("Tu cuenta fue eliminada", "Your account has been deleted")}
              </h2>
              <p className="mt-6 text-foreground/70">
                {t(
                  "Borramos tu perfil y tus datos. Gracias por haber sido parte de nuestros grupos.",
                  "We erased your profile and your data. Thank you for being part of our groups.",
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              <div>
                <h2 className="flex items-center gap-3 font-display text-3xl uppercase">
                  <Trash2 className="size-6 text-primary" />
                  {t("Desde esta página", "From this page")}
                </h2>
                <p className="mt-3 text-sm text-foreground/60">
                  {t(
                    "Si ya no tienes la app, inicia sesión aquí con el mismo correo y contraseña y la eliminaremos ahora mismo.",
                    "If you no longer have the app, sign in here with the same email and password and we'll delete it right now.",
                  )}
                </p>
              </div>

              <div>
                <Label htmlFor="email" className="eyebrow mb-3 block text-muted-foreground">
                  {t("Correo de la cuenta", "Account email")}
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
                  {t("Contraseña", "Password")}
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

              <label className="flex items-start gap-3 text-sm text-foreground/80">
                <Checkbox
                  checked={confirm}
                  onCheckedChange={(v) => setConfirm(v === true)}
                  className="mt-0.5 rounded-none border-border data-[state=checked]:bg-destructive data-[state=checked]:text-white"
                />
                {t(
                  "Entiendo que mi cuenta y mis datos se eliminarán de forma permanente.",
                  "I understand my account and data will be permanently deleted.",
                )}
              </label>

              {state.kind === "error" ? (
                <p
                  role="alert"
                  className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground/80"
                >
                  {state.text}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!confirm || busy}
                className="w-full bg-destructive px-10 py-5 font-display text-lg uppercase tracking-widest text-white transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy
                  ? t("Eliminando…", "Deleting…")
                  : t("Eliminar mi cuenta permanentemente", "Permanently delete my account")}
              </button>

              <p className="font-mono text-[10px] uppercase leading-loose tracking-widest text-muted-foreground">
                {t("¿Problemas? Escríbenos a", "Trouble? Email us at")}{" "}
                <a href={`mailto:${CHURCH.email}`} className="text-primary">
                  {CHURCH.email}
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
