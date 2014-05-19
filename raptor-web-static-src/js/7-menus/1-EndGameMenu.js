var EndGameMenu = function(menuId,title,victory)
{
	if (!$.isDefined(menuId)) return;
	
	var items = {
		score1 : {
			type : "text",
			caption : "You scored",
			extraClass : "endgame-menu-score1"
		},
		score2 : {
			type : "text",
			captionCallback : function(){ return game.getPlayerScore() + " points"; },
			extraClass : "endgame-menu-score2"
		},
		share : {
			type : "option",
			caption : "Share",
			clickCallback : function(){
				var message = victory ? 'Victory' : 'Defeated';
				message = message + ' with a score of ' + game.getPlayerScore() + ' points';
				fbManager.postOnWall(message);
			},
			extraClass : "endgame-menu-share"
		},
		restart : {
			type : "option",
			caption : "Restart",
			clickCallback : function(){ game.restart(); },
			extraClass : "endgame-menu-restart"
		},
		exit : {
			type : "option",
			caption : "Exit",
			clickCallback : function(){ game.launchMainMenu(); },
			extraClass : "endgame-menu-exit"
		}
	};
	
	MenuFrame.call(this,menuId,title,items,"endgame-menu","endgame-menu-title");
	this.$screen = $("#screen");
};

EndGameMenu.prototype = new MenuFrame();

EndGameMenu.prototype.updateState = function(gameEnd)
{
	MenuFrame.prototype.updateState.call(this,gameEnd);
	
    if(gameEnd)
    {
    	this.$screen.addClass("paused");
    }
    else
    {
    	this.$screen.removeClass("paused");
    }
};