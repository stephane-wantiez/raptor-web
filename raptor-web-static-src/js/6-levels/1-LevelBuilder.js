var LevelBuilder =
{
	parseLevelData : function(levelData)
	{
		//console.log("Parsing level data: " + $.objectToString(levelData));
		var levelProperties = {};
		for(var levelVar in levelData)
		{
			var levelVarContent = levelData[levelVar];
			
			switch(levelVar)
			{
				case "enemies" : levelProperties["enemies"] = this.parseEnemiesData(levelVarContent,"enemy"); break;
				case "boss"    : levelProperties["boss"   ] = this.parseEnemiesData(levelVarContent,"boss" ); break;
				default : levelProperties[levelVar] = levelVarContent; break;
			}
		}
		return levelProperties;
	},
	parseEnemiesData : function(enemiesData,idPrefix)
	{
		//console.log("Parsing enemies data: " + $.objectToString(enemiesData));
		var enemiesObjects = [];
		for(var enemyDataId in enemiesData)
		{
			var enemyData = enemiesData[enemyDataId];
			var enemyObject = this.parseEnemyData( enemyData, idPrefix + enemiesObjects.length + 1 );
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
			case "FlyingBoss1"  : return new  FlyingBoss1(id,posX,posY);
			default : console.log("Unknown enemy type: " + enemyData.type); break;
		}
		
		return null;
	}
};