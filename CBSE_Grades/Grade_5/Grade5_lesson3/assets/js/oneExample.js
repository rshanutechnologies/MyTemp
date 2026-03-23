
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
const dropZone=document.getElementById("dropZone");

const prev=document.getElementById("prev");
const next=document.getElementById("next");

function load(){

question.innerText=quiz[index].q;

document.getElementById("questionImage").src=quiz[index].img;

optionsDiv.innerHTML="";
dropZone.innerHTML='<span class="placeholder">Drop here</span>';

quiz[index].options.forEach((o,i)=>{

let div=document.createElement("div");

div.className="drag-item";
div.innerHTML=`<img src="${o.img}">${o.text}`;

div.draggable=true;
div.dataset.index=i;

div.addEventListener("dragstart",()=>div.classList.add("dragging"));
div.addEventListener("dragend",()=>div.classList.remove("dragging"));

optionsDiv.appendChild(div);

});

if(answered[index]){
dropZone.innerHTML="✔ "+quiz[index].options[selectedAnswer[index]].text;
}

prev.disabled=index===0;
next.disabled=!answered[index];

}

/* allow drop */

dropZone.addEventListener("dragover",(e)=>{
e.preventDefault();
});

/* drop */

dropZone.addEventListener("drop",(e)=>{

e.preventDefault();

const dragged=document.querySelector(".dragging");

if(!dragged) return;

const selected=parseInt(dragged.dataset.index);

check(selected);

});

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
}
else{
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

dropZone.innerHTML="✔ "+quiz[index].options[i].text;

popup("correct");

confetti({
particleCount:80,
spread:70,
origin:{y:0.6}
});

answered[index]=true;
selectedAnswer[index]=i;

score++;

next.disabled=false;

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/"+quiz.length;

confetti({
particleCount:300,
spread:180
});

},1000);
prev.disabled = true;

}

}else{

popup("wrong");

}

}

next.onclick=()=>{

if(index < quiz.length-1){
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