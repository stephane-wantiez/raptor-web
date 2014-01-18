var Sprite = function(id, img, width, height, colCount, rowCount, frameRate, loop)
{
	this.id = id;
	this.img = img;
	this.loop = loop;
	this.rowCount = rowCount;
	this.colCount = colCount;
	this.frameCount = this.rowCount * this.colCount;
	this.currentFrame = 0;
	this.setFrameRate(frameRate);
	this.invert = false;
	this.invertAnim = false;
    this.revertDirection = false;
	this.scale = 1;
	this.lastUpdateTime = 0;
	this.imgWidth = width;
	this.imgHeight = height;
	this.onAnimationComplete = false;
	this.completed = false;
	this.width = Math.round(this.imgWidth / this.colCount);
	this.height = Math.round(this.imgHeight / this.rowCount);
	this.centerX = parseInt(this.width/2);
	this.centerY = parseInt(this.height/2);
};

Sprite.prototype.setRevertDirection = function(v)
{
    this.revertDirection = v;
};

Sprite.prototype.setCenter = function(x, y)
{
	this.centerX = x;
	this.centerY = y;
};

Sprite.prototype.setFrameRate = function(frameRate)
{
	this.frameRate = frameRate;
	this.frameDuration = 1.0 / this.frameRate * 1000;
};

Sprite.prototype.setScale = function(scale)
{
	this.scale = scale;
};

Sprite.prototype.show = function(type, options)
{
	if(this.loop)
	{
		this.currentFrame = 0;
		this.play();
	}
};

Sprite.prototype.hide = function(hideType)
{
	this.stop();
};

Sprite.prototype.play = function(onComplete)
{
	var _this = this;
	if(this.player) clearTimeout(this.player);
	var frameDuration = this.frameDuration;
	if(this.character && this.character.slowMotion)
	{
		frameDuration = Math.round(frameDuration * 1.5);
	}
	this.player = setTimeout(function()
	{
		_this.nextFrame();
		if(_this.loop || _this.currentFrame < _this.frameCount - 1)
		{
			_this.play(onComplete);
		}
		else if((typeof onComplete) == "function")
		{
			onComplete(_this);
		}
	}, frameDuration);
};

Sprite.prototype.resetAnim = function()
{
	this.stop();
	this.currentFrame = 0;
	this.completed = false;
};

Sprite.prototype.stop = function()
{
	if(this.player)
	{
		clearTimeout(this.player);
		this.player = false;
	}
};

Sprite.prototype.nextFrame = function(frames)
{
	if(!frames) frames = 1;
	this.currentFrame = this.currentFrame + frames;
	if(this.currentFrame >= this.frameCount)
	{
		if(this.loop)
		{
			this.currentFrame %= this.frameCount;
		}
		else
		{
			this.currentFrame = this.frameCount - 1;
		}
	}
	if(this.currentFrame == this.frameCount - 1 && !this.loop && this.onAnimationComplete)
	{
		this.onAnimationComplete(this);
		this.onAnimationComplete = false;
		this.completed = true;
	}
};

Sprite.prototype.render = function(g)
{
	g.save();

    var frame = this.invertAnim ? ( this.frameCount - this.currentFrame - 1 ) : this.currentFrame;
    
    var currentCol = frame % this.colCount ;
    var currentRow = Math.floor( frame / this.colCount ) ;
    
    if(this.invert)
    {
        currentCol = this.colCount - currentCol - 1 ;
        currentRow = this.rowCount - currentRow - 1 ;
    }
    
    var sx = Math.round( this.width  * currentCol );
    var sy = Math.round( this.height * currentRow );
    
    var currentScaleX = this.scale * ( this.revertDirection ? -1 : 1 );
    g.scale(currentScaleX,this.scale);
    
    g.drawImage( this.img, sx, sy, this.width, this.height, -this.centerX, -this.centerY, this.width, this.height );
    
    g.restore();    
};