var Game = function()
{
	var self = this;
	
	this.state = 0; // Loading
	this.timeAtStartupMs = Date.now();
	this.currentFrameTimeMs = this.timeAtStartupMs;
	this.elapsedTimeSinceStartupMs = 0;
	this.elapsedGameTimeSinceStartup = 0;
	this.timeSinceLoadingEnd = 0;
	this.started = false;
	this.paused = false;
	
	this.loadingLevel = false;
	this.loadingLevelProgress = 0;
	this.loadingLevelName = '';
	
    var $sceneView = $("#scene-view");
    var sceneView = $sceneView.get(0);
    this.graphics = sceneView.getContext("2d");
    this.graphics.$canvas = $sceneView;
    this.graphics.canvas = sceneView;
    
    inputManager.setCanvasLeftX(this.graphics.$canvas.offset().left);
    inputManager.setCanvasTopY( this.graphics.$canvas.offset().top );	
	inputManager.addPauseKeysListener(function(){ self.switchPaused(); });
	
	this.initAssets();
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
};

Game.State = { LOADING : 0, LOADING_END : 1, MAIN_MENU : 2, LEVEL_LOAD : 3, LEVEL_LOAD_END : 4, PLAYING : 5 };

Game.TITLE = "1945: Mission Raptor";
Game.SUBTITLE = "a game by Stephane Wantiez";

Game.prototype.initAssets = function()
{
    var assetsPath = "/raptor-web-static/";
    
    var levelsPath = assetsPath + "levels/";
    var levelsList = {
    	"testLevel1" : levelsPath + "test-level-01.dat"
    };
    
    var imagesPath = assetsPath + "img/";
    var imageList = {
        "title"            : imagesPath +            "title.png",
        "background-ocean" : imagesPath + "background-ocean.png",
        "player-move"      : imagesPath +   "sprites_player.png",
        "bullet"      	   : imagesPath +    "sprite_bullet.bmp",
        "enemy1"      	   : imagesPath +   "sprites_enemy1.png",
        "enemy2"      	   : imagesPath +   "sprites_enemy2.png",
        "enemy3"      	   : imagesPath +   "sprites_enemy3.png",
        "explosion1"   	   : imagesPath +   	"explosion1.png",
        "explosion2"   	   : imagesPath +   	"explosion2.png",
        "boss1"            : imagesPath +     "sprite_boss1.png"
    };

    var soundsPath = assetsPath + "sounds/";
    var soundList = {
        "shoot_basic"   : soundsPath +   "shoot_basic.wav",
        "bullet_hit"    : soundsPath +    "bullet_hit.wav",
        "explosion"     : soundsPath +     "explosion.wav",
        "music-menu"    : soundsPath +    "music-menu.mp3",
        "music-battle1" : soundsPath + "music-battle1.mp3",
        "music-boss1"   : soundsPath +   "music-boss1.mp3",
        "music-victory" : soundsPath + "music-victory.mp3"
    };
    
    assetManager.startLoading(levelsList,imageList,soundList);
};

Game.prototype.onAssetsLoaded = function()
{	
	scene = new Scene();
	player = new Player();
	
	this.mainMenu = new MainMenu();
	this.pauseMenu = new PauseMenu();
	this.victoryMenu = new VictoryMenu();
	this.gameOverMenu = new GameOverMenu();
	
	this.launchMainMenu();
};

Game.prototype.launchMainMenu = function()
{
	scene.reset();
	player.reset();
	
	this.state = Game.State.MAIN_MENU;
	this.mainMenu.updateState(true);
	this.victoryMenu.updateState(false);
	this.gameOverMenu.updateState(false);
	this.pauseMenu.updateState(false);
	this.pause = true;
	this.started = false;
};

Game.prototype.start = function()
{
	scene.loadLevel("testLevel1");
	this.state = Game.State.LEVEL_LOAD;
	this.loadingLevel = false;
	this.loadingLevelName = "testLevel1";
	this.loadingLevelProgress = 1;
	this.elapsedGameTimeSinceStartup = 0;
	this.mainMenu.updateState(false);
	this.victoryMenu.updateState(false);
	this.gameOverMenu.updateState(false);
	this.started = true;
	this.setPaused(false);
};

Game.prototype.restart = function()
{
	this.setPaused(false);
	this.elapsedGameTimeSinceStartup = 0;
	this.victoryMenu.updateState(false);
	this.gameOverMenu.updateState(false);
	scene.reloadLevel();
};

Game.prototype.setPaused = function(paused)
{
	if (!this.started) return;
	this.paused = paused;
	this.pauseMenu.updateState(paused);
};

Game.prototype.switchPaused = function()
{
	this.setPaused(!this.paused);
};

Game.prototype.onVictory = function()
{
	this.paused = true;
	this.victoryMenu.updateState(true);
};

Game.prototype.onGameOver = function()
{
	this.paused = true;
	this.gameOverMenu.updateState(true);
};

Game.prototype.getPlayerScore = function()
{
	return player.score;
};

Game.prototype.sayHello = function()
{
	return 'Welcome back, ' + user.firstname + ' ' + user.lastname + '!' ;
};

Game.prototype.canLogout = function()
{
	return nofblogin;
};

Game.prototype.logout = function()
{
	location.href = location.href + '?logout';
};

Game.prototype.showLoadingScreen = function(g,text,textPosX,progress,alpha)
{
    //console.log("Progress: " + this.getLoadingProgress());
    
    g.save();
    
    g.globalAlpha = alpha;
    
    g.fillStyle = "black";
    g.fillRect(0,0,g.canvas.width,g.canvas.height);
    g.translate(g.canvas.width/2-100,g.canvas.height/2-10);
    
    var gradient = g.createLinearGradient(0,0,200,20);
    gradient.addColorStop(0,"#00F");
    gradient.addColorStop(1,"#F00");
    
    g.fillStyle = gradient;
    g.fillRect(0,0,200,20);
    
    g.fillStyle = "rgb(" + parseInt((1-progress)*255) + "," + parseInt(progress*255) + ",0)";
    g.fillRect(0,0,progress*200,20);
    
    var loadingProgress = Math.round(progress * 100);
    g.font = "10px 5metrik_bold";
    g.fillStyle = "black";
    g.fillText(text + ": " + loadingProgress + "%",textPosX,14);
    
    //g.globalAlpha = 1;
    
    g.restore();
};

Game.prototype.mainLoop = function()
{
	var currentTimeMs = Date.now();
	var deltaTimeMs = currentTimeMs - this.currentFrameTimeMs;
	
	this.currentFrameTimeMs = currentTimeMs;	
	this.elapsedTimeSinceStartupMs += deltaTimeMs;
	
	deltaTimeMs = this.paused ? 0 : deltaTimeMs;
	this.elapsedGameTimeSinceStartup += deltaTimeMs;
	var deltaTimeSec = deltaTimeMs / 1000;
    
    this.graphics.drawTimeMillis = currentTimeMs;    
    this.graphics.clearRect(0,0,this.graphics.canvas.width,this.graphics.canvas.height);
    
    switch(this.state)
    {
    	case Game.State.LOADING:
    	{
    		if (assetManager.isDoneLoading())
    		{
    			console.log('Switching to state LOAD_END');
    			this.state = Game.State.LOAD_END;
            	this.timeSinceLoadingEnd = currentTimeMs;
    			this.onAssetsLoaded();
    		}
    		
    		this.showLoadingScreen(this.graphics, 'Loading game', 60, assetManager.getLoadingProgress(), 1);    		
    		break;
    	}
    	case Game.State.LEVEL_LOAD:
    	{
    		if (!this.loadingLevel)
    		{
    			console.log('Switching to state LEVEL_LOAD_END');
    			this.state = Game.State.LEVEL_LOAD_END;
            	this.timeSinceLoadingEnd = currentTimeMs;
    		}
    		
    		this.showLoadingScreen(this.graphics, 'Loading level ' + this.loadingLevelName, 30, this.loadingLevelProgress, 1);    		
    		break;
    	}
    	case Game.State.LOADING_END:
    	{    		
    		var alphaLoad = $.tween(1,0,this.timeSinceLoadingEnd,1000,$.easeOutExpoCustom);
    		
    		if (alphaLoad < 0.01)
    		{
    			console.log('Switching to state MAIN_MENU');
    			this.state = Game.State.MAIN_MENU;    			
    		}
    		
    		this.gameRender(this.graphics);
    		
    		this.showLoadingScreen(this.graphics, 'Loading game', 60, 100, alphaLoad);    		
    		break;
    	}
    	case Game.State.LEVEL_LOAD_END:
    	{    		
    		var alphaLoad = $.tween(1,0,this.timeSinceLoadingEnd,1000,$.easeOutExpoCustom);
    		
    		if (alphaLoad < 0.01)
    		{
    			console.log('Switching to state PLAYING');
    			this.state = Game.State.PLAYING;    			
    		}
    		
    		this.gameRender(this.graphics);
    		
    		this.showLoadingScreen(this.graphics, 'Loading level ' + this.loadingLevelName, 60, 100, alphaLoad);    		
    		break;
    	}
    	case Game.State.MAIN_MENU:
    	case Game.State.PLAYING:
    	{
            this.gameRender(this.graphics);
            this.gameUpdate(deltaTimeSec);
            break;
    	}
    }
};

Game.prototype.gameUpdate = function(deltaTimeSec)
{
	 scene.update(deltaTimeSec);
	player.update(deltaTimeSec);
};

Game.prototype.gameRender = function(g)
{
	g.save();
	
	scene.render(g);
	player.render(g);
	
	g.restore();
};

$(document).ready(function()
{
	console.log("Game started");
	assetManager = new AssetManager();
	inputManager = new InputManager();
	serverManager = new ServerManager();
	game = new Game();
});

