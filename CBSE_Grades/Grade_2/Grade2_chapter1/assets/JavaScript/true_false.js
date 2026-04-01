
/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  // 🔥 Reset animation
  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
  `Score: ${score} / ${quizData.length}`

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
     fireConfettif(); 

}




const quizData = [
  {
    q:"Q.1  Roots transport food and water to all the parts Reasoning Skills of a plant.",
    a:true,
    img:"../assets/images/RootTrasport.png",
    answered:false
  },
  {
    q:"Q.2 Trees have a soft stem.   ",
    a:false,
    img:"../assets/images/SoftStem.png",
    answered:false
  },
  {
    q:"Q.3  A pumpkin plant is an example of a creeper.  ",
    a:true,
    img:"../assets/images/Pumpkin1.png",
    answered:false
  },
  {
    q:"Q.4  We get perfume from jasmine flower.  ",
    a:false,
    img:"../assets/images/JasminPerfume.png",
    answered:false
  },
  {
    q:"Q.5 Seeds grow into new plants. ",
    a:false,
    img:"../assets/images/SeedGrow.png",
    answered:false
  }
];


let index=0, score=0;
const scoreBox = document.getElementById("scoreBox");

function updateScore(){
  scoreBox.textContent = "Score: " + score;
}
const questionEl=document.getElementById("question");
// const progressEl=document.getElementById("progress");
const trueBtn=document.getElementById("trueBtn");
const falseBtn=document.getElementById("falseBtn");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");
prevBtn.disabled = true;
nextBtn.disabled = true;
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");


function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function loadQuestion(){
  const q = quizData[index];   // ✅ define first

  const imgEl = document.getElementById("questionImg");
  imgEl.src = q.img;           // ✅ now works
  imgEl.style.display = "block";

  questionEl.textContent = q.q;
  // progressEl.textContent = `Question ${index+1}/${quizData.length}`;

  trueBtn.className = "true";
  falseBtn.className = "false";
trueBtn.classList.remove("correct","disabled");
falseBtn.classList.remove("correct","disabled");
  trueBtn.onclick = () => answer(true);
  falseBtn.onclick = () => answer(false);

  if(q.answered){
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;
}



function answer(user){
  const q = quizData[index];
  if(q.answered) return;

  const correct = q.a === user;

  speak(correct ? "Correct" : "Wrong");
if(correct){

  q.answered = true;

  if(!q.scored){
    score++;
    q.scored = true;
    updateScore();
  }

  const correctBtn = user ? trueBtn : falseBtn;
  const wrongBtn = user ? falseBtn : trueBtn;

  correctBtn.classList.add("correct");
  wrongBtn.classList.add("disabled");

  showPopup(true);   // ✅ correct popup
   fireConfetti(); 

  nextBtn.disabled = false;

  if(index === quizData.length - 1){
    setTimeout(showFinal, 800);
  }

} else {

  showPopup(false);  // ❌ wrong popup

}
}
function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

prevBtn.onclick=()=>{index--;loadQuestion();};
nextBtn.onclick=()=>{index++;loadQuestion();};

loadQuestion();
updateScore();
