import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { CHURCH, SITE_URL } from "@/lib/church";
import { useLang, type Bilingual } from "@/lib/i18n";

const TITLE = "Privacy Policy | The Vine Apostolic Church";
const DESCRIPTION =
  "Privacy policy for the Vine Life Groups mobile app and the thevineapostolic.com website. Política de privacidad de la app Vine Life Groups y del sitio web.";

// Update this whenever the policy text changes.
const EFFECTIVE_DATE = { es: "22 de septiembre de 2026", en: "September 22, 2026" };
const APP_NAME = "Vine Life Groups";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: Privacy,
});

type Block =
  | { kind: "p"; text: Bilingual }
  | { kind: "list"; items: Bilingual[] }
  | { kind: "table"; rows: { label: Bilingual; value: Bilingual }[] };

type Section = { id: string; title: Bilingual; blocks: Block[] };

const p = (es: string, en: string): Block => ({ kind: "p", text: { es, en } });
const list = (...items: [string, string][]): Block => ({
  kind: "list",
  items: items.map(([es, en]) => ({ es, en })),
});

const APP_SECTIONS: Section[] = [
  {
    id: "quienes",
    title: { es: "Quiénes somos", en: "Who we are" },
    blocks: [
      p(
        `${APP_NAME} es una aplicación móvil de ${CHURCH.name} (“la iglesia”, “nosotros”), ${CHURCH.address}, ${CHURCH.city}, EE. UU. La app ayuda a los miembros a encontrar y unirse a grupos de vida, y a los líderes a organizar sus reuniones. Esta política explica qué información recopila la app, cómo la usamos y qué opciones tienes.`,
        `${APP_NAME} is a mobile app published by ${CHURCH.name} (“the church”, “we”), ${CHURCH.address}, ${CHURCH.city}, USA. The app helps members find and join life groups, and helps leaders organize their meetings. This policy explains what information the app collects, how we use it, and the choices you have.`,
      ),
    ],
  },
  {
    id: "datos",
    title: { es: "Información que recopilamos", en: "Information we collect" },
    blocks: [
      p(
        "Solo recopilamos lo que tú escribes en la app. No recopilamos tu ubicación, contactos, fotos, ni datos de otras apps.",
        "We only collect what you enter in the app. We do not collect your location, contacts, photos, or data from other apps.",
      ),
      {
        kind: "table",
        rows: [
          {
            label: { es: "Cuenta", en: "Account" },
            value: {
              es: "Correo electrónico y contraseña. La contraseña se guarda únicamente como un hash cifrado; nunca podemos verla.",
              en: "Email address and password. The password is stored only as a salted hash; we can never see it.",
            },
          },
          {
            label: { es: "Perfil", en: "Profile" },
            value: {
              es: "Nombre completo, número de teléfono, género y si has sido bautizado. Estos campos son opcionales, excepto el nombre.",
              en: "Full name, phone number, gender, and whether you have been baptized. These are optional except for your name.",
            },
          },
          {
            label: { es: "Actividad en grupos", en: "Group activity" },
            value: {
              es: "A qué grupos pediste unirte y el mensaje que enviaste, a qué grupos perteneces, tu asistencia a cada reunión (presente o ausente) y la fecha en que te uniste.",
              en: "Which groups you asked to join and the message you sent, which groups you belong to, your attendance at each meeting (present or absent), and the date you joined.",
            },
          },
          {
            label: { es: "Contenido que publicas", en: "Content you post" },
            value: {
              es: "Si eres líder: los anuncios que escribes y los documentos que subes a tu grupo.",
              en: "If you are a leader: the announcements you write and the documents you upload to your group.",
            },
          },
          {
            label: { es: "Datos técnicos", en: "Technical data" },
            value: {
              es: "Un identificador de sesión guardado en tu dispositivo para mantenerte conectado, y los registros estándar del servidor (como la dirección IP) que nuestro proveedor de hosting conserva brevemente por seguridad.",
              en: "A session token stored on your device to keep you signed in, and standard server logs (such as IP address) that our hosting provider keeps briefly for security.",
            },
          },
        ],
      },
      p(
        "La app no usa herramientas de análisis, publicidad, rastreo ni informes de fallos de terceros.",
        "The app does not use third-party analytics, advertising, tracking, or crash-reporting tools.",
      ),
    ],
  },
  {
    id: "uso",
    title: { es: "Cómo usamos tu información", en: "How we use your information" },
    blocks: [
      list(
        [
          "Para crear tu cuenta y mantenerte conectado.",
          "To create your account and keep you signed in.",
        ],
        [
          "Para que los líderes de tu grupo puedan reconocerte, contactarte y llevar la lista de asistencia.",
          "So your group leaders can recognize you, contact you, and keep attendance.",
        ],
        [
          "Para que el pastor pueda ver la salud de los grupos de la iglesia (cuántas personas asisten, cuántos han sido bautizados).",
          "So the pastor can see the health of the church's groups (how many people attend, how many have been baptized).",
        ],
        [
          "Para mostrarte los anuncios y documentos de los grupos a los que perteneces.",
          "To show you the announcements and documents of the groups you belong to.",
        ],
      ),
      p(
        "No vendemos tu información ni la usamos para publicidad. No la compartimos con nadie fuera de la iglesia, salvo los proveedores técnicos descritos abajo.",
        "We do not sell your information or use it for advertising. We do not share it with anyone outside the church, except the technical providers described below.",
      ),
    ],
  },
  {
    id: "quien-ve",
    title: { es: "Quién puede ver tu información", en: "Who can see your information" },
    blocks: [
      p(
        "Esta es una app para una comunidad de iglesia, así que parte de tu información es visible para otras personas de la iglesia:",
        "This is an app for a church community, so some of your information is visible to other people in the church:",
      ),
      list(
        [
          "Los líderes de un grupo ven la lista de sus miembros: nombre, teléfono, género, estado de bautismo, fecha de ingreso y asistencia.",
          "Leaders of a group see their roster: name, phone, gender, baptism status, join date, and attendance.",
        ],
        [
          "El pastor (administrador) ve la misma información para todos los grupos y puede exportarla como un reporte para uso interno de la iglesia.",
          "The pastor (administrator) sees the same information for every group and can export it as a report for the church's internal use.",
        ],
        [
          "Los demás miembros de tu grupo ven tu nombre. No ven tu teléfono, tu correo ni tu asistencia.",
          "Other members of your group see your name. They do not see your phone, email, or attendance.",
        ],
        [
          "Nadie fuera de tu grupo ve nada más que el nombre del grupo.",
          "Nobody outside your group sees anything beyond the group's name.",
        ],
      ),
    ],
  },
  {
    id: "proveedores",
    title: { es: "Dónde se guarda tu información", en: "Where your information is stored" },
    blocks: [
      p(
        "La app se ejecuta en servidores de Cloudflare, Inc. (Estados Unidos). Cloudflare almacena la base de datos y los documentos en nuestro nombre y no usa tus datos para sus propios fines. Las conexiones entre la app y nuestros servidores van cifradas (HTTPS). Las tiendas de aplicaciones (Apple App Store y Google Play) pueden recopilar sus propios datos de descarga e instalación según sus políticas.",
        "The app runs on servers operated by Cloudflare, Inc. (United States). Cloudflare stores the database and documents on our behalf and does not use your data for its own purposes. Connections between the app and our servers are encrypted (HTTPS). The app stores (Apple App Store and Google Play) may collect their own download and install data under their own policies.",
      ),
    ],
  },
  {
    id: "retencion",
    title: { es: "Cuánto tiempo la conservamos", en: "How long we keep it" },
    blocks: [
      p(
        "Conservamos tu cuenta y tu actividad mientras tu cuenta exista. Tu sesión en el dispositivo expira a los 90 días o cuando cierras sesión. Cuando eliminas tu cuenta, borramos tu perfil, tus sesiones, tus solicitudes, tus membresías y tu asistencia. Los anuncios y documentos que hayas publicado en un grupo permanecen en ese grupo pero dejan de estar vinculados a ti.",
        "We keep your account and activity for as long as your account exists. Your session on the device expires after 90 days or when you sign out. When you delete your account we erase your profile, sessions, join requests, memberships, and attendance. Announcements and documents you posted to a group stay with that group but are no longer linked to you.",
      ),
    ],
  },
  {
    id: "eliminar",
    title: { es: "Eliminar tu cuenta", en: "Delete your account" },
    blocks: [
      p(
        "Puedes eliminar tu cuenta y tus datos en cualquier momento desde la app: abre Perfil y toca “Eliminar cuenta”. Si ya no tienes la app, hazlo desde la página thevineapostolic.com/delete-account con tu correo y contraseña. La eliminación es inmediata y no se puede deshacer. También puedes escribirnos al correo de abajo desde la dirección con la que te registraste.",
        "You can delete your account and data at any time from the app: open Profile and tap “Delete account”. If you no longer have the app, do it at thevineapostolic.com/delete-account with your email and password. Deletion is immediate and cannot be undone. You can also email us at the address below from the address you signed up with.",
      ),
    ],
  },
  {
    id: "derechos",
    title: { es: "Tus opciones y derechos", en: "Your choices and rights" },
    blocks: [
      list(
        [
          "Puedes ver y corregir tu nombre, teléfono, género y estado de bautismo desde Perfil.",
          "You can view and correct your name, phone, gender, and baptism status from Profile.",
        ],
        [
          "Puedes pedirnos una copia de la información que tenemos sobre ti.",
          "You can ask us for a copy of the information we hold about you.",
        ],
        [
          "Puedes salir de un grupo o eliminar tu cuenta cuando quieras.",
          "You can leave a group or delete your account whenever you want.",
        ],
      ),
    ],
  },
  {
    id: "menores",
    title: { es: "Menores de edad", en: "Children" },
    blocks: [
      p(
        `${APP_NAME} está dirigida a adultos y jóvenes de 13 años o más. No recopilamos a sabiendas información de menores de 13 años. Si crees que un menor de 13 creó una cuenta, escríbenos y la eliminaremos.`,
        `${APP_NAME} is intended for adults and teens 13 and older. We do not knowingly collect information from children under 13. If you believe a child under 13 has created an account, contact us and we will delete it.`,
      ),
    ],
  },
  {
    id: "seguridad",
    title: { es: "Seguridad", en: "Security" },
    blocks: [
      p(
        "Las contraseñas se guardan con hash y sal (PBKDF2), las sesiones usan tokens aleatorios que también se guardan con hash, los documentos se entregan mediante enlaces firmados de corta duración y todo el tráfico va cifrado. Ningún sistema es perfectamente seguro; si detectamos un incidente que afecte tus datos, te avisaremos.",
        "Passwords are salted and hashed (PBKDF2), sessions use random tokens that are also stored hashed, documents are served through short-lived signed links, and all traffic is encrypted. No system is perfectly secure; if we learn of an incident affecting your data, we will notify you.",
      ),
    ],
  },
];

const SITE_SECTIONS: Section[] = [
  {
    id: "sitio",
    title: { es: "El sitio web", en: "The website" },
    blocks: [
      p(
        `Esta política también cubre ${SITE_URL.replace("https://", "")}. El sitio se puede visitar sin crear una cuenta y no usa cookies de rastreo ni publicidad. Recopila información solo cuando tú la envías:`,
        `This policy also covers ${SITE_URL.replace("https://", "")}. The site can be browsed without an account and uses no tracking cookies or advertising. It collects information only when you send it:`,
      ),
      list(
        [
          "Petición de oración: el nombre (opcional), correo o teléfono que escribas y tu petición se envían por correo electrónico al equipo pastoral a través de Web3Forms, un servicio de entrega de formularios. Si marcas “Confidencial”, solo el equipo pastoral la lee.",
          "Prayer request: the name (optional), email or phone you enter, and your request are emailed to the pastoral team through Web3Forms, a form-delivery service. If you mark it “Confidential”, only the pastoral team reads it.",
        ],
        [
          "Anuncios por correo: si dejas tu correo para recibir anuncios, lo guardamos hasta que nos pidas quitarlo. Escríbenos y lo eliminamos.",
          "Email announcements: if you leave your email to receive announcements, we keep it until you ask us to remove it. Email us and we will delete it.",
        ],
        [
          "Contenido de terceros: las páginas incluyen un mapa de Google, videos y la página de Facebook de la iglesia, y enlaces a Bible Gateway y SecureGive. Cuando esos elementos se cargan o los visitas, esas empresas pueden recopilar datos según sus propias políticas.",
          "Third-party content: pages embed a Google map, Facebook videos and the church's Facebook page, and link to Bible Gateway and SecureGive. When those load or you visit them, those companies may collect data under their own policies.",
        ],
      ),
    ],
  },
  {
    id: "cambios",
    title: { es: "Cambios a esta política", en: "Changes to this policy" },
    blocks: [
      p(
        "Si cambiamos esta política, actualizaremos la fecha de arriba y, si el cambio es importante, lo anunciaremos en la app o en el sitio.",
        "If we change this policy we will update the date above and, if the change is significant, announce it in the app or on the site.",
      ),
    ],
  },
  {
    id: "contacto",
    title: { es: "Contacto", en: "Contact" },
    blocks: [
      p(
        `Preguntas sobre privacidad, solicitudes de datos o eliminación: ${CHURCH.email}, o por correo postal a ${CHURCH.name}, ${CHURCH.address}, ${CHURCH.city}.`,
        `Privacy questions, data requests, or deletion: ${CHURCH.email}, or by mail to ${CHURCH.name}, ${CHURCH.address}, ${CHURCH.city}.`,
      ),
    ],
  },
];

function Privacy() {
  const { t } = useLang();
  const all = [...APP_SECTIONS, ...SITE_SECTIONS];

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={t("Legal", "Legal")}
        title={t("Política de Privacidad", "Privacy Policy")}
        intro={t(
          `Para la app ${APP_NAME} y el sitio web de ${CHURCH.name}. Vigente desde el ${EFFECTIVE_DATE.es}.`,
          `For the ${APP_NAME} app and the website of ${CHURCH.name}. Effective ${EFFECTIVE_DATE.en}.`,
        )}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:grid md:grid-cols-[220px_1fr] md:gap-16">
        <nav
          aria-label={t("Secciones", "Sections")}
          className="mb-12 md:sticky md:top-28 md:mb-0 md:self-start"
        >
          <ol className="space-y-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {all.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-colors hover:text-primary">
                  <span className="mr-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
                  {t(s.title)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-3xl">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            {t("La app", "The app")} · {APP_NAME}
          </h2>
          {APP_SECTIONS.map((s, i) => (
            <PolicySection key={s.id} section={s} index={i + 1} />
          ))}

          <h2 className="mb-4 mt-20 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            {t("El sitio web y general", "The website and general")}
          </h2>
          {SITE_SECTIONS.map((s, i) => (
            <PolicySection key={s.id} section={s} index={APP_SECTIONS.length + i + 1} />
          ))}
        </article>
      </section>

      <SiteFooter />
    </>
  );
}

function PolicySection({ section, index }: { section: Section; index: number }) {
  const { t } = useLang();
  return (
    <section id={section.id} className="scroll-mt-32 border-t border-border py-10">
      <h3 className="mb-6 flex items-baseline gap-4 font-display text-3xl uppercase leading-none">
        <span className="font-mono text-xs text-primary">{String(index).padStart(2, "0")}</span>
        {t(section.title)}
      </h3>
      <div className="space-y-5 text-base leading-relaxed text-foreground/80">
        {section.blocks.map((b, i) => {
          if (b.kind === "p") return <p key={i}>{t(b.text)}</p>;
          if (b.kind === "list")
            return (
              <ul key={i} className="space-y-3">
                {b.items.map((item) => (
                  <li key={item.es} className="flex gap-3">
                    <span className="mt-2.5 size-1.5 shrink-0 bg-primary" />
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            );
          return (
            <dl key={i} className="divide-y divide-border border-y border-border">
              {b.rows.map((r) => (
                <div key={r.label.es} className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t(r.label)}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground/80">{t(r.value)}</dd>
                </div>
              ))}
            </dl>
          );
        })}
      </div>
    </section>
  );
}
