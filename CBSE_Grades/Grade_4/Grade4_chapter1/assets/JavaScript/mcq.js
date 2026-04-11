

const quizData = [
{
  q: "Q.1 The process by which a plant makes its own food in the presence of sunlight is called ___.",
  options: [
    { text: "ventation", img: "../assets/images/venation.png" },
    { text: "photosynthesis", img: "../assets/images/photosynthesis1.png" },
    { text: "respiration", img: "../assets/images/respiration.png" },
    { text: "phyllotaxy", img: "../assets/images/phyllotaxy.png" }
  ],
  correctIndex: 1
},
{
  q: "Q.2 Which of the following is the main source of energy?",
  options: [
    { text: "Plants", img: "../assets/images/plants.png" },
    { text: "Animals", img: "../assets/images/animals.png" },
    { text: "Sunlight", img: "../assets/images/sunlight1.png" },
    { text: "Chlorophyll", img: "../assets/images/Chlorophyll.png" }
  ],
  correctIndex: 2
},
{
  q: "Q.3 Which of the following is the flat part of a leaf?",
  options: [
    { text: "Lamina", img: "../assets/images/mcq3-1.png" },
    { text: "Apex", img: "../assets/images/plants.png" },
    { text: "Vein", img: "../assets/images/mcq3-3.png" },
    { text: "Chlorophyll", img: "../assets/images/chlorophyll.png" }
  ],
  correctIndex: 0
},
{
  q: "Q.4 In _____________ venation, the veins run parallel to one another.",
  options: [
    { text: "Vertical", img: "../assets/images/plants.png" },
    { text: "Linear", img: "../assets/images/respiration.png" },
    { text: "Parallel", img: "../assets/images/mcq4-3.png" },
    { text: "Reticulate", img: "../assets/images/Reticulate.png" }
  ],
  correctIndex: 2
},
{
  q: "Q.5 Which of the following has stored food in its stem?",
  options: [
    { text: "cauliflower", img: "../assets/images/cauliflower.png" },
    { text: "potato", img: "../assets/images/potatoo.png" },
    { text: "spinach", img: "../assets/images/spinach.png" },
    { text: "carrot", img: "../assets/images/carrots.png" }
  ],
  correctIndex: 1
}
];
    let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(false);

const questionText = document.getElementById("questionText");
const qEmoji = document.getElementById("qEmoji");
const optionsBox = document.getElementById("optionsBox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const bubbleOrbit = document.getElementById("bubbleOrbit");
const orbitIndicator = document.getElementById("orbitIndicator");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

// function speak(text){
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(text));
// }
function speak(t) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(t);  

  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);  
}
// function speak(t) {
//   speechSynthesis.cancel();   // optional but recommended

//   const msg = new SpeechSynthesisUtterance(t);
//   msg.volume = 0.1;   // 🔉 lower volume (0 to 1)
//   msg.rate = 1;
//   msg.pitch = 1;

//   speechSynthesis.speak(msg);
// }

function showPopup(html, final=false){
  popup.style.display = "flex";
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if(!final) setTimeout(()=>popup.style.display="none",1000);
}

/* ===== PROGRESS ===== */

function buildProgress(){
  bubbleOrbit.querySelectorAll(".bubble-step").forEach(e=>e.remove());
  quizData.forEach(()=>{
    const step=document.createElement("div");
    step.className="bubble-step";
    step.innerHTML='<div class="bubble-dot">⭐</div>';
    bubbleOrbit.appendChild(step);
  });
}

function moveIndicator(){
  const steps=document.querySelectorAll(".bubble-step");
  const step=steps[current];
  const orbitRect=bubbleOrbit.getBoundingClientRect();
  const stepRect=step.getBoundingClientRect();
  orbitIndicator.style.left =
    (stepRect.left - orbitRect.left + stepRect.width/2) + "px";
}

function updateProgress(){
  document.querySelectorAll(".bubble-step").forEach((s,i)=>{
    s.classList.toggle("active",i===current);
    s.classList.toggle("done",i<current);
  });
  requestAnimationFrame(moveIndicator);
}

/* ===== QUIZ ===== */

function loadQuestion(){
  const q = quizData[current];
  questionText.textContent = q.q;
  qEmoji.textContent = q.emoji;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, idx)=>{
    const div=document.createElement("div");
    div.className="option";
    div.innerHTML=`<img src="${opt.img}"><div class="opt-label">${opt.text}</div>`;
    div.onclick=()=>checkAnswer(div, idx);
    optionsBox.appendChild(div);
  });
  /* 🔁 RESTORE STATE WHEN GOING BACK */
if(answered[current]){
  const correctIndex = quizData[current].correctIndex;

  document.querySelectorAll(".option").forEach((o, i)=>{
    o.classList.add("disabled");
    if(i === correctIndex){
      o.classList.remove("disabled");
      o.classList.add("correct-lock");
    }
  });

  nextBtn.disabled = false;
}


  prevBtn.disabled = current === 0;
  nextBtn.disabled = !answered[current];
  updateProgress();
}

function checkAnswer(optionDiv, selected){
  if(answered[current]) return;

  const correctIndex = quizData[current].correctIndex;

  if(selected === correctIndex){
    answered[current] = true;
    score++;
    speak("Correct");

    document.querySelectorAll(".option").forEach(o=>o.classList.add("disabled"));
    optionDiv.classList.add("correct-lock");

    showPopup(`
      <div class="popup-correct">
        <span>✅ Correct</span>
        <span class="happy">😊</span>
        <div class="stars">${"⭐".repeat(current + 1)}</div>
      </div>
    `);

    if(current === quizData.length - 1){
      setTimeout(()=>{
       showPopup(`
  <div class="popup-final-content">
    🎉 Congratulations!
    <span class="emoji">🏆</span>
           <div>You finished the quiz!</div>
    <div class="final-score">
      Score: 5/5</b>
    </div>

    <div class="stars">⭐⭐⭐⭐⭐</div>
  <div class="final-btn-row">
    <button class="restart" onclick="location.reload()">🔄 Restart</button>
   
    </div>
  </div>
`, true);

      }, 1100);
    }else{
      nextBtn.disabled = false;
    }
  }else{
    speak("Wrong");
   showPopup(`
  <div class="popup-wrong">
    <span class="cross">❌ Wrong</span>
    <span class="sad">😢</span>
    <span class="tip">💡Try again!</span>
  </div>
`);

  }
}

prevBtn.onclick = ()=>{ current--; loadQuestion(); };
nextBtn.onclick = ()=>{ current++; loadQuestion(); };

buildProgress();
loadQuestion();
window.addEventListener("resize",()=>requestAnimationFrame(moveIndicator));


