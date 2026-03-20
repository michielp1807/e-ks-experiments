<script lang="ts">
	import { browser } from '$app/environment';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import DistrictsList from '$lib/components/DistrictsList.svelte';
	import { ELECTION } from '$lib/election';
	import { clearOverlayFamily } from '$lib/overlay-animation';
	import '$lib/legacy/styles/index.css';
	import '$lib/styles/spa-overrides.css';
	import { appState } from '$lib/state/app';
	import { pageHeader } from '$lib/state/page-header';
	import { fromStore } from 'svelte/store';

	let { children } = $props();

	const app = fromStore(appState);
	const header = fromStore(pageHeader);
	const locale = $derived(app.current.locale);
	const title = $derived(ELECTION.titles[locale]);
	const routeId = $derived(page.route.id ?? '/');
	const routeParams = $derived({ id: page.params.id, personId: page.params.personId });

	$effect(() => {
		if (browser) {
			clearOverlayFamily(routeId, routeParams);
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="robots" content="noindex">
	<meta name="description" content="Kandidaatstelling SPA" />
	<link rel="icon" href={asset('/favicon.svg')} />
</svelte:head>

<header>
	<nav>
		<ul>
			<li>
				<a href={resolve('/')} class:active={routeId === '/'} class="home" aria-label="Home"><span>Home</span></a>
			</li>
			<li>
				<a href={resolve('/political-group')} class:active={routeId.startsWith('/political-group')}>
					Basisgegevens
				</a>
			</li>
			<li>
				<a href={resolve('/candidate-lists')} class:active={routeId.startsWith('/candidate-lists')}>
					Kandidatenlijsten
				</a>
			</li>
			<li><a href={resolve('/submit')} class:active={routeId.startsWith('/submit')}>Inleveren</a></li>
		</ul>
		<ul>
			<li>
				<div class="language-switch">
					<button
						class:active={locale === 'nl'}
						class="button sm"
						type="button"
						onclick={() => appState.setLocale('nl')}
					>
						NL
					</button>
					<button
						class:active={locale === 'en'}
						class="button sm"
						type="button"
						onclick={() => appState.setLocale('en')}
					>
						EN
					</button>
				</div>
			</li>
		</ul>
	</nav>
	{#if header.current.title}
		<div class="header-content page-header">
			<div>
				<h1>{header.current.title}</h1>
				{#if header.current.districts.length > 0}
					<div class="page-header-districts">
						<DistrictsList districts={header.current.districts} locale={locale} />
					</div>
				{:else if header.current.subtitle}
					<span class="subtitle">{header.current.subtitle}</span>
				{/if}
			</div>
			{#if header.current.backHref}
				<a href={resolve(header.current.backHref)} class="button secondary">{header.current.backLabel}</a>
			{/if}
		</div>
	{/if}
</header>

<main>
	{@render children()}
</main>

<footer>
	<span>Kiesraad - Kandidaatstelling</span>
	<span>SPA prototype</span>
</footer>
