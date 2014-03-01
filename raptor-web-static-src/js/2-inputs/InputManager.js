var InputManager = function()
{
	var self = this;
	
	this.playerControlsEnabled = true;
	this.mouseEnabled = true;
	
    $(document).keyup(function(e){ self.onKeyUp(e.which);});
    $(document).keydown(function(e){ lastKeyEvent = e; self.onKeyDown(e.which);});
    $(document).mousemove(function(e){ lastMouseEvent = e; self.onMouseMove(e.pageX,e.pageY);});
    $(document).mousedown(function(e){ lastMouseEvent = e; self.onMouseDown(e.which);});
    $(document).mouseup(function(e){ lastMouseEvent = e; self.onMouseUp(e.which);});

	this.keyList = {};
	this.mouseClicked = {};
	this.mouseMoved = false;
	this.mouseX = this.x;
	this.mouseY = this.y;
	
	this.canvasLeftX = 0;
	this.canvasTopY = 0;
	
	this.pauseKeysListeners = [];
};

InputManager.prototype.setCanvasLeftX = function(value)
{
	this.canvasLeftX = value;
};

InputManager.prototype.setCanvasTopY = function(value)
{
	this.canvasTopY = value;
};

InputManager.prototype.addPauseKeysListener = function(callback)
{
	this.pauseKeysListeners.push(callback);
};

InputManager.prototype.firePauseKeysEvent = function()
{
	for(var listenerIndex in this.pauseKeysListeners)
	{
		this.pauseKeysListeners[listenerIndex]();
	}
};

InputManager.prototype.onKeyDown = function(k)
{
    this.keyList[k] = true;
    this.checkSpecialKeys();
};

InputManager.prototype.onKeyUp = function(k)
{
    this.keyList[k] = false;
    this.checkSpecialKeys();
};

InputManager.prototype.isKeyDown = function(k)
{
    return this.keyList[k];
};

InputManager.prototype.onMouseMove = function(x,y)
{
	this.mouseX = x - this.canvasLeftX;
	this.mouseY = y - this.canvasTopY;
};

InputManager.prototype.onMouseDown = function(button)
{
	this.mouseClicked[button] = true;
};

InputManager.prototype.onMouseUp = function(button)
{
	this.mouseClicked[button] = false;
};

InputManager.prototype.isMouseDown = function(button)
{
    return this.mouseClicked[button];
};

InputManager.prototype.checkSpecialKeys = function()
{
	if ( this.isKeyDown(InputManager.ESC_KEY_CODE) || this.isKeyDown(InputManager.PAUSE_KEY_CODE) || this.isKeyDown(InputManager.P_KEY_CODE) )
	{
		this.firePauseKeysEvent();
	}
};

InputManager.ESC_KEY_CODE = 27;
InputManager.PAUSE_KEY_CODE = 19;
InputManager.P_KEY_CODE = 80;

inputManager = new InputManager();

