var TopScoresMenu = function()
{
	this.music = assetManager.getSound("music-menu");
	this.userScores = [];
	this.friendsScores = [];
	this.allScores = [];
	this.type = TopScoresMenu.TYPE.USER;
	this.captionPerType = [];
	this.captionPerType[TopScoresMenu.TYPE.USER   ] = "Show player's scores";
	this.captionPerType[TopScoresMenu.TYPE.FRIENDS] = "Show friends' scores";
	this.captionPerType[TopScoresMenu.TYPE.ALL    ] = "Show all scores";
	var self = this;
	
	var titleCallback = function()
	{
		return self.getCaptionForTypeOffset(0);
	};
	
	var items = {
		list : {
			type : "text",
			captionCallback : function(){ return self.getTopScores(); }
		},
		change1 : {
			type : "option",
			captionCallback : function(){ return self.getCaptionForTypeOffset(1); },
			clickCallback : function(){ self.setNewTypeWithOffset(1); }
		},
		change2 : {
			type : "option",
			captionCallback : function(){ return self.getCaptionForTypeOffset(2); },
			clickCallback : function(){ self.setNewTypeWithOffset(2); }
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

TopScoresMenu.TYPE = { USER : 0, FRIENDS : 1, ALL : 2, NB_TYPES : 3 };

TopScoresMenu.prototype.getCaptionForTypeOffset = function(typeOffset)
{
	var type = ( this.type + typeOffset ) % TopScoresMenu.TYPE.NB_TYPES;
	return this.captionPerType[type];
};

TopScoresMenu.prototype.setNewTypeWithOffset = function(typeOffset)
{
	this.type = ( this.type + typeOffset ) % TopScoresMenu.TYPE.NB_TYPES;
	this.refreshCaptions();
};

TopScoresMenu.prototype.getCurrentOption1Caption = function()
{
	switch(this.type)
	{
		case TopScoresMenu.TYPE.USER    : return "Show player's scores";
		case TopScoresMenu.TYPE.FRIENDS : return "Show friends' scores";
		case TopScoresMenu.TYPE.ALL     : return "Show all scores";
	}
};

TopScoresMenu.prototype.getCurrentScoresList = function()
{
	switch(this.type)
	{
		case TopScoresMenu.TYPE.USER    : return this.userScores;
		case TopScoresMenu.TYPE.FRIENDS : return this.friendsScores;
		case TopScoresMenu.TYPE.ALL     : return this.allScores;
	}
};

TopScoresMenu.prototype.getTopScores = function()
{
	var topScores = this.getCurrentScoresList();
	
	var scoresDiv = $('<div/>');
	var scoreList = $('<table/>').addClass("top-scores-table");
	scoresDiv.append(scoreList);
	
	for(var scoreIndex in topScores)
	{
		var score = topScores[scoreIndex];
		var scoreItem = $('<tr/>').addClass("top-score-item");
		var scoreUser = $('<td/>').addClass("top-score-user").append(score.firstname + " " + score.lastname);
		var scoreValue = $('<td/>').addClass("top-score-value").append(score.value);
		var scoreDate = $('<td/>').addClass("top-score-date");
		var scoreDT = $.timestampToLocaleDate(score.game_dt);
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
    		self.friendsScores = data['friends'];
    		self.allScores = data['all'];
    		MenuFrame.prototype.updateState.call(self,showMenu);
    		self.music.playLoop();
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
    	this.music.stop();
    	this.$screen.removeClass("paused");
    }
};