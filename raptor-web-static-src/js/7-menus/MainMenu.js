var MainMenu = function()
{
	this.music = assetManager.getSound("music-menu");
	
	var items = {
		hello : {
			type : "text",
			captionCallback : function() { return game.sayHello(); }
		},	
		start : {
			type : "option",
			caption : "Launch Level 1",
			clickCallback : function(){ game.launchLevel(1); }
		},
		logout : {
			type : "option",
			caption : "Logout",
			validatorCallback : function() { return game.canLogout(); },
			clickCallback : function(){ game.logout(); }
		}
	};
	
	MenuFrame.call(this,"main-menu",Game.SUBTITLE,items);
	
	this.$menuTitleScreen = $("<div/>").attr("id","menu-title-screen");
	$(".menu").append(this.$menuTitleScreen);
	
	var titleImg = assetManager.getImage("title");
	this.$menuTitleScreen.append(titleImg);
	
	this.$screen = $("#screen");
};

MainMenu.prototype = new MenuFrame();

MainMenu.prototype.updateState = function(showMenu)
{
	MenuFrame.prototype.updateState.call(this,showMenu);
	
    if(showMenu)
    {
    	this.music.playLoop();
    	this.$menuTitleScreen.addClass("visible");
    	this.$screen.addClass("paused");
    }
    else
    {
    	this.music.stop();
    	this.$menuTitleScreen.removeClass("visible");
    	this.$screen.removeClass("paused");
    }
};