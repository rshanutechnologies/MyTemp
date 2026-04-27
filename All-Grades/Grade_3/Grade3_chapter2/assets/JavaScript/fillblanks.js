
const questions = [
  { q: "Q1. __________ do not have a main root.", a: "fibrous roots", img: "../assets/images/Fibrousroots.png" },
  { q: "Q2. Leaves are usually __________ in colour.", a: "green", img: "../assets/images/leafak.png" },
  { q: "Q3. The thinner roots have white hair-like structures on them called the __________.", a: "root hairs", img: "../assets/images/Roothairs.png" },
  { q: "Q4. Leaves take in __________ and give out __________ during the process of making food.", a: "carbon-dioxide|carbon dioxide and oxygen", img: "../assets/images/CO2O2.png" },
  { q: "Q5. __________ have seeds inside them.", a: "fruits", img: "../assets/images/Fruits.png" }
];

const pillIcons = ["🌱", "🌿", "🍃", "🌸", "🌰"];

let index = 0;
let score = 0;

const answered = [];
const answers = [];

const qEl = document.getElementById("question");
const imgEl = document.getElementById("image");
// const input = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


// const originalPlaceholder = input.placeholder;

function speak(t) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(t);

  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function resetPlaceholder() {
  if (!input.value && !input.disabled) {
    input.placeholder = originalPlaceholder;
  }
}

// input.addEventListener("focus", () => input.placeholder = "");
// input.addEventListener("blur", resetPlaceholder);

// input.addEventListener("input", () => {
//   checkBtn.disabled = !input.value.trim() || input.disabled;
// });


const answerContainer = document.getElementById("answerContainer");

function updateCheckButton() {
  if (answered[index]) {
    checkBtn.disabled = true;
    return;
  }
  const inputs = answerContainer.querySelectorAll("input");

  const allFilled = [...inputs].every(inp => inp.value.trim().length > 0);

  checkBtn.disabled = !allFilled;
}

function load() {

  const q = questions[index];

  qEl.textContent = q.q;
  imgEl.src = q.img;

  answerContainer.innerHTML = "";

  const answersList = q.a.split(" and ");

  answersList.forEach((_, i) => {

    const input = document.createElement("input");

    input.placeholder = "Type answer...";
    input.dataset.index = i;

    // ✅ restore saved answers
    if (answered[index]) {
      input.value = answers[index][i];
      input.disabled = true;
      input.classList.add("correct-input");
    }

    input.addEventListener("input", updateCheckButton);

    answerContainer.appendChild(input);

  });

  checkBtn.disabled = answered[index];   // disable if already correct
  prevBtn.disabled = index === 0;

  if (answered[index]) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }

  updateCheckButton();

}

function normalizeAnswer(text) {
  return text
    .toLowerCase()
    .replace(/-/g, " ")      // convert hyphen to space
    .replace(/\s+/g, " ")    // remove extra spaces
    .trim();
}

checkBtn.onclick = () => {

  const inputs = document.querySelectorAll("#answerContainer input");

  const userAnswers = [...inputs].map(i => normalizeAnswer(i.value));

  const correctAnswers = questions[index].a
  .split(" and ")
  .map(a => a.trim());  

  let isCorrect = true;

  correctAnswers.forEach((ans, i) => {

    const alternatives = ans.split("|").map(a => normalizeAnswer(a));

    if (!alternatives.includes(userAnswers[i])) {
      isCorrect = false;
    }

  });

  if (isCorrect) {

    answered[index] = true;
    answers[index] = userAnswers;
    score++;

    inputs.forEach(i => {
      i.disabled = true;
      i.classList.add("correct-input");
    });

    nextBtn.disabled = false;
    checkBtn.disabled = true;

    speak("Correct");

    showPopup(`
      <div class="popup-correct">
        <span class="check">✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">${"⭐".repeat(index + 1)}</div>
      </div>
    `);

    if (index === questions.length - 1) {
      setTimeout(() => showFinal(), 1100);
    }

  } else {

    inputs.forEach(i => i.value = "");

    updateCheckButton();
    checkBtn.disabled = true;

    speak("Wrong");

    showPopup(`
      <div class="popup-wrong">
        <span class="cross">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
    `);
  }
};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    load();
  }
};

nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    load();
  }
};

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

const imageBox = document.getElementById("image"); // your image element

/* PREVENT DEFAULT BEHAVIOR */
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => e.preventDefault());

imageBox.addEventListener("dragover", (e)=>{
  e.preventDefault();
  imageBox.style.border = "px dashed #4cc9f0";
});

/* DROP EVENT */
imageBox.addEventListener("drop", (e)=>{
  e.preventDefault();

  imageBox.style.border = "none";

  const file = e.dataTransfer.files[0];

  if(file && file.type.startsWith("image/")){

    const reader = new FileReader();

    reader.onload = function(event){
      imageBox.src = event.target.result; // show image
    };

    reader.readAsDataURL(file);
  }
});
function showPopup(html, final = false) {
  popup.style.display = "flex";

  popupText.className = final
    ? "popup-box final-wide"
    : "popup-box";

  popupText.innerHTML = html;

  if (!final) {
    setTimeout(() => popup.style.display = "none", 1000);
  }
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

load();

