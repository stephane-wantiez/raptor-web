var Scene = function(player)
{
	this.player = player;
	this.actors = new ActorsContainer();
	this.speedY = Scene.CAMERA_SPEED;	
	this.cameraY = Scene.MAX_CAMERA_Y;	
	this.backgroundImage = assetManager.getImage("background");
};

Scene.prototype.checkCollisionsBetweenActorsAnd = function(actor)
{
	for (var otherActorId in this.actors.list)
	{
		var otherActor = this.actors.list[otherActorId];
		actor.checkCollisionWith(otherActor);
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
				//console.log("Inactive actor becomes visible, activation");
				actor.activate();
			}
		}
		else if (actor.state == Actor.State.ACTIVE)
		{
			if (!actorIsVisibleInY)
			{
				//console.log("Active actor becomes invisible, removal");
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
};

Scene.prototype.getCameraPosition = function()
{
	return this.cameraY;
};

Scene.prototype.updateCameraPosition = function(deltaTimeSec)
{
	this.cameraY += this.speedY * deltaTimeSec;
	this.cameraY = $.clampValue(this.cameraY,Scene.MIN_CAMERA_Y,Scene.MAX_CAMERA_Y);
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
	
	this.updateCameraPosition(deltaTimeSec);
	this.checkCollisionsBetweenActorsAnd(this.player);
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
