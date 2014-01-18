var FlyingEnemy = function(id,width,height,x,y)
{
	MovingActor.call(this,id,width,height);
	
	this.speedY = 500;
	this.setPosition(x,y);

	this.killSound = assetManager.getSound("explosion");
	
	this.createSpriteWithUrl( "explosion", "explosion1", FlyingEnemy.KILL_SPRITE_WIDTH * FlyingEnemy.KILL_SPRITE_NB_COL, FlyingEnemy.KILL_SPRITE_HEIGHT * FlyingEnemy.KILL_SPRITE_NB_ROW, FlyingEnemy.KILL_SPRITE_NB_COL, FlyingEnemy.KILL_SPRITE_NB_ROW, FlyingEnemy.KILL_SPRITE_FPS, false);
	this.deadSpriteName = "explosion";
	
	this.killScore = FlyingEnemy.KILL_SCORE;
};

FlyingEnemy.SHOOT_PROB = 0.05;
FlyingEnemy.SHOOT_SPEED = 1000;
FlyingEnemy.SHOOT_REL_POS_Y = 20;
FlyingEnemy.KILL_SPRITE_NB_ROW = 1;
FlyingEnemy.KILL_SPRITE_NB_COL = 6;
FlyingEnemy.KILL_SPRITE_WIDTH  = 32;
FlyingEnemy.KILL_SPRITE_HEIGHT = 32;
FlyingEnemy.KILL_SPRITE_FPS = 10;
FlyingEnemy.KILL_SCORE = 20;

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

FlyingEnemy.prototype.getShootPosition = function()
{
	return { x : this.x, y : this.y + FlyingEnemy.SHOOT_REL_POS_Y };
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
	var shootPos = this.getShootPosition();
	projectile.setPosition( shootPos.x, shootPos.y );
	scene.actors.add(projectile);
};
