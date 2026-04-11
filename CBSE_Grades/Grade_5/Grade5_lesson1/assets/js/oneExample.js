
const quiz=[

{
q:"1. What is reproduction?",
options:[
"The process by which living things produce young ones of their own kind is called reproduction.",
"The process by which plants make their food using sunlight, water and air is called reproduction."
],
answer:0,
img:"../assets/images/reproductiveak.png"
},

{
q:"2. What are pollen grains?",
options:[
"Pollen grains are green leaf-like parts of a flower that protect the bud before it blooms.",
"Anther produces fine powdery particles called pollen grains that contain the male reproductive cells."
],
answer:1,
img:"../assets/images/Pollengrains.png"
},

{
q:"3. What is pollination?",
options:[
"The transfer of the pollen grains from the anther to the stigma of the same flower or another flower of the same kind is called pollination.",
"The process in which the ovary changes into a fruit after fertilization is called pollination."
],
answer:0,
img:"../assets/images/pollinating.png"
},

{
q:"4. Which part of a flower develops into a fruit?",
options:[
"The ovary develops into fruit.",
"The petals of a flower grow bigger and develop into a fruit after fertilization."
],
answer:0,
img:"../assets/images/ovaryak1.png"
},

{
q:"5. Why is flower important?",
options:[
"Flower is important because it absorbs water from the soil and transports it to all parts of the plant.",
"Flower is important because it is the reproductive part of the plant."
],
answer:1,
img:"../assets/images/grafting.png"
}

];

let index=0;
let score=0;
let answered=[false,false,false,false,false];
let selectedAnswer=[null,null,null,null,null];

const question=document.getElementById("question");
const optionsDiv=document.getElementById("options");

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

optionsDiv.innerHTML="";

quiz[index].options.forEach((o,i)=>{

let btn=document.createElement("button");

btn.className="option "+["blue","green","yellow"][i];

btn.innerHTML=o;

if(answered[index] && i===selectedAnswer[index]){
btn.classList.add("correct");
btn.innerHTML="✔ "+o;
}

btn.onclick=()=>check(i,btn);

optionsDiv.appendChild(btn);

});

prev.disabled=index===0;
next.disabled=!answered[index];

}
function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}

function popup(type){

const popup=document.getElementById("popup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+(type==="correctPopup"?"correct":"wrong");
popup.style.display="flex";

if(type==="correctPopup"){
  launchConfetti(); 
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

function check(i,btn){

if(answered[index])return;

if(i===quiz[index].answer){

btn.innerHTML="✔ "+btn.innerHTML;

btn.classList.add("correct");

popup("correctPopup");

speak("Correct");

answered[index]=true;
selectedAnswer[index]=i;
score++;

next.disabled=false;

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti(); 
prev.disabled = true;
next.disabled = true;
},1000);

}

}else{

popup("wrongPopup");
speak("Wrong");

}

}

next.onclick=()=>{

index++;
load();

}

prev.onclick=()=>{

index--;
load();

}

function playAgain(){
location.reload();
}

load();