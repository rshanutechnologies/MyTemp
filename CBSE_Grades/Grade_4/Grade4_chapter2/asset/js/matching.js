function renderMatch(question){

answerArea.innerHTML="";
document.getElementById("question-text").textContent = "";
document.getElementById("question-img").style.display = "none";
/* ===== HIDE NAV BUTTONS ===== */
prevBtn.style.visibility = "hidden";
nextBtn.style.visibility = "hidden";

const container=document.createElement("div");
container.className="match-container";

/* SVG for lines */

const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
svg.classList.add("match-lines");

container.appendChild(svg);

/* columns */

const leftColumn=document.createElement("div");
leftColumn.className="match-left-column";

const rightColumn=document.createElement("div");
rightColumn.className="match-right-column";

let selectedLeft=null;
let correctMatches=0;


/* ================= LEFT SIDE ================= */

question.left.forEach(item=>{

const left=document.createElement("div");
left.className="match-left";
left.dataset.match=item.match;

/* image */

const img=document.createElement("img");
img.src=item.img;
img.className="match-img";

/* text */

const text=document.createElement("span");
text.textContent=item.text;

left.appendChild(img);
left.appendChild(text);

/* click */

left.onclick=()=>{

if(left.classList.contains("correct")) return;

document.querySelectorAll(".match-left")
.forEach(el=>el.classList.remove("active"));

left.classList.add("active");

selectedLeft=left;

};

leftColumn.appendChild(left);

});


/* ================= RIGHT SIDE ================= */

question.right.forEach(item=>{

const right=document.createElement("div");
right.className="match-right";
right.textContent=item.text;
right.dataset.match=item.match;

right.onclick=()=>{

if(!selectedLeft) return;
if(right.classList.contains("correct")) return;


/* ===== CORRECT MATCH ===== */

if(selectedLeft.dataset.match===right.dataset.match){

selectedLeft.classList.add("correct");
right.classList.add("correct");

drawLine(selectedLeft,right,svg);

/* speak correct */

speak("Correct answer");

/* CONFETTI */

confetti({
particleCount:120,
spread:100,
startVelocity:40,
origin:{ y:0.6 }
});

selectedLeft.classList.remove("active");
selectedLeft=null;

correctMatches++;

if(correctMatches===question.left.length){

setTimeout(()=>{
showFinalPopup(score+1,filteredQuestions.length);
},1200);

}

}

/* ===== WRONG MATCH ===== */

else{

speak("Wrong answer");

selectedLeft.classList.remove("active");
selectedLeft=null;

}

};

rightColumn.appendChild(right);

});


container.appendChild(leftColumn);
container.appendChild(rightColumn);

answerArea.appendChild(container);

}

function drawLine(left,right,svg){

const leftRect=left.getBoundingClientRect();
const rightRect=right.getBoundingClientRect();
const svgRect=svg.getBoundingClientRect();

const x1=leftRect.right-svgRect.left;
const y1=leftRect.top+leftRect.height/2-svgRect.top;

const x2=rightRect.left-svgRect.left;
const y2=rightRect.top+rightRect.height/2-svgRect.top;

const line=document.createElementNS("http://www.w3.org/2000/svg","line");

line.setAttribute("x1",x1);
line.setAttribute("y1",y1);
line.setAttribute("x2",x2);
line.setAttribute("y2",y2);

line.setAttribute("stroke","#777");
line.setAttribute("stroke-width","2");
line.setAttribute("stroke-dasharray","6,4");

svg.appendChild(line);

}