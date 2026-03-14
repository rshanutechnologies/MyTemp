//================= QUESTIONS =================
const questions = [
  {
    q: "Q.1 The upper arm is made of a long bone called the ____.",
    a: "humerus",
    img: "../assets/images/humerus.png",
  },
  {
    q: "Q.2 The lower leg has two bones namely ____ and ____.",
    a: "tibia fibula",
    img: "../assets/images/tibiafibula.png",
  },
  {
    q: "Q.3 Bones are held together at joints by ____.",
    a: "ligaments",
    img: "../assets/images/ligaments.png",
  },
  {
    q: "Q.4 The backbone protects the ____.",
    a: "spinal cord",
    img: "../assets/images/spinalcord2.png",
  },
  {
    q: "Q.5 The long bones of the arms and the legs are filled with ____ at the centre.",
    a: "bone marrow",
    img: "../assets/images/bonemarrow.png",
  },
];

let index = 0;
let score = 0;
const answered = Array(questions.length).fill(false);

// ================= ELEMENTS =================
const qEl = document.getElementById("question");
const img = document.getElementById("image");
const letters = document.getElementById("letters");
const indicator = document.getElementById("indicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const checkBtn = document.getElementById("checkBtn");

// ================= INPUT FLOW =================
letters.addEventListener("input", (e) => {
  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(e.target);

  if (e.target.value && idx < inputs.length - 1) {
    inputs[idx + 1].readOnly = false;
    inputs[idx + 1].focus();
  }

  checkBtn.disabled = inputs.some((i) => !i.value);
});

letters.addEventListener("keydown", (e) => {
  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(e.target);

  if (e.key === "Backspace" && !e.target.value && idx > 0) {
    inputs[idx - 1].focus();
  }
});

// ================= SPEAK =================
// function speak(t) {
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }
function speak(t) {
  speechSynthesis.cancel(); // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25; // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

// ================= POPUP (UPGRADED) =================
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if (isCorrect) {
    popup.className = "popup correct";
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    popup.className = "popup wrong";
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
    `Score: ${score}/${questions.length}`;

  document.getElementById("stars").textContent = "⭐".repeat(score);
}

// ================= LOAD QUESTION =================
function load() {
  const q = questions[index];

  qEl.textContent = q.q;
  img.src = q.img;
  indicator.textContent = `Question ${index + 1} of ${questions.length}`;

  letters.innerHTML = "";

  const words = q.a.split(" ");

  words.forEach((word, wi) => {
    const wordBox = document.createElement("div");
    wordBox.className = "word-group";

    [...word].forEach(() => {
      const input = document.createElement("input");
      input.maxLength = 1;
      wordBox.appendChild(input);
    });

    letters.appendChild(wordBox);

    if (wi < words.length - 1) {
      const gap = document.createElement("div");
      gap.className = "word-gap";
      letters.appendChild(gap);
    }
  });

  if (answered[index]) {
    const words = q.a.split(" ");
    const groups = letters.querySelectorAll(".word-group");

    groups.forEach((group, wi) => {
      const lettersOfWord = words[wi];
      const inputs = group.querySelectorAll("input");

      inputs.forEach((input, li) => {
        input.value = lettersOfWord[li];
        input.readOnly = true;
        input.classList.add("correct");
      });
    });

    nextBtn.disabled = false;
    checkBtn.disabled = true;
  } else {
    [...letters.children].forEach((i, idx) => {
      i.value = "";
      i.readOnly = idx !== 0;
      i.classList.remove("correct");
    });
    letters.children[0].focus();
    nextBtn.disabled = true;
    checkBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
}

// ================= CHECK ANSWER =================
checkBtn.onclick = () => {
  const user = [...letters.querySelectorAll(".word-group")]
    .map((group) =>
      [...group.querySelectorAll("input")].map((i) => i.value).join(""),
    )
    .join(" ")
    .toLowerCase();

  if (user === questions[index].a) {
    answered[index] = true;
    score++;

    [...letters.querySelectorAll("input")].forEach((i) => {
      i.readOnly = true;
      i.classList.add("correct");
    });

    checkBtn.disabled = true;
    nextBtn.disabled = false;

    speak("Correct");
    showPopup(true);

    if (index === questions.length - 1) {
      setTimeout(() => {
        finalPopupShown = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;

        showFinal();
      }, 800);
    }
  } else {
    [...letters.querySelectorAll("input")].forEach((i, idx) => {
      i.value = "";
      i.classList.remove("correct");
      i.readOnly = idx !== 0;
    });

    letters.children[0].focus();
    checkBtn.disabled = true;

    speak("Wrong");

    showPopup(false);
  }
};

// ================= NAVIGATION =================
prevBtn.onclick = () => {
  index--;
  load();
};

nextBtn.onclick = () => {
  index++;
  load();
};

function restart() {

  index = 0;
  score = 0;

  answered.fill(false);

  document.getElementById("finalPopup").style.display = "none";

  load();
}

// ================= START =================
load();
