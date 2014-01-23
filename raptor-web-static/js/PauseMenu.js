var PauseMenu = function()
{
	var items = {
		resume : {
			type : "option",
			caption : "Resume",
			clickCallback : function(){ game.switchPaused(); }
		},
		restart : {
			type : "option",
			caption : "Restart",
			clickCallback : function(){ game.restart(); }
		}
	};
	
	MenuFrame.call(this,"pause-menu","Pause",items);
	this.$screen = $("#screen");
};

PauseMenu.prototype = new MenuFrame();

PauseMenu.prototype.updateState = function(paused)
{
	MenuFrame.prototype.updateState.call(this,paused);
	
    if(paused)
    {
    	this.$screen.addClass("paused");
    }
    else
    {
    	this.$screen.removeClass("paused");
    }
};