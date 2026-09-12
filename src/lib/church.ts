// Public origin of the deployed site (no trailing slash). Used for canonical
// URLs, Open Graph tags, and the sitemap. Update this when the domain is final.
export const SITE_URL = "https://thevinehouston.org";

export const CHURCH = {
  name: "The Vine Apostolic Church",
  shortName: "The Vine",
  address: "14615 Aldine Westfield Rd",
  city: "Houston, TX 77039",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=14615+Aldine+Westfield+Rd+Houston+TX+77039",
  email: "info@thevinehouston.org",
  facebook: "https://www.facebook.com/thevinehouston/",
  givingUrl: "https://app.securegive.com/thevinehouston",
  // Web3Forms access key for the prayer request form. Web3Forms only accepts
  // browser submissions on the free plan and documents this key as safe to be
  // public; it routes to the church inbox and can be rotated in the dashboard.
  web3formsKey: "5a7f6ee7-fdf1-4ad8-a83e-97bf603137a6",
} as const;

export const SERVICES = [
  {
    day: "Sunday / Domingo",
    time: "9:00 AM",
    detail: "English Service",
  },
  {
    day: "Domingo / Sunday",
    time: "11:30 AM",
    detail: "Servicio en Español",
  },
  {
    day: "Miércoles / Wednesday",
    time: "7:30 PM",
    detail: "Noche de Oración / Prayer Night",
  },
] as const;

export const MINISTRIES = [
  {
    number: "01",
    slug: "jovenes",
    title: "Jóvenes / Youth",
    subtitle: "The Vine Youth Collective",
    body: "Un espacio para que la próxima generación encuentre identidad y propósito en Cristo. Weekly gatherings, worship nights, and mentorship.",
    audience: "Adolescentes y jóvenes adultos / Teens & young adults",
    highlights: [
      "Reuniones semanales / Weekly gatherings",
      "Noches de adoración / Worship nights",
      "Mentoría y discipulado / Mentorship & discipleship",
    ],
  },
  {
    number: "02",
    slug: "damas",
    title: "Damas / Ladies",
    subtitle: "Refined & Empowered",
    body: "Hermandad, oración y estudio de la Palabra para mujeres de toda edad. Monthly fellowship and service outreach.",
    audience: "Mujeres de toda edad / Women of every age",
    highlights: [
      "Hermandad y oración / Sisterhood & prayer",
      "Estudio de la Palabra / Bible study",
      "Convivio mensual y alcance / Monthly fellowship & outreach",
    ],
  },
  {
    number: "03",
    slug: "ninos",
    title: "Niños / Kids",
    subtitle: "Vine Kids Academy",
    body: "Enseñanza bíblica en un ambiente seguro y alegre durante el servicio dominical. Ages 3 through 11.",
    audience: "3 a 11 años / Ages 3 to 11",
    highlights: [
      "Durante el servicio dominical / During Sunday service",
      "Enseñanza bíblica a su nivel / Bible teaching at their level",
      "Ambiente seguro y alegre / A safe, joyful space",
    ],
  },
] as const;

export const SERVE_TEAMS = [
  {
    title: "Alabanza / Worship",
    body: "Voces, músicos y sonido para guiar a la iglesia en adoración.",
  },
  {
    title: "Media",
    body: "Cámaras, transmisión y pantallas para llevar el servicio más allá de las paredes.",
  },
  {
    title: "Hospitalidad / Hospitality",
    body: "Recibir, saludar y hacer que cada visitante se sienta en casa.",
  },
  {
    title: "Alcance / Outreach",
    body: "Llevar el evangelio y ayuda práctica a nuestra comunidad en Houston.",
  },
] as const;
