export type Locale = "nl" | "en";

export type Gender = "" | "male" | "female";

export type DistrictCode =
  | "DR"
  | "FL"
  | "FR"
  | "GE"
  | "GR"
  | "LI"
  | "NB"
  | "NH"
  | "OV"
  | "UT"
  | "ZE"
  | "ZH"
  | "BO"
  | "SE"
  | "SA"
  | "KN";

export interface Name {
  initials: string;
  firstName: string;
  lastNamePrefix: string;
  lastName: string;
}

export interface DutchAddress {
  postalCode: string;
  houseNumber: string;
  houseNumberAddition: string;
  streetName: string;
  locality: string;
}

export interface InternationalAddress extends DutchAddress {
  stateOrProvince: string;
  country: string;
}

export interface Representative {
  name: Name;
  address: InternationalAddress;
}

export interface PersonalData {
  gender: Gender;
  bsn: string;
  dateOfBirth: string;
  placeOfResidence: string;
  country: string;
}

export interface Person {
  id: string;
  name: Name;
  personalData: PersonalData;
  address: DutchAddress;
  representative: Representative;
  updatedAt: string;
}

export interface PoliticalGroup {
  id: string;
  longListAllowed: boolean | null;
  legalName: string;
  displayName: string;
}

export interface AuthorisedAgent {
  id: string;
  name: Name;
}

export interface ListSubmitter {
  id: string;
  name: Name;
  address: InternationalAddress;
}

export interface CandidateList {
  id: string;
  electoralDistricts: DistrictCode[];
  candidateIds: string[];
  listSubmitterId: string | null;
  substituteListSubmitterIds: string[];
  createdAt: string;
}

export interface AppData {
  locale: Locale;
  electionCode: "EK2027";
  politicalGroup: PoliticalGroup;
  authorisedAgents: AuthorisedAgent[];
  listSubmitters: ListSubmitter[];
  substituteListSubmitters: ListSubmitter[];
  persons: Person[];
  candidateLists: CandidateList[];
  once: boolean;
}
