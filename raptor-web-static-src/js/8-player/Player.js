var Player = function(playerConfig)
{
	Actor.call(this, "player", Player.WIDTH, Player.HEIGHT);
	
	this.health = 100;
	this.armor = 0;
	this.nbShields = 0;
	this.score = 0;
	this.secWeapon = "";
	this.nbBombs = 0;
	
	this.maxNbShields = playerConfig.MAX_NB_SHIELDS;
	this.maxNbBombs = playerConfig.MAX_NB_BOMBS;

	this.killSound = assetManager.getSound("explosion");
	this.weaponSound = assetManager.getSound("shoot_basic");
	this.weaponCreateAmmo = function(){ return new Bullet(-1 * playerConfig.BULLET_SPEED); };
	this.weaponShootDelayMs = playerConfig.BULLET_SHOOT_WAIT_TIME_MSEC;
	this.nextAllowedWeaponAttack = 0;
	this.useAttackPosition1 = true;
	
	this.collisionDamage = playerConfig.COLLISION_DAMAGE_ENEMY;
	
	this.healthChanged = true;
	this.armorChanged = true;
	this.nbShieldsChanged = true;
	this.scoreChanged = true;
	this.secWeaponChanged = true;
	this.nbBombsChanged = true;
	
	this.$health    = $("#health-hud-indic");
	this.$armor     = $("#armor-hud-indic");
	this.$shields   = $("#shields-indic");
	this.$score     = $("#score");
	this.$secWeapon = $("#sec-weapon");
	this.$bombs     = $("#bombs-indic");
    
    this.minX = Player.MIN_X;
    this.maxX = Player.MAX_X;
    this.minY = Player.MIN_Y;
    this.maxY = Player.MAX_Y;
	
	this.speed = {
		x: playerConfig.SPEED_X,
		y: playerConfig.SPEED_Y
	};
	
	this.createSpriteWithUrl("move", "player-move", Player.NB_MOVE_SPRITES * Player.WIDTH, Player.HEIGHT, Player.NB_MOVE_SPRITES, 1, 20, true );
	this.createSpriteWithUrl("explosion", "explosion2", Player.KILL_SPRITE_WIDTH * Player.KILL_SPRITE_NB_COL, Player.KILL_SPRITE_HEIGHT * Player.KILL_SPRITE_NB_ROW, Player.KILL_SPRITE_NB_COL, Player.KILL_SPRITE_NB_ROW, Player.KILL_SPRITE_FPS, false);

	this.idleSpriteName = "move";
	this.deadSpriteName = "explosion";
	
	this.secWeaponsList = {
		"missiles" : "/raptor-web-static/img/icon_missiles.png"	
	};
};

Player.WIDTH = 65;
Player.HEIGHT = 65;
Player.START_POS_X = 400;
Player.START_POS_Y = 700;
Player.NB_MOVE_SPRITES = 3;
Player.SHOOT_REL_POSITION_1_X = -20;
Player.SHOOT_REL_POSITION_2_X =  20;
Player.SHOOT_REL_POSITION_1_Y = -10;
Player.SHOOT_REL_POSITION_2_Y = -10;
Player.INIT_X = Scene.SCREEN_WIDTH / 2;
Player.INIT_Y = Scene.SCREEN_HEIGHT - 100;
Player.MIN_X = Player.WIDTH/2 + 20 ;
Player.MAX_X = Scene.SCREEN_WIDTH - Player.WIDTH/2 - 20 ;
Player.MIN_Y = Player.WIDTH/2 + 50 ;
Player.MAX_Y = Scene.SCREEN_HEIGHT - Player.HEIGHT/2 - 30 ;
Player.NB_SCORE_DIGITS = 8;
Player.MOVE_UP_KEY     = 38 ; // up arrow
Player.MOVE_DOWN_KEY   = 40 ; // down arrow
Player.MOVE_LEFT_KEY   = 37 ; // left arrow
Player.MOVE_RIGHT_KEY  = 39 ; // right arrow
Player.MOVE_ATTACK_KEY = 32 ; // Space
Player.MOUSE_ATTACK_BUTTON = 1 ; // left button
Player.KILL_SPRITE_NB_ROW = 1;
Player.KILL_SPRITE_NB_COL = 6;
Player.KILL_SPRITE_WIDTH  = 65;
Player.KILL_SPRITE_HEIGHT = 65;
Player.KILL_SPRITE_FPS = 10;

Player.prototype = new Actor();

Player.prototype.reset = function()
{
	Actor.prototype.reset.call(this);
	inputManager.playerControlsEnabled = true;
	this.nextAllowedWeaponAttack = 0;
	this.setHealth(100);
	this.setScore(0);
	this.setArmor(100);
	this.setNbShields(2);
	//this.setNbBombs(1);
	//this.setSecWeapon("missiles");
	this.setPosition( Player.START_POS_X, Player.START_POS_Y );
};

Player.prototype.getPositionInScene = function()
{
	var pos = this.getPosition();
	pos.y += scene.getCameraPosition();
	return pos;
};

Player.prototype.setMouseEnabled = function(value)
{
	inputManager.mouseEnabled = value;
};

Player.prototype.setHealth = function(value)
{
	value = $.clampValue(Math.round(value),0,100);
	
	if (this.health != value)
	{
		this.health = value;
		this.healthChanged = true;
	}
};

Player.prototype.setArmor = function(value)
{
	value = $.clampValue(Math.round(value),0,100);
	
	if (this.armor != value)
	{
		this.armor = value;
		this.armorChanged = true;
	}
};

Player.prototype.setNbShields = function(value)
{	
	value = $.clampValue(value,0,this.maxNbShields);
	
	if (this.nbShields != value)
	{
		this.nbShields = value;
		this.nbShieldsChanged = true;
	}
};

Player.prototype.setScore = function(value)
{
	value = Math.round(value);
	
	if (this.score != value)
	{
		this.score = value;
		this.scoreChanged = true;
	}
};

Player.prototype.addScore = function(value)
{
	var self = this;
	serverManager.requestGameScoreUpdate(value,
	function(data){
		self.setScore(data);
	},function(err){
		alert('Error while updating player score: ' + err);
		game.launchMainMenu();
	});
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
	value = $.clampValue(value,0,this.maxNbBombs);
	
	if (this.nbBombs != value)
	{
		this.nbBombs = value;
		this.nbBombsChanged = true;
	}
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
		this.$shields.css("width", (100 / this.maxNbShields * this.nbShields) + "%" );
		this.nbShieldsChanged = false;
	}
	
	if (this.nbBombsChanged)
	{
		this.$bombs.css("width", (100 / this.maxNbBombs * this.nbBombs) + "%" );
		this.nbBombsChanged = false;
	}
	
	if (this.scoreChanged)
	{
		this.$score.html($.expandValueDigits(this.score,Player.NB_SCORE_DIGITS));
		this.scoreChanged = false;
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
	
	if (inputManager.playerControlsEnabled && inputManager.mouseEnabled)
	{	
		move.x = $.clampValue(( inputManager.mouseX - this.x ) * 50, -this.speed.x, this.speed.x) * deltaTimeSec ;
		move.y = $.clampValue(( inputManager.mouseY - this.y ) * 50, -this.speed.y, this.speed.y) * deltaTimeSec ;

		//console.log("Mouse moved: mouseX=" + inputManager.mouseX + " , mouseY=" + inputManager.mouseY + " - x=" + this.x + " , y=" + this.y + " -> move.x=" + move.x + " , move.y=" + move.y);
		
		isAttacking = inputManager.isMouseDown(Player.MOUSE_ATTACK_BUTTON);
	}
	
	if (inputManager.playerControlsEnabled)
	{
	    if (inputManager.isKeyDown(Player.MOVE_LEFT_KEY )) move.x = -this.speed.x * deltaTimeSec ;
	    if (inputManager.isKeyDown(Player.MOVE_RIGHT_KEY)) move.x =  this.speed.x * deltaTimeSec ;
	    if (inputManager.isKeyDown(Player.MOVE_UP_KEY   )) move.y = -this.speed.y * deltaTimeSec ;
	    if (inputManager.isKeyDown(Player.MOVE_DOWN_KEY )) move.y =  this.speed.y * deltaTimeSec ;
	    
	    isAttacking = isAttacking || inputManager.isKeyDown(Player.MOVE_ATTACK_KEY);
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
    
    if (isAttacking)
    {
    	this.attack();
    }
};

Player.prototype.getAttackPosition = function()
{
	var posInScene = this.getPositionInScene();
	var attackPosX = posInScene.x + ( this.useAttackPosition1 ? Player.SHOOT_REL_POSITION_1_X : Player.SHOOT_REL_POSITION_2_X );
	var attackPosY = posInScene.y + ( this.useAttackPosition1 ? Player.SHOOT_REL_POSITION_1_Y : Player.SHOOT_REL_POSITION_2_Y );
	this.useAttackPosition1 = ! this.useAttackPosition1;
	return { x : attackPosX, y : attackPosY };
};

Player.prototype.attack = function()
{
	console.log("Attack command - this.nextAllowedWeaponAttack=" + this.nextAllowedWeaponAttack + " - game.elapsedGameTimeSinceStartup=" + game.elapsedGameTimeSinceStartup);
	if (this.nextAllowedWeaponAttack < game.elapsedGameTimeSinceStartup)
	{
		console.log("Can attack!");
		this.nextAllowedWeaponAttack = game.elapsedGameTimeSinceStartup + this.weaponShootDelayMs;
		this.weaponSound.play();
		var projectile = this.weaponCreateAmmo();
		this.attackWith(projectile);
	}
};

Player.prototype.attackWith = function(projectile)
{
	var attackPos = this.getAttackPosition();
	projectile.setPosition(attackPos.x,attackPos.y);
	projectile.speedY += scene.speedY;
	scene.playerActors.add(projectile);
};

Player.prototype.getTotalArmor = function()
{
	return this.armor + this.nbShields * 100 ;
};

Player.prototype.reduceTotalArmor = function(value)
{
	var nbShields = this.nbShields;
	var armor = this.armor;
	armor -= value;
	while((armor < 0) && (nbShields > 0))
	{
		nbShields--;
		armor += 100;
	}
	if (armor < 0)
	{
		this.setArmor(0);
		this.setNbShields(0);
		return Math.abs(armor);
	}
	else
	{
		this.setArmor(armor);
		this.setNbShields(nbShields);
		return 0;
	}
};

Player.prototype.damage = function(damage)
{
	var remainingDamage = this.reduceTotalArmor(damage);
	
	if (remainingDamage > 0)
	{
		Actor.prototype.damage.call(this,remainingDamage);
	}
};

Player.prototype.doUpdate = function(deltaTimeSec)
{	
	Actor.prototype.doUpdate.call(this,deltaTimeSec);
	
	if (this.state == Actor.State.ACTIVE)
	{
		this.updateState(deltaTimeSec);
	}
	
	this.updateHud();
	
	//var pos = this.getPositionInScene();
	//console.log("Player position in scene: " + pos.x + "," + pos.y );
	//console.log("Player position: " + this.x + "," + this.y );
};
