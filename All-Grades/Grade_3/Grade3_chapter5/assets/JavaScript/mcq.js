
const quizData = [

{
  q:"Q1. Choose the odd one from the options. (Biotic components)",
  options:[
    { text:"Soil",   img:"../assets/images/soil.png" },
    { text:"Water",  img:"../assets/images/Water.png" },
    { text:"Air",    img:"../assets/images/air.png" },
    { text:"Plants", img:"../assets/images/Plant.png" }
  ],
  answer:0
},

{
  q:"Q2. Which of the following are decomposers?",
  options:[
    { text:"Plants",   img:"../assets/images/Plant.png" },
    { text:"Animals",  img:"../assets/images/animal.png" },
    { text:"Insects",  img:"../assets/images/insects.png" },
    { text:"Bacteria", img:"../assets/images/Bacteriaak.png" }
  ],
  answer:3
},

{
  q:"Q3. Plants need __________ to prepare food.",
  options:[
    { text:"Nitrogen",        img:"../assets/images/nitrogen.png" },
    { text:"Oxygen",          img:"../assets/images/oxygen.png" },
    { text:"Carbon dioxide",  img:"../assets/images/CO2.png" },
    { text:"Hydrogen",        img:"../assets/images/hydrogen.png" }
  ],
  answer:2
},

{
  q:"Q4. What are X and Y in the given sequence?\nX → Primary consumers → Secondary consumers → Y → Scavengers → Decomposers",
  options:[
    { text:"X-Producers, Y-Scavengers",         img:"../assets/images/producers.png" },
    { text:"X-Tertiary consumers, Y-Scavengers",img:"../assets/images/tertiary.png" },
    { text:"X-Producers, Y-Tertiary consumers", img:"../assets/images/Q4ak.png" },
    { text:"X-Scavengers, Y-Producers",         img:"../assets/images/scavenger.png" }
  ],
  answer:0
},

{
  q:"Q5. __________ are called tertiary consumers.",
  options:[
    { text:"Plants",      img:"../assets/images/Plant.png" },
    { text:"Herbivores",  img:"../assets/images/herbivore.png" },
    { text:"Carnivores",  img:"../assets/images/Lionak.png" },
    { text:"Scavengers",  img:"../assets/images/scavengers.png" }
  ],
  answer:2
}

];
let index=0, score=0;
let answered=Array(quizData.length).fill(null);

const qText=document.getElementById("questionText");
const img=document.getElementById("quizImg");
const optBox=document.getElementById("options");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");

let femaleVoice = null;

speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();

  femaleVoice =
    voices.find(v => v.name.includes("Google UK English Female")) ||
    voices.find(v => v.name.includes("Microsoft Zira")) ||
    voices.find(v => v.name.includes("Samantha")) ||
    voices.find(v => v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.lang.startsWith("en"));
};


function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function showCorrectPopup(){
 const d=document.createElement("div");
 d.className="correct-popup";
 d.innerHTML=`Great Job! <span class="emoji">🎉</span>`;
 document.body.appendChild(d);
 setTimeout(()=>d.remove(),1200);
}

function showWrongPopup(){
 const d=document.createElement("div");
 d.className="wrong-popup";
 d.innerHTML=`Try Again <span class="emoji">❌</span>`;
 document.body.appendChild(d);
 setTimeout(()=>d.remove(),1200);
}

function load(){
 qText.textContent = quizData[index].q;

 optBox.innerHTML="";
 prevBtn.disabled = index === 0;
nextBtn.disabled = true;   // Disable by default

 quizData[index].options.forEach((opt,i)=>{
  const div=document.createElement("div");
  div.className="option";

  div.innerHTML = `
    <div class="radio"></div>
    <img class="opt-img" src="${opt.img}" alt="${opt.text}">
    <span class="opt-text">${opt.text}</span>
  `;

  div.onclick=()=>select(i);
  optBox.appendChild(div);
});
 // ✅ restore previous answer + image
 if(answered[index] !== null){
 const options = document.querySelectorAll(".option");

 options[answered[index]].classList.add("correct");
 options.forEach(o => o.classList.add("disabled"));
const selectedOption = quizData[index].options[answered[index]];

img.src = selectedOption.img;
img.style.display = "block";
imgBox.classList.add("active");
 nextBtn.disabled = false;
}
else{
   img.src = "";
   img.style.display = "none";
   imgBox.classList.remove("active");
 }
}



const imgBox = document.querySelector(".quiz-image");

function select(i){
 if(answered[index]!==null) return;

 const options = document.querySelectorAll(".option");

 if(i===quizData[index].answer){
  score++;
  answered[index]=i;

  const selectedOption = quizData[index].options[i];

  img.src = selectedOption.img;
  img.style.display = "block";
  imgBox.classList.add("active");

  options[i].classList.add("correct");

  speak("Correct");
  showPopup(true);
  nextBtn.disabled = false;

  if(index === quizData.length - 1){
    setTimeout(() => {
      showFinal();
    }, 800);
  }

 }else{
  speak("Wrong");
  showPopup(false);
 }
}





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
function showFinal(){
  const popup = document.getElementById("finalPopup");
  popup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}


function finalPopup(){
 document.getElementById("popupText").innerHTML=`
 <div class="popup-final-content">
  🎉 Congratulations!
  <span class="emoji">🏆</span>
  You finished the quiz!
  <div class="final-score">Score: <b>${score} / ${quizData.length}</b></div>
  <div class="stars">⭐⭐⭐⭐⭐</div>
  <button class="restart" onclick="location.reload()">🔄 Restart</button>
 </div>`;
 document.getElementById("popup").style.display="flex";
}
nextBtn.onclick = () => {
  if(index < quizData.length - 1){
    index++;
    load();
  }
};

prevBtn.onclick = () => {
  if(index > 0){
    index--;
    load();
  }
};


load();

