<script lang="ts">
import AddressFields from "$lib/components/AddressFields.svelte";
import CountryCodeInput from "$lib/components/CountryCodeInput.svelte";
import NameFields from "$lib/components/NameFields.svelte";
import { appState } from "$lib/state/app";
import { isPersonComplete, personLivesInNl } from "$lib/helpers";
import type { Person } from "$lib/types";
import Potty from "./Potty.svelte";

let {
  person,
  submitLabel = "Opslaan",
  onSubmit,
}: {
  person: Person;
  submitLabel?: string;
  onSubmit?: (person: Person) => void;
} = $props();
</script>

<form
  class="form"
  onsubmit={(event) => {
    event.preventDefault();
    appState.upsertPerson(person);
    onSubmit?.(person);
  }}
>
  <fieldset>
    <legend><h2>Persoonsgegevens</h2></legend>
    <NameFields name={person.name} />
    <div class="form-row">
      <p class="form-field">
        <label for="place_of_residence">Woonplaats</label>
        <input
          bind:value={person.personalData.placeOfResidence}
          id="place_of_residence"
          type="text"
        />
      </p>
      <p class="form-field form-field-sm">
        <label for="country">Landcode</label>
        <CountryCodeInput
          bind:value={person.personalData.country}
          id="country"
        />
      </p>
    </div>
    <div class="form-row">
      <p class="form-field">
        <label for="bsn">BSN</label>
        <input bind:value={person.personalData.bsn} id="bsn" type="text" />
      </p>
      <p class="form-field form-field-md">
        <label for="date_of_birth">Geboortedatum</label>
        <input
          bind:value={person.personalData.dateOfBirth}
          id="date_of_birth"
          type="text"
          placeholder="dd-mm-jjjj"
        />
      </p>
    </div>
    <div class="form-row">
      <p class="form-field">
        <label for="gender">Geslacht</label>
        <select bind:value={person.personalData.gender} id="gender">
          <option value="">Niet opgegeven</option>
          <option value="male">Man</option>
          <option value="female">Vrouw</option>
        </select>
      </p>
    </div>
  </fieldset>

  {#if personLivesInNl(person)}
    <fieldset>
      <legend><h2>Correspondentieadres</h2></legend>
      <AddressFields address={person.address} />
    </fieldset>
  {:else}
    <fieldset>
      <legend><h2>Vertegenwoordiger</h2></legend>
      <NameFields name={person.representative.name} />
      <AddressFields
        address={person.representative.address}
        international={true}
      />
    </fieldset>
  {/if}

  <div class="buttons">
    <button class="button" type="submit">{submitLabel}</button>
    <span
      class={`status-pill ${isPersonComplete(person) ? "complete" : "warning"}`}
    >
      {isPersonComplete(person) ? "Volledig" : "Nog onvolledig"}
    </span>
  </div>

  <Potty
    introText="Hoewel data in deze demo applicatie alleen in de client wordt opgeslagen, raad ik aan geen echte persoonsgegevens in te vullen."
  ></Potty>
</form>
