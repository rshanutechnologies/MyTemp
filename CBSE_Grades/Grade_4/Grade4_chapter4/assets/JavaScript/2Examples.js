const questions = [
  {
    q: "Q1. Oxygen",
    a: ["21%", "All living things need oxygen to breathe and to obtain energy from it"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/mcq-1.png",
  },
  {
    q: "Q2. Carbon dioxide",
    a: ["0.04%", "Plants use carbon dioxide for photosynthesis"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/mcq1-1.png",
  },
  {
    q: "Q3. Nitrogen",
    a: ["78%", "Used for making fertilizers."],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/mcq-2.png",
  },
  {
    q: "Q4. Argon",
    a: ["0.93%", "Used in electric bulbs"],
    placeholders: ["% of gas", "One use"],
    img: "../assets/images/FB-5.png",
  },
];

let index = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const image        = document.getElementById("questionImage");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const inputsRow    = document.getElementById("inputsContainer");

const userAnswers = questions.map((q) => ({
  used: [],
  boxes: q.a.map(() => ({ value: "", correct: false })),
}));

function speak(t) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "en-UK";
  u.volume = 0.25;
  speechSynthesis.speak(u);
}

function smallConfetti() { confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } }); }
function bigConfetti()   { confetti({ particleCount: 60, spread: 90, origin: { y: 0.7 } }); }

/* ─────────────────────────────────────────
   verticalCenter(ta)
   Pads the textarea top so text sits in the
   vertical middle of the fixed-height box.
───────────────────────────────────────── */
function verticalCenter(ta) {
  ta.style.paddingTop    = "0px";
  ta.style.paddingBottom = "0px";

  const boxH    = ta.clientHeight;                               // visible box height
  const fs      = parseFloat(getComputedStyle(ta).fontSize);
  const lh      = parseFloat(getComputedStyle(ta).lineHeight) || fs * 1.35;
  const isEmpty = ta.value.trim() === "";

  let textH;
  if (isEmpty) {
    textH = lh;                                                  // one line for placeholder
  } else {
    // measure real content height
    ta.style.height = "0px";
    textH = ta.scrollHeight;
    ta.style.height = "";
  }

  const pad = Math.max(0, Math.floor((boxH - textH) / 2));
  ta.style.paddingTop    = pad + "px";
  ta.style.paddingBottom = pad + "px";
}

function loadQuestion() {
  const q = questions[index];

  questionText.innerText = q.q;
  image.src = q.img;
  image.classList.toggle("reveal", userAnswers[index].boxes.every((b) => b.correct));
  prevBtn.disabled = index === 0;

  inputsRow.innerHTML = "";

  q.a.forEach((_, i) => {
    const box = document.createElement("div");
    box.className = "input-box";

    let input;

    if (i === 0) {
      /* ── PERCENTAGE INPUT ── */
      box.classList.add("percentage-box");

      input = document.createElement("input");
      input.type        = "text";
      input.className   = "percentage-input";
      input.placeholder = q.placeholders[i];
      input.value       = userAnswers[index].boxes[i].value;

      input.addEventListener("input", () => {
        /* strip non-numeric, cap digits */
        let v = input.value.replace("%", "").replace(/[^0-9.]/g, "");
        let [int, dec] = v.split(".");
        if (int && int.length > 4) int = int.slice(0, 4);
        v = dec !== undefined ? int + "." + dec.slice(0, 2) : (int || "");
        input.value  = v;
        btn.disabled = v === "";
      });

      input.addEventListener("blur", () => {
        if (input.value.trim() && !input.value.endsWith("%")) {
          input.value += "%";
        }
      });

    } else {
      /* ── USE TEXTAREA ── */
      box.classList.add("use-box");

      input = document.createElement("textarea");
      input.className   = "use-textarea";
      input.placeholder = q.placeholders[i];
      input.value       = userAnswers[index].boxes[i].value;

      input.addEventListener("input", () => {
        btn.disabled = input.value.trim() === "";
        verticalCenter(input);
      });
    }

    /* ── BUTTON ── */
    const btn      = document.createElement("button");
    btn.textContent = "✓";
    btn.disabled    = input.value.trim() === "";

    if (userAnswers[index].boxes[i].correct) {
      box.classList.add("correct");
      input.disabled = true;
      btn.disabled   = true;
    }

    btn.onclick = () => checkAnswer(input, btn, box, i);

    box.append(input, btn);
    inputsRow.appendChild(box);

    /* Center textarea after layout settles */
    if (i === 1) requestAnimationFrame(() => verticalCenter(input));
  });

  checkAllAnswered();
}

function checkAnswer(input, btn, box, i) {
  const value   = input.value.trim().toLowerCase();
  const answers = questions[index].a.map((a) => a.toLowerCase());
  const state   = userAnswers[index];

  if (answers.includes(value) && !state.used.includes(value)) {
    box.classList.add("correct");
    input.disabled   = true;
    btn.disabled     = true;
    btn.style.cursor = "not-allowed";

    state.used.push(value);
    state.boxes[i] = { value, correct: true };

    speak("Correct");
    smallConfetti();
    showPopup(true);
  } else {
    input.value  = "";
    btn.disabled = true;

    if (input.tagName === "TEXTAREA") requestAnimationFrame(() => verticalCenter(input));

    speak("Wrong");
    showPopup(false);
  }

  checkAllAnswered();
}

function checkAllAnswered() {
  const done = userAnswers[index].boxes.every((b) => b.correct);
  nextBtn.disabled = !done;

  if (done && !userAnswers[index].scored) {
    score++;
    userAnswers[index].scored = true;
    image.classList.add("reveal");
    if (index === questions.length - 1) setTimeout(showFinal, 1600);
  }
}

nextBtn.onclick = () => { if (index < questions.length - 1) { index++; loadQuestion(); } };
prevBtn.onclick = () => { if (index > 0) { index--; loadQuestion(); } };

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  popup.className  = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
  popup.style.display = "flex";
  document.getElementById("popupIcon").textContent  = isCorrect ? "🎉😊" : "🥲💭";
  document.getElementById("popupTitle").textContent = isCorrect ? "Great Job!" : "Oops!";
  document.getElementById("popupMsg").textContent   = isCorrect ? "You got it right!" : "Try again, you can do it!";
  setTimeout(() => (popup.style.display = "none"), 1400);
}

function showFinal() {
  const popup = document.getElementById("finalPopup");
  document.getElementById("finalScore").textContent = `Your Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent      = "⭐".repeat(score);
  popup.style.display = "flex";
  bigConfetti();
}

loadQuestion();