const questions = [
  {
    text: "Q.1 The process of shedding the skin several times before an animal grows into an adult is called hatching.",
    answer: false,
    img: "../assets/images/hatching.png"
  },
  {
    text: "Q.2 A floating clump of frog eggs is called a spawn.",
    answer: true,
    img: "../assets/images/spawn.png"
  },
  {
    text: "Q.3 The life cycle of a butterfly has three stages.",
    answer: false,
    img: "../assets/images/butterflyak.png"
  },
  {
    text: "Q.4 Mammals protect their young ones until they are old enough to take care of themselves.",
    answer: true,
    img: "../assets/images/Mammals.png"
  },
  {
    text: "Q.5 Metamorphosis in frogs includes the loss of tail and the growing of legs.",
    answer: true,
    img: "../assets/images/frogg.png"
  },
];


let index = 0;
let score = 0;
const solvedMap = {};

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");

const btnTrue = document.getElementById("btnTrue");
const btnFalse = document.getElementById("btnFalse");
const nextBtn = document.getElementById("nextBtn");

// function speak(text) {
//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function render() {
  qText.textContent = questions[index].text;
  qImg.src = questions[index].img;

  // Reset UI states
 
  btnTrue.className = "btn true";
  btnFalse.className = "btn false";
// Prev button
document.getElementById("prevBtn").disabled = index === 0;

// Next button enabled only if question solved
nextBtn.disabled = !solvedMap[index];


  if (solvedMap[index]) {
    const q = questions[index];

    if (q.answer === true) {
      btnTrue.classList.add("correct", "no-click");
      btnFalse.classList.add("disabled-look");
    } else {
      btnFalse.classList.add("correct", "no-click");
      btnTrue.classList.add("disabled-look");
    }

   
  }
}


function answer(val) {
  if (solvedMap[index]) return;
  const correct = questions[index].answer;

  if (val === correct) {
    solvedMap[index] = true;
    score++;
    speak("Correct");
    showPopup(true);

    // Trigger the fill animation
 

    // if (val) {
    //   btnTrue.classList.add("correct", "no-click");
    //   btnFalse.classList.add("disabled-look");
    // } else {
    //   btnFalse.classList.add("correct", "no-click");
    //   btnTrue.classList.add("disabled-look");
    // }
    if (correct === true) {
  btnTrue.classList.add("correct", "no-click");
  btnFalse.classList.add("disabled-look");
} else {
  btnFalse.classList.add("correct", "no-click");
  btnTrue.classList.add("disabled-look");
}


    if (index === questions.length - 1) {
      setTimeout(showFinal, 1600);
    } else {
      nextBtn.disabled = false;
    }
  } else {
    speak("Wrong");
    showPopup(false);
    const btn = val ? btnTrue : btnFalse;
    btn.classList.add("wrong");
    setTimeout(() => btn.classList.remove("wrong"), 400);
  }
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

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
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
