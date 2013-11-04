var Actor = function(parent,id)
{
	if(!$.isDefined(parent)) return;	
	this.parent = parent;
	
	this.$elm = $("#"+id);

	this.spriteList = {};
	this.currentSprite = false;
	
	this.minX = 0;
	this.maxX = Infinity;
	this.minY = 0;
	this.maxY = Infinity;
	
	this.width = 0;
	this.height = 0;
	
	this.radius = 1;
	this.areCollisionsChecked = true;
	
	this.state = Actor.State.INACTIVE;
};

Actor.State = { INACTIVE : 0, ACTIVE : 1, DEAD : 2 };

Actor.prototype = new PositionChanger("Actor");

Actor.prototype.setSprite = function(anim, onComplete)
{
	this.lastAnimId = anim;
	var spriteId = anim;
	
	if(this.currentSprite != this.spriteList[spriteId])
	{
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.currentFrame == this.currentSprite.frameCount - 1)
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

Actor.prototype.isCollidingWith = function(otherActor)
{
	var actorCenterPos = this.getCenterInScene();
	var otherCenterPos = otherActor.getCenterInScene();
	var distSquared = $.getDistanceBetweenPointsSquared(actorCenterPos,otherCenterPos);
	return distSquared <= ( this.radius * this.radius );
};
