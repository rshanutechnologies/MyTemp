/* ================= POPUP SYSTEM ================= */

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
speak("Correct");
 fireConfetti(); 

}else{

icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
speak("Wrong");

}

setTimeout(()=>{
popup.style.display="none";
},1200);

}


/* ================= FINAL POPUP ================= */

function showFinal(){

const finalPopup=document.getElementById("finalPopup");

finalPopup.style.display="flex";

document.getElementById("finalScore").textContent=
`Score: ${score} / ${quizData.length}`;

document.getElementById("stars").textContent=
"⭐".repeat(score);
 fireConfettif(); 

}


/* ================= SPEECH ================= */

function speak(text){

speechSynthesis.cancel();

const msg=new SpeechSynthesisUtterance(text);

msg.lang="en-UK";
msg.volume=0.25;
msg.rate=1;
msg.pitch=1;

speechSynthesis.speak(msg);

}


/* ================= QUIZ DATA ================= */

const quizData=[

{
q:"Q.1 Small and bushy plants",
a:"SHRUBS",
img:"../assets/images/S1.png"
},

{
q:"Q.2 Small plants with soft stems",
a:"HERBS",
img:"../assets/images/SmallPlantsak.png"
},

{
q:"Q.3 Seeds such as red gram and green gram",
a:"PULSES",
img:"../assets/images/RedGreenGram.png"
},

{
q:"Q.4 Grains such as wheat and rice",
a:"CEREALS",
img:"../assets/images/WheatRice.png"
},

{
q:"Q.5 Cotton and jute",
a:"FIBRE",
img:"../assets/images/CottonJute.png"
}

];


/* ================= VARIABLES ================= */

let current=0;
let score=0;

const answered=Array(quizData.length).fill(false);
const userAnswers=Array(quizData.length).fill("");

const qEl=document.getElementById("question");
const imgEl=document.getElementById("questionImg");
const nextBtn=document.getElementById("next");
const prevBtn=document.getElementById("prev");
const submitBtn=document.getElementById("submitBtn");

const scoreBox=document.getElementById("scoreBox");
const slotsEl=document.getElementById("answerSlots");
const jarEl=document.getElementById("letterJar");

let correctWord="";
let currentTiles=[];


/* ================= SCORE ================= */

function updateScore(){

scoreBox.textContent="Score: "+score;

}


/* ================= LOAD QUESTION ================= */

function loadQuestion(){

const q=quizData[current];

qEl.textContent=q.q;

imgEl.src=q.img;

correctWord=q.a.toUpperCase();

createSlots(correctWord);

/* restore previous answer if already solved */
if(answered[current]){

const slots=document.querySelectorAll(".slot");
const saved=userAnswers[current].split("");

saved.forEach((letter,i)=>{
slots[i].textContent=letter;
slots[i].classList.add("locked");
});

/* hide letter bubbles since question already solved */
jarEl.innerHTML="";

submitBtn.disabled=true;
nextBtn.disabled=false;

}else{

createJar(correctWord);
submitBtn.disabled=true;
nextBtn.disabled=true;

}

prevBtn.disabled=current===0;

}


/* ================= CREATE SLOTS ================= */

function createSlots(word){

slotsEl.innerHTML="";

for(let i=0;i<word.length;i++){

const slot=document.createElement("div");

slot.className="slot";

slotsEl.appendChild(slot);

}

}


/* ================= CREATE LETTER TILES ================= */

function createJar(answer){

jarEl.innerHTML="";
currentTiles=[];

/* keep answer letters */

let letters=answer.toUpperCase().split("");

/* add only X and Z */

letters.push("X");
// letters.push("Z");

/* shuffle */

for(let i=letters.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1));

[letters[i],letters[j]]=[letters[j],letters[i]];

}

/* create bubbles */

letters.forEach(letter=>{

const tile=document.createElement("div");

tile.className="bubble";

tile.textContent=letter;

tile.onclick=()=>placeLetter(tile,letter);

jarEl.appendChild(tile);

currentTiles.push(tile);

});

}


/* ================= PLACE LETTER ================= */

function placeLetter(tile,letter){

const slots=document.querySelectorAll(".slot");

const empty=[...slots].find(s=>!s.textContent);

if(!empty)return;

empty.textContent=letter;

tile.classList.add("used");

tile.onclick=null;

checkSlotsFilled();

}


/* ================= CHECK IF SLOTS FILLED ================= */

function checkSlotsFilled(){

const slots=document.querySelectorAll(".slot");

let word=[...slots].map(s=>s.textContent).join("");

if(word.length===correctWord.length){

submitBtn.disabled=false;

}

}


/* ================= SUBMIT ANSWER ================= */

submitBtn.onclick=()=>{

const slots=document.querySelectorAll(".slot");

let guess=[...slots].map(s=>s.textContent).join("");

if(guess===correctWord){

score++;

updateScore();

showPopup(true);

answered[current]=true;

userAnswers[current]=guess;

slots.forEach(s=>s.classList.add("locked"));

nextBtn.disabled=false;

if(current===quizData.length-1){

setTimeout(showFinal,1200);

}

}else{

showPopup(false);

setTimeout(()=>{

slots.forEach(s=>s.textContent="");

currentTiles.forEach(tile=>{

tile.classList.remove("used");

tile.onclick=()=>placeLetter(tile,tile.textContent);

});

submitBtn.disabled=true;

},800);

}

};


/* ================= REMOVE LETTER ================= */

function removeLastLetter(){

const slots=document.querySelectorAll(".slot");

const filled=[...slots].filter(s=>s.textContent);

if(filled.length===0)return;

const last=filled[filled.length-1];

const letter=last.textContent;

last.textContent="";

const tile=currentTiles.find(t=>t.textContent===letter && t.classList.contains("used"));

if(tile){

tile.classList.remove("used");

tile.onclick=()=>placeLetter(tile,letter);

}

submitBtn.disabled=true;

}


/* ================= BACKSPACE SUPPORT ================= */

document.addEventListener("keydown",(e)=>{

if(e.key==="Backspace"||e.key==="Delete"){

removeLastLetter();

}

});


/* ================= NAVIGATION ================= */

nextBtn.onclick=()=>{

current++;

loadQuestion();

};

prevBtn.onclick=()=>{

current--;

loadQuestion();

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

updateScore();

loadQuestion();