<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AddressFields from '$lib/components/AddressFields.svelte';
	import NameFields from '$lib/components/NameFields.svelte';
	import { appState } from '$lib/state/app';
	import { createId, emptyListSubmitter } from '$lib/helpers';
	import type { ListSubmitter } from '$lib/types';

	let {
		submitter = null,
		substitute = false,
		submitLabel = 'Opslaan'
	}: {
		submitter?: ListSubmitter | null;
		substitute?: boolean;
		submitLabel?: string;
	} = $props();

	let draft = $state<ListSubmitter>(emptyListSubmitter());

	$effect(() => {
		draft = submitter ? structuredClone(submitter) : emptyListSubmitter();
	});

	function listPath(): '/political-group/list-submitters' {
		return '/political-group/list-submitters';
	}

	function save() {
		if (!draft.name.initials.trim() || !draft.name.lastName.trim()) {
			return;
		}

		appState.upsertListSubmitter({ ...draft, id: draft.id || createId() }, substitute);
		goto(resolve(listPath()));
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
		<AddressFields address={draft.address} international={true} />
	</fieldset>

	{#if submitter}
		<button
			class="button tertiary-destructive icon-trash mb-lg"
			type="button"
			onclick={() => {
				appState.deleteListSubmitter(submitter.id, substitute);
				goto(resolve(listPath()));
			}}
		>
			{substitute ? 'Vervanger voor het herstel van verzuimen verwijderen' : 'Lijstinleveraar verwijderen'}
		</button>
	{/if}

	<div class="form-actions">
		<button type="submit" class="button lg">{submitLabel}</button>
	</div>
</form>
