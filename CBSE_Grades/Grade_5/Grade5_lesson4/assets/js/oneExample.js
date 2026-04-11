/* ================= QUIZ DATA ================= */

const quizData = [

{
title: "Q.1 What are invertebrates?",
options:[
{ text:"Animals without a backbone", img:"../assets/images/invertebrates1.png"},
{ text:"Animals with a backbone", img:"../assets/images/vertebrates.png"},
],
answer: "Animals without a backbone"
},

{
title: "Q.2 What is the vertebral column?",
options:[
{ text:"Backbone of the body", img:"../assets/images/ribs2.png"},
{ text:"Bones of the arms", img:"../assets/images/arms2.png"},
],
answer: "Backbone of the body"
},

{
title: "Q.3 Where is the sternum located?",
options:[
{ text:"Chest", img:"../assets/images/chest2.png"},
{ text:"Leg", img:"../assets/images/leg2.png"},
],
answer: "Chest"
},

{
title: "Q.4 Why are cardiac muscles considered involuntary muscles?",
options:[
{ text:"They work without our control", img:"../assets/images/heartt.png"},
{ text:"We control them manually", img:"../assets/images/musclecontrol.png"},
],
answer: "They work without our control"
},

{
title: "Q.5 What are floating ribs?",
options:[
{ text:"Ribs not attached to the sternum", img:"../assets/images/ribs2.png"},
{ text:"Ribs attached to the skull", img:"../assets/images/skull.png"},
],
answer: "Ribs not attached to the sternum"
}

];


/* ================= STATE ================= */

let current = 0;
let score = 0;

const answerState = quizData.map(() => ({
  answered:false,
  selected:null
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

div.innerHTML = `
<div class="option-card">

  <img src="${opt.img}" class="option-img">

  <div class="platform"></div>

</div>

<div class="label">${opt.text}</div>
`;
    /* If already answered show result */
  if(state.answered){

    if(opt.text !== q.answer){
        return; // hide wrong option when user comes back
    }

    div.classList.add("correct-lock");
    // div.style.background="#e6fff2";
    // div.style.borderRadius="16px";
    // div.style.pointerEvents="none";

}

    else{
        div.onclick=()=>checkAnswer(opt.text);
    }
   
    if(state.answered){
optionsBox.classList.add("single");
}else{
optionsBox.classList.remove("single");
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
    state.selected = selected;

    score++;

    scoreBox.textContent = "Score: " + score;

    options.forEach(opt => {

        const text = opt.querySelector(".label").textContent;

        if(text === correct){

            opt.classList.add("correct-lock");

            // opt.style.background="#e6fff2";
            // opt.style.borderRadius="16px";

        }else{

            opt.remove(); // remove wrong option completely

        }

    });

    nextBtn.disabled=false;

    speak("Correct");
    showPopup(true);
    fireConfetti();

    if(current===quizData.length-1){
        setTimeout(showFinal,1500);
    }

}else{

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