var FlyingEnemy = function(id,width,height,x,y)
{
	MovingActor.call(this,id,width,height);
	
	this.speedY = 500;
	this.setPosition(x,y);
};

FlyingEnemy.prototype = new MovingActor();

/*FlyingEnemy.prototype.handleCollisionWith = function(otherActor)
{
	if (typeof(otherActor) == "Bullet")
	{
		console.log("Enemy " + id + " hit by bullet");
		this.handleCollisionWithBullet(otherActor);
	}
	else if (typeof(otherActor) == "Player")
	{
		console.log("Enemy " + id + " crashed with player");
		this.handleCollisionWithPlayer(otherActor);
	}
};

FlyingEnemy.prototype.handleCollisionWithBullet = function(bullet)
{
	this.damage(bullet.getDamage());
	bullet.kill();
};

FlyingEnemy.prototype.handleCollisionWithPlayer = function(player)
{
	this.damage(player.getCollisionDamage());
	player.collidedWithEnemy();
};*/

/*FlyingEnemy.prototype.update = function(deltaTimeSec)
{	
	MovingActor.prototype.update.call(this,deltaTimeSec);
	
	if (!game.paused && (this.state == Actor.State.ACTIVE))
	{
		this.updatePosition(deltaTimeSec);
	}
};*/
