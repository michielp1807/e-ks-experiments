<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { addressLine1, addressLine2, formatName } from '$lib/helpers';
	import { appState } from '$lib/state/app';
	import type { AppData, CandidateList } from '$lib/types';

	let {
		appData,
		candidateList
	}: {
		appData: AppData;
		candidateList: CandidateList;
	} = $props();

	let draft = $state<CandidateList>({
		id: '',
		electoralDistricts: [],
		candidateIds: [],
		listSubmitterId: null,
		substituteListSubmitterIds: [],
		createdAt: ''
	});

	$effect(() => {
		draft = structuredClone(candidateList);
	});
</script>

<form
	class="form stack-lg candidate-list-detail-panel"
	onsubmit={(event) => {
		event.preventDefault();
		appState.upsertCandidateList(draft);
		goto(resolve('/candidate-lists/[id]', { id: draft.id }));
	}}
>
	<fieldset>
		<legend><h2>Lijstindiener</h2></legend>
		{#if appData.listSubmitters.length === 0}
			<p>Voeg eerst een lijstindiener toe bij algemene informatie.</p>
		{:else}
			<div class="checklist">
				{#each appData.listSubmitters as submitter}
					<label class="checkbox radio-card">
						<input
							type="radio"
							name="list_submitter_id"
							checked={draft.listSubmitterId === submitter.id}
							onchange={() => (draft.listSubmitterId = submitter.id)}
						/>
						<span>
							<strong>{formatName(submitter.name)}</strong><br />
							{addressLine1(submitter.address)}<br />
							{addressLine2(submitter.address)}
						</span>
					</label>
				{/each}
			</div>
		{/if}
	</fieldset>

	<fieldset>
		<legend><h2>Plaatsvervangende lijstindieners</h2></legend>
		{#if appData.substituteListSubmitters.length === 0}
			<p>Geen plaatsvervangende lijstindieners beschikbaar.</p>
		{:else}
			<div class="checklist">
				{#each appData.substituteListSubmitters as submitter}
					<label class="checkbox radio-card">
						<input
							type="checkbox"
							checked={draft.substituteListSubmitterIds.includes(submitter.id)}
							onchange={() => {
								if (draft.substituteListSubmitterIds.includes(submitter.id)) {
									draft.substituteListSubmitterIds = draft.substituteListSubmitterIds.filter((id) => id !== submitter.id);
								} else {
									draft.substituteListSubmitterIds = [...draft.substituteListSubmitterIds, submitter.id];
								}
							}}
						/>
						<span>
							<strong>{formatName(submitter.name)}</strong><br />
							{addressLine1(submitter.address)}<br />
							{addressLine2(submitter.address)}
						</span>
					</label>
				{/each}
			</div>
		{/if}
	</fieldset>

	<div class="buttons">
		<button class="button" type="submit">Opslaan</button>
		<a class="button secondary" href={resolve('/candidate-lists/[id]/details', { id: draft.id })}>Vorige</a>
	</div>
</form>
