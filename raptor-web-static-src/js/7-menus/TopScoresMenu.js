var TopScoresMenu = function()
{
	this.music = assetManager.getSound("music-menu");
	this.userScores = [];
	this.allScores = [];
	this.showAllScores = false;
	var self = this;
	
	var titleCallback = function()
	{
		return self.showAllScores ? "Top scores for all players" : "Top scores for current player";
	};
	
	var items = {
		list : {
			type : "text",
			captionCallback : function(){ return self.getTopScores(); }
		},
		change : {
			type : "option",
			captionCallback : function(){ return self.showAllScores ? "Show player's scores only" : "Show all scores"; },
			clickCallback : function(){ self.showAllScores = !self.showAllScores; self.refreshCaptions(); }
		},
		back : {
			type : "option",
			caption : "Back",
			clickCallback : function(){ game.launchMainMenu(); }
		}
	};
	
	MenuFrame.call(this,"top-scores",titleCallback,items);	
	this.$screen = $("#screen");
};

TopScoresMenu.prototype = new MenuFrame();

TopScoresMenu.prototype.getTopScores = function()
{
	var topScores = this.showAllScores ? this.allScores : this.userScores;
	
	var scoresDiv = $('<div/>');
	var scoreList = $('<table/>').addClass("top-scores-table");
	scoresDiv.append(scoreList);
	
	for(var scoreIndex in topScores)
	{
		var score = topScores[scoreIndex];
		var scoreItem = $('<tr/>').addClass("top-score-item");
		var scoreUser = $('<td/>').addClass("top-score-user").append(score.user);
		var scoreValue = $('<td/>').addClass("top-score-value").append(score.value);
		var scoreDate = $('<td/>').addClass("top-score-date");
		var scoreDT = new Date(score.game_dt * 1000).toLocaleDateString(LOCALE.replace('_','-'));
		scoreDate.append(scoreDT);
		scoreItem.append(scoreUser);
		scoreItem.append(scoreDate);
		scoreItem.append(scoreValue);
		scoreList.append(scoreItem);
	}

	return scoresDiv.html();
};

TopScoresMenu.prototype.updateState = function(showMenu)
{	
	var self = this;
	
    if(showMenu)
    {
    	serverManager.requestTopScores(function(data)
    	{
    		self.userScores = data['user'];
    		self.allScores = data['all'];
    		MenuFrame.prototype.updateState.call(self,showMenu);
    		//self.music.playLoop();
    		self.$screen.addClass("paused");
    	}
    	,function(err)
    	{
    		alert("Can't get top scores from server: " + err);
    		game.launchMainMenu();
    	});
    }
    else
    {
		MenuFrame.prototype.updateState.call(self,false);
    	//this.music.stop();
    	this.$screen.removeClass("paused");
    }
};