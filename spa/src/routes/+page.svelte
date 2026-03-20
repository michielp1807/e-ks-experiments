<script lang="ts">
  import { resolve } from "$app/paths";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { ELECTION } from "$lib/election";
  import { appState } from "$lib/state/app";
  import {
    candidateListCanSubmit,
    isPoliticalGroupComplete,
  } from "$lib/helpers";
  import { fromStore } from "svelte/store";

  const app = fromStore(appState);
  const state = $derived(app.current);
</script>

<PageHeader title={ELECTION.titles[state.locale]} />

<section>
  <h2 class="hidden">Stappen</h2>
  <div class="cards cards-home">
    <a href={resolve("/political-group")} class="card card-data">
      <div class="badge"></div>
      <h3>Stap 1</h3>
      <h4>Basisgegevens</h4>
      <ul class="instruction">
        <li>Vul de gegevens van de politieke groepering in.</li>
        <li>Beheer gemachtigden en lijstindieners.</li>
      </ul>
      <p>
        {isPoliticalGroupComplete(state)
          ? "Basisgegevens beheren"
          : "Nog niet compleet"}
      </p>
    </a>

    <a href={resolve("/candidate-lists")} class="card card-candidate-list">
      <div class="badge"></div>
      <h3>Stap 2</h3>
      <h4>Kandidatenlijsten</h4>
      <ul class="instruction">
        <li>Voeg kandidaten toe en stel de volgorde vast.</li>
        <li>Beheer kieskringen en indieners per lijst.</li>
      </ul>
      <p>Kandidatenlijsten beheren</p>
    </a>

    <a href={resolve("/submit")} class="card card-locked">
      <div class="badge"></div>
      <h3>Stap 3</h3>
      <h4>Inleveren</h4>
      <ul class="instruction">
        <li>Controleer welke lijsten klaar zijn voor verdere verwerking.</li>
        <li>PDF-generatie is nog niet geïmplementeerd in dit prototype.</li>
      </ul>
      <div class="alert alert-info">
        <span class="instruction">Uiterste datum:</span>
        <p class="font-bold mt-md">20-04-2027</p>
      </div>
      <p>
        {state.candidateLists.filter((list) =>
          candidateListCanSubmit(state, list),
        ).length} lijst(en) klaar voor vervolgstap
      </p>
    </a>
  </div>
</section>
