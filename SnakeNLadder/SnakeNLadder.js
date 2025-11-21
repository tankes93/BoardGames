// Snake and Ladder game with proper board coordinates
const BOARD_POSITIONS = {
    // Position coordinates as percentage of board image (left, top)
    // Positions 1-100 mapped to actual board locations
    1: [8, 91], 2: [17.5, 91], 3: [27, 91], 4: [36.5, 91], 5: [46, 91],
    6: [55.5, 91], 7: [65, 91], 8: [74.5, 91], 9: [84, 91], 10: [93.5, 91],
    11: [93.5, 82], 12: [84, 82], 13: [74.5, 82], 14: [65, 82], 15: [55.5, 82],
    16: [46, 82], 17: [36.5, 82], 18: [27, 82], 19: [17.5, 82], 20: [8, 82],
    21: [8, 73], 22: [17.5, 73], 23: [27, 73], 24: [36.5, 73], 25: [46, 73],
    26: [55.5, 73], 27: [65, 73], 28: [74.5, 73], 29: [84, 73], 30: [93.5, 73],
    31: [93.5, 64], 32: [84, 64], 33: [74.5, 64], 34: [65, 64], 35: [55.5, 64],
    36: [46, 64], 37: [36.5, 64], 38: [27, 64], 39: [17.5, 64], 40: [8, 64],
    41: [8, 55], 42: [17.5, 55], 43: [27, 55], 44: [36.5, 55], 45: [46, 55],
    46: [55.5, 55], 47: [65, 55], 48: [74.5, 55], 49: [84, 55], 50: [93.5, 55],
    51: [93.5, 46], 52: [84, 46], 53: [74.5, 46], 54: [65, 46], 55: [55.5, 46],
    56: [46, 46], 57: [36.5, 46], 58: [27, 46], 59: [17.5, 46], 60: [8, 46],
    61: [8, 37], 62: [17.5, 37], 63: [27, 37], 64: [36.5, 37], 65: [46, 37],
    66: [55.5, 37], 67: [65, 37], 68: [74.5, 37], 69: [84, 37], 70: [93.5, 37],
    71: [93.5, 28], 72: [84, 28], 73: [74.5, 28], 74: [65, 28], 75: [55.5, 28],
    76: [46, 28], 77: [36.5, 28], 78: [27, 28], 79: [17.5, 28], 80: [8, 28],
    81: [8, 19], 82: [17.5, 19], 83: [27, 19], 84: [36.5, 19], 85: [46, 19],
    86: [55.5, 19], 87: [65, 19], 88: [74.5, 19], 89: [84, 19], 90: [93.5, 19],
    91: [93.5, 10], 92: [84, 10], 93: [74.5, 10], 94: [65, 10], 95: [55.5, 10],
    96: [46, 10], 97: [36.5, 10], 98: [27, 10], 99: [17.5, 10], 100: [8, 10]
};

// Snakes - head to tail (different for each board)
const SNAKES_BY_BOARD = {
    0: { 99: 54, 70: 55, 52: 35, 49: 33, 37: 3, 17: 7 },
    1: { 98: 28, 95: 24, 92: 51, 83: 19, 73: 1, 69: 33, 64: 36, 59: 17, 48: 9, 46: 5 },
    2: { 97: 61, 93: 60, 87: 49, 64: 36, 62: 18, 57: 16, 54: 31, 51: 47, 43: 18, 40: 3, 17: 3 },
    3: { 99: 2, 89: 53, 76: 58, 66: 45, 54: 36, 43: 22, 42: 17, 38: 4 }
};

// Ladders - bottom to top (different for each board)
const LADDERS_BY_BOARD = {
    0: { 2: 23, 4: 68, 6: 45, 20: 59, 30: 96, 52: 72, 57: 96, 71: 92 },
    1: { 4: 56, 12: 50, 14: 55, 22: 58, 41: 79, 54: 88, 63: 80, 70: 90, 80: 100 },
    2: { 3: 20, 6: 14, 11: 28, 15: 34, 25: 46, 46: 63, 48: 67, 50: 69, 62: 81, 74: 92 },
    3: { 3: 16, 11: 49, 20: 59, 27: 41, 40: 76, 43: 95, 56: 79, 63: 81, 68: 91 }
};

let currentBoardIndex = 0;
let snakes = SNAKES_BY_BOARD[0];
let ladders = LADDERS_BY_BOARD[0];
let numberOfPlayers = 2;
let currentPlayer = 0;
let playerPositions = [0, 0, 0, 0]; // Support up to 4 players
let playerColors = ['red', 'blue', 'yellow', 'green'];
let playerNames = ['Red', 'Blue', 'Yellow', 'Green'];
let playerImages = ['images/red.png', 'images/blue.png', 'images/yellow.png', 'images/green.png'];
let isRolling = false;
let lastDiceValue = 0;
let gameStarted = false;

const diceImages = [
    'images/dice-six-faces-one.png',
    'images/dice-six-faces-two.png',
    'images/dice-six-faces-three.png',
    'images/dice-six-faces-four.png',
    'images/dice-six-faces-five.png',
    'images/dice-six-faces-six.png'
];

$(document).ready(function() {
    importNavbar();
    setTheme();
    
    // Show setup modal on page load
    $('#setupModal').modal('show');
    
    // Board selection click handler
    $('.board-option').click(function() {
        $('.board-option').removeClass('selected');
        $(this).addClass('selected');
        currentBoardIndex = parseInt($(this).data('board'));
    });
    
    // Select first board by default
    $('.board-option[data-board="0"]').addClass('selected');
    
    // Setup unified input handlers
    const rollBtn = document.getElementById('roll-btn');
    if (rollBtn) {
        InputHandler.onClick(rollBtn, rollDice);
    }
    
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
        InputHandler.onClick(newGameBtn, showSetup);
    }
    
    // Touch support for dice
    const diceElement = document.getElementById('dice');
    if (diceElement) {
        InputHandler.onClick(diceElement, rollDice);
    }
});

function showSetup() {
    $('#setupModal').modal('show');
}

function startGame() {
    // Get selected board
    const selectedBoard = $('.board-option.selected');
    if (selectedBoard.length > 0) {
        currentBoardIndex = parseInt(selectedBoard.data('board'));
    }
    
    // Get number of players
    numberOfPlayers = parseInt($('#setup-num-players').val());
    
    // Initialize game
    $('#board-image').attr('src', `images/board${currentBoardIndex}.jpg`);
    snakes = SNAKES_BY_BOARD[currentBoardIndex];
    ladders = LADDERS_BY_BOARD[currentBoardIndex];
    
    playerPositions = [0, 0, 0, 0];
    currentPlayer = 0;
    isRolling = false;
    lastDiceValue = 0;
    gameStarted = true;
    
    // Setup player list
    let playersList = '';
    for (let i = 0; i < numberOfPlayers; i++) {
        const colorClass = playerColors[i];
        const colorStyle = colorClass === 'red' ? '#ff3366' : 
                          colorClass === 'blue' ? '#00d4ff' : 
                          colorClass === 'yellow' ? '#ffcc00' : '#00ff88';
        
        playersList += `
            <div class="player player-${colorClass}">
                <img src="${playerImages[i]}" alt="${playerNames[i]}" style="width: 30px; height: 30px;">
                <span style="color: ${colorStyle}; font-weight: bold;">${playerNames[i]}</span>
                <span class="position" id="${colorClass}-pos" style="color: #00d4ff;">Position: 0</span>
            </div>
        `;
    }
    
    $('#players-list').html(playersList);
    $('#roll-btn').prop('disabled', false);
    
    updateBoard();
    updatePlayerInfo();
    
    $('#setupModal').modal('hide');
}

function updateBoard() {
    const container = $('#tokens-container');
    container.empty();
    
    for (let i = 0; i < numberOfPlayers; i++) {
        const position = playerPositions[i];
        if (position > 0 && position <= 100) {
            const [left, top] = BOARD_POSITIONS[position];
            
            // Offset tokens slightly if multiple on same position
            let offset = i * 8;
            
            const token = $('<div></div>')
                .addClass('token')
                .css({
                    left: `calc(${left}% + ${offset}px)`,
                    top: `calc(${top}% - 15px)`
                })
                .html(`<img src="${playerImages[i]}" alt="${playerColors[i]}">`);
            
            container.append(token);
        }
    }
}

function updatePlayerInfo() {
    for (let i = 0; i < numberOfPlayers; i++) {
        $(`#${playerColors[i]}-pos`).text(`Position: ${playerPositions[i]}`);
    }
    
    // Highlight current player
    $('.player').removeClass('active');
    $(`.player-${playerColors[currentPlayer]}`).addClass('active');
    
    const currentColor = playerColors[currentPlayer];
    const colorStyle = currentColor === 'red' ? '#ff3366' : 
                      currentColor === 'blue' ? '#00d4ff' : 
                      currentColor === 'yellow' ? '#ffcc00' : '#00ff88';
    
    $('#current-player-name')
        .text(currentColor.charAt(0).toUpperCase() + currentColor.slice(1))
        .css('color', colorStyle);
}

function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    $('#roll-btn').prop('disabled', true);
    
    const diceImg = $('#dice img');
    diceImg.parent().addClass('rolling');
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const randomImage = diceImages[Math.floor(Math.random() * 6)];
        diceImg.attr('src', randomImage);
        rollCount++;
        
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            
            // Final dice value
            const diceValue = Math.floor(Math.random() * 6) + 1;
            lastDiceValue = diceValue;
            diceImg.attr('src', diceImages[diceValue - 1]);
            diceImg.parent().removeClass('rolling');
            
            // Move player
            setTimeout(() => movePlayer(diceValue), 300);
        }
    }, 100);
}

function movePlayer(steps) {
    let currentPos = playerPositions[currentPlayer];
    let newPos = currentPos + steps;
    
    // Can't move past 100
    if (newPos > 100) {
        Swal.fire({
            title: 'Too High!',
            text: `You need exactly ${100 - currentPos} to win!`,
            icon: 'warning',
            confirmButtonText: 'OK',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff',
            timer: 2000
        }).then(() => {
            nextPlayer();
        });
        return;
    }
    
    // Animate movement
    animateMovement(currentPos, newPos);
}

function animateMovement(start, end) {
    let current = start;
    
    const moveInterval = setInterval(() => {
        if (current < end) {
            current++;
            playerPositions[currentPlayer] = current;
            updateBoard();
            updatePlayerInfo();
        } else {
            clearInterval(moveInterval);
            
            // Check for snake or ladder after movement
            setTimeout(() => checkSnakeOrLadder(current), 500);
        }
    }, 200);
}

function checkSnakeOrLadder(position) {
    let message = '';
    let newPosition = position;
    let icon = 'info';
    
    if (snakes[position]) {
        newPosition = snakes[position];
        message = `Oh no! Snake bite! Slide down from ${position} to ${newPosition}`;
        icon = 'error';
        
        playerPositions[currentPlayer] = newPosition;
        updateBoard();
        updatePlayerInfo();
        
        Swal.fire({
            title: 'Snake! 🐍',
            text: message,
            icon: icon,
            confirmButtonText: 'Continue',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#ff3366'
        }).then(() => {
            checkWin();
        });
    } else if (ladders[position]) {
        newPosition = ladders[position];
        message = `Great! Climb the ladder from ${position} to ${newPosition}`;
        icon = 'success';
        
        playerPositions[currentPlayer] = newPosition;
        updateBoard();
        updatePlayerInfo();
        
        Swal.fire({
            title: 'Ladder! 🪜',
            text: message,
            icon: icon,
            confirmButtonText: 'Continue',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00ff88'
        }).then(() => {
            checkWin();
        });
    } else {
        checkWin();
    }
}

function checkWin() {
    if (playerPositions[currentPlayer] === 100) {
        const playerName = playerColors[currentPlayer].charAt(0).toUpperCase() + playerColors[currentPlayer].slice(1);
        
        Swal.fire({
            title: `${playerName} Player Wins! 🎉`,
            text: 'Congratulations!',
            icon: 'success',
            confirmButtonText: 'New Game',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff'
        }).then(() => {
            newGame();
        });
        return;
    }
    
    // Give extra turn on rolling 6
    if (lastDiceValue === 6) {
        Swal.fire({
            title: 'Lucky 6!',
            text: 'You get another turn!',
            icon: 'success',
            confirmButtonText: 'Roll Again',
            background: '#1a1a2e',
            color: '#ffffff',
            confirmButtonColor: '#00d4ff',
            timer: 1500
        }).then(() => {
            isRolling = false;
            $('#roll-btn').prop('disabled', false);
        });
    } else {
        nextPlayer();
    }
}

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % numberOfPlayers;
    isRolling = false;
    $('#roll-btn').prop('disabled', false);
    updatePlayerInfo();
}

function newGame() {
    showSetup();
}
