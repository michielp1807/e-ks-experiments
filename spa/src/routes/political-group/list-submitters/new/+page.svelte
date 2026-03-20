<script lang="ts">
	import ListSubmitterForm from '$lib/components/ListSubmitterForm.svelte';
	import SimpleOverlay from '$lib/components/SimpleOverlay.svelte';
</script>

<SimpleOverlay title="Lijstinleveraar toevoegen" closeHref="/political-group/list-submitters">
	<ListSubmitterForm submitLabel="Opslaan" />
</SimpleOverlay>
