<script lang="ts">
	import { COUNTRY_CODES, countryFlag } from '$lib/countries';

	type CountryCode = (typeof COUNTRY_CODES)[number];

	let {
		value = $bindable(''),
		id = 'country',
		name = 'country',
		required = false
	}: {
		value?: string;
		id?: string;
		name?: string;
		required?: boolean;
	} = $props();

	let open = $state(false);
	let activeIndex = $state(0);

	function normalizedValue() {
		return value.trim().toUpperCase();
	}

	function updateValue(nextValue: string) {
		value = nextValue.trim().toUpperCase().slice(0, 2);
		activeIndex = findActiveIndex();
	}

	function findActiveIndex() {
		const current = normalizedValue();
		const nextIndex = COUNTRY_CODES.findIndex((code) => current.length > 0 && code.startsWith(current));
		const fallbackIndex = COUNTRY_CODES.indexOf('NL');
		return nextIndex === -1 ? Math.max(fallbackIndex, 0) : nextIndex;
	}

	function openList() {
		open = true;
		activeIndex = findActiveIndex();
	}

	function closeListSoon() {
		window.setTimeout(() => {
			open = false;
		}, 200);
	}

	function selectCountry(code: CountryCode) {
		value = code;
		activeIndex = COUNTRY_CODES.indexOf(code);
		open = false;
	}

	function moveActive(step: number) {
		activeIndex = (activeIndex + step + COUNTRY_CODES.length) % COUNTRY_CODES.length;
	}
</script>

<div class="country-input input-icon">
	<span class="icon">{countryFlag(value)}</span>
	<input
		bind:value
		{id}
		{name}
		{required}
		type="text"
		minlength="2"
		maxlength="2"
		autocomplete="off"
		autocapitalize="characters"
		onfocus={() => {
			if (value === '') {
				value = 'NL';
			}
			openList();
		}}
		onblur={() => {
			closeListSoon();
		}}
		oninput={(event) => {
			updateValue((event.currentTarget as HTMLInputElement).value);
			openList();
		}}
		onkeydown={(event) => {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				openList();
				moveActive(1);
				return;
			}

			if (event.key === 'ArrowUp') {
				event.preventDefault();
				openList();
				moveActive(-1);
				return;
			}

			if (event.key === 'Enter') {
				event.preventDefault();
				selectCountry(COUNTRY_CODES[activeIndex] ?? 'NL');
			}
		}}
	/>
	<ul style:display={open ? 'block' : 'none'}>
		{#each COUNTRY_CODES as code, index}
			<li data-country={code}>
				<button
					class:active={index === activeIndex}
					class="country-option"
					type="button"
					onmousedown={(event) => {
						event.preventDefault();
					}}
					onclick={() => {
						selectCountry(code);
					}}
				>
					<span class="icon">{countryFlag(code)}</span> {code}
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.country-option {
		width: 100%;
		display: flex;
		align-items: center;
		padding: var(--space-xs) var(--space-sm);
		border: 0;
		background: transparent;
		cursor: pointer;
		text-align: left;
		font: inherit;
		color: inherit;
	}

	.country-option .icon {
		margin-right: var(--space-md);
	}

	.country-option.active {
		background-color: var(--blue-100);
	}

	.country-option:hover {
		background-color: var(--bg-gray-darker);
	}
</style>
