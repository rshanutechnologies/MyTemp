   const root = document.getElementById("scaleRoot");

        function scaleGame() {
            const designW = 1366;
            const designH = 768;

            const scale = Math.min(
                window.innerWidth / designW,
                window.innerHeight / designH
            );

            root.style.transform = `scale(${scale})`;
        }


        window.addEventListener("resize", scaleGame);
        scaleGame();

        /* ================= GAME LOGIC ================= */
        const items = document.querySelectorAll('.item');
        const targets = document.querySelectorAll('.target');
        const scoreOverlay = document.getElementById("scoreOverlay");
        let draggedItem, draggedKey;
        let score = 0;

        const iconMap = {
            sheep: "🐑", insects: "🐞", leather: "🧥", yak: "🐃", seal: "🦭"
        };

        items.forEach(item => {
            item.addEventListener('dragstart', () => {
                draggedItem = item;
                draggedKey = item.dataset.key;
            });
        });

        targets.forEach(target => {
            target.addEventListener('dragover', e => e.preventDefault());
            target.addEventListener('drop', e => {
                e.preventDefault();
                if (target.dataset.done) return;

                const slot = target.querySelector('.slot');
              if (draggedKey === target.dataset.accept) {

const imgSrc = draggedItem.querySelector("img").src;

slot.innerHTML = `<img src="${imgSrc}" width="60">`;
slot.classList.add('pair-ok');
                    target.dataset.done = true;

                    draggedItem.draggable = false;
                    draggedItem.style.opacity = 0.4;

                    score++;
                    speak("Correct");
                    // show(correctPop);
                    smallConfetti();

                   if (score === targets.length) {

    document.getElementById("scoreText").textContent ="score:"+
        score + " / " + targets.length;

    document.getElementById("stars").textContent =
        "⭐".repeat(score);

    smallConfetti();
    setTimeout(() => {
        scoreOverlay.style.visibility = "visible";
    }, 800);
}
                } else {
                    speak("Try again");
                    // show(wrongPop);
                    // smallConfetti();
                }

            });
        });

  function restart() {

    score = 0;

    targets.forEach(t => {
        delete t.dataset.done;
        const s = t.querySelector('.slot');
        s.textContent = "Drop here";
        s.className = "slot";
    });

    items.forEach(i => {
        i.draggable = true;
        i.style.opacity = 1;
    });

    document.getElementById("stars").textContent = "";
    document.getElementById("scoreText").textContent = "0 / " + targets.length;

    scoreOverlay.style.visibility = "hidden";
}

        function show(p) {
            p.style.visibility = "visible";
            setTimeout(() => p.style.visibility = "hidden", 800);
        }

        function speak(text) {
            speechSynthesis.cancel();
            speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        }
        function fireConfetti(){
    confetti({
        particleCount:120,
        spread:100,
        origin:{ y:0.6 }
    });
}
function smallConfetti(){

confetti({
particleCount:40,
spread:60,
origin:{ y:0.7 }
});

}

// function fireConfetti(){

// const duration = 2000;
// const end = Date.now() + duration;

// (function frame(){
// confetti({
// particleCount:8,
// angle:60,
// spread:55,
// origin:{ x:0 }
// });

// confetti({
// particleCount:8,
// angle:120,
// spread:55,
// origin:{ x:1 }
// });

// if(Date.now() < end){
// requestAnimationFrame(frame);
// }

// })();

// }
   