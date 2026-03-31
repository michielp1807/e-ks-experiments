import type { DistrictCode, Locale } from "$lib/types";

export const ELECTION = {
  code: "EK2027",
  nominationDate: "2027-04-20",
  titles: {
    nl: "Eerste Kamerverkiezing der Staten-Generaal 2027",
    en: "Election of the Senate of the States General 2027",
  },
  shortTitles: {
    nl: "Eerste Kamer 2027",
    en: "Election of the Senate 2027",
  },
} as const;

export const DISTRICTS: Array<{
  code: DistrictCode;
  title: Record<Locale | "fry", string>;
}> = [
  { code: "DR", title: { nl: "Drenthe", en: "Drenthe", fry: "Drinte" } },
  { code: "FL", title: { nl: "Flevoland", en: "Flevoland", fry: "Flevolân" } },
  { code: "FR", title: { nl: "Friesland", en: "Friesland", fry: "Fryslân" } },
  {
    code: "GE",
    title: { nl: "Gelderland", en: "Gelderland", fry: "Gelderlân" },
  },
  { code: "GR", title: { nl: "Groningen", en: "Groningen", fry: "Grinslân" } },
  { code: "LI", title: { nl: "Limburg", en: "Limburg", fry: "Limboarch" } },
  {
    code: "NB",
    title: { nl: "Noord-Brabant", en: "North Brabant", fry: "Noard-Brabân" },
  },
  {
    code: "NH",
    title: { nl: "Noord-Holland", en: "North Holland", fry: "Noard-Hollân" },
  },
  { code: "OV", title: { nl: "Overijssel", en: "Overijssel", fry: "Oerisel" } },
  { code: "UT", title: { nl: "Utrecht", en: "Utrecht", fry: "Utert" } },
  { code: "ZE", title: { nl: "Zeeland", en: "Zeeland", fry: "Seelân" } },
  {
    code: "ZH",
    title: { nl: "Zuid-Holland", en: "South Holland", fry: "Súd-Hollân" },
  },
  {
    code: "BO",
    title: {
      nl: "Kiescollege Bonaire",
      en: "Electoral College Bonaire",
      fry: "Kieskolleezje Bonêre",
    },
  },
  {
    code: "SE",
    title: {
      nl: "Kiescollege Sint Eustatius",
      en: "Electoral College Sint Eustatius",
      fry: "Kieskolleezje Sint Eustaasjus",
    },
  },
  {
    code: "SA",
    title: {
      nl: "Kiescollege Saba",
      en: "Electoral College Saba",
      fry: "Kieskolleezje Saba",
    },
  },
  {
    code: "KN",
    title: {
      nl: "Kiescollege Niet-Ingezetenen",
      en: "Electoral College Non-Residents",
      fry: "Kieskolleezje Net-Ynwenners",
    },
  },
];

export function districtTitle(code: DistrictCode, locale: Locale | "fry") {
  return (
    DISTRICTS.find((district) => district.code === code)?.title[locale] ?? code
  );
}

export function maxCandidates(longListAllowed: boolean | null) {
  return longListAllowed ? 80 : 50;
}
