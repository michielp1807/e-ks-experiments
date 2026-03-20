<script lang="ts">
	import { resolve } from '$app/paths';
	import DistrictsList from '$lib/components/DistrictsList.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { appState } from '$lib/state/app';
	import { candidateListCanSubmit, duplicateDistricts, isPersonComplete } from '$lib/helpers';
	import { maxCandidates } from '$lib/election';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const state = $derived(app.current);
</script>

<PageHeader title="Kandidatenlijsten" backHref="/" />

<section>
	<div class="cards cards-candidate-lists">
		<a href={resolve('/candidates')} class="card card-persons">
			<div class="badge"></div>
			<h3>Alle kandidaten</h3>
			<p class="statistic">{state.persons.length} kandidaat{state.persons.length === 1 ? '' : 'en'}</p>
			<p class="instruction">
				{state.persons.filter((person) => !isPersonComplete(person)).length} kandidaat(en) zijn nog onvolledig.
			</p>
			<p>Beheer kandidaten</p>
		</a>

		<div class="cards-right">
			{#each state.candidateLists as candidateList}
				<a
					href={resolve('/candidate-lists/[id]', { id: candidateList.id })}
					class={`card ${duplicateDistricts(state, candidateList.id).length > 0 ? 'card-list-warning' : 'card-candidate-list'}`}
				>
					<div class="badge"></div>
					<h3>Kandidatenlijst</h3>
					<p class="statistic">
						{candidateList.candidateIds.length}/{maxCandidates(state.politicalGroup.longListAllowed)} kandidaten
					</p>
					<h5>Kieskringen:</h5>
					<DistrictsList
						districts={candidateList.electoralDistricts}
						locale={state.locale}
						warnings={duplicateDistricts(state, candidateList.id)}
					/>
					<p>{candidateListCanSubmit(state, candidateList) ? 'Klaar voor vervolgstap' : 'Nog niet compleet'}</p>
				</a>
			{/each}

			<div class="card card-add-list">
				<a href={resolve('/candidate-lists/new')} class="button secondary icon-plus">Lijst toevoegen</a>
			</div>
		</div>
	</div>
</section>
