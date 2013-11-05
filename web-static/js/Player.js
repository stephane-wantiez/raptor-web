var Player = function(parent)
{
	Actor.call(this, parent, "player");

	var self = this;
	
	this.width = Player.WIDTH;
	this.height = Player.HEIGHT;
	this.radius = Player.HEIGHT;
	this.state = Actor.State.ACTIVE;
	
	this.health = 100;
	this.armor = 0;
	this.nbShields = 0;
	this.money = 0;
	this.secWeapon = "";
	this.nbBombs = 0;
	
	this.healthChanged = true;
	this.armorChanged = true;
	this.nbShieldsChanged = true;
	this.moneyChanged = true;
	this.secWeaponChanged = true;
	this.nbBombsChanged = true;
	
	this.$health    = $("#health-hud-indic");
	this.$armor     = $("#armor-hud-indic");
	this.$shields   = $("#shields-indic");
	this.$money     = $("#money");
	this.$secWeapon = $("#sec-weapon");
	this.$bombs     = $("#bombs-indic");
    
	this.controlsEnabled = true;
	this.mouseEnabled = true;
	
    $(document).keyup(function(e){ self.onKeyUp(e.which);});
    $(document).keydown(function(e){ lastKeyEvent = e; self.onKeyDown(e.which);});
    $(document).mousemove(function(e){ lastMouseEvent = e; self.onMouseMove(e.pageX,e.pageY);});
    $(document).mousedown(function(e){ lastMouseEvent = e; self.onMouseDown(e.which);});
    $(document).mouseup(function(e){ lastMouseEvent = e; self.onMouseUp(e.which);});
    
    this.minX = Player.MIN_X;
    this.maxX = Player.MAX_X;
    this.minY = Player.MIN_Y;
    this.maxY = Player.MAX_Y;
	
	this.speed = {
		x: Player.SPEED_X,
		y: Player.SPEED_Y
	};

	this.spriteList = {
		"move": new Sprite(this.$elm, "move", "/raptor-web-static/img/sprites_player.png", 3*Player.WIDTH, Player.HEIGHT, 3, 1, 20, true)
	};
	
	this.setSprite("move");
	this.idleSpriteName = "move";
	
	this.secWeaponsList = {
		"missiles" : "/raptor-web-static/img/icon_missiles.png"	
	};

	this.keyList = {};
	
	this.mouseX = this.x;
	this.mouseY = this.y;
	this.mouseMoved = false;
	this.mouseClicked = false;
	
	this.ammosShootTime = [];
	
	this.setPosition(Player.INIT_X,Player.INIT_Y);
};

Player.WIDTH = 65;
Player.HEIGHT = 65;
Player.INIT_X = Scene.SCREEN_WIDTH / 2;
Player.INIT_Y = Scene.SCREEN_HEIGHT - 100;
Player.MIN_X = 20 ;
Player.MAX_X = Scene.SCREEN_WIDTH - Player.WIDTH - 20 ;
Player.MIN_Y = 50 ;
Player.MAX_Y = Scene.SCREEN_HEIGHT - Player.HEIGHT - 30 ;
Player.SPEED_X = 3000;
Player.SPEED_Y = 2000;
Player.MAX_NB_SHIELDS = 10;
Player.SHIELDS_PERCENT_FACTOR = 100 / Player.MAX_NB_SHIELDS ;
Player.MAX_NB_BOMBS = 3;
Player.BOMBS_PERCENT_FACTOR = 100 / Player.MAX_NB_BOMBS ;
Player.NB_MONEY_DIGITS = 8;
Player.MOVE_UP_KEY     = 38 ; // up arrow
Player.MOVE_DOWN_KEY   = 40 ; // down arrow
Player.MOVE_LEFT_KEY   = 37 ; // left arrow
Player.MOVE_RIGHT_KEY  = 39 ; // right arrow
Player.MOVE_ATTACK_KEY = 32 ; // Space
Player.MOUSE_ATTACK_BUTTON = 1 ; // left button

Player.prototype = new Actor();

Player.prototype.setScene = function(scene)
{
	this.scene = scene;
};

Player.prototype.getPositionInScene = function()
{
	var pos = this.getPosition();
	pos.y += scene.getCameraPosition();
	return pos;
};

Player.prototype.setMouseEnabled = function(value)
{
	this.mouseEnabled = value;
};

Player.prototype.setHealth = function(value)
{
	value = Math.round(value);
	
	if (this.health != value)
	{
		this.health = value;
		this.healthChanged = true;
	}
};

Player.prototype.setArmor = function(value)
{
	value = Math.round(value);
	
	if (this.armor != value)
	{
		this.armor = value;
		this.armorChanged = true;
	}
};

Player.prototype.setNbShields = function(value)
{	
	value = $.clampValue(value,0,Player.MAX_NB_SHIELDS);
	
	if (this.nbShields != value)
	{
		this.nbShields = value;
		this.nbShieldsChanged = true;
	}
};

Player.prototype.setMoney = function(value)
{
	value = Math.round(value);
	
	if (this.money != value)
	{
		this.money = value;
		this.moneyChanged = true;
	}
};

Player.prototype.setSecWeapon = function(value)
{	
	if (this.secWeapon != value)
	{
		this.secWeapon = value;
		this.secWeaponChanged = true;
	}
};

Player.prototype.setNbBombs = function(value)
{	
	value = $.clampValue(value,0,Player.MAX_NB_BOMBS);
	
	if (this.nbBombs != value)
	{
		this.nbBombs = value;
		this.nbBombsChanged = true;
	}
};

Player.prototype.shootAmmo = function(ammoType,ammoActor)
{
	this.childActors.add(ammoActor);
	this.ammosShootTime[ammoType] = Date.now();
};

Player.prototype.updateHud = function()
{
	if (this.healthChanged)
	{
		this.$health.css("height", this.health + "%");
		this.healthChanged = false;
	}
	
	if (this.armorChanged)
	{
		this.$armor.css("height", this.armor + "%");
		this.armorChanged = false;
	}
	
	if (this.nbShieldsChanged)
	{
		this.$shields.css("width", (Player.SHIELDS_PERCENT_FACTOR * this.nbShields) + "%" );
		this.nbShieldsChanged = false;
	}
	
	if (this.nbBombsChanged)
	{
		this.$bombs.css("width", (Player.BOMBS_PERCENT_FACTOR * this.nbBombs) + "%" );
		this.nbBombsChanged = false;
	}
	
	if (this.moneyChanged)
	{
		this.$money.html("$" + $.expandValueDigits(this.money,Player.NB_MONEY_DIGITS));
		this.moneyChanged = false;
	}
	
	if (this.secWeaponChanged)
	{
		if ((this.secWeapon != "") && (this.secWeaponsList[this.secWeapon] != ""))
		{
			this.$secWeapon.show();
			this.$secWeapon.css( "background-image", "url(" + this.secWeaponsList[this.secWeapon] + ")");
		}
		else
		{
			this.$secWeapon.hide();
		}
		
		this.secWeaponChanged = false;
	}
};

Player.prototype.updateState = function(deltaTimeSec)
{
    //console.log(this.keyList);
    
	var move = {x: 0, y: 0};
	var isAttacking = false;
	
	if (this.controlsEnabled && this.mouseEnabled)
	{	
		move.x = $.clampValue(( this.mouseX - this.x ) * 50, -this.speed.x, this.speed.x) * deltaTimeSec ;
		move.y = $.clampValue(( this.mouseY - this.y ) * 50, -this.speed.y, this.speed.y) * deltaTimeSec ;

		//console.log("Mouse moved: mouseX=" + this.mouseX + " , mouseY=" + this.mouseY + " - x=" + this.x + " , y=" + this.y + " -> move.x=" + move.x + " , move.y=" + move.y);
		
		isAttacking = this.mouseClicked;
	}
	else if (this.controlsEnabled)
	{
	    if (this.isKeyDown(Player.MOVE_LEFT_KEY )) move.x = -this.speed.x * deltaTimeSec ;
	    if (this.isKeyDown(Player.MOVE_RIGHT_KEY)) move.x =  this.speed.x * deltaTimeSec ;
	    if (this.isKeyDown(Player.MOVE_UP_KEY   )) move.y = -this.speed.y * deltaTimeSec ;
	    if (this.isKeyDown(Player.MOVE_DOWN_KEY )) move.y =  this.speed.y * deltaTimeSec ;
	    
	    isAttacking = this.isKeyDown(Player.MOVE_ATTACK_KEY);
	}
    
    var isMoving = move.x || move.y;
    //var isMovingLeft = move.x < 0;

    if (isMoving)
    {
	    //console.log("Move: " + move.x + " , " + move.y + " - Delta: " + deltaTimeSec);
    	this.move(move.x, move.y);
    }
        
	//this.setSprite(isAttacking?"attack":(isMoving?"move":"idle"));
    this.setSprite("move");
    
    if (isAttacking) console.log("Attacking");
};

Player.prototype.update = function(deltaTimeSec)
{	
	Actor.prototype.update.call(this,deltaTimeSec);
	
	if (!game.paused)
	{
		this.updateState(deltaTimeSec);
	}
	
	this.updateHud();
	
	//var pos = this.getPositionInScene();
	//console.log("Player position in scene: " + pos.x + "," + pos.y );
};

Player.prototype.isKeyDown = function(k)
{
    return this.keyList[k];
};

Player.prototype.onKeyDown = function(k)
{
    this.keyList[k] = true;
};

Player.prototype.onKeyUp = function(k)
{
    this.keyList[k] = false;
};

Player.prototype.onMouseMove = function(x,y)
{
	this.mouseX = x - this.parent.offset().left ;
	this.mouseY = y - this.parent.offset().top  ;
};

Player.prototype.onMouseDown = function(button)
{
	if (button == Player.MOUSE_ATTACK_BUTTON)
	{
		this.mouseClicked = true;
	}
};

Player.prototype.onMouseUp = function(button)
{
	if (button == Player.MOUSE_ATTACK_BUTTON)
	{
		this.mouseClicked = false;
	}
};
