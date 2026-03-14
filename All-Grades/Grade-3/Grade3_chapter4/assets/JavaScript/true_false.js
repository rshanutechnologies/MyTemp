const questions = [
  {
    text: "The intermolecular spaces are same in all the three states of matter.",
    answer: false,
    img: "../assets/images/dk1.png"
  },
  {
    text: "Solids have a definite shape.",
    answer: true,
    img: "../assets/images/dk2.png"
  },
  {
    text: "Mass is measured in kilograms.",
    answer: true,
    img: "../assets/images/mass.png"
  },
  {
    text: "Liquids can flow from a lower level to a higher level.",
    answer: false,
    img: "../assets/images/dk4.png"
  },
  {
    text: "Gases have a definite mass.",
    answer: true,
    img: "../assets/images/dk51.png"
  }
];


let index = 0;
let score = 0;

/* ✅ Save solved state for each question */
const solvedMap = {}; 
// solvedMap[index] = { solved:true, correctVal:true/false }

const qText = document.getElementById("qText");
const eggWraps = document.querySelectorAll(".egg-wrap");

const btnTrue = document.getElementById("btnTrue");
const btnFalse = document.getElementById("btnFalse");

/* ✅ NAV buttons (HTML must have these ids) */
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* ✅ POPUP elements (HTML must include popup div) */
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

/* ✅ Popup function */
function showPopup(html, final=false){
  popup.style.display = "flex";

  // ✅ final popup wider
  if(final){
    popupText.className = "popup-box final-wide";
  }else{
    popupText.className = "popup-box";
  }

  popupText.innerHTML = html;

  if(!final){
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000);
  }
}

/* ✅ Final popup */
function showFinalPopup(){
  showPopup(`
    <div class="popup-final-content">
      🎉 Congratulations!
      <span class="emoji">🏆</span>
      You finished the quiz!
      <div class="final-score">Score: <b>${score} / ${questions.length}</b></div>
      <div class="stars">${"⭐".repeat(Math.max(1, Math.round((score / questions.length) * 5)))}</div>
      <button class="restart" onclick="location.reload()">🔄 Restart</button>
    </div>
  `, true);
}

const qImage = document.getElementById("qImage");

function render(){
  qText.textContent = `Q${index + 1}. ${questions[index].text}`;
  qImage.src = questions[index].img;

  btnTrue.className = "btn true";
  btnFalse.className = "btn false";

  prevBtn.disabled = (index === 0);
  nextBtn.disabled = true;

  if(solvedMap[index]?.solved){
    const correctVal = solvedMap[index].correctVal;

    if(correctVal === true){
      btnTrue.classList.add("correct","no-click");
      btnFalse.classList.add("disabled-look");
    }else{
      btnFalse.classList.add("correct","no-click");
      btnTrue.classList.add("disabled-look");
    }

    nextBtn.disabled = false;
  }
}

function answer(val){
  // ✅ if already solved, block
  if(solvedMap[index]?.solved) return;

  const correct = questions[index].answer;

  // remove wrong style each click
  btnTrue.classList.remove("wrong");
  btnFalse.classList.remove("wrong");

  if(val === correct){

    // ✅ mark solved
    solvedMap[index] = { solved:true, correctVal: correct };

    // ✅ score increase only once
    score++;

    // ✅ enable next
    nextBtn.disabled = false;

    // ✅ Correct button: border + glow + not clickable (NO opacity)
    // ❌ Wrong button: disabled look (opacity) + not clickable
    if(correct === true){
      btnTrue.classList.add("correct", "no-click");
      btnFalse.classList.add("disabled-look");
    }else{
      btnFalse.classList.add("correct", "no-click");
      btnTrue.classList.add("disabled-look");
    }

    
    /* ✅ Correct popup + voice */
    speak("Correct");
    showPopup(`
      <div class="popup-correct">
        <span class="check">✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">${"⭐".repeat(index + 1)}</div>
      </div>
    `);

    /* ✅ AUTO FINAL POPUP after last question correct (no need next button) */
    if(index === questions.length - 1){
      setTimeout(() => {
        showFinalPopup();
      }, 1100);
    }

  }else{
    // ❌ wrong answer - allow try again
    const btn = val ? btnTrue : btnFalse;
    btn.classList.add("wrong");

   

    /* ✅ Wrong popup + voice */
    speak("Wrong");
    showPopup(`
      <div class="popup-wrong">
        <span class="cross">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 You can do it!</div>
      </div>
    `);
  }
}

function next(){
  if(index < questions.length - 1){
    index++;
    render();
  }
}

function prev(){
  if(index > 0){
    index--;
    render();
  }
}

render();
