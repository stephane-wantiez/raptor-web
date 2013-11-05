var Scene = function(player)
{
	this.player = player;
	this.actors = new ActorsContainer();
	this.$scene = $("#scene");
	this.speedY = Scene.CAMERA_SPEED;	
	this.cameraY = Scene.MAX_CAMERA_Y;
	
	//this.backgroundImage = "/raptor-web-static/img/background-ocean.png";
};

Scene.prototype.checkCollisionsBetweenActorsAnd = function(actor)
{
	for (var otherActor in this.actors.list)
	{
		actor.checkCollisionWith(otherActor);
	}
};

Scene.prototype.checkActorPosition = function(actor)
{
	if (actor.isBeforeX(Scene.MIN_X) || actor.isAfterX(Scene.MAX_X) || actor.isAfterY(Scene.MAX_CAMERA_Y))
	{
		// actor is out of limits
		actor.kill();
	}
};

Scene.prototype.checkActorsPosition = function()
{
	for (var actor in this.actors.list)
	{
		this.checkActorPosition(actor);
	}
};

Scene.prototype.getCameraPosition = function()
{
	return this.cameraY;
};

Scene.prototype.updateCameraPosition = function(deltaTimeSec)
{
	this.cameraY -= this.speedY * deltaTimeSec;
	this.cameraY = $.clampValue(this.cameraY,Scene.MIN_CAMERA_Y,Scene.MAX_CAMERA_Y);
	this.shitSceneForCamera();
};

Scene.prototype.shitSceneForCamera = function()
{
	this.$scene.css("top",-this.cameraY+"px");
};

Scene.prototype.getMinVisibleY = function()
{
	return this.cameraY - Scene.VISIBILITY_OFFSET;
};

Scene.prototype.getMaxVisibleY = function()
{
	return this.cameraY + Scene.SCREEN_HEIGHT + Scene.VISIBILITY_OFFSET;
};

Scene.prototype.update = function(deltaTimeSec)
{
	this.actors.clean();
	this.actors.update(deltaTimeSec);
	
	this.updateCameraPosition(deltaTimeSec);
	this.checkCollisionsBetweenActorsAnd(this.player);
	this.checkActorsPosition();
	
	//console.log("Camera Y: " + this.cameraY);
};

Scene.CAMERA_SPEED = 40;
Scene.SCREEN_WIDTH = 800;
Scene.SCREEN_HEIGHT = 600;
Scene.SCENE_WIDTH = 800;
Scene.SCENE_HEIGHT = 6000;
Scene.MIN_CAMERA_Y = 0;
Scene.MAX_CAMERA_Y = Scene.SCENE_HEIGHT - Scene.SCREEN_HEIGHT;
Scene.VISIBILITY_OFFSET = 100;
