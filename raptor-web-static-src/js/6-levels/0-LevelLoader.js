var LevelLoader = function()
{
	this.levelNumber = 0;
	this.levelData = false;
	this.levelScoreId = 0;
	this.levelLoaded = false;
	this.levelLaunched = false;
	this.levelError = false;
};

LevelLoader.prototype.loadLevel = function(levelNumber)
{
	var self = this;
	this.levelNumber = levelNumber;
	this.levelData = false;
	this.levelScoreId = 0;
	this.levelLoaded = false;
	this.levelLaunched = false;
	this.levelError = false;
	
	serverManager.requestLevelData(levelNumber,
	function(data)
	{
		self.onLevelLoaded(data);
	},
	function(error)
	{
		self.onLevelLoadingError(error);
	});	
};

LevelLoader.prototype.onLevelLoaded = function(levelData)
{
	this.levelData = levelData;
	this.levelScoreId = 0;
	this.levelLoaded = true;
	this.levelLaunched = false;
	this.levelError = false;
	this.launchGame();
};

LevelLoader.prototype.onLevelLoadingError = function(error)
{
	this.levelData = false;
	this.levelScoreId = 0;
	this.levelLoaded = false;
	this.levelLaunched = false;
	this.levelError = error;
};

LevelLoader.prototype.launchGame = function()
{
	var self = this;
	serverManager.requestGameStart(function(data)
	{
		self.onLevelLaunched(data);
	},
	function(error)
	{
		self.onLevelLoadingError(error);
	});	
	
};

LevelLoader.prototype.onLevelLaunched = function(levelScoreId)
{
	if (levelScoreId == 0)
	{
		this.onLevelLaunchError('Invalid score ID');
	}
	else
	{
		this.levelScoreId = levelScoreId;
		this.levelLaunched = true;
		this.levelError = false;
	}
};

LevelLoader.prototype.onLevelLaunchError = function(error)
{
	this.levelScoreId = 0;
	this.levelLaunched = false;
	this.levelError = error;
};

LevelLoader.prototype.getLevelNumber = function()
{
	return this.levelNumber;
};

LevelLoader.prototype.getLevelData = function()
{
	return this.levelData;
};

LevelLoader.prototype.getLevelScoreId = function()
{
	return this.levelScoreId;
};

LevelLoader.prototype.isLevelLoaded = function()
{
	return this.levelLoaded;
};

LevelLoader.prototype.isLevelLaunched = function()
{
	return this.levelLaunched;
};

LevelLoader.prototype.isLevelLoadingFailed = function()
{
	return this.levelError;
};

LevelLoader.prototype.getLevelLoadingError = function()
{
	return this.levelError;
};
