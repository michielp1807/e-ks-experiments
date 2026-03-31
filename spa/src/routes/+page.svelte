<script lang="ts">
import { resolve } from "$app/paths";
import PageHeader from "$lib/components/PageHeader.svelte";
import { ELECTION } from "$lib/election";
import { appState } from "$lib/state/app";
import { fromStore } from "svelte/store";
import Potty from "$lib/components/Potty.svelte";

const app = fromStore(appState);
const state = $derived(app.current);
</script>

<PageHeader title={ELECTION.titles[state.locale]} />

<section>
  <h2 class="hidden">Stappen</h2>
  <div class="cards cards-home">
    <a
      href={resolve("/political-group")}
      class="card card-data"
      data-potty="Bij stap 1 vul je de gegevens van jouw politieke groepering in, waaronder de aanduiding, gemachtigden, en lijstinleveraars."
    >
      <div class="badge"></div>
      <h3>Stap 1</h3>
      <h4>Basisgegevens</h4>
      <ul class="instruction">
        <li>Vul de gegevens van de politieke groepering in</li>
        <li>Beheer gemachtigden en lijstinleveraars</li>
      </ul>
      <p>Basisgegevens beheren</p>
    </a>

    <a
      href={resolve("/candidate-lists")}
      class="card card-candidate-list"
      data-potty="Bij stap 2 voeg je de kandidaten van jouw politieke groepering toe, en maak je kandidatenlijsten aan."
    >
      <div class="badge"></div>
      <h3>Stap 2</h3>
      <h4>Kandidatenlijsten</h4>
      <ul class="instruction">
        <li>Voeg kandidaten toe</li>
        <li>Maak kandidatenlijst(en) aan</li>
      </ul>
      <p>Kandidatenlijsten beheren</p>
    </a>

    <a
      href={resolve("/submit")}
      class="card card-locked"
      data-potty="Bij stap 3 kun je de documenten downloaden die uiteindelijk bij de kiesraad ingeleverd moeten worden."
    >
      <div class="badge"></div>
      <h3>Stap 3</h3>
      <h4>Afronden</h4>
      <ul class="instruction">
        <li>Download alle benodigde documenten</li>
        <li>Bekijk de vervolgstappen</li>
        <li>Lever de kandidatenlijst(en) in</li>
      </ul>
      <div class="alert alert-info">
        <span class="instruction"
          >Doe dit uiterlijk op de dag van kandidaatstelling:</span
        >
        <p class="font-bold mt-md">20-04-2027</p>
      </div>
      <p>Controleren en inleveren</p>
    </a>
  </div>
  <Potty
    introText={"Hallo! Ik ben Potty het Potlood!\nWaar kan ik je mee helpen vandaag?"}
  ></Potty>
</section>
