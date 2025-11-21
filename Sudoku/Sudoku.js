let board = [];
let solution = [];
let difficulty = 'easy';
let selectedNumber = null;
let hintsRemaining = 3;

const difficulties = {
    easy: 40,
    medium: 50,
    hard: 60
};

$(document).ready(function() {
    importNavbar();
    setTheme();
    newGame();
});

function generateSudoku() {
    // Initialize empty board
    board = Array(9).fill().map(() => Array(9).fill(0));
    solution = Array(9).fill().map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes
    for (let box = 0; box < 9; box += 3) {
        fillBox(box, box);
    }
    
    // Solve the rest
    solveSudoku(solution);
    
    // Copy solution to board
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = solution[i][j];
        }
    }
    
    // Remove numbers based on difficulty
    removeNumbers(difficulties[difficulty]);
}

function fillBox(row, col) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(numbers);
    
    let idx = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            solution[row + i][col + j] = numbers[idx++];
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function solveSudoku(grid) {
    const empty = findEmpty(grid);
    if (!empty) return true;
    
    const [row, col] = empty;
    
    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid)) {
                return true;
            }
            
            grid[row][col] = 0;
        }
    }
    
    return false;
}

function findEmpty(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

function isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    
    return true;
}

function removeNumbers(count) {
    let removed = 0;
    while (removed < count) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }
}

function renderBoard() {
    const table = $('#sudoku-board');
    table.empty();
    
    for (let i = 0; i < 9; i++) {
        const row = $('<tr></tr>');
        for (let j = 0; j < 9; j++) {
            const cell = $('<td></td>');
            const input = $('<input type="text" maxlength="1">');
            
            if (board[i][j] !== 0) {
                input.val(board[i][j]);
                input.prop('disabled', true);
            } else {
                input.on('click', function() {
                    $('.sudoku-board td').removeClass('selected');
                    $(this).parent().addClass('selected');
                });
                
                input.on('input', function() {
                    const value = $(this).val();
                    if (value && (value < '1' || value > '9')) {
                        $(this).val('');
                    }
                });
                
                input.on('keyup', function(e) {
                    if (e.key >= '1' && e.key <= '9') {
                        placeNumber(i, j, parseInt(e.key));
                    } else if (e.key === 'Backspace' || e.key === 'Delete') {
                        placeNumber(i, j, 0);
                    }
                });
            }
            
            cell.append(input);
            row.append(cell);
        }
        table.append(row);
    }
}

function selectNumber(num) {
    selectedNumber = num;
    
    $('.number-btn').removeClass('selected');
    if (num !== 0) {
        $(`.number-btn:contains(${num})`).addClass('selected');
    } else {
        $('.erase-btn').addClass('selected');
    }
    
    const selected = $('.sudoku-board td.selected');
    if (selected.length > 0) {
        const input = selected.find('input');
        if (!input.prop('disabled')) {
            const row = selected.parent().index();
            const col = selected.index();
            placeNumber(row, col, num);
        }
    }
}

function placeNumber(row, col, num) {
    const cell = $($('.sudoku-board tr')[row]).find('td').eq(col);
    const input = cell.find('input');
    
    if (input.prop('disabled')) return;
    
    if (num === 0) {
        input.val('');
        cell.removeClass('error correct');
    } else {
        input.val(num);
        
        if (num === solution[row][col]) {
            cell.removeClass('error').addClass('correct');
            setTimeout(() => cell.removeClass('correct'), 500);
        } else {
            cell.removeClass('correct').addClass('error');
            setTimeout(() => cell.removeClass('error'), 500);
        }
    }
}

function checkSolution() {
    let correct = true;
    let filled = true;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = $($('.sudoku-board tr')[i]).find('td').eq(j);
            const input = cell.find('input');
            const value = parseInt(input.val()) || 0;
            
            if (value === 0) {
                filled = false;
            } else if (value !== solution[i][j]) {
                correct = false;
                cell.addClass('error');
                setTimeout(() => cell.removeClass('error'), 1000);
            }
        }
    }
    
    if (!filled) {
        Swal.fire({
            title: 'Incomplete!',
            text: 'Please fill all cells first',
            icon: 'warning',
            confirmButtonText: 'OK',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff'
        });
    } else if (correct) {
        Swal.fire({
            title: 'Congratulations!',
            text: 'You solved the puzzle! 🎉',
            icon: 'success',
            confirmButtonText: 'New Game',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff'
        }).then(() => {
            newGame();
        });
    } else {
        Swal.fire({
            title: 'Not Quite!',
            text: 'Some numbers are incorrect. Keep trying!',
            icon: 'error',
            confirmButtonText: 'OK',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff'
        });
    }
}

function getHint() {
    if (hintsRemaining <= 0) {
        Swal.fire({
            title: 'No Hints Left!',
            text: 'You\'ve used all your hints for this game',
            icon: 'warning',
            confirmButtonText: 'OK',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff'
        });
        return;
    }
    
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = $($('.sudoku-board tr')[i]).find('td').eq(j).find('input');
            if (!input.prop('disabled') && !input.val()) {
                emptyCells.push([i, j]);
            }
        }
    }
    
    if (emptyCells.length === 0) {
        Swal.fire({
            title: 'No Empty Cells!',
            text: 'All cells are filled',
            icon: 'info',
            confirmButtonText: 'OK',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff'
        });
        return;
    }
    
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = $($('.sudoku-board tr')[row]).find('td').eq(col);
    const input = cell.find('input');
    
    input.val(solution[row][col]);
    cell.addClass('hint');
    setTimeout(() => cell.removeClass('hint'), 1000);
    
    hintsRemaining--;
    
    Swal.fire({
        title: 'Hint Used!',
        text: `Hints remaining: ${hintsRemaining}`,
        icon: 'info',
        confirmButtonText: 'OK',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00d4ff',
        timer: 1500
    });
}

function setDifficulty(level) {
    difficulty = level;
    $('.btn-difficulty').removeClass('active');
    $(`.btn-difficulty:contains(${level.charAt(0).toUpperCase() + level.slice(1)})`).addClass('active');
    
    // Generate new board with new difficulty
    newGame();
}

function newGame() {
    hintsRemaining = 3;
    selectedNumber = null;
    $('.number-btn').removeClass('selected');
    generateSudoku();
    renderBoard();
}

function showRules() {
    Swal.fire({
        title: 'Sudoku Rules',
        html: `
            <div style="text-align: left;">
                <p><strong>Objective:</strong> Fill the 9×9 grid with digits 1-9</p>
                <br>
                <p><strong>Rules:</strong></p>
                <ul>
                    <li>Each row must contain digits 1-9 without repetition</li>
                    <li>Each column must contain digits 1-9 without repetition</li>
                    <li>Each 3×3 box must contain digits 1-9 without repetition</li>
                </ul>
                <br>
                <p><strong>How to Play:</strong></p>
                <ul>
                    <li>Click a cell to select it</li>
                    <li>Click a number button or type to fill the cell</li>
                    <li>Use hints if you're stuck (3 per game)</li>
                    <li>Click Check to verify your solution</li>
                </ul>
            </div>
        `,
        confirmButtonText: 'Got it!',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00d4ff'
    });
}
