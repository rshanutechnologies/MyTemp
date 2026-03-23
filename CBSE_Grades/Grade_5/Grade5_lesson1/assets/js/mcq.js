const quiz=[

{
q:"1. The ovary contains one or more small egg-like structures called the___.",
options:[
{text:"stigma",img:"../assets/images/stigmaak.png"},
{text:"style",img:"../assets/images/MCQStyle.png"},
{text:"ovules",img:"../assets/images/ovulesap.png"},
{text:"ovary",img:"../assets/images/ovaryak.png"}
],
answer:2,
img:"../assets/images/MQ3.png"
},

{
q:"2. The style has a small disc-like structure at its tip called the _____ .",
options:[
{text:"anther",img:"../assets/images/Anther.png"},
{text:"stigma",img:"../assets/images/stigmaak.png"},
{text:"carpel",img:"../assets/images/carpelak.png"},
{text:"ovule",img:"../assets/images/ovulesak.png"}
],
answer:1,
img:"../assets/images/stigmaapp.png"
},

{
q:"3. The ______ is the female reproductive part of a flower.",
options:[
{text:"petal",img:"../assets/images/petalsak.png"},
{text:"pistil",img:"../assets/images/pistilak.png"},
{text:"sepal",img:"../assets/images/sepalsak.png"},
{text:"style",img:"../assets/images/MCQStyle.png"}
],
answer:1,
img:"../assets/images/pistilap.png"
},

{
q:"4. The green-coloured outermost leaf-like structures of a flower are called the _____.",
options:[
{text:"petal",img:"../assets/images/petals.png"},
{text:"sepals",img:"../assets/images/sepalsak.png"},
{text:"petals",img:"../assets/images/petalsak.png"},
{text:"ovules",img:"../assets/images/ovulesak.png"}
],
answer:1,
img:"../assets/images/sepalsak1.png"
},

{
q:"5. Each carpel contains three parts - ovary, style and",
options:[
{text:"petal",img:"../assets/images/petals.png"},
{text:"pistil",img:"../assets/images/pistilak.png"},
{text:"stigma",img:"../assets/images/stigmaak.png"},
{text:"sepal",img:"../assets/images/sepalsak.png"}
],
answer:2,
img:"../assets/images/stigmaak4.png"
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

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}

function showPopup(isCorrect){

const popup=document.getElementById("answerPopup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+(isCorrect?"correct":"wrong");
popup.style.display="flex";

if(isCorrect){
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

function check(i){

if(answered[index]) return;

if(i===quiz[index].answer){

showPopup(true);
speak("Correct");

answered[index]=true;
score++;

next.disabled=false;

/* IF LAST QUESTION → SHOW FINAL POPUP */

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti();
},1000);

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