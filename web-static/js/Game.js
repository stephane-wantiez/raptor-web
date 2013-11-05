var Game = function()
{
	var self = this;
	
	this.timeAtStartupMs = Date.now();
	this.currentFrameTimeMs = this.timeAtStartupMs;
	this.elapsedTimeSinceStartupMs = 0;
	this.elapsedGameTimeSinceStartup = 0;
	this.paused = false;
	
	$scene = $("#game");

	player = new Player($scene);
	scene = new Scene(player);
	player.setScene(scene);
	
	// test values
	player.setArmor(50);
	player.setHealth(80);
	player.setMoney(123450);
	player.setNbBombs(2);
	player.setNbShields(3);
	player.setSecWeapon("missiles");
	
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
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

	scene.update(deltaTimeSec);
	player.update(deltaTimeSec);
};

$(document).ready(function()
{
	console.log("Game started");
	game = new Game();
});

