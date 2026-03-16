
const questions = [
  { text:" Our body has 350 bones when we are born.", answer:false,  img:"../assets/images/q2-img.png" },
  { text:" The heart is a big bone.",  answer:false, img:"../assets/images/q2-TF.png" },
  { text:" Calcium helps in making our bones strong.",            answer:true,  img:"../assets/images/q3-TF.png" },
  { text:"The skin is the innermost layer of our body.",         answer:false, img:"../assets/images/q4-TF.png" },
  { text:" Smooth muscles are found inside our organs.",  answer:true,  img:"../assets/images/q5-TF.png" }
];

let index = 0;
let score = 0;

const locked = Array(questions.length).fill(false);
const selected = Array(questions.length).fill(null);

const qText = document.getElementById("qText");

const scoreBox = document.getElementById("scoreBox");

const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// function speak(text){
//   window.speechSynthesis.cancel();
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = "en-Uk";
//   utterance.rate = 0.9;
//   window.speechSynthesis.speak(utterance);
// }
function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";  
  msg.volume = 0.25; 
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function showPopup(isCorrect){
  const popup = document.getElementById("popup");
  const popupMedia = document.getElementById("popupMedia");
  const popupText = document.getElementById("popupText");

  popupMedia.innerHTML = "";
  popupText.className = "popup-msg";

  if(isCorrect){
    const img = document.createElement("img");
    img.src = questions[index].img;
    popupMedia.appendChild(img);

    popupText.textContent = "Correct! ✅";
    popupText.classList.add("correct");
    speak("Correct");
  }else{
    popupMedia.innerHTML = `<div class="popup-emoji">😢</div>`;
    popupText.textContent = "Wrong! ❌";
    popupText.classList.add("wrong");
    speak("Wrong");
  }

  popup.style.display="flex";
  setTimeout(()=> popup.style.display="none", 1200);
}

function loadQuestion(){
  qText.textContent = questions[index].text;
  questionImg.src = questions[index].img;

  // reset buttons
  trueBtn.className = "btn true";
  falseBtn.className = "btn false";
  trueBtn.classList.remove("hidden");
  falseBtn.classList.remove("hidden");

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !locked[index];

  if(locked[index]){
    if(selected[index] === true){
      trueBtn.classList.add("correct");
      falseBtn.classList.add("hidden");
    }else{
      falseBtn.classList.add("correct");
      trueBtn.classList.add("hidden");
    }
  }
}


function answer(val){
  if(locked[index]) return;

  const correct = questions[index].answer;

  // reset wrong classes on every click
  trueBtn.classList.remove("wrong","shake");
  falseBtn.classList.remove("wrong","shake");

  if(val === correct){
    locked[index] = true;
    selected[index] = val;

    score++;
    scoreBox.textContent = `Score: ${score}`;

    

    if(correct === true){
      trueBtn.classList.add("correct");
      falseBtn.classList.add("hidden");
    }else{
      falseBtn.classList.add("correct");
      trueBtn.classList.add("hidden");
    }

    showPopup(true);
    nextBtn.disabled = false;

    if(index === questions.length - 1){
      setTimeout(showFinalPopup, 1500);
    }
  }else{
    // ✅ wrong animation like previous games
    const wrongBtn = val === true ? trueBtn : falseBtn;
    wrongBtn.classList.add("wrong","shake");

    showPopup(false);

    // remove shake after time
    setTimeout(()=> wrongBtn.classList.remove("shake"), 500);
  }
}

function next(){
  if(index < questions.length - 1){
    index++;
    loadQuestion();
  }
}

function prev(){
  if(index > 0){
    index--;
    loadQuestion();
  }
}

/* ✅ FINAL POPUP (same as fill blanks) */
function showFinalPopup(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${questions.length}`;

  document.getElementById("finalStars").textContent =
    "⭐".repeat(score);

  // ✅ Restart Trophy Animation every time final opens
  const winnerImg = document.getElementById("winnerImg");
  winnerImg.style.animation = "none";
  winnerImg.offsetHeight; // force reflow
  winnerImg.style.animation = "liftTrophy 1.1s ease-in-out infinite";

  speak(`Congratulations! Your score is ${score} out of ${questions.length}`);
}

function restartQuiz(){
  index = 0;
  score = 0;
  locked.fill(false);
  selected.fill(null);

  document.getElementById("finalPopup").style.display = "none";
  scoreBox.textContent = "Score: 0";
  nextBtn.disabled = true;

  loadQuestion();
}

/* bindings */
trueBtn.addEventListener("click", ()=> answer(true));
falseBtn.addEventListener("click", ()=> answer(false));
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
document.getElementById("restartBtn").addEventListener("click", restartQuiz);

loadQuestion();


