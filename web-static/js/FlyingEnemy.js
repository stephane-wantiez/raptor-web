var FlyingEnemy = function(id,width,height,x,y)
{
	MovingActor.call(this,id,width,height);
	
	this.speedY = 500;
	this.setPosition(x,y);
};

FlyingEnemy.SHOOT_PROB = 0.05;
FlyingEnemy.SHOOT_SPEED = 1000;
FlyingEnemy.SHOOT_REL_POS_Y = 20;

FlyingEnemy.prototype = new MovingActor();

FlyingEnemy.prototype.update = function(deltaTimeSec)
{	
	MovingActor.prototype.update.call(this,deltaTimeSec);
	
	if (!game.paused && (this.state == Actor.State.ACTIVE))
	{
		this.checkShoot();
	}
};

FlyingEnemy.prototype.checkShoot = function()
{
	if (this.canShoot())
	{
		this.doShoot();
	}
};

FlyingEnemy.prototype.getShootProb = function()
{
	return FlyingEnemy.SHOOT_PROB;
};

FlyingEnemy.prototype.canShoot = function()
{
	return Math.random() < this.getShootProb();
};

FlyingEnemy.prototype.createProjectile = function()
{
	return new Bullet(FlyingEnemy.SHOOT_SPEED);
};

FlyingEnemy.prototype.doShoot = function()
{
	var projectile = this.createProjectile();
	projectile.setPosition( this.x, this.y + FlyingEnemy.SHOOT_REL_POS_Y );
	scene.actors.add(projectile);
};
