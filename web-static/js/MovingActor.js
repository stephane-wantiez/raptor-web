var MovingActor = function(id,width,height)
{
	Actor.call(this,id,width,height);
	this.speedX = 0;
	this.speedY = 0;
};

MovingActor.prototype = new Actor();

MovingActor.prototype.setSpeed = function(speedX,speedY)
{
	this.speedX = speedX;
	this.speedY = speedY;
};

MovingActor.prototype.updatePosition = function(deltaTimeSec)
{
	var deltaX = this.speedX * deltaTimeSec ;
	var deltaY = this.speedY * deltaTimeSec ;
	this.move(deltaX,deltaY);
};

MovingActor.prototype.update = function(deltaTimeSec)
{	
	Actor.prototype.update.call(this,deltaTimeSec);
	
	if (!game.paused && (this.state == Actor.State.ACTIVE))
	{
		this.updatePosition(deltaTimeSec);
	}
};
