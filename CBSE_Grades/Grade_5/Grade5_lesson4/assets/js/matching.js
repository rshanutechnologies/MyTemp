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

let selectedItem = null;
let selectedKey = null;
let score = 0;


/* CLICK LEFT ITEM */

items.forEach(item => {

    item.addEventListener('click', () => {

        if(item.dataset.locked) return;

        document.querySelectorAll('.item')
        .forEach(i => i.classList.remove('active'));

        item.classList.add('active');

        selectedItem = item;
        selectedKey = item.dataset.key;

    });

});


/* CLICK RIGHT TARGET */

targets.forEach(target => {

    target.addEventListener('click', () => {

        if(!selectedItem) return;
        if(target.dataset.done) return;

        const slot = target.querySelector('.slot');

        if (selectedKey === target.dataset.accept) {

            const imgSrc =
            selectedItem.querySelector("img").src;

            slot.innerHTML =
            `<img src="${imgSrc}" width="60">`;

            slot.classList.add('pair-ok');

            target.dataset.done = true;

            selectedItem.dataset.locked = true;
            selectedItem.style.opacity = 0.4;

            selectedItem.classList.remove('active');
            selectedItem = null;

            score++;
            speak("Correct");
            smallConfetti();

            if (score === targets.length) {

                document.getElementById("scoreText").textContent =
                    "score: " + score + " / " + targets.length;

                document.getElementById("stars").textContent =
                    "⭐".repeat(score);

                smallConfetti();

                setTimeout(() => {
                    scoreOverlay.style.visibility = "visible";
                }, 800);
            }

        } else {

            speak("Try again");

            selectedItem.classList.add("shake");

            setTimeout(() => {
                selectedItem.classList.remove("shake");
            }, 400);

        }

    });

});


/* RESTART */

function restart() {

    score = 0;
    selectedItem = null;

    targets.forEach(t => {
        delete t.dataset.done;
        const s = t.querySelector('.slot');
        s.textContent = "Drop here";
        s.className = "slot";
    });

    items.forEach(i => {
        delete i.dataset.locked;
        i.style.opacity = 1;
        i.classList.remove("active");
    });

    document.getElementById("stars").textContent = "";
    document.getElementById("scoreText").textContent =
        "0 / " + targets.length;

    scoreOverlay.style.visibility = "hidden";
}


/* SPEAK */

function speak(text) {
    speechSynthesis.cancel();
    speechSynthesis.speak(
        new SpeechSynthesisUtterance(text)
    );
}


/* CONFETTI */

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