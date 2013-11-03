var Character = function(parent,id)
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
};

Character.prototype = new PositionChanger("character");

Character.prototype.setSprite = function(anim, onComplete)
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

Character.prototype.moveTo = function(x, y)
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

Character.prototype.move = function(x, y)
{
	this.moveTo(this.x + x, this.y + y);
};
