
const quiz=[

{
q:"1. A potato plant reproduces through its stem.",
a:true,
img:"../assets/images/TFQQQ1.png"
},

{
q:"2. Roots are the main parts of the plant that carry out sexual reproduction.",
a:false,
img:"../assets/images/TFQQ2.png"
},

{
q:"3. The swollen bottom part of the carpel is stigma.",
a:false,
img:"../assets/images/stigmaak1.png"
},

{
q:"4. The pistil forms the second whorl of a flower.",
a:false,
img:"../assets/images/pistilak1.png"
},

{
q:"5. All flowers have both the male and the female parts.",
a:false,
img:"../assets/images/bisexualf.png"
}

];

let index=0;
let score=0;

let answered=[false,false,false,false,false];

const question=document.getElementById("question");

const prev=document.getElementById("prev");
const next=document.getElementById("next");

const trueBtn=document.getElementById("trueBtn");
const falseBtn=document.getElementById("falseBtn");

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
/* remove previous highlights */

trueBtn.classList.remove("correctAnswer");
falseBtn.classList.remove("correctAnswer");

trueBtn.querySelector(".icon").classList.remove("iconCorrect");
falseBtn.querySelector(".icon").classList.remove("iconCorrect");

/* restore highlight when user goes back */

if(answered[index]){

if(quiz[index].a){

trueBtn.classList.add("correctAnswer");
trueBtn.querySelector(".icon").classList.add("iconCorrect");

}else{

falseBtn.classList.add("correctAnswer");
falseBtn.querySelector(".icon").classList.add("iconCorrect");

}

}

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

popup.className="popup "+type;
popup.style.display="flex";

if(type==="correct"){
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

function check(value){

if(answered[index]) return;

if(value===quiz[index].a){

popup("correct");
speak("Correct");

answered[index]=true;
score++;

if(value){
trueBtn.classList.add("correctAnswer");
trueBtn.querySelector(".icon").classList.add("iconCorrect");
}else{
falseBtn.classList.add("correctAnswer");
falseBtn.querySelector(".icon").classList.add("iconCorrect");
}

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti(); 
prev.disabled = true;
next.disabled = true;
},1000);

}else{

next.disabled=false;

}

}else{

popup("wrong");
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

load();


function playAgain(){
location.reload();
}