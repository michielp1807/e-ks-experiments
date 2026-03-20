<script lang="ts">
	import { districtTitle } from '$lib/election';
	import type { DistrictCode, Locale } from '$lib/types';

	let {
		districts,
		locale,
		warnings = [],
		emptyLabel = 'Nog niet gekozen'
	}: {
		districts: DistrictCode[];
		locale: Locale;
		warnings?: DistrictCode[];
		emptyLabel?: string;
	} = $props();
</script>

{#if districts.length === 0}
	<p>{emptyLabel}</p>
{:else}
	<ul class="districts">
		{#each districts as district}
			<li class:warning={warnings.includes(district)}>
				<span>{districtTitle(district, locale)}</span>
			</li>
		{/each}
	</ul>
{/if}
