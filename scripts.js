const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let startTime;
let tempsEcouler = 0;
let intervalId;

// Variables pour le meilleur temps
const afficherMeilleurTemps = document.getElementById("meilleur-temps");
let meilleurTemps = localStorage.getItem("meilleur-temps") || null;

/**
 * Met à jour à l'écran le meilleur temps si il existe
 * Sinon il le met vide
 */
function updateMeilleurTemps() {
  if (meilleurTemps) {
    const minutes = Math.floor(meilleurTemps / 60);
    const secondes = meilleurTemps % 60;
    afficherMeilleurTemps.textContent = `Meilleur temps : ${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
  } else {
    afficherMeilleurTemps.textContent = "Meilleur temps : --:--";
  }
}

updateMeilleurTemps();

/**
 * Démarre le chronomètre
 * Le divise par 1000 pour passer de milisecondes à secondes
 * Va calculer les minutes en divisant par 60
 * Le pourcentage va aller chercher les secondes restantes après la division des minutes
 */
function startTimer() {
  startTime = Date.now();
  intervalId = setInterval(() => {
    tempsEcouler = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(tempsEcouler / 60);
    const secondes = tempsEcouler % 60;
    document.getElementById("minuteur").textContent = `Temps : ${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
  }, 1000);
}

/**
 * Fonction pour arrêter le chronomètre et vérifier le meilleur temps
 */
function stopTimer() {
  clearInterval(intervalId);

  if (!meilleurTemps || tempsEcouler < meilleurTemps) {
    meilleurTemps = tempsEcouler;
    localStorage.setItem("meilleurTemps", meilleurTemps);
    updateMeilleurTemps();
  }
}

// Modifier le jeu pour démarrer le chronomètre lors du premier clic
cards.forEach(card => card.addEventListener('click', () => {
  if (!startTime) {
    startTimer();
  }
}));

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  if (partieTerminer()) {
    stopTimer();
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

const dialog = document.getElementById("dialog");
const bouttonFermer = document.getElementById("close-dialog");
const bouttonDesactiver = document.getElementById("disable-dialog");

if (!localStorage.getItem("hideDialog")) {
  dialog.showModal(); 
}

bouttonFermer.addEventListener("click", () => {
  dialog.close();
});

bouttonDesactiver.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("hideDialog", "true");
  dialog.close();
});


function partieTerminer() {
  return document.querySelectorAll('.memory-card.flip').length === cards.length;
}

cards.forEach(card => card.addEventListener('click', flipCard));
