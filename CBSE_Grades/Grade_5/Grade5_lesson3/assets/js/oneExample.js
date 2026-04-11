const quiz=[

{
q:"Q.1 What is a pullet?",
options:[
{text:"A young hen",img:"../assets/images/hen-small.png"},
{text:"A baby frog",img:"../assets/images/frog-small.png"}
],
answer:0,
img:"../assets/images/hen1.png"
},

{
q:"Q.2 How is albumen useful to the baby bird?",
options:[
{text:"It provides food and protection",img:"../assets/images/egg-small.png"},
{text:"It helps the bird fly",img:"../assets/images/bird-small.png"}
],
answer:0,
img:"../assets/images/egg1.png"
},

{
q:"Q.3 What is a cocoon?",
options:[
{text:"A protective covering around the pupa",img:"../assets/images/cocoon-small.png"},
{text:"A bird nest",img:"../assets/images/nest-small.png"}
],
answer:0,
img:"../assets/images/cocoon1.png"
},

{
q:"Q.4 What is a frog spawn?",
options:[
{text:"A cluster of frog eggs",img:"../assets/images/spawn.png"},
{text:"A baby frog",img:"../assets/images/frog-small.png"}
],
answer:0,
img:"../assets/images/frog_eggs.png"
},

{
q:"Q.5 What are the four stages in the life cycle of a butterfly?",
options:[
{text:"Egg → Larva → Pupa → Adult",img:"../assets/images/butterfly-life.png"},
{text:"Egg → Chick → Bird → Adult",img:"../assets/images/bird-life.png"}
],
answer:0,
img:"../assets/images/Butterflyak.png"
}

];

let index=0;
let score=0;

let answered = Array(quiz.length).fill(false);
let selectedAnswer = Array(quiz.length).fill(null);

const question=document.getElementById("question");
const optionsDiv=document.getElementById("options");

const prev=document.getElementById("prev");
const next=document.getElementById("next");


function speak(t){
speechSynthesis.cancel();
const msg=new SpeechSynthesisUtterance(t);
msg.lang="en-UK";
msg.volume=0.25;
speechSynthesis.speak(msg);
}


function load(){

question.innerText=quiz[index].q;
document.getElementById("questionImage").src=quiz[index].img;

optionsDiv.innerHTML="";

quiz[index].options.forEach((o,i)=>{

let div=document.createElement("div");
div.className="option";

div.innerHTML=`
<img src="${o.img}" class="opt-img">
<span>${o.text}</span>
`;

div.onclick=()=>check(i);

optionsDiv.appendChild(div);

});

if(answered[index]){
optionsDiv.children[selectedAnswer[index]]
.classList.add("correctAnswer");
}

prev.disabled=index===0;
next.disabled=!answered[index];

}


function popup(type){

const popup=document.getElementById("popup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+type;
popup.style.display="flex";

if(type==="correct"){
icon.textContent="🎉";
title.textContent="Correct!";
msg.textContent="Well done!";
speak("Correct");
}
else{
icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
speak("Wrong answer");
}

setTimeout(()=>{
popup.style.display="none";
},1200);

}


function check(i){

if(answered[index]) return;

const all=document.querySelectorAll(".option");

if(i===quiz[index].answer){

answered[index]=true;            // ✅ only when correct
selectedAnswer[index]=i;

all[i].classList.add("correctAnswer");

popup("correct");

confetti({
particleCount:80,
spread:70,
origin:{y:0.6}
});

score++;
next.disabled=false;             // ✅ allow next only correct

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText=
"Your Score "+score+"/"+quiz.length;

confetti({
particleCount:300,
spread:180
});

},1000);

prev.disabled=true;
}

}else{

all[i].style.outline="4px solid #e74c3c";
popup("wrong");

// ❌ do NOT enable next
next.disabled=true;

}

}

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