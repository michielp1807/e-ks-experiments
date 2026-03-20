import type { DistrictCode, Locale } from '$lib/types';

export const ELECTION = {
	code: 'EK2027',
	nominationDate: '2027-04-20',
	titles: {
		nl: 'Eerste Kamerverkiezing der Staten-Generaal 2027',
		en: 'Election of the Senate of the States General 2027'
	},
	shortTitles: {
		nl: 'Eerste Kamer 2027',
		en: 'Election of the Senate 2027'
	}
} as const;

export const DISTRICTS: Array<{ code: DistrictCode; title: Record<Locale, string> }> = [
	{ code: 'DR', title: { nl: 'Drenthe', en: 'Drenthe' } },
	{ code: 'FL', title: { nl: 'Flevoland', en: 'Flevoland' } },
	{ code: 'FR', title: { nl: 'Friesland', en: 'Friesland' } },
	{ code: 'GE', title: { nl: 'Gelderland', en: 'Gelderland' } },
	{ code: 'GR', title: { nl: 'Groningen', en: 'Groningen' } },
	{ code: 'LI', title: { nl: 'Limburg', en: 'Limburg' } },
	{ code: 'NB', title: { nl: 'Noord-Brabant', en: 'North Brabant' } },
	{ code: 'NH', title: { nl: 'Noord-Holland', en: 'North Holland' } },
	{ code: 'OV', title: { nl: 'Overijssel', en: 'Overijssel' } },
	{ code: 'UT', title: { nl: 'Utrecht', en: 'Utrecht' } },
	{ code: 'ZE', title: { nl: 'Zeeland', en: 'Zeeland' } },
	{ code: 'ZH', title: { nl: 'Zuid-Holland', en: 'South Holland' } },
	{ code: 'BO', title: { nl: 'Kiescollege Bonaire', en: 'Electoral College Bonaire' } },
	{
		code: 'SE',
		title: { nl: 'Kiescollege Sint Eustatius', en: 'Electoral College Sint Eustatius' }
	},
	{ code: 'SA', title: { nl: 'Kiescollege Saba', en: 'Electoral College Saba' } },
	{
		code: 'KN',
		title: { nl: 'Kiescollege Niet-Ingezetenen', en: 'Electoral College Non-Residents' }
	}
];

export function districtTitle(code: DistrictCode, locale: Locale) {
	return DISTRICTS.find((district) => district.code === code)?.title[locale] ?? code;
}

export function maxCandidates(longListAllowed: boolean | null) {
	return longListAllowed ? 80 : 50;
}
