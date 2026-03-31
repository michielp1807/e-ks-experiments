<script lang="ts">
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import CountryCodeInput from "$lib/components/CountryCodeInput.svelte";
import NameFields from "$lib/components/NameFields.svelte";
import { personLivesInNl } from "$lib/helpers";
import { appState } from "$lib/state/app";
import type { CandidateList, Person } from "$lib/types";
import Potty from "./Potty.svelte";

let {
  candidateList,
  person,
}: {
  candidateList: CandidateList;
  person: Person;
} = $props();

let draft = $state<Person>({
  id: "",
  name: { initials: "", firstName: "", lastNamePrefix: "", lastName: "" },
  personalData: {
    gender: "",
    bsn: "",
    dateOfBirth: "",
    placeOfResidence: "",
    country: "",
  },
  address: {
    postalCode: "",
    houseNumber: "",
    houseNumberAddition: "",
    streetName: "",
    locality: "",
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
  updatedAt: "",
});
let ready = $state(false);

function copyPerson(value: Person): Person {
  return {
    ...value,
    name: { ...value.name },
    personalData: { ...value.personalData },
    address: { ...value.address },
    representative: {
      name: { ...value.representative.name },
      address: { ...value.representative.address },
    },
  };
}

$effect(() => {
  draft = copyPerson(person);
  ready = true;
});

function nextHref() {
  return personLivesInNl(draft)
    ? resolve("/candidate-lists/[id]/candidates/[personId]/address", {
        id: candidateList.id,
        personId: draft.id,
      })
    : resolve("/candidate-lists/[id]/candidates/[personId]/representative", {
        id: candidateList.id,
        personId: draft.id,
      });
}
</script>

{#if ready}
  <form
    class="form"
    onsubmit={(event) => {
      event.preventDefault();
      appState.upsertPerson(draft);
      goto(nextHref());
    }}
  >
    <fieldset>
      <legend><h3>Persoonlijke gegevens</h3></legend>
      <NameFields name={draft.name} />
      <div class="form-row">
        <p class="form-field">
          <label for="place_of_residence">Woonplaats</label>
          <input
            bind:value={draft.personalData.placeOfResidence}
            id="place_of_residence"
            type="text"
          />
        </p>
        <p class="form-field form-field-sm">
          <label for="country">Landcode</label>
          <CountryCodeInput
            bind:value={draft.personalData.country}
            id="country"
          />
        </p>
      </div>
      <div class="form-row">
        <p class="form-field">
          <label for="bsn">BSN</label>
          <input bind:value={draft.personalData.bsn} id="bsn" type="text" />
        </p>
        <p class="form-field form-field-md">
          <label for="date_of_birth">Geboortedatum</label>
          <input
            bind:value={draft.personalData.dateOfBirth}
            id="date_of_birth"
            type="text"
            placeholder="dd-mm-jjjj"
          />
        </p>
      </div>
      <div class="form-row">
        <p class="form-field">
          <label for="gender">Geslacht</label>
          <select bind:value={draft.personalData.gender} id="gender">
            <option value="">Niet opgegeven</option>
            <option value="male">Man</option>
            <option value="female">Vrouw</option>
          </select>
        </p>
      </div>
      <div class="buttons">
        <button class="button" type="submit">Volgende</button>
        <button
          class="button tertiary-destructive icon-trash"
          type="button"
          onclick={() => {
            appState.deletePerson(draft.id);
            goto(resolve("/candidate-lists/[id]", { id: candidateList.id }));
          }}
        >
          Verwijder kandidaat
        </button>
      </div>
    </fieldset>
  </form>
  <Potty
    introText="Hoewel data in deze demo applicatie alleen in de client wordt opgeslagen, raad ik aan geen echte persoonsgegevens in te vullen."
  ></Potty>
{/if}
