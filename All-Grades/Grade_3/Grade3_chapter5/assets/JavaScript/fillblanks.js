const questions = [
  {
    q: "Q1. There are  __________ factors that affect our environment.",
    a: ["biotic", "abiotic"],
    img: "../assets/images/fb1-img.png",
  },
  {
    q: "Q2. Everything that surrounds and affects a living thing forms its __________",
    a: "environment",
    img: "../assets/images/fb2-img.png",
  },
  {
    q: "Q3. The biotic components depend on the abiotic factors. This is called  ___________",
    a: "interdependence",
    img: "../assets/images/fb3-img.png",
  },
  {
    q: "Q4. Plants take in the __________from the soil, with the help of water, through their ___________",
    a: ["minerals", "roots"],
    img: "../assets/images/fb4-img.png",
  },
  {
    q: "Q5. The living things in the environment are called the ______________ components",
    a: "biotic",
    img: "../assets/images/fb5-img.png",
  },
];
const singleInputBox = document.getElementById("singleInputBox");
const doubleInputBox = document.getElementById("doubleInputBox");
const singleCheck = document.getElementById("singleCheck");
const doubleCheck = document.getElementById("doubleCheck");

const input1 = document.getElementById("answerInput1");
const input2 = document.getElementById("answerInput2");
const check1 = document.getElementById("checkBtn1");
const check2 = document.getElementById("checkBtn2");

let index = 0,
  score = 0;
const answers = Array(5).fill(null);

const qImg = document.getElementById("qImg");
const qText = document.getElementById("qText");
const qCount = document.getElementById("qCount");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");

function updateButtons() {

  // ✅ If already answered → allow NEXT only
  if (answers[index]) {
    check.disabled = true;
    check1.disabled = true;
    check2.disabled = true;
    next.disabled = false;
    return;
  }

  // ✅ SINGLE INPUT
  if (!input.disabled) {
    check.disabled = !input.value.trim();
  } else {
    check.disabled = true;
  }

  // ✅ DOUBLE INPUT
  if (!input1.disabled) {
    check1.disabled = !input1.value.trim();
  } else {
    check1.disabled = true;
  }

  if (!input2.disabled) {
    check2.disabled = !input2.value.trim();
  } else {
    check2.disabled = true;
  }

  // 🔒 LOCK NEXT UNTIL CORRECT
  next.disabled = true;
}

function load() {
  const q = questions[index];
  next.disabled = true;
  qImg.src = q.img;
  qText.textContent = q.q;
  qCount.textContent = ``;

  prev.disabled = index === 0;
 

  // RESTORE SAVED ANSWER
  if (answers[index]) {

    input.value = answers[index];
    input.disabled = true;
    check.disabled = true;

  } else {

    input.value = "";
    input.disabled = false;
    check.disabled = true;

  }
  if (index === 0 || index === 3) {

    singleInputBox.style.display = "none";
    singleCheck.style.display = "none";

    doubleInputBox.style.display = "flex";
    doubleCheck.style.display = "flex";

    if (answers[index]) {

      const parts = answers[index].split(" ");

      input1.value = parts[0] || "";
      input2.value = parts[1] || "";

      input1.disabled = true;
      input2.disabled = true;

      check1.disabled = true;
      check2.disabled = true;

      next.disabled = false;

    } else {

      input1.value = "";
      input2.value = "";

      input1.disabled = false;
      input2.disabled = false;

      check1.disabled = true;
      check2.disabled = true;

      next.disabled = true;
    }

  } else {
    singleInputBox.style.display = "flex";
    singleCheck.style.display = "flex";

    doubleInputBox.style.display = "none";
    doubleCheck.style.display = "none";
  }
  input.focus();
  updateButtons();
}


input.oninput = updateButtons;

/* ✅ ADD BELOW THIS */

input1.oninput = updateButtons;
input2.oninput = updateButtons;

function speak(t) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(t);

  msg.lang = "en-UK";
  msg.volume = 0.25;
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
check.onclick = () => {
  const typed = input.value.trim().toLowerCase();

  if (typed === questions[index].a.toLowerCase()) {
    answers[index] = typed;
    score++;

    speak("Correct");
    showPopup(true);

    input.disabled = true;
    check.disabled = true;
    next.disabled = false;
    updateButtons();

    // 🔥 show final popup automatically on last question
    if (index === questions.length - 1) {
      setTimeout(showFinal, 1000);
    }

  } else {
    speak("Wrong");
    showPopup(false);
    input.value = "";
    check.disabled = true;
  }
};
check1.onclick = () => {

  const val1 = input1.value.trim().toLowerCase();
  const correct1 = questions[index].a[0].toLowerCase();

  if (val1 === correct1) {
    speak("Correct");
    showPopup(true);
    input1.disabled = true;

  } else {
    speak("Wrong");
    showPopup(false);
    input1.value = "";
  }

  updateButtons();   // ⭐ ADD THIS
  checkBothFilled();
};
check2.onclick = () => {

  const val2 = input2.value.trim().toLowerCase();
  const correct2 = questions[index].a[1].toLowerCase();

  if (val2 === correct2) {
    speak("Correct");
    showPopup(true);
    input2.disabled = true;

  } else {
    speak("Wrong");
    showPopup(false);
    input2.value = "";
  }

  updateButtons();   // ⭐ ADD THIS
  checkBothFilled();
};
function checkBothFilled() {

  if (input1.disabled && input2.disabled) {

    answers[index] = input1.value + " " + input2.value;
    score++;

    next.disabled = false;
  }

  updateButtons();   // ⭐ ADD THIS
}
prev.onclick = () => {
  index--;
  load();
};


next.onclick = () => {
  if (!answers[index]) return;

  if (index === questions.length - 1) {
    showFinal();
    return;
  }

  index++;
  load();
};



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
}


load();
