<script lang="ts">
	import DistrictsList from '$lib/components/DistrictsList.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { appState } from '$lib/state/app';
	import { candidateListCanSubmit, duplicateDistricts } from '$lib/helpers';
	import { maxCandidates } from '$lib/election';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const state = $derived(app.current);
</script>

<PageHeader title="Inleveren" backHref="/" />

<section>
	<div class="cards cards-candidate-lists cards-submit">
		<div class="cards-right">
			{#if state.candidateLists.length === 0}
				<p>Er zijn nog geen kandidatenlijsten.</p>
			{:else}
				{#each state.candidateLists as candidateList}
					<div
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
						<div class="card-actions">
							<button class="button secondary icon-print disabled" type="button" disabled>
								Model H1
							</button>
							<button class="button secondary icon-print disabled" type="button" disabled>
								Model H3-1
							</button>
							<button class="button secondary icon-print disabled" type="button" disabled>
								Model H4
							</button>
							<button class="button secondary icon-print disabled" type="button" disabled>
								Model H9
							</button>
						</div>
						<p class="instruction">
							{#if candidateListCanSubmit(state, candidateList)}
								Deze lijst is inhoudelijk compleet, maar PDF-generatie is nog niet aangesloten.
							{:else}
								Deze lijst mist nog gegevens voordat documenten gegenereerd kunnen worden.
							{/if}
						</p>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>
