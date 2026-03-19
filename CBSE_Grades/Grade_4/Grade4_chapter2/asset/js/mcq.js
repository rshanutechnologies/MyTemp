/* ================= GLOBAL QUIZ STATE ================= */

let currentType = "mcq";

/* filter only MCQ at start */

let filteredQuestions = questions.filter(q => q.type === "mcq");

let currentQuestionIndex = 0;

let userAnswers = new Array(filteredQuestions.length).fill(null);

let score = 0;


/* ================= DOM ELEMENTS ================= */

const questionText = document.getElementById("question-text");
const questionImg = document.getElementById("question-img");
const answerArea = document.getElementById("answer-area");

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");


/* ================= LOAD QUESTION ================= */
/* reset layout spacing for other sections */
const questionLayout = document.querySelector(".question-layout");
questionLayout.style.marginBottom = "0px";

function loadQuestion(){
    // ✅ RESET EVERYTHING FIRST
    /* ✅ RESET NAV POSITION (for non-FIB) */
const quizContainer = document.querySelector(".quiz-container");
const navControls = document.querySelector(".nav-controls");
questionImg.style.display = "block";
prevBtn.style.visibility = "visible";
nextBtn.style.visibility = "visible";
document.querySelector(".mcq-btn").classList.add("active");

const question = filteredQuestions[currentQuestionIndex];

questionText.textContent =
`Q.${currentQuestionIndex + 1} ${question.question}`;

if(question.image){
  questionImg.src = question.image;
  questionImg.style.display = "block";
}else{
  questionImg.style.display = "none";
}
answerArea.innerHTML="";

/* render question type */

if(question.type === "mcq"){
answerArea.classList.add("mcq-layout");
renderMCQ(question);
}
else if(question.type === "fib"){
renderFIB(question);
}
else if(question.type === "tf"){
renderTF(question);
}
else if(question.type === "match"){
renderMatch(question);
}

/* check nav buttons */
checkNavButtons();

}


/* ================= RENDER MCQ ================= */

function renderMCQ(question){
answerArea.className = "mcq-layout";

question.options.forEach(option => {

const btn = document.createElement("button");

btn.classList.add("option-btn","mcq-option");


/* option image */

const img = document.createElement("img");

img.src = option.img;

img.classList.add("option-img");


/* option text */

const text = document.createElement("span");

text.textContent = option.text;

text.classList.add("option-text");


btn.appendChild(img);

btn.appendChild(text);


/* restore previous answer */

if(userAnswers[currentQuestionIndex]){

if(option.text === question.answer){
btn.classList.add("correct-border");
}

btn.disabled = true;

}


/* click option */

btn.addEventListener("click",()=>{

if(userAnswers[currentQuestionIndex]) return;


/* correct answer */

if(option.text === question.answer){

userAnswers[currentQuestionIndex] = option.text;

score++;

btn.classList.add("correct-border");


const allBtns = document.querySelectorAll(".mcq-option");

allBtns.forEach(b => b.disabled = true);


showPopup(true);

fireConfetti();

nextBtn.disabled = false;


/* final question */

if(currentQuestionIndex === filteredQuestions.length - 1){

setTimeout(()=>{

showFinalPopup(score,filteredQuestions.length);

},1200);

}

}


/* wrong answer */

else{

showPopup(false);

}

});

answerArea.appendChild(btn);

});

}


/* ================= NAV BUTTON STATE ================= */

function checkNavButtons(){

/* PREV button */

if(currentQuestionIndex === 0){
prevBtn.disabled = true;
}else{
prevBtn.disabled = false;
}

/* NEXT button */

if(userAnswers[currentQuestionIndex]){
nextBtn.disabled = false;
}else{
nextBtn.disabled = true;
}

}

/* ================= NEXT ================= */

nextBtn.addEventListener("click",()=>{

if(currentQuestionIndex < filteredQuestions.length - 1){

currentQuestionIndex++;

loadQuestion();

}

});


/* ================= PREV ================= */

prevBtn.addEventListener("click",()=>{

if(currentQuestionIndex > 0){

currentQuestionIndex--;

loadQuestion();

}

});


/* ================= START QUIZ ================= */

prevBtn.disabled = true;

nextBtn.disabled = true;

loadQuestion();