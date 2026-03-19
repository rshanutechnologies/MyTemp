/* ================= NAVBAR SECTION SWITCH ================= */

function switchSection(type){

const finalPopup = document.getElementById("finalPopup");

if(finalPopup){
finalPopup.style.display = "none";
}

filteredQuestions = questions.filter(q => q.type === type);

currentQuestionIndex = 0;
score = 0;

userAnswers = new Array(filteredQuestions.length).fill(null);

prevBtn.disabled = true;
nextBtn.disabled = true;

/* ✅ NEW: update active button based on type */
document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
document.querySelectorAll(`.${type}-btn`).forEach(b => b.classList.add("active"));

loadQuestion();

/* close sidebar if open */

if(sideMenu.classList.contains("open")){
sideMenu.classList.remove("open");
hamburger.style.display = "flex";
}

}


/* ================= NAVBAR BUTTON EVENTS ================= */

/* MCQ */

document.querySelectorAll(".mcq-btn").forEach(btn=>{
btn.addEventListener("click",()=>{
switchSection("mcq");
});
});

/* FIB */

document.querySelectorAll(".fib-btn").forEach(btn=>{
btn.addEventListener("click",()=>{
switchSection("fib");
});
});

/* TF */

document.querySelectorAll(".tf-btn").forEach(btn=>{
btn.addEventListener("click",()=>{
switchSection("tf");
});
});

/* MATCH */

document.querySelectorAll(".match-btn").forEach(btn=>{
btn.addEventListener("click",()=>{
switchSection("match");
});
});


/* ================= HAMBURGER MENU ================= */

const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");


/* OPEN SIDEBAR */

hamburger.addEventListener("click", () => {
sideMenu.classList.add("open");
hamburger.style.display = "none";
});


/* CLOSE SIDEBAR */

closeMenu.addEventListener("click", () => {
sideMenu.classList.remove("open");
hamburger.style.display = "flex";
});


/* CLOSE WHEN CLICKING OUTSIDE */

document.addEventListener("click", function(e){

if(sideMenu.classList.contains("open")){

if(!sideMenu.contains(e.target) && !hamburger.contains(e.target)){
sideMenu.classList.remove("open");
hamburger.style.display = "flex";
}

}

});


/* ================= EXISTING ACTIVE LOGIC (UNCHANGED) ================= */

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // remove active from all
    navButtons.forEach(b => b.classList.remove("active"));

    // add active to clicked
    btn.classList.add("active");

  });
});