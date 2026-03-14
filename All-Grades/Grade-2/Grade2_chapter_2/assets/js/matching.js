
    const PAIRS = [
      { id: 'q1', color: 'pair-c1', q: '1. Skull ( )', a: 'It protects our brain.', img: '../assets/images/q4-img.png' },
      { id: 'q2', color: 'pair-c2', q: '2. Ribcage ( )', a: 'It protects our lungs and heart.', img: '../assets/images/q2-M.png' },
      { id: 'q3', color: 'pair-c3', q: '3. Backbone ( )', a: 'It helps us stand up straight.', img: '../assets/images/q3-M.png' },
      { id: 'q4', color: 'pair-c4', q: '4. Joints ( )', a: 'They help us bend our arms and legs.', img: '../assets/images/q1-img.png' }
    ];

    const qsEl = document.getElementById("questions");
    const asEl = document.getElementById("answers");
    const scoreBox = document.getElementById("scoreBox");
const IS_MOBILE = window.innerWidth <= 768;

let selectedAnswer = null;

function enableMobileMatching(answerEl){

  answerEl.addEventListener("click", () => {

    if(answerEl.classList.contains("matched")) return;

    /* select answer */
    document.querySelectorAll(".a-piece")
      .forEach(a => a.classList.remove("active"));

    answerEl.classList.add("active");
    selectedAnswer = answerEl;
  });
}

function enableQuestionTap(questionEl){

  questionEl.addEventListener("click", () => {

    if(!selectedAnswer) return;
    if(questionEl.classList.contains("locked")) return;

    const answerId = selectedAnswer.dataset.id;
    const questionId = questionEl.dataset.id;

    if(answerId === questionId){
        correct(questionEl, selectedAnswer);
    }else{
        wrong(selectedAnswer);
        showPopup(false);
    }

    selectedAnswer.classList.remove("active");
    selectedAnswer = null;
  });
}

    let score = 0;
    let matched = new Set();

    const shuffle = arr => arr.map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(({ v }) => v);

    // function speak(text) {
    //   window.speechSynthesis.cancel();
    //   const u = new SpeechSynthesisUtterance(text);
    //   u.lang = "en-Uk";
    //   u.rate = 0.9;
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

    function showPopup(isCorrect, imgSrc) {
      const popup = document.getElementById("popup");
      const popupMedia = document.getElementById("popupMedia");
      const popupText = document.getElementById("popupText");

      popupMedia.innerHTML = "";
      popupText.className = "popup-msg";

      if (isCorrect) {
        const img = document.createElement("img");
        img.src = imgSrc;
        popupMedia.appendChild(img);
        popupText.textContent = "Correct! ✅";
        popupText.classList.add("correct");
        speak("Correct");
      } else {
        popupMedia.innerHTML = `<div style="font-size:70px;">😢</div>`;
        popupText.textContent = "Wrong! ❌";
        popupText.classList.add("wrong");
        speak("Wrong");
      }

      popup.style.display = "flex";
      setTimeout(() => popup.style.display = "none", 1200);
    }

  function createQuestion(pair) {
  const q = document.createElement("div");
  q.className = `piece q-piece ${pair.color}`;
  q.dataset.id = pair.id;
  q.textContent = pair.q;

  if(IS_MOBILE){
    enableQuestionTap(q);
  }

  return q;
}

   function createAnswer(pair) {
  const a = document.createElement("div");
  a.className = "piece a-piece";
  a.dataset.id = pair.id;
  a.textContent = pair.a;

  if(IS_MOBILE){
    enableMobileMatching(a);
  }else{
    a.style.top = "0px";
    a.style.left = "0px";
    makeDraggable(a);
  }

  return a;
}
    function render() {
      qsEl.innerHTML = "";
      asEl.innerHTML = "";

      PAIRS.forEach(p => qsEl.appendChild(createQuestion(p)));

      const shuffled = shuffle([...PAIRS]);
      let y = 0;
      shuffled.forEach(p => {
        const ans = createAnswer(p);
        asEl.appendChild(ans);
        ans.style.top = `${y}px`;
        ans.style.left = `0px`;

        // ✅ store original position
        ans.dataset.homeX = "0";
        ans.dataset.homeY = y;

        y += 120;
      });
    }
    function layoutAnswers() {
      const answers = Array.from(asEl.querySelectorAll(".a-piece:not(.matched)"));

      let y = 0;
      answers.forEach(a => {
        a.style.left = "0px";
        a.style.top = `${y}px`;
        a.dataset.homeX = "0";
        a.dataset.homeY = y;
        y += 120;
      });
    }

    function makeDraggable(el) {
      let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false;

      el.addEventListener("pointerdown", (e) => {
        if (el.classList.contains("locked")) return;
        dragging = true;
        el.setPointerCapture(e.pointerId);
        el.style.zIndex = 999;
        startX = e.clientX; startY = e.clientY;
        origX = parseFloat(el.style.left || "0");
        origY = parseFloat(el.style.top || "0");
      });

      el.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = `${origX + dx}px`;
        el.style.top = `${origY + dy}px`;
      });

      el.addEventListener("pointerup", (e) => {
        if (!dragging) return;
        dragging = false;
        el.releasePointerCapture(e.pointerId);
        attemptDrop(el);
      });
    }

    function attemptDrop(answerEl) {
      const aRect = answerEl.getBoundingClientRect();
      const aCenterY = aRect.top + aRect.height / 2;
      const targetId = answerEl.dataset.id;

      const questions = Array.from(qsEl.querySelectorAll(".q-piece"));

      let closest = null;
      let minDist = Infinity;

      for (const q of questions) {
        const r = q.getBoundingClientRect();
        const qCenterY = r.top + r.height / 2;
        const dist = Math.abs(aCenterY - qCenterY);

        if (dist < minDist) {
          minDist = dist;
          closest = q;
        }
      }

      // ❌ too far away = wrong drop
      if (minDist > 80) {
        wrong(answerEl);
        showPopup(false);
        return;
      }

      // ✅ correct / wrong match
      if (closest.dataset.id === targetId) {
        correct(closest, answerEl);
      } else {
        wrong(answerEl);
        showPopup(false);
      }
    }
    function shuffleRemainingAnswers() {

      const allAnswers = Array.from(asEl.querySelectorAll(".a-piece"));
      const rowHeight = 120;

      // 🔒 Get rounded locked positions
      const lockedSlots = [];
      allAnswers.forEach(a => {
        if (a.classList.contains("matched")) {
          const rounded = Math.round(parseFloat(a.style.top) / rowHeight) * rowHeight;
          lockedSlots.push(rounded);
        }
      });

      // 📏 Build all slot positions
      const totalSlots = PAIRS.length;
      let availableSlots = [];

      for (let i = 0; i < totalSlots; i++) {
        const slotY = i * rowHeight;
        if (!lockedSlots.includes(slotY)) {
          availableSlots.push(slotY);
        }
      }

      // 🔀 Shuffle remaining answers
      const remaining = allAnswers.filter(a => !a.classList.contains("matched"));
      remaining.sort(() => Math.random() - 0.5);

      // 📌 Assign free slots
      remaining.forEach((a, index) => {
        const newY = availableSlots[index];
        a.style.top = `${newY}px`;
        a.style.left = "0px";
        a.dataset.homeY = newY;
      });
    }


function correct(questionEl, answerEl) {

  const id = questionEl.dataset.id;
  const pair = PAIRS.find(p => p.id === id);

  if (matched.has(id)) return;

  matched.add(id);
  score++;
  scoreBox.textContent = `Score: ${score}`;

  /* ===== DESKTOP ALIGN ===== */
  if (!IS_MOBILE) {

    // get viewport positions
    const qRect = questionEl.getBoundingClientRect();
    const answersRect = asEl.getBoundingClientRect();

    // convert to answers container coordinates
    const topPos = qRect.top - answersRect.top;

    answerEl.style.position = "absolute";
    answerEl.style.left = "0px";
    answerEl.style.top = `${topPos}px`;

    answerEl.dataset.homeY = topPos;

    shuffleRemainingAnswers();
  }
  else {
    questionEl.after(answerEl);
  }

  /* ===== APPLY COLORS ===== */
  answerEl.classList.add("locked", "matched", pair.color);
  questionEl.classList.add("locked");

  answerEl.style.pointerEvents = "none";

  showPopup(true, pair.img);

  if (matched.size === PAIRS.length) {
    setTimeout(showFinalPopup, 900);
  }
}

    function showHint() {
      document.getElementById("hintPopup").style.display = "flex";
    }
    function closeHint() {
      document.getElementById("hintPopup").style.display = "none";
    }

function wrong(answerEl) {

  answerEl.classList.add("shake");

  setTimeout(() => {

    answerEl.classList.remove("shake");

    if(!IS_MOBILE){
      answerEl.style.left = `${answerEl.dataset.homeX}px`;
      answerEl.style.top = `${answerEl.dataset.homeY}px`;
    }

  }, 300);
}


    /* ✅ FINAL POPUP (same as fill in blanks + restart trophy animation) */
    function showFinalPopup() {
      const finalPopup = document.getElementById("finalPopup");
      finalPopup.style.display = "flex";

      document.getElementById("finalScore").textContent = `Score: ${score} / ${PAIRS.length}`;
      document.getElementById("finalStars").textContent = "⭐".repeat(score);

      // ✅ Restart trophy animation EVERY time popup opens
      const img = document.getElementById("winnerImg");
      img.style.animation = "none";
      img.offsetHeight; // force reflow
      img.style.animation = "liftTrophy 1.1s ease-in-out infinite";

      speak(`Congratulations! Your score is ${score} out of ${PAIRS.length}`);
    }

    function restartQuiz() {
      matched.clear();
      score = 0;
      scoreBox.textContent = "Score: 0";
      document.getElementById("finalPopup").style.display = "none";
      render();
    }

    /* 🔹 HINT POPUP CONTROLS */
    function openHint() {
      document.getElementById("hintPopup").style.display = "flex";
    }

    function closeHint() {
      document.getElementById("hintPopup").style.display = "none";
    }

    render();
 
