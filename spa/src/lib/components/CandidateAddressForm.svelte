<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AddressFields from '$lib/components/AddressFields.svelte';
	import { appState } from '$lib/state/app';
	import type { CandidateList, Person } from '$lib/types';

	let {
		candidateList,
		person
	}: {
		candidateList: CandidateList;
		person: Person;
	} = $props();

	let draft = $state<Person>({
		id: '',
		name: { initials: '', firstName: '', lastNamePrefix: '', lastName: '' },
		personalData: {
			gender: '',
			bsn: '',
			dateOfBirth: '',
			placeOfResidence: '',
			country: ''
		},
		address: {
			postalCode: '',
			houseNumber: '',
			houseNumberAddition: '',
			streetName: '',
			locality: ''
		},
		representative: {
			name: { initials: '', firstName: '', lastNamePrefix: '', lastName: '' },
			address: {
				postalCode: '',
				houseNumber: '',
				houseNumberAddition: '',
				streetName: '',
				locality: '',
				stateOrProvince: '',
				country: 'NL'
			}
		},
		updatedAt: ''
	});
	let ready = $state(false);

	function copyPerson(value: Person): Person {
		return {
			...value,
			name: { ...value.name },
			personalData: { ...value.personalData },
			address: { ...value.address },
			representative: {
				name: { ...value.representative.name },
				address: { ...value.representative.address }
			}
		};
	}

	$effect(() => {
		draft = copyPerson(person);
		ready = true;
	});
</script>

{#if ready}
	<form
		class="form"
		onsubmit={(event) => {
			event.preventDefault();
			appState.upsertPerson(draft);
			goto(resolve('/candidate-lists/[id]', { id: candidateList.id }));
		}}
	>
		<fieldset>
			<legend><h3>Correspondentieadres</h3></legend>
			<AddressFields address={draft.address} />
			<div class="buttons">
				<button class="button" type="submit">Opslaan</button>
			</div>
		</fieldset>
	</form>
{/if}
