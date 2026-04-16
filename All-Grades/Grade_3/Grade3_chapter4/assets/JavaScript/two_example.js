function speakText(text){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 0.25;
  utter.lang = "en-UK";
  window.speechSynthesis.speak(utter);
}

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function showPopup(html, final=false){
  popup.style.display = "flex";

  popupText.className = final
    ? "popup-box final-wide"
    : "popup-box";

  popupText.innerHTML = html;

  if(!final){
    setTimeout(()=> popup.style.display = "none", 1000);
  }
}

/* QUESTIONS */
const quizData = [
  {
    question: "Q1. Gases that dissolve in water",
    options: [
      { text:"Carbon dioxide", img:"../assets/images/CO2.png", correct:true },
      { text:"Wood", img:"../assets/images/Wood.png", correct:false },
      { text:"Iron", img:"../assets/images/Iron.png", correct:false },
      { text:"Oxygen", img:"../assets/images/oxygen.png", correct:true },
    ]
  },
  {
    question: "Q2. Solids that melt when heated",
    options: [
      { text:"Butter", img:"../assets/images/Butter.png", correct:true },
      { text:"Stone", img:"../assets/images/Stone.png", correct:false },
      { text:"Ice", img:"../assets/images/Ice.png", correct:true },
      { text:"Glass", img:"../assets/images/Glass.png", correct:false }
    ]
  },
  {
    question: "Q3. Liquids that are used at home",
    options: [
      { text:"Milk", img:"../assets/images/Milk (1).png", correct:true },
      { text:"Brick", img:"../assets/images/Brick.png", correct:false },
      { text:"Sand", img:"../assets/images/Sand.png", correct:false },
      { text:"Water", img:"../assets/images/Water.png", correct:true },
    ]
  }
];

let current = 0;
let score = 0;

const solvedMap = {};

const questionTextEl = document.getElementById("questionText");
const optionsBoxEl = document.getElementById("optionsBox");
const dropItemsEl = document.getElementById("dropItems");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* RENDER */
function renderQuestion(){
  const q = quizData[current];
  questionTextEl.textContent = q.question + " ______  ______";

  prevBtn.disabled = current === 0;

  if(!solvedMap[current]){
    solvedMap[current] = { solved:false, correctSet:new Set(), dropped:[] };
  }

  const state = solvedMap[current];
  nextBtn.disabled = !state.solved;

  optionsBoxEl.innerHTML = "";
  dropItemsEl.innerHTML = "";

  // restore selected
  state.dropped.forEach(txt=>{
    const chip = document.createElement("div");
    chip.className = "drop-chip";
    chip.textContent = txt;
    dropItemsEl.appendChild(chip);
  });

  q.options.forEach((opt, idx)=>{
    const div = document.createElement("div");
    div.className = "option";
    div.dataset.index = idx;

    div.innerHTML = `
      <img src="${opt.img}" alt="">
      <div class="opt-text">${opt.text}</div>
    `;

    if(state.dropped.includes(opt.text)){
      div.classList.add("disabled");
    }

    if(state.correctSet.has(opt.text)){
      div.classList.add("correct-picked");
    }

    if(state.solved && !opt.correct){
      div.classList.add("disabled");
    }

    /* ✅ CLICK EVENT */
    div.addEventListener("click", ()=>{
      handleOptionClick(idx);
    });

    optionsBoxEl.appendChild(div);
  });
}

/* CLICK LOGIC */
function handleOptionClick(idx){
  const q = quizData[current];
  const state = solvedMap[current];

  if(state.solved) return;

  const opt = q.options[idx];

  if(state.dropped.length >= 2) return;
  if(state.dropped.includes(opt.text)) return;

  if(opt.correct){
    state.dropped.push(opt.text);
    state.correctSet.add(opt.text);

    const chip = document.createElement("div");
    chip.className = "drop-chip";
    chip.textContent = opt.text;
    dropItemsEl.appendChild(chip);

    speakText("Correct");

    showPopup(`
      <div class="popup-correct">
        <span class="check">✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">${"⭐".repeat(current + 1)}</div>
      </div>
    `);

    // mark correct
    const optionDivs = document.querySelectorAll(".option");
    optionDivs[idx].classList.add("correct-picked");

    if(state.correctSet.size === 2){
      state.solved = true;
      score++;
      nextBtn.disabled = false;

      // disable wrong options
      optionDivs.forEach((el, i)=>{
        if(!q.options[i].correct){
          el.classList.add("disabled");
        }
      });

      if(current === quizData.length - 1){
        setTimeout(showFinalPopup, 1100);
      }
    }

  } else {
    speakText("Wrong");

    showPopup(`
      <div class="popup-wrong">
        <span class="cross">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
    `);
  }
}

/* NAVIGATION */
function nextQuestion(){
  if(!solvedMap[current]?.solved) return;
  if(current < quizData.length - 1){
    current++;
    renderQuestion();
  }
}

function prevQuestion(){
  if(current > 0){
    current--;
    renderQuestion();
  }
}

/* HOME BUTTON */
const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", () => {
  window.location.href = "../index1.html";
});

/* FINAL */
function showFinalPopup(){
  const stars = "⭐".repeat(
    Math.max(1, Math.round((score / quizData.length) * 5))
  );

  showPopup(`
    <div class="popup-final-content">
      🎉 Congratulations!
      <span class="emoji">🏆</span>
      You finished the quiz!
      <div class="final-score">
        Score: <b>${score} / ${quizData.length}</b>
      </div>
      <div class="stars">${stars}</div>
      <button class="restart" onclick="location.reload()">🔄 Restart</button>
    </div>
  `, true);
}

/* START */
renderQuestion();