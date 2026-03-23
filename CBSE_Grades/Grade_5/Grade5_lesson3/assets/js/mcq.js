const quiz=[

{
q:"1. ________ is the feeding stage in the life cycle of a butterfly.",
options:[
{text:"Egg",img:"../assets/images/Eggak.png"},
{text:"Caterpillar",img:"../assets/images/Caterpillar.png"},
{text:"Pupa",img:"../assets/images/pupa.png"},
{text:"Adult butterfly",img:"../assets/images/Butterflyak.png"}
],
answer:1,
img:"../assets/images/MCQ_1.png"
},

{
q:"2. The sequential development of an animal from the embryo to the adult stage is called its ________.",
options:[
{text:"Life span",img:"../assets/images/lifespan1.png"},
{text:"Life cycle",img:"../assets/images/lifecycle.png"},
{text:"Reproduction",img:"../assets/images/reproduction.png"},
{text:"Cocoon",img:"../assets/images/cocoon.png"}
],
answer:1,
img:"../assets/images/MCQ_2.png"
},

{
q:"3. ________ is a terrestrial mammal.",
options:[
{text:"Monkey",img:"../assets/images/monkey.png"},
{text:"Bat",img:"../assets/images/bat.png"},
{text:"Whale",img:"../assets/images/whale.png"},
{text:"Cow",img:"../assets/images/Cow.png"}
],
answer:3,
img:"../assets/images/MCQ_3.png"
},

{
q:"4. Find the odd one from the following.",
options:[
{text:"Kangaroo",img:"../assets/images/kangaroo.png"},
{text:"Rabbit",img:"../assets/images/Rabbitt.png"},
{text:"Koala",img:"../assets/images/koala.png"},
{text:"Turtle",img:"../assets/images/Turtle.png"}
],
answer:3,
img:"../assets/images/MCQ_4.png"
},

{
q:"5. A living organism that does not incubate its eggs is a ________.",
options:[
{text:"Sparrow",img:"../assets/images/sparrow.png"},
{text:"Eagle",img:"../assets/images/Eagle.png"},
{text:"Pigeon",img:"../assets/images/pigeon.png"},
{text:"Butterfly",img:"../assets/images/Butterflyak.png"}
],
answer:3,
img:"../assets/images/MCQ_5.png"
}

];

let index=0;
let score=0;
let answered=[false,false,false,false,false];

const question=document.getElementById("question");
const options=document.getElementById("options");

const prev=document.getElementById("prev");
const next=document.getElementById("next");



function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function load(){

question.innerText=quiz[index].q;
document.getElementById("questionImage").src = quiz[index].img;
options.innerHTML="";

quiz[index].options.forEach((o,i)=>{

let btn=document.createElement("button");

btn.className="option "+["blue","yellow","green","orange"][i];

btn.innerHTML = `
<img src="${o.img}" class="opt-img">
<span>${o.text}</span>
`;

btn.onclick=()=>check(i);

if(answered[index] && i===quiz[index].answer){
btn.classList.add("correctAnswer");
}

options.appendChild(btn);

});

prev.disabled=index===0;
next.disabled=!answered[index];

}

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

function check(i){

if(answered[index]) return;

if(i===quiz[index].answer){

showPopup(true);
speak("Correct");

/* SMALL CONFETTI */

confetti({
particleCount:80,
spread:70,
origin:{y:0.6}
});

answered[index]=true;
score++;

next.disabled=false;

/* IF LAST QUESTION → SHOW FINAL POPUP */

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";

/* BIG CELEBRATION CONFETTI */

confetti({
particleCount:300,
spread:180,
origin:{y:0.5}
});

},1000);
prev.disabled = true;
}else{

load();

}

}
else{

showPopup(false);
speak("Wrong");

}

}

next.onclick=()=>{

if(index<quiz.length-1){

index++;
load();

}
else{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
prev.disabled = true;
}

}

prev.onclick=()=>{
index--;
load();
}

load();

function playAgain(){
location.reload();
}