const questions = [
  {
    q: "Q1. The space occupied by a thing is called its ____.",
    a: "volume",
    img: "../assets/images/volume1.png",
  },
  {
    q: "Q2. Molecules are made up of tiny particles called ____.",
    a: "atoms",
    img: "../assets/images/Atom.png",
  },
  {
    q: "Q3. Anything that occupies space and has mass is called ____.",
    a: "matter",
    img: "../assets/images/Matter.png",
  },
  {
    q: "Q4. The amount of substance present in an object is called its ____.",
    a: "mass",
    img: "../assets/images/mass.png",
  },
  {
    q: "Q5. The empty spaces between the molecules are called the ____ spaces.",
    a: "intermolecular",
    img: "../assets/images/Space.png",
  },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const photo = document.getElementById("photo");
const story = document.getElementById("story");
const answer = document.getElementById("answer");
const submit = document.getElementById("submit");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const counter = document.getElementById("counter");

function load() {
  const q = questions[index];
  photo.classList.remove("spin");
  void photo.offsetWidth;
  photo.classList.add("spin");

  photo.style.backgroundImage = `url(${q.img})`;
  counter.textContent = ``;

  story.innerHTML = `${q.q}`;

  answer.value = answers[index] || "";
  answer.disabled = !!answers[index];

  answer.classList.toggle("correct-input", !!answers[index]);

  submit.disabled = !!answers[index] || !answer.value.trim();
  prev.disabled = index === 0;
  next.disabled = !answers[index];
}

answer.oninput = () => {
  if (!answers[index]) {
    submit.disabled = !answer.value.trim();
    submit.classList.toggle("active", answer.value.trim() !== "");
  }
  submit.classList.toggle("active", !!answer.value.trim());

};

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index1.html";
});




function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

submit.onclick = () => {
  if (answer.value.trim().toLowerCase() === questions[index].a) {
    answers[index] = questions[index].a;
    score++;
    speak("Correct");
    showPopup(true);
    load();
    if (index === questions.length - 1) setTimeout(showFinal, 1200);
  } else {
    speak("Wrong");
    showPopup(false);
    answer.value = "";
    submit.disabled = true;
    answer.classList.remove("correct-input");
  }
};

prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");

  popup.style.display = "flex";

  if (isCorrect) {
    popup.innerHTML = `
      <div class="popup-box">
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">${"⭐".repeat(index + 1)}</div>
        </div>
      </div>
    `;
  } else {
    popup.innerHTML = `
      <div class="popup-box">
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 You can do it!</div>
        </div>
      </div>
    `;
  }

  setTimeout(() => {
    popup.style.display = "none";
  }, 1000);
}


function showFinal() {
  const finalPopup = document.getElementById("finalPopup");

  const stars = "⭐".repeat(
    Math.max(1, Math.round((score / questions.length) * 5))
  );

  finalPopup.style.display = "flex";
  finalPopup.innerHTML = `
    <div class="popup-box final-wide">
      <div class="popup-final-content">
        🎉 Congratulations!
        <span class="emoji">🏆</span>
        You finished the quiz!
        <div class="final-score">
          Score: <b>${score} / ${questions.length}</b>
        </div>
        <div class="stars">${stars}</div>
        <button class="restart" onclick="location.reload()">🔄 Restart</button>
      </div>
    </div>
  `;

  // optional confetti
  const duration = 2000;
  const end = Date.now() + duration;

 
}


load();
