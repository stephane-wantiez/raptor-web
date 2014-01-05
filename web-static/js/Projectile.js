var Projectile = function(id,speedX,speedY,width,height,radius)
{
	MovingActor.call(this, id, width, height);

	if ($.isDefined(speedX)) this.speedX = speedX;
	if ($.isDefined(speedY)) this.speedY = speedY;
	if ($.isDefined(radius)) this.radius = radius;
	
	this.isVisible = true;
	this.state = Actor.State.ACTIVE;
};

Projectile.prototype = new MovingActor();

Projectile.prototype.getDamage = function()
{
	return 0;
};

Projectile.prototype.handleCollisionWith = function(otherActor)
{
	otherActor.damage(this.getDamage());
	this.kill();
};
