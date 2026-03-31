<script lang="ts">
import { resolve } from "$app/paths";
import DistrictsList from "$lib/components/DistrictsList.svelte";
import PageHeader from "$lib/components/PageHeader.svelte";
import { appState } from "$lib/state/app";
import { duplicateDistricts } from "$lib/helpers";
import { maxCandidates } from "$lib/election";
import { fromStore } from "svelte/store";
import Potty from "$lib/components/Potty.svelte";

const app = fromStore(appState);
const state = $derived(app.current);
</script>

<PageHeader title="Kandidatenlijsten" backHref="/" />

<section>
  <div class="cards cards-candidate-lists">
    <a href={resolve("/candidates")} class="card card-persons">
      <div class="badge"></div>
      <h3>Alle kandidaten</h3>
      <p class="statistic">
        {state.persons.length} kandidaten toegevoegd
      </p>
      <p class="instruction">
        Kandidaten die u heeft aangemaakt vindt u hier terug
      </p>
      <p>Beheer kandidaten</p>
    </a>

    <div class="cards-right">
      {#each state.candidateLists as candidateList}
        <a
          href={resolve("/candidate-lists/[id]", { id: candidateList.id })}
          class={`card ${duplicateDistricts(state, candidateList.id).length > 0 ? "card-list-warning" : "card-candidate-list"}`}
        >
          <div class="badge"></div>
          <h3>Kandidatenlijst</h3>
          <p class="statistic">
            {candidateList.candidateIds.length}/{maxCandidates(
              state.politicalGroup.longListAllowed,
            )} kandidaten
          </p>
          <h5>Kieskringen:</h5>
          <DistrictsList
            districts={candidateList.electoralDistricts}
            locale={state.locale}
            warnings={duplicateDistricts(state, candidateList.id)}
          />
          <p>Kandidatenlijst beheren</p>
        </a>
      {/each}

      <div class="card card-add-list">
        <a
          href={resolve("/candidate-lists/new")}
          class="button secondary icon-plus">Lijst toevoegen</a
        >
      </div>
    </div>
  </div>

  <Potty
    introText="Kies of maak een kandidaten om te bewerken, of bekijk de lijst van alle zover toegevoegde kandidaten."
  ></Potty>
</section>
