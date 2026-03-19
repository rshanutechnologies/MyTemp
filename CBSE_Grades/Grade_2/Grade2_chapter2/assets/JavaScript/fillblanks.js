/* ================= QUESTIONS ================= */

const questions = [

{
q: "Q.1 A frog can live both on ______ and in water.",
a: ["land"],
img: "../assets/images/froggak.png"
},

{
q: "Q.2 Some animals like dogs live in ______ shelters.",
a: ["kennel"],
img: "../assets/images/kennel.png"
},

{
q: "Q.3 Aquatic animals live in ______.",
a: ["water"],
img: "../assets/images/AquaticAnimal.png"
},

{
q: "Q.4 Bears eat both ______ and ______.",
a: ["plants","meat"],
img: "../assets/images/bear-img.png"
},

{
q: "Q.5 The home of honeybees is called ______.",
a: ["hive"],
img: "../assets/images/HoneyHome.png"
}

];

/* ================= VARIABLES ================= */

let index = 0;
let score = 0;

const answers = questions.map(q=>({
used:[],
correct:0,
values:[],
completed:false
}));

/* ================= ELEMENTS ================= */

const container = document.getElementById("answerSlots");
const qImgEl = document.getElementById("qImg");
const qTextEl = document.getElementById("qText");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");

/* ================= SPEECH ================= */

function speak(text){

speechSynthesis.cancel();

const msg = new SpeechSynthesisUtterance(text);

msg.lang="en-UK";
msg.volume=0.3;
msg.rate=1;
msg.pitch=1;

speechSynthesis.speak(msg);

}

/* ================= BUILD INPUTS ================= */

function buildInputs(){

const q = questions[index];
const state = answers[index];

container.innerHTML="";

q.a.forEach((answer,i)=>{

const box = document.createElement("div");
box.className="input-box";

const input = document.createElement("input");
input.placeholder="Type your answer...";

const btn = document.createElement("button");
btn.textContent="Submit";
btn.className="submit";
btn.disabled=true;

/* IF QUESTION ALREADY COMPLETED */

if(state.completed){

input.value = state.values[i] || "";
input.disabled = true;
btn.style.display = "none";
box.classList.add("correct");

}

/* enable button when typing */

input.addEventListener("input",()=>{
btn.disabled = input.value.trim()==="";
});

/* check answer */

btn.onclick=()=>checkAnswer(input,btn,box,answer,i);

box.append(input,btn);
container.appendChild(box);

});

/* enable next if completed */

if(state.completed){
next.disabled=false;
}else{
next.disabled=true;
}

}

/* ================= CHECK ANSWER ================= */

function checkAnswer(input,btn,box,correctAnswer,i){

const guess=input.value.trim().toLowerCase();

const state = answers[index];

if(
guess===correctAnswer.toLowerCase() &&
!state.used.includes(guess)
){

box.classList.add("correct");

input.disabled=true;
btn.style.display="none";

state.used.push(guess);
state.values[i]=guess;
state.correct++;

showPopup(true);
fireConfetti();

speak("Correct");

/* IF ALL ANSWERS CORRECT */

if(state.correct===questions[index].a.length){

state.completed=true;

next.disabled=false;

score++;

updateScore();

if(index===questions.length-1){

setTimeout(showFinal,1600);

}

}

}else{

input.value="";
showPopup(false);
speak("Wrong");

}

}

/* ================= LOAD QUESTION ================= */

function loadQuestion(){

const q=questions[index];

qImgEl.src=q.img;
qTextEl.textContent=q.q;

buildInputs();

prev.disabled=index===0;

}

/* ================= SCORE ================= */

function updateScore(){

if(scoreBox){

scoreBox.textContent="Score: "+score;

}

}

/* ================= NAVIGATION ================= */

prev.onclick=()=>{

if(index>0){

index--;

loadQuestion();

}

};

next.onclick=()=>{

if(index<questions.length-1){

index++;

loadQuestion();

}

};

/* ================= POPUP ================= */

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

}else{

icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
speak("Wrong");

}

setTimeout(()=>{
popup.style.display="none";
},1400);

}

/* ================= FINAL POPUP ================= */

function showFinal(){

const popup=document.getElementById("finalPopup");

document.getElementById("finalScore").textContent =
`Your Score: ${score} / ${questions.length}`;

document.getElementById("stars").textContent =
"⭐".repeat(score);

popup.style.display="flex";

fireConfettif();

}

/* ================= CONFETTI ================= */

function fireConfetti(){

confetti({
particleCount:40,
spread:80,
origin:{y:0.6}
});

}

function fireConfettif(){

confetti({
particleCount:100,
spread:120,
origin:{y:0.6}
});

}

/* ================= START ================= */

updateScore();
loadQuestion();