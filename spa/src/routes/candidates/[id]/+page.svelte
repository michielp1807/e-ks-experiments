<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PersonForm from '$lib/components/PersonForm.svelte';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const state = $derived(app.current);
	const person = $derived.by(() => structuredClone(state.persons.find((entry) => entry.id === page.params.id)));
</script>

{#if person}
	<PageHeader title="Kandidaat bewerken" backHref="/candidates" />
	<PersonForm {person} submitLabel="Opslaan" onSubmit={() => goto(resolve('/candidates'))} />
	<div class="buttons mt-lg">
		<button class="button tertiary-destructive" type="button" onclick={() => {
			appState.deletePerson(person.id);
			goto(resolve('/candidates'));
		}}>
			Verwijder kandidaat
		</button>
	</div>
{:else}
	<PageHeader title="Kandidaat niet gevonden" backHref="/candidates" />
	<p>Deze kandidaat bestaat niet meer.</p>
{/if}
