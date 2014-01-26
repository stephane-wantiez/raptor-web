var Actor = function(id,width,height)
{
	this.id = id;
	
	this.creationTimeMs = Date.now();

	this.spriteList = {};
	this.currentSprite = false;
	this.nextSprite = "";	
	this.lastAnimId = "";
	this.idleSpriteName = "";
	this.deadSpriteName = "";
	
	this.minX = -Infinity;
	this.maxX = Infinity;
	this.minY = -Infinity;
	this.maxY = Infinity;
	
	this.width = width;
	this.height = height;
	
	this.isVisible = false;
	
	this.radius = $.meanValue(width/2,height/2);
	this.areCollisionsChecked = true;
	
	this.state = Actor.State.INACTIVE;
	this.health = 100;
	this.lifeTimeSec = 0;
	this.deathPeriodSec = 0;
	
	this.collisionDamage = 0;
	this.collisionSound = false;
	
	this.killSound = false;
	this.killScore = 0;
};

Actor.State = { INACTIVE : 0, ACTIVE : 1, DYING : 2, DEAD : 3 };

Actor.prototype = new PositionChanger("Actor");

Actor.prototype.reset = function()
{
	if (this.idleSpriteName != "")
	{
		this.currentSprite = false;
		this.setSprite(this.idleSpriteName);
	}
	this.activate();
};

Actor.prototype.createSprite = function(id,img,width,height,colCount,rowCount,frameRate,loop)
{
    this.spriteList[id] = new Sprite(id,img,width,height,colCount,rowCount,frameRate,loop);
};

Actor.prototype.createSpriteWithUrl = function(id,url,width,height,colCount,rowCount,frameRate,loop)
{
	var img = assetManager.getImage(url);
    this.createSprite(id,img,width,height,colCount,rowCount,frameRate,loop);
};

Actor.prototype.setSprite = function(anim, onComplete)
{
	this.lastAnimId = anim;
	var spriteId = anim;
	
	if(this.currentSprite != this.spriteList[spriteId])
	{
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.completed)
		{
			if(this.currentSprite)
			{
				this.currentSprite.stop();
				this.currentSprite.hide();
			}
			this.currentSprite = this.spriteList[spriteId];
			this.currentSprite.resetAnim();
			this.currentSprite.play(onComplete);
			this.currentSprite.show();
        }
		else
		{
            this.nextSprite = anim;
        }
	}
};

Actor.prototype.checkSprite = function()
{
	if (this.state == Actor.State.ACTIVE)
	{
		if (!this.currentSprite || this.currentSprite.completed)
		{
			if (this.nextSprite != "")
			{
				this.setSprite(this.nextSprite);
			}
			else if (this.idleSpriteName != "")
			{
				this.setSprite(this.idleSpriteName);
			}
		}
	}
};

Actor.prototype.moveTo = function(x, y)
{
	if ((this.x == x) && (this.y == y)) return;
	
	x = $.clampValue(x,this.minX,this.maxX);
	y = $.clampValue(y,this.minY,this.maxY);
	
	var self = this;
	if(this.animHandler)
	{
		this.animHandler.stop(false, false);
	}
	this.animHandler = $.ease({
		x: this.x,
		y: this.y
	}, {
		x: x, 
		y: y
	}, function(o){
		self.setPosition(o.x, o.y);
	},
	{
		easing: "easeOutCirc",
		duration: 300
	});
};

Actor.prototype.move = function(x, y)
{
	this.moveTo(this.x + x, this.y + y);
};

Actor.prototype.getPositionInScene = function()
{
	return this.getPosition();
};

Actor.prototype.isInLeftScreenHalf = function()
{
	return this.isBeforeX(Scene.SCREEN_WIDTH/2);
};

Actor.prototype.isBeforeX = function(x)
{
	return this.x + this.width < x;
};

Actor.prototype.isAfterX = function(x)
{
	return x < this.x ;
};

Actor.prototype.isBeforeY = function(y)
{
	return this.y + this.height < y;
};

Actor.prototype.isAfterY = function(y)
{
	return y < this.y ;
};

Actor.prototype.isLifetimeOver = function()
{
	return ( this.deathPeriodSec != 0 ) && ( this.lifeTimeSec >= this.deathPeriodSec );
};

Actor.prototype.checkLifetime = function()
{
	if ((this.state == Actor.State.ACTIVE) && this.isLifetimeOver())
	{
		this.remove();
	}
};

Actor.prototype.setHealth = function(value)
{
	this.health = value;
};

Actor.prototype.getCollisionDamage = function()
{
	return this.collisionDamage;
};

Actor.prototype.damage = function(damage)
{
	this.setHealth(this.health-damage);
	
	if (this.health <= 0)
	{
		this.kill();
	}
};

Actor.prototype.isCollidingWith = function(otherActor)
{
	if (!      this.areCollisionsChecked) return false;
	if (!otherActor.areCollisionsChecked) return false;
	
	if (      this.state == Actor.State.DEAD) return false;
	if (otherActor.state == Actor.State.DEAD) return false;
	
	var actorPos = this.getPositionInScene();
	var otherPos = otherActor.getPositionInScene();
	var distSquared = $.getDistanceBetweenPointsSquared(actorPos,otherPos);
	var minDist = this.radius + otherActor.radius;
	var minDistSquared = minDist * minDist;
	
	//console.log("Checking collision between actor " + this.id + " and " + otherActor.id + " - distSquared=" + distSquared + " - minDistSquared=" + minDistSquared + " - radius= " + this.radius + " & " + otherActor.radius);
	
	return distSquared <= minDistSquared;
};

Actor.prototype.checkCollisionWith = function(otherActor)
{
	if (this.isCollidingWith(otherActor))
	{
		//console.log("Actor " + this.id + " is colliding with actor " + otherActor.id);
		this.handleCollisionWith(otherActor);
		otherActor.handleCollisionWith(this);
	};
};

Actor.prototype.handleCollisionWith = function(otherActor)
{
	this.damage(otherActor.getCollisionDamage());	
	if (this.collisionSound) this.collisionSound.play();
};

Actor.prototype.doUpdate = function(deltaTimeSec)
{	
	if (this.state == Actor.State.ACTIVE)
	{
		this.checkLifetime();
	}
	if (this.isVisible)
	{
		this.checkSprite();
	}
};

Actor.prototype.canUpdate = function()
{
	return !game.paused && scene.loaded;
};

Actor.prototype.update = function(deltaTimeSec)
{
	if (this.canUpdate())
	{
		this.lifeTimeSec += deltaTimeSec;
		this.doUpdate(deltaTimeSec);
	}
};

Actor.prototype.canRender = function()
{
	return $.isDefined(this.currentSprite);
};

Actor.prototype.doRender = function(g)
{
	this.currentSprite.render(g);
};

Actor.prototype.render = function(g)
{
    if(this.isVisible && this.canRender())
    {
        g.save();
        g.translate(this.x,this.y);
        
        this.doRender(g);
        
        g.restore();
    }
};

Actor.prototype.activate = function()
{
	//console.log("Activating actor " + this.id);
	this.state = Actor.State.ACTIVE;
	this.isVisible = true;
	this.lifeTimeSec = 0;
};

Actor.prototype.kill = function()
{
	//console.log("Killing actor " + this.id);
	var self = this;
	
	this.state = Actor.State.DYING;
	
	if (this.killSound) this.killSound.play();
	
	if (this.killScore > 0)
	{
		player.addScore(this.killScore);
		scene.actors.add(new ScoreFeedback(this, "+" + this.killScore )); 
	}
	
	var doRemove = function(value){ self.remove(); };
	
	if ( this.isVisible && (this.deadSpriteName != ""))
	{
		this.setSprite(this.deadSpriteName, doRemove);
	}
	else
	{
		doRemove(null);
	}
};

Actor.prototype.remove = function()
{
	//console.log("Removing actor");
	this.isVisible = false;
	this.state = Actor.State.DEAD;
};
