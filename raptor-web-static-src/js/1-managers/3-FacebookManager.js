var FacebookManager = function()
{
	this.available = false;
	var self = this;
	
	if (FB_APP_ID != '')
	{
		console.log('Initializing facebook API...');
		$.getScript('//connect.facebook.net/' + LOCALE + '/all.js', function()
		{
			console.log('Facebook initialized');
			self.available = true;
			FB.init({
				appId: FB_APP_ID
			});
			FB.getLoginStatus(function(result){
				console.log('Facebook login status: ' + $.objectToString(result));
			});
		});
	}
};

FacebookManager.prototype.sendData = function(friendId,title,message,data,successCallback,errorCallback)
{
	friendId = parseInt(friendId);
	
	if (this.available)
	{
		FB.ui({
			method: 'apprequests',
			title: title,
			message: message,
			to: friendId,
			data : data
		}, function(response) {
		    if (response && !response.error_code) {
		    	if ($.isDefined(successCallback)) successCallback(response);
		    } else {
				var responseStr = $.objectToString(response);
				console.log('Facebook API error:');
				console.log(responseStr);
		    	if ($.isDefined(errorCallback)) errorCallback(response);
		    }
		});
	}
};

FacebookManager.prototype.inviteFriend = function(friendId,successCallback,errorCallback)
{
	this.sendData( friendId, 'Invitation for ' + Game.TITLE, 'Enter the battle!', null, successCallback, errorCallback );
};

FacebookManager.prototype.sendGiftBombToFriend = function(friendId,successCallback,errorCallback)
{
	this.sendData( friendId, 'Gift bomb received for ' + Game.TITLE, 'Gift bomb received!', 'gift-bomb', successCallback, errorCallback );
};
