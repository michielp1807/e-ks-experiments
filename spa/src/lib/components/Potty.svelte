<script lang="ts">
import { loadSfx, playSfx } from "$lib/sfx";
import gifIntro from "$lib/assets/intro.gif";
import gifIdle from "$lib/assets/idle.gif";
import gifWrite from "$lib/assets/write.gif";
import mp3Intro from "$lib/assets/intro.mp3";
import mp3IntroLong from "$lib/assets/intro-long.mp3";
import mp3Write from "$lib/assets/write.mp3";
import { appState } from "$lib/state/app";
import { fromStore } from "svelte/store";

type Action = {
  text: string;
  fn: () => void;
};

const { introText, introAction }: { introText?: string; introAction?: Action } =
  $props();

const app = fromStore(appState);
const appData = $derived(app.current);
// svelte-ignore state_referenced_locally
const once = appData.once;

let sfxIntro = loadSfx(once ? mp3Intro : mp3IntroLong);
let sfxWrite = loadSfx(mp3Write);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const empty =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

let image = $state(empty);
let busy = $state(false);
let speech = $state("");
let speechAction: Action | undefined = $state();
let flash = $state(false);

function setAnim(anim: string) {
  image = `${anim}?t=${Date.now()}`; // necessary to make gif reset
}

async function intro() {
  playSfx(sfxIntro);
  if (!once) {
    flash = true;
    await wait(6200);
  }
  setAnim(gifIntro);
  await wait(1400);
  setAnim(gifIdle);
  busy = false;
  appState.setLongPottyIntro(true);
}

let lastSpeakStart = Date.now();
export async function speak(text: string, action?: Action) {
  let start = Date.now();
  lastSpeakStart = start;
  playSfx(sfxWrite);
  setAnim(gifWrite);
  busy = true;
  speechAction = undefined;
  for (let i = 0; i < 17; i++) {
    speech = text.substring(0, (i / 17) * text.length);
    await wait(100);
  }
  speech = text;
  await wait(100);
  speechAction = action;
  busy = false;

  await wait(1300);
  if (lastSpeakStart == start) {
    setAnim(gifIdle);
  }
}

const texts = [
  "Hallo! Ik ben Potty het Potlood!\nWaar kan ik je mee helpen vandaag?",
  "Voel je vrij om rond te klikken door de applicatie. Het ergste wat er kan gebeuren is dat je alle gegevens verwijdert.",
  "Je kunt altijd linksboven op het huisje klikken om terug naar de startpagina te gaan.",
];

function onclick(ev: MouseEvent) {
  if (!busy) {
    let i = texts.indexOf(speech) + 1;
    speak(texts[i % texts.length]);
  }
}

async function onclickcapture(ev: MouseEvent) {
  if (busy) {
    ev.preventDefault();
    ev.stopPropagation();
    return;
  }

  if (image == empty) {
    // play intro
    ev.preventDefault();
    ev.stopPropagation();
    busy = true;
    await intro();

    if (introText) {
      return speak(introText, introAction);
    }
  }

  // check for element to provide help with
  if (!(ev.target instanceof HTMLElement)) return;
  const element = ev.target?.closest("[data-potty]");
  if (!(element instanceof HTMLElement)) return;
  const help = element.dataset.potty;
  if (!help) return;

  if (speech != help) {
    ev.preventDefault();
    return speak(help);
  }
}
</script>

<div id="potty">
  {#if speech}
    <div id="speech">
      <p>{speech}</p>
      {#if speechAction}
        <div class="actions">
          <button onclick={speechAction.fn}>{speechAction.text}</button>
        </div>
      {/if}
    </div>
  {/if}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <img {onclick} alt="Potty het Potlood" src={image} />
</div>

<svelte:window {onclickcapture} />

{#if flash}
  <div class="overlay"></div>
{/if}

<style>
#potty {
  position: fixed;
  right: 7%;
  bottom: 14%;
  pointer-events: none;

  #speech {
    background-color: #ffffcc;
    padding: 1em;
    margin-right: 2em;
    margin-bottom: 2em;
    border: 1px solid black;
    border-radius: 1em;
    position: relative;
    max-width: 30em;
    pointer-events: auto;

    p {
      white-space: pre-wrap;
    }

    button {
      padding-inline: 1em;
      background-color: #ffffcc;
      border: 1px solid #bbb;
      border-radius: 0.5em;
      cursor: pointer;
      font-family: var(--font-text), sans-serif;
      color: var(--text-color-body);

      &:hover {
        border: 1px outset #aaa;
      }

      &:active {
        border: 1px inset #999;
      }
    }

    .actions {
      margin-top: 0.5em;
    }

    &::before {
      content: " ";
      position: absolute;
      width: 0;
      height: 0;
      right: 70px;
      bottom: -24px;
      border: 12px solid;
      border-color: black black transparent transparent;
    }

    &::after {
      content: " ";
      position: absolute;
      width: 0;
      height: 0;
      right: 71px;
      bottom: -22px;
      border: 12px solid;
      border-color: #ffffcc #ffffcc transparent transparent;
    }
  }

  img {
    height: 150px;
    float: right;
    cursor: pointer;
    pointer-events: auto;
  }
}

.overlay {
  position: fixed;
  inset: 0;
  background: black;
  pointer-events: none;
  z-index: 9999;
  animation: flash 6.8s ease-out forwards;
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  2% {
    opacity: 0.4;
  }
  10% {
    opacity: 0.25;
  }
  70% {
    opacity: 0.2;
  }
  98% {
    opacity: 0.05;
  }
  100% {
    opacity: 0;
  }
}
</style>
