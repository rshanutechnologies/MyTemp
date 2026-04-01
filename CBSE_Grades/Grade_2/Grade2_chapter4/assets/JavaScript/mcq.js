/* ================= QUIZ DATA ================= */

const quizData = [

{
title: "Q.1 Which of the following food gives us energy?",
image:  "../assets/images/EatingEnergy.png",
options: [
{ text: "Eggs", img: "../assets/images/Eggak.png" },
{ text: "Rice", img: "../assets/images/Ricee.png" },
{ text: "Milk", img: "../assets/images/Milk.png"},
{ text: "Meat", img: "../assets/images/Meat.png" }
],
answer: "Rice"
},

{
title: "Q.2 __________ protect us from falling sick.",
image:  "../assets/images/BoySickk.png",
options: [
{ text: "Vitamins", img: "../assets/images/Vitaminsak.png" },
{ text: "Pulses", img: "../assets/images/Pulsesak.png" },
{ text: "Cereals", img: "../assets/images/Cerealak.png" },
{ text: "Bread", img: "../assets/images/Breadak.png" }
],
answer: "Vitamins"
},

{
title: "Q.3 We get cereals, pulses and fruits from __________.",
image:  "../assets/images/BoyHandCPF.png",
options: [
{ text: "Fruits", img: "../assets/images/Fruitakk.png"  },
{ text: "Fish", img: "../assets/images/fish.png" },
{ text: "Vegetables", img: "../assets/images/Vegitableakp.png" },
{ text: "Plants", img: "../assets/images/Planttak.png" }
],
answer: "Plants"
},

{
title: "Q.4 __________ is the first meal of the day.",
image:  "../assets/images/BoyFirstMeal.png",
options: [
{ text: "Snacks", img: "../assets/images/Snacksak.png" },
{ text: "Dinner", img: "../assets/images/Dinnerak (1).png" },
{ text: "Breakfast", img: "../assets/images/Breakfastak.png" },
{ text: "Lunch", img: "../assets/images/Lunchakk.png" }
],
answer: "Breakfast"
},

{
title: "Q.5 __________ helps to remove waste from the body.",
image:  "../assets/images/BoyWaterWast.png",
options: [
{ text: "Water", img: "../assets/images/WaterGak.png" },
{ text: "Food", img: "../assets/images/Lunchakk.png" },
{ text: "Juice", img: "../assets/images/Juiceak.png" },
{ text: "Milk", img: "../assets/images/Milk.png" }
],
answer: "Water"
}

];

/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered: false,
  wrong: [],
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

/* ================= IMAGE PRELOAD ================= */
function preloadImages(){

  let images = [];

  quizData.forEach(q=>{
    images.push(q.image);
    q.options.forEach(opt=>{
      images.push(opt.img);
    });
  });

  images.forEach(src=>{
    const img = new Image();
    img.src = src;
  });

}
/* ================= LOAD QUESTION ================= */

function loadQuestion() {

  // animalImg.loading = "lazy";
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
<img src="${opt.img}" class="option-img" loading="lazy">
<span class="label">${opt.text}</span>
`;
if (state.answered) {

  div.classList.add("disabled");

  if (opt.text === q.answer){
    div.classList.add("correct-lock");
  } 
  else{
    div.classList.add("wrong-faded"); // 👈 fade others when returning
  }

}

/* restore wrong faded options */

if (state.wrong.includes(opt.text)){
  div.classList.add("wrong-faded");
}
     else {
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

    if(o !== optionDiv){
      o.classList.add("wrong-faded");   // 👈 fade other options
    }

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

  }
  else {

  speak("Wrong");

  optionDiv.classList.add("wrong-shake");
  optionDiv.classList.add("wrong-faded");

  const state = answerState[current];
  state.wrong.push(selected);

  showPopup(false);

  setTimeout(()=>{
    optionDiv.classList.remove("wrong-shake");
  },600);

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

loadQuestion();     // show UI instantly
// preloadImages();    