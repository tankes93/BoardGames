const GRID_SIZE = 4;
let grid = [];
let score = 0;
let bestScore = 0;
let gameOver = false;

$(document).ready(function() {
    importNavbar();
    setTheme();
    
    // Load best score from localStorage
    bestScore = parseInt(localStorage.getItem('2048-best-score')) || 0;
    $('#best-score').text(bestScore);
    
    initGame();
    
    // Unified swipe handler for touch devices
    const gameBoard = document.getElementById('game-board');
    InputHandler.onSwipe(gameBoard, {
        onSwipeLeft: function() {
            if (!gameOver) {
                const moved = moveLeft();
                if (moved) {
                    addRandomTile();
                    updateDisplay();
                    checkGameState();
                }
            }
        },
        onSwipeRight: function() {
            if (!gameOver) {
                const moved = moveRight();
                if (moved) {
                    addRandomTile();
                    updateDisplay();
                    checkGameState();
                }
            }
        },
        onSwipeUp: function() {
            if (!gameOver) {
                const moved = moveUp();
                if (moved) {
                    addRandomTile();
                    updateDisplay();
                    checkGameState();
                }
            }
        },
        onSwipeDown: function() {
            if (!gameOver) {
                const moved = moveDown();
                if (moved) {
                    addRandomTile();
                    updateDisplay();
                    checkGameState();
                }
            }
        }
    });
    
    // Keyboard controls
    $(document).keydown(function(e) {
        if (gameOver) {
            if (e.keyCode === 32) { // Space to restart
                e.preventDefault();
                restartGame();
            }
            return;
        }

        let moved = false;
        switch(e.keyCode) {
            case 37: // Left
                e.preventDefault();
                moved = moveLeft();
                break;
            case 38: // Up
                e.preventDefault();
                moved = moveUp();
                break;
            case 39: // Right
                e.preventDefault();
                moved = moveRight();
                break;
            case 40: // Down
                e.preventDefault();
                moved = moveDown();
                break;
        }

        if (moved) {
            addRandomTile();
            updateDisplay();
            checkGameState();
        }
    });
});

function initGame() {
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    score = 0;
    gameOver = false;
    
    addRandomTile();
    addRandomTile();
    
    createBoard();
    updateDisplay();
}

function createBoard() {
    const board = $('#game-board');
    board.empty();
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        board.append('<div class="grid-cell"></div>');
    }
}

function addRandomTile() {
    const emptyCells = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateDisplay() {
    // Update score
    $('#score').text(score);
    
    if (score > bestScore) {
        bestScore = score;
        $('#best-score').text(bestScore);
        localStorage.setItem('2048-best-score', bestScore);
    }
    
    // Track existing tiles
    const existingTiles = new Set();
    
    // Update or create tiles
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const value = grid[row][col];
            const tileId = `tile-${row}-${col}`;
            
            if (value !== 0) {
                existingTiles.add(tileId);
                const tileSize = 85;
                const gridSpacing = 10;
                
                let tile = $(`#${tileId}`);
                
                if (tile.length === 0) {
                    // Create new tile
                    tile = $('<div></div>')
                        .attr('id', tileId)
                        .addClass('tile')
                        .addClass(`tile-${value > 2048 ? 'super' : value}`)
                        .text(value)
                        .css({
                            position: 'absolute',
                            width: `${tileSize}px`,
                            height: `${tileSize}px`,
                            left: `${col * (tileSize + gridSpacing) + gridSpacing}px`,
                            top: `${row * (tileSize + gridSpacing) + gridSpacing}px`,
                            lineHeight: `${tileSize}px`
                        });
                    
                    $('#game-board').append(tile);
                } else {
                    // Update existing tile if value changed
                    const currentValue = parseInt(tile.text());
                    if (currentValue !== value) {
                        tile.attr('class', 'tile');
                        tile.addClass(`tile-${value > 2048 ? 'super' : value}`);
                        tile.text(value);
                    }
                    
                    // Update position
                    tile.css({
                        left: `${col * (tileSize + gridSpacing) + gridSpacing}px`,
                        top: `${row * (tileSize + gridSpacing) + gridSpacing}px`
                    });
                }
            }
        }
    }
    
    // Remove tiles that no longer exist in the grid
    $('.tile').each(function() {
        const tileId = $(this).attr('id');
        if (!existingTiles.has(tileId)) {
            $(this).remove();
        }
    });
}

function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        const newRow = slide(grid[row]);
        if (JSON.stringify(newRow) !== JSON.stringify(grid[row])) {
            moved = true;
        }
        grid[row] = newRow;
    }
    
    return moved;
}

function moveRight() {
    let moved = false;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        const reversed = grid[row].slice().reverse();
        const newRow = slide(reversed).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(grid[row])) {
            moved = true;
        }
        grid[row] = newRow;
    }
    
    return moved;
}

function moveUp() {
    let moved = false;
    
    for (let col = 0; col < GRID_SIZE; col++) {
        const column = grid.map(row => row[col]);
        const newColumn = slide(column);
        
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
            moved = true;
        }
        
        for (let row = 0; row < GRID_SIZE; row++) {
            grid[row][col] = newColumn[row];
        }
    }
    
    return moved;
}

function moveDown() {
    let moved = false;
    
    for (let col = 0; col < GRID_SIZE; col++) {
        const column = grid.map(row => row[col]);
        const reversed = column.slice().reverse();
        const newColumn = slide(reversed).reverse();
        
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
            moved = true;
        }
        
        for (let row = 0; row < GRID_SIZE; row++) {
            grid[row][col] = newColumn[row];
        }
    }
    
    return moved;
}

function slide(row) {
    // Remove zeros
    let arr = row.filter(val => val !== 0);
    
    // Merge adjacent equal values (only once per tile per move)
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr.splice(i + 1, 1); // Remove merged tile
            // Don't increment i - this prevents double merging like 2+2+4 -> 8
        }
    }
    
    // Pad with zeros
    while (arr.length < GRID_SIZE) {
        arr.push(0);
    }
    
    return arr;
}

function checkGameState() {
    // Check for 2048 tile (win condition)
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 2048) {
                showMessage('You Win! 🎉', true);
                return;
            }
        }
    }
    
    // Check if any moves are possible
    if (!canMove()) {
        gameOver = true;
        showMessage('Game Over!', false);
    }
}

function canMove() {
    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                return true;
            }
        }
    }
    
    // Check for possible merges horizontally
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE - 1; col++) {
            if (grid[row][col] === grid[row][col + 1]) {
                return true;
            }
        }
    }
    
    // Check for possible merges vertically
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE - 1; row++) {
            if (grid[row][col] === grid[row + 1][col]) {
                return true;
            }
        }
    }
    
    return false;
}

function showMessage(text, isWin) {
    $('#message-text').text(text);
    $('#game-message').addClass('active');
    
    if (!isWin) {
        gameOver = true;
    }
}

function restartGame() {
    $('#game-message').removeClass('active');
    initGame();
}

function showRules() {
    Swal.fire({
        title: '2048 Rules',
        html: `
            <div style="text-align: left;">
                <p><strong>Objective:</strong> Join the numbers and get to the 2048 tile!</p>
                <br>
                <p><strong>How to Play:</strong></p>
                <ul>
                    <li>Use arrow keys to move tiles</li>
                    <li>When two tiles with the same number touch, they merge into one</li>
                    <li>After each move, a new tile appears</li>
                    <li>The game is won when a 2048 tile is created</li>
                    <li>The game is over when no moves are possible</li>
                </ul>
                <br>
                <p><strong>Strategy Tips:</strong></p>
                <ul>
                    <li>Keep your highest tile in a corner</li>
                    <li>Build toward that corner consistently</li>
                    <li>Don't just focus on merging - plan ahead!</li>
                </ul>
            </div>
        `,
        confirmButtonText: 'Got it!',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00d4ff'
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
        $('#scroll-lock-btn').removeClass('btn-warning').addClass('btn-danger');
    } else {
        ResponsiveUtils.allowScroll();
        $('#scroll-lock-btn i').removeClass('fa-lock').addClass('fa-unlock');
        $('#lock-text').text('Lock Scroll');
        $('#scroll-lock-btn').removeClass('btn-danger').addClass('btn-warning');
    }
}
