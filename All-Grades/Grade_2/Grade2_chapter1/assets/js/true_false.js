const questions = [
  { q:" Our tongue helps us to speak clearly.", a:true,img: "../assets/images/TF1.png" },
  { q:"Each part of our body has a special job to do.", a:true ,img: "../assets/images/TF2.png"},
  { q:" Our skin helps us to smell.", a:false,img: "../assets/images/TF3.png" },
  { q:"The heart is an external organ.", a:false,img: "../assets/images/TF4.png" },
  { q:"The lungs are located in the chest region.", a:true ,img: "../assets/images/TF5.png"}
];

let index = 0;
let score = 0;

/* ✅ store ONLY correct solved answers */
const solvedMap = {}; // solvedMap[index] = { solved:true, chosen:true/false }

const qEl = document.getElementById("question");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const cards = document.querySelectorAll(".card");

// function speak(text){
//   if(!("speechSynthesis" in window)) return;

//   window.speechSynthesis.cancel();
//   const u = new SpeechSynthesisUtterance(text);
//   u.lang = "en-Uk";
//   u.rate = 0.9;

//   // ✅ IMPORTANT (Chrome fix)
//   u.volume = 1;
//   u.pitch = 1;

//   window.speechSynthesis.speak(u);
// }


function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
   msg.lang = "en-UK";  
  msg.volume = 0.25; 
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

function load(){
  qEl.textContent = questions[index].q;
 // ✅ SET IMAGE
  document.getElementById("qImg").src = questions[index].img;
  prevBtn.disabled = index === 0;

  feedback.textContent = "";
  nextBtn.disabled = true;

  cards.forEach(c=>{
    c.classList.remove("flip","correct","wrong","light-true","light-false");
  });

  // ✅ if already solved correctly then show saved state
  if(solvedMap[index]?.solved){
    const chosenVal = solvedMap[index].chosen;
    const chosenCard = chosenVal === true ? cards[0] : cards[1];

    cards[0].classList.add("light-true");
    cards[1].classList.add("light-false");

    chosenCard.classList.add("correct","flip"); // only correct flips
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "#15803d";

    nextBtn.disabled = false;
  }
}
load();
// ✅ button click events (because onclick removed in HTML)
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

function choose(val, card){
  // ✅ if already solved correct, lock
  if(solvedMap[index]?.solved) return;

  // show light colors
  cards[0].classList.add("light-true");
  cards[1].classList.add("light-false");

  cards.forEach(c=> c.classList.remove("correct","wrong","flip"));

  const isCorrect = val === questions[index].a;

  if(isCorrect){
    // ✅ SAVE ONLY CORRECT
    solvedMap[index] = { solved:true, chosen: val };
    score++;

    card.classList.add("correct","flip");
    //  feedback.textContent = "✅ Correct!";
    //  feedback.style.color = "#15803d";

    showPopup("correct");
    nextBtn.disabled = false;

    // ✅ final popup on last question
    if(index === questions.length - 1){
      setTimeout(() => {
        showPopup("final", score, questions.length);
      }, 1600);
    }

  }else{
    // ❌ do not save wrong answer
     card.classList.add("wrong");
    // feedback.textContent = "❌ Incorrect! Try Again";
    // feedback.style.color = "#b91c1c";

    showPopup("wrong");

    // ✅ Next stays disabled
    nextBtn.disabled = true;
  }
}

function next(){
  if(!solvedMap[index]?.solved) return;
  if(index < questions.length - 1){
    index++;
    load();
  }
}

function prev(){
  if(index > 0){
    index--;
    load();
  }
}

/* ✅ popup function with animation restart */
function showPopup(type, score = 0, total = 0) {
  const popup = document.getElementById("answer-popup");
  const popupIcon = document.getElementById("popup-icon");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");
  const popupBox = popup.querySelector(".popup-content");

  popup.style.display = "flex";
  popup.classList.remove("correct","wrong","final");

  // restart animation
  popupIcon.style.animation = "none";
  popupBox.style.animation = "none";
  void popupIcon.offsetHeight;
  void popupBox.offsetHeight;
  popupIcon.style.animation = "";
  popupBox.style.animation = "";

  if(type === "correct"){
  popup.classList.add("correct");
  popupIcon.textContent = "🥳";
  popupTitle.textContent = "Correct!";
  popupMessage.textContent = "Well done!";

  speak("Correct");

  setTimeout(() => popup.style.display = "none", 1500);
}
else if(type === "wrong"){
  popup.classList.add("wrong");
  popupIcon.textContent = "😔";
  popupTitle.textContent = "Wrong!";
  popupMessage.textContent = "Try again!";

  speak("Wrong");

  setTimeout(() => popup.style.display = "none", 1500);
}
else if(type === "final"){
  popup.classList.add("final");
  popupIcon.textContent = "🏆";
  popupTitle.textContent = "Congratulations!";
  popupMessage.innerHTML = `
    You finished the quiz! <br/>
    <b>Score: ${score} / ${total}</b> <br/><br/>
    ⭐⭐⭐⭐⭐ <br/><br/>
    <button class="restart" onclick="location.reload()">🔄 Play Again</button>
  `;

  // speak(`Congratulations. Your score is ${score} out of ${total}`);
}

}
