const questions = [
  {
    q: " _____ is the period of time for which a human being, an animal or a plant lives.",
    a: "lifespan",
    img: "../assets/images/cow-img.png",
  },
  { q: "Living things respond to _____ .", a: "stimuli", img: "../assets/images/panda-img.png" },
 {
  q: "Rabbits _______________ using their limbs.",
  a: ["hop", "leap"],   // ✅ multiple correct answers
  img: "../assets/images/hamaster-img.png",
},
  {
    q: " Earthworms use their _____ to slide or crawl.",
    a: "muscle",
    img: "../assets/images/earthwarm-img.png",
  },
  { q: "Fishes use their ____ to change direction while swimming.", a: "tail", img: "../assets/images/fish-img.png" },
];

let currentPage = 0;
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const QUESTIONS_PER_PAGE = 1;

const pages = [];
let score = 0;
let answered = 0;

const path = document.getElementById("path");

/* SPLIT INTO PAGES */
for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
  pages.push(questions.slice(i, i + QUESTIONS_PER_PAGE));
}

/* BUILD UI */
pages.forEach((group, pageIndex) => {
  const page = document.createElement("div");
  page.className = "page";
  if (group.length === 1) page.classList.add("single");

  group.forEach((q, qIndex) => {
    const card = document.createElement("div");
card.innerHTML = `
  <div class="content">
    <img src="${q.img}" class="plain-img" draggable="false">
    <div class="question">${q.q}</div>

    <div class="input-wrap">
      <input class="plain-input" placeholder="Type here ....">
      <button class="check">Check</button>
    </div>
  </div>
`;


   const input = card.querySelector(".plain-input");
const btn = card.querySelector(".check");
const answerBox = card;

  function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}
btn.onclick = () => {
  const typed = input.value.trim().toLowerCase();
  const correctAnswers = q.a;

  const isCorrect = Array.isArray(correctAnswers)
    ? correctAnswers.includes(typed)
    : typed === correctAnswers.toLowerCase();

  if (isCorrect) {
    btn.disabled = true;
    input.disabled = true;

    answerBox.classList.add("correct");

    score++;
    answered++;

    speak("Correct");
    showPopup(true);

    nextBtn.disabled = false;
    prevBtn.disabled = false;

    if (answered === questions.length) {
      setTimeout(showFinal, 1200);
    }

  } else {
    input.value = "";
    speak("Wrong");
    showPopup(false);
  }
};

    page.appendChild(card);
  });

  path.appendChild(page);
});



/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
}

function updateSlide() {
  const viewport = document.querySelector(".viewport");
  const slideHeight = viewport.clientHeight; // ✅ dynamic height

  path.style.transform = `translateY(-${currentPage * slideHeight}px)`;

  prevBtn.disabled = currentPage === 0;

  const currentPageEl = path.children[currentPage];
  const pageCompleted = [...currentPageEl.querySelectorAll("input")].every(
    (input) => input.disabled
  );

  nextBtn.disabled = !pageCompleted;
}

updateSlide();

prevBtn.onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    updateSlide();
  }
};

nextBtn.onclick = () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    updateSlide();
  }
};
