<script lang="ts">
	import GeneralInfoSteps from '$lib/components/GeneralInfoSteps.svelte';
	import ListSubmittersManager from '$lib/components/ListSubmittersManager.svelte';
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
		<ListSubmittersManager {appData} />
	</div>
</div>
