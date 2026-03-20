<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const pathname = $derived(page.url.pathname);

	const steps = [
		{
			href: '/political-group',
			label: 'Gegevens politieke groepering'
		},
		{
			href: '/political-group/authorised-agents',
			label: 'Gegevens gemachtigden'
		},
		{
			href: '/political-group/list-submitters',
			label: 'Gegevens lijstindieners'
		}
	] as const;
</script>

<div class="steps-nav">
	<ul>
		{#each steps as step}
			<li>
				<a href={resolve(step.href)} class:active={pathname === resolve(step.href)}>{step.label}</a>
			</li>
		{/each}
	</ul>
</div>
