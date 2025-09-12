let currentPlayer = "";
let gameIsOn = 0; // 0: jogo não iniciado, 1: jogo em andamento, 2: jogo finalizado
let scores = { X: 0, O: 0 };
const x = document.getElementById("player-one");
const o = document.getElementById("player-two");
const btnStart = document.querySelector("#start-game");
const btnReset = document.querySelector("#reset-game");

btnStart.addEventListener("click", (ev) => {
  ev.preventDefault();
  startGame();
});

btnReset.addEventListener("click", (ev) => {
  ev.preventDefault();
  clearTab();
  scores = { X: 0, O: 0 };
  document.getElementById("scoreboard")?.remove();
  x.value = "";
  o.value = "";
});

document.querySelectorAll(".gameboard > .cell").forEach((cell) => {
  cell.addEventListener("click", (ev) => setCell(ev, cell));
});

function startGame() {
  if (gameIsOn === 1) return;
  if (gameIsOn === 2) {
    clearTab();
    return;
  }
  if (x.value.trim() === "" || o.value.trim() === "") {
    alert(
      "Por favor, insira os nomes dos dois jogadores antes de iniciar o jogo."
    );
    return;
  }
  gameIsOn = 1;
  if (!document.getElementById("scoreboard")) {
    const scoreboard = document.createElement("div");
    scoreboard.id = "scoreboard";
    scoreboard.innerHTML = `
			<h3>Placar</h3>
			<p>${x.value}: <span id="score-x">${scores.X}</span></p>
			<p">${o.value}: <span id="score-o">${scores.O}</span></p>`;
    document.querySelector(".players").appendChild(scoreboard);
  }
  setCurrentPlayer();
  document.getElementById(
    "turn-indicator"
  ).textContent = `Vez de: ${currentPlayer.value}`;
  btnStart.textContent = "Limpar tabuleiro";
}

function setCell(ev, cell) {
  ev.preventDefault();
  if (gameIsOn !== 1) return;
  if (cell.textContent !== "") return;
  cell.textContent = currentPlayer.dataset.value;
  cell.style.color =
    currentPlayer.dataset.value === "X" ? "#03a9f4" : "#ff4081";
  let itsDone = checkWinner();
  if (!itsDone) setCurrentPlayer();
}

function setCurrentPlayer() {
  if (currentPlayer === "") {
    Math.random() < 0.5 ? (currentPlayer = x) : (currentPlayer = o);
    return;
  }
  currentPlayer = currentPlayer === x ? o : x;
  document.getElementById(
    "turn-indicator"
  ).textContent = `Vez de: ${currentPlayer.value}`;
}

function clearTab() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.style.backgroundColor = "#00000080";
  });
  gameIsOn = 0;
  document.getElementById("turn-indicator").textContent = "";
  btnStart.textContent = "Iniciar Jogo";
}

// retornar: 0 = continua / 1 = empate / 2 = vencedor
function checkWinner() {
  let itsDone = 0;
  const cells = Array.from(document.querySelectorAll(".cell")).map(
    (cell) => cell.textContent
  );
  const winConditions = [
    // Vertical
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  if (!cells.includes("")) itsDone = 1;

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      itsDone = 2;
      document.querySelectorAll(".cell").forEach((cell, index) => {
        if (condition.includes(index)) {
          if (cells[a] === "X") {
            cell.style.backgroundColor = "#00cfff";
          } else {
            cell.style.backgroundColor = "#ff007f";
          }
          cell.style.color = "#fff";
        }
      });
    }
  }

  switch (itsDone) {
    case 1:
      document.getElementById("turn-indicator").textContent = "Empate!";
      gameIsOn = 2;
      return true;
    case 2:
      document.getElementById(
        "turn-indicator"
      ).textContent = `O vencedor é: ${currentPlayer.value}!`;
      gameIsOn = 2;
      scores[currentPlayer.dataset.value]++;
      document.getElementById("score-x").textContent = scores.X;
      document.getElementById("score-o").textContent = scores.O;
      return true;
    default:
      return false;
  }
}
