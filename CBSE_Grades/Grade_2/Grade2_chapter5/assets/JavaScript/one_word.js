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
q:"Q.1 Water that is safe for drinking",
a:"POTABLE",
img:"../assets/images/PortableWak.png"
},

{
q:"Q.2 This makes the air around us fresh and clean",
a:"Plants",
img:"../assets/images/Treeak.png"
},

{
q:"Q.3 The rainwater that goes down into the soil",
a:"GROUNDWATER",
img:"../assets/images/RainWaterGoSoil.png"
},

{
q:"Q.4 People use this in villages to draw out ground water",
a:"Handpump",
img:"../assets/images/VillageHandpump.png"
}

];


/* ================= VARIABLES ================= */

let current=0;
let score=0;

const qEl=document.getElementById("question");
const imgEl=document.getElementById("questionImg");
const nextBtn=document.getElementById("next");
const prevBtn=document.getElementById("prev");
const submitBtn=document.getElementById("submitBtn");

const scoreBox=document.getElementById("scoreBox");
const answerLine=document.getElementById("answerLine");

let correctWord="";
let typedLetters=[];

/* NEW STORAGE */
let savedAnswers=new Array(quizData.length).fill(null);
let locked=new Array(quizData.length).fill(false);


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

typedLetters=[];

/* Restore saved answer */
if(savedAnswers[current]){
typedLetters=[...savedAnswers[current]];
}

/* Lock behavior */
if(locked[current]){
nextBtn.disabled=false;
submitBtn.disabled=true;
}else{
nextBtn.disabled=true;
submitBtn.disabled=typedLetters.length!==correctWord.length;
}

prevBtn.disabled=current===0;

renderLine();

}


/* ================= DRAW UNDERSCORE LINE ================= */
function renderLine(){

let display = "";

for(let i=0;i<correctWord.length;i++){

if(typedLetters[i]){
  display += `<span class="box">${typedLetters[i]}</span>`;
}else if(i === typedLetters.length){
  display += `<span class="box"><span class="cursor">|</span></span>`;
}else{
  display += `<span class="box"></span>`;
}

}

answerLine.innerHTML = display;

if(!locked[current]){
submitBtn.disabled = typedLetters.length !== correctWord.length;
}

}
/* ================= KEYBOARD INPUT ================= */

document.addEventListener("keydown",(e)=>{

if(locked[current]) return;

if(e.key==="Backspace"){

typedLetters.pop();
renderLine();
return;

}

if(/^[a-zA-Z]$/.test(e.key)){

if(typedLetters.length<correctWord.length){

typedLetters.push(e.key.toUpperCase());
renderLine();

}

}

});


/* ================= SUBMIT ================= */

submitBtn.onclick=()=>{

if(typedLetters.length!==correctWord.length) return;

let guess=typedLetters.join("");

savedAnswers[current]=[...typedLetters];

if(guess===correctWord){

score++;
updateScore();
showPopup(true);

locked[current]=true;

nextBtn.disabled=false;
submitBtn.disabled=true;

if(current===quizData.length-1){

setTimeout(showFinal,1200);

}

}else{

showPopup(false);

typedLetters=[];
savedAnswers[current]=null;

renderLine();

}

};


/* ================= NAVIGATION ================= */

nextBtn.onclick=()=>{

current++;
loadQuestion();

};

prevBtn.onclick=()=>{

current--;
loadQuestion();

};


/* ================= CONFETTI ================= */

function fireConfetti() {

confetti({
particleCount:40,
spread:80,
origin:{y:0.6}
});

}

function fireConfettif() {

confetti({
particleCount:100,
spread:120,
origin:{y:0.6}
});

}


/* ================= START ================= */

updateScore();
loadQuestion();