const quiz=[

{
q:"Q1. The process of shedding the skin several times before an animal grows into an adult is called hatching.",
a:false,
img:"../assets/images/moulting.png"
},

{
q:"Q2. A floating clump of frog eggs is called a spawn.",
a:true,
img:"../assets/images/spawn.png"
},

{
q:"Q3. The larva of a butterfly is called pupa.",
a:false,
img:"../assets/images/butterfly_larva.png"
},

{
q:"Q4. Mammals protect their young ones until they are old enough to take care of themselves.",
a:true,
img:"../assets/images/mammals_care.png"
},

{
q:"Q5. The female frog lays eggs on land.",
a:false,
img:"../assets/images/frog_eggs.png"
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

question.innerText = quiz[index].q;
document.getElementById("questionImage").src = quiz[index].img;

// Enable both buttons initially
trueBtn.disabled = false;
falseBtn.disabled = false;

trueBtn.classList.remove("correctAnswer");
falseBtn.classList.remove("correctAnswer");

if(answered[index]){

    if(quiz[index].a){

        trueBtn.classList.add("correctAnswer");
        falseBtn.disabled = true;

    }else{

        falseBtn.classList.add("correctAnswer");
        trueBtn.disabled = true;

    }

}

prev.disabled = index===0;
next.disabled = !answered[index];

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
icon.textContent="🥳";
title.textContent="Correct!";
msg.textContent="Well done!";
}else{
icon.textContent="😒";
title.textContent="Wrong!";
msg.textContent="Try again!";
}

setTimeout(()=>{
popup.style.display="none";
},1200);

}

function check(value){

if(answered[index]) return;

if(value === quiz[index].a){

popup("correct");
speak("Correct");

answered[index] = true;
score++;

if(value){
    trueBtn.classList.add("correctAnswer");

    // disable wrong option
    falseBtn.disabled = true;

}else{
    falseBtn.classList.add("correctAnswer");

    // disable wrong option
    trueBtn.disabled = true;
}

next.disabled = false;

if(index === quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti();
prev.disabled = true;

},1000);

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