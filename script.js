const CARD_ASSETS = [
  { id: "arbol", label: "Árbol", src: "./arbol.png" },
  { id: "barco", label: "Barco", src: "./barco.avif" },
  { id: "biblia", label: "Biblia", src: "./biblia.webp" },
  { id: "corazon", label: "Corazón", src: "./corazon.avif" },
  { id: "corona", label: "Corona", src: "./corona.avif" },
  { id: "cruz", label: "Cruz", src: "./cruz.avif" },
  { id: "familia", label: "Familia", src: "./familia.jpg" },
  { id: "fe", label: "Fe", src: "./fe.avif" },
  { id: "iglesia", label: "Iglesia", src: "./iglesia.avif" },
  { id: "lampara", label: "Lámpara", src: "./lampara.avif" },
  { id: "manos", label: "Manos", src: "./manos.avif" },
  { id: "oracion", label: "Oración", src: "./oracion.jpg" },
  { id: "paloma", label: "Paloma", src: "./paloma7.png" },
  { id: "pan", label: "Pan y copa", src: "./pan.avif" },
  { id: "pastor", label: "Pastor", src: "./pastor.jpeg" },
  { id: "pez", label: "Pez", src: "./pez.webp" },
  { id: "planeta", label: "Planeta", src: "./planeta.avif" },
  { id: "regalo", label: "Regalo", src: "./regalo.avif" },
];

const memoryGrid = document.querySelector("#memoryGrid");
const guideGrid = document.querySelector("#guideGrid");
const challengeGrid = document.querySelector("#challengeGrid");
const boardShell = document.querySelector("#boardShell");
const matchesCount = document.querySelector("#matchesCount");
const movesCount = document.querySelector("#movesCount");
const progressPercent = document.querySelector("#progressPercent");
const overlayProgress = document.querySelector("#overlayProgress");
const meterPercent = document.querySelector("#meterPercent");
const restartButton = document.querySelector("#restartButton");
const victoryRestart = document.querySelector("#victoryRestart");
const victoryBanner = document.querySelector("#victoryBanner");
const liveRegion = document.querySelector("#liveRegion");

const state = {
  deck: [],
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  moves: 0,
  matches: 0,
  pendingTimeout: null,
};

function shuffle(items) {
  const clonedItems = [...items];

  for (let index = clonedItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clonedItems[index], clonedItems[randomIndex]] = [
      clonedItems[randomIndex],
      clonedItems[index],
    ];
  }

  return clonedItems;
}

function buildDeck() {
  return shuffle(
    CARD_ASSETS.flatMap((asset) => [
      { ...asset, uid: `${asset.id}-a` },
      { ...asset, uid: `${asset.id}-b` },
    ]),
  );
}

function createCardMarkup(card) {
  return `
    <button class="card" type="button" data-symbol="${card.id}" data-label="${card.label}" aria-label="Carta oculta">
      <span class="card-inner">
        <span class="card-face card-back" aria-hidden="true"></span>
        <span class="card-face card-front">
          <img src="${card.src}" alt="${card.label}" loading="lazy" />
        </span>
      </span>
    </button>
  `;
}

function renderBoard() {
  state.deck = buildDeck();
  memoryGrid.innerHTML = state.deck.map(createCardMarkup).join("");
}

function renderGuide() {
  guideGrid.innerHTML = CARD_ASSETS.map(
    (asset) => `
      <article class="guide-item" title="${asset.label}">
        <img src="${asset.src}" alt="${asset.label}" loading="lazy" />
      </article>
    `,
  ).join("");
}

function renderChallengeGrid() {
  challengeGrid.innerHTML = CARD_ASSETS.flatMap((asset) => [
    `
      <article class="challenge-item" title="${asset.label}">
        <img src="${asset.src}" alt="${asset.label}" loading="lazy" />
      </article>
    `,
    `
      <article class="challenge-item" title="${asset.label}">
        <img src="${asset.src}" alt="${asset.label}" loading="lazy" />
      </article>
    `,
  ]).join("");
}

function updateProgressVisuals() {
  const totalPairs = CARD_ASSETS.length;
  const progress = state.matches / totalPairs;
  const progressValue = `${Math.round(progress * 100)}%`;
  const veilOpacity = 0.84 - progress * 0.48;

  matchesCount.textContent = `${state.matches} / ${totalPairs}`;
  movesCount.textContent = String(state.moves);
  progressPercent.textContent = progressValue;
  overlayProgress.textContent = `${state.matches} de ${totalPairs} parejas`;
  meterPercent.textContent = progressValue;

  boardShell.style.setProperty("--reveal", progress.toFixed(4));
  boardShell.style.setProperty("--veil-opacity", String(veilOpacity.toFixed(3)));
  document.documentElement.style.setProperty("--reveal", progress.toFixed(4));
}

function announce(message) {
  liveRegion.textContent = message;
}

function resetSelection() {
  state.firstCard = null;
  state.secondCard = null;
  state.lockBoard = false;
}

function finishGame() {
  const totalPairs = CARD_ASSETS.length;
  victoryBanner.hidden = false;
  announce(
    `Completaste el juego en ${state.moves} movimientos y revelaste las ${totalPairs} parejas.`,
  );
}

function handleMatch() {
  if (!state.firstCard || !state.secondCard) {
    return;
  }

  state.matches += 1;
  state.firstCard.classList.add("is-matched");
  state.secondCard.classList.add("is-matched");
  state.firstCard.disabled = true;
  state.secondCard.disabled = true;

  updateProgressVisuals();
  announce(`¡Pareja encontrada! Llevas ${state.matches} de ${CARD_ASSETS.length}.`);
  resetSelection();

  if (state.matches === CARD_ASSETS.length) {
    finishGame();
  }
}

function unflipCards() {
  state.firstCard.classList.add("is-wrong");
  state.secondCard.classList.add("is-wrong");

  state.pendingTimeout = window.setTimeout(() => {
    state.firstCard.classList.remove("is-flipped", "is-wrong");
    state.secondCard.classList.remove("is-flipped", "is-wrong");
    state.pendingTimeout = null;
    resetSelection();
  }, 520);
}

function compareSelectedCards() {
  if (!state.firstCard || !state.secondCard) {
    return;
  }

  state.lockBoard = true;
  state.moves += 1;
  updateProgressVisuals();

  const isMatch =
    state.firstCard.dataset.symbol === state.secondCard.dataset.symbol;

  if (isMatch) {
    state.pendingTimeout = window.setTimeout(() => {
      state.pendingTimeout = null;
      handleMatch();
    }, 320);
    return;
  }

  announce("No coinciden. Intenta recordar su posición.");
  unflipCards();
}

function handleCardClick(event) {
  const clickedCard = event.target.closest(".card");

  if (
    !clickedCard ||
    state.lockBoard ||
    clickedCard === state.firstCard ||
    clickedCard.classList.contains("is-flipped") ||
    clickedCard.classList.contains("is-matched")
  ) {
    return;
  }

  clickedCard.classList.add("is-flipped");
  clickedCard.setAttribute("aria-label", `Carta revelada: ${clickedCard.dataset.label}`);

  if (!state.firstCard) {
    state.firstCard = clickedCard;
    announce("Primera carta revelada.");
    return;
  }

  state.secondCard = clickedCard;
  compareSelectedCards();
}

function startGame() {
  if (state.pendingTimeout) {
    window.clearTimeout(state.pendingTimeout);
    state.pendingTimeout = null;
  }

  state.firstCard = null;
  state.secondCard = null;
  state.lockBoard = false;
  state.moves = 0;
  state.matches = 0;

  renderBoard();
  updateProgressVisuals();
  victoryBanner.hidden = true;
  announce("Nueva partida lista. Encuentra las parejas para revelar el fondo.");
}

memoryGrid.addEventListener("click", handleCardClick);
restartButton.addEventListener("click", startGame);
victoryRestart.addEventListener("click", startGame);

renderGuide();
renderChallengeGrid();
startGame();
