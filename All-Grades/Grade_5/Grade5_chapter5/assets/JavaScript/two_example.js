

const quizData = [
  {
    q: "Q1.What are the functions of the skeleton?",
    a: "The skeleton gives shape and support to the body, protects internal organs, and helps in movement",
    img: "../assets/images/skeleton.png"
  },
  
{
  q: "Q2.How many bones are there in:<br> a) a newborn baby  b) the backbone c) the skull d) the upper leg",
  a: ["300", "33", "22", "1"],   // ✅ 4 answers
  img: "../assets/images/newborn.png",
  type: "multi"                 // 🔥 mark as special
},
  {
    q: "Q.3.What is a cartilage?",
    a: "Cartilage is a strong but flexible tissue found at the joints and ends of bones",
    img: "../assets/images/cartilage.png"
  },
  {
    q: "Q4.Give two functions of our backbone.",
    a: "The backbone supports the body and protects the spinal cord",
    img: "../assets/images/backbone.png"
  },
  {
    q: "Q5.What is posture? Why is it necessary to maintain a good posture?",
    a: "Posture is the position of our body while sitting or standing. Good posture keeps the body healthy and prevents pain",
    img: "../assets/images/posture.png"
  }
];



let current = 0;
let score = 0;

const answered = Array(quizData.length).fill(false);
const userAnswers = Array(quizData.length).fill("");

const qEl = document.getElementById("question");
const imgEl = document.getElementById("questionImg");
const input = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");



input.addEventListener("input", () => {
  submitBtn.disabled = input.value.trim() === "";
});
 
// function speak(t){
//   speechSynthesis.cancel();
//   speechSynthesis.speak(new SpeechSynthesisUtterance(t));
// }

function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";  
  msg.volume = 0.25;   // 🔉 lower volume (0 to 1)
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
    popup.className = "popup correct";
      icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    popup.className = "popup wrong";
       icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }

  setTimeout(()=>{
    popup.style.display="none";
  },1200);
}


function showFinal(){
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${quizData.length}`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score);
}


/* 🔄 LOAD QUESTION */
function loadQuestion(){
  const q = quizData[current];
  const multiBox = document.getElementById("multiInputs");

  qEl.innerHTML = q.q;
  imgEl.src = q.img;
  imgEl.style.display = "block";

  if(q.type === "multi"){
    // 🔥 Question 2
    input.style.display = "none";
    multiBox.style.display = "flex";

   [...multiBox.children].forEach(inp => {
  inp.value = "";

  inp.addEventListener("input", checkMultiInputs); // 🔥 attach listener
});

submitBtn.disabled = true; // 🔥 keep disabled until all filled

  } else {
    // 🔥 Normal questions
    input.style.display = "block";
    multiBox.style.display = "none";

    input.value = userAnswers[current] || "";
  }

  input.disabled = answered[current];
  submitBtn.disabled = true;       
  // submitBtn.disabled = answered[current];

  prevBtn.disabled = current === 0;
  nextBtn.disabled = !answered[current];
}
/* ✅ SUBMIT */
submitBtn.onclick = () => {

  const q = quizData[current];

// 🔥 SPECIAL CHECK FOR QUESTION 2
if(q.type === "multi"){
  const multiBox = document.getElementById("multiInputs");
  const values = [...multiBox.children].map(i => i.value.trim());

  if(JSON.stringify(values) === JSON.stringify(q.a)){
    answered[current] = true;
    score++;
   speak("Correct");
showPopup(true);


    nextBtn.disabled = false;
  } else {
   speak("Wrong");
showPopup(false);


  }
  return;
}

  if(answered[current]) return;

  const userAns = input.value.trim().toLowerCase();
  const correctAns = quizData[current].a.toLowerCase();

  if(userAns === correctAns){
    answered[current] = true;
    userAnswers[current] = userAns;
    score++;

    speak("Correct");

  showPopup(true);


    nextBtn.disabled = false;

    if(current === quizData.length - 1){
      setTimeout(()=>{
       showFinal();


        nextBtn.disabled = true;
        prevBtn.disabled = true;
      }, 800);
    }

  } else {
    speak("Wrong");

   showPopup(false);


    input.value = "";
    submitBtn.disabled = true;   // 🔥 disable again

  }
};

nextBtn.onclick = () => {
  current++;
  loadQuestion();
};

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};

loadQuestion();
function checkMultiInputs(){
  const multiBox = document.getElementById("multiInputs");
  const allFilled = [...multiBox.children]
    .every(inp => inp.value.trim() !== "");

  submitBtn.disabled = !allFilled;
}
