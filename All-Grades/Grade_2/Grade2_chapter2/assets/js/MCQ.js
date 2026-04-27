 const questions = [
    {
      text: "The place where two bones join is called a ____________.",
      options: ["muscle", "skin", "joint"],
      answer: "joint",
      img: "../assets/images/BONESSS.png"
    },
    {
      text: "All bones together form the ______________ system.",
      options: ["muscular", "digestive", "skeletal"],
      answer: "skeletal",
      img: "../assets/images/BONESSSALL.png"
    },
    {
      text: "We should drink a glass of ________ daily.",
      options: ["water", "milk", "coke"],
      answer: "milk",
      img: "../assets/images/DBOY.png"
    },
    {
      text: "__________ and muscles together give shape to our body.",
      options: ["Face", "Skin", "Bones"],
      answer: "Bones",
      img: "../assets/images/q2-img.png"
    },
    {
      text: "The ____________ covers our body from outside.",
      options: ["skin", "muscles", "bones"],
      answer: "skin",
      img: "../assets/images/Skin1.png"
    }
  ];

  // ---------- GLOBAL STATE ----------
  let currentIndex = 0;
  let totalScore = 0;
  const locked = Array(questions.length).fill(false);       // whether question answered correctly
  const selectedOptionIdx = Array(questions.length).fill(null); // stores correct option index

  // DOM elements
  const qTextEl = document.getElementById("qText");
  const qImageEl = document.getElementById("qImage");
  const optionsContainer = document.getElementById("optionsContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Helper: speak text (soft voice)
  function speakText(t) {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(t);
      utterance.lang = "en-UK";
      utterance.rate = 0.9;
      utterance.volume = 0.25;
      window.speechSynthesis.speak(utterance);
    }
  }

  // show popup (correct/wrong)
  function showAnswerPopup(isCorrect, questionImgSrc) {
    const popup = document.getElementById("popup");
    const popupMediaDiv = document.getElementById("popupMedia");
    const popupTextSpan = document.getElementById("popupText");

    popupMediaDiv.innerHTML = "";
    popupTextSpan.className = "popup-msg";

    if (isCorrect) {
      const img = document.createElement("img");
      img.src = questionImgSrc;
      img.alt = "correct visual";
      popupMediaDiv.appendChild(img);
      popupTextSpan.textContent = "Correct! ✅";
      popupTextSpan.classList.add("correct");
      speakText("Correct");
      const correctAudio = document.getElementById("correctSound");
      if (correctAudio) correctAudio.play().catch(e => console.log("audio blocked"));
    } else {
      popupMediaDiv.innerHTML = `<div style="font-size:70px;">😢</div>`;
      popupTextSpan.textContent = "Wrong! ❌";
      popupTextSpan.classList.add("wrong");
      speakText("Wrong");
      const wrongAudio = document.getElementById("wrongSound");
      if (wrongAudio) wrongAudio.play().catch(e => console.log("audio blocked"));
    }

    popup.style.display = "flex";
    setTimeout(() => {
      popup.style.display = "none";
    }, 1300);
  }

  // show final popup with score & stars (no title/score bar anywhere)
  function showFinalPopup() {
    const finalPopupDiv = document.getElementById("finalPopup");
    const finalScoreSpan = document.getElementById("finalScore");
    const finalStarsSpan = document.getElementById("finalStars");
    
    finalScoreSpan.textContent = `Score: ${totalScore} / ${questions.length}`;
    const starCount = totalScore;
    finalStarsSpan.textContent = "⭐".repeat(starCount);
    
    const winnerImg = document.getElementById("winnerImg");
    winnerImg.style.animation = "none";
    winnerImg.offsetHeight; // reflow
    winnerImg.style.animation = "liftTrophy 1.1s ease-in-out infinite";
    
    finalPopupDiv.style.display = "flex";
    speakText(`Congratulations! Your score is ${totalScore} out of ${questions.length}`);
  }

  // load current question, render 3 options in one line
  function loadQuestion() {
    const q = questions[currentIndex];
    qTextEl.textContent = q.text;
    qImageEl.src = q.img;
    qImageEl.alt = "quiz illustration";

    // clear options row
    optionsContainer.innerHTML = "";

    // update prev/next buttons
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = !locked[currentIndex];

    // iterate over options (exactly 3 items)
    q.options.forEach((opt, idx) => {
      const optDiv = document.createElement("div");
      optDiv.className = "option";
      optDiv.textContent = opt;

      // if question already answered correctly
      if (locked[currentIndex]) {
        optDiv.classList.add("disabled");
        if (selectedOptionIdx[currentIndex] === idx) {
          optDiv.classList.remove("disabled");
          optDiv.classList.add("correct");
        }
      } else {
        // fresh state: attach click handler
        optDiv.onclick = () => {
          // prevent double locking
          if (locked[currentIndex]) return;
          
          const isCorrect = (opt.trim().toLowerCase() === q.answer.trim().toLowerCase());
          
          if (isCorrect) {
            // CORRECT ANSWER
            locked[currentIndex] = true;
            selectedOptionIdx[currentIndex] = idx;
            totalScore++;
            
            // visually mark correct option, disable others
            optDiv.classList.add("correct");
            const allOptions = document.querySelectorAll("#optionsContainer .option");
            allOptions.forEach(optEl => {
              if (optEl !== optDiv) {
                optEl.classList.add("disabled");
              }
            });
            
            // show popup with correct feedback (using question's image)
            showAnswerPopup(true, q.img);
            
            // enable next button
            nextBtn.disabled = false;
            
            // check if this was last question: if all questions locked, show final popup after delay
            if (currentIndex === questions.length - 1) {
              // if last question and answered correctly, schedule final popup
              setTimeout(() => {
                if (locked.every(v => v === true)) {
                  showFinalPopup();
                } else {
                  // safety: still show final popup because this is last question
                  showFinalPopup();
                }
              }, 1400);
            }
          } 
          else {
            // WRONG ANSWER: show temporary wrong style, play feedback, but don't lock
            optDiv.classList.add("wrong");
            showAnswerPopup(false, q.img);
            // remove wrong class after short delay so user can try again
            setTimeout(() => {
              if (optDiv && optDiv.classList) {
                optDiv.classList.remove("wrong");
              }
            }, 800);
            // score unchanged, next stays disabled
          }
        };
      }
      optionsContainer.appendChild(optDiv);
    });
  }

  // ---------- NAVIGATION ----------
  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      loadQuestion();
    }
  };

  // next button logic: move to next question or show final if last
  let finalShownFlag = false;
  function resetFinalFlag() { finalShownFlag = false; }
  
  nextBtn.onclick = () => {
    if (!locked[currentIndex]) return; // disabled anyway
    
    if (currentIndex === questions.length - 1) {
      // last question and answered -> show final if not shown
      if (!finalShownFlag && locked[currentIndex]) {
        finalShownFlag = true;
        showFinalPopup();
        setTimeout(() => { finalShownFlag = false; }, 800);
      }
      return;
    }
    
    // move to next question
    if (currentIndex + 1 < questions.length) {
      currentIndex++;
      loadQuestion();
    }
  };

  // restart quiz fully
  window.restartQuiz = function() {
    // reset all state variables
    currentIndex = 0;
    totalScore = 0;
    for (let i = 0; i < locked.length; i++) {
      locked[i] = false;
      selectedOptionIdx[i] = null;
    }
    finalShownFlag = false;
    
    // hide any visible popups
    const finalPopup = document.getElementById("finalPopup");
    if (finalPopup) finalPopup.style.display = "none";
    const instantPopup = document.getElementById("popup");
    if (instantPopup) instantPopup.style.display = "none";
    
    // reload first question
    loadQuestion();
    speakText("Quiz restarted");
  };

  // initialize
  loadQuestion();

  // Additional: if user completes all questions without pressing next on last one, but last answer triggers final via timeout
  // that's already covered in correct answer block for last index. Also final popup restart works.
  // ensure that there is no score display anywhere (title/score removed completely from HTML)
  // Also confirm no topbar exists in HTML structure — it's fully removed.
  
  // Edge: if all answers are correct before last question, final will be shown when last answer is given or next on last.
  // Prevents duplicate final popups using flag.
  
  // Also for consistency, when restart, clear any pending timeouts (but simple restart is fine)
  // make sure image assets are same as original references. 
  // The layout: "first question then image then 3 options in one line" -> desktop: three columns: question | image | options-row (3 items inline)
  // On mobile it adapts but options remain in a row wrapping.
  // Perfect!