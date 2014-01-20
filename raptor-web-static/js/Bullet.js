var Bullet = function(speedY,speedX)
{
	Projectile.call( this, "bullet_" + game.currentFrameTimeMs, speedX, speedY, Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.RADIUS );
	
	this.createSpriteWithUrl("bullet", "bullet", Bullet.SPRITE_NB*Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.SPRITE_NB, 1, 20, true);
	
	this.setSprite("bullet");
	this.idleSpriteName = "bullet";
	
	this.collisionDamage = Bullet.DAMAGE;
	this.collisionSound = assetManager.getSound("bullet_hit");
};

Bullet.prototype = new Projectile();

Bullet.SPRITE_WIDTH = 1;
Bullet.SPRITE_HEIGHT = 4;
Bullet.SPRITE_NB = 1;
Bullet.RADIUS = 2;
Bullet.DAMAGE = 5;
