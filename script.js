const HIS_NAME = "Karan";
const FAILS_TO_UNLOCK = 5;
const STORAGE_KEY = "birthday_letter_unlock_FINAL";

const taunts = [
  "You look confident. That’s adorable.",
  "Wrong. But I love the effort.",
  "So close… (no you weren’t).",
  "Try again 😌",
  "You really thought… huh?",
  "Skill issue.",
];

const loses = [
  "Wrong button.",
  "Incorrect. Cute though.",
  "Nope.",
  "Wrong. Try again 😌",
  "HAHA no.",
];

function qs(id) { return document.getElementById(id); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function isUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}
function setUnlocked(v) {
  localStorage.setItem(STORAGE_KEY, v ? "true" : "false");
}

/* Confetti */
function confettiBurst() {
  const duration = 900;
  const end = Date.now() + duration;
  const colors = ["#ff5fa2", "#ffd6e7", "#d8f3dc", "#ffffff"];

  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);

    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.zIndex = "9999";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-10px";
    piece.style.width = "10px";
    piece.style.height = "14px";
    piece.style.borderRadius = "3px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(piece);

    const fall = piece.animate(
      [{ transform: "translateY(0px)" }, { transform: `translateY(${window.innerHeight + 40}px)` }],
      { duration: 700 + Math.random() * 700, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    fall.onfinish = () => piece.remove();
  }, 40);
}

/* LETTER PAGE lock */
function initLetterPage() {
  const lockedOverlay = qs("lockedOverlay");
  if (!lockedOverlay) return;

  if (isUnlocked()) lockedOverlay.classList.add("hidden");
  else lockedOverlay.classList.remove("hidden");
}

/* MUSIC shuffle */
function initMusicPage() {
  const shuffleBtn = qs("shuffleBtn");
  const songsList = qs("songsList");
  if (!shuffleBtn || !songsList) return;

  shuffleBtn.addEventListener("click", () => {
    const items = Array.from(songsList.querySelectorAll("li"));
    items.sort(() => Math.random() - 0.5);
    items.forEach((li) => songsList.appendChild(li));
  });
}

/* GAME page */
function initGamePage() {
  const buttonGrid = qs("buttonGrid");
  const toastEl = qs("toast");
  if (!buttonGrid || !toastEl) return;

  const hisNameEl = qs("hisName");
  if (hisNameEl) hisNameEl.textContent = HIS_NAME;

  const attemptsEl = qs("attempts");
  const streakEl = qs("streak");
  const winrateEl = qs("winrate");
  const tauntEl = qs("tauntText");
  const unlockFillEl = qs("unlockFill");
  const unlockMsgEl = qs("unlockMsg");
  const letterBtn = qs("letterBtn");
  const resetBtn = qs("resetBtn");
  const cheatBtn = qs("cheatBtn");

  let attempts = 0;
  let confidence = 0;

  function setToast(msg, type = "") {
    toastEl.textContent = msg;
    toastEl.className = `toast ${type}`;
  }

  function render() {
    if (attemptsEl) attemptsEl.textContent = String(attempts);
    if (streakEl) streakEl.textContent = String(confidence);
    if (winrateEl) winrateEl.textContent = "0%";

    const pct = isUnlocked()
      ? 100
      : clamp(Math.round((attempts / FAILS_TO_UNLOCK) * 100), 0, 100);

    if (unlockFillEl) unlockFillEl.style.width = pct + "%";
    if (unlockMsgEl) unlockMsgEl.textContent = isUnlocked()
      ? "Suffering meter: 100% ✅ letter unlocked"
      : `Suffering meter: ${pct}%`;

    if (letterBtn) {
      if (isUnlocked()) {
        letterBtn.classList.remove("disabled");
        letterBtn.setAttribute("aria-disabled", "false");
        letterBtn.textContent = "Go to letter 💌";
      } else {
        letterBtn.classList.add("disabled");
        letterBtn.setAttribute("aria-disabled", "true");
        letterBtn.textContent = "Unlock Letter";
      }
    }
  }

  function unlockLetter() {
    setUnlocked(true);
    setToast("Okay fine. You suffered enough. Letter unlocked 💌", "good");
    confettiBurst();
    render();
  }

  function riggedLose() {
    attempts += 1;
    confidence += 1;

    const buttons = Array.from(buttonGrid.querySelectorAll(".game-btn"));
    buttons.sort(() => Math.random() - 0.5);
    buttons.forEach((b) => buttonGrid.appendChild(b));

    setToast(loses[Math.floor(Math.random() * loses.length)], "bad");
    if (tauntEl) tauntEl.textContent = taunts[Math.floor(Math.random() * taunts.length)];

    if (!isUnlocked() && attempts >= FAILS_TO_UNLOCK) unlockLetter();
    else render();
  }

  function resetGame() {
    attempts = 0;
    confidence = 0;
    setUnlocked(false);
    setToast("Reset done 😌");
    render();
  }

  function fakeHint() {
    setToast("Hint: it’s not that one 😌");
  }

  if (letterBtn) {
    letterBtn.addEventListener("click", (e) => {
      if (!isUnlocked()) {
        e.preventDefault();
        setToast("Nice try 😌 lose more first.", "bad");
      }
    });
  }

  buttonGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".game-btn");
    if (!btn) return;
    riggedLose();
  });

  resetBtn?.addEventListener("click", resetGame);
  cheatBtn?.addEventListener("click", fakeHint);

  render();
  setToast("Pick a button 😌");
}

function init() {
  initGamePage();
  initLetterPage();
  initMusicPage();
}
init();
