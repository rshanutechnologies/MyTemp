const questions = [
  { text: "Insects are non-living things.", answer: false, img: "../assets/images/insects.png", },
  { text: "Plants do not respond to stimuli.", answer: false, img: "../assets/images/plants.png" },
  { text: "Living things can live without food.", answer: false, img: "../assets/images/livingthings_hungry.png"},
  { text: "Frogs and insects lay eggs.", answer: true, img: "../assets/images/insects_layeggs.png"},
  { text: "The lifespan of different living things vary.", answer: true, img: "../assets/images/lifespan.png" },
];

let index = 0;
let score = 0;
let locked = false;

const qText = document.getElementById("qText");

const trueBtn = document.querySelector(".btn.true");
const falseBtn = document.querySelector(".btn.false");
const answered = Array(questions.length).fill(null);
const page = document.querySelector(".page");

function render() {
  const q = questions[index];

  qText.textContent = q.text;
  document.getElementById("qImage").src = q.img;

  // RESET QUESTION STATE
  locked = false;

  trueBtn.classList.remove("correct", "wrong", "disabled");
  falseBtn.classList.remove("correct", "wrong", "disabled");

  // disable NEXT until answered
  nextBtn.disabled = true;

  // ✅ RESTORE PREVIOUS ANSWER HERE
  if (answered[index]) {
    locked = true;

    const prevAnswer = answered[index];

    if (prevAnswer.selected === true) {
      trueBtn.classList.add(prevAnswer.correct ? "correct" : "wrong");
      falseBtn.classList.add("disabled");
    } else {
      falseBtn.classList.add(prevAnswer.correct ? "correct" : "wrong");
      trueBtn.classList.add("disabled");
    }

    nextBtn.disabled = false;
  }

  updateNav();
}




const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function updateNav() {
  prevBtn.disabled = index === 0;
  nextBtn.disabled = !answered[index] || index === questions.length - 1;
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
function answer(val) {
  if (locked) return;

  const correct = questions[index].answer;
  

  if (val === correct) {
  locked = true;
 answered[index] = {
  selected: val,
  correct: val === correct
};
  score++;

  speak("Correct");
  showPopup(true);   // ← ADD THIS

  nextBtn.disabled = false;


    if (val === true) {
      trueBtn.classList.add("correct");
      falseBtn.classList.add("disabled");
    } else {
      falseBtn.classList.add("correct");
      trueBtn.classList.add("disabled");
    }
    if (index === questions.length - 1) {
      setTimeout(showFinal, 1000);
    }
  } else {
  speak("Wrong");
  showPopup(false);   // ← ADD THIS

    if (val === true) {
      trueBtn.classList.add("wrong");
    } else {
      falseBtn.classList.add("wrong");
    }
  }
}
function showPopup(isCorrect){
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
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

  setTimeout(()=>{
    popup.style.display="none";
  },1200);
}

function next() {
  if (index < questions.length - 1) {
    index++;
    render();
  }
}

function prev() {
  if (index > 0) {
    index--;
    render();
  }
}

function showFinal() {
  // page.style.display = "none";
  
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

render();
