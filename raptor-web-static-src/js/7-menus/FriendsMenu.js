var FriendsMenu = function()
{
	// TODO: change to allow buttons to be pressed -> list should not be of text type, but JQuery div updated when captions updated
	
	this.music = assetManager.getSound("music-menu");
	this.showFriendsToInvite = false;
	this.friendsToInvite = [];
	this.nbFriendsToInvite = 0;
	this.nbPlayingFriends = $.getNbKeysInObject(user.friends);
	this.maxNbFriendsPerPage = parseInt(config.GAME.MAX_NB_FRIENDS_PER_PAGE);
	this.currentPageNb = 0;
	this.nbPagesForFriendsToInvite = 0;
	this.nbPagesForPlayingFriends = this.computeNbPages(this.nbPlayingFriends);
	var self = this;
	
	var titleCallback = function()
	{
		return self.showFriendsToInvite ? "Friends to invite" : "Friends playing to the game";
	};
	
	var items = {
		list : {
			type : "text",
			captionCallback : function(){ return self.getFriendsList(); }
		},
		change : {
			type : "option",
			captionCallback : function(){ return self.showFriendsToInvite ? "Show friends playing to the game" : "Show friends to invite"; },
			clickCallback : function(){ self.changeList(); }
		},
		back : {
			type : "option",
			caption : "Back",
			clickCallback : function(){ game.launchMainMenu(); }
		}
	};
	
	MenuFrame.call(this,"friends",titleCallback,items);	
	this.$screen = $("#screen");
};

FriendsMenu.prototype = new MenuFrame();

FriendsMenu.prototype.computeNbPages = function(nbFriends)
{
	return Math.ceil( nbFriends / this.maxNbFriendsPerPage );
};

FriendsMenu.prototype.changeList = function()
{
	this.showFriendsToInvite = !this.showFriendsToInvite;
	this.currentPageNb = 0;
	this.refreshCaptions();
};

FriendsMenu.prototype.getFriendsList = function()
{
	var self = this;
	var   friends = this.showFriendsToInvite ? this.friendsToInvite : user.friends;
	var nbFriends = this.showFriendsToInvite ? this.nbFriendsToInvite : this.nbPlayingFriends;
	var nbPages   = this.showFriendsToInvite ? this.nbPagesForFriendsToInvite : this.nbPagesForPlayingFriends;
	
	var friendsDiv = $('<div/>');
	var friendList = $('<table/>').addClass("friends-table");
	friendsDiv.append(friendList);
	
	var indexStart = this.currentPageNb * this.maxNbFriendsPerPage;
	var indexEnd = ( this.currentPageNb + 1 ) * this.maxNbFriendsPerPage;
	indexEnd = Math.min( indexEnd, nbFriends );
	var currentIndex = -1;
	
	for(var friendName in friends)
	{
		++currentIndex;
		
		if ((indexStart <= currentIndex) && (currentIndex < indexEnd))
		{
			var friendFbId = friends[friendName];
			var friendItem = $('<tr/>').addClass("friend-item");
			var friendPictureUrl = "//graph.facebook.com/" + friendFbId + "/picture";
			var friendPicture = $("<img/>").addClass("friend-picture").attr("src",friendPictureUrl);
			var friendPictureCell = $('<td/>').addClass("friend-picture-cell").append(friendPicture);
			var friendNameCell = $('<td/>').addClass("friend-name").append(friendName);
			friendItem.append(friendPictureCell);
			friendItem.append(friendNameCell);
			friendList.append(friendItem);
		}
	}
	
	var friendsControls = $('<table/>').addClass('friends-controls');
	var friendsControlsRow = $('<tr/>').addClass('friends-controls-row');
	friendsControls.append(friendsControlsRow);
	friendsDiv.append(friendsControls);
	
	if (this.currentPageNb > 0) 
	{
		var friendsPrevious = $('<td/>')
		.addClass('friends-button').addClass('friends-previous')
		.append('<- Page ' + this.currentPageNb + ' - ')
		.click(function(){ self.changePage(this.currentPageNb-1); });
		friendsControlsRow.append(friendsPrevious);
	}
	
	var friendsPageNb = friendsPrevious = $('<td/>').addClass('friends-page-nb').append('Page ' + (this.currentPageNb+1));
	friendsControlsRow.append(friendsPageNb);
	
	if (this.currentPageNb < (nbPages-1)) 
	{
		var friendsNext = $('<td/>')
		.addClass('friends-button').addClass('friends-next')
		.append(' - Page ' + (this.currentPageNb+2) + ' ->')
		.click(function(){ self.changePage(this.currentPageNb+1); });
		friendsControlsRow.append(friendsNext);
	}

	return friendsDiv.html();
};

FriendsMenu.prototype.changePage = function(pageNb)
{
	this.currentPageNb = pageNb;
	this.refreshCaptions();
};

FriendsMenu.prototype.updateState = function(showMenu)
{	
	var self = this;
	
    if(showMenu)
    {
    	serverManager.requestFriendsToInvite(function(data)
    	{
    		self.friendsToInvite = data;
    		self.nbFriendsToInvite = $.getNbKeysInObject(data);
    		self.nbPagesForFriendsToInvite = self.computeNbPages(self.nbFriendsToInvite);
    		MenuFrame.prototype.updateState.call(self,showMenu);
    		//self.music.playLoop();
    		self.$screen.addClass("paused");
    	}
    	,function(err)
    	{
    		alert("Can't get friends to invite from server: " + err);
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