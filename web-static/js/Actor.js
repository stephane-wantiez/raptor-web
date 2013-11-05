var Actor = function(parent,id)
{
	if(!$.isDefined(parent)) return;	
	this.parent = parent;
	
	this.$elm = $("#"+id);

	this.spriteList = {};
	this.currentSprite = false;
	this.nextSprite = "";	
	this.lastAnimId = "";
	this.idleSpriteName = "";
	this.deadSpriteName = "";
	
	this.minX = 0;
	this.maxX = Infinity;
	this.minY = 0;
	this.maxY = Infinity;
	
	this.width = 0;
	this.height = 0;
	
	this.childActors = new ActorsContainer();
	
	this.isVisible = false;
	
	this.radius = 1;
	this.areCollisionsChecked = true;
	
	this.state = Actor.State.INACTIVE;
	
	this.deathTime = 0;
};

Actor.State = { INACTIVE : 0, ACTIVE : 1, DEAD : 2 };

Actor.prototype = new PositionChanger("Actor");

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

Actor.prototype.getCenterInScene = function()
{
	var centerInScene = this.getPositionInScene();
	centerInScene.x += this.width  / 2 ;
	centerInScene.y += this.height / 2 ;
	return centerInScene;
};

Actor.prototype.isBeforeX = function(x)
{
	return this.x + this.width < x;
};

Actor.prototype.isAfterX = function(x)
{
	return x < this.x ;
};

Actor.prototype.isBeforeY = function(x)
{
	return this.y + this.height < y;
};

Actor.prototype.isAfterY = function(x)
{
	return y < this.y ;
};

Actor.prototype.isLifetimeOver = function()
{
	return ( this.deathTime != 0 ) && ( this.deathTime <= Date.now() );
};

Actor.prototype.isCollidingWith = function(otherActor)
{
	if (!      this.areCollisionsChecked) return false;
	if (!otherActor.areCollisionsChecked) return false;
	
	if (      this.state == Actor.State.DEAD) return false;
	if (otherActor.state == Actor.State.DEAD) return false;
	
	var actorCenterPos = this.getCenterInScene();
	var otherCenterPos = otherActor.getCenterInScene();
	var distSquared = $.getDistanceBetweenPointsSquared(actorCenterPos,otherCenterPos);
	var minDist = this.radius + otherActor.radius;
	var minDistSquared = minDist * minDist;
	
	return distSquared <= minDistSquared;
};

Actor.prototype.checkCollisionWith = function(otherActor)
{
	if (this.isCollidingWith(otherActor))
	{
		this.handleCollisionWith(otherActor);
		otherActor.handleCollisionWith(this);
	};
		
	for (var childActor in this.childActors.list)
	{
		childActor.checkCollisionWith(otherActor);
	}
		
	for (var otherChildActor in otherActor.childActors.list)
	{
		this.checkCollisionWith(otherChildActor);
	}
};

Actor.prototype.handleCollisionWith = function(otherActor)
{};

Actor.prototype.update = function(deltaTimeSec)
{
	this.childActors.clean();
	this.childActors.update(deltaTimeSec);
	
	if (this.isLifetimeOver())
	{
		this.kill();
	}
	else
	{
		this.checkSprite();
	}
};

Actor.prototype.kill = function()
{
	var self = this;
	var setToDead = function(value)
	{
		self.state = Actor.State.DEAD;
	};
	
	if ( this.isVisible && (this.deadSpriteName != ""))
	{
		this.setSprite(this.deadSpriteName, setToDead);
	}
	else
	{
		setToDead(null);
	}
};
