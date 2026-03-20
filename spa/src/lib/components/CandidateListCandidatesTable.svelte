<script lang="ts">
	import { resolve } from '$app/paths';
	import { sortableTable } from '$lib/actions/sortable';
	import { formatLastName, personLivesInNl, isPersonComplete } from '$lib/helpers';
	import { maxCandidates } from '$lib/election';
	import type { AppData, CandidateList } from '$lib/types';

	let {
		appData,
		candidateList,
		onReorder
	}: {
		appData: AppData;
		candidateList: CandidateList;
		onReorder?: (order: string[]) => void;
	} = $props();

	const candidates = $derived(
		candidateList.candidateIds
			.map((id) => appData.persons.find((person) => person.id === id))
			.filter(Boolean) as AppData['persons']
	);
</script>

{#if candidates.length === 0}
	<p>Er zijn nog geen kandidaten op deze lijst geplaatst.</p>
{:else}
	<table id="candidate-table" data-max={maxCandidates(appData.politicalGroup.longListAllowed)}>
		<thead>
			<tr>
				<th scope="col" colspan="2">Positie</th>
				<th scope="col">Naam</th>
				<th scope="col">Woonplaats</th>
				<th scope="col">{candidates.length}/{maxCandidates(appData.politicalGroup.longListAllowed)} kandidaten</th>
			</tr>
		</thead>
		<tbody use:sortableTable={{ onChange: onReorder }}>
			{#each candidates as person, index (person.id)}
				<tr
					class:warning={!isPersonComplete(person)}
					class="clickable"
					data-id={person.id}
					onclick={(event) => {
						const target = event.target as HTMLElement | null;
						if (target?.closest('.drag-handle')) {
							return;
						}

						const link = event.currentTarget?.querySelector('a');
						if (link instanceof HTMLAnchorElement && !target?.closest('a, button, input, label')) {
							link.click();
						}
					}}
				>
					<td class="drag-handle"></td>
					<td><span class="position-badge">{index + 1}</span></td>
					<td>
						<strong>{formatLastName(person.name)},</strong>
						{person.name.initials}{person.name.firstName ? ` (${person.name.firstName})` : ''}
						{person.personalData.gender === 'male' ? ' (m)' : person.personalData.gender === 'female' ? ' (v)' : ''}
					</td>
					<td>
						{person.personalData.placeOfResidence}
						{#if person.personalData.country && !personLivesInNl(person)}
							({person.personalData.country})
						{/if}
					</td>
					<td>
						<a href={resolve('/candidate-lists/[id]/candidates/[personId]', { id: candidateList.id, personId: person.id })} aria-label="Bewerk kandidaat">
							<span>Bewerk</span>
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

{#if candidates.length > maxCandidates(appData.politicalGroup.longListAllowed)}
	<p class="note-warning mt-md">
		Het maximum aantal kandidaten voor deze lijst is overschreden.
	</p>
{/if}
