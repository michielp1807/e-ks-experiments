<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import NameFields from '$lib/components/NameFields.svelte';
	import { appState } from '$lib/state/app';
	import { createId, emptyName } from '$lib/helpers';
	import type { AuthorisedAgent } from '$lib/types';

	let {
		agent = null,
		title,
		submitLabel = 'Opslaan'
	}: {
		agent?: AuthorisedAgent | null;
		title: string;
		submitLabel?: string;
	} = $props();

	let draft = $state<AuthorisedAgent>({ id: '', name: emptyName() });

	$effect(() => {
		draft = agent ? structuredClone(agent) : { id: '', name: emptyName() };
	});

	function save() {
		if (!draft.name.initials.trim() || !draft.name.lastName.trim()) {
			return;
		}

		appState.upsertAuthorisedAgent({ ...draft, id: draft.id || createId() });
		goto(resolve('/political-group/authorised-agents'));
	}
</script>

<form
	class="form"
	onsubmit={(event) => {
		event.preventDefault();
		save();
	}}
>
	<fieldset>
		<NameFields name={draft.name} />
	</fieldset>

	{#if agent}
		<button
			class="button tertiary-destructive icon-trash mb-lg"
			type="button"
			onclick={() => {
				appState.deleteAuthorisedAgent(agent.id);
				goto(resolve('/political-group/authorised-agents'));
			}}
		>
			Gemachtigde verwijderen
		</button>
	{/if}

	<div class="form-actions">
		<button type="submit" class="button lg">{submitLabel}</button>
	</div>
</form>
