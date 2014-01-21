var PauseMenu = function()
{
	this.$screen = $("#screen");
	
	this.$menu = $(".menu");
	
	this.$pauseMenu = $("<div/>").attr("id","pause-menu");
	this.$menu.append(this.$pauseMenu);
	
	this.$title = $("<div/>").attr("id","pause-menu-title").append("Pause");
	this.$pauseMenu.append(this.$title);
	
	this.$resume = $("<div/>").addClass("pause-menu-option").attr("id","pause-menu-resume").append("Resume");
	this.$resume.click(function(){ game.switchPaused(); });
	this.$pauseMenu.append(this.$resume);
	
	this.$restart = $("<div/>").addClass("pause-menu-option").attr("id","pause-menu-restart").append("Restart");
	this.$restart.click(function(){ game.restart(); });
	this.$pauseMenu.append(this.$restart);
};

PauseMenu.prototype.updateState = function(paused)
{
    if(paused)
    {
    	console.log("Open pause menu");
    	this.$screen.addClass("paused");
    	this.$pauseMenu.addClass("visible");
    }
    else
    {
    	console.log("Close pause menu");
    	this.$screen.removeClass("paused");
    	this.$pauseMenu.removeClass("visible");
    }
};