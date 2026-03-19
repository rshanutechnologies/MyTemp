const leftData=[
 {text:"1. Egg-laying mammals", match:"b", img:"../assets/images/platypus.png"},
 {text:"2. Frogs and fishes", match:"e", img:"../assets/images/frog.png"},
 {text:"3. Yolk", match:"d", img:"../assets/images/yolk.png"},
 {text:"4. Broody hen", match:"a", img:"../assets/images/hen.png"},
 {text:"5. Bats", match:"c", img:"../assets/images/bat.png"}
];

const rightData=[
 {text:"a) A hen that sits on her eggs", match:"a"},
 {text:"b) Platypus and echidna", match:"b"},
 {text:"c) Aerial mammals", match:"c"},
 {text:"d) Provides nutrition to the baby bird", match:"d"},
 {text:"e) Lay adhesive eggs", match:"e"}
];

let selected=null;
let score=0;
let matched=0;

const leftCol=document.getElementById("leftCol");
const rightCol=document.getElementById("rightCol");
const svg=document.getElementById("lines");


const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupEmoji = document.getElementById("popupEmoji");
const playAgainBtn = document.getElementById("playAgainBtn");
function shuffle(arr){
 return arr.sort(()=>Math.random()-0.5);
}
function speakText(t) {
  speechSynthesis.cancel();
 
  const msg = new SpeechSynthesisUtterance(t);  
 
  msg.lang = "en-UK";  
  msg.volume = 0.25;    
  msg.rate = 1;
  msg.pitch = 1;
 
  speechSynthesis.speak(msg);  
}

window.speechSynthesis.onvoiceschanged = () => {};
function fireConfetti(){

  confetti({
    particleCount: 40,
    spread: 70,
    origin: { y: 0.6 },
    scalar: 0.7
  });

}
function init(){
 leftData.forEach(item=>{
   const div=document.createElement("div");
   div.className="item";
   div.dataset.match=item.match;
  div.innerHTML=`
  <div class="left-content">
    <img src="${item.img}" class="left-img">
    <span>${item.text}</span>
  </div>
  <div class="anchor"></div>
`;
   div.onclick=()=>{
     if(div.classList.contains("matched")) return;
     document.querySelectorAll(".left .item").forEach(i=>i.classList.remove("active"));
     div.classList.add("active");
     selected=div;
   };
   leftCol.appendChild(div);
 });

 rightData.forEach(item=>{
   const div=document.createElement("div");
   div.className="item";
   div.dataset.match=item.match;
   div.innerHTML=`
<div class="anchor"></div>
<span class="right-text">${item.text}</span>
<div class="oval-box"></div>
`;
   div.onclick=()=>{
 if(!selected || div.classList.contains("matched")) return;

 if(selected.dataset.match===div.dataset.match){

    fireConfetti();
    speakText("Correct");
    match(selected,div);

 } else {

    speakText("Wrong");

 }
};
   rightCol.appendChild(div);
 });
}

function match(left,right){

  // Get left image src
  const imgSrc = left.querySelector(".left-img").src;

  // Create new image for right box
  const newImg = document.createElement("img");
  newImg.src = imgSrc;
 newImg.style.width = "55px";
newImg.style.height = "35px";
newImg.style.objectFit = "contain";

  // Insert image inside right item (before text)
 const box = right.querySelector(".oval-box");
box.innerHTML = "";
box.appendChild(newImg);

  left.classList.add("matched");
  right.classList.add("matched");
  left.classList.remove("active");

  drawLine(left,right);

  selected=null;
  score++;
  matched++;

 if(matched===leftData.length){
    setTimeout(()=>{
        popup.classList.add("hidden"); // hide correct popup first
        showResult();                 // then show final popup
    },1200);
}
}

function drawLine(l,r){
 const r1=l.querySelector(".anchor").getBoundingClientRect();
 const r2=r.querySelector(".anchor").getBoundingClientRect();
 const svgRect=svg.getBoundingClientRect();

 const x1=r1.left-svgRect.left;
 const y1=r1.top-svgRect.top;
 const x2=r2.left-svgRect.left;
 const y2=r2.top-svgRect.top;
 const cx=(x1+x2)/2;

 const path=document.createElementNS("http://www.w3.org/2000/svg","path");
 path.setAttribute("d",`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);
 path.setAttribute("stroke","#22c55e");
 path.setAttribute("stroke-width","4");
 path.setAttribute("stroke-dasharray","8,6");  // ⭐ dashed line
 path.setAttribute("fill","none");

 svg.appendChild(path);
}

function showCorrectPopup(){

  popupEmoji.textContent = "🎉";
  popupTitle.textContent = "Correct!";
  popupTitle.style.color = "green";
  popupMessage.textContent = "Great job!";

  speakText("Correct!");   // 🔊 Added

  popup.classList.remove("hidden");

  setTimeout(()=>{
    popup.classList.add("hidden");
  },1200);
}
function showWrongPopup(){

  popupEmoji.textContent = "❌";
  popupTitle.textContent = "Wrong!";
  popupTitle.style.color = "red";
  popupMessage.textContent = "Try again!";

  speakText("Wrong!");   // 🔊 Added

  popup.classList.remove("hidden");

  setTimeout(()=>{
    popup.classList.add("hidden");
  },1200);
}
function showResult(){

document.getElementById("score").innerText =
"Your Score " + score + "/" + leftData.length;

popup.classList.remove("hidden");

confetti({
particleCount:200,
spread:120,
origin:{ y:0.6 }
});

}
window.addEventListener("resize",()=>svg.innerHTML="");

init();
playAgainBtn.addEventListener("click",()=>{
  location.reload();
});
