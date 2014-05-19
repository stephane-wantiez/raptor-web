var GameOverMenu = function()
{
	EndGameMenu.call(this,"game-over-menu","Game Over!",false);
};

GameOverMenu.prototype = new EndGameMenu();