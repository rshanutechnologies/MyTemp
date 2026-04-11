/* ✅ TTS ONLY */
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

/* ✅ Popup */
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function showPopup(isCorrect){
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if(isCorrect){
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  }else{
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(()=> popup.style.display="none", 1200);
}

function showFinalPopup(){
  document.getElementById("finalPopup").style.display="flex";
  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;
  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}

/* ✅ Quiz Data */
const quizData = [
  {
    q:"Q1. Primary consumers  __________   __________",
    correct:["Cow","Deer"],
    wrong:["Lion","Eagle"]
  },
  {
    q:"Q2. Secondary consumers  __________   __________",
    correct:["Frog","Lizard"],
    wrong:["Cow","Rabbit"]
  },
  {
    q:"Q3. Scavengers  __________   __________",
    correct:["Vulture","Hyena"],
    wrong:["Deer","Goat"]
  },
  {
    q:"Q4. Decomposers  __________   __________",
    correct:["Bacteria","Fungi"],
    wrong:["Lion","Cat"]
  }
];

let index = 0;
let score = 0;

/* ✅ State */
const solved = quizData.map(() => ({
  picked: [],
  done: false
}));

/* ✅ Elements */
const qText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const dropZone = document.getElementById("dropZone");
const droppedRow = document.getElementById("droppedRow");
const dropHint = document.getElementById("dropHint");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ✅ Shuffle */
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ✅ Render */
function render(){
  const q = quizData[index];
  const state = solved[index];

  qText.textContent = q.q;

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !state.done;

  // Drop zone restore
  droppedRow.innerHTML = "";

  if(state.picked.length === 0){
    dropHint.style.display = "block";
    dropZone.classList.remove("filled");
  }else{
    dropHint.style.display = "none";
    dropZone.classList.add("filled");

    state.picked.forEach(t=>{
      const div = document.createElement("div");
      div.className = "dropped-item";
      div.innerHTML = `
        <img src="../assets/images/${t}.png" alt="${t}">
        <span>${t}</span>
      `;
      droppedRow.appendChild(div);
    });
  }

  // Options
  const opts = shuffle([
    ...q.correct.map(t=>({text:t, correct:true})),
    ...q.wrong.map(t=>({text:t, correct:false}))
  ]);

  optionsEl.innerHTML = "";

  opts.forEach(opt=>{
    const wrap = document.createElement("div");
    wrap.className = "option-wrap";
    wrap.dataset.text = opt.text;
    wrap.dataset.correct = opt.correct ? "1" : "0";

    const circle = document.createElement("div");
    circle.className = "option-circle";
    circle.innerHTML = `<img src="../assets/images/${opt.text}.png">`;

    const txt = document.createElement("div");
    txt.className = "option-text";
    txt.textContent = opt.text;

    // Restore state
    if(state.picked.includes(opt.text)){
      circle.classList.add("correct");
      wrap.classList.add("locked");
    }

    if(state.done && !state.picked.includes(opt.text)){
      wrap.classList.add("disabled");
    }

    wrap.appendChild(circle);
    wrap.appendChild(txt);
    optionsEl.appendChild(wrap);

    /* ✅ CLICK ONLY (MAIN LOGIC) */
    wrap.addEventListener("click", () => {

      if (wrap.classList.contains("disabled") ||
          wrap.classList.contains("locked")) return;

      if (state.done) return;
      if (state.picked.includes(opt.text)) return;

      // ❌ WRONG
      if (!opt.correct){
        speakText("Wrong");
        showPopup(false);
        return;
      }

      // ✅ CORRECT
      speakText("Correct");
      showPopup(true);

      state.picked.push(opt.text);

      wrap.classList.add("locked");
      wrap.style.pointerEvents = "none";

      if(state.picked.length === q.correct.length){
        state.done = true;
        score++;
        nextBtn.disabled = false;

        if(index === quizData.length - 1){
          setTimeout(showFinalPopup, 1100);
        }
      }

      render();
    });

  });
}

/* ✅ Navigation */
prevBtn.addEventListener("click",()=>{
  if(index > 0){
    index--;
    render();
  }
});

nextBtn.addEventListener("click",()=>{
  if(!solved[index].done) return;
  if(index < quizData.length - 1){
    index++;
    render();
  }
});

render();