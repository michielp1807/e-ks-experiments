<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { formatLastName, personLivesInNl } from '$lib/helpers';
	import { appState } from '$lib/state/app';
	import type { AppData, CandidateList, Person } from '$lib/types';

	let {
		appData,
		candidateList,
		person
	}: {
		appData: AppData;
		candidateList: CandidateList;
		person: Person;
	} = $props();

	const candidates = $derived(
		candidateList.candidateIds
			.map((id) => appData.persons.find((entry) => entry.id === id))
			.filter(Boolean) as Person[]
	);

	const currentPosition = $derived(
		Math.max(
			1,
			candidateList.candidateIds.findIndex((id) => id === person.id) + 1
		)
	);

	let position = $state(1);

	$effect(() => {
		position = currentPosition;
	});

	function savePosition() {
		const currentIndex = candidateList.candidateIds.findIndex((id) => id === person.id);
		if (currentIndex === -1) return;

		const updated = [...candidateList.candidateIds];
		const [moved] = updated.splice(currentIndex, 1);
		const targetIndex = Math.min(Math.max(position, 1), updated.length + 1) - 1;
		updated.splice(targetIndex, 0, moved);

		appState.upsertCandidateList({ ...candidateList, candidateIds: updated });
		goto(resolve('/candidate-lists/[id]/candidates/[personId]/details', { id: candidateList.id, personId: person.id }));
	}

	function removeCandidate() {
		appState.upsertCandidateList({
			...candidateList,
			candidateIds: candidateList.candidateIds.filter((id) => id !== person.id)
		});
		goto(resolve('/candidate-lists/[id]', { id: candidateList.id }));
	}
</script>

<form
	class="form stack-lg"
	onsubmit={(event) => {
		event.preventDefault();
		savePosition();
	}}
>
	<fieldset>
		<legend><h3>Positie op lijst</h3></legend>
		<p class="candidate-edit-title">
			<span class="position-badge">{currentPosition}</span>
			{formatLastName(person.name)}, {person.name.initials}{person.name.firstName ? ` (${person.name.firstName})` : ''}
		</p>
		<p class="form-field form-field-sm">
			<label for="position">Positie</label>
			<input bind:value={position} type="number" id="position" min="1" max={candidateList.candidateIds.length} required />
		</p>
	</fieldset>

	<div id="position-preview-container">
		<table class="table" id="position-preview">
			<thead>
				<tr>
					<th>Positie</th>
					<th>Naam</th>
					<th>Woonplaats</th>
				</tr>
			</thead>
			<tbody>
				{#each candidates as candidatePerson, index}
					<tr class:current={candidatePerson.id === person.id}>
						<td>
							<span class="position-badge">{index + 1}</span>
						</td>
						<td>
							<strong>{formatLastName(candidatePerson.name)},</strong>
							{candidatePerson.name.initials}
							{#if candidatePerson.name.firstName}
								({candidatePerson.name.firstName})
							{/if}
						</td>
						<td>
							{candidatePerson.personalData.placeOfResidence}
							{#if candidatePerson.personalData.country && !personLivesInNl(candidatePerson)}
								({candidatePerson.personalData.country})
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="buttons">
		<button class="button" type="submit">Volgende</button>
		<button class="button tertiary-destructive icon-trash" type="button" onclick={removeCandidate}>
			Verwijder kandidaat van lijst
		</button>
	</div>
</form>
