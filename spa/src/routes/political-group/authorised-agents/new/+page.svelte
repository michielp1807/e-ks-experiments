<script lang="ts">
	import AuthorisedAgentForm from '$lib/components/AuthorisedAgentForm.svelte';
	import SimpleOverlay from '$lib/components/SimpleOverlay.svelte';
</script>

<SimpleOverlay title="Gemachtigde toevoegen" closeHref="/political-group/authorised-agents">
	<AuthorisedAgentForm title="Gemachtigde toevoegen" submitLabel="Opslaan" />
</SimpleOverlay>
