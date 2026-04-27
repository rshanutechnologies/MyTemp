const questions = [
  {
    q: "Q1. There are  __________ factors that affect our environment.",
    a: ["biotic", "abiotic"],
    img: "../assets/images/fb1-img.png",
  },
  {
    q: "Q2. Everything that surrounds and affects a living thing forms its __________",
    a: "environment",
    img: "../assets/images/fb2-img.png",
  },
  {
    q: "Q3. The biotic components depend on the abiotic factors. This is called  ___________",
    a: "interdependence",
    img: "../assets/images/fb3-img.png",
  },
  {
    q: "Q4. Plants take in the __________ from the soil, with the help of water, through their ___________",
    a: ["minerals", "roots"],
    img: "../assets/images/fb4-img.png",
  },
  {
    q: "Q5. The living things in the environment are called the ______________ components",
    a: "biotic",
    img: "../assets/images/fb5-img.png",
  },
];

let index = 0;
let score = 0;
const answers = Array(questions.length).fill(null);

/* ELEMENTS */
const qImg = document.getElementById("qImg");
const qText = document.getElementById("qText");

const input = document.getElementById("answerInput");
const input1 = document.getElementById("answerInput1");
const input2 = document.getElementById("answerInput2");

const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");

const singleInputBox = document.getElementById("singleInputBox");
const doubleInputBox = document.getElementById("doubleInputBox");

/* ========================= */
/* LOAD */
/* ========================= */

function load(){

  const q = questions[index];

  qImg.src = q.img;
  qText.textContent = q.q;

  prev.disabled = index === 0;
  next.disabled = true;

  /* DOUBLE INPUT */
  if(Array.isArray(q.a)){
    singleInputBox.style.display = "none";
    doubleInputBox.style.display = "flex";
  }else{
    singleInputBox.style.display = "flex";
    doubleInputBox.style.display = "none";
  }

  /* RESTORE ANSWER */
  if(answers[index]){

    if(Array.isArray(q.a)){
      const parts = answers[index].split(" ");

      input1.value = parts[0] || "";
      input2.value = parts[1] || "";

      input1.disabled = true;
      input2.disabled = true;

    }else{
      input.value = answers[index];
      input.disabled = true;
    }

    check.disabled = true;
    next.disabled = false;

  }else{

    input.value = "";
    input1.value = "";
    input2.value = "";

    input.disabled = false;
    input1.disabled = false;
    input2.disabled = false;

    check.disabled = true;
  }
}

/* ========================= */
/* ENABLE CHECK BUTTON */
/* ========================= */

function updateCheckBtn(){

  if(Array.isArray(questions[index].a)){
    check.disabled = !(input1.value.trim() && input2.value.trim());
  }else{
    check.disabled = !input.value.trim();
  }
}

input.oninput = updateCheckBtn;
input1.oninput = updateCheckBtn;
input2.oninput = updateCheckBtn;

/* ========================= */
/* CHECK ANSWER */
/* ========================= */

check.onclick = () => {

  let isCorrect = false;

  if(Array.isArray(questions[index].a)){

    const val1 = input1.value.trim().toLowerCase();
    const val2 = input2.value.trim().toLowerCase();

    const correct1 = questions[index].a[0].toLowerCase();
    const correct2 = questions[index].a[1].toLowerCase();

    isCorrect = (val1 === correct1 && val2 === correct2);

    if(isCorrect){
      answers[index] = val1 + " " + val2;
    }

  }else{

    const typed = input.value.trim().toLowerCase();
    const correct = questions[index].a.toLowerCase();

    isCorrect = (typed === correct);

    if(isCorrect){
      answers[index] = typed;
    }
  }

  if(isCorrect){

    score++;

    speak("Correct");
    showPopup(true);

    input.disabled = true;
    input1.disabled = true;
    input2.disabled = true;

    check.disabled = true;
    next.disabled = false;

    if(index === questions.length - 1){
      setTimeout(showFinal,1000);
    }

  }else{

    speak("Wrong");
    showPopup(false);

    if(Array.isArray(questions[index].a)){
      input1.value = "";
      input2.value = "";
    }else{
      input.value = "";
    }

    check.disabled = true;
  }
};

/* ========================= */
/* NAV */
/* ========================= */

prev.onclick = () => {
  index--;
  load();
};

next.onclick = () => {
  if(!answers[index]) return;

  index++;
  load();
};

/* ========================= */
/* POPUP */
/* ========================= */

function showPopup(isCorrect){

  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");

  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
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

  setTimeout(()=>popup.style.display="none",1200);
}

/* ========================= */
/* FINAL */
/* ========================= */

function showFinal(){
  document.getElementById("finalPopup").style.display="flex";
  document.getElementById("finalScore").textContent =
    `Score: ${score}/${questions.length}`;
  document.getElementById("stars").textContent = "⭐".repeat(score);
}

/* ========================= */
/* SPEECH */
/* ========================= */

function speak(t){
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(t);
  msg.lang = "en-UK";
  msg.volume = 0.25;
  speechSynthesis.speak(msg);
}

/* ========================= */
/* DRAG FIX */
/* ========================= */

document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => e.preventDefault());

input.addEventListener("drop", e => e.preventDefault());
input1.addEventListener("drop", e => e.preventDefault());
input2.addEventListener("drop", e => e.preventDefault());

qImg.addEventListener("dragover", e=>{
  e.preventDefault();
  qImg.style.border="3px dashed #4cc9f0";
});

qImg.addEventListener("dragleave", ()=>{
  qImg.style.border="none";
});

qImg.addEventListener("drop", e=>{
  e.preventDefault();
  qImg.style.border="none";

  const file = e.dataTransfer.files[0];

  if(file && file.type.startsWith("image/")){
    const reader = new FileReader();
    reader.onload = ev => qImg.src = ev.target.result;
    reader.readAsDataURL(file);
  }
});

/* START */
load();