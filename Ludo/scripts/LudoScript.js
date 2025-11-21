var game = new Game();
var mainContentVue = new Vue(); // to put data in HTML
var isAnimationOn = false;
var mobileUI = $(window).width() <= 768;

const diceImages = [
    'images/dice-six-faces-one.png',
    'images/dice-six-faces-two.png',
    'images/dice-six-faces-three.png',
    'images/dice-six-faces-four.png',
    'images/dice-six-faces-five.png',
    'images/dice-six-faces-six.png'
];

function rollDice() {
    if (isAnimationOn) return;
    
    isAnimationOn = true;
    
    const diceImg = $('.dice');
    
    // Animate dice roll
    let rollCount = 0;
    const diceRollAnim = setInterval(function () {
        const randomImage = diceImages[Math.floor(Math.random() * 6)];
        diceImg.attr('src', randomImage);
        rollCount++;
        
        if (rollCount >= 10) {
            clearInterval(diceRollAnim);
            
            // Final dice value
            const diceValue = Math.floor(Math.random() * 6) + 1;
            game.diceVal = diceValue;
            diceImg.attr('src', diceImages[diceValue - 1]);
            
            var currentPlayer = game.players[game.currPlayer];
            game.instruction = currentPlayer.color.toUpperCase() + " Played : " + game.diceVal.toString();
            currentPlayer.checkPlay();
            game.autoSaveGame();
        }
    }, 100);
}

$(document).ready(function () {
    importNavbar("Ludo", "Ludo");
    setTheme();

    mainContentVue = new Vue({
        el: "#mainContent",
        data: {
            game: game,
        },
    });

    $(".board").css({ display: "none" });
    $(".coin").css({ display: "none" });

    if (game.autoLoadGame()) mainContentVue.game = game;

    $(".boardSelector").click(function () {
        $(".boardSelected").removeClass("boardSelected");
        $(this).addClass("boardSelected");
        boardImgNmbr = parseInt(this.id.split("_")[1]);
        boardImgPath = "images/board" + boardImgNmbr + ".jpg";
        $(".board").attr("src", boardImgPath);
    });

    $(document.body).on("click", "#btnStartGame", function () {
        game.nmbrOfPlayers = parseInt($("input[name='nmbrOfPlayers']:checked").val());
        delete localStorage.boardgame_ludo;
        $(".board").css({ display: "" });
        game.setupPlayers();
        game.gameStatus = 0;
    });

    const startNewGame = function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You may lose your progress!!!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I confirm!",
        }).then(result => {
            if (result.isConfirmed) {
                delete localStorage.boardgame_ludo;
                document.location.reload(true);
            }
        });
    };

    $(document.body).on("click", "#btnGetNewGame", startNewGame);
    $(document.body).on("click", "#btnPlayAgain", startNewGame);

    $(document.body).on("click", ".coin", function () {
        if (game.gameStatus != 0) return;
        if (!game.waitCoinSelection) return;
        if (isAnimationOn) return;

        game.selectCoinById(this.id);
        if (game.selectedCoin.highlighted) game.selectedCoin.coinMoveLoop();

        return;
    });

    $(document.body).on("click", ".dice", function () {
        if (game.gameStatus != 0) return;
        if (game.waitCoinSelection) return;
        if (isAnimationOn) return;

        rollDice();

        return;
    });

    $(window).on("resize", function () {
        if (window.innerWidth <= 768) {
            if (!mobileUI) {
                mobileUI = true;
                game.ResizeUI();
            }
        } else {
            if (mobileUI) {
                mobileUI = false;
                game.ResizeUI();
            }
        }
    });
});
