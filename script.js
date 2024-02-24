const boardSize = 4;
const numMines = 3;

let board = [];
let revealedCells = 0;
let betStarted = false;
let originalBetAmount = 0;
let currentBetAmount = 0;
let accountBalance = 1000;

function initializeBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  placeMines();
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    if (board[x][y] !== "M") {
      board[x][y] = "M";
      incrementAdjacentCells(x, y);
      minesPlaced++;
    }
  }
}

function incrementAdjacentCells(x, y) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 &&
        newX < boardSize &&
        newY >= 0 &&
        newY < boardSize &&
        board[newX][newY] !== "M"
      ) {
        board[newX][newY]++;
      }
    }
  }
}

function revealCell(x, y) {
  if (!betStarted) return;
  const cell = document.getElementById(`cell-${x}-${y}`);
  if (!cell || cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");
  revealedCells++;

  if (board[x][y] === "M") {
    cell.textContent = "💣";
    accountBalance -= originalBetAmount;
    updateBalance();
    gameOver();
  } else {
    cell.textContent = board[x][y];
    currentBetAmount *= 2;
    updateCurrentBet();
    if (revealedCells === boardSize * boardSize - numMines) {
      alert("Congratulations! You win!");
      accountBalance += currentBetAmount;
      updateBalance();
      resetGame();
    }
  }
}

function gameOver() {
  alert("Game Over!");
  resetGame();
}

function resetGame() {
  board.forEach((row, x) => {
    row.forEach((_, y) => {
      const cell = document.getElementById(`cell-${x}-${y}`);
      cell.textContent = "";
      cell.classList.remove("revealed");
    });
  });
  revealedCells = 0;
  currentBetAmount = 0;
  updateCurrentBet();
  betStarted = false;
}

function startGame() {
  if (betStarted) return;
  const betInput = document.getElementById("betAmount");
  originalBetAmount = parseInt(betInput.value);
  if (originalBetAmount > accountBalance) {
    alert("You don't have enough balance!");
    return;
  }
  currentBetAmount = originalBetAmount / 4;
  updateBalance();
  betStarted = true;
  initializeBoard();
}

function withdrawBet() {
  if (!betStarted) return;
  accountBalance += currentBetAmount - originalBetAmount;
  updateBalance();
  resetGame();
}

function updateBalance() {
  document.getElementById("balance").textContent = accountBalance;
}

function updateCurrentBet() {
  document.getElementById("currentBet").textContent = currentBetAmount;
}

function createBoard() {
  const boardElement = document.getElementById("board");
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${x}-${y}`;
      cell.addEventListener("click", () => revealCell(x, y));
      boardElement.appendChild(cell);
    }
  }
}

createBoard();
