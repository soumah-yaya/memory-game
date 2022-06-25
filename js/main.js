(function () {
  // get all cards
  const cards = document.querySelectorAll(".card");

  // declaring move variables
  const moveBox = document.querySelector(".moves");
  let movesCount = 0;

  // get all stars
  const stars = document.querySelectorAll(".fa-star");

  // matched Cards
  const matchedCard = document.getElementsByClassName("match");

  // popup window
  const popup = document.getElementById("popup");

  // popup close cross button
  const closeIcon = document.querySelector(".close");

  // play new game button
  const newGameBtn = document.getElementById("play-again");

  // restart game button
  const restartBtn = document.querySelector(".restart");

  // star rating
  const starRating = document.querySelector(".stars").innerHTML;

  //cards object
  const card = {
    initFlip: null,
    hasFlippedCard: false,
    lockBoard: false,
    firstCard: null,
    secondCard: null,
  };
  
  // control timer components
  const timer = document.querySelector(".timer");
  let second = 0;
  let minute = 0;
  let interval;
  let finalTime;

  // reset the game
  const resetBoard = () => {
    card.hasFlippedCard = false;
    card.lockBoard = false;
    card.firstCard = null;
    card.secondCard = null;
  };

  // set matched cards and remove flip state cards
  const disableCards = () => {
    let { initFlip } = card;
    card.firstCard.classList.add("match");
    card.secondCard.classList.add("match");
    card.firstCard.removeEventListener("click", initFlip);
    card.secondCard.removeEventListener("click", initFlip);
    resetBoard();
  };

  //set timeout before flipping cards when unmatched
  const unflipCards = () => {
    setTimeout(() => {
      card.firstCard.classList.remove("flip");
      card.secondCard.classList.remove("flip");

      resetBoard();
    }, 1500);
  };

  const checkForMatch = () => {
    const isMatch =
      card.firstCard.dataset.type === card.secondCard.dataset.type;
    isMatch ? disableCards() : unflipCards();
  };

  const startTimer = () => {
    interval = setInterval(function () {
      timer.innerHTML = minute + " min(s) " + second + " sec(s)";
      second++;
      if (second == 60) {
        minute++;
        second = 0;
      }
    }, 1000);
  };

  const moveCounter = () => {
    movesCount++;
    moveBox.innerHTML = movesCount;
    // start timer on first click
    if (movesCount == 1) {
      second = 0;
      minute = 0;
      startTimer();
    }
    // setting rates based on moves
    if (movesCount > 8 && movesCount < 12) {
      for (let i = 0; i < 3; i++) {
        if (i > 1) {
          stars[i].style.visibility = "collapse";
        }
      }
    } else if (movesCount > 13) {
      for (let i = 0; i < 3; i++) {
        if (i > 0) {
          stars[i].style.visibility = "collapse";
        }
      }
    }
  };

  const flipCard = (card_current) => {
    if (card.lockBoard) return;
    if (card_current == card.firstCard) return;
    if (card_current.classList.contains("flip")) return;

    if (!card.hasFlippedCard) {
      card_current.classList.add("flip");
      card.hasFlippedCard = true;
      card.firstCard = card_current;
      return;
    }
    if (card.hasFlippedCard) {
      card.secondCard = card_current;
      card.lockBoard = true;
      moveCounter();
    }
    card_current.classList.add("flip");
    checkForMatch();
  };

  const shuffle = () => {
    cards.forEach((card_current) => {
      const ramdomPos = Math.ceil(Math.random() * 12);
      card_current.style.order = ramdomPos;
    });
  };

  const closeModal = () => {
    closeIcon.addEventListener("click", () => {
      popup.style.visibility = "hidden";
    });
  };

  const congratulateWinner = (finalTime) => {
    if (matchedCard.length == 16) {
      clearInterval(interval);
      finalTime = timer.innerHTML;

      // show congratulations popup
      popup.style.visibility = "visible";

      // showing move, rating, time on popup
      document.getElementById("finalMove").innerHTML = movesCount;
      document.getElementById("starRating").innerHTML = starRating;
      document.getElementById("totalTime").innerHTML = finalTime;

      // closeicon on popup
      closeModal();
    }
  };

  const startGame = (card_current) => {
    popup.style.visibility = "hidden";
    card_current.classList.remove("flip", "match");

    movesCount = 0;
    moveBox.innerHTML = movesCount;

    for (let i = 0; i < stars.length; i++) {
      stars[i].style.color = "#FFD700"; //orange color
      stars[i].style.visibility = "visible";
    }

    resetBoard();
    shuffle();

    second = 0;
    minute = 0;
    timer.innerHTML = "0 min(s) 0 sec(s)";
    clearInterval(interval);
  };

  // add event listeners to each card
  cards.forEach((card_current) => {
    document.body.onload = startGame(card_current);
    newGameBtn.addEventListener("click", () => {
      startGame(card_current);
    });
    restartBtn.addEventListener("click", () => {
      startGame(card_current);
    });
    card_current.addEventListener("click", function initFlip() {
      flipCard(card_current);
      congratulateWinner(finalTime);
    });
  });
})();
