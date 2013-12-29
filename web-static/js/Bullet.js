var Bullet = function()
{
	MovingActor.call(this, "bullet_" + game.currentFrameTimeMs, Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT);

	this.speedY = Bullet.SPEED_Y;
	this.isVisible = true;
	this.state = Actor.State.ACTIVE;

	/*this.spriteList = {
		"bullet": new Sprite(this.$elm, "bullet", "/raptor-web-static/img/sprite_bullet.bmp", Bullet.SPRITE_NB*Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.SPRITE_NB, 1, 20, true)
	};*/
	
	
	this.createSpriteWithUrl("bullet", "bullet", Bullet.SPRITE_NB*Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.SPRITE_NB, 1, 20, true);
	
	this.setSprite("bullet");
	this.idleSpriteName = "bullet";
};

Bullet.prototype = new MovingActor();

Bullet.SPEED_Y = -800;
Bullet.SHOOT_WAIT_TIME_MSEC = 20;
Bullet.SPRITE_WIDTH = 1;
Bullet.SPRITE_HEIGHT = 4;
Bullet.SPRITE_NB = 1; 
