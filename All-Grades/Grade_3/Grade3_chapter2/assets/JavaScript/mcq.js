
  const quizData = [
    {
      question: "Q1. The _________ help a plant to absorb water and minerals from the soil.",
      options: [
        { tag:"A", title:"Leaves", value:"Leaves",   img:"../assets/images/leafak.png"   },
        { tag:"B", title:"Stem", value:"Stem",       img:"../assets/images/stemak.png"   },
        { tag:"C", title:"Roots", value:"Roots",     img:"../assets/images/rootak.png"    },
        { tag:"D", title:"Flower", value:"Flower",   img:"../assets/images/flowerak.png" }
      ],
      answer:"Roots"
    },
    {
      question: "Q2. The _________ bears the leaves.",
      options: [
        { tag:"A", title:"Root", value:"Root", img:"../assets/images/rootak.png"  },
        { tag:"B", title:"Stem", value:"Stem",   img:"../assets/images/stemak.png"  },
        { tag:"C", title:"Fruit", value:"Fruit",   img:"../assets/images/Fruits.png" },
        { tag:"D", title:"Flower", value:"Flower",  img:"../assets/images/flowerak.png" }
      ],
      answer:"Stem"
    },
    {
      question: "Q3. A _________ has a broad and flat surface called lamina.",
      options: [
        { tag:"A", title:"Root", value:"Root", img:"../assets/images/rootak.png"  },
        { tag:"B", title:"Leaf", value:"Leaf",  img:"../assets/images/leafak.png" },
        { tag:"C", title:"Fruit", value:"Fruit", img:"../assets/images/Fruits.png"  },
        { tag:"D", title:"Stem", value:"Stem", img:"../assets/images/stemak.png"}
      ],
      answer:"Leaf"
    },
    {
      question: "Q4. The _________ is the most beautiful part of a plant.",
      options: [
        { tag:"A", title:"Stem", value:"Stem",  img:"../assets/images/stemak.png"},
        { tag:"B", title:"Leaf", value:"Leaf",  img:"../assets/images/leafak.png" },
        { tag:"C", title:"Fruit", value:"Fruit",img:"../assets/images/Fruits.png"  },
        { tag:"D", title:"Flower", value:"Flower", img:"../assets/images/flowerak.png" }
      ],
      answer:"Flower"
    },
    {
      question: "Q5. A _________ stores food for the baby plant.",
      options: [
        { tag:"A", title:"Leaf", value:"Leaf",  img:"../assets/images/leafak.png"},
        { tag:"B", title:"Trunk", value:"Trunk",img:"../assets/images/Trunk.png"  },
        { tag:"C", title:"Seed", value:"Seed", img:"../assets/images/Seed.png"},
        { tag:"D", title:"Tree", value:"Tree",img:"../assets/images/Treeak.png" }
      ],
      answer:"Seed"
    }
  ];

  const pillIcons = ["🌱","🌿","🍃","🌸","🌰"];

  const questionText  = document.getElementById("questionText");
  const optionsGrid   = document.getElementById("optionsGrid");
  const prevBtn       = document.getElementById("prevBtn");
  const nextBtn       = document.getElementById("nextBtn");

  const popup         = document.getElementById("popup");
  const popupText     = document.getElementById("popupText");


  let current = 0;
  let score = 0;

  const solved = new Array(quizData.length).fill(false);
  const correctSelected = new Array(quizData.length).fill(null);

  function speakShort(text){
  if(!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  msg.lang = "en-Uk";
  msg.volume = 0.25;   // 🔉 decrease volume

  window.speechSynthesis.speak(msg);
}

  function showPopup(html, final=false){
  popup.style.display = "flex";

  popupText.className = final 
    ? "popup-box final-wide" 
    : "popup-box";

  popupText.innerHTML = html;

  if(!final) setTimeout(() => popup.style.display = "none", 1000);
}

  
  

  function updateNav(){
    prevBtn.disabled = (current === 0);
    nextBtn.disabled = current < quizData.length - 1 ? !solved[current] : true;
  }

  function applyLockedState(){
    if(!solved[current]) return;

    const correctValue = correctSelected[current];
    const cards = document.querySelectorAll(".option-card");

    cards.forEach(card=>{
      if(card.dataset.value === correctValue){
        card.classList.add("correct");
      }else{
        card.classList.add("disabled");
      }
    });

    updateNav();
  }

  function loadQuestion(){
    const q = quizData[current];
    questionText.textContent = q.question;

    optionsGrid.innerHTML = "";
    q.options.forEach(opt=>{
      const card = document.createElement("div");
      card.className = "option-card";
      card.dataset.value = opt.value;

      card.innerHTML = `
       
        <div class="opt-img"><img src="${opt.img}" alt="${opt.title}"></div>
        <div class="opt-text">${opt.title}</div>
      `;

      card.addEventListener("click", ()=> handleAnswer(opt.value));
      optionsGrid.appendChild(card);
    });

  
    updateNav();
    applyLockedState();
  }

  function lockOptions(correctValue){
    document.querySelectorAll(".option-card").forEach(card=>{
      if(card.dataset.value === correctValue){
        card.classList.add("correct");
      }else{
        card.classList.add("disabled");
      }
    });
  }

  function handleAnswer(selected){
    const q = quizData[current];
    if(solved[current]) return;

    if(selected === q.answer){
      solved[current] = true;
      correctSelected[current] = selected;
      score++;

      lockOptions(selected);
      speakShort("Correct");

      showPopup(`
        <div class="popup-correct">
          <span class="check">✅ Correct</span>
          <span class="happy">😊</span>
          <div class="stars">${"⭐".repeat(current + 1)}</div>
        </div>
      `);

     

      if(current === quizData.length - 1){
        setTimeout(()=> showFinalPopup(), 1100);
      }else{
        nextBtn.disabled = false;
      }
    } else {
      speakShort("Wrong");

      showPopup(`
        <div class="popup-wrong">
          <span class="cross">❌ Wrong</span>
          <span class="sad">😢</span>
          <div class="tip">💡 You can do it!</div>
        </div>
      `);
    }
  }

  function showFinalPopup(){
    showPopup(`
      <div class="popup-final-content">
        🎉 Congratulations!
        <span class="emoji">🏆</span>
        You finished the quiz!
        <div class="final-score">Score: <b>${score} / ${quizData.length}</b></div>
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <button class="restart" onclick="location.reload()">🔄Restart</button>
      </div>
    `, true);
  }

  nextBtn.addEventListener("click", ()=>{
    if(current < quizData.length - 1){
      current++;
      loadQuestion();
    }
  });

  prevBtn.addEventListener("click", ()=>{
    if(current > 0){
      current--;
      loadQuestion();
    }
  });

  loadQuestion();
