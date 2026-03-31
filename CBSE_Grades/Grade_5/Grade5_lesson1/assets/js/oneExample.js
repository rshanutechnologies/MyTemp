
const quiz=[

{
q:"1. What is reproduction?",
options:["Producing new organisms","Reproducion","Reprodution"],
answer:0,
img:"../assets/images/reproductiveak.png"
},

{
q:"2. What are pollen grains?",
options:["Male reproductive cells","Polen grains","Pollan grains"],
answer:0,
img:"../assets/images/Pollengrains.png"
},

{
q:"3. What is pollination?",
options:["Transfer of pollen from anther to stigma","Pollinashun","Polination"],
answer:0,
img:"../assets/images/pollinating.png"
},

{
q:"4. Which part of a flower develops into a fruit?",
options:["Ovary","Ovaryy","Ovarie"],
answer:0,
img:"../assets/images/ovaryak1.png"
},

{
q:"5. Define grafting.",
options:["Joining parts of two plants","Grafthing","Graffting"],
answer:0,
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