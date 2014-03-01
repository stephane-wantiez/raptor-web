var Projectile = function(id,speedX,speedY,width,height,radius)
{
	MovingActor.call(this, id, width, height);

	if ($.isDefined(speedX)) this.speedX = speedX;
	if ($.isDefined(speedY)) this.speedY = speedY;
	if ($.isDefined(radius)) this.radius = radius;
	
	this.isVisible = true;
	this.state = Actor.State.ACTIVE;
	this.health = 1;
};

Projectile.prototype = new MovingActor();
