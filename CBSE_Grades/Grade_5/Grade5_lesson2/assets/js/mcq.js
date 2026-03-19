const quiz=[

{
q:"1. In which of the following cases will the seeds germinate?",
options:[
{text:"Roasted seeds",img:"../assets/images/mcq1.png"},
{text:"Seeds in moist soil",img:"../assets/images/mcq32.png"},
{text:"Seeds submerged in water",img:"../assets/images/mcq3.png"},
{text:"Seeds kept in refrigerator",img:"../assets/images/mcq4.png"}
],
answer:1,
img:"../assets/images/mcq_1.png"
},

{
q:"2. Monocot : Bajra :: Dicot :",
options:[
{text:"Wheat",img:"../assets/images/mcq21.png"},
{text:"Maize",img:"../assets/images/mcq22.png"},
{text:"Groundnut",img:"../assets/images/mcq23.png"},
{text:"Rice",img:"../assets/images/mcq24.png"}
],
answer:2,
img:"../assets/images/mcq_2.png"
},

{
q:"3. Unscramble the letters and find out the one that is part of a seed.",
options:[
{text:"oncodltey",img:"../assets/images/mcq31.png"},
{text:"rmgeinoatin",img:"../assets/images/mcq32.png"},
{text:"oplungghi",img:"../assets/images/mcq33.png"},
{text:"deirsapsl",img:"../assets/images/mcq34.png"}
],
answer:0,
img:"../assets/images/mcq_3.png"
},

{
q:"4.  Study the given relationship based on dispersal of seeds in plants. Select the option which correctly satisfies the same relationship.",
options:[
{text:"Peas : Lady’s finger : Lentils",img:"../assets/images/mcq41.png"},
{text:"Green gram : Lotus : Dandelion",img:"../assets/images/mcq42.png"},
{text:"Calotropis : Water lily : Burdock",img:"../assets/images/mcq43.png"},
{text:"Tiger’s claw : Xanthium : Milkweed",img:"../assets/images/mcq44.png"}
],
answer:3,
img:"../assets/images/mcq_4.png"
},

{
q:"5. Which feature enables dispersal of seeds by water?",
options:[
{text:"Small size,light weight and hair-like structures",img:"../assets/images/mcq51.png"},
{text:"Air-trapped fibres",img:"../assets/images/mcq52.png"},
{text:"Waterproof coverings",img:"../assets/images/mcq53.png"},
{text:"Both b and c",img:"../assets/images/mcq54.png"}
],
answer:3,
img:"../assets/images/mcq_5.png"
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