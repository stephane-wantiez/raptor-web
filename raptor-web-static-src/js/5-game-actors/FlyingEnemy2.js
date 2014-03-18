var FlyingEnemy2 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy2.WIDTH, FlyingEnemy2.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy2", FlyingEnemy2.WIDTH * FlyingEnemy2.NB_SPRITES_COL, FlyingEnemy2.HEIGHT * FlyingEnemy2.NB_SPRITES_ROW, FlyingEnemy2.NB_SPRITES_COL, FlyingEnemy2.NB_SPRITES_ROW, FlyingEnemy2.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
};

FlyingEnemy2.prototype = new FlyingEnemy();

FlyingEnemy2.WIDTH = 32;
FlyingEnemy2.HEIGHT = 32;
FlyingEnemy2.NB_SPRITES_ROW = 1;
FlyingEnemy2.NB_SPRITES_COL = 3;
FlyingEnemy2.SPRITE_FPS = 20;
