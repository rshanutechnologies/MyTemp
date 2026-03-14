let selectedLeft = null;
let score = 0;

const total = document.querySelectorAll(".left-item").length;
const svg = document.querySelector(".line-svg");
const container = document.querySelector(".match-container");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

const processFill = document.getElementById("processFill");
const processPills = document.getElementById("processPills");

function speakOnly(text){
  if(!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-Uk";
  u.volume = 0.25;   // 🔉 decrease volume (0 to 1)

  speechSynthesis.speak(u);
}

/* ✅ Progress Render */
function renderProcess(){
  const percent = (score / total) * 100;
  processFill.style.width = percent + "%";

  processPills.innerHTML = "";

  for(let i=0;i<total;i++){
    const pill = document.createElement("div");
    pill.className = "p-pill";
    if(i < score) pill.classList.add("done");
    if(i === score && score !== total) pill.classList.add("active");
    processPills.appendChild(pill);
  }
}

/* ✅ Popup */
function showPopup(html, final=false){
  popup.style.display = "flex";
  popupText.className = final ? "popup-box final-wide" : "popup-box";
  popupText.innerHTML = html;
  if(!final) setTimeout(()=> popup.style.display="none", 1000);
}

/* ✅ Select Left */
document.querySelectorAll(".left-item").forEach(item=>{
  item.addEventListener("click",()=>{

    if(item.classList.contains("correct-match")) return;

    document.querySelectorAll(".left-item")
      .forEach(i=>i.classList.remove("selected"));

    selectedLeft = item;
    item.classList.add("selected");
  });
});

/* ✅ Click Right */
document.querySelectorAll(".right-item").forEach(item=>{
  item.addEventListener("click",()=>{

    if(!selectedLeft) return;
    if(item.classList.contains("correct-match")) return;

    const correctKey = selectedLeft.dataset.match;
    const chosenKey = item.dataset.key;

    if(correctKey === chosenKey){

      drawLine(selectedLeft, item);

      selectedLeft.classList.add("correct-match");
      item.classList.add("correct-match");

      selectedLeft.classList.remove("selected");
      selectedLeft.style.pointerEvents = "none";
      item.style.pointerEvents = "none";

      score++;
      renderProcess();
      speakOnly("Correct");

      showPopup(`
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">${"⭐".repeat(score)}</div>
        </div>
      `);

      selectedLeft = null;

      if(score === total){
        setTimeout(()=>{
          speakOnly("");

          showPopup(`
            <div class="popup-final-content">
              🎉 Congratulations!
              <span class="emoji">🏆</span>
              You finished the matching!
              <div class="final-score">
                Score: <b>${score} / ${total}</b>
              </div>
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <button class="restart"
                onclick="location.reload()">
                🔄 Restart
              </button>
            </div>
          `, true);

        }, 1200);
      }

    }else{

      speakOnly("Wrong");

      showPopup(`
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 Try again!</div>
        </div>
      `);

      selectedLeft.classList.remove("selected");
      selectedLeft = null;
    }
  });
});

/* ✅ Draw Line */
function drawLine(left, right){

  const rect1 = left.getBoundingClientRect();
  const rect2 = right.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const x1 = rect1.right - containerRect.left;
  const y1 = rect1.top + rect1.height/2 - containerRect.top;

  const x2 = rect2.left - containerRect.left;
  const y2 = rect2.top + rect2.height/2 - containerRect.top;

  const line = document.createElementNS("http://www.w3.org/2000/svg","line");

  line.setAttribute("x1",x1);
  line.setAttribute("y1",y1);
  line.setAttribute("x2",x2);
  line.setAttribute("y2",y2);
  line.setAttribute("stroke","#16a34a");
  line.setAttribute("stroke-width","3");
  line.setAttribute("stroke-dasharray","6,6");

  svg.appendChild(line);
}

renderProcess();