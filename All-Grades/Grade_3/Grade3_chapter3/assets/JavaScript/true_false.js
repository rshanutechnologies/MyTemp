const questions = [
  { 
    text: "Animals can prepare their own food.", 
    answer: false,
    image: "../assets/images/tf.png"

  },
  { 
    text: "All animals eat only plants.", 
    answer: false,
    image: "../assets/images/tf2.png"
  },
  {
    text: "Snakes chew their prey.",
    answer: false,
    image: "../assets/images/tf3.png"
  },
  {
    text: "Mosquitoes suck the blood from our body.",
    answer: true,
    image: "../assets/images/tf4.png"
  },
  {
    text: "Animals that gnaw their food have a pair of sharp, long and curved teeth.",
    answer: true,
    image: "../assets/images/tf5.png"
  },
];

let index = 0;
let score = 0;
// let quizCompleted = false;

const textEl = document.getElementById("questionText");
const correctFlower = document.getElementById("correctFlower");
const wrongFlower = document.getElementById("wrongFlower");
const userAnswers = new Array(questions.length).fill(null);
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


function render() {
  const q = questions[index];
  const state = userAnswers[index];

  textEl.textContent = q.text;

  const imgEl = document.getElementById("questionImage");

if (q.image) {
  imgEl.src = q.image;
  imgEl.style.display = "block";
} else {
  imgEl.style.display = "none";
}


  // reset flowers
  correctFlower.textContent = correctFlower.dataset.closed;
  wrongFlower.textContent = wrongFlower.dataset.closed;
  correctFlower.classList.remove("open");
  wrongFlower.classList.remove("open");

  // reset buttons
  document.querySelectorAll(".ribbon").forEach((btn) => {
    btn.classList.remove("selected", "wrong");
    btn.disabled = false;
    btn.style.opacity = 1;
  });

  // PREV
  prevBtn.disabled = index === 0;
  prevBtn.style.opacity = index === 0 ? 0.4 : 1;

  // NEXT (locked until correct)
  nextBtn.disabled = true;
  nextBtn.style.opacity = 0.4;

  // RESTORE PREVIOUS ANSWER
  if (state !== null) {
    if (state.correct) {
      // open flowers
      correctFlower.textContent = correctFlower.dataset.open;
      wrongFlower.textContent = wrongFlower.dataset.open;
      correctFlower.classList.add("open");
      wrongFlower.classList.add("open");

      // highlight correct answer
      highlightAnswer(q.answer);

      // lock buttons
      trueBtn.disabled = true;
      falseBtn.disabled = true;
      trueBtn.style.opacity = 0.5;
      falseBtn.style.opacity = 0.5;

      if (state.selected === true) {
        trueBtn.style.opacity = 1;
        falseBtn.style.opacity = 0.4;
      } else {
        falseBtn.style.opacity = 1;
        trueBtn.style.opacity = 0.4;
      }

      // unlock NEXT
      nextBtn.disabled = false;
      nextBtn.style.opacity = 1;
    } else {
      // highlight wrong selection only
      highlightWrong(state.selected);
    }
  }
  // if (quizCompleted) {
  //   quizComplete.style.display = "block";
  // }

}
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

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}
function answer(value) {
  const correct = questions[index].answer;

  userAnswers[index] = {
    selected: value,
    correct: value === correct,
  };

  if (value === correct) {
    correctFlower.textContent = correctFlower.dataset.open;
    wrongFlower.textContent = wrongFlower.dataset.open;
     showPopup(true);
    speak("Correct");
    score++;

    correctFlower.classList.add("open");
    wrongFlower.classList.add("open");

    highlightAnswer(value);
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;

    // 🔒 disable both buttons
    trueBtn.disabled = true;
    falseBtn.disabled = true;

    if (value === true) {
      trueBtn.style.opacity = 1;
      falseBtn.style.opacity = 0.4;
    } else {
      falseBtn.style.opacity = 1;
      trueBtn.style.opacity = 0.4;
    }
    // if (index === questions.length - 1) {
    //   quizCompleted = true;
    //   quizComplete.style.display = "block";
    // }

    if (index === questions.length - 1) {
      setTimeout(showFinal, 1000);
    }
  } else {
    highlightWrong(value);

    correctFlower.classList.add("shake");
    wrongFlower.classList.add("shake");
     showPopup(false);
    speak("Wrong");

    setTimeout(() => {
      correctFlower.classList.remove("shake");
      wrongFlower.classList.remove("shake");
    }, 400);
  }
}

function highlightAnswer(correctValue) {
  document.querySelectorAll(".ribbon").forEach((btn) => {
    const isTrueBtn = btn.classList.contains("fact");

    if (isTrueBtn === correctValue) {
      btn.classList.add("selected");
    } else {
      btn.classList.add("wrong");
    }
  });
}

function highlightWrong(selectedValue) {
  document.querySelectorAll(".ribbon").forEach((btn) => {
    const isTrueBtn = btn.classList.contains("fact");

    if (isTrueBtn === selectedValue) {
      btn.classList.add("wrong");
    }
  });
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
  prevBtn.style.zIndex = "0";
  nextBtn.style.zIndex = "0";

  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

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
