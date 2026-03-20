<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { markOverlayFamily, shouldAnimateOverlay } from '$lib/overlay-animation';
	import CandidateEditSteps from '$lib/components/CandidateEditSteps.svelte';
	import type { CandidateList, Person } from '$lib/types';

	let {
		candidateList,
		person,
		title,
		children
	}: {
		candidateList: CandidateList;
		person: Person;
		title: string;
		children: import('svelte').Snippet;
	} = $props();

	const routeId = $derived(page.route.id);
	const routeParams = $derived({ id: page.params.id, personId: page.params.personId });
	const animate = $derived(shouldAnimateOverlay(routeId, routeParams));

	$effect(() => {
		markOverlayFamily(routeId, routeParams);
	});
</script>

<div class="overlay-backdrop spa-overlay-backdrop">
	<div class={`overlay spa-overlay ${animate ? 'animation' : ''}`}>
		<header>
			<h2>{title}</h2>
			<a
				href={resolve('/candidate-lists/[id]', { id: candidateList.id })}
				class="close-overlay"
				aria-label="Sluiten"
			>
				<span>Sluiten</span>
			</a>
		</header>
		<div class="overlay-content steps">
			<CandidateEditSteps {candidateList} {person} />
			<div class="form">
				{@render children()}
			</div>
		</div>
	</div>
</div>
