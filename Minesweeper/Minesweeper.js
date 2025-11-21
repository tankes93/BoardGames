$(document).ready(function () {
    importNavbar("Minesweeper", "Minesweeper");
    setTheme();

    let gameOver = false;
    let board = new Array(10);
    const boardSize = 10;
    let markMineMode = false;

    /**
     * Cell class representing each square on the board
     */
    class Cell {
        constructor(i, j, revealed, value, markedAsMine) {
            this.i = i;
            this.j = j;
            this.revealed = revealed;
            this.value = value;
            this.markedAsMine = markedAsMine;
        }

        setValue() {
            if (this.value == -1) return;
            let val = 0;
            for (let x = this.i - 1; x <= this.i + 1; x++) {
                for (let y = this.j - 1; y <= this.j + 1; y++) {
                    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                        if (board[x][y].value == -1) val++;
                    }
                }
            }
            this.value = val;
        }
    }

    /**
     * Initialize the game board
     */
    function initializeBoard() {
        // Create 2D array
        for (let i = 0; i < boardSize; i++) {
            board[i] = new Array(boardSize);
            for (let j = 0; j < boardSize; j++) {
                const val = Math.floor(Math.random() * boardSize) < 2 ? -1 : 0;
                board[i][j] = new Cell(i, j, false, val, false);
            }
        }

        // Set values
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                board[i][j].setValue();
            }
        }
    }

    /**
     * Get cell element from board
     */
    function getCellElement(i, j) {
        return $($($("#theBoard").children().children()[i]).children()[j]).children()[0];
    }

    /**
     * Reveal all cells (game over or win)
     */
    function revealAll() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                board[i][j].markedAsMine = false;
                board[i][j].revealed = true;
                const cell = getCellElement(i, j);

                switch (board[i][j].value) {
                    case -1:
                        cell.style.backgroundColor = "#ff1744";
                        cell.style.borderColor = "#ff1744";
                        cell.innerHTML = "<i class='fa fa-bomb'></i>";
                        break;
                    case 0:
                        cell.style.backgroundColor = "rgba(0, 212, 255, 0.1)";
                        cell.style.borderColor = "rgba(0, 212, 255, 0.3)";
                        break;
                    default:
                        cell.style.backgroundColor = "rgba(0, 212, 255, 0.2)";
                        cell.style.borderColor = "#00d4ff";
                        cell.innerHTML = board[i][j].value;
                        break;
                }
            }
        }
    }

    /**
     * Recursively reveal neighbors of empty cells
     */
    function revealNeighbours(i, j) {
        for (let x = i - 1; x <= i + 1; x++) {
            for (let y = j - 1; y <= j + 1; y++) {
                if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
                    if (!board[x][y].revealed) {
                        board[x][y].revealed = true;
                        const cell = getCellElement(x, y);

                        switch (board[x][y].value) {
                            case -1:
                                cell.style.backgroundColor = "#ff1744";
                                break;
                            case 0:
                                cell.style.backgroundColor = "rgba(0, 212, 255, 0.1)";
                                cell.style.borderColor = "rgba(0, 212, 255, 0.3)";
                                revealNeighbours(x, y);
                                board[x][y].markedAsMine = false;
                                break;
                            default:
                                cell.style.backgroundColor = "rgba(0, 212, 255, 0.2)";
                                cell.style.borderColor = "#00d4ff";
                                board[x][y].markedAsMine = false;
                                cell.innerHTML = board[x][y].value;
                                break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Check if player has won
     */
    function checkIfWon() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].value == -1) {
                    if (!board[i][j].markedAsMine) return;
                } else {
                    if (board[i][j].markedAsMine) return;
                }
            }
        }
        revealAll();
        gameOver = true;
        updateStatus("🎉 Wooaahh! You won! 🎉", "#00ff88");
        
        // Celebrate with SweetAlert2
        setTimeout(() => {
            Swal.fire({
                title: 'Victory!',
                text: 'You successfully cleared all the mines!',
                icon: 'success',
                confirmButtonText: 'Play Again',
                background: '#1a1a2e',
                color: '#ffffff',
                confirmButtonColor: '#00d4ff'
            }).then((result) => {
                if (result.isConfirmed) {
                    restartGame();
                }
            });
        }, 500);
    }

    /**
     * Update status message
     */
    function updateStatus(message, color = "#00d4ff") {
        const statusElement = $("#instruct");
        statusElement.text(message);
        statusElement.css("color", color);
    }

    /**
     * Handle cell click/tap
     */
    function handleCellInteraction(row, col, isMarkMode = false) {
        if (gameOver) return;

        const playedCell = getCellElement(row, col);

        if (board[row][col].revealed) return;

        updateStatus("So far, so good...", "#00d4ff");

        if (isMarkMode) {
            // Toggle mine marker
            if (board[row][col].markedAsMine) {
                board[row][col].markedAsMine = false;
                playedCell.style.backgroundColor = "";
                playedCell.style.borderColor = "";
                playedCell.innerHTML = "";
            } else {
                board[row][col].markedAsMine = true;
                playedCell.style.backgroundColor = "#ff1744";
                playedCell.style.borderColor = "#ff1744";
                playedCell.innerHTML = "<i class='fa fa-flag'></i>";
            }
            checkIfWon();
            return;
        }

        // Reveal cell
        board[row][col].revealed = true;

        switch (board[row][col].value) {
            case -1:
                revealAll();
                gameOver = true;
                updateStatus("💥 OOPS! You got blown up... Try again? 💥", "#ff1744");
                
                // Game over notification
                setTimeout(() => {
                    Swal.fire({
                        title: 'Game Over!',
                        text: 'You hit a mine! Better luck next time.',
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                        background: '#1a1a2e',
                        color: '#ffffff',
                        confirmButtonColor: '#00d4ff'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            restartGame();
                        }
                    });
                }, 500);
                break;
            case 0:
                playedCell.style.backgroundColor = "rgba(0, 212, 255, 0.1)";
                playedCell.style.borderColor = "rgba(0, 212, 255, 0.3)";
                revealNeighbours(row, col);
                break;
            default:
                playedCell.style.backgroundColor = "rgba(0, 212, 255, 0.2)";
                playedCell.style.borderColor = "#00d4ff";
                playedCell.innerHTML = board[row][col].value;
                break;
        }
    }

    /**
     * Restart the game
     */
    function restartGame() {
        gameOver = false;
        markMineMode = false;
        $("#markMine").prop("checked", false);
        
        // Reset all cells
        $("td button").each(function() {
            this.style.backgroundColor = "";
            this.style.borderColor = "";
            this.innerHTML = "";
        });
        
        initializeBoard();
        updateStatus("Start sweeping...", "#00d4ff");
    }

    /**
     * Set up unified input handlers for cells
     */
    function setupCellHandlers() {
        $("td").each(function() {
            const td = this;
            const row = $(td).parent().parent().children().index($(td).parent());
            const col = $(td).parent().children().index($(td));

            // Unified click/tap handler with long press support
            InputHandler.onClick(td, function(e) {
                const isMarkMode = $("#markMine").prop("checked");
                handleCellInteraction(row, col, isMarkMode);
            }, {
                onLongPress: function() {
                    if (!gameOver && !board[row][col].revealed) {
                        handleCellInteraction(row, col, true);
                        
                        // Haptic feedback
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }
                }
            });
        });
    }

    /**
     * Handle mark mine checkbox change
     */
    $("#markMine").on("change", function() {
        markMineMode = this.checked;
        if (markMineMode) {
            updateStatus("Mark your mines! (or long-press on mobile)", "#ffcc00");
        } else {
            updateStatus("Tap to reveal cells", "#00d4ff");
        }
    });

    /**
     * Handle restart button
     */
    $("#restart").on("click", restartGame);

    /**
     * Handle window resize
     */
    ResponsiveUtils.onResize(function(info) {
        // Adjust board scaling if needed on very small screens
        if (info.viewport.width < 400) {
            $("#theBoard").css("transform", "scale(0.9)");
            $("#theBoard").css("transform-origin", "center top");
        } else {
            $("#theBoard").css("transform", "");
        }
    });

    // Initialize game
    initializeBoard();
    setupCellHandlers();
    updateStatus("Start sweeping... (Long-press to mark mines on mobile)", "#00d4ff");

    // Prevent scrolling during game on mobile
    if (ResponsiveUtils.device.isMobile) {
        ResponsiveUtils.preventScroll();
    }
});
