/* ================= QUIZ DATA ================= */
/* ================= QUIZ DATA ================= */

const quizData = [

{
title: "Q.1 The skull is made up of __________ bones.",
image: "../assets/images/skull.png",
options: [
{ text: "10", img: "../assets/images/10.png" },
{ text: "12", img: "../assets/images/12.png" },
{ text: "18", img: "../assets/images/18.png" },
{ text: "22", img: "../assets/images/22.png" }
],
answer: "22"
},

{
title: "Q.2 Which is the only movable joint in the skull?",
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
title: "Q.3 The first bone of the spine is the __________.",
image: "../assets/images/spine.png",
options: [
{ text: "rib cage", img: "../assets/images/ribcage.png" },
{ text: "atlas", img: "../assets/images/atlas.png" },
{ text: "sternum", img: "../assets/images/sternum.png" },
{ text: "cranium", img: "../assets/images/cranium.png" }
],
answer: "atlas"
},

{
title: "Q.4 The floating ribs are found in the __________.",
image: "../assets/images/ribs.png",
options: [
{ text: "spine", img: "../assets/images/spine.png" },
{ text: "rib cage", img: "../assets/images/ribcage.png" },
{ text: "limbs", img: "../assets/images/limbs.png" },
{ text: "skull", img: "../assets/images/skull.png" }
],
answer: "rib cage"
},

{
title: "Q.5 How many pairs of ribs are attached to the vertebral column?",
image: "../assets/images/ribs1.png",
options: [
{ text: "12", img: "../assets/images/12.png" },
{ text: "2", img: "../assets/images/2.png" },
{ text: "10", img: "../assets/images/10.png" },
{ text: "22", img: "../assets/images/22.png" }
],
answer: "12"
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
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
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
    `Score: ${score}/${quizData.length}`;

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