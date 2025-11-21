
class Player 
{
    constructor(number,color,loadedPlayer) 
    {
        if(loadedPlayer) {          // retrived from auto loaded game
            this.number = loadedPlayer.number;
            this.color = loadedPlayer.color;
            this.path = loadedPlayer.path;
            this.coins = loadedPlayer.coins;
            for(let i=0; i<loadedPlayer.coins.length; i++) {
                const loadPlayerCoin = loadedPlayer.coins[i];
                this.coins[i] = new PlayerCoin(loadPlayerCoin.id, loadPlayerCoin.number, 
                            loadPlayerCoin.color, loadPlayerCoin.homePos, loadPlayerCoin.path, loadPlayerCoin);
            }
            this.ended = loadedPlayer.ended;
            return;
        }

        this.number = number;
        this.color = color.toLowerCase();
        this.path = this.setupPath(color);				// array of numbers - each representing cell index from game.board
        this.coins = this.setupCoins();

        this.ended = false;
    }

    setupCoins()
    {
        var coins = [];

        var diff = 0;
        
        if(this.color == "green")
            diff = 4;
        if(this.color == "blue")
            diff = 8;
        if(this.color == "yellow")
            diff = 12;

        for(var i = 0; i < 4 ; i+=1)
            coins.push(new PlayerCoin(this.color + "_" + i.toString(), this.number, this.color , i + diff , this.path));
        
        return coins;
    }

    setupPath()
    {
        var path = [];
            
        if(this.color == "red")
        {
            path = [];
            
            var i = 63;
            while(i <= 67)
            {
                path.push(i);
                i += 1;
            }
            var i = 16;
            while(i <= 61)
            {
                path.push(i);
                i += 1;
            }
                
            var i = 68;
            while(i <= 73)
            {
                path.push(i);
                i += 1;
            }

            return path;
        }

        if(this.color == "green")
        {
            path = [];

            var i = 24;
            while(i <= 67)
            {
                path.push(i);
                i += 1;
            }
                
            var i = 16;
            while(i <= 22)
            {
                path.push(i);
                i += 1;
            }

            var i = 74;
            while(i <= 79)
            {
                path.push(i); 
                i += 1;
            }

            return path;
        }

        if(this.color == "yellow")
        {
            path = [];
            
            var i = 37;
            while(i <= 67)
            {
                path.push(i);
                i += 1;
            }
                
            var i = 16;
            while(i <= 35)
            {
                path.push(i);
                i += 1;
            }

            var i = 80;
            while(i <= 85)
            {
                path.push(i); 
                i += 1;
            }

            return path;
        }

        if(this.color == "blue")
        {
            path = [];
            
            var i = 50;
            while(i <= 67)
            {
                path.push(i);
                i += 1;
            }
                
            var i = 16;
            while(i <= 48)
            {
                path.push(i);
                i += 1;
            }

            var i = 86;
            while(i <= 91)
            {
                path.push(i); 
                i += 1;
            }

            return path;
        }

    }

    checkPlay()
    { 
        var moveableCoinsCount = 0;
        var moveableCoin = null;
        for(var i = 0 ; i < this.coins.length ; i += 1)
        {
            if(this.coins[i].checkIfMoveable())
            {
                moveableCoinsCount += 1;
                moveableCoin = this.coins[i];   
            }
        }
        
        if(moveableCoinsCount > 0)
        {
            if(moveableCoinsCount == 1)
                moveableCoin.coinMoveLoop();
            else
            {
                game.waitCoinSelection = true;
                isAnimationOn = false;
            }
        }
        else
        {
            this.removeAllHighlights();
            game.changePlayer();
            isAnimationOn = false;
        }
    }

    removeAllHighlights()
    {
        for(var i = 0 ; i < this.coins.length ; i += 1)
        {
            this.coins[i].remHighlight();
        }
    }

    checkEnded()
    {
        var endCoinCount = 0;
        for(var i = 0 ; i < this.coins.length ; i += 1)
        {
            if(this.coins[i].ended)
                endCoinCount += 1;
        }

        if(endCoinCount == 4)
        {
            this.ended = true;
            game.endList.push(this.color);
            game.checkEnded();
        }   

    }
}
