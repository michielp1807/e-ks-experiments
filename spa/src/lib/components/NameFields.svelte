<script lang="ts">
	import type { Name } from '$lib/types';

	let { name }: { name: Name } = $props();
	let autoformat = $state(true);
	let lastKey = $state<string | null>(null);
	let autoformatInitialised = $state(false);

	function formatInitials() {
		if (!autoformat) {
			return;
		}

		let initials = name.initials.toUpperCase().replaceAll(/[^A-Z]/g, '');

		if (lastKey === 'Backspace') {
			initials = initials.slice(0, -1);
			lastKey = null;
		}

		name.initials = initials.length > 0 ? `${initials.split('').join('.')}.` : '';
	}

	$effect(() => {
		if (!autoformatInitialised) {
			autoformat = !/[a-z]/.test(name.initials);
			autoformatInitialised = true;
		}

		formatInitials();
	});
</script>

<div class="form-row">
	<p class="form-field form-field-sm">
		<label for="initials">Initialen</label>
		<input
			bind:value={name.initials}
			type="text"
			id="initials"
			class="initials-input"
			required
			onkeydown={(event) => {
				lastKey = event.key;
			}}
			oninput={() => {
				formatInitials();
			}}
		/>
		<label class="autoformat">
			<input
				bind:checked={autoformat}
				type="checkbox"
				onchange={() => {
					formatInitials();
				}}
			/>
			<span>Automatisch opmaken</span>
		</label>
	</p>
	<p class="form-field">
		<label for="first_name">Roepnaam</label>
		<input bind:value={name.firstName} type="text" id="first_name" />
		<span class="hint">Alleen invullen als dit op de kandidatenlijst moet worden weergegeven.</span>
	</p>
</div>
<div class="form-row">
	<p class="form-field form-field-sm">
		<label for="last_name_prefix">Tussenvoegsel</label>
		<input bind:value={name.lastNamePrefix} type="text" id="last_name_prefix" />
	</p>
	<p class="form-field">
		<label for="last_name">Achternaam</label>
		<input bind:value={name.lastName} type="text" id="last_name" required />
	</p>
</div>
