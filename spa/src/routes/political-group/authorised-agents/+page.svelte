<script lang="ts">
	import AuthorisedAgentsManager from '$lib/components/AuthorisedAgentsManager.svelte';
	import GeneralInfoSteps from '$lib/components/GeneralInfoSteps.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { appState } from '$lib/state/app';
	import { fromStore } from 'svelte/store';

	const app = fromStore(appState);
	const appData = $derived(app.current);
</script>

<PageHeader title="Basisgegevens" backHref="/" />
<div class="steps">
	<GeneralInfoSteps />
	<div>
		<AuthorisedAgentsManager {appData} />
	</div>
</div>
