<script lang="ts">
	import { page } from '$app/state';
	import CandidateListEditOverlay from '$lib/components/CandidateListEditOverlay.svelte';
	import CandidateListDetailForm from '$lib/components/CandidateListDetailForm.svelte';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
	const candidateList = $derived.by(() => appData.candidateLists.find((entry) => entry.id === page.params.id));
</script>

{#if candidateList}
	<CandidateListEditOverlay {appData} {candidateList} title="Kandidatenlijst bewerken">
		<CandidateListDetailForm {appData} {candidateList} />
	</CandidateListEditOverlay>
{:else}
	<p>Kandidatenlijst niet gevonden.</p>
{/if}
