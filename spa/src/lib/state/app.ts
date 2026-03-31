import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { ELECTION } from "$lib/election";
import { createDemoState } from "$lib/fixtures/demo-state";
import type {
  AppData,
  AuthorisedAgent,
  CandidateList,
  ListSubmitter,
  Person,
  PoliticalGroup,
} from "$lib/types";

const STORAGE_KEY = "eks-spa-state-v1";

function defaultState(): AppData {
  return {
    locale: "nl",
    electionCode: ELECTION.code,
    politicalGroup: {
      id: "political-group",
      longListAllowed: null,
      legalName: "",
      displayName: "",
    },
    authorisedAgents: [],
    listSubmitters: [],
    substituteListSubmitters: [],
    persons: [],
    candidateLists: [],
    once: false,
  };
}

function loadState() {
  if (!browser) {
    return createDemoState();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDemoState();
  }

  try {
    return { ...defaultState(), ...JSON.parse(raw) } as AppData;
  } catch {
    return createDemoState();
  }
}

function createAppState() {
  const store = writable<AppData>(loadState());

  if (browser) {
    store.subscribe((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  return {
    subscribe: store.subscribe,
    setLocale(locale: AppData["locale"]) {
      store.update((state) => ({ ...state, locale }));
    },
    updatePoliticalGroup(politicalGroup: PoliticalGroup) {
      const normalizedPoliticalGroup: PoliticalGroup = { ...politicalGroup };
      store.update((state) => ({
        ...state,
        politicalGroup: normalizedPoliticalGroup,
      }));
    },
    upsertPerson(person: Person) {
      const normalizedPerson: Person = {
        ...person,
        name: { ...person.name },
        personalData: { ...person.personalData },
        address: { ...person.address },
        representative: {
          ...person.representative,
          name: { ...person.representative.name },
          address: { ...person.representative.address },
        },
        updatedAt: new Date().toISOString(),
      };

      store.update((state) => {
        const persons = state.persons.filter(
          (entry) => entry.id !== normalizedPerson.id,
        );
        return {
          ...state,
          persons: [...persons, normalizedPerson].sort((a, b) =>
            a.name.lastName.localeCompare(b.name.lastName, "nl"),
          ),
        };
      });
    },
    deletePerson(personId: string) {
      store.update((state) => ({
        ...state,
        persons: state.persons.filter((person) => person.id !== personId),
        candidateLists: state.candidateLists.map((list) => ({
          ...list,
          candidateIds: list.candidateIds.filter(
            (candidateId) => candidateId !== personId,
          ),
        })),
      }));
    },
    upsertAuthorisedAgent(agent: AuthorisedAgent) {
      const normalizedAgent: AuthorisedAgent = {
        ...agent,
        name: { ...agent.name },
      };

      store.update((state) => ({
        ...state,
        authorisedAgents: [
          ...state.authorisedAgents.filter(
            (entry) => entry.id !== normalizedAgent.id,
          ),
          normalizedAgent,
        ].sort((a, b) => a.name.lastName.localeCompare(b.name.lastName, "nl")),
      }));
    },
    deleteAuthorisedAgent(agentId: string) {
      store.update((state) => ({
        ...state,
        authorisedAgents: state.authorisedAgents.filter(
          (entry) => entry.id !== agentId,
        ),
      }));
    },
    upsertListSubmitter(submitter: ListSubmitter, substitute = false) {
      const normalizedSubmitter: ListSubmitter = {
        ...submitter,
        name: { ...submitter.name },
        address: { ...submitter.address },
      };

      store.update((state) => {
        if (substitute) {
          return {
            ...state,
            substituteListSubmitters: [
              ...state.substituteListSubmitters.filter(
                (entry) => entry.id !== normalizedSubmitter.id,
              ),
              normalizedSubmitter,
            ].sort((a, b) =>
              a.name.lastName.localeCompare(b.name.lastName, "nl"),
            ),
          };
        }

        return {
          ...state,
          listSubmitters: [
            ...state.listSubmitters.filter(
              (entry) => entry.id !== normalizedSubmitter.id,
            ),
            normalizedSubmitter,
          ].sort((a, b) =>
            a.name.lastName.localeCompare(b.name.lastName, "nl"),
          ),
        };
      });
    },
    deleteListSubmitter(submitterId: string, substitute = false) {
      store.update((state) => {
        const next: AppData = {
          ...state,
          candidateLists: state.candidateLists.map((list) => ({
            ...list,
            listSubmitterId:
              list.listSubmitterId === submitterId
                ? null
                : list.listSubmitterId,
            substituteListSubmitterIds: list.substituteListSubmitterIds.filter(
              (id) => id !== submitterId,
            ),
          })),
        };

        if (substitute) {
          next.substituteListSubmitters = state.substituteListSubmitters.filter(
            (entry) => entry.id !== submitterId,
          );
        } else {
          next.listSubmitters = state.listSubmitters.filter(
            (entry) => entry.id !== submitterId,
          );
        }

        return next;
      });
    },
    upsertCandidateList(candidateList: CandidateList) {
      const normalizedCandidateList: CandidateList = {
        ...candidateList,
        electoralDistricts: [...candidateList.electoralDistricts],
        candidateIds: [...candidateList.candidateIds],
        substituteListSubmitterIds: [
          ...candidateList.substituteListSubmitterIds,
        ],
      };

      store.update((state) => ({
        ...state,
        candidateLists: [
          ...state.candidateLists.filter(
            (entry) => entry.id !== normalizedCandidateList.id,
          ),
          normalizedCandidateList,
        ].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      }));
    },
    deleteCandidateList(candidateListId: string) {
      store.update((state) => ({
        ...state,
        candidateLists: state.candidateLists.filter(
          (list) => list.id !== candidateListId,
        ),
      }));
    },
    setLongPottyIntro(longPottyIntro: AppData["once"]) {
      store.update((state) => ({ ...state, once: longPottyIntro }));
    },
  };
}

export const appState = createAppState();
