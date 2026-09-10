export const CHURCH = {
  name: "The Vine Apostolic Church",
  shortName: "The Vine",
  address: "14615 Aldine Westfield Rd",
  city: "Houston, TX 77039",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=14615+Aldine+Westfield+Rd+Houston+TX+77039",
  email: "info@thevinehouston.org",
  facebook: "https://www.facebook.com/thevinehouston/",
} as const;

export const SERVICES = [
  {
    day: "Domingo / Sunday",
    time: "10:00 AM",
    detail: "Servicio de Adoración y Palabra",
  },
  {
    day: "Miércoles / Wednesday",
    time: "7:30 PM",
    detail: "Estudio Bíblico y Oración",
  },
] as const;

export const MINISTRIES = [
  {
    number: "01",
    title: "Jóvenes / Youth",
    subtitle: "The Vine Youth Collective",
    body: "Un espacio para que la próxima generación encuentre identidad y propósito en Cristo. Weekly gatherings, worship nights, and mentorship.",
  },
  {
    number: "02",
    title: "Damas / Ladies",
    subtitle: "Refined & Empowered",
    body: "Hermandad, oración y estudio de la Palabra para mujeres de toda edad. Monthly fellowship and service outreach.",
  },
  {
    number: "03",
    title: "Niños / Kids",
    subtitle: "Vine Kids Academy",
    body: "Enseñanza bíblica en un ambiente seguro y alegre durante el servicio dominical. Ages 3 through 11.",
  },
] as const;
