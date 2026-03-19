const quiz=[

{
q:"1. Air provides ______ required for the baby plant to obtain energy.",
answer:"OXYGEN",
letters:["O","X","Y","G","E","N","A","S","M","T"],
img:"../assets/images/F1.png"
},

{
q:"2. Seeds containing only one seed leaf or cotyledon are called ______.",
answer:"MONOCOT",
letters:["M","O","N","O","C","O","T","A","B"],
img:"../assets/images/F2.png"
},

{
q:"3. The ______ is an outer covering of the seed.",
answer:"SEEDCOAT",
letters:["S","E","E","D","C","O","A","T","L"],
img:"../assets/images/F3.png"
},

{
q:"4. The seeds of Balsam are dispersed by ______.",
answer:"EXPLOSION",
letters:["E","X","P","L","O","S","I","O","N","A"],
img:"../assets/images/F4.png"
},

{
q:"5. The seeds of Xanthium are dispersed by ______.",
answer:"ANIMALS",
letters:["A","N","I","M","A","L","S","O","T"],
img:"../assets/images/F5.png"
}

];

let index=0;
let score=0;

let answered=[false,false,false,false,false];

const blanks=document.getElementById("blanks");
const letters=document.getElementById("letters");
const question=document.getElementById("question");
const img=document.getElementById("questionImage");
let savedAnswers=["","","","",""];
const prev=document.getElementById("prev");
const next=document.getElementById("next");

let usedTiles=[];


/* TEXT SPEECH */

function speak(t){

speechSynthesis.cancel();

const msg=new SpeechSynthesisUtterance(t);

msg.lang="en-UK";
msg.volume=0.3;
msg.rate=1;

speechSynthesis.speak(msg);

}


/* LOAD QUESTION */

function load(){

question.innerText=quiz[index].q;

img.src=quiz[index].img;

// speak(quiz[index].q);

blanks.innerHTML="";
letters.innerHTML="";
usedTiles=[];

/* create blanks */

for(let i=0;i<quiz[index].answer.length;i++){

let box=document.createElement("div");

box.className="blank";

if(savedAnswers[index][i]){
box.innerText=savedAnswers[index][i];
}

blanks.appendChild(box);

}

/* shuffle letters */

let shuffled=shuffle([...quiz[index].letters]);

shuffled.forEach(l=>{

let tile=document.createElement("div");

tile.className="letter";

tile.innerText=l;

/* disable used letters */

if(savedAnswers[index].includes(l)){
tile.classList.add("used");
}

tile.onclick=function(){
addLetter(tile);
};

letters.appendChild(tile);

});

prev.disabled=index===0;
next.disabled=!answered[index];

}

/* ADD LETTER */
function addLetter(tile){

let boxes=document.querySelectorAll(".blank");

for(let i=0;i<boxes.length;i++){

if(boxes[i].innerText===""){

boxes[i].innerText=tile.innerText;

tile.classList.add("used");

usedTiles.push(tile);

/* save answer */

savedAnswers[index]=getWord();

break;

}

}

checkWord();

}


/* BACKSPACE REMOVE */

document.addEventListener("keydown",function(e){

if(e.key==="Backspace"){

let boxes=document.querySelectorAll(".blank");

for(let i=boxes.length-1;i>=0;i--){

if(boxes[i].innerText!==""){

boxes[i].innerText="";

let tile=usedTiles.pop();

if(tile) tile.classList.remove("used");

break;

}

}

}

});


/* BUILD WORD */

function getWord(){

let word="";

document.querySelectorAll(".blank").forEach(b=>{
word+=b.innerText;
});

return word;

}


/* CHECK ANSWER */

function checkWord(){

let word=getWord();

if(word.length===quiz[index].answer.length){

if(word===quiz[index].answer){

showPopup(true);
speak("Correct");

score++;
answered[index]=true;

next.disabled=false;

/* LAST QUESTION FINAL POPUP */

if(index===quiz.length-1){

setTimeout(()=>{

document.getElementById("final").style.display="block";
document.getElementById("score").innerText="Your Score "+score+"/5";
prev.disabled = true;  

},1000);

}

}else{

showPopup(false);
speak("Wrong");
/* RESET LETTERS */

setTimeout(()=>{
resetLetters();
},800);

}

}

}

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}

/* POPUP */

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


/* NEXT */

next.onclick=function(){

if(index<quiz.length-1){

index++;

load();

}else{

document.getElementById("final").style.display="block";

document.getElementById("score").innerText="Your Score "+score+"/5";
launchConfetti(); 
}

}


/* PREV */

prev.onclick=function(){

index--;

load();

}


function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1));

[array[i],array[j]]=[array[j],array[i]];

}

return array;

}


function resetLetters(){

let boxes=document.querySelectorAll(".blank");
let tiles=document.querySelectorAll(".letter");

boxes.forEach(box=>{
box.innerText="";
});

tiles.forEach(tile=>{
tile.classList.remove("used");
});

usedTiles=[];
savedAnswers[index]="";

}


function playAgain(){

location.reload();

}

load();