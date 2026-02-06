document.addEventListener("DOMContentLoaded", () => {

  const page1 = document.getElementById("page1");
  const page2 = document.getElementById("page2");
  const page3 = document.getElementById("page3");

  const gameArea = document.getElementById("game-area");
  const catcher = document.getElementById("catcher");
  const scoreText = document.getElementById("score");

  let score = 0;
  const target = 10;
  let gameInterval;

  // --- Move catcher ---
  function moveCatcher(x){
    if(x<0) x=0;
    if(x>gameArea.offsetWidth - catcher.offsetWidth) x=gameArea.offsetWidth - catcher.offsetWidth;
    catcher.style.left = `${x}px`;
  }

  // Mouse
  gameArea.addEventListener("mousemove", e=>{
    moveCatcher(e.clientX - gameArea.getBoundingClientRect().left);
  });

  // Touch
  gameArea.addEventListener("touchmove", e=>{
    e.preventDefault();
    moveCatcher(e.touches[0].clientX - gameArea.getBoundingClientRect().left);
  }, {passive:false});

  // Tilt
  if(window.DeviceOrientationEvent){
    window.addEventListener("deviceorientation", e=>{
      const gamma = e.gamma;
      const center = gameArea.offsetWidth/2;
      const maxTilt = 30;
      const x = center + (gamma/maxTilt)*(center - catcher.offsetWidth/2);
      moveCatcher(x);
    });
  }

  // Hearts effect
  function createHearts(x,y){
    for(let i=0;i<5;i++){
      const heart = document.createElement("div");
      heart.textContent="❤️";
      heart.style.position="absolute";
      heart.style.left = x+Math.random()*20-10+"px";
      heart.style.top = y+"px";
      heart.style.fontSize="20px";
      heart.style.opacity=1;
      gameArea.appendChild(heart);

      let top = y;
      let opacity=1;
      const interval = setInterval(()=>{
        top -=2;
        opacity-=0.03;
        heart.style.top=top+"px";
        heart.style.opacity=opacity;
        if(opacity<=0){ heart.remove(); clearInterval(interval);}
      },30);
    }
  }

  // Create teddy
  function createTeddy(){
    const teddy = document.createElement("div");
    teddy.classList.add("teddy");
    teddy.textContent="🧸";
    teddy.style.left = Math.random()*(gameArea.offsetWidth-40)+"px";
    teddy.style.top="-50px";
    gameArea.appendChild(teddy);

    const fall = setInterval(()=>{
      let top = parseInt(teddy.style.top);
      top +=5;
      teddy.style.top = top + "px";

      const catcherRect = catcher.getBoundingClientRect();
      const teddyRect = teddy.getBoundingClientRect();

      if(!(catcherRect.right < teddyRect.left ||
           catcherRect.left > teddyRect.right ||
           catcherRect.bottom < teddyRect.top ||
           catcherRect.top > teddyRect.bottom)){
        score++;
        scoreText.textContent=`Teddies: ${score}/${target}`;

        const splash = document.createElement("div");
        splash.textContent="🧸✨";
        splash.style.position="absolute";
        splash.style.left = teddyRect.left - gameArea.getBoundingClientRect().left+"px";
        splash.style.top = teddyRect.top - gameArea.getBoundingClientRect().top+"px";
        splash.style.fontSize="40px";
        gameArea.appendChild(splash);
        setTimeout(()=>splash.remove(),500);

        createHearts(catcherRect.left - gameArea.getBoundingClientRect().left, catcherRect.top - gameArea.getBoundingClientRect().top);

        teddy.remove();
        clearInterval(fall);

        if(score>=target){
          clearInterval(gameInterval);
          setTimeout(()=>{
            page2.style.display="none";
            page3.style.display="block";
          },500);
        }
      }

      if(top>gameArea.offsetHeight){ teddy.remove(); clearInterval(fall);}
    },30);
  }

  function startGame(){
    score=0;
    scoreText.textContent=`Teddies: ${score}/${target}`;
    document.querySelectorAll(".teddy").forEach(t=>t.remove());
    gameInterval = setInterval(()=>{
      if(score<target) createTeddy();
    },700);
  }

  // --- Next Button ---
  document.getElementById("next1").addEventListener("click", ()=>{
    page1.style.display="none";
    page2.style.display="block";
    startGame();
  });

});
