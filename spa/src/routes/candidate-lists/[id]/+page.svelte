<script lang="ts">
import { resolve } from "$app/paths";
import { onMount } from "svelte";
import { page } from "$app/state";
import CandidateListCandidatesTable from "$lib/components/CandidateListCandidatesTable.svelte";
import PageHeader from "$lib/components/PageHeader.svelte";
import { appState } from "$lib/state/app";
import { fromStore } from "svelte/store";
import Potty from "$lib/components/Potty.svelte";
import { districtTitle } from "$lib/election";
import { districtSummary } from "$lib/helpers";

const app = fromStore(appState);
const appData = $derived(app.current);
const candidateList = $derived.by(() =>
  appData.candidateLists.find((entry) => entry.id === page.params.id),
);
let stickyNav = $state<HTMLElement | null>(null);

function reorderCandidates(order: string[]) {
  if (!candidateList) return;
  appState.upsertCandidateList({ ...candidateList, candidateIds: order });
}

// svelte-ignore non_reactive_update
let potty: Potty;
// svelte-ignore non_reactive_update
let table: CandidateListCandidatesTable;

async function shuffle() {
  table.shuffle();
  await potty.speak("");

  potty.speak("Zo beter? Of zullen we het nog eens proberen?", {
    text: "Nog een keer!",
    fn: shuffle,
  });
}

onMount(() => {
  if (!stickyNav) {
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      entry.target.classList.toggle("is-stuck", entry.intersectionRatio < 1);
    },
    { threshold: [1] },
  );

  observer.observe(stickyNav);

  return () => {
    observer.disconnect();
  };
});
</script>

{#if candidateList}
  <PageHeader
    title="Kandidatenlijst"
    districts={candidateList.electoralDistricts}
    backHref="/candidate-lists"
    backLabel="Terug naar lijstoverzicht"
  />
  <nav class="sticky-nav" bind:this={stickyNav}>
    <div class="sticky-nav-bar">
      <div>
        <p>Wijzig lijstgegevens:</p>
        <a
          href={resolve("/candidate-lists/[id]/details", {
            id: candidateList.id,
          })}
          class="button secondary icon-edit">Bewerk</a
        >
      </div>
      <div>
        <p>Voeg kandidaten toe:</p>
        <div class="buttons">
          <a
            href={resolve("/candidate-lists/[id]/candidates/add", {
              id: candidateList.id,
            })}
            class="button secondary icon-plus">Kies bestaande kandidaat</a
          >
          <a
            href={resolve("/candidate-lists/[id]/candidates/new", {
              id: candidateList.id,
            })}
            class="button secondary icon-plus">Nieuwe kandidaat</a
          >
        </div>
      </div>
    </div>
  </nav>

  <section>
    <CandidateListCandidatesTable
      bind:this={table}
      {appData}
      {candidateList}
      onReorder={reorderCandidates}
    />
    <Potty
      bind:this={potty}
      introText={`Dit is de kandidatenlijst voor ${districtSummary(
        candidateList.electoralDistricts,
        "nl",
      )}.\nZal ik de lijst voor je door elkaar husselen?`}
      introAction={{
        text: "Ja, graag!",
        fn: shuffle,
      }}
    ></Potty>
  </section>
{:else}
  <PageHeader
    title="Kandidatenlijst niet gevonden"
    backHref="/candidate-lists"
  />
  <p>Deze kandidatenlijst bestaat niet meer.</p>
{/if}
