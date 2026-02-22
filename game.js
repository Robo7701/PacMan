/* ============================================================*/

const screens = {
  mainMenu: document.getElementById("main-menu"),
  game: document.getElementById("game-screen"),
  gameOver: document.getElementById("gameover-screen"),
  victory: document.getElementById("victory-screen"),
  highscore: document.getElementById("highscore-screen")
};

const impressumOverlay = document.getElementById("impressum-overlay");

const startBtn = document.getElementById("start-btn");
const highscoreBtn = document.getElementById("highscore-btn");
const highscoreBackBtn = document.getElementById("highscore-back-btn");

const impressumBtn = document.getElementById("impressum-btn");
const closeImpressumBtn = document.getElementById("close-impressum-btn");

const soundBtn = document.getElementById("sound-btn");
const pauseBtn = document.getElementById("pause-btn");
const homeBtn = document.getElementById("home-btn");

const backToMenuBtn = document.getElementById("back-to-menu-btn");
const victoryBackBtn = document.getElementById("victory-back-btn");

const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const levelDisplay = document.getElementById("level-display");

const teamnameInput = document.getElementById("teamname-input");
const saveScoreBtn = document.getElementById("save-score-btn");

const highscoreList = document.getElementById("highscore-list");

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

/* ============================================================
   SPIEL-STATUS
============================================================ */

let gameRunning = false;
let gamePaused = false;

let score = 0;
let level = 1;

let highscores = JSON.parse(localStorage.getItem("highscores") || "[]");

let player1, player2, ghosts;

const tileSize = 20;

/* ============================================================
   MAP
   ===========================================================*/

let baseMap = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,1,2,1],
[1,2,1,2,2,2,1,2,1,2,2,2,2,1,1,2,2,2,1,2,1,2,2,2,1,2,1,1],
[1,2,1,2,1,2,1,2,1,2,1,1,2,2,2,2,1,2,1,2,1,2,1,2,1,2,1,1],
[1,2,2,2,1,2,2,2,1,2,1,1,1,1,1,1,1,2,1,2,2,2,1,2,2,2,2,1],
[1,1,1,2,1,1,1,2,1,2,2,2,2,1,1,2,2,2,1,2,1,1,1,2,1,1,1,1],
[0,0,1,2,2,2,1,2,1,1,1,1,2,0,0,2,1,1,1,2,1,2,2,2,1,0,0,0],
[1,1,1,2,1,1,1,2,1,2,2,2,2,0,0,2,2,2,1,2,1,1,1,2,1,1,1,1],
[1,2,2,2,1,2,2,2,1,2,1,1,1,1,1,1,1,2,1,2,2,2,1,2,2,2,2,1],
[1,2,1,2,1,2,1,2,1,2,1,1,2,2,2,2,1,2,1,2,1,2,1,2,1,2,1,1],
[1,2,1,2,2,2,1,2,1,2,2,2,2,1,2,2,2,2,1,2,1,2,2,2,1,2,1,1],
[1,2,1,1,1,1,1,2,1,1,1,2,0,0,0,2,1,1,1,2,1,1,1,1,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,1,1,1,2,1,1,1,2,0,0,0,2,1,1,1,2,1,1,1,1,1,1,2,1],
[1,2,1,2,2,2,1,2,1,2,2,2,2,1,2,2,2,2,1,2,1,2,2,2,1,2,1,1],
[1,2,1,2,1,2,1,2,1,2,1,1,2,2,2,2,1,2,1,2,1,2,1,2,1,2,1,1],
[1,2,2,2,1,2,2,2,1,2,1,1,1,1,1,1,1,2,1,2,2,2,1,2,2,2,2,1],
[1,1,1,2,1,1,1,2,1,2,2,2,2,0,0,2,2,2,1,2,1,1,1,2,1,1,1,1],
[0,0,1,2,2,2,1,2,1,1,1,1,2,0,0,2,1,1,1,2,1,2,2,2,1,0,0,0],
[1,1,1,2,1,1,1,2,1,2,2,2,2,0,0,2,2,2,1,2,1,1,1,2,1,1,1,1],
[1,2,2,2,1,2,2,2,1,2,1,1,1,1,1,1,1,2,1,2,2,2,1,2,2,2,2,1],
[1,2,1,2,1,2,1,2,1,2,1,1,2,2,2,2,1,2,1,2,1,2,1,2,1,2,1,1],
[1,2,1,2,2,2,1,2,1,2,2,2,2,1,1,2,2,2,1,2,1,2,2,2,1,2,1,1],
[1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
]
let map = JSON.parse(JSON.stringify(baseMap));

const mapRows = map.length;
const mapCols = map[0].length;

/* ============================================================
   SCREEN MANAGEMENT
============================================================ */

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function showMainMenu() {
  gameRunning = false;
  gamePaused = false;
  level = 1;
  showScreen("mainMenu");
}

function showGameOverScreen() {
  gameRunning = false;
  finalScoreEl.textContent = `Score: ${score}`;
  showScreen("gameOver");
}

function showHighscores() {
  renderHighscores();
  showScreen("highscore");
}

/* ============================================================
   KLASSE SPIELER
============================================================ */

class Player {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.alive = true;
  }

  move(dx, dy) {
    if (!this.alive) return;

    const newX = this.x + dx;
    const newY = this.y + dy;

    if (map[newY][newX] === 1) return;

    this.x = newX;
    this.y = newY;

    if (map[newY][newX] === 2) {
      map[newY][newX] = 0;
      score++;
      scoreEl.textContent = `Score: ${score}`;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x * tileSize + tileSize / 2,
      this.y * tileSize + tileSize / 2,
      tileSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

/* ============================================================
   KLASSE GEIST MIT MANHATTAN-DISTANZ FÜR VERFOLGUNG  
============================================================ */

class Ghost {
  constructor(x, y, color, speed = 10) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.tick = 0;

    this.directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    this.currentDir = this.randomDirection();
  }

  randomDirection() {
    return this.directions[Math.floor(Math.random() * this.directions.length)];
  }

  distanceTo(px, py) {
    return Math.abs(this.x - px) + Math.abs(this.y - py);
  }

  chooseTarget() {
    const d1 = this.distanceTo(player1.x, player1.y);
    const d2 = this.distanceTo(player2.x, player2.y);
    return d1 < d2 ? player1 : player2;
  }

  chooseBestDirection(target) {
    let bestDir = null;
    let bestDist = Infinity;

    for (const dir of this.directions) {
      const nx = this.x + dir.dx;
      const ny = this.y + dir.dy;

      if (map[ny][nx] === 1) continue;

      const dist = Math.abs(nx - target.x) + Math.abs(ny - target.y);

      if (dist < bestDist) {
        bestDist = dist;
        bestDir = dir;
      }
    }

    return bestDir || this.randomDirection();
  }

  update() {
    this.tick++;
    if (this.tick < this.speed) return;
    this.tick = 0;

    const target = this.chooseTarget();
    const bestDir = this.chooseBestDirection(target);

    const nextX = this.x + bestDir.dx;
    const nextY = this.y + bestDir.dy;

    if (map[nextY][nextX] !== 1) {
      this.x = nextX;
      this.y = nextY;
      this.currentDir = bestDir;
    } else {
      this.currentDir = this.randomDirection();
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x * tileSize,
      this.y * tileSize,
      tileSize,
      tileSize
    );
  }
}

/* ============================================================
   MEHR GEISTER PRO LEVEL
============================================================ */

function initGame() {
  map = JSON.parse(JSON.stringify(baseMap));

  player1 = new Player(1, 1, "yellow");
  player2 = new Player(mapCols - 2, 1, "orange");

  const cx = Math.floor(mapCols / 2);
  const cy = Math.floor(mapRows / 2);

  const ghostSpeed = Math.max(3, 14 - level * 1.5);
  const ghostCount = Math.min(5, 1 + level);

  const ghostColors = ["red", "pink", "cyan", "orange", "purple"];

  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    const offset = (i % 3) - 1;
    ghosts.push(
      new Ghost(cx + offset, cy, ghostColors[i % ghostColors.length], ghostSpeed)
    );
  }

  levelDisplay.textContent = `Level: ${level}`;

  gameRunning = true;
  gamePaused = false;
}

/* ============================================================
   STEUERUNG DER SPIELER
============================================================ */

document.addEventListener("keydown", (e) => {
  if (!gameRunning || gamePaused) return;

  switch (e.key) {
    case "ArrowUp": player1.move(0, -1); break;
    case "ArrowDown": player1.move(0, 1); break;
    case "ArrowLeft": player1.move(-1, 0); break;
    case "ArrowRight": player1.move(1, 0); break;

    case "w": case "W": player2.move(0, -1); break;
    case "s": case "S": player2.move(0, 1); break;
    case "a": case "A": player2.move(-1, 0); break;
    case "d": case "D": player2.move(1, 0); break;
  }
});

/* ============================================================
   FUNKTION UPDATE (GAME LOOP)
============================================================ */

function update() {
  if (!gameRunning || gamePaused) return;

  ghosts.forEach(g => g.update());
  checkCollisions();
  checkVictory();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();
  player1.draw();
  player2.draw();
  ghosts.forEach(g => g.draw());
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

/* ============================================================
   FUNKTION DRAWMAP
============================================================ */

function drawMap() {
  for (let y = 0; y < mapRows; y++) {
    for (let x = 0; x < mapCols; x++) {
      const tile = map[y][x];

      if (tile === 1) {         /*Hier wird 1 =  Wand festgelegt und sichtbar*/
        ctx.fillStyle = "blue";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }

      if (tile === 2) {         /*Hier wird 2 =  Punkt festgelegt und sichtbar*/
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}

/* ============================================================
   FUNKTION COLLISION & VICTORY
============================================================ */

function checkCollisions() {
  ghosts.forEach(g => {
    if (g.x === player1.x && g.y === player1.y) player1.alive = false;
    if (g.x === player2.x && g.y === player2.y) player2.alive = false;
  });

  if (!player1.alive && !player2.alive) {
    showGameOverScreen();
  }
}

function checkVictory() {
  for (let y = 0; y < mapRows; y++) {
    for (let x = 0; x < mapCols; x++) {
      if (map[y][x] === 2) return;
    }
  }

  level++;
  initGame();
}

/* ============================================================
   HIGHSCORE SYSTEM
============================================================ */

function renderHighscores() {
  highscoreList.innerHTML = "";

  if (highscores.length === 0) {
    highscoreList.innerHTML = "<p>Noch keine Highscores gespeichert.</p>";
    return;
  }

  highscores.forEach((entry, index) => {
    const div = document.createElement("div");
    div.classList.add("highscore-entry");

    div.innerHTML = `
      <span>${index + 1}.</span>
      <span>${entry.team}</span>
      <span>${entry.score} Pkt (Lvl ${entry.level})</span>
    `;

    highscoreList.appendChild(div);
  });
}


saveScoreBtn.addEventListener("click", () => {
  const name = teamnameInput.value.trim();
  if (name === "") return alert("Bitte Teamnamen eingeben!");

  highscores.push({ team: name, score, level });
  highscores.sort((a, b) => b.score - a.score);

  localStorage.setItem("highscores", JSON.stringify(highscores));

  alert("Highscore gespeichert!");
  showMainMenu();
});

/* ============================================================
   BUTTON EVENTS
============================================================ */

startBtn.addEventListener("click", () => {
  level = 1;
  score = 0;
  initGame();
  showScreen("game");
  gameLoop();
});

highscoreBtn.addEventListener("click", showHighscores);
highscoreBackBtn.addEventListener("click", showMainMenu);

impressumBtn.addEventListener("click", () => impressumOverlay.classList.remove("hidden"));
closeImpressumBtn.addEventListener("click", () => impressumOverlay.classList.add("hidden"));

soundBtn.addEventListener("click", () => {
  const muted = soundBtn.getAttribute("data-muted") === "true";
  const newMuted = !muted;
  soundBtn.setAttribute("data-muted", newMuted);
  soundBtn.textContent = newMuted ? "🔇 Sound aus" : "🔊 Sound an";
});

pauseBtn.addEventListener("click", () => {
  gamePaused = !gamePaused;
  pauseBtn.textContent = gamePaused ? "▶ Weiter" : "⏸ Pause";
});

homeBtn.addEventListener("click", showMainMenu);
backToMenuBtn.addEventListener("click", showMainMenu);
victoryBackBtn.addEventListener("click", showMainMenu);

/* ============================================================
   START
============================================================ */

showMainMenu();
