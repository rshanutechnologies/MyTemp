const quizData = [
  {
    emoji: "",
    q: "Birds fly with the help of their ____________ .",
    options: ["Lungs", "Wings", "Gills", "Fins"],
    optionImages: [
  "../assets/images/lungs.png",
  "../assets/images/wings.png",
  "../assets/images/gills.png",
  "../assets/images/fins.png"
],

    correct: 1,
  },
  {
    emoji: "",
    q: "A ____________ lays eggs.",
    options: ["Bat", "Snake", "Kangaroo", "Bear"],
    optionImages: [
      "../assets/images/bat.png",
      "../assets/images/snake.png",
      "../assets/images/kangaroo.png",
      "../assets/images/bear.png"
    ],
    correct: 1,
  },
  {
    emoji: "",
    q: " ________________ have six legs.",
    options: ["Insects", "Snakes", "Birds", "Fishes"],
    optionImages: [
      "../assets/images/insect.png",
      "../assets/images/snake.png",
      "../assets/images/bird.png",
      "../assets/images/fish.png"
    ],
    correct: 0,
  },
  {
    emoji: "",
    q: "Plants make food in their ______________.",
    options: ["Leaves", "Roots", "Stems", "Branches"],
    optionImages: [
      "../assets/images/leaf.png",
      "../assets/images/roots.png",
      "../assets/images/stem.png",
      "../assets/images/branches.png"
    ],
    correct: 0,
  },
  {
    emoji: "",
    q: "Aquatic birds swim with their ______________.",
    options: ["Fins", "Wings", "Webbed feet", "Feathers"],
    optionImages: [
      "../assets/images/fins.png",
      "../assets/images/wings.png",
      "../assets/images/webbed_legs.png",
      "../assets/images/feather.png"
    ],
    correct: 2, // corrected answer
  },
];


let index = 0,
  score = 0;
let answers = Array(quizData.length).fill(null);

const qText = document.getElementById("questionText");
const qEmoji = document.getElementById("questionEmoji");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const progress = document.getElementById("progress");
function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
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

  setTimeout(()=>{
    popup.style.display="none";
  },1200);
}

function renderProgress() {
  progress.innerHTML = "";
  quizData.forEach((_, i) => {
    const d = document.createElement("div");
    d.textContent = answers[i] !== null ? "" : "";
    progress.appendChild(d);
  });
}

function loadQuestion() {
  const q = quizData[index];
  qText.textContent = q.q;
  qEmoji.textContent = q.emoji;

  optionsEl.innerHTML = "";
  prevBtn.disabled = index === 0;

  renderProgress();

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";

    div.innerHTML = `
      <img src="${q.optionImages[i]}" class="optImg">
      <p>${opt}</p>
    `;

    // restore selected answer
    if (answers[index] !== null) {
      if (i === answers[index]) {
        div.classList.add("correct");
      } else {
        div.classList.add("disabled");
      }
    }

    div.onclick = () => selectAnswer(div, i);
    optionsEl.appendChild(div);
  });

  nextBtn.disabled = answers[index] === null;
}

function selectAnswer(el, i) {
  const correct = quizData[index].correct;

  if (answers[index] !== null) return;

  if (i === correct) {
    score++;
    answers[index] = i;

    el.classList.add("correct");
    correctSound.play();
    speak("Correct");
    showPopup(true);

    document.querySelectorAll(".option").forEach((o, idx) => {
      if (idx !== i) o.classList.add("disabled");
    });

    nextBtn.disabled = false;

    if (index === quizData.length - 1) {
      setTimeout(showFinal, 1000);
    }
  } else {
    el.classList.add("disabled");
    wrongSound.play();
    speak("Wrong");
    showPopup(false);
  }
}


prevBtn.onclick = () => {
  index--;
  loadQuestion();
};
nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";
  finalPopup.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}


function restart() {
  index = 0;
  score = 0;
  answers.fill(null);

  // hide final popup
  document.getElementById("finalPopup").style.display = "none";

  loadQuestion();
}


loadQuestion();
