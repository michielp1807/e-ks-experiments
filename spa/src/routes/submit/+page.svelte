<script lang="ts">
import DistrictsList from "$lib/components/DistrictsList.svelte";
import PageHeader from "$lib/components/PageHeader.svelte";
import { appState } from "$lib/state/app";
import {
  candidateListCanSubmit,
  districtSummary,
  duplicateDistricts,
} from "$lib/helpers";
import { maxCandidates } from "$lib/election";
import { fromStore } from "svelte/store";
import Potty from "$lib/components/Potty.svelte";
import type { CandidateList } from "$lib/types";

const app = fromStore(appState);
const state = $derived(app.current);

let potty: Potty;

function download(candidateList: CandidateList, fries?: boolean) {
  if (!candidateListCanSubmit(state, candidateList)) {
    if (fries) {
      potty.speak(
        `Hmm, it liket derop dat de list mei kandidaten foar ${districtSummary(
          candidateList.electoralDistricts,
          "fry",
        )} noch ûnfolslein is. Gean werom nei stap 2 om de ûntbrekkende ynformaasje yn te foljen.`,
      );
    } else {
      potty.speak(
        `Hmm, het lijkt er op dat de kandidatenlijst voor ${districtSummary(
          candidateList.electoralDistricts,
          "nl",
        )} nog incompleet is. Ga terug naar stap 2 om de missende gegevens in te vullen.`,
      );
    }
  } else {
    if (fries) {
      potty.speak("Oeps, it liket derop dat de PDF-printer net ferbûn is.");
    } else {
      potty.speak(
        "Oeps, het lijkt er op dat de PDF printer niet is aangesloten.",
      );
    }
  }
}
</script>

<PageHeader title="Afronden" backHref="/" />

<section>
  <div class="cards cards-candidate-lists cards-submit">
    <div class="cards-right">
      {#if state.candidateLists.length === 0}
        <p>Er zijn nog geen kandidatenlijsten.</p>
      {:else}
        {#each state.candidateLists as candidateList}
          <div
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
            <div class="card-actions">
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, false)}
              >
                H1 downloaden (Nederlands)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, true)}
              >
                H1 downloaden (Fries)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, false)}
              >
                H3-1 downloaden (Nederlands)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, true)}
              >
                H3-1 downloaden (Fries)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, false)}
              >
                H4 downloaden (Nederlands)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, true)}
              >
                H4 downloaden (Fries)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, false)}
              >
                H9 downloaden (Nederlands)
              </button>
              <button
                class="button secondary icon-print"
                type="button"
                onclick={() => download(candidateList, true)}
              >
                H9 downloaden (Fries)
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <Potty
    bind:this={potty}
    introText="Op deze pagina kun je de modellen met alle lijstgegevens exporteren. Lever deze op tijd in voor de dag van kandidaatstelling!"
  ></Potty>
</section>
