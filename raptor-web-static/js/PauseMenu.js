var PauseMenu = function()
{
	this.$screen = $("#screen");
	this.$menu = $("#pause-menu");
	this.$menu.click(function(){ console.log("Clicked on menu"); });
	
	this.$title = $("<div/>").attr("id","pause-menu-title").append("Pause");
	this.$menu.append(this.$title);
	
	this.$block = $("<div/>").attr("id","pause-menu-block");
	this.$menu.append(this.$block);
	
	this.$blockList = $("<ul>");
	this.$block.append(this.$blockList);
	
	this.$restart = $("<li>").attr("id","pause-menu-restart").append("Restart");
	this.$restart.click(function(){ console.log("Clicked on restart"); game.restart(); });
	this.$blockList.append(this.$restart);
};

PauseMenu.prototype.updateState = function(paused)
{
    if(paused)
    {
    	console.log("Open pause menu");
    	this.$screen.addClass("paused");
    	this.$menu.addClass("visible");
    }
    else
    {
    	console.log("Close pause menu");
    	this.$screen.removeClass("paused");
    	this.$menu.removeClass("visible");
    }
};