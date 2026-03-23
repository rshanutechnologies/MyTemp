
    // const correctSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3");
    // const wrongSound   = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3");

    // function speakText(text){
    //   if(!("speechSynthesis" in window)) return;
    //   window.speechSynthesis.cancel();
    //   const utter = new SpeechSynthesisUtterance(text);
    //   utter.rate = 1;
    //   utter.pitch = 1.08;
    //   utter.volume = 1;
    //   window.speechSynthesis.speak(utter);
    // }

    function speakText(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

const quizData = [
{
  // title: "  Pick the correct option ",
  question: "Q.1The process by which a plant makes its own food in the presence of sunlight is called _____________________.",
  image: "../assets/images/MCQ-1.png",
  options: [
    { id: "a", label: "ventation",   image: "../assets/images/venation.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "photosynthesis", image: "../assets/images/photosynthesis1.png", correct: true, theme: "bg-orange" },
    { id: "c", label: "respiration", image: "../assets/images/respiration.png", correct: false, theme: "bg-green" },
    { id: "d", label: " phyllotaxy ", image: "../assets/images/phyllotaxy.png", correct: false, theme: "bg-yellow" },
  ]
},

{
  //  title: "  Pick the correct option ",
  question: "Q.2 Which of the following is the main source of energy",
  image: "../assets/images/MCQ-2",
  options: [
    { id: "a", label: "Plants", image: "../assets/images/plants.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "Animals", image: "../assets/images/animals.png", correct: false, theme: "bg-green" },
    { id: "c", label: "Sunlight", image: "../assets/images/sunlight1.png", correct: true, theme: "bg-orange" },
    { id: "d", label: "Chlorophyll", image: "../assets/images/chlorophyll.png", correct: false, theme: "bg-yellow" },
  ]
},

{
  // title: "  Pick the correct option ",
  question: "Q.3 Which of the following is the flat part of a leaf?",
  image: "../assets/images/MCQ-3.png",
  options: [
    { id: "a", label: "Lamina", image: "../assets/images/mcq3-1.png", correct: true, theme: "bg-blue" },
    { id: "b", label: "Apex", image: "../assets/images/plants.png", correct: false, theme: "bg-green" },
    { id: "c", label: "Vein", image: "../assets/images/mcq3-3.png", correct: false, theme: "bg-orange" },
    { id: "d", label: "Chlorophyll", image: "../assets/images/chlorophyll.png", correct: false, theme: "bg-yellow" },
  ]
},

{
  //  title: "  Pick the correct option ",
  question: "Q.4 In _____________ venation, the veins run parallel to one another",
  image: "../assets/images/MCQ-4",
  options: [
    { id: "a", label: "Vertical", image: "../assets/images/plants.png", correct: false, theme: "bg-green" },
    { id: "b", label: "Linear", image: "../assets/images/respiration.png", correct: false, theme: "bg-blue" },
    { id: "c", label: "Parallel", image: "../assets/images/mcq4-3.png", correct: true, theme: "bg-orange" },
    { id: "d", label: "Reticulate", image: "../assets/images/Reticulate.png", correct: false, theme: "bg-yellow" },
  ]
},

{
   title: "  Pick the correct option ",
  question: "Q.5 Which of the following has stored food in its stem?",
  image: "../assets/images/MCQ-5",
  options: [
    { id: "a", label: "cauliflower", image: "../assets/images/cauliflower.png", correct: false, theme: "bg-blue" },
    { id: "b", label: "potato", image: "../assets/images/potatoo.png", correct: true, theme: "bg-orange" },
    { id: "c", label: "spinach", image: "../assets/images/spinach.png", correct: false, theme: "bg-yellow" },
    { id: "d", label: "carrot", image: "../assets/images/carrots.png", correct: false, theme: "bg-green" },
  ]
}
];

    let current = 0;
    let score = 0;
    const solvedMap = {};

    const quizTitleEl = document.getElementById("quizTitle");
    const questionTextEl = document.getElementById("questionText");
    const questionImageEl = document.getElementById("questionImage");
    const optionsWrapEl = document.getElementById("optionsWrap");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    const popup = document.getElementById("popup");
    const popupBox = document.getElementById("popupBox");

    function showPopup(html, final=false){
      popup.style.display = "flex";
      popupBox.className = final ? "popup-box popup-final" : "popup-box";
      popupBox.innerHTML = html;
      if(!final) setTimeout(() => popup.style.display = "none", 1000);
    }

    function renderQuestion(){
      const q = quizData[current];
      const solved = solvedMap[current]?.solved === true;
      const correctId = solvedMap[current]?.correctId || null;

      quizTitleEl.textContent = q.title;
      questionTextEl.textContent = q.question;
      questionImageEl.src = q.image;

      prevBtn.disabled = current === 0;
      nextBtn.disabled = !solved;

      optionsWrapEl.innerHTML = "";

      q.options.forEach(opt => {
        const optionDiv = document.createElement("div");
        optionDiv.className = `option ${opt.theme}`;

     optionDiv.innerHTML = `
  <div class="opt-top">
    <img src="${opt.image}" class="opt-img">
  </div>
  <div class="opt-name">${opt.label}</div>
`;



        if(solved){
          optionDiv.classList.add("disabled");
          if(opt.id === correctId){
            optionDiv.classList.remove("disabled");
            optionDiv.classList.add("correct-highlight");
          }
        }

        optionDiv.addEventListener("click", () => selectOption(opt));
        optionsWrapEl.appendChild(optionDiv);
      });
    }

    function selectOption(opt){
      if(solvedMap[current]?.solved) return;

      if(opt.correct){
        solvedMap[current] = { solved:true, correctId: opt.id };
        score++;

        speakText("Correct");
        correctSound.currentTime = 0;
        correctSound.play();

       showPopup(`
  <div class="popup-correct">
    <span class="check">✅ Correct</span>
    <span class="happy">😊</span>
    <div class="stars">${"⭐".repeat(score)}</div>
  </div>
`);


        renderQuestion();

        if(current === quizData.length - 1){
          setTimeout(() => {
            showPopup(`
          <div class="popup-final-content">
            🎉 Congratulations!
            <span class="emoji">🏆</span>
             <div>You finished the quiz!</div>
            <div class="final-score">
              Score: 5/5
            </div>

            <div class="stars">⭐⭐⭐⭐⭐</div>

             <div class="final-actions">
            <button class="restart" onclick="location.reload()">🔄 Restart</button>
           <button class="home" onclick="goHome()">🏠 Home</button>
          </div>
          </div>
        `, true);
          }, 1100);
        }

      } else {
        speakText("Wrong");
        wrongSound.currentTime = 0;
        wrongSound.play();

        showPopup(`
          <div>
            <div class="popup-title" style="color:#c62828;">❌ Wrong!</div>
            <span class="popup-emoji">😢</span>
            <div class="popup-tip">💡 Try again!</div>
          </div>
        `);
      }
    }

    prevBtn.addEventListener("click", () => {
      if(current > 0){
        current--;
        renderQuestion();
      }
    });

    nextBtn.addEventListener("click", () => {
      if(!solvedMap[current]?.solved) return;
      if(current < quizData.length - 1){
        current++;
        renderQuestion();
      }
    });

    renderQuestion();
  function goHome() {
  window.location.href = "../index.html";
}
