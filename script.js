const QUESTIONS = {
  behavioral: [
    "Tell me about a time you disagreed with a teammate. How did you handle it?",
    "Describe a project that failed. What did you learn from it?",
    "Give an example of when you had to meet a tight deadline. What was your approach?",
    "Tell me about a time you received tough feedback. How did you respond?",
    "Describe a situation where you had to persuade someone who didn't agree with you.",
    "Walk me through a time you took initiative without being asked.",
    "Tell me about a mistake you made at work and how you fixed it.",
    "Describe a time you had to juggle multiple priorities at once."
  ],

  technical: [
    "Walk me through how you'd debug a system that's suddenly running slowly.",
    "How would you explain a complex technical concept to a non-technical stakeholder?",
    "Describe your process for reviewing someone else's code or work.",
    "Tell me about a technical decision you made that you'd reconsider today.",
    "How do you decide when to build something yourself versus use an existing tool?",
    "Walk me through how you'd approach a problem you've never seen before.",
    "Describe a time you had to learn a new tool or technology quickly.",
    "How do you balance moving fast with keeping quality high?"
  ],

  general: [
    "Why are you interested in this role, specifically?",
    "What kind of work environment brings out your best?",
    "Where do you want to be in your career three years from now?",
    "What's something you're proud of that isn't on your résumé?",
    "How do you handle ambiguity when priorities aren't clearly defined?",
    "What questions do you have for us?",
    "Tell me about a team culture that didn't work well for you, and why.",
    "What does a good day at work look like for you?"
  ]
};

const state = {
  cat: "behavioral",
  index: 0,
  seconds: 0,
  timerId: null,
  recording: false,
  rehearsed: {
    behavioral: new Set(),
    technical: new Set(),
    general: new Set()
  }
};

const cardEl = document.getElementById("cueCard");
const eyebrowEl = document.getElementById("cardEyebrow");
const questionEl = document.getElementById("cardQuestion");
const timerEl = document.getElementById("timerDisplay");
const recBtn = document.getElementById("recBtn");
const recLight = document.getElementById("recLight");
const recText = document.getElementById("recText");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const clockEl = document.getElementById("clock");

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

function catLabel(category) {
  return {
    behavioral: "BEHAVIORAL",
    technical: "TECHNICAL",
    general: "GENERAL & FIT"
  }[category];
}

function renderCard() {
  const list = QUESTIONS[state.cat];

  eyebrowEl.textContent =
    `${catLabel(state.cat)} — CARD ${state.index + 1} OF ${list.length}`;

  questionEl.textContent = list[state.index];

  updateProgress();
}

function flipToCard(category, index) {
  cardEl.classList.add("flipping");

  setTimeout(() => {
    state.cat = category;
    state.index = index;

    renderCard();

    cardEl.classList.remove("flipping");
  }, 220);
}

function updateProgress() {
  const list = QUESTIONS[state.cat];
  const done = state.rehearsed[state.cat].size;

  progressFill.style.width = `${(done / list.length) * 100}%`;

  progressLabel.textContent =
    `${done} / ${list.length} rehearsed`;
}

document.querySelectorAll(".channel").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".channel")
      .forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    stopTimer();

    flipToCard(button.dataset.cat, 0);
  });
});

document
  .getElementById("nextBtn")
  .addEventListener("click", () => {
    state.rehearsed[state.cat].add(state.index);

    const list = QUESTIONS[state.cat];

    const nextIndex = (state.index + 1) % list.length;

    stopTimer();

    flipToCard(state.cat, nextIndex);
  });

document
  .getElementById("resetTimerBtn")
  .addEventListener("click", () => {
    state.seconds = 0;
    timerEl.textContent = formatTime(0);
  });

recBtn.addEventListener("click", () => {
  if (state.recording) {
    stopTimer();
  } else {
    startTimer();
  }
});

function startTimer() {
  state.recording = true;

  recBtn.textContent = "Stop";
  recBtn.classList.add("live");

  recLight.classList.add("live");

  recText.classList.add("live");
  recText.textContent = "ON AIR";

  timerEl.classList.add("live");

  state.timerId = setInterval(() => {
    state.seconds++;

    timerEl.textContent = formatTime(state.seconds);
  }, 1000);
}

function stopTimer() {
  state.recording = false;

  recBtn.textContent = "Record answer";
  recBtn.classList.remove("live");

  recLight.classList.remove("live");

  recText.classList.remove("live");
  recText.textContent = "STANDING BY";

  timerEl.classList.remove("live");

  clearInterval(state.timerId);
}

function tickClock() {
  const now = new Date();

  clockEl.textContent =
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }) + " · REHEARSAL MODE";
}

tickClock();

setInterval(tickClock, 1000);

renderCard();