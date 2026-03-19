const quiz=[

{
q:"1. The process by which living things are able to produce more of their own kind is called ______.",
a:"reproduction",
img:"../assets/images/reproduction1.png"
},

{
q:"2. Dolphins and blue whales are ______ that live in water.",
a:"mammals",
img:"../assets/images/mammals.png"
},

{
q:"3. In the adult stage, the male chickens become ______.",
a:"roosters",
img:"../assets/images/roosters1.png"
},

{
q:"4. The ______ provides nutrition to the growing embryo.",
a:"yolk",
img:"../assets/images/yolk1.png"
},

{
q:"5. A pupa is covered by a protective layer called the ______.",
a:"cocoon",
img:"../assets/images/cocoon.png"
}

];

let index=0;
let score=0;

let userAnswers=Array(quiz.length).fill("");
let answered=Array(quiz.length).fill(false);

const question=document.getElementById("question");
const blank=document.getElementById("blank");
const letters=document.getElementById("letters");
const image=document.getElementById("questionImage");
const backspaceBtn = document.getElementById("backspaceBtn");

let selectedButtons = [];
const prev=document.getElementById("prev");
const next=document.getElementById("next");

/* SPEECH */

function speak(t){

speechSynthesis.cancel();

const msg=new SpeechSynthesisUtterance(t);

msg.lang="en-UK";
msg.volume=0.3;
msg.rate=1;
msg.pitch=1;

speechSynthesis.speak(msg);

}

/* SHUFFLE */

function shuffle(a){
return a.sort(()=>Math.random()-0.5);
}

/* LOAD QUESTION */

function load(){
selectedButtons=[];
const q=quiz[index];
backspaceBtn.disabled = false;
question.innerText=q.q;

image.src=q.img;

blank.innerText=userAnswers[index].toUpperCase();

letters.innerHTML="";

let answer=q.a.toUpperCase().replace(/\s/g,"");

let arr=answer.split("");

shuffle(arr);

const colors=["red","yellow","green","lightgreen","pink","blue"];

arr.forEach((l,i)=>{

let btn=document.createElement("button");

btn.className="letter "+colors[i%6];

btn.innerText=l;

btn.onclick=()=>select(l,btn);

if(answered[index]) btn.disabled=true;

letters.appendChild(btn);

});

prev.disabled=index===0;
next.disabled=!answered[index];

}

/* SELECT LETTER */

function select(letter,btn){

if(answered[index]) return;

userAnswers[index]+=letter;

blank.innerText=userAnswers[index];

btn.disabled=true;

/* STORE BUTTON FOR BACKSPACE */

selectedButtons.push(btn);

let correctAnswer=quiz[index].a.replace(/\s/g,"").toLowerCase();

/* CHECK AFTER ALL LETTERS */

if(userAnswers[index].length===correctAnswer.length){

if(userAnswers[index].toLowerCase()===correctAnswer){

answered[index]=true;
score++;

showPopup(true);
speak("Correct");
backspaceBtn.disabled = true;
confetti({
particleCount:80,
spread:70,
origin:{y:0.6}
});

next.disabled=false;

/* IF LAST QUESTION SHOW FINAL POPUP */

if(index === quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";

/* BIG CONFETTI CELEBRATION */

confetti({
particleCount:300,
spread:180,
origin:{y:0.5}
});

},1200);
prev.disabled = true;
}



}else{

showPopup(false);
speak("Wrong");

/* CLEAR WRONG ANSWER */

setTimeout(()=>{

userAnswers[index]="";
blank.innerText="";

/* ENABLE ALL LETTER BUTTONS AGAIN */

const buttons = letters.querySelectorAll(".letter");

buttons.forEach(btn=>{
btn.disabled=false;
});

/* RESET SELECTED BUTTONS */

selectedButtons=[];

},800);

}

}

}

backspaceBtn.onclick = () => {

/* STOP BACKSPACE IF ANSWER IS ALREADY CORRECT */

if(answered[index]) return;

if(userAnswers[index].length===0) return;

/* REMOVE LAST LETTER */

userAnswers[index] = userAnswers[index].slice(0,-1);

blank.innerText=userAnswers[index];

/* ENABLE LAST BUTTON AGAIN */

let lastBtn = selectedButtons.pop();

if(lastBtn){
lastBtn.disabled=false;
}

};

/* POPUP */

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
}else{
icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
}

setTimeout(()=>{
popup.style.display="none";
},1200);

}

/* NAVIGATION */

next.onclick=()=>{

if(index<quiz.length-1){

index++;
load();

}

}

prev.onclick=()=>{

if(index>0){

index--;
load();

}

}

load();