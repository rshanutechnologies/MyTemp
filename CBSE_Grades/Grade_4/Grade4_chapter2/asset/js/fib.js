/* ================= FIB STATE ================= */

let fibAnswers = [];


/* ================= RENDER FIB ================= */

function renderFIB(question){

answerArea.innerHTML = "";
answerArea.className = "fib-layout";

const correctAnswer = question.answer.toLowerCase().trim();
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

for(let i = 0; i < letters; i++){

const input = document.createElement("input");

input.maxLength = 1;
input.classList.add("fib-letter");

container.appendChild(input);
inputs.push(input);


/* typing behaviour */

input.addEventListener("input",()=>{

    // 🔒 prevent re-enabling if already answered
    if(fibAnswers[currentQuestionIndex]){
        return;
    }

    input.value = input.value.replace(/[^a-zA-Z]/g,"");

    if(input.value.length === 1 && i < letters - 1){
        inputs[i+1].focus();
    }

    let filled = inputs.every(inp => inp.value !== "");
    checkBtn.disabled = !filled;

});


/* backspace behaviour */

input.addEventListener("keydown",(e)=>{

if(e.key === "Backspace" && input.value === "" && i > 0){
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

    // 🔥 HARD LOCK (IMPORTANT)
    checkBtn.style.pointerEvents = "none";
    checkBtn.style.opacity = "0.6";
    checkBtn.style.cursor = "not-allowed";

    nextBtn.disabled = false;

    userAnswers[currentQuestionIndex] = saved.join("");

}


/* submit click */

checkBtn.addEventListener("click",()=>{

let userAnswer = inputs
.map(inp => inp.value.toLowerCase())
.join("");

if(userAnswer === correctAnswer){

showPopup(true);
fireConfetti();

score++;

fibAnswers[currentQuestionIndex] = userAnswer.split("");

inputs.forEach(inp => inp.disabled = true);

checkBtn.disabled = true;
    checkBtn.style.opacity = "0.6";    // ✅ optional (visual)
    checkBtn.style.cursor = "not-allowed";

nextBtn.disabled = false;


/* final question */

if(currentQuestionIndex === filteredQuestions.length - 1){

setTimeout(()=>{

showFinalPopup(score,filteredQuestions.length);

},1200);

}

}else{

    showPopup(false);

    inputs.forEach(inp => {
        inp.value = "";
    });

    checkBtn.disabled = true;

    inputs[0].focus();
}

});


const wrapper = document.createElement("div");
wrapper.classList.add("fib-wrapper");

wrapper.appendChild(container);
wrapper.appendChild(checkBtn);

answerArea.appendChild(wrapper);
/* ================= MOVE NAV BUTTONS UP (FIB ONLY) ================= */

const navControls = document.querySelector(".nav-controls");

// move nav buttons just after answer area
const questionLayout = document.querySelector(".question-layout");
questionLayout.style.marginBottom = "-20px";  // adjust value

inputs[0].focus();

}