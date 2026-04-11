const quiz = [
  {
    q: "1. Petals enclose and protect the ______ parts of a flower.",
    a: "reproductive",
    options: ["colorful","green","leaf","reproductive"],
   img:"../assets/images/reproductiveak.png"
  },
  {
    q: "2. Flowers in which both the male and the female parts are present on the same flower are called ______ flowers.",
    a: "bisexual",
    options: ["bisexual","red","small","green"],
   img:"../assets/images/bisexualf.png"
  },
  {
    q: "3. The process by which the pollen grains get transferred from the anther to the stigma is called ______.",
    a: "pollinating",
    options: ["running","jumping","pollinating","singing"],
     img:"../assets/images/pollinating.png"
  },
  {
    q: "4. When a pollen grain falls on the stigma of a flower, it develops a long tube called the ______.",
    a: "pollen tube",
    options: ["pollen tube","flower stem","stick","magic"],
     img:"../assets/images/Pollengrains.png"
  },
  {
    q: "5. The fertilised female reproductive cell or zygote develops into a ______.",
    a: "seed",
    options: ["cake","seed","ball","toy"],
     img:"../assets/images/seed.png"
  }
];

let index = 0;
let score = 0;
let answered = Array(quiz.length).fill(false);
let userAnswers = Array(quiz.length).fill("");

const questionEl   = document.getElementById("question");
const wordBank     = document.getElementById("wordBank");
const checkBtn     = document.getElementById("checkBtn");
const prevBtn      = document.getElementById("prev");
const nextBtn      = document.getElementById("next");
const questionImg  = document.getElementById("questionImage");

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function load() {
  const current = quiz[index];

  questionEl.innerHTML = current.q.replace("______", 
    `<span class="blank">${userAnswers[index] || "______"}</span>`
  );

  wordBank.innerHTML = "";
  current.options.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "word-btn";
    btn.textContent = word;
    if (answered[index]) {
      btn.classList.add("used");
      btn.disabled = true;
    }
    btn.onclick = () => selectWord(word);
    wordBank.appendChild(btn);
  });

  questionImg.src = current.img;
  questionImg.alt = "Illustration for question " + (index + 1);

  checkBtn.disabled = !userAnswers[index] || answered[index];
  prevBtn.disabled = index === 0;
  nextBtn.disabled = !answered[index];
}

function selectWord(word) {
  if (answered[index]) return;
  userAnswers[index] = word;
  document.querySelector(".blank").textContent = word;
  checkBtn.disabled = false;
}

function launchConfetti(){

confetti({
particleCount:120,
spread:70,
origin:{ y:0.6 }
});

}

function popup(type){

const popup=document.getElementById("popup");
const icon=document.getElementById("popupIcon");
const title=document.getElementById("popupTitle");
const msg=document.getElementById("popupMsg");

popup.className="popup "+type;
popup.style.display="flex";

if(type==="correct"){
  launchConfetti();
icon.textContent="🎉";
title.textContent="Correct!";
msg.textContent="Great job!";
}else{
icon.textContent="😔";
title.textContent="Wrong!";
msg.textContent="Try again!";
}

setTimeout(()=>{
popup.style.display="none";
},1200);

}

function check() {

const value = userAnswers[index].toLowerCase().trim();
const correct = quiz[index].a.toLowerCase().trim();

if (value === correct) {

popup("correct");
speak("Correct");

answered[index] = true;
score++;

checkBtn.disabled = true;

if (index === quiz.length - 1) {

setTimeout(() => {

document.getElementById("final").style.display = "block";
document.getElementById("score").textContent = `Your Score: ${score}/5`;
launchConfetti(); 
// speak("Congratulations. Your score is " + score + " out of five");
prev.disabled = true;
next.disabled = true;
}, 1000);

} else {

nextBtn.disabled = false;

}

} else {

popup("wrong");
speak("wrong");

}

}

nextBtn.onclick = () => {
  if (index < quiz.length - 1) {
    index++;
    load();
  }
};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    load();
  }
};

function playAgain() {
  location.reload();
}

load();