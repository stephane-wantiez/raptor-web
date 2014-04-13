var Game = function()
{
	var self = this;
	
	this.timeAtStartupMs = Date.now();
	this.currentFrameTimeMs = this.timeAtStartupMs;
	this.elapsedTimeSinceStartupMs = 0;
	this.elapsedGameTimeSinceStartup = 0;
	this.timeSinceLoadingEnd = 0;
	this.started = false;
	this.paused = false;
	
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
    
    var doneLoading = assetManager.isDoneLoading();
    var alphaLoad = 1;
    
    if(doneLoading)
    {
        if (this.timeSinceLoadingEnd == 0) 
        {
        	this.timeSinceLoadingEnd = currentTimeMs;
        	this.onAssetsLoaded();
        }
        
        alphaLoad = $.tween(1,0,this.timeSinceLoadingEnd,1000,$.easeOutExpoCustom);
	
        this.gameRender(this.graphics);
        this.gameUpdate(deltaTimeSec);
    }
    if(!doneLoading || alphaLoad > 0)
    {
        assetManager.setRenderAlpha(alphaLoad);
        assetManager.renderLoadingProgress(this.graphics);
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
	game = new Game();
});

