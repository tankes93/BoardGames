
class Cell 
{
    constructor(index,mtopVal,mleftVal,dtopVal,dleftVal) 
    {
        this.index = index;  

        this.mTopVal = mtopVal;
        this.mLeftVal = mleftVal;

        this.dTopVal = dtopVal;
        this.dLeftVal = dleftVal;

        this.isSafe = false;
        this.isBlockedBy = -1;

        this.playerCoins = [];
    }

    isBlocked(x)
    {  
        if(this.isSafe) return false;
        return (this.isBlockedBy > -1 && this.isBlockedBy != x);
    }

    checkCoin()
    {
        return (this.playerCoins.length > 0);
    }

    addCoin(coinID,x)
    {
        
        if(this.playerCoins.length > 0 && !this.isSafe)
        {
            if(this.playerCoins[0].split('_')[0] == coinID.split('_')[0])
            {   
                this.block(coinID,x);
            }
            else
            {
                this.knockoutCoin(this.playerCoins[0]);
            }
        }

        this.playerCoins.push(coinID);     
    }

    block(coinID,x)
    {
        const bgColor = "#777";
        $("#"+coinID).css({"background":bgColor});
        this.isBlockedBy = x;
    }
    unBlock()
    {
        this.playerCoins.forEach(coinID => {
            $("#"+coinID).css({"background":""}); 
        });
        this.isBlockedBy = -1; 
    }

    removeCoin(coinID)
    {
        if(!this.playerCoins.includes(coinID)) 
            return;
        if(this.playerCoins.length == 2)
            this.unBlock();
        this.playerCoins.splice(this.playerCoins.indexOf(coinID), 1);
        return;
    }

    knockoutCoin(coinID)
    {
        this.removeCoin(coinID)
        var selectedPlayer = game.players.find(x => x.color == coinID.split('_')[0]);
        var selectedCoin = selectedPlayer.coins.find(x => x.id == coinID);
        selectedCoin.started = false;
        selectedCoin.ended = false;
        selectedCoin.moveCoin(-1);
    }

}
