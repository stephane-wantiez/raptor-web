var LevelLoader = function()
{
	this.levelNumber = 0;
	this.levelData = false;
	this.levelLoaded = false;
	this.levelError = false;
};

LevelLoader.prototype.loadLevel = function(levelNumber)
{
	var self = this;
	this.levelNumber = levelNumber;
	this.levelData = false;
	this.levelLoaded = false;
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
	this.levelLoaded = true;
	this.levelError = false;
};

LevelLoader.prototype.onLevelLoadingError = function(error)
{
	this.levelData = false;
	this.levelLoaded = false;
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

LevelLoader.prototype.isLevelLoaded = function()
{
	return this.levelLoaded;
};

LevelLoader.prototype.isLevelLoadingFailed = function()
{
	return this.levelError;
};

LevelLoader.prototype.getLevelLoadingError = function()
{
	return this.levelError;
};
