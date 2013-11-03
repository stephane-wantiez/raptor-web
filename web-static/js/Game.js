var Game = function()
{
	var self = this;
	
	this.timeAtStartupMs = Date.now();
	this.currentFrameTimeMs = this.timeAtStartupMs;
	this.elapsedTimeSinceStartupMs = 0;
	this.elapsedGameTimeSinceStartup = 0;
	this.paused = false;
	
	$screen = $("#screen");
	$scene = $("#game");

	player = new Player($scene);
	camera = new Camera($scene);
	
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

	camera.update(deltaTimeSec);
	player.update(deltaTimeSec);
};

$(document).ready(function()
{
	console.log("Game started");
	game = new Game();
});

