import type { Bilingual } from "./i18n";

// Public origin of the deployed site (no trailing slash). Used for canonical
// URLs, Open Graph tags, and the sitemap. Update this when the domain is final.
export const SITE_URL = "https://thevineapostolic.com";

export const CHURCH = {
  name: "The Vine Apostolic Church",
  shortName: "The Vine",
  address: "14615 Aldine Westfield Rd",
  city: "Houston, TX 77039",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=14615+Aldine+Westfield+Rd+Houston+TX+77039",
  email: "thevineapostolicchurch@gmail.com",
  // TODO: replace with the church's real number. 555-01xx numbers are reserved
  // placeholders and will not connect.
  phoneDisplay: "(713) 555-0100",
  phone: "+17135550100", // tel: link, E.164
  whatsapp: "17135550100", // wa.me link, digits only
  facebook: "https://www.facebook.com/thevinehouston/",
  givingUrl: "https://app.securegive.com/thevinehouston",
  // Backend of the Vine Life Groups mobile app (Cloudflare Worker).
  appApiUrl: "https://api.thevineapostolic.com",
  // Web3Forms access key for the prayer request form. Web3Forms only accepts
  // browser submissions on the free plan and documents this key as safe to be
  // public; it routes to the church inbox and can be rotated in the dashboard.
  web3formsKey: "5a7f6ee7-fdf1-4ad8-a83e-97bf603137a6",
} as const;

export type Service = { day: Bilingual; time: string; detail: Bilingual };

export const SERVICES: readonly Service[] = [
  {
    day: { es: "Domingo", en: "Sunday" },
    time: "9:00 AM",
    detail: { es: "Servicio en inglés", en: "English service" },
  },
  {
    day: { es: "Domingo", en: "Sunday" },
    time: "11:30 AM",
    detail: { es: "Servicio en español", en: "Spanish service" },
  },
  {
    day: { es: "Miércoles", en: "Wednesday" },
    time: "7:30 PM",
    detail: { es: "Noche de oración", en: "Prayer night" },
  },
];

export type Ministry = {
  number: "01" | "02" | "03";
  slug: string;
  title: Bilingual;
  subtitle: string;
  body: Bilingual;
  audience: Bilingual;
  highlights: Bilingual[];
};

export const MINISTRIES: readonly Ministry[] = [
  {
    number: "01",
    slug: "jovenes",
    title: { es: "Jóvenes", en: "Youth" },
    subtitle: "The Vine Youth Collective",
    body: {
      es: "Un espacio para que la próxima generación encuentre identidad y propósito en Cristo: reuniones semanales, noches de adoración y mentoría.",
      en: "A place for the next generation to find identity and purpose in Christ: weekly gatherings, worship nights, and mentorship.",
    },
    audience: { es: "Adolescentes y jóvenes adultos", en: "Teens and young adults" },
    highlights: [
      { es: "Reuniones semanales", en: "Weekly gatherings" },
      { es: "Noches de adoración", en: "Worship nights" },
      { es: "Mentoría y discipulado", en: "Mentorship and discipleship" },
    ],
  },
  {
    number: "02",
    slug: "damas",
    title: { es: "Damas", en: "Ladies" },
    subtitle: "Refined & Empowered",
    body: {
      es: "Hermandad, oración y estudio de la Palabra para mujeres de toda edad, con convivio mensual y alcance a la comunidad.",
      en: "Sisterhood, prayer, and Bible study for women of every age, with monthly fellowship and community outreach.",
    },
    audience: { es: "Mujeres de toda edad", en: "Women of every age" },
    highlights: [
      { es: "Hermandad y oración", en: "Sisterhood and prayer" },
      { es: "Estudio de la Palabra", en: "Bible study" },
      { es: "Convivio mensual y alcance", en: "Monthly fellowship and outreach" },
    ],
  },
  {
    number: "03",
    slug: "ninos",
    title: { es: "Niños", en: "Kids" },
    subtitle: "Vine Kids Academy",
    body: {
      es: "Enseñanza bíblica en un ambiente seguro y alegre durante el servicio dominical, para niños de 3 a 11 años.",
      en: "Bible teaching in a safe, joyful environment during the Sunday service, for ages 3 through 11.",
    },
    audience: { es: "De 3 a 11 años", en: "Ages 3 to 11" },
    highlights: [
      { es: "Durante el servicio dominical", en: "During the Sunday service" },
      { es: "Enseñanza bíblica a su nivel", en: "Bible teaching at their level" },
      { es: "Ambiente seguro y alegre", en: "A safe, joyful space" },
    ],
  },
];

export type ServeTeam = { title: Bilingual; body: Bilingual };

export const SERVE_TEAMS: readonly ServeTeam[] = [
  {
    title: { es: "Alabanza", en: "Worship" },
    body: {
      es: "Voces, músicos y sonido para guiar a la iglesia en adoración.",
      en: "Singers, musicians, and sound to lead the church in worship.",
    },
  },
  {
    title: { es: "Media", en: "Media" },
    body: {
      es: "Cámaras, transmisión y pantallas para llevar el servicio más allá de las paredes.",
      en: "Cameras, streaming, and screens that carry the service beyond our walls.",
    },
  },
  {
    title: { es: "Hospitalidad", en: "Hospitality" },
    body: {
      es: "Recibir, saludar y hacer que cada visitante se sienta en casa.",
      en: "Welcoming, greeting, and making every guest feel at home.",
    },
  },
  {
    title: { es: "Alcance", en: "Outreach" },
    body: {
      es: "Llevar el evangelio y ayuda práctica a nuestra comunidad en Houston.",
      en: "Bringing the gospel and practical help to our Houston community.",
    },
  },
];
