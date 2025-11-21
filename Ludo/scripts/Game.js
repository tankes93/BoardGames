
class Game 
{
	constructor(loadedGame)
	{
        if(loadedGame && loadedGame != null)
            return;
        this.gameStatus = -1; 
        
		this.nmbrOfPlayers = 2;
        this.players = [];
        this.currPlayer = 0;
        this.selectedCoin = null;

        this.board = this.setupBoard();
        
        this.diceVal = 0;
        this.waitCoinSelection = false;
        this.instruction = "";

        this.endList = [];
    }
    
    setupBoard()
    {
        var board = [];
        var i = 0;
        var mConst = 0;
        var dConst = 0;

        //#region  "Houses"

        // House RED

        board.push(new Cell(i,18,35, 37,60));
        i+=1;
        board.push(new Cell(i,18,82, 37, 140));
        i+=1;
        board.push(new Cell(i,66,35, 116, 60));
        i+=1;
        board.push(new Cell(i,66,82, 116, 140));
        i+=1;

        // House GREEN

        board.push(new Cell(i,18,249, 37,418));
        i+=1;
        board.push(new Cell(i,18,297, 37,497));
        i+=1;
        board.push(new Cell(i,66,249, 116,418));
        i+=1;
        board.push(new Cell(i,66,297, 116,497));
        i+=1;

        // House BLUE

        board.push(new Cell(i,233,35 , 395,60));
        i+=1;
        board.push(new Cell(i,233,83 , 395,140));
        i+=1;
        board.push(new Cell(i,281,35 ,  474,60));
        i+=1;
        board.push(new Cell(i,281,83 , 474,140));
        i+=1;

        // House YELLOW

        board.push(new Cell(i,233,249 , 395,418));
        i+=1;
        board.push(new Cell(i,233,297 , 395,497));
        i+=1;
        board.push(new Cell(i,281,249, 474,418));
        i+=1;
        board.push(new Cell(i,281,297, 474,497));
        i+=1;
        
        //#endregion

        //#region  "Board Outer cells"

        //---- Green Area
		
        mConst = 142;
		dConst = 239;
        board.push(new Cell(i,102,mConst , 176,dConst));
        i+=1;
        board.push(new Cell(i,77,mConst , 136,dConst));
        i+=1;
        board.push(new Cell(i,54,mConst , 96,dConst));
        i+=1;
        board.push(new Cell(i,30,mConst , 56,dConst));
        i+=1;
        board.push(new Cell(i,5,mConst , 16,dConst));
        i+=1;
		board.push(new Cell(i,-18,mConst , -23,dConst));
        i+=1;
		
        mConst = 165; 
		dConst = 279;
        board.push(new Cell(i,-18,mConst , -23,dConst));
        i+=1;

        mConst = 189;
		dConst = 319;
        board.push(new Cell(i,-18,mConst , -23,dConst));
        i+=1;
        board.push(new Cell(i,5,mConst , 16,dConst));
        i+=1;
        board.push(new Cell(i,30,mConst , 56,dConst));
        i+=1;
        board.push(new Cell(i,54,mConst , 96,dConst));
        i+=1;
        board.push(new Cell(i,77,mConst , 136,dConst));
        i+=1;
        board.push(new Cell(i,102,mConst , 176,dConst));
        i+=1;


        //---- Yellow Area
		
        mConst = 126;
		dConst = 215;
        board.push(new Cell(i,mConst,213 , dConst,358));
        i+=1;
        board.push(new Cell(i,mConst,237 , dConst,398));
        i+=1;
        board.push(new Cell(i,mConst,261 , dConst,437));
        i+=1;
        board.push(new Cell(i,mConst,285 , dConst,477));
        i+=1;
        board.push(new Cell(i,mConst,309 , dConst,516));
        i+=1;
        board.push(new Cell(i,mConst,332 , dConst,556));
        i+=1; 

		mConst = 150;
		dConst = 255;
        board.push(new Cell(i,mConst,332 , dConst,556));
        i+=1;
	   
        mConst = 173;
		dConst = 295;
        board.push(new Cell(i,mConst,332 , dConst,556));
        i+=1;
        board.push(new Cell(i,mConst,309 , dConst,516));
        i+=1;
        board.push(new Cell(i,mConst,285 , dConst,477));
        i+=1;
        board.push(new Cell(i,mConst,261 , dConst,437));
        i+=1;
        board.push(new Cell(i,mConst,237 , dConst,398));
        i+=1;        
        board.push(new Cell(i,mConst,213 , dConst,358));
        i+=1;
		
		
		//---- Blue Area
		
        mConst = 189;
		dConst = 319;
        board.push(new Cell(i,196,mConst , 333,dConst));
        i+=1;
        board.push(new Cell(i,221,mConst , 373,dConst));
        i+=1;
        board.push(new Cell(i,245,mConst , 413,dConst));
        i+=1;
        board.push(new Cell(i,270,mConst , 453,dConst));
        i+=1;
        board.push(new Cell(i,293,mConst , 493,dConst));
        i+=1;
        board.push(new Cell(i,317,mConst , 533,dConst));
        i+=1;
		
        mConst = 165; 
		dConst = 279;
        board.push(new Cell(i,317,mConst , 533,dConst));
        i+=1;
		
		mConst = 142;
		dConst = 239;
        board.push(new Cell(i,317,mConst , 533,dConst));
        i+=1;
        board.push(new Cell(i,293,mConst , 493,dConst));
        i+=1;
        board.push(new Cell(i,270,mConst , 453,dConst));
        i+=1;
        board.push(new Cell(i,245,mConst , 413,dConst));
        i+=1;
        board.push(new Cell(i,221,mConst , 373,dConst));
        i+=1;        
		board.push(new Cell(i,196,mConst , 333,dConst));
        i+=1;
		
		
		//---- Red Area
		
        mConst = 173;
		dConst = 295;
        board.push(new Cell(i,mConst,118 , dConst,200));
        i+=1;
        board.push(new Cell(i,mConst,94 , dConst,160));
        i+=1;
        board.push(new Cell(i,mConst,71 , dConst,121));
        i+=1;
        board.push(new Cell(i,mConst,45 , dConst,81));
        i+=1;
        board.push(new Cell(i,mConst,23 , dConst,41));
        i+=1;
        board.push(new Cell(i,mConst,-1 , dConst,1));
        i+=1;

        mConst = 150;
		dConst = 255;
        board.push(new Cell(i,mConst,-1 , dConst,1));
        i+=1;

		mConst = 126;
		dConst = 215;
        board.push(new Cell(i,mConst,-1 , dConst,1));
        i+=1;
        board.push(new Cell(i,mConst,23 , dConst,41));
        i+=1;
        board.push(new Cell(i,mConst,45 , dConst,81));
        i+=1;
        board.push(new Cell(i,mConst,71 , dConst,121));
        i+=1;
        board.push(new Cell(i,mConst,94 , dConst,160));
        i+=1;
        board.push(new Cell(i,mConst,118 , dConst,200));
        i+=1;
		
        
        //#endregion

        //#region  "END Cells"
        
		//---- Red Ends
		
		mConst = 150;
		dConst = 255;
        board.push(new Cell(i,mConst,23 , dConst,40));
        i+=1;
        board.push(new Cell(i,mConst,45 , dConst,80));
        i+=1;
        board.push(new Cell(i,mConst,71 , dConst,120));
        i+=1;
        board.push(new Cell(i,mConst,94 , dConst,160));
        i+=1;
        board.push(new Cell(i,mConst,118 , dConst,200));
        i+=1;
        board.push(new Cell(i,mConst,145 , dConst,243));       // Red End
        i+=1;
		
	
		//---- Green Ends
		
        mConst = 165; 
		dConst = 279;
        board.push(new Cell(i,5,mConst , 15,dConst));
        i+=1;
        board.push(new Cell(i,30,mConst , 55,dConst));
        i+=1;
        board.push(new Cell(i,54,mConst , 95,dConst));
        i+=1;
        board.push(new Cell(i,77,mConst , 135,dConst));
        i+=1;
        board.push(new Cell(i,102,mConst , 175,dConst));
        i+=1;
        board.push(new Cell(i,126,mConst , 220,dConst));       // Green End
        i+=1;
		
		
		//---- Yellow Ends
		
        mConst = 150;
		dConst = 255;
        board.push(new Cell(i,mConst,309 , dConst,518));
        i+=1;
        board.push(new Cell(i,mConst,285 , dConst,478));
        i+=1;
        board.push(new Cell(i,mConst,261 , dConst,438));
        i+=1;
        board.push(new Cell(i,mConst,237 , dConst,398));
        i+=1;
        board.push(new Cell(i,mConst,213 , dConst,358));
        i+=1;
        board.push(new Cell(i,mConst,187 , dConst,315));        // Yellow End
        i+=1;
		
		
		//---- Blue Ends
		
        mConst = 165;
		dConst = 279;
        board.push(new Cell(i,293,mConst , 495,dConst));
        i+=1;
        board.push(new Cell(i,270,mConst , 455,dConst));
        i+=1;
        board.push(new Cell(i,245,mConst , 415,dConst));
        i+=1;
        board.push(new Cell(i,221,mConst , 375,dConst));
        i+=1;
        board.push(new Cell(i,196,mConst , 335,dConst));
        i+=1;
        board.push(new Cell(i,170,mConst , 290,dConst));        // Blue End
        i+=1;
		

        //#endregion

        board[20].isSafe = true;
        board[24].isSafe = true;
        board[33].isSafe = true;
        board[37].isSafe = true;
        board[46].isSafe = true;
        board[50].isSafe = true;
        board[59].isSafe = true;
        board[63].isSafe = true;

        for(var i = 68; i < board.length ; i += 1)
            board[i].isSafe = true;

        return board;
    }

    setupPlayers()
    {
        this.nmbrOfPlayers = parseInt($("input[name='nmbrOfPlayers']:checked").val());
        
        var i = 0;
        var color = "red";
        while(i < this.nmbrOfPlayers)
        {
            if(i == 0)
                color = "red";
            if(i == 1)
                color = "green";
            if(i == 2)
                color = "blue";
            if(i == 3)
                color = "yellow";
            this.players.push(new Player(i,color));
            i+=1;
        }

        if(this.nmbrOfPlayers < 4)
        {
            $("#yellow_0").remove();
            $("#yellow_1").remove();
            $("#yellow_2").remove();
            $("#yellow_3").remove();

            if(this.nmbrOfPlayers < 3)
            {
                $("#blue_0").remove();
                $("#blue_1").remove();
                $("#blue_2").remove();
                $("#blue_3").remove();
            }
        }

        this.instruction = this.players[this.currPlayer].color.toUpperCase()  + " play";

        $('.coin').css({"display":"" });

    }
      
    changePlayer()
    {  
        this.currPlayer+=1;
        if(this.currPlayer == this.nmbrOfPlayers)
            this.currPlayer=0;
        if(this.players[this.currPlayer].ended)   
            this.changePlayer();
        this.instruction = this.players[this.currPlayer].color.toUpperCase() + " Play";
        isAnimationOn = false;
        return;
    }

    selectCoinById(coinID)
    {
        var selectedPlayer = game.players.find(x => x.color == coinID.split('_')[0]);
        this.selectedCoin = selectedPlayer.coins.find(x => x.id == coinID);
        return this.selectedCoin;
    }

    ResizeUI()
    {

        for(var i = 0 ; i < this.players.length ; i +=1)
        { 
            for(var j = 0 ; j < 4 ; j +=1)
            {
                this.players[i].coins[j].displayCoin();
            }
        }
        
        return;
    }
    
    
    removeAllHighlights()
    {
        for(var i = 0 ; i < this.players.length ; i += 1)
        {
            this.players[i].removeAllHighlights();
        }
    }

    checkEnded()
    { 

        if(this.endList.length == this.nmbrOfPlayers-1)
        {
            this.players.forEach(player => {
                if(!player.ended)
                    this.endList.push(player.color);
            });
            
            game.gameStatus = 1;
        }
            
    }

	autoSaveGame() {
		localStorage.boardgame_ludo = JSON.stringify(this);
	}
    
	autoLoadGame() 
	{
		try
		{
			if(!localStorage.boardgame_ludo || localStorage.boardgame_ludo == null) 
				return false;
	
			let loadedGame = JSON.parse(localStorage.boardgame_ludo);
			game = new Game(loadedGame);

            game.gameStatus = loadedGame.gameStatus; 
            game.nmbrOfPlayers = loadedGame.nmbrOfPlayers; 
            game.currPlayer = loadedGame.currPlayer; 
            game.diceVal = loadedGame.diceVal; 
            game.waitCoinSelection = loadedGame.waitCoinSelection; 
            game.instruction = loadedGame.instruction; 
            game.endList = loadedGame.endList; 
            
            game.board = loadedGame.board;
            for(let i=0; i<loadedGame.board.length; i++) {
                const loadCell = loadedGame.board[i];
                game.board[i] = new Cell(loadCell.index, loadCell.mTopVal, loadCell.mLeftVal, loadCell.dTopVal, loadCell.dLeftVal);
                game.board[i].isSafe = loadCell.isSafe;
                game.board[i].isBlockedBy = loadCell.isBlockedBy;
                game.board[i].playerCoins = loadCell.playerCoins;;
            }
            
    
            game.players = loadedGame.players;
            for(let i=0; i<loadedGame.players.length; i++) {
                const loadedPlayer = loadedGame.players[i];
                game.players[i] = new Player(loadedPlayer.number, loadedPlayer.color, loadedPlayer);
            }
            
    
            if(loadedGame.selectedCoin && loadedGame.selectedCoin != null) {
                const loadPlayerCoin = loadedGame.selectedCoin;
                game.selectedCoin = new PlayerCoin(loadPlayerCoin.id, loadPlayerCoin.number, 
                            loadPlayerCoin.color, loadPlayerCoin.homePos, loadPlayerCoin.path, loadPlayerCoin);
            }

            if(game.nmbrOfPlayers < 4)
            {
                $("#yellow_0").remove();
                $("#yellow_1").remove();
                $("#yellow_2").remove();
                $("#yellow_3").remove();

                if(game.nmbrOfPlayers < 3)
                {
                    $("#blue_0").remove();
                    $("#blue_1").remove();
                    $("#blue_2").remove();
                    $("#blue_3").remove();
                }
            }

            $('.coin').css({"display":"" });
            $('.board').css({"display":""});

            game.removeAllHighlights();
            if(game.waitCoinSelection)
                game.players[game.currPlayer].checkPlay()
                
			return true;
		}
		catch(e)
		{
			return false;
		}
	}
}
