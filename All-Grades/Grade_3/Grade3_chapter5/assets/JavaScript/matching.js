let activeLeft = null;

let score = 0;


const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

const leftItems = document.querySelectorAll("#leftBank .item");
const rightItems = document.querySelectorAll("#rightBank .item");

// ✅ Text-to-Speech (only "Correct" / "Wrong")
function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function showPopup(isCorrect){
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.style.display = "flex";

  if(isCorrect){
    speak("Correct");
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  }else{
    speak("Wrong");
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(()=> popup.style.display="none", 1200);
}
function drawLine(el1, el2){

  const svg = document.getElementById("lineLayer");

  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  const parentRect = svg.getBoundingClientRect();

  const x1 = rect1.right - parentRect.left;
  const y1 = rect1.top + rect1.height/2 - parentRect.top;

  const x2 = rect2.left - parentRect.left;
  const y2 = rect2.top + rect2.height/2 - parentRect.top;

  const line = document.createElementNS("http://www.w3.org/2000/svg","line");

  line.setAttribute("x1",x1);
  line.setAttribute("y1",y1);
  line.setAttribute("x2",x2);
  line.setAttribute("y2",y2);

  line.setAttribute("stroke","#22c55e");
  line.setAttribute("stroke-width","3");
  line.setAttribute("stroke-dasharray","6,6");

  svg.appendChild(line);
}
function showFinalPopup(){
  const popup = document.getElementById("finalPopup");
  popup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${leftItems.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}

function showCorrectPopup(starsCount) {
  speak("Correct");
  showPopup(`
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">${"⭐".repeat(starsCount)}</div>
        </div>
      `);
}

function showWrongPopup() {
  speak("Wrong");
  showPopup(`
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 You can do it!</div>
        </div>
      `);
}




// ✅ click left
leftItems.forEach((item) => {
  item.onclick = () => {
    if (item.classList.contains("used")) return;
    document
      .querySelectorAll(".item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    activeLeft = item;
  };
});

// ✅ click right
rightItems.forEach((action) => {
  action.onclick = () => {
    if (!activeLeft) return;
    if (action.classList.contains("used")) return;

    const isCorrect = action.dataset.value === activeLeft.dataset.answer;

if (isCorrect) {

  score++;

  action.classList.add("used");
  activeLeft.classList.add("used");
  activeLeft.classList.remove("active");

  action.classList.add("correct-highlight");
  activeLeft.classList.add("correct-highlight");

  // 🔥 APPLY LEFT COLOR TO RIGHT
  const leftBg = window.getComputedStyle(activeLeft).backgroundColor;
  action.style.backgroundColor = leftBg;

  drawLine(activeLeft, action);

  showPopup(true);

  activeLeft = null;

  if (score === leftItems.length) {
    setTimeout(() => showFinalPopup(), 1100);
  }
} else {

      action.classList.add("wrong");
      setTimeout(() => action.classList.remove("wrong"), 350);

      showPopup(false);
    }
  };
});