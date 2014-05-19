var VictoryMenu = function()
{
	EndGameMenu.call(this,"victory-menu","Congratulations!",true);
};

VictoryMenu.prototype = new EndGameMenu();