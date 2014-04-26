var ServerManager = function()
{};

ServerManager.prototype.sendRequest = function(action,data,successCallback,errorCallback)
{
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			action: action,
			data: ($.isDefined(data)) ? data : ''
		},
		success: function(res){
			//alert('Success for request ' + action);
			if ($.isDefined(successCallback))
			{
				successCallback(res);
			}
		},
		error: function(err){
			//alert('Failure for request ' + action);
			if ($.isDefined(errorCallback))
			{
				errorCallback(JSON.stringify(err, null, '\n'));
			}
		}
	});
};

ServerManager.prototype.requestLevelData = function(levelNumber,successCallback,errorCallback)
{
	// send the request with the level number, receive the level properties if successful
	this.sendRequest('get-level',levelNumber,successCallback,errorCallback);
};

ServerManager.prototype.requestGameStart = function(successCallback,errorCallback)
{
	// send the request w/o any data, receive the score id if successful
	this.sendRequest('game-start','',successCallback,errorCallback);
};

ServerManager.prototype.requestGameScoreUpdate = function(scoreIncrement,successCallback,errorCallback)
{
	// send the request with the score increment, receive the new score if successful
	this.sendRequest('game-score-update',scoreIncrement,successCallback,errorCallback);
};

ServerManager.prototype.requestGameEnd = function(successCallback,errorCallback)
{
	// send the request w/o any data, receive the score id if successful
	this.sendRequest('game-end','',successCallback,errorCallback);
};

ServerManager.prototype.requestTopScores = function(successCallback,errorCallback)
{
	// send the request w/o any data, receive the array of 5 user's top scores maximum
	this.sendRequest('user-top-scores','',successCallback,errorCallback);
};
