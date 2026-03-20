<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import CandidateListAddOverlay from '$lib/components/CandidateListAddOverlay.svelte';
	import PersonForm from '$lib/components/PersonForm.svelte';
	import { emptyPerson } from '$lib/helpers';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
	const candidateList = $derived.by(() => appData.candidateLists.find((entry) => entry.id === page.params.id));

	let person = $state(emptyPerson());

	function handleSubmit() {
		if (!candidateList) {
			return;
		}

		appState.upsertCandidateList({
			...candidateList,
			candidateIds: [...candidateList.candidateIds, person.id]
		});
		goto(resolve('/candidate-lists/[id]/candidates/[personId]', { id: candidateList.id, personId: person.id }));
	}
</script>

{#if candidateList}
	<CandidateListAddOverlay {candidateList} title="Nieuwe kandidaat">
		<PersonForm {person} submitLabel="Opslaan en verder" onSubmit={handleSubmit} />
	</CandidateListAddOverlay>
{:else}
	<p>Kandidatenlijst niet gevonden.</p>
{/if}
