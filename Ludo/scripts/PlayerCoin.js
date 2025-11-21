
class PlayerCoin {
    constructor(id, number, color, pos, path, loadedPlayerCoin) {
        if (loadedPlayerCoin) {
            // retrived from auto loaded game
            this.id = loadedPlayerCoin.id;
            this.number = loadedPlayerCoin.number;
            this.color = loadedPlayerCoin.color;

            this.homePos = loadedPlayerCoin.homePos;
            this.currPos = loadedPlayerCoin.currPos;

            this.started = loadedPlayerCoin.started;
            this.ended = loadedPlayerCoin.ended;

            this.highlighted = loadedPlayerCoin.highlighted;

            this.path = loadedPlayerCoin.path;

            if (this.currPos < 0) this.location = game.board[this.homePos];
            else this.location = game.board[this.path[this.currPos]];

            this.displayCoin();
            return;
        }

        this.id = id;
        this.number = number;
        this.color = color;

        this.homePos = pos;
        this.currPos = -1; // -1 - HOME -- 0 onwards index for Player.path
        this.location = game.board[pos];

        this.started = false;
        this.ended = false;

        this.highlighted = false;
        this.displayCoin();

        this.path = path;
    }

    displayCoin() {
        var startTop = this.location.dTopVal;
        var startLeft = this.location.dLeftVal;

        if (mobileUI) {
            startTop = this.location.mTopVal;
            startLeft = this.location.mLeftVal;
        }

        $("#" + this.id).css({ top: startTop, left: startLeft });
    }

    getPlayerByCoinID(coinID) {
        return game.players.find(x => x.color == coinID.split("_")[0]);
    }

    checkIfMoveable() {
        if (!this.started) {
            if (game.diceVal == 6) {
                this.addHighlight();
                return true;
            }
        } else {
            if (!this.ended) {
                if (this.currPos + game.diceVal < this.path.length) {
                    for (var i = this.currPos; i < this.currPos + game.diceVal + 1; i++) {
                        if (game.board[this.path[i]].isBlocked(this.number)) return false;
                    }

                    this.addHighlight();
                    return true;
                }
            }
        }
        return false;
    }

    addHighlight() {
        const bgColor = "#ff6347";
        $("#" + this.id).css({
            background: bgColor,
            "z-index": (this.location.mTopVal + 500).toString(),
        });

        this.highlighted = true;
    }

    remHighlight() {
        $("#" + this.id).css({
            background: "",
            "z-index": (this.location.mTopVal + 50).toString(),
        });

        this.highlighted = false;

        if (this.location.isBlocked()) {
            const bgColor = "#777";
            $("#" + this.id).css({ background: bgColor });
        }
    }

    moveCoin(targetPosition) {
        var currCoinDiv = $("#" + this.id);

        this.currPos = targetPosition;
        if (targetPosition > -1) this.location = game.board[this.path[this.currPos]];
        else this.location = game.board[this.homePos];
        if (mobileUI) {
            currCoinDiv.animate(
                {
                    "z-index": (this.location.mTopVal + 50).toString(),
                    top: this.location.mTopVal.toString() + "px",
                    left: this.location.mLeftVal.toString() + "px",
                },
                300,
            );
        } else {
            currCoinDiv.animate(
                {
                    "z-index": (this.location.dTopVal + 50).toString(),
                    top: this.location.dTopVal.toString() + "px",
                    left: this.location.dLeftVal.toString() + "px",
                },
                300,
            );
        }
        return;
    }

    coinMoveLoop() {
        if (!this.highlighted) {
            return;
        }
        game.removeAllHighlights();

        isAnimationOn = true;
        if (!this.started) {
            game.waitCoinSelection = false;
            game.autoSaveGame();
            this.moveCoin(0);
            isAnimationOn = false;
            this.started = true;
            return;
        }

        this.location.removeCoin(this.id);

        var coin = this;
        var cnt = 0;
        var coinMoveAnim = setInterval(function () {
            if (cnt == game.diceVal) {
                clearInterval(coinMoveAnim);

                if (coin.currPos == coin.path.length - 1) {
                    coin.ended = true;
                    coin.getPlayerByCoinID(coin.id).checkEnded();
                    game.removeAllHighlights();
                    game.changePlayer();
                } else {
                    coin.location.addCoin(coin.id, coin.number);
                    if (game.diceVal != 6) {
                        game.removeAllHighlights();
                        game.changePlayer();
                    }
                }

                isAnimationOn = false;
                game.waitCoinSelection = false;
                game.autoSaveGame();
                return;
            }

            cnt += 1;
            coin.moveCoin(coin.currPos + 1);
        }, 300);
    }
}
