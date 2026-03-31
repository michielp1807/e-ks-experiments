const audioContext = new AudioContext();

export function loadSfx(src: string) {
  const audio = new Audio();
  audio.src = src;
  audio.load();
  return audio;
}

export function playSfx(audioElement: HTMLAudioElement) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  audioElement.currentTime = 0;
  audioElement.play();
}
