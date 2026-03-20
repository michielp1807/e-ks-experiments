<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatName } from '$lib/helpers';
	import type { AppData } from '$lib/types';

	let { appData }: { appData: AppData } = $props();
</script>

<div class="stack-lg">
	<div>
		<h2>Gegevens gemachtigden</h2>
		<p class="info">
			Bij het centraal stembureau is een gemachtigde of plaatsvervangend gemachtigde voor de aanduiding geregistreerd.
			Deze persoon geeft de lijstinleveraar toestemming om de naam van de partij boven de kandidatenlijst te plaatsen.
			Dit gebeurt met formulier H 3-1 of H 3-2.
		</p>
	</div>

	{#if appData.authorisedAgents.length === 0}
		<p class="mt-md font-italic">Nog geen gemachtigden toegevoegd.</p>
	{:else}
		<div class="stack-md">
			{#each appData.authorisedAgents as agent}
				<a href={resolve('/political-group/authorised-agents/[id]', { id: agent.id })} class="person-block">
					{formatName(agent.name)}
				</a>
			{/each}
		</div>
	{/if}

	{#if appData.authorisedAgents.length === 0}
		<p class="mt-lg">
			<a href={resolve('/political-group/authorised-agents/new')} class="button secondary icon-plus">
				Gemachtigde toevoegen
			</a>
		</p>
	{/if}

	<p class="mt-lg">
		<a class="button" href={resolve('/political-group/list-submitters')}>Volgende</a>
	</p>
</div>
