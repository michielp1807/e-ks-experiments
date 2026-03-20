<script lang="ts">
	import { page } from '$app/state';
	import AuthorisedAgentForm from '$lib/components/AuthorisedAgentForm.svelte';
	import SimpleOverlay from '$lib/components/SimpleOverlay.svelte';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
	const agent = $derived.by(() => appData.authorisedAgents.find((entry) => entry.id === page.params.id));
</script>

{#if agent}
	<SimpleOverlay title="Gegevens gemachtigde aanpassen" closeHref="/political-group/authorised-agents">
		<AuthorisedAgentForm {agent} title="Gegevens gemachtigde aanpassen" submitLabel="Opslaan" />
	</SimpleOverlay>
{:else}
	<p>Gemachtigde niet gevonden.</p>
{/if}
