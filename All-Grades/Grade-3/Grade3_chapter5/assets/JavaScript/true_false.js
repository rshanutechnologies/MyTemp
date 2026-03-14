
const quizData = [
  { 
    q:"Q1. Living things are dependent on other living things.",
    a:true,
     img: "../assets/images/living_things.png",
    answered:false
  },
  { 
    q:"Q2. A sheep is a secondary consumer.",
    a:false,
    img: "../assets/images/sheep.png",
    answered:false
  },
  { 
    q:"Q3. Jackals are scavengers.",
    a:true,
    img: "../assets/images/jackals.png",
    answered:false
  },
  { 
    q:"Q4. A network of many food chains is called a food net.",
    a:false,
     img: "../assets/images/food_net.png",
    answered:false
  },
  { 
    q:"Q5. In a food chain, energy flows from the Sun to all the organisms in a sequence.",
    a:true,
    img:"../assets/images/energy_flows.png",
    answered:false
  }
];

let index = 0;
let score = 0;

const questionEl = document.getElementById("question");
const progressEl = document.getElementById("progress");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imgEl = document.getElementById("questionImg");


function loadQuestion(){
  const q = quizData[index];

  questionEl.textContent = q.q;
  imgEl.src = q.img;

  progressEl.textContent = ``;

  resetButtons();

  if(q.answered){
    applyAnsweredState();
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;
}

function showPopup(isCorrect){
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if(isCorrect){
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  }else{
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(()=> popup.style.display="none", 1200);
}

function showFinal(){
  const popup = document.getElementById("finalPopup");
  popup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}


function resetButtons(){
  trueBtn.className = "true";
  falseBtn.className = "false";
  trueBtn.onclick = () => answer(true);
  falseBtn.onclick = () => answer(false);
}

function answer(userAnswer){
  const q = quizData[index];
  if(q.answered) return;

  const correct = q.a === userAnswer;

  showPopup(correct);
  speak(correct ? "Correct" : "Wrong");

  if(correct){
    q.answered = true;
    score++;

    const correctBtn = userAnswer ? trueBtn : falseBtn;
    const wrongBtn = userAnswer ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");

    nextBtn.disabled = false;

    if(index === quizData.length - 1){
      setTimeout(showFinal, 700);
    }
  }
}


function applyAnsweredState(){
  const q = quizData[index];
  const correctBtn = q.a ? trueBtn : falseBtn;
  const wrongBtn = q.a ? falseBtn : trueBtn;

  correctBtn.classList.add("correct");
  wrongBtn.classList.add("disabled");
}

prevBtn.onclick = () => { index--; loadQuestion(); };
nextBtn.onclick = () => { index++; loadQuestion(); };

function showSplash(color){
  const s=document.createElement("div");
  s.className=`splash ${color}`;
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),800);
}

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}
function showFinal(){
  document.getElementById("finalPopup").style.display="flex";
  document.getElementById("finalScore").textContent=`Score: ${score}/${quizData.length}`;
  document.getElementById("stars").textContent="⭐".repeat(score);
}

loadQuestion();
