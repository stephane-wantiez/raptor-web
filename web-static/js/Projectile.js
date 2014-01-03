var Projectile = function(id,speed,width,height,radius)
{
	MovingActor.call(this, id, width, height);

	this.speedY = speed;
	this.isVisible = true;
	this.state = Actor.State.ACTIVE;
	this.radius = radius;
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
