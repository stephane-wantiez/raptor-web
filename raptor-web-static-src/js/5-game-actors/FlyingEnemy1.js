var FlyingEnemy1 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy1.WIDTH, FlyingEnemy1.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy1", FlyingEnemy1.WIDTH * FlyingEnemy1.NB_SPRITES_COL, FlyingEnemy1.HEIGHT * FlyingEnemy1.NB_SPRITES_ROW, FlyingEnemy1.NB_SPRITES_COL, FlyingEnemy1.NB_SPRITES_ROW, FlyingEnemy1.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
	
	this.speedX = 300 * ( this.isInLeftScreenHalf() ? 1 : -1 );
	this.speedY = 500;
	
	this.killScore = FlyingEnemy1.KILL_SCORE;
};

FlyingEnemy1.prototype = new FlyingEnemy();

FlyingEnemy1.prototype.getShootProb = function()
{
	return FlyingEnemy1.SHOOT_PROB;
};

FlyingEnemy1.WIDTH = 32;
FlyingEnemy1.HEIGHT = 32;
FlyingEnemy1.NB_SPRITES_ROW = 1;
FlyingEnemy1.NB_SPRITES_COL = 3;
FlyingEnemy1.SPRITE_FPS = 20;
FlyingEnemy1.SHOOT_PROB = 0.06;
FlyingEnemy1.KILL_SCORE = 14;
