var Bullet = function(speed)
{
	Projectile.call( this, "bullet_" + game.currentFrameTimeMs, speed, Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.RADIUS );
	
	this.bulletHitSound = assetManager.getSound("bullet_hit");
	
	this.createSpriteWithUrl("bullet", "bullet", Bullet.SPRITE_NB*Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.SPRITE_NB, 1, 20, true);
	
	this.setSprite("bullet");
	this.idleSpriteName = "bullet";
};

Bullet.prototype = new Projectile();

Bullet.prototype.getDamage = function()
{
	return Bullet.DAMAGE;
};

Bullet.prototype.handleCollisionWith = function(otherActor)
{
	Projectile.prototype.handleCollisionWith.call(this,otherActor);
	this.bulletHitSound.play();
};

Bullet.SPRITE_WIDTH = 1;
Bullet.SPRITE_HEIGHT = 4;
Bullet.SPRITE_NB = 1;
Bullet.RADIUS = 2;
Bullet.DAMAGE = 5;
