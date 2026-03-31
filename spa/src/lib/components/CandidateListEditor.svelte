<script lang="ts">
import {
  availableDistricts,
  candidateListCanSubmit,
  districtSummary,
  duplicateDistricts,
  formatName,
} from "$lib/helpers";
import { DISTRICTS, maxCandidates } from "$lib/election";
import type { AppData, CandidateList, DistrictCode } from "$lib/types";

let {
  state,
  candidateList,
  onSubmit,
}: {
  state: AppData;
  candidateList: CandidateList;
  onSubmit?: (candidateList: CandidateList) => void;
} = $props();

const candidates = $derived(
  candidateList.candidateIds
    .map((id) => state.persons.find((person) => person.id === id))
    .filter(Boolean) as AppData["persons"],
);
const currentAvailableDistricts = $derived(
  availableDistricts(state, candidateList.id),
);
const duplicateCodes = $derived(duplicateDistricts(state, candidateList.id));

function toggleDistrict(code: DistrictCode) {
  if (candidateList.electoralDistricts.includes(code)) {
    candidateList.electoralDistricts = candidateList.electoralDistricts.filter(
      (entry) => entry !== code,
    );
    return;
  }

  candidateList.electoralDistricts = [
    ...candidateList.electoralDistricts,
    code,
  ];
}

function toggleCandidate(personId: string) {
  if (candidateList.candidateIds.includes(personId)) {
    candidateList.candidateIds = candidateList.candidateIds.filter(
      (entry) => entry !== personId,
    );
    return;
  }

  candidateList.candidateIds = [...candidateList.candidateIds, personId];
}

function moveCandidate(index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= candidateList.candidateIds.length) return;
  const updated = [...candidateList.candidateIds];
  const [item] = updated.splice(index, 1);
  updated.splice(next, 0, item);
  candidateList.candidateIds = updated;
}
</script>

<form
  class="form stack-lg"
  onsubmit={(event) => {
    event.preventDefault();
    onSubmit?.(candidateList);
  }}
>
  <fieldset>
    <legend><h2>Kieskringen</h2></legend>
    <div class="checklist grid" id="district_list">
      {#each DISTRICTS as district}
        <div
          class={`checkbox ${currentAvailableDistricts.some((entry) => entry.code === district.code) || candidateList.electoralDistricts.includes(district.code) ? "" : "disabled"}`}
        >
          <input
            type="checkbox"
            checked={candidateList.electoralDistricts.includes(district.code)}
            disabled={!currentAvailableDistricts.some(
              (entry) => entry.code === district.code,
            ) && !candidateList.electoralDistricts.includes(district.code)}
            id={`district-${district.code}`}
            onchange={() => toggleDistrict(district.code)}
          />
          <label for={`district-${district.code}`}
            >{district.title[state.locale]}</label
          >
        </div>
      {/each}
    </div>
    {#if candidateList.electoralDistricts.length > 0}
      <p class="hint mt-md">
        {districtSummary(candidateList.electoralDistricts, state.locale)}
      </p>
    {/if}
    {#if duplicateCodes.length > 0}
      <p class="note-warning mt-md">
        Deze lijst deelt kieskringen met een andere lijst.
      </p>
    {/if}
  </fieldset>

  <fieldset>
    <legend><h2>Lijstinleveraars</h2></legend>
    {#if state.listSubmitters.length === 0}
      <p>Voeg eerst een lijstinleveraar toe bij algemene informatie.</p>
    {:else}
      <div class="checklist">
        {#each state.listSubmitters as submitter}
          <label class="checkbox radio-card">
            <input
              type="radio"
              name="list_submitter_id"
              checked={candidateList.listSubmitterId === submitter.id}
              onchange={() => (candidateList.listSubmitterId = submitter.id)}
            />
            <span>{formatName(submitter.name)}</span>
          </label>
        {/each}
      </div>
    {/if}
  </fieldset>

  <fieldset>
    <legend><h2>Plaatsvervangende lijstinleveraars</h2></legend>
    {#if state.substituteListSubmitters.length === 0}
      <p>Geen plaatsvervangende lijstinleveraars beschikbaar.</p>
    {:else}
      <div class="checklist">
        {#each state.substituteListSubmitters as submitter}
          <label class="checkbox radio-card">
            <input
              type="checkbox"
              checked={candidateList.substituteListSubmitterIds.includes(
                submitter.id,
              )}
              onchange={() => {
                if (
                  candidateList.substituteListSubmitterIds.includes(
                    submitter.id,
                  )
                ) {
                  candidateList.substituteListSubmitterIds =
                    candidateList.substituteListSubmitterIds.filter(
                      (id) => id !== submitter.id,
                    );
                } else {
                  candidateList.substituteListSubmitterIds = [
                    ...candidateList.substituteListSubmitterIds,
                    submitter.id,
                  ];
                }
              }}
            />
            <span>{formatName(submitter.name)}</span>
          </label>
        {/each}
      </div>
    {/if}
  </fieldset>

  <fieldset>
    <legend><h2>Kandidaten</h2></legend>
    {#if state.persons.length === 0}
      <p>Er zijn nog geen kandidaten aangemaakt.</p>
    {:else}
      <table id="candidate-table">
        <thead>
          <tr>
            <th scope="col">Kandidaat</th>
            <th scope="col">Woonplaats</th>
            <th scope="col">Op lijst</th>
          </tr>
        </thead>
        <tbody>
          {#each state.persons as person}
            <tr>
              <td>{formatName(person.name)}</td>
              <td>{person.personalData.placeOfResidence}</td>
              <td>
                <label class="checkbox">
                  <input
                    type="checkbox"
                    checked={candidateList.candidateIds.includes(person.id)}
                    onchange={() => toggleCandidate(person.id)}
                  />
                  <span>Opnemen</span>
                </label>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    {#if candidates.length > 0}
      <h3 class="mt-lg">Volgorde</h3>
      <table id="candidate-table">
        <thead>
          <tr>
            <th scope="col">Positie</th>
            <th scope="col">Naam</th>
            <th scope="col">Acties</th>
          </tr>
        </thead>
        <tbody>
          {#each candidates as person, index}
            <tr>
              <td><span class="position-badge">{index + 1}</span></td>
              <td>{formatName(person.name)}</td>
              <td class="table-actions">
                <button
                  class="button secondary sm"
                  type="button"
                  onclick={() => moveCandidate(index, -1)}
                >
                  Omhoog
                </button>
                <button
                  class="button secondary sm"
                  type="button"
                  onclick={() => moveCandidate(index, 1)}
                >
                  Omlaag
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <p class="hint mt-md">
      {candidateList.candidateIds.length} / {maxCandidates(
        state.politicalGroup.longListAllowed,
      )} kandidaten
    </p>
  </fieldset>

  <div class="buttons">
    <button class="button" type="submit">Opslaan</button>
    <span
      class={`status-pill ${candidateListCanSubmit(state, candidateList) ? "complete" : "warning"}`}
    >
      {candidateListCanSubmit(state, candidateList)
        ? "Klaar voor vervolgstap"
        : "Nog niet compleet"}
    </span>
  </div>
</form>
