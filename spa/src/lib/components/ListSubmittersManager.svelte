<script lang="ts">
	import { resolve } from '$app/paths';
	import { addressLine1, addressLine2, formatName, isInternationalAddressComplete, isNameComplete } from '$lib/helpers';
	import type { AppData, ListSubmitter } from '$lib/types';

	let { appData }: { appData: AppData } = $props();

	function isComplete(submitter: ListSubmitter) {
		return isNameComplete(submitter.name) && isInternationalAddressComplete(submitter.address);
	}
</script>

<div class="stack-lg">
	<section class="stack-md">
		<h2>Gegevens lijstinleveraar</h2>
		<p class="info">De lijstinleveraar is de enige persoon die bevoegd is om de kandidatenlijst in te leveren en om verzuimen te herstellen.</p>
		{#if appData.listSubmitters.length === 0}
			<p>Geen lijstinleveraars</p>
		{:else}
			<div class="list-submitters">
				{#each appData.listSubmitters as submitter}
					<a
						href={resolve('/political-group/list-submitters/[id]', { id: submitter.id })}
						class={`person-block ${isComplete(submitter) ? '' : 'warning'}`}
					>
						{formatName(submitter.name)}
						<br />
						{addressLine1(submitter.address)}
						<br />
						{addressLine2(submitter.address)}
					</a>
				{/each}
			</div>
		{/if}

		<p class="mt-lg">
			<a href={resolve('/political-group/list-submitters/new')} class="button secondary icon-plus">Lijstinleveraar toevoegen</a>
		</p>
	</section>

	<div class="alert alert-info">Wanneer u meerdere lijsten aanmaakt, kunt u per lijst een andere lijstinleveraar selecteren. Dit doet u bij de specifieke lijst.</div>

	<section class="stack-md">
		<h2 class="mt-lg">Vervangers voor het herstel van verzuimen</h2>
		<p class="info">Het centraal stembureau controleert de stukken die worden overhandigd op de dag van kandidaatstelling. Mochten hierbij verzuimen worden vastgesteld, dan ontvangt u hierover schriftelijk bericht. In het bericht dat u van het centraal stembureau ontvangt staat ook tot wanneer verzuimen kunnen worden hersteld.</p>
		{#if appData.substituteListSubmitters.length === 0}
			<p>Geen vervangers voor het herstel van verzuimen</p>
		{:else}
			<div class="substitute-list-submitters">
				{#each appData.substituteListSubmitters as submitter}
					<a
						href={resolve('/political-group/list-submitters/substitutes/[id]', { id: submitter.id })}
						class={`person-block ${isComplete(submitter) ? '' : 'warning'}`}
					>
						{formatName(submitter.name)}
						<br />
						{addressLine1(submitter.address)}
						<br />
						{addressLine2(submitter.address)}
					</a>
				{/each}
			</div>
		{/if}

		<p class="mt-lg">
			<a href={resolve('/political-group/list-submitters/substitutes/new')} class="button secondary icon-plus">Vervanger voor het herstel van verzuimen</a>
		</p>

		<p class="mt-lg">
			<a class="button" href={resolve('/')}>Naar home</a>
		</p>
	</section>
</div>
