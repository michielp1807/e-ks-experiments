<script lang="ts">
	import ListSubmitterForm from '$lib/components/ListSubmitterForm.svelte';
	import SimpleOverlay from '$lib/components/SimpleOverlay.svelte';
</script>

<SimpleOverlay title="Vervanger voor het herstel van verzuimen" closeHref="/political-group/list-submitters">
	<ListSubmitterForm substitute={true} submitLabel="Opslaan" />
</SimpleOverlay>
