<script lang="ts">
import { page } from "$app/state";
import CandidateListEditOverlay from "$lib/components/CandidateListEditOverlay.svelte";
import CandidateListSubmittersForm from "$lib/components/CandidateListSubmittersForm.svelte";
import { appState } from "$lib/state/app";
import { fromStore } from "svelte/store";

const app = fromStore(appState);
const appData = $derived(app.current);
const candidateList = $derived.by(() =>
  appData.candidateLists.find((entry) => entry.id === page.params.id),
);
</script>

{#if candidateList}
  <CandidateListEditOverlay {appData} {candidateList} title="Lijstinleveraar">
    <CandidateListSubmittersForm {appData} {candidateList} />
  </CandidateListEditOverlay>
{:else}
  <p>Kandidatenlijst niet gevonden.</p>
{/if}
