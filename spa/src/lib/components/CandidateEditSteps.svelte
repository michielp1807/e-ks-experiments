<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { isPersonComplete, isNameComplete, isDutchAddressComplete, isInternationalAddressComplete, personLivesInNl } from '$lib/helpers';
	import type { CandidateList, Person } from '$lib/types';

	let {
		candidateList,
		person
	}: {
		candidateList: CandidateList;
		person: Person;
	} = $props();

	const pathname = $derived(page.url.pathname);
	const fromNl = $derived(personLivesInNl(person));
	const personalComplete = $derived(
		Boolean(
			isNameComplete(person.name) &&
				person.personalData.dateOfBirth.trim() &&
				person.personalData.bsn.trim() &&
				person.personalData.placeOfResidence.trim() &&
				person.personalData.country.trim()
		)
	);
</script>

<div class="steps-nav">
	<ul>
		<li>
			<a
				href={resolve('/candidate-lists/[id]/candidates/[personId]', { id: candidateList.id, personId: person.id })}
				class:ok={candidateList.candidateIds.includes(person.id)}
				class:active={pathname.endsWith(`/${person.id}`)}
			>
				Positie op lijst
			</a>
		</li>
		<li>
			<a
				href={resolve('/candidate-lists/[id]/candidates/[personId]/details', { id: candidateList.id, personId: person.id })}
				class:ok={personalComplete}
				class:warning={!personalComplete}
				class:active={pathname.endsWith('/details')}
			>
				Persoonlijke gegevens
			</a>
		</li>
		{#if fromNl}
			<li>
				<a
					href={resolve('/candidate-lists/[id]/candidates/[personId]/address', { id: candidateList.id, personId: person.id })}
					class:ok={isDutchAddressComplete(person.address)}
					class:warning={!isDutchAddressComplete(person.address)}
					class:active={pathname.endsWith('/address')}
				>
					Correspondentieadres
				</a>
			</li>
		{:else}
			<li>
				<a
					href={resolve('/candidate-lists/[id]/candidates/[personId]/representative', { id: candidateList.id, personId: person.id })}
					class:ok={isNameComplete(person.representative.name) && isInternationalAddressComplete(person.representative.address)}
					class:warning={!(isNameComplete(person.representative.name) && isInternationalAddressComplete(person.representative.address))}
					class:active={pathname.endsWith('/representative')}
				>
					Gemachtigde
				</a>
			</li>
		{/if}
	</ul>
</div>
