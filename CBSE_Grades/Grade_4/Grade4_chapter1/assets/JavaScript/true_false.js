
  let popupTimer = null;
let finalPopupShown = false;

const quizData = [
  {
    q: "Q.1. Plants move around in search of food",
    a: false,
    img: "../assets/images/TF1.png",
    answered: false
  },
  {
    q: "Q.2. Stomata help in trapping the sunlight.",
    a: false,
    img: "../assets/images/TF2.png",
    answered: false
  },
  {
    q: "Q.3. The pitcher plant obtains all the required nutrients from insects",
    a: false,
    img: "../assets/images/TF3.png",
    answered: false
  },
  {
    q: "Q.4. The stem makes food for the plant.",
    a: false,
    img: "../assets/images/TF4.png",
    answered: false
  },
  {
    q: "Q.5. The transport of water, minerals and food takes place through the network of veins and the stem",
    a: true,
    img: "../assets/images/TF.png",
    answered: false
  }
];


let index=0, score=0;
const questionEl=document.getElementById("question");
const progressEl=document.getElementById("progress");
const trueBtn=document.getElementById("trueBtn");
const falseBtn=document.getElementById("falseBtn");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");

function showPopup(html, final = false){
  // ❌ stop any previous popup timer
  if(popupTimer){
    clearTimeout(popupTimer);
    popupTimer = null;
  }

  popup.style.display = "flex";
   popupText.className = final
    ? "popup-box popup-final"
    : "popup-box";
  popupText.innerHTML = html;

  if(final){
    // 🔒 FINAL POPUP LOCK
    finalPopupShown = true;
    return; // ⛔ no auto-close
  }

  // ⏱ auto close only for correct / wrong
  popupTimer = setTimeout(() => {
    if(!finalPopupShown){
      popup.style.display = "none";
    }
  }, 1000);
}




function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}
function loadQuestion(){
  const q = quizData[index];   // ✅ define first

  const imgEl = document.getElementById("questionImg");
  imgEl.src = q.img;           // ✅ now works
  imgEl.style.display = "block";

  questionEl.textContent = q.q;
  progressEl.textContent = `Question ${index+1}/${quizData.length}`;

  trueBtn.className = "true";
  falseBtn.className = "false";

  trueBtn.onclick = () => answer(true);
  falseBtn.onclick = () => answer(false);

  if(q.answered){
    const correctBtn = q.a ? trueBtn : falseBtn;
    const wrongBtn = q.a ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");
    wrongBtn.classList.add("disabled");
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = !q.answered;
}



function answer(user){
  const q = quizData[index];
  if(q.answered) return;

  const correct = q.a === user;

  speak(correct ? "Correct" : "Wrong");

  if(correct){
    q.answered = true;
    score++;

    const correctBtn = user ? trueBtn : falseBtn;
    const wrongBtn = user ? falseBtn : trueBtn;

    correctBtn.classList.add("correct");   // ✅ green border
    correctBtn.onclick = null;             // ❌ no more clicks
    wrongBtn.classList.add("disabled");    // ❌ disable wrong

    showPopup(`
      <div class="popup-correct">
        <span class="check">✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">${"⭐".repeat(index+1)}</div>
      </div>
    `);

    // 👉 enable Next
    nextBtn.disabled = false;

    // 👉 enable Prev from 2nd question
   

    // 🏆 FINAL QUESTION
    if(index === quizData.length - 1){
      setTimeout(() => {
  finalPopupShown = true;
        // 🔒 lock navigation
        prevBtn.disabled = true;
        nextBtn.disabled = true;

        showPopup(`
          <div class="popup-final-content">
            🎉 Congratulations!
            <span class="emoji">🏆</span>
             <div>You finished the quiz!</div>
            <div class="final-score">
              Score: <b>${score}/${quizData.length}</b>
            </div>

            <div class="stars">⭐⭐⭐⭐⭐</div>

             <div class="final-actions">
            <button class="restart" onclick="location.reload()">🔄 Restart</button>
          
          </div>
          </div>
        `, true);

      }, 800);
    }

  } else {
    showPopup(`
      <div class="popup-wrong">
        <span class="cross">❌ Wrong</span>
        <span class="sad">😢</span>
        <div class="tip">💡 Try again!</div>
      </div>
    `);
  }
}


prevBtn.onclick=()=>{index--;loadQuestion();};
nextBtn.onclick=()=>{index++;loadQuestion();};

loadQuestion();