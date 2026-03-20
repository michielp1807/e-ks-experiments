<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { appState } from '$lib/state/app';
	import type { PoliticalGroup } from '$lib/types';

	let { politicalGroup }: { politicalGroup: PoliticalGroup } = $props();

	let draft = $state<PoliticalGroup>({
		id: '',
		longListAllowed: null,
		legalName: '',
		displayName: ''
	});

	$effect(() => {
		draft = structuredClone(politicalGroup);
	});
</script>

<form
	class="form"
	onsubmit={(event) => {
		event.preventDefault();
		appState.updatePoliticalGroup(draft);
		goto(resolve('/political-group/authorised-agents'));
	}}
>
	<h3>Algemene informatie</h3>
	<div class="form-row">
		<fieldset class="checklist">
			<legend>Type lijstaanduiding:</legend>
			<div class="checkbox">
				<input type="radio" checked id="registered_name" disabled />
				<label for="registered_name">
					Op zichzelf staande geregistreerde naam
					<span class="hint">De partij neemt als één eenduidige partij deel aan de verkiezing.</span>
				</label>
			</div>
			<div class="checkbox">
				<input type="radio" id="name_combination" disabled />
				<label for="name_combination">
					Combinatie van meerdere geregistreerde namen
					<span class="hint">De partij heeft een samenwerkingsverband met één of meer andere geregistreerde partijen. Samen leveren zij alle kandidaten voor de kandidatenlijst.</span>
				</label>
			</div>
			<div class="checkbox">
				<input type="radio" id="blank_name" disabled />
				<label for="blank_name">
					Blanco lijst
					<span class="hint">Een kandidatenlijst zonder aanduiding.</span>
				</label>
			</div>
		</fieldset>
	</div>
	<h3>Titel</h3>
	<div class="form-row">
		<fieldset class="checklist">
			<legend class="legend-md">Uw partij heeft bij de vorige Eerste Kamerverkiezing 16 zetels of meer behaald:</legend>
			<span class="hint">Dit bepaalt of u 50 of 80 kandidaten per lijst op mag voeren.</span>
			<div class="checklist">
				<div class="checkbox">
					<input bind:group={draft.longListAllowed} type="radio" id="long_list_yes" name="long_list_allowed" value={true} />
					<label for="long_list_yes">Ja</label>
				</div>
				<div class="checkbox">
					<input bind:group={draft.longListAllowed} type="radio" id="long_list_no" name="long_list_allowed" value={false} />
					<label for="long_list_no">Nee</label>
				</div>
			</div>
		</fieldset>
	</div>
	<div class="form-row">
		<p class="form-field">
			<label for="display_name">Geregistreerde aanduiding</label>
			<input bind:value={draft.displayName} id="display_name" type="text" />
			<span class="hint">De naam die is geregistreerd bij het centraal stembureau. Deze komt op het stembiljet te staan.</span>
		</p>
	</div>
	<div class="form-row">
		<p class="form-field">
			<label for="legal_name">Volledige statutaire naam</label>
			<input bind:value={draft.legalName} id="legal_name" type="text" />
			<span class="hint">De naam die is vastgelegd in de notariële akte en bij de Kamer van Koophandel.</span>
		</p>
	</div>
	<div class="buttons">
		<button class="button" type="submit">Opslaan en doorgaan</button>
	</div>
</form>
