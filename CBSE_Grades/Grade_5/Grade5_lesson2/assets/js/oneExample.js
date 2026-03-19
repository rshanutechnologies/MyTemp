
const quiz=[

{
q:"1. What are the two main parts of the embryo?",
options:[
{text:"Plumule and Radicle",img:"../assets/images/opt_1.png"},
{text:"Petal and Sepal",img:"../assets/images/opt_2.png"}
],
answer:0,
img:"https://cdn-icons-png.flaticon.com/512/628/628324.png"
},

{
q:"2. Name the agents of dispersal of seeds.",
options:[
{text:"Sun and Soil",img:"../assets/images/opt_4.png"},
{text:"Wind Water Animals",img:"../assets/images/opt_3.png"}
],
answer:1,
img:"https://cdn-icons-png.flaticon.com/512/869/869869.png"
},

{
q:"3. Why does a coconut fruit float on water?",
options:[
{text:"Fibrous husk traps air",img:"../assets/images/opt_5.png"},
{text:"Because it is heavy",img:"../assets/images/opt_6.png"}
],
answer:0,
img:"https://cdn-icons-png.flaticon.com/512/135/135620.png"
},

{
q:"4. How are cotyledons important?",
options:[
{text:"They make flowers",img:"../assets/images/opt_8.png"},
{text:"They store food",img:"../assets/images/opt_7.png"}
],
answer:1,
img:"https://cdn-icons-png.flaticon.com/512/628/628324.png"
},

{
q:"5. How do animals help in dispersal?",
options:[
{text:"By carrying seeds",img:"../assets/images/opt_9.png"},
{text:"By eating leaves",img:"../assets/images/opt_10.png"}
],
answer:0,
img:"https://cdn-icons-png.flaticon.com/512/616/616408.png"
}

];

let index=0;
let score=0;
let answered=[false,false,false,false,false];

const question=document.getElementById("question");
const optionsDiv=document.getElementById("options");

const prev=document.getElementById("prev");
const next=document.getElementById("next");
let wrongSelected = [null,null,null,null,null];

function speak(text){

speechSynthesis.cancel();

const msg = new SpeechSynthesisUtterance(text);

msg.lang = "en-UK";
msg.volume = 0.25;
msg.rate = 1;
msg.pitch = 1;

speechSynthesis.speak(msg);

}
function load(){

question.innerText = quiz[index].q;
document.getElementById("questionImage").src = quiz[index].img;

optionsDiv.innerHTML = "";

quiz[index].options.forEach((o,i)=>{

let btn = document.createElement("button");

btn.className="option";

btn.innerHTML=`
<img src="${o.img}" class="opt-img">
<span>${o.text}</span>
`;

/* if correct answered earlier */
if(answered[index] && i === quiz[index].answer){
btn.classList.add("correctAnswer");
}

/* disable wrong option */
if(wrongSelected[index] === i){
btn.disabled = true;
}

/* prevent answering again when coming back */
if(answered[index] || wrongSelected[index] !== null){

btn.disabled = true;

}else{

btn.onclick = ()=>check(i);

}

optionsDiv.appendChild(btn);

});
prev.disabled = index === 0;
next.disabled = !answered[index];

}

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}
function showPopup(correct){

const popup=document.getElementById("answerPopup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+(correct?"correct":"wrong");
popup.style.display="flex";

if(correct){
  launchConfetti(); 
icon.textContent="🥳";
title.textContent="Correct!";
msg.textContent="Well done!";
}else{
icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
}

setTimeout(()=>popup.style.display="none",1200);

}

function check(i){

const buttons = document.querySelectorAll(".option");

if(i === quiz[index].answer){

showPopup(true);
speak("Correct");

answered[index] = true;
score++;

buttons[i].classList.add("correctAnswer");

/* disable all buttons after correct */
buttons.forEach(btn => btn.disabled = true);

/* allow next only after correct */
next.disabled = false;

if(index === quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/"+quiz.length;
launchConfetti(); 
prev.disabled = true;

},1200);

}

}else{

showPopup(false);
speak("Wrong");

/* user can try again */
buttons[i].classList.add("wrongAnswer");

/* optional: disable that wrong option only */
buttons[i].disabled = true;

}

}

next.onclick=()=>{

if(index<quiz.length-1){

index++;
load();

}

}

prev.onclick=()=>{

index--;
load();

}

function playAgain(){
location.reload();
}

load();
