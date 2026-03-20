<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DistrictsList from '$lib/components/DistrictsList.svelte';
	import { availableDistricts, duplicateDistricts } from '$lib/helpers';
	import { DISTRICTS } from '$lib/election';
	import { appState } from '$lib/state/app';
	import type { AppData, CandidateList, DistrictCode } from '$lib/types';

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

	const currentAvailableDistricts = $derived(availableDistricts(appData, draft.id));
	const duplicateCodes = $derived(duplicateDistricts({ ...appData, candidateLists: [draft, ...appData.candidateLists.filter((entry) => entry.id !== draft.id)] }, draft.id));

	function toggleDistrict(code: DistrictCode) {
		if (draft.electoralDistricts.includes(code)) {
			draft.electoralDistricts = draft.electoralDistricts.filter((entry) => entry !== code);
			return;
		}

		draft.electoralDistricts = [...draft.electoralDistricts, code];
	}
</script>

<form
	class="form candidate-list-detail-panel"
	onsubmit={(event) => {
		event.preventDefault();
		appState.upsertCandidateList(draft);
		goto(resolve('/candidate-lists/[id]/submitters', { id: draft.id }));
	}}
>
	<fieldset>
		<legend><h2>Kieskringen</h2></legend>
		<div class="checkbox select-all-checkbox mt-sm mb-lg">
			<input
				type="checkbox"
				checked={draft.electoralDistricts.length === DISTRICTS.length}
				onchange={() => {
					draft.electoralDistricts =
						draft.electoralDistricts.length === DISTRICTS.length ? [] : DISTRICTS.map((district) => district.code);
				}}
				id="select-all-districts"
			/>
			<label for="select-all-districts">Selecteer alle kieskringen</label>
		</div>
		<div class="checklist grid" id="district_list">
			{#each DISTRICTS as district}
				<div
					class={`checkbox ${currentAvailableDistricts.some((entry) => entry.code === district.code) || draft.electoralDistricts.includes(district.code) ? '' : 'disabled'}`}
				>
					<input
						type="checkbox"
						checked={draft.electoralDistricts.includes(district.code)}
						disabled={!currentAvailableDistricts.some((entry) => entry.code === district.code) && !draft.electoralDistricts.includes(district.code)}
						id={`district-${district.code}`}
						onchange={() => toggleDistrict(district.code)}
					/>
					<label for={`district-${district.code}`}>{district.title[appData.locale]}</label>
				</div>
			{/each}
		</div>
		{#if draft.electoralDistricts.length > 0}
			<div class="mt-md">
				<DistrictsList districts={draft.electoralDistricts} locale={appData.locale} warnings={duplicateCodes} />
			</div>
		{/if}
		{#if duplicateCodes.length > 0}
			<p class="note-warning mt-md">Een of meer kieskringen zijn ook al op een andere lijst gebruikt.</p>
		{/if}
	</fieldset>

	<div class="buttons">
		<button class="button" type="submit">Volgende</button>
		<button class="button tertiary-destructive icon-trash" type="button" onclick={() => appState.deleteCandidateList(draft.id)}>
			Verwijder lijst
		</button>
	</div>
</form>
