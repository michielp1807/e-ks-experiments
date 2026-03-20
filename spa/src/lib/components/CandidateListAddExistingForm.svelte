<script lang="ts">
	import { appState } from '$lib/state/app';
	import { formatLastName, personLivesInNl } from '$lib/helpers';
	import type { AppData, CandidateList } from '$lib/types';

	let {
		appData,
		candidateList
	}: {
		appData: AppData;
		candidateList: CandidateList;
	} = $props();

	let search = $state('');
	let initialCandidateIds = $state<string[]>([]);
	let initialised = $state(false);

	$effect(() => {
		if (!initialised) {
			initialCandidateIds = [...candidateList.candidateIds];
			initialised = true;
		}
	});

	const persons = $derived(
		appData.persons.filter((person) => {
			if (initialCandidateIds.includes(person.id) && !candidateList.candidateIds.includes(person.id)) {
				return false;
			}

			if (initialCandidateIds.includes(person.id) && candidateList.candidateIds.includes(person.id)) {
				return false;
			}

			const haystack =
				`${formatLastName(person.name)} ${person.name.initials} ${person.name.firstName} ${person.personalData.placeOfResidence}`.toLowerCase();
			return haystack.includes(search.toLowerCase());
		})
	);

	function togglePerson(personId: string) {
		appState.upsertCandidateList({
			...candidateList,
			candidateIds: candidateList.candidateIds.includes(personId)
				? candidateList.candidateIds.filter((id) => id !== personId)
				: [...candidateList.candidateIds, personId]
		});
	}

	function addAllVisible() {
		const missingIds = persons
			.filter((person) => !candidateList.candidateIds.includes(person.id))
			.map((person) => person.id);

		if (missingIds.length === 0) {
			return;
		}

		appState.upsertCandidateList({
			...candidateList,
			candidateIds: [...candidateList.candidateIds, ...missingIds]
		});
	}
</script>

{#if appData.persons.length === 0}
	<p>Er zijn nog geen kandidaten.</p>
{:else}
	<div class="form-row">
		<p class="form-field form-field-full">
			<label for="search">Zoek bestaande kandidaat</label>
			<input
				bind:value={search}
				type="text"
				class="form-control"
				id="search"
				placeholder={appData.locale === 'en'
					? 'Search by name, initials or locality'
					: 'Zoek op naam, voorletters of woonplaats'}
			/>
		</p>
	</div>

	{#if persons.length > 0}
		<p class="mt-md add-candidate-actions">
			<button class="button secondary float-right icon-plus" type="button" onclick={addAllVisible}>
				Voeg alle kandidaten toe
			</button>
		</p>
	{/if}

	<table class="table mt-sm" id="add-candidate-table">
		<thead>
			<tr>
				<th scope="col"></th>
				<th scope="col">Naam</th>
				<th scope="col">Woonplaats</th>
				<th scope="col"></th>
			</tr>
		</thead>
		<tbody>
			{#each persons as person}
				<tr
					class={`clickable ${candidateList.candidateIds.includes(person.id) ? 'remove-candidate' : 'add-candidate'}`}
					onclick={(event) => {
						const target = event.target as HTMLElement | null;
						if (target?.closest('button')) {
							return;
						}

						const button = event.currentTarget?.querySelector('button');
						if (button instanceof HTMLButtonElement) {
							button.click();
						}
					}}
				>
					<td>
						{#if candidateList.candidateIds.includes(person.id)}
							<span class="position-badge">{candidateList.candidateIds.indexOf(person.id) + 1}</span>
						{:else}
							<span class="person-badge">&nbsp;</span>
						{/if}
					</td>
					<td>
						<strong>{formatLastName(person.name)},</strong>
						{person.name.initials}
						{person.name.firstName ? ` (${person.name.firstName})` : ''}
					</td>
					<td>
						{person.personalData.placeOfResidence}
						{#if person.personalData.country && !personLivesInNl(person)}
							({person.personalData.country})
						{/if}
					</td>
					<td>
						<button type="button" onclick={() => togglePerson(person.id)}>
							<span>{candidateList.candidateIds.includes(person.id) ? 'Verwijder' : 'Toevoegen'}</span>
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
