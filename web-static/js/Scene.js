var Scene = function()
{
	this.actors = new ActorsContainer();
	this.playerActors = new ActorsContainer();
	this.speedY = Scene.CAMERA_SPEED;	
	this.cameraY = Scene.MAX_CAMERA_Y;	
	this.backgroundImage = assetManager.getImage("background");
	
	this.generateEnemies();
};

Scene.prototype.generateEnemies = function()
{
	this.actors.add(new FlyingEnemy1("enemy01",200,200));
	this.actors.add(new FlyingEnemy2("enemy02",300,400));
	this.actors.add(new FlyingEnemy3("enemy03",200,700));
	this.actors.add(new FlyingEnemy1("enemy04",250,700));
	this.actors.add(new FlyingEnemy2("enemy05",300,700));
	this.actors.add(new FlyingEnemy3("enemy06",100,1000));
	this.actors.add(new FlyingEnemy2("enemy07",500,1400));
	this.actors.add(new FlyingEnemy1("enemy08",600,1700));
	this.actors.add(new FlyingEnemy2("enemy09",200,2000));
	this.actors.add(new FlyingEnemy3("enemy10",600,2000));
	this.actors.add(new FlyingEnemy1("enemy11",400,4000));
	this.actors.add(new FlyingEnemy1("enemy12",200,4500));
	this.actors.add(new FlyingEnemy2("enemy13",400,5000));
	this.actors.add(new FlyingEnemy3("enemy14",300,5200));
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
	return actor.isBeforeX(Scene.MIN_X) || actor.isAfterX(Scene.MAX_X);
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
				console.log("Inactive actor " + actor.id + " becomes visible, activation");
				actor.activate();
			}
		}
		else if (actor.state == Actor.State.ACTIVE)
		{
			if (!actorIsVisibleInY)
			{
				console.log("Active actor " + actor.id + " becomes invisible, removal");
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
	if (player.state == Actor.State.ACTIVE)
	{
		this.cameraY += this.speedY * deltaTimeSec;
		this.cameraY = $.clampValue(this.cameraY,Scene.MIN_CAMERA_Y,Scene.MAX_CAMERA_Y);
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

Scene.prototype.update = function(deltaTimeSec)
{
	this.actors.clean();
	this.actors.update(deltaTimeSec);
	
	this.playerActors.clean();
	this.playerActors.update(deltaTimeSec);
	
	this.updateCameraPosition(deltaTimeSec);
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
Scene.SCREEN_WIDTH = 800;
Scene.SCREEN_HEIGHT = 600;
Scene.SCENE_WIDTH = 800;
Scene.SCENE_HEIGHT = 6000;
Scene.MIN_X = 0;
Scene.MAX_X = Scene.SCENE_WIDTH;
Scene.MIN_Y = 0;
Scene.MAX_Y = Scene.SCENE_HEIGHT;
Scene.MIN_CAMERA_Y = 0;
Scene.MAX_CAMERA_Y = Scene.SCENE_HEIGHT - Scene.SCREEN_HEIGHT;
Scene.VISIBILITY_OFFSET = 100;
