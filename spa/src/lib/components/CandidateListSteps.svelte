<script lang="ts">
import { resolve } from "$app/paths";
import { page } from "$app/state";
import type { AppData, CandidateList } from "$lib/types";

let {
  appData,
  candidateList,
}: {
  appData: AppData;
  candidateList: CandidateList;
} = $props();

const pathname = $derived(page.url.pathname);
</script>

<div class="steps-nav">
  <ul>
    <li>
      <a
        href={resolve("/candidate-lists/[id]/details", {
          id: candidateList.id,
        })}
        class:ok={candidateList.electoralDistricts.length > 0}
        class:warning={candidateList.electoralDistricts.length === 0}
        class:active={pathname.endsWith("/details")}
      >
        Kieskringen
      </a>
    </li>
    <li>
      <a
        href={resolve("/candidate-lists/[id]/submitters", {
          id: candidateList.id,
        })}
        class:ok={Boolean(candidateList.listSubmitterId)}
        class:warning={!candidateList.listSubmitterId}
        class:active={pathname.endsWith("/submitters")}
      >
        Lijstinleveraar
      </a>
    </li>
  </ul>
</div>
