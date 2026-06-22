/* ================= QUIZ DATA ================= */
/* ================= QUIZ DATA ================= */

const quizData = [

{
title: "Q1. The skull is made up of __________ bones.",
image: "../assets/images/skull.png",
options: [
{ text: "Ten", img: "../assets/images/10.png" },
{ text: "Twelve", img: "../assets/images/12.png" },
{ text: "Eighteen", img: "../assets/images/18.png" },
{ text: "Twenty two", img: "../assets/images/22.png" }
],
answer: "Twenty two"
},

{
title: "Q2. Which is the only movable joint in the skull?",
image: "../assets/images/skull1.png",
options: [
{ text: "Lower jaw", img: "../assets/images/lowerjaw.png" },
{ text: "Upper jaw", img: "../assets/images/upperjaw.png" },
{ text: "Vertebrae", img: "../assets/images/vertebrae.png" },
{ text: "Sternum", img: "../assets/images/sternum.png" }
],
answer: "Lower jaw"
},

{
title: "Q3. The first bone of the spine is the _____.",
image: "../assets/images/spine.png",
options: [
{ text: "Rib cage", img: "../assets/images/ribcage.png" },
{ text: "Atlas", img: "../assets/images/atlas.png" },
{ text: "Sternum", img: "../assets/images/sternum.png" },
{ text: "Cranium", img: "../assets/images/cranium.png" }
],
answer: "Atlas"
},

{
title: "Q4. The floating ribs are found in the ____.",
image: "../assets/images/ribs.png",
options: [
{ text: "Spine", img: "../assets/images/spine.png" },
{ text: "Rib cage", img: "../assets/images/ribcage.png" },
{ text: "Limbs", img: "../assets/images/limbs.png" },
{ text: "Skull", img: "../assets/images/skull.png" }
],
answer: "Rib cage"
},

{
title: "Q5. How many pairs of ribs are attached to the vertebral column?",
image: "../assets/images/ribs1.png",
options: [
{ text: "Twelve", img: "../assets/images/12.png" },
{ text: "Two", img: "../assets/images/2.png" },
{ text: "Ten", img: "../assets/images/10.png" },
{ text: "Twenty two", img: "../assets/images/22.png" }
],
answer: "Twelve"
}

];





/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered: false,
}));


/* ================= ELEMENTS ================= */

const titleText = document.getElementById("titleText");
const animalImg = document.getElementById("animalImg");
const optionsBox = document.getElementById("optionsBox");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");


/* ================= TTS ================= */

function speak(text) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(text);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}


/* ================= LOAD QUESTION ================= */

function loadQuestion() {
  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;
  animalImg.src = q.image;
  animalImg.alt = "Plant Image";

  optionsBox.innerHTML = "";

  q.options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "option";
  div.innerHTML = `
<img src="${opt.img}" class="option-img">
<span class="label">${opt.text}</span>
`;

    if (state.answered) {
      div.classList.add("disabled");
      if (opt.text === q.answer) {
        div.classList.add("correct-lock");
      }
    } else {
      div.onclick = () => checkAnswer(div, opt.text);
    }

    optionsBox.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}


/* ================= CHECK ANSWER ================= */

function checkAnswer(optionDiv, selected) {
  const state = answerState[current];
  if (state.answered) return;

  const correct = quizData[current].answer;

  if (selected === correct) {
    state.answered = true;
    score++;
    scoreBox.textContent = "Score: " + score;

    document.querySelectorAll(".option").forEach((o) => {
      o.classList.add("disabled");
      o.onclick = null;
    });

    optionDiv.classList.add("correct-lock");
    nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);
     fireConfetti(); 

    if (current === quizData.length - 1) {
      setTimeout(showFinal, 1600);
    }

  } else {
    speak("Wrong");
    optionDiv.classList.add("wrong-shake");
    showPopup(false);

    setTimeout(() => {
      optionDiv.classList.remove("wrong-shake");
    }, 600);
  }
}


/* ================= POPUPS (NEW SYSTEM) ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

    // 🔥 RESET animation (important)
  icon.style.animation = "none";
  void icon.offsetWidth; 
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🥳";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😒";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireConfettif(); 

 

 
}


/* ================= BUTTONS ================= */

nextBtn.onclick = () => {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}

/* ================= START ================= */

loadQuestion();