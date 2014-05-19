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
	this.friendsList = $('<div/>');
	var self = this;
	user.canSendGiftBombs = true;
	
	var titleCallback = function()
	{
		return self.showFriendsToInvite ? "Friends to invite" : "Friends playing to the game";
	};
	
	var items = {
		bombs : {
			type : 'text',
			captionCallback : function(){ return self.getBombsCaption(); }
		},
		change : {
			type : 'option',
			captionCallback : function(){ return self.showFriendsToInvite ? 'Show friends playing to the game' : 'Show friends to invite'; },
			clickCallback : function(){ self.showFriendsToInvite = !self.showFriendsToInvite; self.updateFriendsList(0); }
		},
		back : {
			type : 'option',
			caption : 'Back',
			clickCallback : function(){ game.launchMainMenu(); }
		}
	};
	
	MenuFrame.call(this,"friends",titleCallback,items);	
	this.$screen = $("#screen");
	
	this.$menuFrame.append(this.friendsList);
	this.updateFriendsList();
};

FriendsMenu.prototype = new MenuFrame();

FriendsMenu.prototype.getBombsCaption = function()
{
	if (this.showFriendsToInvite) return '';
	return 'Number of bombs: ' + user.nbBombs +
	         ' - gift bombs: ' + user.nbGiftBombs +
	     ' - next gift bomb: ' + $.timestampToLocaleDate(user.nextGiftBombDT);
};

FriendsMenu.prototype.computeNbPages = function(nbFriends)
{
	return Math.ceil( nbFriends / this.maxNbFriendsPerPage );
};

FriendsMenu.prototype.updateFriendsList = function(pageNb)
{
	if ($.isDefined(pageNb)) this.currentPageNb = pageNb;
	var currentListOfFriends = this.getFriendsList(this.showFriendsToInvite,this.currentPageNb);
	this.friendsList.empty();
	this.friendsList.append(currentListOfFriends);
	this.refreshCaptions();
};

FriendsMenu.prototype.createFriendRow = function(friend,showFriendsToInvite)
{
	var self = this;
	var friendFbId = friend.id;
	var friendName = friend.firstName + ' ' + friend.lastName;
	var friendItem = $('<tr/>').addClass("friend-item");
	var friendPictureUrl = "//graph.facebook.com/" + friendFbId + "/picture";
	var friendPicture = $("<img/>").addClass("friend-picture").attr("src",friendPictureUrl);
	var friendPictureCell = $('<td/>').addClass("friend-picture-cell").append(friendPicture);
	var friendNameCell = $('<td/>').addClass("friend-name").append(friendName);
	var friendButtonCell = $('<td/>');
	friendItem.append(friendPictureCell);
	friendItem.append(friendNameCell);
	friendItem.append(friendButtonCell);
	
	if (showFriendsToInvite)
	{
		if (!$.isDefined(friend.invited) || !friend.invited)
		{
			var friendInviteButton = $('<div/>');
			friendInviteButton.append('Invite')
			.addClass('friend-invite').addClass('friends-button')
			.click(function(){
				friend.invited = true;
				fbManager.inviteFriend(friendFbId);
				self.updateFriendsList();
			});
			friendButtonCell.append(friendInviteButton);
		}
	}
	else if (user.canSendGiftBombs && (user.nbGiftBombs > 0))
	{
		var friendGiftButton = $('<div/>');
		friendGiftButton.append('Send gift bomb')
		.addClass('friend-gift').addClass('friends-button')
		.click(function(){
			user.canSendGiftBombs = false;
    		self.updateFriendsList();
			fbManager.sendGiftBombToFriend(friendFbId,function(resp){
		    	serverManager.requestConsumeGift(function(resp){
		    		user.nbGiftBombs = resp.nbGiftBombs;
		    		user.canSendGiftBombs = true;
		    		self.updateFriendsList();
		    		self.refreshCaptions();
		    	},function(err){
		    		user.canSendGiftBombs = true;
		    		self.updateFriendsList();
		    		self.refreshCaptions();
		    		alert("Can't send gift bomb to friend (server error)");
		    	});
			},function(err){
	    		user.canSendGiftBombs = true;
	    		self.updateFriendsList();		
	    		self.refreshCaptions();		
	    		alert("Can't send gift bomb to friend (facebook error)");
			});

		});
		friendButtonCell.append(friendGiftButton);
	}
	
	return friendItem;
};

FriendsMenu.prototype.getFriendsList = function(showFriendsToInvite,pageNb)
{
	var self = this;
	var   friends = showFriendsToInvite ? this.friendsToInvite : user.friends;
	var nbFriends = showFriendsToInvite ? this.nbFriendsToInvite : this.nbPlayingFriends;
	var nbPages   = showFriendsToInvite ? this.nbPagesForFriendsToInvite : this.nbPagesForPlayingFriends;
	
	var friendsDiv = $('<div/>').addClass("friends-list");
	var friendList = $('<table/>').addClass("friends-table");
	friendsDiv.append(friendList);
	
	var indexStart = pageNb * this.maxNbFriendsPerPage;
	var indexEnd = ( pageNb + 1 ) * this.maxNbFriendsPerPage;
	indexEnd = Math.min( indexEnd, nbFriends );
	var currentIndex = -1;
	
	for(var friendKey in friends)
	{
		++currentIndex;
		
		if ((indexStart <= currentIndex) && (currentIndex < indexEnd))
		{
			var friend = friends[friendKey];
			var friendItem = this.createFriendRow(friend,showFriendsToInvite);
			friendList.append(friendItem);
			/*var friendFbId = friend.id;
			var friendName = friend.firstName + ' ' + friend.lastName;
			var friendItem = $('<tr/>').addClass("friend-item");
			var friendPictureUrl = "//graph.facebook.com/" + friendFbId + "/picture";
			var friendPicture = $("<img/>").addClass("friend-picture").attr("src",friendPictureUrl);
			var friendPictureCell = $('<td/>').addClass("friend-picture-cell").append(friendPicture);
			var friendNameCell = $('<td/>').addClass("friend-name").append(friendName);
			var friendInviteButton = $('<td/>');
			friendItem.append(friendPictureCell);
			friendItem.append(friendNameCell);
			friendItem.append(friendInviteButton);
			friendList.append(friendItem);
			
			if ( showFriendsToInvite && (!$.isDefined(friend.invited) || !friend.invited))
			{
				friendInviteButton.append('Invite')
				.addClass('friend-invite').addClass('friends-button')
				.click(function(){
					friend.invited = true;
					friendInviteButton.empty();
					self.inviteFriend(friend.id);
				});
			}*/
		}
	}
	
	var friendsControls = $('<table/>').addClass('friends-controls');
	var friendsControlsRow = $('<tr/>').addClass('friends-controls-row');
	friendsControls.append(friendsControlsRow);
	friendsDiv.append(friendsControls);
	
	if (pageNb > 0) 
	{
		var friendsPrevious = $('<td/>')
		.addClass('friends-button').addClass('friends-previous')
		.append('<- Page ' + pageNb)
		.click(function(){ self.updateFriendsList(pageNb-1); });
		friendsControlsRow.append(friendsPrevious);
	}
	
	if (nbPages > 1)
	{
		var friendsPageNb = friendsPrevious = $('<td/>').addClass('friends-page-nb').append('Page ' + (pageNb+1));
		friendsControlsRow.append(friendsPageNb);
	}
	
	if (pageNb < (nbPages-1)) 
	{
		var friendsNext = $('<td/>')
		.addClass('friends-button').addClass('friends-next')
		.append('Page ' + (pageNb+2) + ' ->')
		.click(function(){ self.updateFriendsList(pageNb+1); });
		friendsControlsRow.append(friendsNext);
	}

	return friendsDiv;
};

FriendsMenu.prototype.updateState = function(showMenu)
{	
	var self = this;
	
    if(showMenu)
    {
    	serverManager.requestFriendsToInvite(function(data)
    	{
    		self.friendsToInvite = $.isDefined(data) && $.isDefined(data.friends) ? data.friends : [];
    		self.nbFriendsToInvite = $.getNbKeysInObject(self.friendsToInvite);
    		self.nbPagesForFriendsToInvite = self.computeNbPages(self.nbFriendsToInvite);
    		self.listOfFriendsToInvite = self.getFriendsList(true,0);
    		MenuFrame.prototype.updateState.call(self,showMenu);
    		self.music.playLoop();
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
    	this.music.stop();
    	this.$screen.removeClass("paused");
    }
};