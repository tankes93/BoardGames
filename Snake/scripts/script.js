let app;
let game;
let gameInterval;

$(document).ready(function () {
    importNavbar('Snake', 'Snake');
    setTheme();

    game = new Game(24);
    game.updateBoard();

    app = new Vue({
        el: '#app',
        data: {
            board: game.getBoard(),
            score: game.getScore(),
            gameOver: false,
            gameStarted: false
        },
        methods: {
            getCellClass(cell) {
                if (cell.color === "#00d4ff") {
                    return "snake-cell";
                } else if (cell.color === "#ff3366") {
                    return "food-cell";
                }
                return "";
            },
            startGame() {
                if (this.gameStarted && !this.gameOver) return;
                
                if (this.gameOver) {
                    game.reset();
                    this.gameOver = false;
                }
                
                this.gameStarted = true;
                this.startGameLoop();
            },
            pauseGame() {
                if (gameInterval) {
                    clearInterval(gameInterval);
                    gameInterval = null;
                    this.gameStarted = false;
                }
            },
            resetGame() {
                if (gameInterval) {
                    clearInterval(gameInterval);
                    gameInterval = null;
                }
                game.reset();
                this.board = game.getBoard();
                this.score = game.getScore();
                this.gameOver = false;
                this.gameStarted = false;
            },
            startGameLoop() {
                if (gameInterval) {
                    clearInterval(gameInterval);
                }
                
                gameInterval = setInterval(() => {
                    game.update();
                    this.board = game.getBoard();
                    this.score = game.getScore();
                    
                    if (game.isGameOver()) {
                        this.gameOver = true;
                        this.gameStarted = false;
                        clearInterval(gameInterval);
                        gameInterval = null;
                        
                        Swal.fire({
                            title: 'Game Over!',
                            text: `Your score: ${this.score}`,
                            icon: 'error',
                            confirmButtonText: 'Play Again',
                            background: '#1a1a2e',
                            color: '#ffffff',
                            confirmButtonColor: '#00d4ff'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.resetGame();
                                this.startGame();
                            }
                        });
                    }
                }, 150);
            },
            moveUp() {
                game.changeDirection("UP");
            },
            moveDown() {
                game.changeDirection("DOWN");
            },
            moveLeft() {
                game.changeDirection("LEFT");
            },
            moveRight() {
                game.changeDirection("RIGHT");
            }
        }
    });

    // Keyboard controls
    $(document).keydown(function (e) {
        if (!app.gameStarted || app.gameOver) {
            if (e.keyCode === 32) { // Space
                e.preventDefault();
                app.startGame();
            }
            return;
        }

        switch (e.keyCode) {
            case 37: // Left
                e.preventDefault();
                game.changeDirection("LEFT");
                break;
            case 38: // Up
                e.preventDefault();
                game.changeDirection("UP");
                break;
            case 39: // Right
                e.preventDefault();
                game.changeDirection("RIGHT");
                break;
            case 40: // Down
                e.preventDefault();
                game.changeDirection("DOWN");
                break;
            case 32: // Space (pause)
                e.preventDefault();
                app.pauseGame();
                break;
        }
    });
    
    // Touch swipe controls for mobile
    const gameBoard = document.getElementById('theBoard');
    if (gameBoard) {
        InputHandler.onSwipe(gameBoard, {
            onSwipeLeft: function() {
                if (app.gameStarted && !app.gameOver) {
                    game.changeDirection("LEFT");
                }
            },
            onSwipeRight: function() {
                if (app.gameStarted && !app.gameOver) {
                    game.changeDirection("RIGHT");
                }
            },
            onSwipeUp: function() {
                if (app.gameStarted && !app.gameOver) {
                    game.changeDirection("UP");
                }
            },
            onSwipeDown: function() {
                if (app.gameStarted && !app.gameOver) {
                    game.changeDirection("DOWN");
                }
            }
        });
    }
    
    // Add scroll lock to Vue instance
    app.scrollLocked = false;
    app.toggleScrollLock = function() {
        this.scrollLocked = !this.scrollLocked;
        
        if (this.scrollLocked) {
            ResponsiveUtils.preventScroll();
        } else {
            ResponsiveUtils.allowScroll();
        }
    };
});
