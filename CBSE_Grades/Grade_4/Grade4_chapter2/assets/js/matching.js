let selected = null
let score = 0

/* ✅ ADD: total matches (kept explicit, no behavior change) */
const TOTAL_MATCHES = 5

const left = document.querySelectorAll("#left .box")
const right = document.querySelectorAll("#right .box")
const svg = document.getElementById("lines")

function speak(t) {
  speechSynthesis.cancel()
 
  const msg = new SpeechSynthesisUtterance(t)
  msg.lang = "en-UK"
  msg.volume = 0.25
  msg.rate = 1
  msg.pitch = 1
 
  speechSynthesis.speak(msg)
}

function launchConfetti(){
  confetti({
    particleCount:120,
    spread:70,
    origin:{ y:0.6 }
  })
}

/* ✅ ADD: final popup function (same as MCQ behavior) */
function showFinalPopup(){
  document.getElementById("final").style.display = "block"
  document.getElementById("score").innerText =
    "Your Score " + score + "/" + TOTAL_MATCHES

  launchConfetti()
}

left.forEach(l => {

  l.onclick = () => {

    if (l.classList.contains("matched")) return

    left.forEach(i => i.classList.remove("selected"))
    l.classList.add("selected")

    selected = l
  }

})

right.forEach(r => {

  r.onclick = () => {

    if (!selected || r.classList.contains("matched")) return

    if (r.dataset.match === selected.dataset.match) {

      launchConfetti()
      speak("Correct")

      drawLine(selected, r)

      selected.classList.add("matched")
      r.classList.add("matched")

      score++
      
      if (score === 5) {
        setTimeout(() => {
          showFinalPopup()
        }, 1000)
      }

    } else {

      // ✅ FIX: small delay so speech works properly
      setTimeout(() => {
        speak("Wrong")
      }, 100)

    }

    selected.classList.remove("selected")
    selected = null
  }

})

function drawLine(leftEl, rightEl) {

  const svg = document.getElementById("lines");

  const leftRect = leftEl.getBoundingClientRect();
  const rightRect = rightEl.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  // start point (right side of left box)
  const x1 = leftRect.right - svgRect.left;
  const y1 = leftRect.top + leftRect.height / 2 - svgRect.top;

  // end point (left side of right box)
  const x2 = rightRect.left - svgRect.left;
  const y2 = rightRect.top + rightRect.height / 2 - svgRect.top;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  const curve = Math.abs(x2 - x1) * 0.5;

  const offset = Math.random() * 6 - 3; // small variation

  const d = `
    M ${x1} ${y1 + offset}
    C ${x1 + curve} ${y1 + offset},
      ${x2 - curve} ${y2 + offset},
      ${x2} ${y2 + offset}
  `;

  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
 path.setAttribute("stroke", "#ffffff");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");

  svg.appendChild(path);
}
function playAgain(){
  location.reload()
}