
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
  popupText.className = final ? "popup-box popup-final" : "popup-box";
  popupText.innerHTML = html;
  if(!final) setTimeout(() => popup.style.display = "none", 1000);
}
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../index1.html";
});

let dragged = null;
let score = 0;
const total = document.querySelectorAll(".slot").length;
const progressPill = document.getElementById("progressPill");

function updateProgress(){
  
}
updateProgress();

document.querySelectorAll('.token').forEach(token=>{
  token.addEventListener('dragstart',()=>{
    if(token.getAttribute("draggable") === "false") return;
    dragged = token;
  });
});

document.querySelectorAll('.slot').forEach(slot=>{
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', () => {
    if(!dragged) return;
    if(slot.classList.contains("filled")) return;

    if(dragged.dataset.match === slot.dataset.match){
      score++;
      updateProgress();

      speakText("Correct");
      

      slot.classList.add('filled');
      slot.querySelector('.drop')?.remove();

      dragged.classList.add("correct-token");
      dragged.setAttribute('draggable','false');

      slot.appendChild(dragged);
      dragged = null;

      if(score === total){
        setTimeout(()=>{
          showPopup(`
            <div class="popup-final-content">
              🎉 Congratulations!
              <span class="emoji">🏆</span>
              You finished the quiz!
              <div class="final-score">Score: <b>${score} / ${total}</b></div>
              <div class="stars">${"⭐".repeat(score)}</div>
              <button class="restart" onclick="location.reload()">🔄Restart</button>
            </div>
          `, true);
        }, 1100);
      }

    } else {
      speakText("Wrong");
     

      slot.classList.add('wrong');
      setTimeout(() => slot.classList.remove('wrong'), 350);
    }
  });
});
