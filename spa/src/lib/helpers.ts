import { DISTRICTS, districtTitle, maxCandidates } from "$lib/election";
import type {
  AppData,
  CandidateList,
  DistrictCode,
  InternationalAddress,
  ListSubmitter,
  Locale,
  Name,
  Person,
} from "$lib/types";

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export function emptyName(): Name {
  return { initials: "", firstName: "", lastNamePrefix: "", lastName: "" };
}

export function emptyDutchAddress() {
  return {
    postalCode: "",
    houseNumber: "",
    houseNumberAddition: "",
    streetName: "",
    locality: "",
  };
}

export function emptyInternationalAddress(): InternationalAddress {
  return { ...emptyDutchAddress(), stateOrProvince: "", country: "NL" };
}

export function emptyPerson(): Person {
  return {
    id: createId(),
    name: emptyName(),
    personalData: {
      gender: "",
      bsn: "",
      dateOfBirth: "",
      placeOfResidence: "",
      country: "NL",
    },
    address: emptyDutchAddress(),
    representative: {
      name: emptyName(),
      address: emptyInternationalAddress(),
    },
    updatedAt: new Date().toISOString(),
  };
}

export function emptyListSubmitter(): ListSubmitter {
  return {
    id: createId(),
    name: emptyName(),
    address: emptyInternationalAddress(),
  };
}

export function emptyCandidateList(): CandidateList {
  return {
    id: createId(),
    electoralDistricts: [],
    candidateIds: [],
    listSubmitterId: null,
    substituteListSubmitterIds: [],
    createdAt: new Date().toISOString(),
  };
}

export function formatName(name: Name) {
  return [name.initials, name.firstName, name.lastNamePrefix, name.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function formatLastName(name: Name) {
  return [name.lastNamePrefix, name.lastName].filter(Boolean).join(" ").trim();
}

export function addressLine1(address: InternationalAddress) {
  return [
    address.streetName,
    `${address.houseNumber}${address.houseNumberAddition}`.trim(),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function addressLine2(address: InternationalAddress) {
  const country =
    address.country && address.country !== "NL" ? ` (${address.country})` : "";
  return (
    [address.postalCode, address.locality].filter(Boolean).join(" ").trim() +
    country
  );
}

export function personLivesInNl(person: Person) {
  return !person.personalData.country || person.personalData.country === "NL";
}

export function isNameComplete(name: Name) {
  return Boolean(name.initials.trim() && name.lastName.trim());
}

export function isDutchAddressComplete(address: Person["address"]) {
  return Boolean(
    address.streetName.trim() &&
    address.houseNumber.trim() &&
    address.postalCode.trim() &&
    address.locality.trim(),
  );
}

export function isInternationalAddressComplete(address: InternationalAddress) {
  return Boolean(
    address.streetName.trim() &&
    address.houseNumber.trim() &&
    address.postalCode.trim() &&
    address.locality.trim() &&
    address.country.trim(),
  );
}

export function isPersonComplete(person?: Person) {
  if (!person) {
    return false;
  }

  const personalInfoComplete = Boolean(
    isNameComplete(person.name) &&
    person.personalData.dateOfBirth.trim() &&
    person.personalData.bsn.trim() &&
    person.personalData.placeOfResidence.trim() &&
    person.personalData.country.trim(),
  );

  if (!personalInfoComplete) {
    return false;
  }

  if (personLivesInNl(person)) {
    return isDutchAddressComplete(person.address);
  }

  return (
    isNameComplete(person.representative.name) &&
    isInternationalAddressComplete(person.representative.address)
  );
}

export function duplicateDistricts(data: AppData, candidateListId: string) {
  const counts = new Map<DistrictCode, number>();
  for (const list of data.candidateLists) {
    for (const district of list.electoralDistricts) {
      counts.set(district, (counts.get(district) ?? 0) + 1);
    }
  }

  return (
    data.candidateLists
      .find((list) => list.id === candidateListId)
      ?.electoralDistricts.filter(
        (district) => (counts.get(district) ?? 0) > 1,
      ) ?? []
  );
}

export function availableDistricts(data: AppData, currentListId?: string) {
  const used = new Set<DistrictCode>();
  for (const list of data.candidateLists) {
    if (list.id === currentListId) continue;
    for (const district of list.electoralDistricts) {
      used.add(district);
    }
  }

  return DISTRICTS.filter((district) => !used.has(district.code));
}

export function candidateListCanSubmit(
  data: AppData,
  candidateList: CandidateList,
) {
  const count = candidateList.candidateIds.length;
  return (
    count > 0 &&
    count <= maxCandidates(data.politicalGroup.longListAllowed) &&
    candidateList.candidateIds.every((id) =>
      isPersonComplete(data.persons.find((p) => p.id == id)),
    ) &&
    candidateList.electoralDistricts.length > 0
  );
}

export function districtSummary(codes: DistrictCode[], locale: Locale | "fry") {
  if (codes.length === DISTRICTS.length) {
    return locale === "nl" ? "alle kieskringen" : "all electoral districts";
  }

  if (codes.length === 1) {
    return districtTitle(codes[0], locale);
  }

  if (codes.length === 2) {
    return codes.map((code) => districtTitle(code, locale)).join(" en ");
  }

  return (
    codes
      .slice(0, codes.length - 1)
      .map((code) => districtTitle(code, locale))
      .join(", ") +
    " en " +
    districtTitle(codes[codes.length - 1], locale)
  );
}
