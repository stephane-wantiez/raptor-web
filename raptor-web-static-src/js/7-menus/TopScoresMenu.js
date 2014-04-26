var TopScoresMenu = function()
{
	this.music = assetManager.getSound("music-menu");
	this.scores = [];
	var self = this;
	
	var items = {
		list : {
			type : "text",
			captionCallback : function(){ return self.getTopScores(); }
		},
		back : {
			type : "option",
			caption : "Back",
			clickCallback : function(){ game.launchMainMenu(); }
		}
	};
	
	MenuFrame.call(this,"top-scores","Top Scores",items);	
	this.$screen = $("#screen");
};

TopScoresMenu.prototype = new MenuFrame();

TopScoresMenu.prototype.getTopScores = function()
{
	var scoresDiv = $('<div/>');
	var scoreList = $('<table/>').addClass("top-scores-table");
	scoresDiv.append(scoreList);
	
	for(var scoreIndex in this.scores)
	{
		var score = this.scores[scoreIndex];
		var scoreItem = $('<tr/>').addClass("top-score-item");
		var scoreValue = $('<td/>').addClass("top-score-value").append(score.value);
		var scoreDate = $('<td/>').addClass("top-score-date");
		var scoreDT = new Date(score.gameDT * 1000).toLocaleDateString(LOCALE.replace('_','-'));
		scoreDate.append(scoreDT);
		scoreItem.append(scoreValue);
		scoreItem.append(scoreDate);
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
    		self.scores = data;
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