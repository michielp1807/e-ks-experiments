<script lang="ts">
	import { resolve } from '$app/paths';
	let {
		title,
		closeHref,
		children
	}: {
		title: string;
		closeHref: '/political-group/authorised-agents' | '/political-group/list-submitters';
		children: import('svelte').Snippet;
	} = $props();
</script>

<div class="overlay-backdrop spa-overlay-backdrop">
	<div class="overlay spa-overlay animation">
		<header>
			<h2>{title}</h2>
			<a href={resolve(closeHref)} class="close-overlay" aria-label="Sluiten">
				<span>Sluiten</span>
			</a>
		</header>
		<div class="overlay-content">
			<div class="form">
				{@render children()}
			</div>
		</div>
	</div>
</div>
