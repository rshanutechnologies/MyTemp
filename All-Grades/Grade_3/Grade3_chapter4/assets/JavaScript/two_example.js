
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

  /* FIX HERE */
  popupText.className = final
    ? "popup-box final-wide"
    : "popup-box";

  popupText.innerHTML = html;

  if(!final){
    setTimeout(()=> popup.style.display = "none", 1000);
  }
}


/* ✅ QUESTIONS + IMAGE OPTIONS PATH FORMAT */
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

const solvedMap = {}; // keep state

const questionTextEl = document.getElementById("questionText");
const optionsBoxEl = document.getElementById("optionsBox");
const dropAreaEl = document.getElementById("dropArea");
const dropItemsEl = document.getElementById("dropItems");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function renderQuestion(){
  const q = quizData[current];
  questionTextEl.textContent = q.question + " ________  ________";

  prevBtn.disabled = current === 0;

  if(!solvedMap[current]){
    solvedMap[current] = { solved:false, correctSet:new Set(), dropped:[] };
  }

  const state = solvedMap[current];
  nextBtn.disabled = !state.solved;

  optionsBoxEl.innerHTML = "";
  dropItemsEl.innerHTML = "";

  // restore dropped chips
  state.dropped.forEach(txt=>{
    const chip = document.createElement("div");
    chip.className = "drop-chip";
    chip.textContent = txt;
    dropItemsEl.appendChild(chip);
  });

  // render options
  q.options.forEach((opt, idx)=>{
    const div = document.createElement("div");
    div.className = "option";
    div.draggable = !state.solved;
    div.dataset.index = idx;

    div.innerHTML = `
      <img src="${opt.img}" alt="">
      <div class="opt-text">${opt.text}</div>
    `;

    if(state.dropped.includes(opt.text)){
      div.classList.add("disabled");
      div.draggable = false;
    }

    if(state.correctSet.has(opt.text)){
      div.classList.add("correct-picked");
      div.draggable = false;
    }

    // disable wrong after solved
    if(state.solved && !opt.correct){
      div.classList.add("disabled");
      div.draggable = false;
    }

    div.addEventListener("dragstart",(e)=>{
      if(div.classList.contains("disabled")) return;
      e.dataTransfer.setData("text/plain", idx);
    });

    optionsBoxEl.appendChild(div);
  });
}
/* HOME BUTTON REDIRECT */
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index1.html";
});

/* ✅ DROP EVENTS */
dropAreaEl.addEventListener("dragover",(e)=>{
  e.preventDefault();
  dropAreaEl.classList.add("dragover");
});
dropAreaEl.addEventListener("dragleave",()=>{
  dropAreaEl.classList.remove("dragover");
});
dropAreaEl.addEventListener("drop",(e)=>{
  e.preventDefault();
  dropAreaEl.classList.remove("dragover");

  const q = quizData[current];
  const state = solvedMap[current];

  if(state.solved) return;

  const idx = parseInt(e.dataTransfer.getData("text/plain"), 10);
  if(Number.isNaN(idx)) return;

  const opt = q.options[idx];

  if(state.dropped.length >= 2) return;
  if(state.dropped.includes(opt.text)) return;

  // ✅ Correct Drop
  if(opt.correct){
    state.dropped.push(opt.text);
    state.correctSet.add(opt.text);

    const chip = document.createElement("div");
    chip.className = "drop-chip";
    chip.textContent = opt.text;
    dropItemsEl.appendChild(chip);

    // correct popup every time
    speakText("Correct");
    showPopup(`
  <div class="popup-correct">
    <span class="check">✅ Correct</span>
    <span class="happy">😊</span>
    <div class="stars">${"⭐".repeat(current + 1)}</div>
  </div>
`);


    // highlight correct option
    const optionDivs = document.querySelectorAll(".option");
    optionDivs[idx].classList.add("correct-picked");
    optionDivs[idx].draggable = false;

    // ✅ If 2 correct → solved
    if(state.correctSet.size === 2){
      state.solved = true;
      score++;
      nextBtn.disabled = false;

      // disable all wrong options
      const optionEls = document.querySelectorAll(".option");
      optionEls.forEach((el, i)=>{
        if(!q.options[i].correct){
          el.classList.add("disabled");
          el.draggable = false;
        }
      });

      // ✅ Auto final popup if last question
      if(current === quizData.length - 1){
        setTimeout(showFinalPopup, 1100);
      }
    }

  }else{
    // ❌ Wrong Drop
    speakText("Wrong");
  showPopup(`
  <div class="popup-wrong">
    <span class="cross">❌ Wrong</span>
    <span class="sad">😢</span>
    <div class="tip">💡 You can do it!</div>
  </div>
`);


  }
});

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

/* ✅ FINAL SCORE POPUP AUTO */
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

/* start */
renderQuestion();

