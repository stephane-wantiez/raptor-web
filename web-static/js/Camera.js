var Camera = function(scene)
{	
	this.scene = scene;	
	this.y = 0;
	this.speedY = Camera.SPEED;	
	this.decalY = 200;
};

Camera.SPEED = 10;
Camera.SCREEN_WIDTH = 800;
Camera.SCREEN_HEIGHT = 600;
Camera.SCENE_HEIGHT = 6000;
Camera.MIN_Y = -Camera.SCENE_HEIGHT + Camera.SCREEN_HEIGHT;
Camera.MAX_Y = 0;

Camera.prototype.update = function(deltaTimeSec)
{
	/*var newY = -this.speedY * deltaTimeSec + this.decalY;
	newY = $.clampValue(newY,Camera.MIN_Y,Camera.MAX_Y);
	setViewPosition(newY);*/
};

Camera.prototype.setViewPosition = function(y)
{
	//console.log("Moving camera to "+x+","+y + " (was " + this.x + "," + this.y + ")");
	this.y = parseInt(y);
    this.scene.css("top",this.y+"px");
};