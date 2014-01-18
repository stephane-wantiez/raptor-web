var FlyingBoss1 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingBoss1.WIDTH, FlyingBoss1.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "explosion", "explosion2", FlyingBoss1.KILL_SPRITE_WIDTH * FlyingBoss1.KILL_SPRITE_NB_COL, FlyingBoss1.KILL_SPRITE_HEIGHT * FlyingBoss1.KILL_SPRITE_NB_ROW, FlyingBoss1.KILL_SPRITE_NB_COL, FlyingBoss1.KILL_SPRITE_NB_ROW, FlyingBoss1.KILL_SPRITE_FPS, false);
	this.createSpriteWithUrl( "attack"   , "boss1"     , FlyingBoss1.WIDTH             * FlyingBoss1.NB_SPRITES_COL,     FlyingBoss1.HEIGHT             * FlyingBoss1.NB_SPRITES_ROW,     FlyingBoss1.NB_SPRITES_COL,     FlyingBoss1.NB_SPRITES_ROW,     FlyingBoss1.SPRITE_FPS,       true);
	
	this.setSprite("attack");
	this.idleSpriteName = "attack";
	this.deadSpriteName = "explosion";
	
	this.speedX = 0;
	this.speedY = 0;
	this.radius = FlyingBoss1.RADIUS;
	this.health = FlyingBoss1.HEALTH;	
	this.killScore = FlyingBoss1.KILL_SCORE;	
	this.currentShootPos = -1;
};

FlyingBoss1.prototype = new FlyingEnemy();

FlyingBoss1.prototype.checkShoot = function()
{
	this.currentShootPos = ++this.currentShootPos % FlyingBoss1.SHOOT_NB_POS ;
	FlyingEnemy.prototype.checkShoot.call(this);
};

FlyingBoss1.prototype.getShootProb = function()
{
	return FlyingBoss1.SHOOT_PROB;
};

FlyingBoss1.prototype.getShootPosition = function()
{
	return { x : this.x + FlyingBoss1.SHOOT_REL_POS_X[this.currentShootPos], y : this.y + FlyingBoss1.SHOOT_REL_POS_Y[this.currentShootPos] };
};

FlyingBoss1.prototype.createProjectile = function()
{
	return new Bullet( FlyingBoss1.SHOOT_PROJ_SP_Y[this.currentShootPos], FlyingBoss1.SHOOT_PROJ_SP_X[this.currentShootPos] );
};

FlyingBoss1.HEALTH = 1000;
FlyingBoss1.WIDTH = 128;
FlyingBoss1.HEIGHT = 180;
FlyingBoss1.RADIUS = 50;
FlyingBoss1.NB_SPRITES_ROW = 1;
FlyingBoss1.NB_SPRITES_COL = 1;
FlyingBoss1.SPRITE_FPS = 1;
FlyingBoss1.KILL_SPRITE_NB_ROW = 1;
FlyingBoss1.KILL_SPRITE_NB_COL = 6;
FlyingBoss1.KILL_SPRITE_WIDTH  = 65;
FlyingBoss1.KILL_SPRITE_HEIGHT = 65;
FlyingBoss1.KILL_SPRITE_FPS = 10;
FlyingBoss1.SHOOT_PROB = 0.25;
FlyingBoss1.KILL_SCORE = 250;
FlyingBoss1.SHOOT_NB_POS = 5;
FlyingBoss1.SHOOT_REL_POS_X = [  -20,  -20,  20,  20,   0 ];
FlyingBoss1.SHOOT_REL_POS_Y = [  -20,   20,  20, -20,  30 ];
FlyingBoss1.SHOOT_PROJ_SP_X = [ -400, -200, 200, 400,   0 ];
FlyingBoss1.SHOOT_PROJ_SP_Y = [  200,  400, 400, 200, 500 ];
