const questions = [
  {
   q: "Q.1 The upper arm is made of a long bone called the ____.",
    a: "humerus",
    a_mobile: "humerus",
   img: "../assets/images/humerusUpeerArm.png",
  },
  {
   q: "Q.2 The lower leg has two bones namely ____ and ____.",
    a: "tibia fibula",
    a_mobile: "tibia fibula",
    img: "../assets/images/tibiafibula.png",
  },
  {
    q: "Q.3 Bones are held together at joints by ____.",
    a: "ligaments",
    a_mobile: "ligam ents", // ok if you want 2 rows
  img: "../assets/images/ligamentsNew.png",
  },
  {
   q: "Q.4 The backbone protects the ____.",
    a: "spinal cord",
    a_mobile: "spinal cord",
   img: "../assets/images/spinalcord2.png",
  },
  {
   q: "Q.5 The long bones of the arms and the legs are filled with ____ at the centre.",
    a: "bone marrow",
    a_mobile: "bone marrow",
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


function isMobile() {
  return window.innerWidth <= 768;
}

// ================= INPUT FLOW =================
letters.addEventListener("input", (e) => {
  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(e.target);

  if (e.target.value && idx < inputs.length - 1) {
    inputs[idx + 1].readOnly = false;
    inputs[idx + 1].focus();
  }

checkBtn.disabled = inputs.some((i) => !i.value.trim());
});

letters.addEventListener("keydown", (e) => {
  const inputs = [...letters.querySelectorAll("input")];
  const idx = inputs.indexOf(e.target);

  // ❌ block SPACE
  if (e.key === " ") {
    e.preventDefault();
    return;
  }

  if (e.key === "Backspace" && !e.target.value && idx > 0) {
    inputs[idx - 1].focus();
  }
});

// ❌ block paste
letters.addEventListener("paste", (e) => e.preventDefault());

// ❌ block drag/drop (images or text)
letters.addEventListener("drop", (e) => e.preventDefault());
letters.addEventListener("dragover", (e) => e.preventDefault());

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

 const answer = isMobile() ? (q.a_mobile || q.a) : q.a;
const words = answer.split(" ");
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
 const answer = isMobile() ? (q.a_mobile || q.a) : q.a;
const words = answer.split(" ");
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
    [...group.querySelectorAll("input")]
      .map((i) => i.value.trim())
      .join("")
  )
  .join(" ")
  .trim();
const correctAnswer = (
  isMobile()
    ? (questions[index].a_mobile || questions[index].a)
    : questions[index].a
)
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

if (user === correctAnswer) {
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
