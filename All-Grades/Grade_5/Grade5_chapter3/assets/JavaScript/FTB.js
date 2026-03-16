const questions = [
  {
    q: "Q.1 The ________ are the thick-walled blood vessels that carry blood from the heart to the different parts of the body.",
    a: ["arteries"],
    img: "../assets/images/heart1-img.png",
  },
  {
    q: "Q.2 The heart makes the sound ________ when it pumps blood.",
    a: ["lub-dub"],
    img: "../assets/images/heart2-img.png",
  },
  {
    q: "Q.3 The ________ divides into two branches called the bronchi.",
    a: ["windpipe"],
    img: "../assets/images/heart3-img.png",
  },
  {
    q: "Q.4 The lower two chambers of the heart are the ________.",
    a: ["ventricles"],
    img: "../assets/images/heart1-img.png",
  },
  {
    q: "Q.5 The air that we breathe out also contains ________ and ________.",
    a: ["carbon dioxide", "water vapour"],
    img: "../assets/images/heart5-img.png",
  },
];

const QUESTIONS_PER_PAGE = 1;

/* ---------- Build page index ---------- */
const pages = [];
for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
  pages.push(
    Array.from(
      { length: Math.min(QUESTIONS_PER_PAGE, questions.length - i) },
      (_, j) => i + j
    )
  );
}

let pageIndex = 0;
let score = 0;
let finalShown = false;               // prevents double final popup
const answers = Array(questions.length).fill(null);

const container = document.getElementById("questionsContainer");
const template = document.getElementById("questionTemplate");

/* Progress bar container (can be null if you removed it in HTML) */
const progressContainer = document.getElementById("progress");

/* ---------- Utilities ---------- */
// function speak(text) {
//   try {
//     speechSynthesis.cancel();
//     speechSynthesis.speak(new SpeechSynthesisUtterance(text));
//   } catch (_) { /* ignore if not supported */ }
// }


function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
/* Normalize user input and expected answer:
   - lowercase
   - replace dashes with space (so "lub-dub" == "lub dub")
   - convert "&" to "and"
   - accept both "vapour" and "vapor"
   - collapse extra spaces
*/
function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[-–—]+/g, " ")
    .replace(/&/g, "and")
    .replace(/vapou?r/g, "vapor")
    .replace(/\s+/g, " ")
    .trim();
}

function isCorrect(user, expected) {
  return norm(user) === norm(expected);
}

/* ---------- Progress bar (safe no-op if missing) ---------- */
function renderProgress() {
  if (!progressContainer) return;
  progressContainer.innerHTML = "";

  questions.forEach((_, i) => {
    const step = document.createElement("div");
    step.className = "station";

    if (answers[i]) step.classList.add("done");

    const currentQuestionIndex = pages[pageIndex][0];
    if (i === currentQuestionIndex) step.classList.add("active");

    if (i === questions.length - 1) {
      step.classList.add("finish");
      step.textContent = "🏁";
    } else {
      step.textContent = i + 1;
    }

    progressContainer.appendChild(step);
  });
}

/* ---------- Load current page ---------- */
function loadPage() {
  container.innerHTML = "";

  pages[pageIndex].forEach((index) => {
    const q = questions[index];
    const clone = template.content.cloneNode(true);

    const img      = clone.querySelector(".question-img");
    const text     = clone.querySelector(".question-sentence");
   const inputsContainer = clone.querySelector("#inputsContainer");
const checkBtn = clone.querySelector(".checkBtn");
    const row      = clone.querySelector(".input-row");

    // Prev/Next live INSIDE the template
    const prevBtn  = clone.querySelector("#prevBtn");
    const nextBtn  = clone.querySelector("#nextBtn");

    // Fill content
    img.src = q.img;
    img.alt = "";
    text.textContent = q.q;
    q.a.forEach(() => {

const input = document.createElement("input");
input.type = "text";
input.placeholder = "Type answer here...";

inputsContainer.appendChild(input);

});
    // Restore answered state
   const inputs = inputsContainer.querySelectorAll("input");

// Restore answered state
if (answers[index]) {

  inputs.forEach((input,i)=>{
    input.value = answers[index][i];
    input.disabled = true;
  });

  checkBtn.disabled = true;
  row.classList.add("correct");

} else {

  checkBtn.disabled = true;

  inputs.forEach(input=>{
    input.addEventListener("input", () => {

      const allFilled = [...inputs].every(i=>i.value.trim());
      checkBtn.disabled = !allFilled;

    });
  });

}

    // Check handler
    checkBtn.addEventListener("click", () => {
   const inputs = inputsContainer.querySelectorAll("input");

let correct = true;

inputs.forEach((input,i)=>{

if(!isCorrect(input.value,q.a[i])){
correct = false;
}

});

     if (correct) {
        if (answers[index] === null) { // only first success counts
          answers[index] = q.a;
          score++;
        }

        speak("Correct");
        showPopup(true);

        // Re-render to lock the controls and enable Next
        loadPage();
        renderProgress();

        // If everything answered, show final automatically
        maybeShowFinal();
      } else {
        speak("Wrong ");
        showPopup(false);
        inputs.forEach(input => input.value = "");
checkBtn.disabled = true;
      }
    });

    // Prev/Next handlers (for this one question clone)
    prevBtn.disabled = pageIndex === 0;
    prevBtn.addEventListener("click", () => {
      if (pageIndex > 0) {
        pageIndex--;
        loadPage();
        renderProgress();
      }
    });

    const canGoNext = pages[pageIndex].every((i) => answers[i]);
    const lastPage  = pageIndex >= pages.length - 1;

    nextBtn.textContent = lastPage ? "Finish →" : "Next →";
    nextBtn.disabled = !canGoNext;

    nextBtn.addEventListener("click", () => {
      if (!canGoNext) return;

      if (lastPage) {
        // If all questions in the whole quiz are answered, show final now
        if (answers.every((a) => a !== null)) {
          maybeShowFinal(true); // immediate
        }
      } else {
        pageIndex++;
        loadPage();
        renderProgress();
      }
    });

    container.appendChild(clone);
  });

  renderProgress();
  // Also check after rendering (handles navigation back/forward edge cases)
  maybeShowFinal();
}

/* ---------- Final popup control ---------- */
function maybeShowFinal(immediate = false) {
  if (finalShown) return;
  if (answers.every((a) => a !== null)) {
    finalShown = true;
    if (immediate) {
      showFinal();
    } else {
      // small delay so the "Correct!" popup can finish nicely
      setTimeout(showFinal, 1000);
    }
  }
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
}

/* ---------- Feedback popup ---------- */
function showPopup(correct) {

  const popup = document.getElementById("answerPopup");
  if (!popup) return;

  popup.classList.remove("correct","wrong");

  if(correct){
    popup.classList.add("correct");
  }else{
    popup.classList.add("wrong");
  }

  popup.style.display = "flex";

  document.getElementById("popupIcon").textContent =
    correct ? "🎉" : "😔";

  document.getElementById("popupTitle").textContent =
    correct ? "Correct!" : "Wrong!";

  document.getElementById("popupMsg").textContent =
    correct ? "Well done!" : "Try again!";

  setTimeout(()=>{
    popup.style.display = "none";
  },900);
}

/* ---------- Start ---------- */
loadPage();