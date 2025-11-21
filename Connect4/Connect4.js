const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 1;
let gameOver = false;

$(document).ready(function() {
    importNavbar();
    setTheme();
    initializeBoard();
    renderBoard();
});

function initializeBoard() {
    board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
        }
    }
    currentPlayer = 1;
    gameOver = false;
    updatePlayerIndicator();
}

function renderBoard() {
    const boardElement = $('#board');
    boardElement.empty();
    
    for (let col = 0; col < COLS; col++) {
        const column = $('<div></div>')
            .addClass('column')
            .attr('data-col', col);
        
        // Unified touch/mouse handler
        InputHandler.onClick(column[0], function() {
            if (!gameOver) {
                dropDisc(col);
            }
        }, {
            preventDefault: true
        });
        
        // Visual hover effect
        column.on('mouseenter touchstart', function() {
            if (!gameOver) {
                $(this).addClass('column-hover');
            }
        }).on('mouseleave touchend touchcancel', function() {
            $(this).removeClass('column-hover');
        });
        
        for (let row = 0; row < ROWS; row++) {
            const cell = $('<div></div>')
                .addClass('cell')
                .attr('data-row', row)
                .attr('data-col', col);
            
            if (board[row][col] === 1) {
                cell.addClass('player1');
            } else if (board[row][col] === 2) {
                cell.addClass('player2');
            }
            
            column.append(cell);
        }
        
        boardElement.append(column);
    }
}

function dropDisc(col) {
    if (gameOver) return;
    
    // Find the lowest empty row in this column
    let row = -1;
    for (let r = 0; r < ROWS; r++) {
        if (board[r][col] === 0) {
            row = r;
            break;
        }
    }
    
    // Column is full
    if (row === -1) {
        Swal.fire({
            title: 'Column Full!',
            text: 'Choose another column',
            icon: 'warning',
            confirmButtonText: 'OK',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff',
            timer: 1500
        });
        return;
    }
    
    // Place the disc
    board[row][col] = currentPlayer;
    
    // Update only the specific cell instead of re-rendering entire board
    const cell = $(`.cell[data-row="${row}"][data-col="${col}"]`);
    const playerClass = currentPlayer === 1 ? 'player1' : 'player2';
    cell.addClass(playerClass);
    cell.addClass('drop-animation');
    
    // Check for win
    setTimeout(() => {
        if (checkWin(row, col)) {
            gameOver = true;
            highlightWinningCells();
            
            const playerName = currentPlayer === 1 ? 'Player 1' : 'Player 2';
            const playerColor = currentPlayer === 1 ? '#00d4ff' : '#ff3366';
            
            setTimeout(() => {
                Swal.fire({
                    title: `${playerName} Wins!`,
                    text: 'Congratulations! 🎉',
                    icon: 'success',
                    confirmButtonText: 'New Game',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    confirmButtonColor: playerColor
                }).then(() => {
                    resetGame();
                });
            }, 500);
        } else if (isBoardFull()) {
            gameOver = true;
            Swal.fire({
                title: 'Draw!',
                text: 'The board is full',
                icon: 'info',
                confirmButtonText: 'New Game',
                background: '#1a1a2e',
                color: '#ffffff',
                confirmButtonColor: '#00d4ff'
            }).then(() => {
                resetGame();
            });
        } else {
            // Switch player
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updatePlayerIndicator();
        }
    }, 100);
}

function checkWin(row, col) {
    const player = board[row][col];
    
    // Check horizontal
    if (checkDirection(row, col, 0, 1, player) || 
        checkDirection(row, col, 0, -1, player)) {
        return true;
    }
    
    // Check vertical
    if (checkDirection(row, col, 1, 0, player) || 
        checkDirection(row, col, -1, 0, player)) {
        return true;
    }
    
    // Check diagonal (top-left to bottom-right)
    if (checkDirection(row, col, 1, 1, player) || 
        checkDirection(row, col, -1, -1, player)) {
        return true;
    }
    
    // Check diagonal (top-right to bottom-left)
    if (checkDirection(row, col, 1, -1, player) || 
        checkDirection(row, col, -1, 1, player)) {
        return true;
    }
    
    return false;
}

function checkDirection(row, col, rowDir, colDir, player) {
    let count = 1; // Count the current disc
    
    // Check in the positive direction
    let r = row + rowDir;
    let c = col + colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r += rowDir;
        c += colDir;
    }
    
    // Check in the negative direction
    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r -= rowDir;
        c -= colDir;
    }
    
    return count >= 4;
}

function highlightWinningCells() {
    // Find all winning sequences
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== 0) {
                const player = board[row][col];
                const directions = [
                    [0, 1],  // Horizontal
                    [1, 0],  // Vertical
                    [1, 1],  // Diagonal \
                    [1, -1]  // Diagonal /
                ];
                
                for (let [rowDir, colDir] of directions) {
                    let cells = [[row, col]];
                    let r = row + rowDir;
                    let c = col + colDir;
                    
                    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && 
                           board[r][c] === player && cells.length < 4) {
                        cells.push([r, c]);
                        r += rowDir;
                        c += colDir;
                    }
                    
                    if (cells.length === 4) {
                        cells.forEach(([r, c]) => {
                            $(`.cell[data-row="${r}"][data-col="${c}"]`).addClass('winning');
                        });
                    }
                }
            }
        }
    }
}

function isBoardFull() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}

function updatePlayerIndicator() {
    const indicator = $('#player-indicator');
    if (currentPlayer === 1) {
        indicator.html('<i class="fa fa-circle player1-color"></i> Player 1');
    } else {
        indicator.html('<i class="fa fa-circle player2-color"></i> Player 2');
    }
}

function resetGame() {
    initializeBoard();
    renderBoard();
}

function showRules() {
    Swal.fire({
        title: 'Connect 4 Rules',
        html: `
            <div style="text-align: left;">
                <p><strong>Objective:</strong> Be the first to connect 4 discs in a row</p>
                <br>
                <p><strong>How to Play:</strong></p>
                <ul>
                    <li>Players take turns dropping discs into columns</li>
                    <li>Discs fall to the lowest available position</li>
                    <li>Connect 4 discs horizontally, vertically, or diagonally to win</li>
                    <li>If the board fills up with no winner, it's a draw</li>
                </ul>
                <br>
                <p><i class="fa fa-circle player1-color"></i> <strong>Player 1:</strong> Cyan discs</p>
                <p><i class="fa fa-circle player2-color"></i> <strong>Player 2:</strong> Red discs</p>
            </div>
        `,
        confirmButtonText: 'Got it!',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00d4ff'
    });
}
