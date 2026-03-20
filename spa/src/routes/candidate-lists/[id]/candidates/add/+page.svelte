<script lang="ts">
	import { page } from '$app/state';
	import CandidateListAddExistingForm from '$lib/components/CandidateListAddExistingForm.svelte';
	import CandidateListAddOverlay from '$lib/components/CandidateListAddOverlay.svelte';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
	const candidateList = $derived.by(() => appData.candidateLists.find((entry) => entry.id === page.params.id));
</script>

{#if candidateList}
	<CandidateListAddOverlay {candidateList} title="Kandidaat toevoegen">
		<CandidateListAddExistingForm {appData} {candidateList} />
	</CandidateListAddOverlay>
{:else}
	<p>Kandidatenlijst niet gevonden.</p>
{/if}
