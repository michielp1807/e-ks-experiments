<script lang="ts">
	import CountryCodeInput from '$lib/components/CountryCodeInput.svelte';
	import type { DutchAddress, InternationalAddress } from '$lib/types';

	let {
		address,
		international = false
	}: {
		address: DutchAddress | InternationalAddress;
		international?: boolean;
	} = $props();
</script>

<div class="form-row">
	<p class="form-field form-field-sm">
		<label for="postal_code">Postcode</label>
		<input bind:value={address.postalCode} type="text" id="postal_code" />
	</p>
	<p class="form-field form-field-sm">
		<label for="house_number">Huisnummer</label>
		<input bind:value={address.houseNumber} type="text" id="house_number" />
	</p>
	<p class="form-field form-field-sm">
		<label for="house_number_addition">Toevoeging</label>
		<input bind:value={address.houseNumberAddition} type="text" id="house_number_addition" />
	</p>
</div>
<div class="form-row">
	<p class="form-field">
		<label for="street_name">Straatnaam</label>
		<input bind:value={address.streetName} type="text" id="street_name" />
	</p>
	<p class="form-field">
		<label for="locality">Woonplaats</label>
		<input bind:value={address.locality} type="text" id="locality" />
	</p>
</div>
{#if international && 'stateOrProvince' in address}
	<div class="form-row">
		<p class="form-field">
			<label for="state_or_province">Staat of provincie</label>
			<input bind:value={address.stateOrProvince} type="text" id="state_or_province" />
		</p>
		<p class="form-field form-field-sm">
			<label for="country">Landcode</label>
			<CountryCodeInput bind:value={address.country} id="country" />
		</p>
	</div>
{/if}
