<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PersonForm from '$lib/components/PersonForm.svelte';
	import { emptyPerson } from '$lib/helpers';

	let person = $state(emptyPerson());
</script>

<PageHeader title="Nieuwe kandidaat" backHref="/candidates" />
<PersonForm {person} submitLabel="Opslaan en terug" onSubmit={() => goto(resolve('/candidates'))} />
