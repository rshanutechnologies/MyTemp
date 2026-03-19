

let popupTimer=null;

const pairs = [
 {l:"Sheep", r:"Wool"},
 {l:"Silkworm", r:"Silk"},
 {l:"Leather", r:"Shoes"},
 {l:"Yak", r:"Mountains"},
 {l:"Seal", r:"Cold regions"}
];

const leftImages = {
 "Sheep":"../assets/images/Sheepak.png",
 "Silkworm":"../assets/images/Silkwormak.png",
 "Leather":"../assets/images/Leatherak.png",
 "Yak":"../assets/images/Yak.png",
 "Seal":"../assets/images/seal.png"
};

const images = {
 "Wool":"../assets/images/wool.png",
 "Silk":"../assets/images/silk.png",
 "Shoes":"../assets/images/shoes.png",
 "Mountains":"../assets/images/mountains.png",
 "Cold regions":"../assets/images/coldregion.png"
};

let armed=null;
let score=0;
let matched=0;
const letters=["a","b","c","d","e"];
const letterColors = [
"#f4b6b6",  // soft pink
"#f7d58a",  // light yellow
"#cfe5a6",  // light green
"#a8d8ea",  // light blue
"#adadad"   // soft purple
];

const lineColors = [
"#ff6b6b",
"#4dabf7",
"#51cf66",
"#ffd43b",
"#b197fc"
];
const leftCol=document.getElementById("leftCol");
const rightCol=document.getElementById("rightCol");
const lineSvg = document.getElementById("matchLines");

function drawLine(leftEl,rightEl){

const leftRect = leftEl.getBoundingClientRect();
const rightRect = rightEl.getBoundingClientRect();
const container = lineSvg.getBoundingClientRect();

const x1 = leftRect.right - container.left;
const y1 = leftRect.top + leftRect.height/2 - container.top;

const x2 = rightRect.left - container.left;
const y2 = rightRect.top + rightRect.height/2 - container.top;

/* control point for curve */
const cx = (x1 + x2) / 2;

const path = document.createElementNS("http://www.w3.org/2000/svg","path");

const d = `
M ${x1} ${y1}
C ${cx} ${y1},
  ${cx} ${y2},
  ${x2} ${y2}
`;

path.setAttribute("d", d);

/* different color for each line */
const color = lineColors[lineSvg.children.length % lineColors.length];

path.setAttribute("stroke", color);
path.setAttribute("stroke-width", "5");
path.setAttribute("fill", "none");
path.setAttribute("stroke-linecap", "round");

lineSvg.appendChild(path);
}
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");
const scoreBox = document.getElementById("scoreBox");

function updateScore(){
  scoreBox.textContent = "Score: " + score;
}

function speak(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

function showPopup(html,final=false){
 popup.style.display="flex";
 popupText.className=final?"popup-box popup-final":"popup-box";
 popupText.innerHTML=html;

 if(popupTimer) clearTimeout(popupTimer);

 if(!final){
  popupTimer=setTimeout(()=>popup.style.display="none",1000);
 }
}

function render(){
 leftCol.innerHTML="";
 rightCol.innerHTML="";

 pairs.forEach(p=>{
  const l=document.createElement("div");
  l.className="item";
l.innerHTML=`
<div class="icon-circle">
  <img src="${leftImages[p.l]}" class="left-icon">
</div>

<span class="question-text">${p.l}</span>

<div class="match-letter"></div>
`;
  l.onclick=()=>arm(l,p);
  leftCol.appendChild(l);
 });

 [...pairs].sort(()=>Math.random()-0.5).forEach((p,index)=>{
  const r=document.createElement("div");
  r.className="item";
r.innerHTML=`
<div class="letter" style="background:${letterColors[index]}">${letters[index]}</div>
<span>${p.r}</span>
`;
  r.onclick=()=>attempt(r,p);
  rightCol.appendChild(r);
 });
}

function arm(el,p){
 if(el.classList.contains("correct")) return;
 document.querySelectorAll(".left .item").forEach(i=>i.classList.remove("armed"));
 el.classList.add("armed");
 armed={el,p};
}

function attempt(el,p){
 if(!armed || el.classList.contains("correct")) return;

 if(armed.p.r===p.r){

  // remove active highlight
  el.classList.remove("active");

  armed.el.classList.add("correct");
  el.classList.add("correct");
  drawLine(armed.el,el);

  // ⭐ show letter on left item
  const letter = el.querySelector(".letter").textContent;
  armed.el.querySelector(".match-letter").textContent = letter;

  score++;
  matched++;
  updateScore();

  speak("Correct");
   fireConfetti(); 

  document.querySelectorAll(".left .item").forEach(i=>i.classList.remove("armed"));
  armed=null;

  if(matched===pairs.length){
   setTimeout(finalPopup,1100);
  }
}
 else{
  speak("Wrong");
 
  // ⬅️ LEFT QUESTION STAYS SELECTED (NO RESET)
 }
}

function finalPopup(){

  const finalPopup = document.getElementById("finalPopup");

  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent =
  `Score: ${score} / ${pairs.length}`;

  document.getElementById("stars").textContent =
  "⭐".repeat(score);

   fireConfettif(); 
}


render();


const leftItems = document.querySelectorAll(".left .item");

leftItems.forEach(item => {
  item.addEventListener("click", () => {


    leftItems.forEach(i => i.classList.remove("active"));

    item.classList.add("active");
      setTimeout(()=>{
      item.classList.remove("active");
    },4000);

  });
});

const rightItems = document.querySelectorAll(".right .item");

rightItems.forEach(item => {

  item.addEventListener("click", () => {

    // remove previous highlights
    rightItems.forEach(i => i.classList.remove("active"));

    // add highlight
    item.classList.add("active");

    // remove highlight after 4 seconds
    setTimeout(()=>{
      item.classList.remove("active");
    },1000);

  });

});

function fireConfettif() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 }
  });
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 }
  });
}