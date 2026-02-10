class PacmanGame {
    constructor() {
        // 25 x 20 Maze
        this.maze = [
            "#########################",
            "#...........###...........#",
            "#.###.#####.###.#####.###.#",
            "#o###.#####.###.#####.###o#",
            "#.###.#####.###.#####.###.#",
            "#.........................#",
            "#.###.###.#########.###.###.#",
            "#.###.###.#########.###.###.#",
            "#.......###....#....###.......#",
            "#####.###.#####.#.#####.###.#####",
            "#####.###.#####.#.#####.###.#####",
            "#.......###....#....###.......#",
            "#.###.###.#########.###.###.#",
            "#.###.###.#########.###.###.#",
            "#.........................#",
            "#.###.#####.###.#####.###.#",
            "#o###.#####.###.#####.###o#",
            "#.###.#####.###.#####.###.#",
            "#...........###...........#",
            "#########################"
        ];

        this.rows = this.maze.length;
        this.cols = this.maze[0].length;

        this.board = [];
        this.keys = {};
        this.running = false;

        this.player1 = { x: 12, y: 15, dir: "left", score: 0 };
        this.player2 = { x: 12, y: 16, dir: "right", score: 0 };

        this.ghosts = [
            { x: 11, y: 9 },
            { x: 13, y: 9 }
        ];

        this.initBoard();
        this.initControls();
    }

    initBoard() {
        const board = document.getElementById("game-board");
        board.innerHTML = "";
        board.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.board = [];

        this.maze.forEach((row, y) => {
            row.split("").forEach((c, x) => {
                const idx = y * this.cols + x;
                const cell = document.createElement("div");
                cell.className = "cell";

                if (c === "#") {
                    cell.classList.add("wall");
                    this.board[idx] = "wall";
                } else if (c === "o") {
                    const pellet = document.createElement("div");
                    pellet.className = "pellet power";
                    cell.appendChild(pellet);
                    this.board[idx] = "power";
                } else {
                    const pellet = document.createElement("div");
                    pellet.className = "pellet";
                    cell.appendChild(pellet);
                    this.board[idx] = "pellet";
                }

                board.appendChild(cell);
            });
        });

        this.createSprites();
    }

    createSprites() {
        const board = document.getElementById("game-board");

        this.p1El = document.createElement("div");
        this.p1El.className = "player player1";

        this.p2El = document.createElement("div");
        this.p2El.className = "player player2";

        this.ghostEls = this.ghosts.map((_, i) => {
            const g = document.createElement("div");
            g.className = `ghost ghost${i + 1}`;
            board.appendChild(g);
            return g;
        });

        board.appendChild(this.p1El);
        board.appendChild(this.p2El);
    }

    initControls() {
        document.addEventListener("keydown", e => this.keys[e.code] = true);
        document.addEventListener("keyup", e => this.keys[e.code] = false);

        document.getElementById("startBtn").onclick = () => this.start();
        document.getElementById("restartBtn").onclick = () => location.reload();

        const pauseBtn = document.getElementById("pauseBtn");
        pauseBtn.onclick = () => {
            this.running = !this.running;
            pauseBtn.textContent = this.running ? "Pause" : "Weiter";
        };
    }

    start() {
        document.getElementById("start-page").classList.remove("active");
        document.getElementById("game-page").classList.add("active");
        this.running = true;

        this.interval = setInterval(() => {
            if (!this.running) return;
            this.updatePlayers();
            this.moveGhosts();
            this.checkCollisions();
            this.render();
        }, 120);
    }

    updatePlayers() {
        if (this.keys["ArrowUp"]) this.player1.dir = "up";
        if (this.keys["ArrowDown"]) this.player1.dir = "down";
        if (this.keys["ArrowLeft"]) this.player1.dir = "left";
        if (this.keys["ArrowRight"]) this.player1.dir = "right";

        if (this.keys["KeyW"]) this.player2.dir = "up";
        if (this.keys["KeyS"]) this.player2.dir = "down";
        if (this.keys["KeyA"]) this.player2.dir = "left";
        if (this.keys["KeyD"]) this.player2.dir = "right";

        this.move(this.player1, this.player2);
        this.move(this.player2, this.player1);
    }

    move(player, other) {
        const dirs = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
        const [dx, dy] = dirs[player.dir];
        const nx = player.x + dx;
        const ny = player.y + dy;

        if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) return;
        const idx = ny * this.cols + nx;

        if (this.board[idx] !== "wall" &&
            !(nx === other.x && ny === other.y)) {

            player.x = nx;
            player.y = ny;

            if (this.board[idx] === "pellet" || this.board[idx] === "power") {
                this.board[idx] = "empty";
                player.score += 10;
                document.querySelectorAll(".cell")[idx].innerHTML = "";
            }
        }
    }

    moveGhosts() {
        this.ghosts.forEach(g => {
            const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
            const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
            const nx = g.x + dx;
            const ny = g.y + dy;

            if (
                nx >= 0 && ny >= 0 &&
                nx < this.cols && ny < this.rows &&
                this.board[ny * this.cols + nx] !== "wall"
            ) {
                g.x = nx;
                g.y = ny;
            }
        });
    }

    checkCollisions() {
        this.ghosts.forEach(g => {
            if (
                (g.x === this.player1.x && g.y === this.player1.y) ||
                (g.x === this.player2.x && g.y === this.player2.y)
            ) {
                clearInterval(this.interval);
                document.getElementById("gameOver").style.display = "block";
                document.getElementById("winnerText").textContent =
                    this.player1.score > this.player2.score ? "Spieler 1 gewinnt!" :
                    this.player2.score > this.player1.score ? "Spieler 2 gewinnt!" :
                    "Unentschieden!";
            }
        });
    }

    render() {
        const board = document.getElementById("game-board");
        const cellSize = board.clientWidth / this.cols;
        const size = cellSize * 0.75;
        const offset = (cellSize - size) / 2;

        [this.p1El, this.p2El, ...this.ghostEls].forEach(el => {
            el.style.width = el.style.height = size + "px";
        });

        this.p1El.style.left = this.player1.x * cellSize + offset + "px";
        this.p1El.style.top  = this.player1.y * cellSize + offset + "px";

        this.p2El.style.left = this.player2.x * cellSize + offset + "px";
        this.p2El.style.top  = this.player2.y * cellSize + offset + "px";

        this.ghosts.forEach((g, i) => {
            this.ghostEls[i].style.left = g.x * cellSize + offset + "px";
            this.ghostEls[i].style.top  = g.y * cellSize + offset + "px";
        });

        document.getElementById("score1").textContent = this.player1.score;
        document.getElementById("score2").textContent = this.player2.score;
    }
}

new PacmanGame();
