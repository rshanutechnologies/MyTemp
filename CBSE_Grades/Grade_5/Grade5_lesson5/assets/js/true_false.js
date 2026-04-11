    const questions = [
  {
    q: "Q1. The upper two chambers of the heart are called the ventricles.",
    a: false,
    img: "../assets/images/heart-chambers1.png"
  },
  {
    q: "Q2. Veins carry blood from the heart to the different parts of the body.",
    a: false,
    img: "../assets/images/veins.png"
  },
  {
    q: "Q3. Blood vessels are the tubes in which blood flows throughout the body.",
    a: true,
    img: "../assets/images/blood-vessels.png"
  },
  {
    q: "Q4. The heart does not pump blood at night.",
    a: false,
    img: "../assets/images/heart.png"
  },
  {
    q: "Q5. Inhalation is taking in oxygen rich air.",
    a: true,
    img: "../assets/images/inhalation2.png"
  }
];

        let currentIndex = 0;
        let score = 0;

        const elements = {
            question: document.getElementById("question"),
            img: document.getElementById("questionImg"),
            trueBtn: document.getElementById("trueBtn"),
            falseBtn: document.getElementById("falseBtn"),
            prevBtn: document.getElementById("prevBtn"),
            nextBtn: document.getElementById("nextBtn"),
            popup: document.getElementById("answerPopup"),
            popupIcon: document.getElementById("popupIcon"),
            popupTitle: document.getElementById("popupTitle"),
            popupMsg: document.getElementById("popupMsg"),
            finalPopup: document.getElementById("finalPopup"),
            finalScore: document.getElementById("finalScore"),
            stars: document.getElementById("stars"),
        };

        function speak(t) {
            speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(t);
            msg.lang = "en-UK";
            msg.volume = 0.25;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        }

        function smallConfetti() {
    confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.7 },
        scalar: 0.8
    });
}

        function clearFeedback() {

            const answersBox = document.querySelector(".answers")

            elements.trueBtn.classList.remove("correct", "wrong", "hide")
            elements.falseBtn.classList.remove("correct", "wrong", "hide")

            answersBox.classList.remove("single")

            elements.trueBtn.disabled = false
            elements.falseBtn.disabled = false
            elements.nextBtn.disabled = true

        }

        function showFeedback(correctAnswer) {

            const answersBox = document.querySelector(".answers")

            if (correctAnswer === true) {

                elements.trueBtn.classList.add("correct")
                elements.falseBtn.classList.add("hide")

            } else {

                elements.falseBtn.classList.add("correct")
                elements.trueBtn.classList.add("hide")

            }

            answersBox.classList.add("single")

        }

       function renderQuestion() {
    const q = questions[currentIndex];
    elements.question.textContent = q.q;
    elements.img.src = q.img;
    elements.img.alt = "loading";

    // RESET IMAGE (important)
    elements.img.classList.remove("reveal");

    clearFeedback();

    elements.prevBtn.disabled = currentIndex === 0;

    if (questions[currentIndex].answeredCorrectly) {
        showFeedback(q.a);
        elements.nextBtn.disabled = false;
        elements.trueBtn.disabled = true;
        elements.falseBtn.disabled = true;

        // show original if already answered
        elements.img.classList.add("reveal");
    }
}

       function handleAnswer(selected) {
    const correct = questions[currentIndex].a;
    const isCorrect = selected === correct;

    if (isCorrect) {
        score++;
        speak("Correct");
        smallConfetti();

        questions[currentIndex].answeredCorrectly = true;

        showFeedback(correct);

        // 🔥 REVEAL IMAGE
        elements.img.classList.add("reveal");

        elements.nextBtn.disabled = false;
        elements.trueBtn.disabled = true;
        elements.falseBtn.disabled = true;

        showPopup(true);

        if (currentIndex === questions.length - 1) {
            setTimeout(showFinal, 1600);
        }
    } else {
        speak("Wrong");
        showPopup(false);
    }
}

        function showPopup(isCorrect) {
            const popup = document.getElementById("answerPopup");
            const icon = document.getElementById("popupIcon");
            const title = document.getElementById("popupTitle");
            const msg = document.getElementById("popupMsg");

            popup.className = "kid-popup " + (isCorrect ? "kid-correct" : "kid-wrong");
            popup.style.display = "flex";

            if (isCorrect) {
                icon.textContent = "🎉";
                title.textContent = "Great Job!";
                msg.textContent = "You got it right!";
            } else {
                icon.textContent = "🥲";
                title.textContent = "Oops!";
                msg.textContent = "Try again, you can do it!";
            }

            setTimeout(() => {
                popup.style.display = "none";
            }, 1400);
        }

        function showFinal() {
            const popup = document.getElementById("finalPopup");

            document.getElementById("finalScore").textContent =
                `Your Score: ${score} / ${questions.length}`;

            document.getElementById("stars").textContent = "⭐".repeat(score);

            popup.style.display = "flex";
            smallConfetti();
        }

        // Event listeners
        elements.trueBtn.onclick = () => handleAnswer(true);
        elements.falseBtn.onclick = () => handleAnswer(false);

        elements.prevBtn.onclick = () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            }
        };

        elements.nextBtn.onclick = () => {
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                renderQuestion();
            }
        };

        // Start
        renderQuestion();