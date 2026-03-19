/* ================= QUIZ DATA ================= */

const quizData = [
{
  title: "Q.1 Animals that live around our houses or in the farms",
  options:[
    { text:"Wild animals", img:"../assets/images/WildAnimals.png"},
    { text:"Domestic animals", img:"../assets/images/Domesticak.png"},
  ],
  answer: "Domestic animals"
},

{
  title: "Q.2 Birds that cannot fly",
  options:[
    { text:"Flightless birds", img:"../assets/images/FlighlessBird.png"},
    { text:"Flying birds", img:"../assets/images/FlyBirds.png"},
  ],
  answer: "Flightless birds"
},

{
  title: "Q.3 Animals that live in forests",
  options:[
    { text:"Pet animals", img:"../assets/images/PetAnimals.png"},
    { text:"Wild animals", img:"../assets/images/WildAnimals.png"},
  ],
  answer: "Wild animals"
}
];


/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered:false
}));


/* ================= ELEMENTS ================= */

const titleText = document.getElementById("titleText");
const optionsBox = document.getElementById("optionsBox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");


/* ================= TTS ================= */

function speak(text){

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);

  msg.lang="en-UK";
  msg.volume=0.25;
  msg.rate=1;
  msg.pitch=1;

  speechSynthesis.speak(msg);

}


/* ================= LOAD QUESTION ================= */

function loadQuestion(){

  const q = quizData[current];
  const state = answerState[current];

  titleText.textContent = q.title;

  optionsBox.innerHTML = "";

  q.options.forEach(opt=>{

    const div=document.createElement("div");
    div.className="option";

    div.innerHTML=`
      <img src="${opt.img}">
      <div class="label">${opt.text}</div>
    `;

    /* If already answered show result */
    if(state.answered){

        if(opt.text === q.answer){
            div.classList.add("correct-lock");
        }
        else{
            div.classList.add("wrong-shake");
        }

        div.style.pointerEvents="none";
    }

    else{
        div.onclick=()=>checkAnswer(opt.text);
    }

    optionsBox.appendChild(div);

  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !state.answered;

}


/* ================= CHECK ANSWER ================= */

function checkAnswer(selected){

const state = answerState[current];

if(state.answered) return;

const correct = quizData[current].answer;

const options = document.querySelectorAll(".option");

if(selected === correct){

    state.answered = true;

    score++;

    scoreBox.textContent = "Score: " + score;

    options.forEach(opt => {

        const text = opt.querySelector(".label").textContent;

        if(text === correct){
            opt.classList.add("correct-lock");
        }
        else{
            opt.classList.add("wrong-shake");
        }

        opt.style.pointerEvents="none";

    });

    nextBtn.disabled=false;

    speak("Correct");
    showPopup(true);
     fireConfetti(); 

    if(current===quizData.length-1){
        setTimeout(showFinal,1500);
    }

}
else{

    speak("Wrong");
    showPopup(false);

}

}


/* ================= POPUPS ================= */

function showPopup(isCorrect){

  const popup=document.getElementById("answerPopup");
  const icon=document.getElementById("popupIcon");
  const title=document.getElementById("popupTitle");
  const msg=document.getElementById("popupMsg");

  popup.className="popup "+(isCorrect?"correct":"wrong");
  popup.style.display="flex";

  if(isCorrect){
    icon.textContent="🎉";
    title.textContent="Correct!";
    msg.textContent="Well done!";
  }
  else{
    icon.textContent="😔";
    title.textContent="Wrong!";
    msg.textContent="Try again!";
  }

  setTimeout(()=>{
    popup.style.display="none";
  },1200);

}


function showFinal(){

  const finalPopup=document.getElementById("finalPopup");

  finalPopup.style.display="flex";

  document.getElementById("finalScore").textContent =
  `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
  "⭐".repeat(score);
   fireConfettif(); 

}


/* ================= BUTTONS ================= */

nextBtn.onclick=()=>{

  if(current < quizData.length-1){

    current++;
    loadQuestion();

  }

};

prevBtn.onclick=()=>{

  if(current > 0){

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