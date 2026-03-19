/* ================= TF ANSWERS ================= */

let tfAnswers = [];


/* ================= RENDER TF ================= */

function renderTF(question){

  answerArea.innerHTML = "";

  /* create container */
  const container = document.createElement("div");
  container.classList.add("tf-container");

  /* TRUE BUTTON */
  const trueBtn = document.createElement("button");
  trueBtn.classList.add("option-btn","tf-option","true-btn");
  trueBtn.innerHTML = "✓";
  trueBtn.setAttribute("aria-label","True");
  trueBtn.title = "True";
  trueBtn.dataset.value = "True";

  /* FALSE BUTTON */
  const falseBtn = document.createElement("button");
  falseBtn.classList.add("option-btn","tf-option","false-btn");
  falseBtn.innerHTML = "✖";
  falseBtn.setAttribute("aria-label","False");
  falseBtn.title = "False";
  falseBtn.dataset.value = "False";

  container.appendChild(trueBtn);
  container.appendChild(falseBtn);
  answerArea.appendChild(container);

  /* ================= TRUE CLICK ================= */
  trueBtn.addEventListener("click", () => {
    checkTFAnswer("True", question, trueBtn, falseBtn);
  });

  /* ================= FALSE CLICK ================= */
  falseBtn.addEventListener("click", () => {
    checkTFAnswer("False", question, falseBtn, trueBtn);
  });

  /* ===== RESTORE STATE WHEN PRESSING PREV ===== */

  if (tfAnswers[currentQuestionIndex]) {

    const selected = tfAnswers[currentQuestionIndex];

    trueBtn.disabled = true;
    falseBtn.disabled = true;

    if (selected === "True") {
      falseBtn.style.opacity = "0.4";
    } else {
      trueBtn.style.opacity = "0.4";
    }

    nextBtn.disabled = false;
  }

}


/* ================= ANSWER CHECK ================= */

function checkTFAnswer(selected, question, btn, otherBtn){

  if (tfAnswers[currentQuestionIndex]) return;

  if (selected === question.answer){

    showPopup(true);
    fireConfetti();
    score++;

    tfAnswers[currentQuestionIndex] = selected;

    /* IMPORTANT: mark question as answered */
    userAnswers[currentQuestionIndex] = selected;

    /* disable wrong option and fade it */
    otherBtn.disabled = true;
    otherBtn.style.opacity = "0.4";

    /* keep selected button disabled to prevent re-click */
    btn.disabled = true;

    nextBtn.disabled = false;

    /* final question */
    if (currentQuestionIndex === filteredQuestions.length - 1){
      setTimeout(() => {
        showFinalPopup(score, filteredQuestions.length);
      }, 1200);
    }

  } else {
    showPopup(false);
  }
}