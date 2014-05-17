var Scene = function(sceneConfig)
{
	this.actors = new ActorsContainer();
	this.playerActors = new ActorsContainer();
	this.boss = false;
	this.currentLevel = "";
	this.currentMusic = "";
	this.loaded = false; 
	this.flashEnd = 0;
	this.explosionFlashPeriod = parseInt(sceneConfig.EXPLOSION_FLASH_PERIOD_MSEC);
	this.flashColor = sceneConfig.EXPLOSION_FLASH_COLOR;
};

Scene.State = { STARTING : 0, PLAYING : 1, BOSS_FIGHT : 2, VICTORY : 3, DEAD : 4, RESTARTING : 5, ENDGAME : 6 };

Scene.prototype.reset = function()
{
	this.actors.removeAll();
	this.playerActors.removeAll();
	this.speedY = Scene.CAMERA_SPEED;
	this.state = Scene.State.STARTING;
	this.loaded = false;
	this.flashEnd = 0;
	this.stopMusic();
};

Scene.prototype.loadLevel = function(levelProperties)
{
	this.reset();
	this.currentLevel = levelProperties;
	var levelData = LevelBuilder.parseLevelData(levelProperties);
	this.backgroundImage = assetManager.getImage(levelData["background"]);
	this.maxY = this.backgroundImage.height;
	this.cameraY = this.maxY - Scene.SCREEN_HEIGHT;
	this.actors.addAll(levelData["enemies"]);
	this.musics = levelData["musics"];
	this.boss = levelData["boss"][0];
	this.actors.add(this.boss);
	this.loaded = true;
};

Scene.prototype.reloadLevel = function()
{
	var self = this;
	serverManager.requestGameStart(function(data){
		self.loadLevel(self.currentLevel);
	},function(err){
		alert('Error while starting level: ' + err);
		game.launchMainMenu();
	});
};

Scene.prototype.flash = function()
{
	this.flashEnd = game.elapsedGameTimeSinceStartup + this.explosionFlashPeriod;
};

Scene.prototype.onGameEnd = function(victory)
{
	this.timeSinceEndMs = Date.now();
	this.state = Scene.State.ENDGAME;
	serverManager.requestGameEnd(function(data){
		if (victory) game.onVictory();
		else game.onGameOver();
	},function(err){
		alert('Error while ending game: ' + err);
		game.launchMainMenu();
	});
};

Scene.prototype.launchMusic = function(mode,loop)
{
	this.stopMusic();
	
	if ( $.isDefined(this.musics) && $.isDefined(this.musics[mode]) && (this.musics[mode] != '') )
	{
		//console.log("Loading music " + mode + ( loop ? " in loop" : "" ));
		this.currentMusic = mode;
		var music = assetManager.getSound(this.musics[mode]);
		if (loop) music.playLoop();
		else music.play();
	}
};

Scene.prototype.stopMusic = function(mode)
{
	if (!$.isDefined(mode) && (this.currentMusic != ""))
	{
		mode = this.currentMusic;
	}
	if ( $.isDefined(this.musics) && $.isDefined(mode) && $.isDefined(this.musics[mode]) )
	{
		var music = assetManager.getSound(this.musics[mode]);
		music.stop();
	}
};

Scene.prototype.checkCollisionsBetweenActorsAnd = function(actor)
{
	for (var otherActorId in this.actors.list)
	{
		var otherActor = this.actors.list[otherActorId];
		if (otherActor.state == Actor.State.ACTIVE)
		{
			//console.log("Checking collision between actor " + actor.id + " and actor " + otherActor.id);
			actor.checkCollisionWith(otherActor);
		}
	}
};

Scene.prototype.checkActorsCollision = function()
{
	this.checkCollisionsBetweenActorsAnd(player);
	
	for (var playerActorId in this.playerActors.list)
	{
		var playerActor = this.playerActors.list[playerActorId];
		if (playerActor.state == Actor.State.ACTIVE)
		{
			this.checkCollisionsBetweenActorsAnd(playerActor);
		}
	}
};

Scene.prototype.isActorOutOfXLimits = function(actor)
{
	return actor.isBeforeX(0) || actor.isAfterX(Scene.SCREEN_WIDTH);
};

Scene.prototype.checkActorPosition = function(actor)
{
	if (this.isActorOutOfXLimits(actor))
	{
		actor.remove();
	}
	else
	{
		var actorIsVisibleInY = this.isActorVisibleInY(actor);
		
		if (actor.state == Actor.State.INACTIVE)
		{
			if (actorIsVisibleInY)
			{
				//console.log("Inactive actor " + actor.id + " becomes visible, activation");
				actor.activate();
			}
		}
		else if (actor.state == Actor.State.ACTIVE)
		{
			if (!actorIsVisibleInY)
			{
				//console.log("Active actor " + actor.id + " becomes invisible, removal");
				actor.remove();
			}
		}
	}
};

Scene.prototype.checkActorsPosition = function()
{
	for (var actorId in this.actors.list)
	{
		var actor = this.actors.list[actorId];
		this.checkActorPosition(actor);
	}
	for (var actorId in this.playerActors.list)
	{
		var actor = this.playerActors.list[actorId];
		this.checkActorPosition(actor);
	}
};

Scene.prototype.killActiveActors = function()
{
	for (var actorId in this.actors.list)
	{
		var actor = this.actors.list[actorId];
		
		if (actor.state == Actor.State.ACTIVE)
		{
			actor.kill();
		}
	}
};

Scene.prototype.getCameraPosition = function()
{
	return this.cameraY;
};

Scene.prototype.updateCameraPosition = function(deltaTimeSec)
{
	if (this.state == Scene.State.PLAYING)
	{
		this.cameraY += this.speedY * deltaTimeSec;
		this.cameraY = $.clampValue( this.cameraY, 0, this.maxY - Scene.SCREEN_HEIGHT );
	}
};

Scene.prototype.getMinVisibleY = function()
{
	return this.cameraY - Scene.VISIBILITY_OFFSET;
};

Scene.prototype.getMaxVisibleY = function()
{
	return this.cameraY + Scene.SCREEN_HEIGHT + Scene.VISIBILITY_OFFSET;
};

Scene.prototype.isActorVisibleInY = function(actor)
{
	return !actor.isBeforeY(this.getMinVisibleY()) && !actor.isAfterY(this.getMaxVisibleY());
};

Scene.prototype.isBossKilled = function()
{
	return this.boss.state == Actor.State.DEAD ;
};

Scene.prototype.updateState = function()
{
	switch(this.state)
	{
		case Scene.State.STARTING :
		{
			player.reset();
			this.state = Scene.State.PLAYING;
			this.launchMusic("fight", true);
			break;
		}
		case Scene.State.PLAYING :
		{
			if (player.state == Actor.State.DEAD)
			{
				this.launchMusic("defeat", false);
				this.state = Scene.State.DEAD;
			}
			else if (this.cameraY == 0)
			{
				this.launchMusic("boss", true);
				this.state = Scene.State.BOSS_FIGHT;
			}
			break;
		}
		case Scene.State.BOSS_FIGHT :
		{
			if (player.state == Actor.State.DEAD)
			{
				this.launchMusic("defeat", false);
				this.state = Scene.State.DEAD;
			}
			else if (this.isBossKilled())
			{
				this.launchMusic("victory", false);
				this.state = Scene.State.VICTORY;
			}
			break;
		}
		case Scene.State.VICTORY :
		{
			inputManager.playerControlsEnabled = false;
			if (player.y > -50)
			{
				player.y -= 2;
			}
			else
			{
				this.onGameEnd(true);
			}
			break;
		}
		case Scene.State.DEAD :
		{
			this.onGameEnd(false);
			break;
		}
		case Scene.State.RESTARTING :
		{
			var currentTimeMs = Date.now();
			if ((currentTimeMs - this.timeSinceEndMs) > Scene.WAIT_BEFORE_RESTART_MS)
			{
				this.actors.removeAll();
				this.playerActors.removeAll();
				this.stopMusic();
				this.reloadLevel();
			}
			break;
		}
	}
};

Scene.prototype.update = function(deltaTimeSec)
{
	if (!this.loaded) return;
	
	if (!game.paused)
	{
		this.actors.clean();
		this.actors.update(deltaTimeSec);
		
		this.playerActors.clean();
		this.playerActors.update(deltaTimeSec);
		
		this.updateCameraPosition(deltaTimeSec);
		this.updateState();
		
		this.checkActorsCollision();
		this.checkActorsPosition();
	}	
	//console.log("Camera Y: " + this.cameraY);
	//console.log("Nb actors in scene: " + this.actors.size());
};

Scene.prototype.render = function(g)
{
	if (!this.loaded) return;
	
	g.save();
	
	if (game.elapsedGameTimeSinceStartup < this.flashEnd)
	{
		g.fillStyle = this.flashColor;
		g.fillRect(0,0,g.canvas.width,g.canvas.height);
	}
	else
	{
		// go to the origin of the scene, and draw the scene actors from there
	    g.translate(0,-this.cameraY);
	    g.drawImage(this.backgroundImage,0,0);
	    this.actors.render(g);
	    this.playerActors.render(g);
	}
    
    g.restore();
};

Scene.CAMERA_SPEED = -40;
Scene.VISIBILITY_OFFSET = 100;
Scene.SCREEN_WIDTH = 800;
Scene.SCREEN_HEIGHT = 600;
Scene.WAIT_BEFORE_RESTART_MS = 4000;
