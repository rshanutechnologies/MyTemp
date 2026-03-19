/* ================= SPEECH FUNCTION ================= */

function speak(text){

const speech = new SpeechSynthesisUtterance(text);

speech.lang = "en-US";
speech.rate = 1;
speech.pitch = 1;

speechSynthesis.cancel();
speechSynthesis.speak(speech);

}


/* ================= POPUP ================= */

function showPopup(isCorrect){

const popup = document.getElementById("popup");
const icon = document.getElementById("popupIcon");
const title = document.getElementById("popupTitle");
const msg = document.getElementById("popupMsg");

popup.style.display = "flex";

/* reset */
title.classList.remove("popup-correct","popup-wrong");
msg.classList.remove("popup-correct","popup-wrong");

if(isCorrect){

icon.textContent = "🎉";
title.textContent = "Correct!";
msg.textContent = "Great job!";

title.classList.add("popup-correct");
msg.classList.add("popup-correct");

speak("Correct answer!");

}else{

icon.textContent = "❌";
title.textContent = "Wrong!";
msg.textContent = "Try again!";

title.classList.add("popup-wrong");
msg.classList.add("popup-wrong");

speak("Try again!");

}

setTimeout(()=>{
popup.style.display = "none";
},1200);

}

/* ================= CONFETTI ================= */

function fireConfetti(){

confetti({

particleCount:40,
spread:80,
origin:{ y:0.6 }

});

}


/* ================= FINAL POPUP ================= */

function showFinalPopup(score,total){

const popup = document.getElementById("finalPopup");
const finalScore = document.getElementById("finalScore");

finalScore.textContent = `Score: ${score} / ${total}`;

popup.style.display = "flex";

confetti({

particleCount:120,
spread:120,
origin:{ y:0.6 }

});

}
/* ================= PLAY AGAIN ================= */

document.addEventListener("DOMContentLoaded",()=>{

const playAgainBtn = document.getElementById("playAgainBtn");

if(playAgainBtn){

playAgainBtn.addEventListener("click",()=>{

location.reload();

});

}

});
/* ================= CLOSE FINAL POPUP WHEN NAV CLICKED ================= */

document.addEventListener("DOMContentLoaded", () => {

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
btn.addEventListener("click", () => {

const finalPopup = document.getElementById("finalPopup");

if(finalPopup){
finalPopup.style.display = "none";
}

});

});

});