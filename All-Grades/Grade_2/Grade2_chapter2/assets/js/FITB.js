const questions = [
  {
    text: "<span class='blankSpot'></span> contains calcium that makes bones strong.",
    answer: "MILK",
    img: "../assets/images/BONESSS.png",
  },
  {
    text: "The muscles in our body form the <span class='blankSpot'></span> system.",
    answer: "MUSCULAR",
    img: "../assets/images/q2-F.png",
  },
  {
    text: "The ribcage protects our <span class='blankSpot'></span> and <span class='blankSpot'></span>.",
    answer: ["HEART", "LUNGS"],
    img: "../assets/images/ribcage.png",
  },
  {
    text: "<span class='blankSpot'></span> help us bend our arms and legs.",
    answer: "JOINTS",
    img: "../assets/images/ArmsLegs.png",
  },
  {
    text: "An adult has <span class='blankSpot'></span> bones.",
    answer: "206",
    img: "../assets/images/q2-img.png",
  },
];

let index = 0,
  score = 0;
let locked = Array(questions.length).fill(false);
let userAnswers = Array(questions.length).fill(null);

const qText = document.getElementById("qText");
const qImage = document.getElementById("qImage");
const optionsBox = document.getElementById("options");
const submitBtn = document.getElementById("submitBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");

let blanks = [];
let selectedLetters = [];
let allTiles = []; // Store all tile elements for reference

function speak(t) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

function shuffle(a) {
  return a.sort(() => Math.random() - 0.5);
}

function getLetters(answer) {
  if (Array.isArray(answer)) {
    return shuffle(answer.join("").split(""));
  }
  return shuffle(answer.split(""));
}

function createBlank(size, blankIndex) {
  const row = document.createElement("span");
  row.className = "blank-row";
  row.dataset.blankIndex = blankIndex;
  for (let i = 0; i < size; i++) {
    const b = document.createElement("div");
    b.className = "blank-box";
    b.dataset.position = i;
    
    // Add click handler to remove letter from this box
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      if (locked[index]) return;
      if (b.textContent) {
        removeLetterFromBlank(blankIndex, i, b.textContent);
      }
    });
    
    row.appendChild(b);
  }
  return row;
}

// NEW FUNCTION: Remove letter from specific blank box
function removeLetterFromBlank(blankIndex, boxPosition, letterToRemove) {
  // Find which tile has this letter and is not disabled (or is currently used)
  // We need to find a tile that matches the letter and re-enable it
  
  // Calculate the global position in selectedLetters array
  let globalPos = 0;
  for (let i = 0; i < blankIndex; i++) {
    globalPos += blanks[i].children.length;
  }
  globalPos += boxPosition;
  
  // Remove from selectedLetters array
  if (globalPos < selectedLetters.length) {
    selectedLetters.splice(globalPos, 1);
  }
  
  // Clear the box
  const blankBox = blanks[blankIndex].children[boxPosition];
  blankBox.textContent = "";
  
  // Shift all remaining letters to fill the gap
  let newSelectedLetters = [];
  let currentPos = 0;
  
  // Rebuild selectedLetters by reading all blank boxes in order
  for (let i = 0; i < blanks.length; i++) {
    for (let j = 0; j < blanks[i].children.length; j++) {
      const box = blanks[i].children[j];
      if (box.textContent) {
        newSelectedLetters.push(box.textContent);
      }
    }
  }
  
  selectedLetters = newSelectedLetters;
  
  // Re-enable the tile that was removed
  // Find a tile with matching letter that is disabled
  const tiles = document.querySelectorAll(".tile");
  for (let tile of tiles) {
    if (tile.textContent === letterToRemove && tile.classList.contains("disabled")) {
      tile.classList.remove("disabled");
      break;
    }
  }
  
  // Update all blank boxes to show correct letters in order
  let fillPos = 0;
  for (let i = 0; i < blanks.length; i++) {
    for (let j = 0; j < blanks[i].children.length; j++) {
      if (fillPos < selectedLetters.length) {
        blanks[i].children[j].textContent = selectedLetters[fillPos];
        fillPos++;
      } else {
        blanks[i].children[j].textContent = "";
      }
    }
  }
  
  // Update submit button state
  const totalNeeded = blanks.reduce((s, b) => s + b.children.length, 0);
  submitBtn.disabled = selectedLetters.length !== totalNeeded;
}

function loadQuestion() {
  const q = questions[index];
  qText.innerHTML = q.text;
  qImage.src = q.img;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !locked[index];
  submitBtn.disabled = true;

  selectedLetters = [];
  blanks = [];

  const spots = document.querySelectorAll(".blankSpot");
  spots.forEach((spot, i) => {
    const ans = Array.isArray(q.answer) ? q.answer[i] : q.answer;
    const blank = createBlank(ans.length, i);
    spot.replaceWith(blank);
    blanks.push(blank);
  });

  optionsBox.innerHTML = "";
  const tileBox = document.createElement("div");
  tileBox.className = "tiles";
  optionsBox.appendChild(tileBox);

  if (locked[index]) {
    submitBtn.disabled = true;
    nextBtn.disabled = false;

    const saved = userAnswers[index];
    let pos = 0;
    blanks.forEach((row, i) => {
      const ans = Array.isArray(q.answer) ? q.answer[i] : q.answer;
      for (let j = 0; j < ans.length; j++) {
        row.children[j].textContent = saved[pos++];
      }
    });
    return;
  }

  const letters = getLetters(q.answer);

  letters.forEach((letter) => {
    const t = document.createElement("div");
    t.className = "tile";
    t.textContent = letter;

    t.onclick = () => {
      let totalNeeded = blanks.reduce((s, b) => s + b.children.length, 0);
      if (selectedLetters.length >= totalNeeded) return;

      selectedLetters.push(letter);

      let pos = selectedLetters.length - 1;
      for (const row of blanks) {
        if (pos < row.children.length) {
          row.children[pos].textContent = letter;
          break;
        } else pos -= row.children.length;
      }

      t.classList.add("disabled");
      submitBtn.disabled = selectedLetters.length !== totalNeeded;
    };

    tileBox.appendChild(t);
  });
}

submitBtn.onclick = () => {
  const q = questions[index];

  if (!Array.isArray(q.answer)) {
    const userWord = selectedLetters.join("");
    if (userWord === q.answer) {
      handleCorrect(userWord);
    } else {
      handleWrong();
    }
    return;
  }

  let pos = 0;
  let userWords = [];

  q.answer.forEach((ans) => {
    const size = ans.length;
    const word = selectedLetters.slice(pos, pos + size).join("");
    userWords.push(word);
    pos += size;
  });

  const sortedUser = [...userWords].sort().join(",");
  const sortedCorrect = [...q.answer].sort().join(",");

  if (sortedUser === sortedCorrect) {
    handleCorrect(selectedLetters.join(""));
  } else {
    handleWrong();
  }
};

function handleCorrect(userWord) {
  locked[index] = true;
  userAnswers[index] = userWord;

  score++;
  scoreBox.textContent = `Score: ${score}`;

  submitBtn.disabled = true;
  nextBtn.disabled = false;

  showFeedback(true);

  if (index === questions.length - 1) setTimeout(showFinal, 1500);
}

function handleWrong() {
  showFeedback(false);
  setTimeout(() => loadQuestion(), 900);
}

function showFeedback(ok) {
  const popup = document.getElementById("feedbackPopup");
  const media = document.getElementById("popupMedia");
  const txt = document.getElementById("feedbackText");
  media.innerHTML = "";
  txt.className = "";

  if (ok) {
    const img = document.createElement("img");
    img.src = questions[index].img;
    img.className = "popup-img";
    media.appendChild(img);
    txt.textContent = "Correct! ✅";
    txt.classList.add("correct");
    speak("Correct");
  } else {
    media.innerHTML = "<div class='popup-emoji'>😢</div>";
    txt.textContent = "Wrong! ❌";
    txt.classList.add("wrong");
    speak("Wrong");
  }

  popup.style.display = "flex";
  setTimeout(() => (popup.style.display = "none"), 1400);
}

function showFinal() {
  document.getElementById("finalPopup").style.display = "flex";
  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
  speak(`Congratulations! Your score is ${score}`);
}

function restartQuiz() {
  index = 0;
  score = 0;
  locked.fill(false);
  userAnswers.fill(null);
  scoreBox.textContent = "Score: 0";
  document.getElementById("finalPopup").style.display = "none";
  loadQuestion();
}

prevBtn.onclick = () => {
  index--;
  loadQuestion();
};

nextBtn.onclick = () => {
  index++;
  loadQuestion();
};

document.getElementById("restartBtn")?.addEventListener("click", restartQuiz);

loadQuestion();