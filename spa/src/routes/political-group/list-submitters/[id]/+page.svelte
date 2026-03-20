<script lang="ts">
	import { page } from '$app/state';
	import ListSubmitterForm from '$lib/components/ListSubmitterForm.svelte';
	import SimpleOverlay from '$lib/components/SimpleOverlay.svelte';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
	const submitter = $derived.by(() => appData.listSubmitters.find((entry) => entry.id === page.params.id));
</script>

{#if submitter}
	<SimpleOverlay title="Gegevens lijstinleveraar aanpassen" closeHref="/political-group/list-submitters">
		<ListSubmitterForm {submitter} submitLabel="Opslaan" />
	</SimpleOverlay>
{:else}
	<p>Lijstinleveraar niet gevonden.</p>
{/if}
