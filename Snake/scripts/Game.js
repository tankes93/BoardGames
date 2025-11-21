class Game {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.snake = new Snake();
        this.food = null;
        this.score = 0;
        this.gameOver = false;
        this.board = this.initializeBoard();
        this.generateFood();
    }

    initializeBoard() {
        let board = [];
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                board[i][j] = new Cell(i, j);
            }
        }
        return board;
    }

    generateFood() {
        let emptyPositions = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                let isSnake = false;
                for (let segment of this.snake.getBody()) {
                    if (segment.x === i && segment.y === j) {
                        isSnake = true;
                        break;
                    }
                }
                if (!isSnake) {
                    emptyPositions.push({ x: i, y: j });
                }
            }
        }

        if (emptyPositions.length > 0) {
            let randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
            this.food = new Cell(randomPos.x, randomPos.y, "#ff3366");
        }
    }

    updateBoard() {
        // Clear board
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j].setColor("");
            }
        }

        // Add snake to board
        for (let segment of this.snake.getBody()) {
            if (segment.x >= 0 && segment.x < this.boardSize && 
                segment.y >= 0 && segment.y < this.boardSize) {
                this.board[segment.x][segment.y].setColor(segment.color);
            }
        }

        // Add food to board
        if (this.food) {
            this.board[this.food.x][this.food.y].setColor(this.food.color);
        }
    }

    update() {
        if (this.gameOver) return;

        this.snake.move();

        // Check collision
        if (this.snake.checkCollision(this.boardSize)) {
            this.gameOver = true;
            return;
        }

        // Check if food eaten
        let head = this.snake.getHead();
        if (this.food && head.isEqual(this.food)) {
            this.snake.grow();
            this.score += 10;
            this.generateFood();
        }

        this.updateBoard();
    }

    changeDirection(direction) {
        this.snake.changeDirection(direction);
    }

    getBoard() {
        return this.board;
    }

    getScore() {
        return this.score;
    }

    isGameOver() {
        return this.gameOver;
    }

    reset() {
        this.snake = new Snake();
        this.food = null;
        this.score = 0;
        this.gameOver = false;
        this.board = this.initializeBoard();
        this.generateFood();
        this.updateBoard();
    }
}
