var LevelBuilder =
{
	/**
	 * Reads level data file, and return the level objects (with enemy objects loaded).
	 * 
	 * The level data file should be a JSON file with the following content:
	 * - enemies : array of elements:
	 *   - type : class name
	 *   - posX : position on X-axis
	 *   - posY : position on Y-axis
	 */
	loadLevelData : function(levelName)
	{
		console.log("Loading data of level " + levelName);
		var levelData = assetManager.getLevelProperties(levelName);
		return this.parseLevelData(levelData);
	},
	parseLevelData : function(levelData)
	{
		//console.log("Parsing level data: " + $.objectToString(levelData));
		var levelProperties = {};
		for(var levelVar in levelData)
		{
			var levelVarContent = levelData[levelVar];
			
			switch(levelVar)
			{
				case "enemies" : levelProperties["enemies"] = this.parseEnemiesData(levelData[levelVar]); break;
				default : levelProperties[levelVar] = levelVarContent; break;
			}
		}
		return levelProperties;
	},
	parseEnemiesData : function(enemiesData)
	{
		//console.log("Parsing enemies data: " + $.objectToString(enemiesData));
		var enemiesObjects = [];
		for(var enemyDataId in enemiesData)
		{
			var enemyData = enemiesData[enemyDataId];
			var enemyObject = this.parseEnemyData( enemyData, "enemy" + enemiesObjects.length + 1 );
			enemiesObjects.push(enemyObject);
		}
		return enemiesObjects;
	},
	parseEnemyData : function(enemyData,id)
	{
		//console.log("Parsing enemy " + id + " data: " + $.objectToString(enemyData));
		var posX = enemyData.posX;
		var posY = enemyData.posY;
		
		switch(enemyData.type)
		{
			case "FlyingEnemy1" : return new FlyingEnemy1(id,posX,posY);
			case "FlyingEnemy2" : return new FlyingEnemy2(id,posX,posY);
			case "FlyingEnemy3" : return new FlyingEnemy3(id,posX,posY);
			default : console.log("Unknown enemy type: " + enemyData.type); break;
		}
		
		return null;
	}
};