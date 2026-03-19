/* ================= QUIZ DATA ================= */
const quizData = [
{
  title: "Q.1 A cereal",
  image: "../assets/images/Cerealak.png",
  options:[
    { text:"Wheat", img:"../assets/images/Wheatak.png"},
    { text:"Pumpkin", img:"../assets/images/PumpkinPlantY.png"},
    { text:"Fruits", img:"../assets/images/Fruitakk (2).png"}
  ],
  answer: "Wheat"
},

{
  title: "Q.2 A pulse",
  image: "../assets/images/Pulsesak.png",
  options:[
    // { text:"Green gram", img:"../assets/images/GreenGram.png"},
     { text:"Vegitables", img:"../assets/images/Vegitableakp.png"},
    { text:"Rice", img:"../assets/images/Ricee.png"},
    { text:"Red gram", img:"../assets/images/RedGramsak.png"}
  ],
  answer: "Red gram"
},

{
  title: "Q.3 A leaf that we eat",
  image: "../assets/images/leafakk.png",
  options:[
    // { text:"Cabbage", img:"../assets/images/Cabbageak.png"},
    { text:" Oleander", img:"../assets/images/Oleander.png"},
    { text:"Spinach", img:"../assets/images/Spinch.png"},
    // { text:"Mint", img:"../assets/images/MintPlant.png"}
    { text:"Castor Plant", img:"../assets/images/CastorPlant.png"},
  ],
  answer: "Spinach"
},

{
  title: "Q.4 A root that we eat",
  image: "../assets/images/RootM.png",
  options:[
    { text:"Beetroot", img:"../assets/images/Radishak.png"},
    // { text:"Radish", img:"../assets/images/Radishakk.png"},
      { text:" Monkshood", img:"../assets/images/Monkshood.png"},
       { text:"Manchineel", img:"../assets/images/ManchineelTree.png"}
    // { text:"Beetroot", img:"../assets/images/Radishak.png"}
  ],
  answer: "Beetroot"
},

{
  title: "Q.5 A part of a plant",
  image: "../assets/images/Planttak.png",
  options:[
    { text:"Stem", img:"../assets/images/stemM.png"},
    { text:"Arms", img:"../assets/images/Arms.png"},
    { text:"Engine", img:"../assets/images/Engine.png"}
  ],
  answer: "Stem"
}
];
/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered:false,
  wrongs:[]
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

  q.options.forEach((opt)=>{

    const div=document.createElement("div");
    div.className="option";
   div.innerHTML = `
<img src="${opt.img}" class="option-icon">
<span>${opt.text}</span>
`;

  if(state.answered){

    if(opt.text === q.answer){
        div.classList.add("correct-lock");   // show correct
    }else{
        div.classList.add("disabled");       // disable other options
    }

    div.style.pointerEvents="none";          // no clicking
}

    else if(state.wrongs.includes(opt.text)){
        div.textContent = opt.text + " ❌";
    }

    if(!state.answered){
        div.onclick=()=>checkAnswer(div,opt.text);
    }

    optionsBox.appendChild(div);

  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;
}

/* ================= CHECK ANSWER ================= */

function checkAnswer(optionDiv,selected){

const state=answerState[current];
if(state.answered) return;

const correct=quizData[current].answer;

if(selected===correct){

    state.answered=true;
    score++;

    scoreBox.textContent="Score: "+score;

    const options = document.querySelectorAll(".option");

    options.forEach(opt => {

        const text  = opt.textContent.trim();

        if(text === correct){
            opt.classList.add("correct-lock");
        }
        else{
            opt.textContent = text + " ❌";
            opt.classList.add("wrong-shake");
            optionDiv.style.pointerEvents = "none";
        }

        opt.style.pointerEvents="none";
    });

    nextBtn.disabled=false;

    speak("Correct");
    showPopup(true);
     fireConfetti(); 

    if(current===quizData.length-1){
        setTimeout(showFinal,1600);
    }

}
else{

    state.wrongs.push(selected);

  optionDiv.textContent = selected;
optionDiv.classList.add("wronggg");

    optionDiv.classList.add("wrong-shake");

    speak("Wrong");
    showPopup(false);

    setTimeout(()=>{
        optionDiv.classList.remove("wrong-shake");
    },600);

}

}

/* ================= POPUPS ================= */

function showPopup(isCorrect) {

  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

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

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}


function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}
/* ================= START ================= */

loadQuestion();