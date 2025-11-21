const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const PIECES = {
    I: { shape: [[1, 1, 1, 1]], color: '#00d4ff' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0099ff' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9900' },
    O: { shape: [[1, 1], [1, 1]], color: '#ffcc00' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff88' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#9966ff' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff3366' }
};

let canvas, ctx, nextCanvas, nextCtx;
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameLoop = null;
let isPaused = false;
let isGameOver = false;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

$(document).ready(function() {
    importNavbar();
    setTheme();
    
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('next-canvas');
    nextCtx = nextCanvas.getContext('2d');
    
    initializeBoard();
    drawBoard();
    drawNextPiece();
    
    // Keyboard controls
    $(document).keydown(function(e) {
        if (isGameOver || isPaused || !currentPiece) return;
        
        switch(e.keyCode) {
            case 37: // Left
                e.preventDefault();
                movePiece(-1, 0);
                break;
            case 39: // Right
                e.preventDefault();
                movePiece(1, 0);
                break;
            case 40: // Down
                e.preventDefault();
                movePiece(0, 1);
                break;
            case 38: // Up (rotate)
                e.preventDefault();
                rotatePiece();
                break;
            case 32: // Space (hard drop)
                e.preventDefault();
                hardDrop();
                break;
        }
    });
    
    // Touch swipe controls for mobile
    InputHandler.onSwipe(canvas, {
        onSwipeLeft: function() {
            if (!isGameOver && !isPaused && currentPiece) {
                movePiece(-1, 0);
            }
        },
        onSwipeRight: function() {
            if (!isGameOver && !isPaused && currentPiece) {
                movePiece(1, 0);
            }
        },
        onSwipeDown: function() {
            if (!isGameOver && !isPaused && currentPiece) {
                movePiece(0, 1);
            }
        },
        onSwipeUp: function() {
            if (!isGameOver && !isPaused && currentPiece) {
                rotatePiece();
            }
        }
    });
    
    // Make canvas responsive
    ResponsiveUtils.makeCanvasResponsive(canvas, {
        aspectRatio: 1/2,
        maxWidth: 300
    });
});

function initializeBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

function getRandomPiece() {
    const pieces = Object.keys(PIECES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const piece = PIECES[randomPiece];
    
    return {
        shape: piece.shape.map(row => [...row]),
        color: piece.color,
        x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
        y: 0
    };
}

function drawBoard() {
    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            
            if (board[row][col]) {
                drawBlock(col, row, board[row][col]);
            }
        }
    }
    
    // Draw current piece
    if (currentPiece) {
        drawPiece(currentPiece);
    }
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    
    // Add gradient effect
    const gradient = ctx.createLinearGradient(
        x * BLOCK_SIZE, y * BLOCK_SIZE,
        (x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    
    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(piece.x + x, piece.y + y, piece.color);
            }
        });
    });
}

function drawNextPiece() {
    nextCtx.fillStyle = '#0f0f1e';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (4 - nextPiece.shape[0].length) / 2;
        const offsetY = (4 - nextPiece.shape.length) / 2;
        
        nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    nextCtx.fillStyle = nextPiece.color;
                    nextCtx.fillRect(
                        (offsetX + x) * BLOCK_SIZE,
                        (offsetY + y) * BLOCK_SIZE,
                        BLOCK_SIZE - 2,
                        BLOCK_SIZE - 2
                    );
                }
            });
        });
    }
}

function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    
    if (checkCollision()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;
        
        if (dy > 0) {
            lockPiece();
        }
        return false;
    }
    
    drawBoard();
    return true;
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    
    const previousShape = currentPiece.shape;
    currentPiece.shape = rotated;
    
    if (checkCollision()) {
        currentPiece.shape = previousShape;
    }
    
    drawBoard();
}

function hardDrop() {
    while (movePiece(0, 1)) {}
}

function checkCollision() {
    return currentPiece.shape.some((row, y) =>
        row.some((value, x) => {
            if (!value) return false;
            
            const newX = currentPiece.x + x;
            const newY = currentPiece.y + y;
            
            return (
                newX < 0 ||
                newX >= COLS ||
                newY >= ROWS ||
                (newY >= 0 && board[newY][newX])
            );
        })
    );
}

function lockPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;
                
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        });
    });
    
    clearLines();
    spawnPiece();
}

function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        
        updateScore();
    }
}

function spawnPiece() {
    currentPiece = nextPiece || getRandomPiece();
    nextPiece = getRandomPiece();
    
    if (checkCollision()) {
        gameOver();
    }
    
    drawNextPiece();
}

function updateScore() {
    $('#score').text(score);
    $('#lines').text(lines);
    $('#level').text(level);
}

function startGame() {
    if (gameLoop) return;
    
    if (isGameOver) {
        resetGame();
    }
    
    spawnPiece();
    isPaused = false;
    isGameOver = false;
    lastTime = performance.now();
    
    $('#start-btn').prop('disabled', true);
    $('#pause-btn').prop('disabled', false);
    
    gameLoop = requestAnimationFrame(update);
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    
    if (dropCounter > dropInterval) {
        movePiece(0, 1);
        dropCounter = 0;
    }
    
    if (!isPaused && !isGameOver) {
        gameLoop = requestAnimationFrame(update);
    }
}

function pauseGame() {
    isPaused = !isPaused;
    
    if (isPaused) {
        $('#pause-btn').html('<i class="fa fa-play"></i> Resume');
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    } else {
        $('#pause-btn').html('<i class="fa fa-pause"></i> Pause');
        lastTime = performance.now();
        gameLoop = requestAnimationFrame(update);
    }
}

function resetGame() {
    cancelAnimationFrame(gameLoop);
    gameLoop = null;
    
    initializeBoard();
    currentPiece = null;
    nextPiece = null;
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    dropCounter = 0;
    isPaused = false;
    isGameOver = false;
    
    updateScore();
    drawBoard();
    drawNextPiece();
    
    $('#start-btn').prop('disabled', false);
    $('#pause-btn').prop('disabled', true).html('<i class="fa fa-pause"></i> Pause');
}

function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(gameLoop);
    gameLoop = null;
    
    $('#start-btn').prop('disabled', false);
    $('#pause-btn').prop('disabled', true);
    
    Swal.fire({
        title: 'Game Over!',
        text: `Your score: ${score}\nLines: ${lines}\nLevel: ${level}`,
        icon: 'error',
        confirmButtonText: 'Play Again',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00d4ff'
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame();
            startGame();
        }
    });
}

// Scroll lock functionality for mobile gameplay
let scrollLocked = false;

function toggleScrollLock() {
    scrollLocked = !scrollLocked;
    
    if (scrollLocked) {
        ResponsiveUtils.preventScroll();
        $('#scroll-lock-btn i').removeClass('fa-unlock').addClass('fa-lock');
        $('#lock-text').text('Unlock Scroll');
        $('#scroll-lock-btn').removeClass('btn-info').addClass('btn-warning');
    } else {
        ResponsiveUtils.allowScroll();
        $('#scroll-lock-btn i').removeClass('fa-lock').addClass('fa-unlock');
        $('#lock-text').text('Lock Scroll');
        $('#scroll-lock-btn').removeClass('btn-warning').addClass('btn-info');
    }
}
