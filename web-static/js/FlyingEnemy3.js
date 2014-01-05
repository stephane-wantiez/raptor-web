var FlyingEnemy3 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy3.WIDTH, FlyingEnemy3.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy3", FlyingEnemy3.WIDTH * FlyingEnemy3.NB_SPRITES_COL, FlyingEnemy3.HEIGHT * FlyingEnemy3.NB_SPRITES_ROW, FlyingEnemy3.NB_SPRITES_COL, FlyingEnemy3.NB_SPRITES_ROW, FlyingEnemy3.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
	
	this.killScore = FlyingEnemy3.KILL_SCORE;
	
	this.speedY = 800;
};

FlyingEnemy3.prototype = new FlyingEnemy();

FlyingEnemy3.prototype.getShootProb = function()
{
	return FlyingEnemy3.SHOOT_PROB;
};

FlyingEnemy3.WIDTH = 32;
FlyingEnemy3.HEIGHT = 32;
FlyingEnemy3.NB_SPRITES_ROW = 1;
FlyingEnemy3.NB_SPRITES_COL = 3;
FlyingEnemy3.SPRITE_FPS = 20;
FlyingEnemy3.SHOOT_PROB = 0.1;
FlyingEnemy3.KILL_SCORE = 45;
