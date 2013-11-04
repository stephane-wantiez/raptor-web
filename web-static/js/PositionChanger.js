var PositionChanger = function(className)
{	
	this.x = 0;
	this.y = 0;
	this.$elm = $("<div>").addClass(className);
	this.positionListenerList = [];
};

PositionChanger.prototype.addPositionListener = function(listener)
{
	this.positionListenerList.push(listener);
};

PositionChanger.prototype.firePositionChange = function()
{
    for(var listenerIndex in this.positionListenerList){
        this.positionListenerList[listenerIndex](this.x,this.y);
    }
};

PositionChanger.prototype.getPosition = function()
{
	return { x: this.x, y: this.y };
};

PositionChanger.prototype.setPosition = function(x, y)
{
    this.x = parseInt(x);
    this.y = parseInt(y);
	this.$elm.css({left:this.x+"px",top:this.y+"px"});
    this.firePositionChange();
};
