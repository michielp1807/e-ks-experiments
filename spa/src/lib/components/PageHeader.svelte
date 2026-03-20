<script lang="ts">
	import { emptyPageHeader, pageHeader } from '$lib/state/page-header';
	import type { DistrictCode } from '$lib/types';

	let {
		title,
		subtitle = '',
		districts = [],
		backHref = '',
		backLabel = 'Terug'
	}: {
		title: string;
		subtitle?: string;
		districts?: DistrictCode[];
		backHref?: '' | '/' | '/candidate-lists' | '/candidates';
		backLabel?: string;
	} = $props();

	$effect(() => {
		pageHeader.set({ title, subtitle, districts, backHref, backLabel });

		return () => {
			pageHeader.set(emptyPageHeader);
		};
	});
</script>
