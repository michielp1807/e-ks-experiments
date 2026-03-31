<script lang="ts">
import { resolve } from "$app/paths";
import PageHeader from "$lib/components/PageHeader.svelte";
import { appState } from "$lib/state/app";
import { formatName, isPersonComplete } from "$lib/helpers";
import { fromStore } from "svelte/store";
import Potty from "$lib/components/Potty.svelte";

const app = fromStore(appState);
const appData = $derived(app.current);
let search = $state("");

const persons = $derived(
  appData.persons.filter((person) => {
    const haystack =
      `${formatName(person.name)} ${person.personalData.placeOfResidence}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  }),
);
</script>

<PageHeader
  title="Kandidaten"
  backHref="/candidate-lists"
  backLabel="Terug naar lijsten"
/>

<nav class="sticky-nav form">
  <div class="sticky-nav-bar toolbar">
    <div class="form-field">
      <label for="search">Zoek bestaande kandidaat</label>
      <input
        bind:value={search}
        type="text"
        class="form-control"
        id="search"
        placeholder={appData.locale === "en"
          ? "Search by name, initials or locality"
          : "Zoek op naam, voorletters of woonplaats"}
      />
    </div>
    <div class="buttons">
      <a href={resolve("/candidates/new")} class="button secondary icon-plus"
        >Kandidaat toevoegen</a
      >
    </div>
  </div>
</nav>

{#if persons.length === 0}
  <section>
    <p>Er zijn nog geen kandidaten.</p>
  </section>
{:else}
  <section>
    <table id="persons-table">
      <thead>
        <tr>
          <th scope="col">Achternaam</th>
          <th scope="col">Initialen</th>
          <th scope="col">Voornaam</th>
          <th scope="col">Geslacht</th>
          <th scope="col">Woonplaats</th>
          <th scope="col">Bijgewerkt</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {#each persons as person}
          <tr class:warning={!isPersonComplete(person)}>
            <td>{person.name.lastNamePrefix} {person.name.lastName}</td>
            <td>{person.name.initials}</td>
            <td>{person.name.firstName}</td>
            <td
              >{person.personalData.gender === "male"
                ? "Man"
                : person.personalData.gender === "female"
                  ? "Vrouw"
                  : ""}</td
            >
            <td>{person.personalData.placeOfResidence}</td>
            <td>{new Date(person.updatedAt).toLocaleDateString("nl-NL")}</td>
            <td
              ><a href={resolve("/candidates/[id]", { id: person.id })}
                >Bewerk</a
              ></td
            >
          </tr>
        {/each}
      </tbody>
    </table>

    <Potty
      introText="Uhh... Het lijkt er op dat deze pagina nog een paar bugs heeft. Sorry daarvoor. Probeer de pagina te herladen wanneer dingen kapot gaan."
    ></Potty>
  </section>
{/if}
