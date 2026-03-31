<script lang="ts">
import GeneralInfoSteps from "$lib/components/GeneralInfoSteps.svelte";
import PageHeader from "$lib/components/PageHeader.svelte";
import PoliticalGroupForm from "$lib/components/PoliticalGroupForm.svelte";
import Potty from "$lib/components/Potty.svelte";
import { appState } from "$lib/state/app";
import { fromStore } from "svelte/store";

const app = fromStore(appState);
const appData = $derived(app.current);
</script>

<PageHeader title="Basisgegevens" backHref="/" />
<div class="steps">
  <GeneralInfoSteps />
  <div>
    <PoliticalGroupForm politicalGroup={appData.politicalGroup} />
    <Potty></Potty>
  </div>
</div>
