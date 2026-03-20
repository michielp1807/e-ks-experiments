<script lang="ts">
	import { page } from '$app/state';
	import CandidateEditOverlay from '$lib/components/CandidateEditOverlay.svelte';
	import CandidateRepresentativeForm from '$lib/components/CandidateRepresentativeForm.svelte';
	import { appState } from '$lib/state/app';
	import { formatName } from '$lib/helpers';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
	const candidateList = $derived.by(() => appData.candidateLists.find((entry) => entry.id === page.params.id));
	const person = $derived.by(() => appData.persons.find((entry) => entry.id === page.params.personId));
</script>

{#if candidateList && person}
	<CandidateEditOverlay {candidateList} {person} title={formatName(person.name)}>
		<CandidateRepresentativeForm {candidateList} {person} />
	</CandidateEditOverlay>
{:else}
	<p>Kandidaat niet gevonden.</p>
{/if}
