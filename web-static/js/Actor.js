var Actor = function(parent,id,className)
{
	if(!$.isDefined(parent)) return;	
	this.parent = parent;
	
	this.id = id;
	
	this.$elm = $("#"+this.id);
	
	if(this.$elm.length == 0)
	{
		this.$elm = $("<div>");
		this.$elm.attr("id",this.id);
		this.parent.append(this.$elm);
	};
	
	if($.isDefined(className)) this.$elm.addClass(className); 

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
	
	this.width = 0;
	this.height = 0;
	
	this.isVisible = false;
	
	this.radius = 1;
	this.areCollisionsChecked = true;
	
	this.state = Actor.State.INACTIVE;
	
	this.deathTime = 0;
};

Actor.State = { INACTIVE : 0, ACTIVE : 1, DEAD : 2 };

Actor.prototype = new PositionChanger("Actor");

Actor.prototype.setScene = function(scene)
{
	this.scene = scene;
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
	return ( this.deathTime != 0 ) && ( this.deathTime <= Date.now() );
};

Actor.prototype.checkLifetime = function()
{
	if ((this.state == Actor.State.ACTIVE) && this.isLifetimeOver())
	{
		this.remove();
	}
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
};

Actor.prototype.handleCollisionWith = function(otherActor)
{};

Actor.prototype.update = function(deltaTimeSec)
{	
	if (this.state == Actor.State.ACTIVE)
	{
		this.checkLifetime();
		this.checkSprite();
	}
};

Actor.prototype.activate = function()
{
	//console.log("Activating actor");
	this.state = Actor.State.ACTIVE;
};

Actor.prototype.kill = function()
{
	//console.log("Killing actor");
	var self = this;
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
	this.state = Actor.State.DEAD;
	this.isVisible = false;
	this.$elm.remove();
};
