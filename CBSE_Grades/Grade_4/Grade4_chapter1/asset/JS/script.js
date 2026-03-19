// Question Data
const questions = [
{
type:"mcq",
question:"The process by which a plant makes its own food in the presence of sunlight is called _____________________.",
image:"./asset/upload/MCQ-1.png",
options:[
{ text:"venation", icon:"./asset/uploads/venation.png" },
{ text:"photosynthesis", icon:"./asset/uploads/photosynthesis1.png" },
{ text:"respiration", icon:"./asset/uploads/respiration.png" },
{ text:"phyllotaxy", icon:"./asset/uploads/phyllotaxy.png" }
],
answer:"photosynthesis"
},
{
    type:"mcq",
    question:"Which of the following is the main source of energy?",
    image:"./asset/upload/MCQ-2.png",
    options:[
    { text:"Plants", icon:"./asset/uploads/plants.png" },
{ text:"Animals", icon:"./asset/uploads/animals.png" },
{ text:"Sunlight", icon:"./asset/uploads/sunlight1.png" },
{ text:"chlorophyll", icon:"./asset/uploads/chlorophyll.png" }
],
    answer:"Sunlight"
},

{
    type:"mcq",
    question:"Which of the following is the flat part of a leaf?",
    image:"./asset/upload/MCQ-3.png",
    options:[
     { text:"Lamina", icon:"./asset/uploads/respiration.png" },
{ text:"Apex", icon:"./asset/uploads/plants.png" },
{ text:"vein", icon:"./asset/uploads/vein.png" },
{ text:"chlorophyll", icon:"./asset/uploads/chlorophyll.png" }
],
    answer:"Lamina"
},
{
    type:"mcq",
    question:"In __________ venation, the veins run parallel to one another",
    image:"./asset/upload/MCQ-4.png",
    options:[
      { text:"Vertical", icon:"./asset/uploads/plants.png" },
{ text:"Linear", icon:"./asset/uploads/vein.png" },
{ text:"parallel", icon:"./asset/uploads/respiration.png" },
{ text:"Reticulate", icon:"./asset/uploads/chlorophyll.png" }
    ],
    answer:"Parallel"
},
{
    type:"mcq",
    question:"Which of the following has stored food in its stem?",
    image:"./asset/upload/MCQ-5.png",
    options:[
     { text:"Cauliflower", icon:"./asset/uploads/cauliflower.png" },
{ text:"Potato", icon:"./asset/uploads/potatoo.png" },
{ text:"Spinach", icon:"./asset/uploads/spinach.png" },
{ text:"Carrot", icon:"./asset/uploads/carrots.png" }
    ],
    answer:"Potato"
},
{
     type:"fib",
    question:"The gaseous exchange takes place with the help of _____________ in the leaves.",
    image:"./asset/upload/FIB-1.png",
    answer:"stomata"
},
{
     type:"fib",
    question:"The leaf stalk carries water from the stem to the leaf through a vein called the _______________.",
    image:"./asset/upload/FIB-2.png",
    answer:"midrib"
},
{
     type:"fib",
    question:"________________ venation is found in many plants that have taproot system.",
    image:"./asset/upload/FIB-3.png",
    answer:"Reticulate"
},
{
     type:"fib",
    question:"Sunlight is trapped by the _______________ present in the leaves",
    image:"./asset/upload/FIB-4.png",
    answer:"chlorophyll"
},
{
     type:"fib",
    question:"The parasitic plants that completely depend on their host for nutrition are called __________________",
    image:"./asset/upload/FIB-5.png",
    answer:"holoparasites"
},
{
    type:"tf",
    question: "Plants move around in search of food",
    image:"./asset/upload/TF-1.png",
    answer:"False"
},
{
  type:"tf",
    question: "Stomata help in trapping the sunlight",
    image:"./asset/upload/TF-2.png",
    answer:"False"
},
{
    type:"tf",
    question: "The pitcher plant obtains all the required nutrients from insects",
    image:"./asset/upload/TF-3.png",
    answer: "False" 
},
{
    type:"tf",
    question: "The stem makes food for the plant.",
    image:"./asset/upload/TF-4.png",
    answer:  "False"  
},
{
     type:"tf",
    question: "The transport of water, minerals and food takes place through the 18 network of veins and the stem",
    image:"./asset/upload/TF-5.png",
    answer:  "True"   
}

];

let filteredQuestions = [];
let currentType = "mcq";


// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];
let fibAnswers = [];


// DOM Elements
const questionText = document.getElementById("question-text");
const questionImg = document.getElementById("question-img");
const answerArea = document.getElementById("answer-area");
const popup = document.getElementById("feedback-popup");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");


// Load Questions
function loadQuestions(type){

    currentType = type;

    filteredQuestions = questions.filter(q => q.type === type);

    currentQuestionIndex = 0;
    score = 0;

    answeredQuestions = new Array(filteredQuestions.length).fill(false);
    fibAnswers = new Array(filteredQuestions.length).fill(null);

    renderQuestion();
}


// Tabs
const tabs = document.querySelectorAll(".navbar-tabs button");

tabs.forEach(tab=>{
    tab.addEventListener("click",()=>{

        /* remove active from all */
        tabs.forEach(t => t.classList.remove("active"));

        /* add active to clicked */
        tab.classList.add("active");

        /* close final popup if open */
        const finalPopup = document.getElementById("finalPopup");
        if(finalPopup){
            finalPopup.style.display = "none";
        }

        /* load section */
        const type = tab.dataset.type;
        loadQuestions(type);
    });
});

// Restart
document.getElementById("restart-btn").addEventListener("click",()=>{
location.reload();
});
/* ================= CONFETTI ================= */

function fireConfetti(){
confetti({
particleCount:40,
spread:80,
origin:{y:0.6}
});
}

function fireConfettif(){
confetti({
particleCount:120,
spread:120,
origin:{y:0.6}
});
}


// Popup
function showPopup(message,type){

const popup = document.getElementById("feedback-popup");
const icon = document.getElementById("popup-icon");
const title = document.getElementById("popup-title");
const text = document.getElementById("popup-message");

popup.classList.remove("correct","wrong");
popup.classList.add(type);

if(type === "correct"){
icon.textContent = "🎉";
title.textContent = "Great Job!";
text.innerHTML = message;
}else{
icon.textContent = "❌";
title.textContent = "Oops!";
text.innerHTML = message;
}

popup.style.display = "flex";

setTimeout(()=>{
popup.style.display = "none";
},1200);

}


// Speech
function speak(text){

const speech = new SpeechSynthesisUtterance(text);

speech.lang = "en-UK";
speech.rate = 1;
speech.pitch = 1;

speechSynthesis.cancel();
speechSynthesis.speak(speech);

}


// Render Question
function renderQuestion(){

/* handle empty sections */
if(filteredQuestions.length === 0){
questionText.textContent = "No questions available.";
questionImg.src = "";
answerArea.innerHTML = "";
answerArea.classList.remove("mcq-layout","tf-layout","fib-layout");
document.body.classList.toggle("first-question", currentQuestionIndex === 0 && !answeredQuestions[currentQuestionIndex]);

if(currentQuestion.type === "mcq") answerArea.classList.add("mcq-layout");
if(currentQuestion.type === "tf") answerArea.classList.add("tf-layout");
if(currentQuestion.type === "fib") answerArea.classList.add("fib-layout");
nextBtn.disabled = true;
if(currentQuestionIndex === 0 && !answeredQuestions[currentQuestionIndex]){
    prevBtn.disabled = true;
}else{
    prevBtn.disabled = false;
}
return;
}

const currentQuestion = filteredQuestions[currentQuestionIndex];
const navContainer = document.querySelector(".navigation-buttons");

/* apply mcq specific navigation layout */
if(currentQuestion.type === "mcq"){
    navContainer.classList.add("mcq-nav");
}else{
    navContainer.classList.remove("mcq-nav");
}

questionText.textContent =
"Q" +(currentQuestionIndex + 1) + ". " + currentQuestion.question;

questionImg.src = currentQuestion.image;

answerArea.innerHTML = "";

/* apply layout class */
answerArea.classList.remove("mcq-layout","tf-layout","fib-layout");
answerArea.classList.add(currentQuestion.type + "-layout");

/* navigation state */

if(currentQuestionIndex === 0){

    /* first question */
    prevBtn.disabled = true;

    /* next disabled until answered */
    if(answeredQuestions[currentQuestionIndex]){
        nextBtn.disabled = false;
    }else{
        nextBtn.disabled = true;
    }

}else{

    /* other questions */
    prevBtn.disabled = false;
    nextBtn.disabled = true;

}

/* ================= MCQ ================= */

if(currentQuestion.type === "mcq"){

const alphabets = ["A","B","C","D"];

currentQuestion.options.forEach((option,index)=>{

const optionBtn = document.createElement("button");
optionBtn.classList.add("option-btn","mcq-option","option-" + index);

/* support both text options and icon options */
let optionText = typeof option === "string" ? option : option.text;
let optionIcon = typeof option === "string" ? null : option.icon;

/* show icon + text if icon exists */
if(optionIcon){
optionBtn.innerHTML = `
<span>${alphabets[index]}) ${optionText}</span>
<img src="${optionIcon}" class="option-icon">
`;
}else{
optionBtn.textContent = alphabets[index] + ") " + optionText;
}

if(answeredQuestions[currentQuestionIndex]){

const correct = currentQuestion.answer.toLowerCase();

if(optionText.toLowerCase() === correct){
optionBtn.classList.add("correct-option");
}

optionBtn.disabled = true;
nextBtn.disabled = false;

}

optionBtn.addEventListener("click",()=>{

if(answeredQuestions[currentQuestionIndex]) return;

const selected = optionText.toLowerCase();
const correct = currentQuestion.answer.toLowerCase();

if(selected === correct){

speak("Correct answer!");

showPopup("You got it right!","correct");
fireConfetti();

answeredQuestions[currentQuestionIndex] = true;
score++;

document.querySelectorAll(".option-btn").forEach(btn=>{
btn.disabled = true;
});

optionBtn.classList.add("correct-option");

nextBtn.disabled = false;

if(currentQuestionIndex === filteredQuestions.length - 1){
setTimeout(showScorePopup,1200);
}

}else{

speak("Try again!");
showPopup("Try again!","wrong");

}

});

answerArea.appendChild(optionBtn);

});

}


/* ================= TRUE / FALSE ================= */

/* ================= TRUE / FALSE ================= */

else if(currentQuestion.type === "tf"){

const options = ["True","False"];

options.forEach((option,index)=>{

const btn = document.createElement("button");

btn.classList.add("option-btn");

if(option === "True"){
btn.classList.add("true-btn");
}else{
btn.classList.add("false-btn");
}

btn.textContent = option;
/* restore state when going back */
if(answeredQuestions[currentQuestionIndex]){

const correct = currentQuestion.answer.toLowerCase();

if(option.toLowerCase() === correct){
btn.classList.add("correct-option");
}

btn.disabled = true;
nextBtn.disabled = false;

}

btn.addEventListener("click",()=>{

if(answeredQuestions[currentQuestionIndex]) return;

const correct = currentQuestion.answer.toLowerCase();

if(option.toLowerCase() === correct){

speak("Correct answer!");
showPopup("You got it right!","correct");
fireConfetti();

btn.classList.add("correct-option");

answeredQuestions[currentQuestionIndex] = true;
score++;

}else{

speak("Try again!");
showPopup("Try again!","wrong");
return;

}

/* disable only TF buttons */
answerArea.querySelectorAll(".option-btn").forEach(b=>{
b.disabled = true;
});

nextBtn.disabled = false;

if(currentQuestionIndex === filteredQuestions.length - 1){
setTimeout(showScorePopup,1200);
}

});

answerArea.appendChild(btn);

});

}

/* ================= FIB ================= */

else if(currentQuestion.type === "fib"){

const correctAnswer = currentQuestion.answer.toLowerCase().trim();
const letters = correctAnswer.length;

const container = document.createElement("div");
container.classList.add("fib-container");

let inputs = [];

/* submit button */
const checkBtn = document.createElement("button");
checkBtn.textContent = "Submit";
checkBtn.classList.add("submit-btn");
checkBtn.disabled = true;

/* create input boxes */
for(let i=0;i<letters;i++){

const input = document.createElement("input");
input.maxLength = 1;
input.classList.add("fib-letter");

container.appendChild(input);
inputs.push(input);

/* typing behaviour */
input.addEventListener("input",()=>{

input.value = input.value.replace(/[^a-zA-Z]/g,"");

if(input.value.length === 1 && i < letters-1){
inputs[i+1].focus();
}

let filled = inputs.every(inp => inp.value !== "");
checkBtn.disabled = !filled;

});

/* backspace */
input.addEventListener("keydown",(e)=>{

if(e.key === "Backspace" && input.value === "" && i>0){
inputs[i-1].focus();
}

});

}

/* restore saved answer */
if(fibAnswers[currentQuestionIndex]){

let saved = fibAnswers[currentQuestionIndex];

inputs.forEach((inp,i)=>{
inp.value = saved[i];
inp.disabled = true;
});

checkBtn.disabled = true;
nextBtn.disabled = false;

}

/* submit click */
checkBtn.addEventListener("click",()=>{

let userAnswer = inputs.map(inp => inp.value.toLowerCase().trim()).join("");

if(userAnswer === correctAnswer){

speak("Correct answer!");
showPopup("You got it right!","correct");
fireConfetti();
score++;

/* save answer */
fibAnswers[currentQuestionIndex] = userAnswer.split("");

inputs.forEach(inp => inp.disabled = true);
checkBtn.disabled = true;

nextBtn.disabled = false;

if(currentQuestionIndex === filteredQuestions.length - 1){
setTimeout(showScorePopup,1200);
}

}else{

speak("Try again!");
showPopup("You're close!<br> Try again!","wrong");

}

});

answerArea.appendChild(container);
answerArea.appendChild(checkBtn);

inputs[0].focus();

}



}


// Next
nextBtn.addEventListener("click",()=>{

if(currentQuestionIndex < filteredQuestions.length - 1){

currentQuestionIndex++;
renderQuestion();

}

});


// Prev
prevBtn.addEventListener("click",()=>{

if(currentQuestionIndex > 0){

currentQuestionIndex--;
renderQuestion();

}

});


// Score
function showScorePopup(){

const popup = document.getElementById("finalPopup");
const scoreText = document.getElementById("score-text");

scoreText.textContent = `You have scored ${score}/${filteredQuestions.length}`;

popup.style.display = "flex";

fireConfettif();

}


// Initial Load
loadQuestions("mcq");
document.querySelector(".mcq-tab").classList.add("active");

const hamburger = document.getElementById("hamburger");
const navbarTabs = document.getElementById("navbarTabs");

/* toggle menu */
hamburger.addEventListener("click",(e)=>{
e.stopPropagation();

navbarTabs.classList.toggle("show");

/* change icon */
if(navbarTabs.classList.contains("show")){
hamburger.textContent = "✕";
}else{
hamburger.textContent = "☰";
}

});

/* close when clicking outside */
document.addEventListener("click",(e)=>{

if(!navbarTabs.contains(e.target) && !hamburger.contains(e.target)){
navbarTabs.classList.remove("show");
hamburger.textContent = "☰";
}

});

/* close when clicking a menu button */
document.querySelectorAll(".navbar-tabs button").forEach(btn=>{
btn.addEventListener("click",()=>{
navbarTabs.classList.remove("show");
hamburger.textContent = "☰";
});
});
