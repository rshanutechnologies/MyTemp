/* ================= POPUP SYSTEM ================= */

function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  icon.style.animation = "none";
  void icon.offsetWidth;
  icon.style.animation = "";

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";

  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";

    speak("Correct");
    fireConfetti();

  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";

    speak("Wrong");
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${questions.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);

  fireConfettif();
}


/* ================= QUESTIONS ================= */
const questions = [

{
q: "Q.1 The upper arm is made of a long bone called the __________.",
a: ["humerus"],
img: "../assets/images/humerus1.png"
},

{
q: "Q.2 The lower leg has two bones namely __________ and __________.",
a: ["tibia","fibula"],
img: "../assets/images/legbones.png"
},

{
q: "Q.3 Bones are held together at joints by __________.",
a: ["ligaments"],
img: "../assets/images/ligaments1.png"
},

{
q: "Q.4 The __________ protects the vital internal organs of our body.",
a: ["rib cage"],
img: "../assets/images/ribcage.png"
},

{
q: "Q.5 The __________ acts as a cushion and reduces friction between the bones.",
a: ["cartilage"],
img: "../assets/images/cartilage1.png"
}

];

let index = 0;
let score = 0;
const answers = Array(questions.length).fill(null);


/* ================= ELEMENTS ================= */

const qImgEl   = document.getElementById("qImg");
const qTextEl  = document.getElementById("qText");
const prev     = document.getElementById("prevBtn");
const next     = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");

const input1 = document.getElementById("answerInput1");
const input2 = document.getElementById("answerInput2");
const submitBtn= document.getElementById("submitBtn");


/* ================= FUNCTIONS ================= */

function updateScore() {
  scoreBox.textContent = "Score: " + score;
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-UK";
  msg.volume = 0.3;
  msg.rate = 1.0;
  msg.pitch = 1.0;
  speechSynthesis.speak(msg);
}


/* ================= CHECK ANSWER ================= */

function checkAnswer(){

  const correctAnswers = questions[index].a;

  const user1 = input1.value.trim().toLowerCase();
  const user2 = input2.value.trim().toLowerCase();

  /* ===== TWO ANSWERS QUESTION ===== */

  if(correctAnswers.length === 2){

    let correct1 = false;
    let correct2 = false;

    if(user1 === correctAnswers[0] || user1 === correctAnswers[1]){
      correct1 = true;
    }

    if(user2 === correctAnswers[0] || user2 === correctAnswers[1]){
      correct2 = true;
    }

    /* BOTH CORRECT */

    if(correct1 && correct2){

      score++;
      updateScore();

      showPopup(true);

      answers[index] = [user1,user2];

      input1.disabled = true;
      input2.disabled = true;

      submitBtn.disabled = true;

      next.disabled = false;

      if(index === questions.length - 1){
        setTimeout(showFinal,1600);
      }

    }

    /* ONE CORRECT ONE WRONG */

    else if(correct1 && !correct2){

      showPopup(false);

      input1.disabled = true;   // keep correct
      input2.value = "";        // clear wrong

    }

    else if(!correct1 && correct2){

      showPopup(false);

      input2.disabled = true;   // keep correct
      input1.value = "";        // clear wrong

    }

    /* BOTH WRONG */

    else{

      showPopup(false);

      input1.value = "";
      input2.value = "";

    }

  }

  /* ===== SINGLE ANSWER QUESTION ===== */

  else{

    if(user1 === correctAnswers[0]){

      score++;
      updateScore();

      showPopup(true);

      answers[index] = [user1];

      input1.disabled = true;
      submitBtn.disabled = true;

      next.disabled = false;

      if(index === questions.length - 1){
        setTimeout(showFinal,1600);
      }

    }else{

      showPopup(false);

      input1.value = "";

    }

  }

}


/* ================= LOAD QUESTION ================= */
function loadQuestion(){

  const q = questions[index];

  qImgEl.src = q.img;
  qTextEl.textContent = q.q;

  input1.value="";
  input2.value="";

  input1.disabled=false;
  input2.disabled=false;

  submitBtn.style.display="inline-block";
  submitBtn.disabled=true;


  if(q.a.length === 2){

    input2.style.display="block";

  }else{

    input2.style.display="none";

  }


  const alreadyCorrect = answers[index];

  if(alreadyCorrect){

    input1.value = alreadyCorrect[0].toUpperCase();

    if(q.a.length === 2){
      input2.value = alreadyCorrect[1].toUpperCase();
    }

    input1.disabled=true;
    input2.disabled=true;

    submitBtn.style.display="none";

  }

  prev.disabled = index === 0;
  next.disabled = !alreadyCorrect;

}

[input1,input2].forEach(inp=>{
  inp.addEventListener("input",()=>{

    if(input1.value.trim().length>0){
      submitBtn.disabled=false;
    }else{
      submitBtn.disabled=true;
    }

  });
});

/* ================= EVENTS ================= */

submitBtn.onclick = checkAnswer;

prev.onclick = () => {
  index--;
  loadQuestion();
};

next.onclick = () => {
  if(index < questions.length - 1){
    index++;
    loadQuestion();
  }
};


/* ================= CONFETTI ================= */

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}


/* ================= START ================= */

updateScore();
loadQuestion();