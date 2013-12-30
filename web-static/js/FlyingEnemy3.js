var FlyingEnemy3 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy3.WIDTH, FlyingEnemy3.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy3", FlyingEnemy3.WIDTH * FlyingEnemy3.NB_SPRITES_COL, FlyingEnemy3.HEIGHT * FlyingEnemy3.NB_SPRITES_ROW, FlyingEnemy3.NB_SPRITES_COL, FlyingEnemy3.NB_SPRITES_ROW, FlyingEnemy3.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
};

FlyingEnemy3.prototype = new FlyingEnemy();

FlyingEnemy3.WIDTH = 32;
FlyingEnemy3.HEIGHT = 32;
FlyingEnemy3.NB_SPRITES_ROW = 1;
FlyingEnemy3.NB_SPRITES_COL = 3;
FlyingEnemy3.SPRITE_FPS = 20;
