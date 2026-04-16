
    const questions = [
      {
        text: "The place where two bones join is called a ____________.",
        options: ["muscle", "skin", "joint"],
        answer: "joint",
        img: "../assets/images/BONESSS.png"
      },
      {
        text: "All bones together form the ______________ system.",
        options: ["muscular", "digestive", "skeletal"],
        answer: "skeletal",
        img: "../assets/images/BONESSSALL.png"
      },
      {
        text: "We should drink a glass of ________ daily.",
        options: ["water", "milk", "coke"],
        answer: "milk",
        img: "../assets/images/DBOY.png"
      },
      {
        text: "__________ and muscles together give shape to our body.",
        options: ["Face", "Skin", "Bones"],
        answer: "Bones",
        img: "../assets/images/q2-img.png"
      },
      {
        text: "The ____________ covers our body from outside.",
        options: ["skin", "muscles", "bones"],
        answer: "skin",
        img: "../assets/images/skin1.png"
      }
    ];


    let index = 0;
    let score = 0;
    const locked = Array(questions.length).fill(false);
    const selected = Array(questions.length).fill(null);  // ✅ store which option clicked

    const qText = document.getElementById("qText");
    const qImage = document.getElementById("qImage");
    const optionsBox = document.getElementById("options");
    const scoreBox = document.getElementById("scoreBox");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // function speak(text) {
    //   window.speechSynthesis.cancel();
    //   const utterance = new SpeechSynthesisUtterance(text);
    //   utterance.lang = "en-Uk";
    //   utterance.rate = 0.9;
    //   window.speechSynthesis.speak(utterance);
    // }
    function speak(t) {
  speechSynthesis.cancel();   // optional but recommended

  const msg = new SpeechSynthesisUtterance(t);
 msg.lang = "en-UK";  
  msg.volume = 0.25; 
  msg.rate = 1;
  msg.pitch = 1;

  speechSynthesis.speak(msg);
}

    function showPopup(isCorrect) {
      const popup = document.getElementById("popup");
      const popupMedia = document.getElementById("popupMedia");
      const popupText = document.getElementById("popupText");

      popupMedia.innerHTML = "";
      popupText.className = "popup-msg";

      if (isCorrect) {
        const img = document.createElement("img");
        img.src = questions[index].img;
        popupMedia.appendChild(img);

        popupText.textContent = "Correct! ✅";
        popupText.classList.add("correct");

        speak("Correct");
      } else {
        popupMedia.innerHTML = `<div style="font-size:70px;">😢</div>`;
        popupText.textContent = "Wrong! ❌";
        popupText.classList.add("wrong");

        speak("Wrong");
      }

      popup.style.display = "flex";
      setTimeout(() => popup.style.display = "none", 1300);
    }

    function loadQuestion() {
      const q = questions[index];
      qText.textContent = q.text;
      qImage.src = q.img;
      optionsBox.innerHTML = "";

      prevBtn.disabled = index === 0;
      nextBtn.disabled = !locked[index];

      q.options.forEach((opt, optIndex) => {
        const div = document.createElement("div");
        div.className = "option";
        div.textContent = opt;

        // ✅ if already answered correctly before
        if (locked[index]) {
          div.classList.add("disabled");

          // ✅ show selected correct option in green
          if (selected[index] === optIndex) {
            div.classList.remove("disabled");
            div.classList.add("correct");
          }
        }
        else {
          // ✅ allow click only if not locked
          div.onclick = () => {
            if (opt.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
              locked[index] = true;
              selected[index] = optIndex;   // ✅ SAVE ANSWER

              score++;
              scoreBox.textContent = `Score: ${score}`;

              div.classList.add("correct");

              // ✅ disable all others
              [...optionsBox.children].forEach(o => {
                if (o !== div) o.classList.add("disabled");
              });

              showPopup(true);
              nextBtn.disabled = false;

              if (index === questions.length - 1) {
                setTimeout(showFinalPopup, 1500);
              }
            }
            else {
              div.classList.add("wrong");
              showPopup(false);
            }
          };
        }

        optionsBox.appendChild(div);
      });
    }


    prevBtn.onclick = () => { index--; loadQuestion(); };
    nextBtn.onclick = () => { index++; loadQuestion(); };

    loadQuestion();

    function showFinalPopup() {
      const finalPopup = document.getElementById("finalPopup");
      finalPopup.style.display = "flex";

      document.getElementById("finalScore").textContent =
        `Score: ${score} / ${questions.length}`;

      document.getElementById("finalStars").textContent =
        "⭐".repeat(score);

      // ✅ RESTART TROPHY ANIMATION EVERY TIME POPUP OPENS (same as fill in blanks)
      const winnerImg = document.getElementById("winnerImg");
      winnerImg.style.animation = "none";
      winnerImg.offsetHeight; // force reflow
      winnerImg.style.animation = "liftTrophy 1.1s ease-in-out infinite";

      speak(`Congratulations! Your score is ${score} out of ${questions.length}`);
    }


    function restartQuiz() {
      index = 0;
      score = 0;
      locked.fill(false);
      selected.fill(null);

      document.getElementById("finalPopup").style.display = "none";
      scoreBox.textContent = "Score: 0";

      loadQuestion();
    }




