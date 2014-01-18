var Scene = function()
{
	this.actors = new ActorsContainer();
	this.playerActors = new ActorsContainer();
	this.boss = false;
	this.currentLevel = "";
	this.currentMusic = "";
};

Scene.State = { STARTING : 0, PLAYING : 1, BOSS_FIGHT : 2, VICTORY : 3, DEAD : 4, RESTARTING : 5 };

Scene.prototype.resetScene = function()
{
	this.actors.removeAll();
	this.playerActors.removeAll();
	this.speedY = Scene.CAMERA_SPEED;
	this.state = Scene.State.STARTING;
};

Scene.prototype.loadLevel = function(levelName)
{
	this.resetScene();
	this.currentLevel = levelName;
	var levelProperties = LevelBuilder.loadLevelData(levelName);
	//console.log(levelProperties);
	this.backgroundImage = assetManager.getImage(levelProperties["background"]);
	this.maxY = this.backgroundImage.height;
	this.cameraY = this.maxY - Scene.SCREEN_HEIGHT;
	this.actors.addAll(levelProperties["enemies"]);
	this.musics = levelProperties["musics"];
	this.boss = levelProperties["boss"][0];
	this.actors.add(this.boss);
};

Scene.prototype.reloadLevel = function()
{
	this.loadLevel(this.currentLevel);
};

Scene.prototype.launchMusic = function(mode,loop)
{
	this.stopMusic();
	
	if ( $.isDefined(this.musics) && $.isDefined(this.musics[mode]) )
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
		music.pause();
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
			player.controlsEnabled = false;
			if (player.y > -50)
			{
				player.y -= 2;
			}
			else
			{
				this.timeSinceEndMs = Date.now();
				this.state = Scene.State.RESTARTING;
			}
			break;
		}
		case Scene.State.DEAD :
		{
			this.actors.removeAll();
			this.playerActors.removeAll();
			this.timeSinceEndMs = Date.now();
			this.state = Scene.State.RESTARTING;
			break;
		}
		case Scene.State.RESTARTING :
		{
			var currentTimeMs = Date.now();
			if ((currentTimeMs - this.timeSinceEndMs) > Scene.WAIT_BEFORE_RESTART_MS)
			{
				this.stopMusic();
				this.reloadLevel();
			}
			break;
		}
	}
};

Scene.prototype.update = function(deltaTimeSec)
{
	this.actors.clean();
	this.actors.update(deltaTimeSec);
	
	this.playerActors.clean();
	this.playerActors.update(deltaTimeSec);
	
	this.updateCameraPosition(deltaTimeSec);
	this.updateState();
	
	this.checkActorsCollision();
	this.checkActorsPosition();
	
	//console.log("Camera Y: " + this.cameraY);
	//console.log("Nb actors in scene: " + this.actors.size());
};

Scene.prototype.render = function(g)
{
	g.save();
	
	// go to the origin of the scene, and draw the scene actors from there
    g.translate(0,-this.cameraY);
    g.drawImage(this.backgroundImage,0,0);
    this.actors.render(g);
    this.playerActors.render(g);
    
    g.restore();
};

Scene.CAMERA_SPEED = -40;
Scene.VISIBILITY_OFFSET = 100;
Scene.SCREEN_WIDTH = 800;
Scene.SCREEN_HEIGHT = 600;
Scene.WAIT_BEFORE_RESTART_MS = 4000;
