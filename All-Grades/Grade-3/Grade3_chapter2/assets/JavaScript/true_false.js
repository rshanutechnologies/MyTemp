
  const questions = [
  { q: "Q1. All roots are of the same type.", a: false, img: "../assets/images/dk-1.png"
},
  { q: "Q2. The shoot is the underground part of a plant.", a: false, img: "../assets/images/dk-2.png" },
  { q: "Q3. The stem grows above the ground.", a: true, img: "../assets/images/dk-3.png" },
  { q: "Q4. Fibrous roots have a main root.", a: false, img: "../assets/images/dk-4.png" },
  { q: "Q5. Leaves take in air through stomata.", a: true, img: "../assets/images/dk-5.png" }
];

 

const pillIcons = ["🌱","🌿","🍃","🌸","🌰"];


  let index = 0;
  let score = 0;

  const solved = new Array(questions.length).fill(false);

  const questionEl = document.getElementById("question");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const trueBtn = document.getElementById("trueBtn");
  const falseBtn = document.getElementById("falseBtn");

  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");

  function speakOnly(text){
  if(!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-Uk";
  u.rate = 1;
  u.pitch = 1;
  u.volume = 0.25;   // 🔉 decrease volume (0 to 1)

  speechSynthesis.speak(u);
}
  let popupTimer = null;

function showPopup(html, final=false){
  popup.style.display = "flex";
  popupText.className = final ? "popup-box final-wide" : "popup-box";
  popupText.innerHTML = html;

  // stop previous timer
  if(popupTimer){
    clearTimeout(popupTimer);
    popupTimer = null;
  }

  if(!final){
    popupTimer = setTimeout(()=>{
      popup.style.display="none";
    }, 1000);
  }
}


  function resetOptions(){
    trueBtn.className = "chest";
    falseBtn.className = "chest";
    trueBtn.onclick = () => checkAnswer(true);
    falseBtn.onclick = () => checkAnswer(false);
  }
const imgEl = document.getElementById("questionImg");



  function disableWrongOption(correctValue){
    if(correctValue === true){
      falseBtn.classList.add("disabled");
    }else{
      trueBtn.classList.add("disabled");
    }
  }

  function lockCorrectOption(correctValue){
    if(correctValue === true){
      trueBtn.classList.add("correct-selected");
      trueBtn.onclick = null;
    }else{
      falseBtn.classList.add("correct-selected");
      falseBtn.onclick = null;
    }
  }

 function renderQuestion(){
  questionEl.textContent = questions[index].q;
  imgEl.src = questions[index].img;   // ← ADD THIS LINE

  resetOptions();

  prevBtn.disabled = (index === 0);
  nextBtn.disabled = !solved[index];

  if(solved[index]){
    lockCorrectOption(questions[index].a);
    disableWrongOption(questions[index].a);
    nextBtn.disabled = (index === questions.length - 1);
  }

  renderProgress();
}



function checkAnswer(choice){
  if(solved[index]) return;

  const correct = questions[index].a;

  if(choice === correct){
    solved[index] = true;
    score++;

    speakOnly("Correct");

    showPopup(`
      <div class="popup-correct">
        <span class="check">✔ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">⭐⭐⭐</div>
      </div>
    `);

    if(correct){
      trueBtn.classList.add("correct");
      falseBtn.classList.add("disabled");
    }else{
      falseBtn.classList.add("correct");
      trueBtn.classList.add("disabled");
    }

    if(index < questions.length - 1){
      nextBtn.disabled = false;
    }
    else{
  setTimeout(()=>{
    showPopup(`
      <div class="popup-final-content">
        🎉 Congratulations!
        <span class="emoji">🏆</span>
        You finished the quiz!
        <div class="final-score">
          Score: <b>${score} / ${questions.length}</b>
        </div>
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <button class="restart" onclick="location.reload()">🔄Restart</button>
      </div>
    `, true);

    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }, 900);
}


  }else{
    speakOnly("Wrong");

    showPopup(`
      <div class="popup-wrong">
        <span class="cross">✖ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">Try again!</div>
      </div>
    `);

    if(choice === true){
      trueBtn.classList.add("wrong");
    }else{
      falseBtn.classList.add("wrong");
    }
  }
}


  prevBtn.addEventListener("click", ()=>{
    if(index > 0){
      index--;
      renderQuestion();
    }
  });

  nextBtn.addEventListener("click", ()=>{
    if(index < questions.length - 1 && solved[index]){
      index++;
      renderQuestion();
    }
  });

  renderQuestion();
