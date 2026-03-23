const quiz = [

{
q:"Cacti are _________________",
options:[
{text:"Mangroves",img:"../assets/images/option1-1.png"},
{text:"Desert plants",img:"../assets/images/option1-2.png"},
{text:"Conifers",img:"../assets/images/option1-3.png"},
{text:"Aquatic plants",img:"../assets/images/option1-4.png"}
],
answer:1,
img:"../assets/images/mcq-1.png"
},

{
q:"Coniferous trees have dark leaves to absorb more ____________",
options:[
{text:"Rain",img:"../assets/images/option2-1.png"},
{text:"Water",img:"../assets/images/option2-2.png"},
{text:"Air",img:"  ../assets/images/option2-3.png"},
{text:"Sunlight",img:"../assets/images/option2-41.png"}
],
answer:3,
img:"../assets/images/mcq-2.png"
},

{
q:"The roots of _____________ grow above the soil",
options:[
{text:"Coconut",img:"../assets/images/option3-1.png"},
{text:"Cactus",img:"../assets/images/option3-2.png"},
{text:"Rhizophora",img:"../assets/images/option3-3.png"},
{text:"Palm",img:"../assets/images/option3-4.png"}
],
answer:2,
img:"../assets/images/mcq-3.png"
},

{
q:"The stomata are on the upper surface of the leaves of _____________",
options:[
{text:"Mango",img:"../assets/images/option4-1.png"},
{text:"Cherry",img:"../assets/images/option4-2.png"},
{text:"Water lily",img:"../assets/images/option4-3.png"},
{text:"Tea",img:"../assets/images/option4-4.png"}
],
answer:2,
img:"../assets/images/mcq-4.png"
},

{
q:"________________ take in carbon dioxide released by aquatic animals",
options:[
{text:"Floating plants",img:"../assets/images/option5-1.png"},
{text:"Fixed plants",img:"../assets/images/option5-2.png"},
{text:"Desert plants",img:"../assets/images/option1-2.png"},
{text:"Submerged plants",img:"../assets/images/option5-4.png"}
],
answer:3,
img:"../assets/images/mcq-5.png"
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
icon.textContent="🥳";
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
prev.disabled = true;  
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