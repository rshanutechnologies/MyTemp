
  const quizData = [
    {
      q: "Q1. Plants with taproot ________",
      options: [
        { text:"Neem", img:"../assets/images/Neem.png", correct:true },    
        { text:"Wheat",  img:"../assets/images/Wheat1.png", correct:false },
         { text:"Mango", img:"../assets/images/Mango.png", correct:true },
        { text:"Onion",  img:"../assets/images/onion1.png", correct:false }
      ]
    },
    {
      q: "Q2. Plants with fibrous root ________",
      options: [
        { text:"Onion", img:"../assets/images/Onion.png", correct:true },
       
      { text:"Carrot", img:"../assets/images/Carrot.png", correct:false },
        { text:"Radish", img:"../assets/images/Radish.png", correct:false },
         { text:"Wheat", img:"../assets/images/Wheat1.png", correct:true },
      ]
    },
    {
      q: "Q3. Plants with weak stem ________",
      options: [
       
       
        { text:"Tree",    img:"../assets/images/Treeak.png", correct:false },
         { text:"MoneyPlant", img:"../assets/images/money-plant.png", correct:true },
        { text:"Shrub",   img:"../assets/images/Shrub.png", correct:false },
         { text:"PeaPlant",    img:"../assets/images/pea-plant.png", correct:true },
      ]
    },
    {
      q: "Q4. Plants with small leaves ________",
      options: [
      
        { text:"Tulsi",   img:"../assets/images/tulsi.png", correct:true },
        { text:"Banana", img:"../assets/images/Banana (1).png", correct:false },
          { text:"Tamarind",   img:"../assets/images/tamarind.png", correct:true },
        { text:"Mango",  img:"../assets/images/Mango.png", correct:false }
      ]
    },
    {
      q: "Q5. Fruits with many seeds ________",
      options: [
        { text:"Papaya", img:"../assets/images/papaya.png", correct:true },
       
        { text:"Apple",       img:"../assets/images/Apple (1).png", correct:false },
         { text:"Watermelon",  img:"../assets/images/Watermelon.png", correct:true },
        { text:"Mango",       img:"../assets/images/Mango.png", correct:false }
      ]
    }
  ];

  const pillIcons = ["🌱","🌿","🍃","🌸","🌰"];

  const questionText  = document.getElementById("questionText");
  const optionsBox    = document.getElementById("optionsBox");
  const prevBtn       = document.getElementById("prevBtn");
  const nextBtn       = document.getElementById("nextBtn");

  const popup         = document.getElementById("popup");
  const popupText     = document.getElementById("popupText");

 

 let current = 0;
let score = 0;

const solved = new Array(quizData.length).fill(false);

// ADD THIS LINE HERE
const selectedAnswers = quizData.map(() => []);


  function speakShort(text){
  if(!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  msg.lang = "en-Uk";
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)

  window.speechSynthesis.speak(msg);
}

  function showPopupMsg(html, final=false){
    popup.style.display = "flex";
    popupText.className = final ? "popup-box popup-final-wide" : "popup-box";
    popupText.innerHTML = html;
    if(!final) setTimeout(()=> popup.style.display="none", 1000);
  }

  
  function updateNav(){
    prevBtn.disabled = (current === 0);
    nextBtn.disabled = current < quizData.length - 1 ? !solved[current] : true;
  }

  function renderQuestion(){
  questionText.textContent = quizData[current].q;
  optionsBox.innerHTML = "";

  quizData[current].options.forEach((opt, idx)=>{
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.type = "button";

    btn.innerHTML = `
      <div class="opt-img"><img src="${opt.img}" alt="${opt.text}"></div>
      <div class="opt-label">${opt.text}</div>
    `;

    btn.addEventListener("click", ()=>handleAnswer(idx));
    optionsBox.appendChild(btn);
  });

  // RESTORE previous selections
  // RESTORE previous selections
selectedAnswers[current].forEach(i => {
  const btns = document.querySelectorAll(".opt-btn");
  btns[i].classList.add("opt-correct-selected");
});

// restore count
correctCount = selectedAnswers[current].length;

  if(solved[current]){
    lockAfterSolved();
  }

  updateNav();
}



  let correctCount = 0;

  function lockAfterSolved(){
    const btns = document.querySelectorAll(".opt-btn");
    const q = quizData[current];

    btns.forEach((b, i)=>{
      b.classList.add("opt-disabled");
      if(q.options[i].correct){
        b.classList.remove("opt-disabled");
        b.classList.add("opt-correct-selected");
      }
    });
  }
function handleAnswer(idx){
  if(solved[current]) return;

  const q = quizData[current];
  const opt = q.options[idx];

  if(opt.correct){
    const btns = document.querySelectorAll(".opt-btn");

    btns[idx].classList.add("opt-correct-selected");
    btns[idx].classList.add("opt-disabled");

    // STORE selection
    if(!selectedAnswers[current].includes(idx)){
      selectedAnswers[current].push(idx);
      correctCount++;
    }

    speakShort("Correct");


      showPopupMsg(`
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">${"⭐".repeat(correctCount)}</div>
        </div>
      `);

      if(selectedAnswers[current].length >= 2){
  solved[current] = true;
  score++;
  correctCount = 0;

  lockAfterSolved();

  updateNav();   // ← THIS LINE IS REQUIRED

  if(current === quizData.length - 1){
    setTimeout(showFinal, 1100);
  }
}


    } else {
      speakShort("Wrong");

      showPopupMsg(`
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 You can do it!</div>
        </div>
      `);
    }
  }

  function showFinal(){
    showPopupMsg(`
      <div class="popup-final-content">
        🎉 Congratulations!
        <span class="emoji">🏆</span>
        You finished the quiz!
        <div class="final-score">Score: <b>${score} / ${quizData.length}</b></div>
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <button class="restart" onclick="location.reload()">🔄Restart</button>
      </div>
    `, true);
  }

  nextBtn.addEventListener("click", ()=>{
    if(current < quizData.length - 1 && solved[current]){
      current++;
      renderQuestion();
    }
  });

  prevBtn.addEventListener("click", ()=>{
    if(current > 0){
      current--;
      correctCount = 0;
      renderQuestion();
    }
  });

  renderQuestion();

