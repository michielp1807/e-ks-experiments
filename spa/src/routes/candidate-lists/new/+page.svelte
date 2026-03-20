<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { emptyCandidateList } from '$lib/helpers';
	import { appState } from '$lib/state/app';
	let candidateList = $state(emptyCandidateList());
</script>

<PageHeader title="Nieuwe kandidatenlijst" backHref="/candidate-lists" />
<section class="candidate-list-create">
	<div class="card plain-card">
		<h2>Nieuwe kandidatenlijst</h2>
		<p>Kies eerst de kandidatenlijst. Daarna kun je kieskringen, lijstindieners en kandidaten invullen.</p>
		<div class="buttons">
			<button
				class="button icon-plus"
				type="button"
				onclick={() => {
					appState.upsertCandidateList(candidateList);
					goto(resolve('/candidate-lists/[id]/details', { id: candidateList.id }));
				}}
			>
				Kandidatenlijst aanmaken
			</button>
			<a class="button secondary" href={resolve('/candidate-lists')}>Annuleren</a>
		</div>
	</div>
</section>
