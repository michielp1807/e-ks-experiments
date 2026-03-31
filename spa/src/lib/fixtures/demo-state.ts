import personsCsv from "$lib/fixtures/persons.csv?raw";
import { ELECTION } from "$lib/election";
import { isPersonComplete } from "$lib/helpers";
import type { AppData, Person } from "$lib/types";

const FIXTURE_CANDIDATE_LIST_SIZE = 55;

const FIXTURE_IDS = {
  politicalGroup: "ca076808-ed15-5f48-a8f9-f719e4adc7f6",
  authorisedAgent: "a8a28112-84fc-5f21-b9ac-eb514706fe50",
  listSubmitter: "a3eb7e69-a4a0-5458-852d-2835b689c6f5",
  substituteSubmitter1: "5be94d3e-7854-57fe-bf96-55cebca4c8c3",
  substituteSubmitter2: "aef131c1-7883-5237-b152-a3842fd009ea",
  candidateList1: "62125dbf-c44e-5042-9283-0e698ceffbfc",
  candidateList2: "a8b36324-c7b2-52dc-9eed-06ca726ae15d",
  candidateList3: "e247716f-d2f3-54b5-8d93-0be5734838f1",
} as const;

interface CsvPerson {
  burgerservicenummer: string;
  geslacht: string;
  voornamen: string;
  geslachtsnaam: string;
  geboortedatum: string;
  straat: string;
  huisnummer: string;
  postcode: string;
  woonplaats: string;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function loadFixturePersons(): CsvPerson[] {
  const [headerLine, ...lines] = personsCsv.trim().split("\n");
  const headers = parseCsvLine(headerLine);

  return lines.map((line) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""]),
    ) as Record<string, string>;

    return {
      burgerservicenummer: row.burgerservicenummer ?? "",
      geslacht: row.geslacht ?? "",
      voornamen: row.voornamen ?? "",
      geslachtsnaam: row.geslachtsnaam ?? "",
      geboortedatum: row.geboortedatum ?? "",
      straat: row.straat ?? "",
      huisnummer: row.huisnummer ?? "",
      postcode: row.postcode ?? "",
      woonplaats: row.woonplaats ?? "",
    };
  });
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] ?? "";
}

function initials(value: string) {
  const joined = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join(".");

  return joined ? `${joined}.` : "";
}

function formatDate(value: string) {
  if (!/^\d{8}$/.test(value)) {
    return "";
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));

  if (!year || !month || !day) {
    return "";
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
}

function personId(record: CsvPerson, index: number) {
  return `fixture-person-${index + 1}-${record.burgerservicenummer}`;
}

function buildPersons() {
  return loadFixturePersons().map(
    (record, index): Person => ({
      id: personId(record, index),
      name: {
        initials: initials(record.voornamen),
        firstName: firstName(record.voornamen),
        lastNamePrefix: "",
        lastName: record.geslachtsnaam,
      },
      personalData: {
        gender:
          record.geslacht === "M"
            ? "male"
            : record.geslacht === "V"
              ? "female"
              : "",
        bsn: record.burgerservicenummer,
        dateOfBirth: formatDate(record.geboortedatum),
        placeOfResidence: record.woonplaats,
        country: "NL",
      },
      address: {
        postalCode: record.postcode,
        houseNumber: record.huisnummer,
        houseNumberAddition: "",
        streetName: record.straat,
        locality: record.woonplaats,
      },
      representative: {
        name: { initials: "", firstName: "", lastNamePrefix: "", lastName: "" },
        address: {
          postalCode: "",
          houseNumber: "",
          houseNumberAddition: "",
          streetName: "",
          locality: "",
          stateOrProvince: "",
          country: "NL",
        },
      },
      updatedAt: new Date(Date.UTC(2024, 0, 1, 0, index, 0)).toISOString(),
    }),
  );
}

export function createDemoState(): AppData {
  const persons = buildPersons();
  const firstListPersonIds = persons
    .slice(0, FIXTURE_CANDIDATE_LIST_SIZE)
    .map((person) => person.id);
  const validPersonIds = persons
    .filter((person) => isPersonComplete(person))
    .slice(0, FIXTURE_CANDIDATE_LIST_SIZE)
    .map((person) => person.id);

  return {
    once: false,
    locale: "nl",
    electionCode: ELECTION.code,
    politicalGroup: {
      id: FIXTURE_IDS.politicalGroup,
      longListAllowed: null,
      legalName: "Demo Partij",
      displayName: "Demo",
    },
    authorisedAgents: [
      {
        id: FIXTURE_IDS.authorisedAgent,
        name: {
          initials: "A.B.",
          firstName: "",
          lastNamePrefix: "de",
          lastName: "Jansen",
        },
      },
    ],
    listSubmitters: [
      {
        id: FIXTURE_IDS.listSubmitter,
        name: {
          initials: "E.F.",
          firstName: "",
          lastNamePrefix: "",
          lastName: "Bos",
        },
        address: {
          postalCode: "3011 CC",
          houseNumber: "5",
          houseNumberAddition: "B",
          streetName: "Coolsingel",
          locality: "Rotterdam",
          stateOrProvince: "",
          country: "NL",
        },
      },
    ],
    substituteListSubmitters: [
      {
        id: FIXTURE_IDS.substituteSubmitter1,
        name: {
          initials: "G.H.",
          firstName: "",
          lastNamePrefix: "van",
          lastName: "Smit",
        },
        address: {
          postalCode: "2511 DD",
          houseNumber: "18",
          houseNumberAddition: "",
          streetName: "Spui",
          locality: "Den Haag",
          stateOrProvince: "",
          country: "NL",
        },
      },
      {
        id: FIXTURE_IDS.substituteSubmitter2,
        name: {
          initials: "I.J.",
          firstName: "",
          lastNamePrefix: "",
          lastName: "Jong",
        },
        address: {
          postalCode: "3511 AA",
          houseNumber: "21",
          houseNumberAddition: "C",
          streetName: "Oudegracht",
          locality: "Utrecht",
          stateOrProvince: "",
          country: "NL",
        },
      },
    ],
    persons,
    candidateLists: [
      {
        id: FIXTURE_IDS.candidateList1,
        electoralDistricts: ["NH"],
        candidateIds: firstListPersonIds,
        listSubmitterId: FIXTURE_IDS.listSubmitter,
        substituteListSubmitterIds: [FIXTURE_IDS.substituteSubmitter1],
        createdAt: new Date(Date.UTC(2024, 0, 1, 12, 0, 0)).toISOString(),
      },
      {
        id: FIXTURE_IDS.candidateList2,
        electoralDistricts: ["GR", "FR"],
        candidateIds: validPersonIds,
        listSubmitterId: FIXTURE_IDS.listSubmitter,
        substituteListSubmitterIds: [FIXTURE_IDS.substituteSubmitter1],
        createdAt: new Date(Date.UTC(2024, 0, 1, 12, 1, 0)).toISOString(),
      },
      {
        id: FIXTURE_IDS.candidateList3,
        electoralDistricts: ["UT", "NB", "GE", "OV"],
        candidateIds: firstListPersonIds.slice(
          0,
          Math.floor(FIXTURE_CANDIDATE_LIST_SIZE / 2),
        ),
        listSubmitterId: FIXTURE_IDS.listSubmitter,
        substituteListSubmitterIds: [FIXTURE_IDS.substituteSubmitter1],
        createdAt: new Date(Date.UTC(2024, 0, 1, 12, 2, 0)).toISOString(),
      },
    ],
  };
}
