const quiz=[

{
q:"The natural home of a living organism is called its ______.",
answer:"HABITAT",
letters:["H","A","B","I","T","A","T","O","L","M"],
img:"../assets/images/FIB-1.png"
},

{
q:"Plants that grow on land are called ______ plants.",
answer:"TERRESTRIAL",
letters:["T","E","R","R","E","S","T","R","I","A","L","O","P"],
img:"../assets/images/FIB-2.png"
},

{
q:"Plants that grow in water are called ______ plants.",
answer:"AQUATIC",
letters:["A","Q","U","A","T","I","C","L","M","N"],
img:"../assets/images/FIB-3.png"
},

{
q:"______ trees do not shed their leaves throughout the year.",
answer:"EVERGREEN",
letters:["E","V","E","R","G","R","E","E","N","T","S","A"],
img:"../assets/images/FIB-4.png"
},

{
q:"The leaves of submerged plants do not have ______.",
answer:"STOMATA",
letters:["S","T","O","M","A","T","A","L","R","P"],
img:"../assets/images/FIB-5.png"
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

function speak(text){

if(!window.speechSynthesis) return;

const msg = new SpeechSynthesisUtterance(text);

msg.lang = "en-US"; // better support
msg.volume = 1;
msg.rate = 1;
msg.pitch = 1;

// 🔥 important fix
speechSynthesis.cancel();

setTimeout(()=>{
    speechSynthesis.speak(msg);
}, 100);

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
tile.onclick=function(){
    addLetter(tile);
    speak("Selected " + tile.innerText);
};

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

// ✅ FIX: delay speech
setTimeout(()=>{
    speak("Correct");
},100);

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

// ✅ FIX: delay speech
setTimeout(()=>{
    speak("Wrong");
},100);

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