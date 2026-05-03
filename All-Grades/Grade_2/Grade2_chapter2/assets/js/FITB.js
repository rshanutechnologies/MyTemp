 const questions = [
      {
        text: "___________ contains calcium that makes bones strong.",
        answer: "MILK",
        img: "../assets/images/BONESSS.png",
      },
      {
        text: "The muscles in our body form the ___________ system.",
        answer: "MUSCULAR",
        img: "../assets/images/q2-F.png",
      },
      {
        text: "The ribcage protects our ___________ and ___________.",
        answer: ["HEART", "LUNGS"],
        img: "../assets/images/ribcage.png",
      },
      {
        text: "___________ help us bend our arms and legs.",
        answer: "JOINTS",
        img: "../assets/images/ArmsLegs.png",
      },
      {
        text: "An adult has ___________ bones.",
        answer: "206",
        img: "../assets/images/q2-img.png",
      },
    ];

    let currentIndex = 0;
    let totalScore = 0;
    let locked = Array(questions.length).fill(false);
    let savedAnswers = Array(questions.length).fill(null);
    let inputElements = [];

    const qText = document.getElementById("qText");
    const qImage = document.getElementById("qImage");
    const inputsContainer = document.getElementById("inputsContainer");
    const submitBtn = document.getElementById("submitBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function speak(t) {
      speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(t);
      msg.lang = "en-UK";
      msg.volume = 0.25;
      msg.rate = 1;
      speechSynthesis.speak(msg);
    }

    // function showFeedback(isCorrect, imgSrc) {
    //   const popup = document.getElementById("feedbackPopup");
    //   const media = document.getElementById("popupMedia");
    //   const txt = document.getElementById("feedbackText");
    //   media.innerHTML = "";
      
    //   if (isCorrect) {
    //     const img = document.createElement("img");
    //     img.src = imgSrc;
    //     img.className = "popup-img";
    //     media.appendChild(img);
    //     txt.textContent = "Correct! ✅";
    //     txt.classList.add("correct");
    //     speak("Correct");
    //     const correctSound = document.getElementById("correctSound");
    //     if (correctSound) correctSound.play().catch(e => console.log);
    //   } else {
    //     media.innerHTML = "<div class='popup-emoji'>😢</div>";
    //     txt.textContent = "Wrong! ❌";
    //     txt.classList.add("wrong");
    //     speak("Wrong");
    //     const wrongSound = document.getElementById("wrongSound");
    //     if (wrongSound) wrongSound.play().catch(e => console.log);
    //   }
      
    //   popup.style.display = "flex";
    //   setTimeout(() => {
    //     popup.style.display = "none";
    //   }, 1400);
    // }
function showFeedback(isCorrect, imgSrc) {
  const popup = document.getElementById("feedbackPopup");
  const media = document.getElementById("popupMedia");
  const txt = document.getElementById("feedbackText");

  media.innerHTML = "";

  // ✅ REMOVE OLD CLASSES FIRST
  txt.classList.remove("correct", "wrong");

  if (isCorrect) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "popup-img";
    media.appendChild(img);

    txt.textContent = "Correct! ✅";
    txt.classList.add("correct");

  } else {
    media.innerHTML = "<div class='popup-emoji'>😢</div>";

    txt.textContent = "Wrong! ❌";
    txt.classList.add("wrong");
  }

  popup.style.display = "flex";
  setTimeout(() => {
    popup.style.display = "none";
  }, 1400);
}
    function showFinalPopup() {
      document.getElementById("finalPopup").style.display = "flex";
      document.getElementById("finalScore").textContent = `Score: ${totalScore} / ${questions.length}`;
      document.getElementById("stars").textContent = "⭐".repeat(totalScore);
      // speak(`Congratulations! Your score is ${totalScore} out of ${questions.length}`);
    }

    function checkAndEnableSubmit() {
      let allFilled = true;
      inputElements.forEach(input => {
        if (!input.value.trim()) {
          allFilled = false;
        }
      });
      submitBtn.disabled = !allFilled;
    }

    function getCurrentAnswers() {
      const q = questions[currentIndex];
      if (Array.isArray(q.answer)) {
        return inputElements.map(input => input.value.trim().toUpperCase());
      } else {
        return inputElements[0].value.trim().toUpperCase();
      }
    }

    function handleCorrect() {
      const q = questions[currentIndex];
      const answers = getCurrentAnswers();
      
      locked[currentIndex] = true;
      if (Array.isArray(q.answer)) {
        savedAnswers[currentIndex] = answers;
      } else {
        savedAnswers[currentIndex] = answers;
      }
      
      totalScore++;
      submitBtn.disabled = true;
      nextBtn.disabled = false;
      
      // Disable inputs and mark them as correct
      inputElements.forEach(input => {
        input.disabled = true;
        input.classList.add("disabled-input");
      });
      
      showFeedback(true, q.img);
      
      if (currentIndex === questions.length - 1) {
        setTimeout(showFinalPopup, 1500);
      }
    }

    function handleWrong() {
      showFeedback(false, questions[currentIndex].img);
      // Clear inputs on wrong answer
      inputElements.forEach(input => {
        input.value = "";
      });
      checkAndEnableSubmit();
    }

    submitBtn.onclick = () => {
      const q = questions[currentIndex];
      const userAnswers = getCurrentAnswers();
      
      let isCorrect = false;
      
      if (Array.isArray(q.answer)) {
        const sortedUser = [...userAnswers].sort();
        const sortedCorrect = [...q.answer].sort();
        isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
      } else {
        isCorrect = userAnswers === q.answer;
      }
      
      if (isCorrect) {
        handleCorrect();
      } else {
        handleWrong();
      }
    };

    function loadQuestion() {
      const q = questions[currentIndex];
      
      // Update question text (replace underscores with input boxes)
      let htmlText = q.text;
      const answerArray = Array.isArray(q.answer) ? q.answer : [q.answer];
      
      // Replace each blank with a placeholder marker
      answerArray.forEach((_, idx) => {
        htmlText = htmlText.replace(/___________/, `<span class="input-placeholder" data-idx="${idx}">______</span>`);
      });
      
      qText.innerHTML = htmlText;
      qImage.src = q.img;
      
      // Clear and rebuild inputs container
      inputsContainer.innerHTML = "";
      inputElements = [];
      
      // Create input boxes for each blank
      answerArray.forEach((answer, idx) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        
        const label = document.createElement("div");
        label.className = "input-label";
        label.textContent = `Answer ${idx + 1}`;
        
    const input = document.createElement("input");
input.type = "text";
input.className = "simple-input";
input.placeholder = "Type here...";


/* ✅ MANUAL TYPING ONLY */
/* ✅ ALLOW NORMAL TYPING */
input.addEventListener("input", () => {
  input.value = input.value.toUpperCase();  // auto uppercase
  checkAndEnableSubmit();
});

/* 🚫 BLOCK EVERYTHING ELSE */
input.addEventListener("paste", e => e.preventDefault());
input.addEventListener("drop", e => e.preventDefault());
input.addEventListener("contextmenu", e => e.preventDefault());
        input.placeholder = "Type here...";
        input.autocomplete = "off";
        
        if (locked[currentIndex] && savedAnswers[currentIndex]) {
          const savedValue = Array.isArray(savedAnswers[currentIndex]) 
            ? savedAnswers[currentIndex][idx] 
            : savedAnswers[currentIndex];
          input.value = savedValue;
          input.disabled = true;
          input.classList.add("disabled-input");
        } else {
          input.disabled = false;
          input.addEventListener("input", checkAndEnableSubmit);
        }
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        inputsContainer.appendChild(inputGroup);
        inputElements.push(input);
      });
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = !locked[currentIndex];
      
      if (!locked[currentIndex]) {
        submitBtn.disabled = true;
        // Check if there are pre-filled values (from wrong answer retry)
        let hasValues = inputElements.some(input => input.value.trim());
        if (hasValues) checkAndEnableSubmit();
      } else {
        submitBtn.disabled = true;
      }
    }

    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
      }
    };

    nextBtn.onclick = () => {
      if (currentIndex + 1 < questions.length) {
        currentIndex++;
        loadQuestion();
      } else if (currentIndex === questions.length - 1 && locked[currentIndex]) {
        showFinalPopup();
      }
    };

    window.restartQuiz = function() {
      currentIndex = 0;
      totalScore = 0;
      locked.fill(false);
      savedAnswers.fill(null);
      document.getElementById("finalPopup").style.display = "none";
      loadQuestion();
      // speak("Quiz restarted");
    };

    // Initial load
    loadQuestion();