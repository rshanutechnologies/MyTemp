/* ================= QUIZ DATA ================= */

const quizData = [

{
title: "Q.1 Our tongue helps us to taste the food that we eat and to ____________________.",
image: "../assets/images/Tounge.png",
options: [
{ text: "Hear", img: "../assets/images/BoyHear.png" },
{ text: "See", img: "../assets/images/BoySee.png" },
{ text: "Speak", img: "../assets/images/BoySpeak.png" },
{ text: "Feel", img: "../assets/images/BoyFeel.png" }
],
answer: "Speak"
},

{
title: "Q.2 Our whole body is covered with the __________.",
image: "../assets/images/F11.png",
options: [
{ text: "Arms", img: "../assets/images/Arms.png" },
{ text: "Legs", img: "../assets/images/leg.png" },
{ text: "Ears", img: "../assets/images/ears.png" },
{ text: "Skin", img: "../assets/images/Skin.png" }
],
answer: "Skin"
},

{
title: "Q.3 The _________ is located inside our head.",
image: "../assets/images/BrianInHeadak.png",
options: [
{ text: "Heart", img: "../assets/images/heartt.png" },
{ text: "Brain", img: "../assets/images/brain.png" },
{ text: "Lungs", img: "../assets/images/Lungs.png" },
{ text: "Stomach", img: "../assets/images/stomachj.png" }
],
answer: "Brain"
},

{
title: "Q.4 ________ are the hardest parts of our body.",
image: "../assets/images/Bonesak.png",
options: [
{ text: "Bones", img: "../assets/images/2Boness.png" },
{ text: "Heart", img: "../assets/images/heartt.png" },
{ text: "Brain", img: "../assets/images/brain.png" },
{ text: "Stomach", img: "../assets/images/stomachj.png" }
],
answer: "Bones"
},

{
title: "Q.5 The ______ pumps blood to all the parts of body.",
image: "../assets/images/heartking.png",
options: [
{ text: "Brain", img: "../assets/images/brain.png" },
{ text: "Heart", img: "../assets/images/heartt.png" },
{ text: "Lungs", img: "../assets/images/Lungs.png" },
{ text: "Stomach", img: "../assets/images/stomachj.png" }
],
answer: "Heart"
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