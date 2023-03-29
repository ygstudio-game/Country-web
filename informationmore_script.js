// grab the UI elements to work with
const textEl = document.querySelector(".contentImformation");
const playEl = document.querySelector("#play");
const pauseEl = document.querySelector("#pause");
const stopEl = document.querySelector("#stop");
// add UI event handlers
playEl.addEventListener("click", play);
pauseEl.addEventListener("click", pause);
stopEl.addEventListener("click", stop);

// set text
const text = textEl.innerHTML;
let voices, utterance;
utterance = new SpeechSynthesisUtterance(text);
console.log(window.speechSynthesis.getVoices());
function setvoice() {
  voices = window.speechSynthesis.getVoices();
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === "Google UK English Male") {
      utterance.voice = voices[i];
    }
  }
}

function play() {
  if (window.speechSynthesis.speaking) {
    // there's an unfinished utterance
    //  setvoice();
    window.speechSynthesis.resume();
  } else {
    // start new utterance
    //  setvoice();
    utterance.addEventListener("start", handleStart);
    utterance.addEventListener("pause", handlePause);
    utterance.addEventListener("resume", handleResume);
    utterance.addEventListener("end", handleEnd);
    utterance.addEventListener("boundary", handleBoundary);

    window.speechSynthesis.speak(utterance);
  }
}

function pause() {
  window.speechSynthesis.pause();
}

function stop() {
  window.speechSynthesis.cancel();

  // Safari doesn't fire the 'end' event when cancelling, so call handler manually
  handleEnd();
}

function handleStart() {
  playEl.disabled = true;
  pauseEl.disabled = false;
  stopEl.disabled = false;
}

function handlePause() {
  playEl.disabled = false;
  pauseEl.disabled = true;
  stopEl.disabled = false;
}

function handleResume() {
  playEl.disabled = true;
  pauseEl.disabled = false;
  stopEl.disabled = false;
}

function handleEnd() {
  playEl.disabled = false;
  pauseEl.disabled = true;
  stopEl.disabled = true;

  // reset text to remove mark
  textEl.innerHTML = text;
}

function handleBoundary(event) {
  if (event.name === "sentence") {
    // we only care about word boundaries
    console.log("no");
    return;
  }

  const wordStart = event.charIndex;

  let wordLength = event.charLength;
  if (wordLength === undefined) {
    // Safari doesn't provide charLength, so fall back to a regex to find the current word and its length (probably misses some edge cases, but good enough for this demo)
    const match = text.substring(wordStart).match(/^[a-z\d']*/i);
    wordLength = match[0].length;
  }

  // wrap word in <mark> tag
  const wordEnd = wordStart + wordLength;
  const word = text.substring(wordStart, wordEnd);
  const markedText =
    text.substring(0, wordStart) +
    "<mark>" +
    word +
    "</mark>" +
    text.substring(wordEnd);
  textEl.innerHTML = markedText;
}
onbeforeunload = () => {
  speechSynthesis.cancel();
  speak("");
};
