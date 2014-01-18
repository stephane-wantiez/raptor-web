var MovingActor = function(id,width,height)
{
	Actor.call(this,id,width,height);
	this.speedX = 0;
	this.speedY = 0;
	this.accelX = 0;
	this.accelY = 0;
	this.minSpeedX = -Infinity;
	this.minSpeedY = -Infinity;
	this.maxSpeedX =  Infinity;
	this.maxSpeedY =  Infinity;
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

MovingActor.prototype.updateSpeed = function(deltaTimeSec)
{
	var newSpeedX = this.speedX + this.accelX * deltaTimeSec;
	var newSpeedY = this.speedY + this.accelY * deltaTimeSec; 
	this.speedX = $.clampValue( newSpeedX, this.minSpeedX, this.maxSpeedX );
	this.speedY = $.clampValue( newSpeedY, this.minSpeedY, this.maxSpeedY );
};

MovingActor.prototype.update = function(deltaTimeSec)
{	
	Actor.prototype.update.call(this,deltaTimeSec);
	
	if (!game.paused && (this.state == Actor.State.ACTIVE))
	{
		this.updatePosition(deltaTimeSec);
	}
};
