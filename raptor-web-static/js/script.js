/** 
* Script file generated on Sat, 26 Apr 2014 22:21:57 +0200
**/

/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\0-utils\utils.js **/

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
           window.setTimeout(callback, 1000/60);
         };
})();

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

$.getTimeMillis = function(){
	return new Date().getTime();
};
$.getTimeFloat = function(){
	return $.getTimeMillis() / 1000;
};
var localTime = Math.floor(new Date().getTime() / 1000);
$.getTime = function(){
	var timeElapsed = Math.floor($.getTimeFloat()) - localTime;
	return serverTime + timeElapsed;
};
$.getElmRegion = function(elm){
	var pos = elm.offset();
	var rootPos = gameManager.root.offset();
	var posX = pos.left - rootPos.left;
	var posY = pos.top - rootPos.top;
	var w = elm.width();
	var h = elm.height();
	return {
		posX: posX,
		posY: posY,
		width: w,
		height: h
	};
};

$.ease = function(from, to, func, options){
	var isObject = true;
	if(typeof from != "object"){
		from = {v: from};
		to = {v: to};
		isObject = false;
	}
	var o = {};
	if(options){
		for(i in options){
			o[i] = options[i];
		}
	}
	o.step = function(f){
		if(isObject){
			var res = {};
			for(i in from){
				res[i] = f * (to[i] - from[i]) + from[i];
			}
			func(res);
		}else{
			func(f * (to.v - from.v) + from.v);
		}
	};
	var listener = $({f:0});
	if(options && options.delay){
		listener.delay(options.delay).animate({f:1}, o);
	}else{
		listener.animate({f:1}, o);
	}
	return listener;
};

$.shuffle = function(list){
	var i, j, t;
	for (i = 1; i < list.length; i++) {
		j = Math.floor(Math.random() * (1 + i));
		if (j != i) {
			t = list[i];
			list[i] = list[j];
			list[j] = t;
		}
	}
};

$.isDefined = function(value)
{
	return (typeof(value) != "undefined");
};

$.clampValue = function(value, min, max)
{
	if (value < min)
	{
		value = min;
	}
	else if (value > max)
	{
		value = max;
	}
	
	return value;
};

$.meanValue = function(a,b)
{
	var minVal = Math.min(a,b);
	var maxVal = Math.max(a,b);
	return minVal + (maxVal-minVal)/2;
};

$.tween = function(from, to, startTime, duration, easing)
{
    var now = Date.now();
    if (now - startTime < duration)
    {
        var normValue = (now - startTime) / duration;
        if (typeof(easing) != "undefined") normValue = $.clampValue(easing(normValue),0,1);
        return from + (to-from) * normValue;
    }
    return to;
};

$.getDistanceBetweenPointsSquared = function(point1,point2)
{
	return Math.abs (( point2.x - point1.x ) * ( point2.x - point1.x ) + ( point2.y - point1.y ) * ( point2.y - point1.y ));
};

$.getDistanceBetweenPoints = function(point1,point2)
{
	return Math.sqrt($.getDistanceBetweenPointsSquared(point1,point2));
};

$.expandValueDigits = function(value,nbDigits) // ex: 1234 on 8 digits -> return "00001234"
{
	var valueStr = "";
	var modulo = 10;
	var divider = 1;
	
	for(var i = 0 ; i < nbDigits ; ++i)
	{
		valueStr = parseInt(( value % modulo ) / divider ) + valueStr ;
		divider *= 10;
		modulo  *= 10;
	}
	
	if ( value >= divider ) return "" + (divider-1) ; // ex: 1234 > 1000 -> return "999"
	
	return valueStr;
};

$.EASE_FACTOR = 3.5;
$.EASE_FACTOR_EXP = 4;

$.easeInCustom = function(timeNorm)
{
    return Math.pow(timeNorm,$.EASE_FACTOR);
};

$.easeOutCustom = function(timeNorm)
{
    return Math.pow(timeNorm,1/$.EASE_FACTOR);
};

$.easeInExpCustom = function(timeNorm)
{
    return Math.pow(timeNorm,$.EASE_FACTOR_EXP);
};

$.easeOutExpoCustom = function(timeNorm)
{
    return Math.pow(timeNorm,1/$.EASE_FACTOR_EXP);
};

$.easeInSinCustom = function(timeNorm)
{
    return Math.sin(-Math.PI/2+timeNorm*Math.PI/2)+1;
};

$.easeOutSinCustom = function(timeNorm)
{
    return Math.sin(timeNorm*Math.PI/2);
};

$.easeInOutSinCustom = function(timeNorm)
{
    return (1 + Math.sin(-Math.PI/2+timeNorm*Math.PI)) / 2;
};

$.showEase = function(g,rect,ease)
{
    g.save();
    
    g.translate(rect.x,rect.y);
    
    g.fillStyle = "black";
    g.fillRect(0,0,rect.width,rect.height);
    
    g.fillStyle = "red";
    
    var nbPoints = 50;
    
    for(var i = 0 ; i <= nbPoints ; ++i)
    {
        var vx = i / nbPoints;
        var px = vx * rect.width;
        
        var vy = ease(vx);
        var py = vy * rect.height;
        
        g.fillRect(px,rect.height-py,1,1);
    }
    
    g.restore();
};

$.objectToString = function(objectToShow)
{
	return JSON.stringify(objectToShow, null, 4);
};

// UNIT TESTS

testValue = $.getDistanceBetweenPointsSquared({x:1,y:1},{x:2,y:1});
if (testValue != 1) console.error("$.getDistanceBetweenPointsSquared is WRONG: " + testValue);
testValue = $.getDistanceBetweenPointsSquared({x:1,y:1},{x:1,y:3});
if (testValue != 4) console.error("$.getDistanceBetweenPointsSquared is WRONG: " + testValue);

testValue = $.expandValueDigits(1234,8);
if (testValue != "00001234") console.error("$.expandValueDigits is WRONG: " + testValue);




/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\1-assets\0-Sound.js **/

var Sound = function(url)
{
    /**
      HTML :
        <audio id="myAudio">
            <source type="this.audio/mpeg" url="mySoundUrl"/>
        </audio>
    **/
	
	this.audio = new Audio();
	this.url = url;
	
    var sourceElem = document.createElement("source");
    sourceElem.src = url;
    
    var sourceType = url.substring(url.length-3);
    
    switch(sourceType)
    {
        case "mp3" : sourceElem.type = "audio/mpeg"; break;
        default    : sourceElem.type = "audio/" + sourceType; break;
    }
    
    this.audio.appendChild(sourceElem);
    document.body.appendChild(this.audio);
};

Sound.prototype.addEventListener = function(event,callback)
{
	this.audio.addEventListener(event,callback);
};

Sound.prototype.play = function()
{
	this.audio.currentTime = 0;
	this.audio.play();
};

Sound.prototype.playLoop = function()
{
	this.audio.currentTime = 0;
	this.audio.loop = true;
	this.audio.play();
};

Sound.prototype.pause = function()
{
	this.audio.pause();
};

Sound.prototype.stop = function()
{
	this.audio.pause();
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\1-assets\1-AssetManager.js **/

var AssetManager = function()
{
	//this.levelsProperties = {};
	this.images = {};
	this.sounds = {};
	//this.levelsError = {};
	this.imagesError = {};
	//this.levelsToLoad = {};
	this.imagesToLoad = {};
	this.soundsToLoad = {};
	this.loadingStarted = false;
    //this.renderAlpha = 1;
};

/*AssetManager.prototype.loadLevelProperties = function(fileName,levelName)
{
	var _this = this;
	var levelProperties = this.levelsProperties[levelName];
	if(!levelProperties)
	{
		this.levelsToLoad[levelName] = levelName;
		
		$.get( fileName, function(fileData)
		{
			//console.log("Loaded level " + levelName + " file data: " + fileData);
			var loadedLevelProperties = $.parseJSON(fileData);
			//console.log("Loaded level " + levelName + " properties: " + $.objectToString(loadedLevelProperties));
			_this.levelsProperties[levelName] = loadedLevelProperties;
		})
		.fail( function()
		{
			console.log("Can't load level " + levelName + " from file " + fileName);
			_this.levelsError[levelName] = fileName;
		})
		.always( function()
		{
			delete _this.levelsToLoad[levelName];
			_this.assetLoaded();
		});		
	}
	else
	{
		this.assetLoaded();
	}
	return levelProperties;
};*/

AssetManager.prototype.loadImage = function(url, id)
{
	var _this = this;
	if(!id) id = url;
	
	var img = this.images[id];
	if(!img){
		this.imagesToLoad[id] = url;
		img = new Image();
		img.onload = function(){
			delete _this.imagesToLoad[id];
			_this.assetLoaded();
		};
		img.onerror = function(){
			console.log("Can't load image " + id + " from file " + url);
			delete _this.imagesToLoad[id];
			_this.imagesError[id] = id;
			_this.assetLoaded();
		};
		img.src = url;
		this.images[id] = img;
	}else{
		this.assetLoaded();
	}
	return img;
};

AssetManager.prototype.loadSound = function(url, id, onload)
{
	var _this = this;	
	if(!id) id = url;
	
	if(this.sounds[id])
    {
		this.assetLoaded();
	}
    else
    {        
        this.soundsToLoad[id] = url;
	    var sound = new Sound(url);
	    
	    sound.addEventListener("canplay",function(){
	    	if ($.isDefined(_this.soundsToLoad[id]))
        	{
        		delete _this.soundsToLoad[id];
        		_this.assetLoaded();
        	}
	    });
	    sound.addEventListener("stalled",function(){
	    	if ($.isDefined(_this.soundsToLoad[id]))
        	{
        		console.log("Error loading sound " + url);
        		delete _this.soundsToLoad[id];
        		_this.assetLoaded();
        	}
	    });
	    
		this.sounds[id] = sound;
	}
	
	return this.sounds[id];
};

AssetManager.prototype.assetLoaded = function()
{
	this.totalAssetLoaded++;
	var now = Date.now();
	this.loadingTime = now - this.loadingStartTime;
	this.loadingEndTime = now;
};

/*AssetManager.prototype.setRenderAlpha = function(a)
{
    this.renderAlpha = a;
};*/

/*AssetManager.prototype.renderLoadingProgress = function(g)
{
    //console.log("Progress: " + this.getLoadingProgress());
    
    g.save();
    
    g.globalAlpha = this.renderAlpha;
    
    g.fillStyle = "black";
    g.fillRect(0,0,g.canvas.width,g.canvas.height);
    g.translate(g.canvas.width/2-100,g.canvas.height/2-10);
    
    var gradient = g.createLinearGradient(0,0,200,20);
    gradient.addColorStop(0,"#00F");
    gradient.addColorStop(1,"#F00");
    
    g.fillStyle = gradient;
    g.fillRect(0,0,200,20);
    
    g.fillStyle = "rgb(" + parseInt((1-this.getLoadingProgress())*255) + "," + parseInt(this.getLoadingProgress()*255) + ",0)";
    g.fillRect(0,0,this.getLoadingProgress()*200,20);
    
    var loadingProgress = Math.round(this.getLoadingProgress() * 100);
    g.font = "10px 5metrik_bold";
    g.fillStyle = "black";
    g.fillText("Loading: " + loadingProgress + "%",70,14);
    
    //g.globalAlpha = 1;
    
    g.restore();
};*/

AssetManager.prototype.isDoneLoading = function()
{
	return this.totalAssetCount <= this.totalAssetLoaded;
};

AssetManager.prototype.startLoading = function(imgLoadingList, soundLoadingList)
{
	this.loadingStartTime = Date.now();	
	this.totalAssetLoaded = 0;
	this.totalAssetCount = 0;

	/*for(var i in levelLoadingList)
	{
		this.totalAssetCount++;
	}*/
	for(var i in imgLoadingList)
	{
		this.totalAssetCount++;
	}
	for(var i in soundLoadingList)
	{
		this.totalAssetCount++;
	}
	
	this.loadingStarted = true;

	/*for(var i in levelLoadingList)
	{
		this.loadLevelProperties(levelLoadingList[i], i);
	}*/
	for(var i in imgLoadingList)
	{
		this.loadImage(imgLoadingList[i], i);
	}
	for(var i in soundLoadingList)
	{
		this.loadSound(soundLoadingList[i], i);
	}
};

AssetManager.prototype.getLoadingProgress = function()
{
	if(this.totalAssetCount == 0)
	{
		return 1;
	}
	else
	{
		return this.totalAssetLoaded / this.totalAssetCount;
	}
};

/*AssetManager.prototype.getLevelProperties = function(levelName)
{
	return this.levelsProperties[levelName];
};*/

AssetManager.prototype.getImage = function(id)
{
	return this.images[id];
};

AssetManager.prototype.getSound = function(id)
{
	return this.sounds[id];
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\1-server\ServerManager.js **/

var ServerManager = function()
{};

ServerManager.prototype.sendRequest = function(action,data,successCallback,errorCallback)
{
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			action: action,
			data: ($.isDefined(data)) ? data : ''
		},
		success: function(res){
			//alert('Success for request ' + action);
			if ($.isDefined(successCallback))
			{
				successCallback(res);
			}
		},
		error: function(err){
			//alert('Failure for request ' + action);
			if ($.isDefined(errorCallback))
			{
				errorCallback(JSON.stringify(err, null, '\n'));
			}
		}
	});
};

ServerManager.prototype.requestLevelData = function(levelNumber,successCallback,errorCallback)
{
	// send the request with the level number, receive the level properties if successful
	this.sendRequest('get-level',levelNumber,successCallback,errorCallback);
};

ServerManager.prototype.requestGameStart = function(successCallback,errorCallback)
{
	// send the request w/o any data, receive the score id if successful
	this.sendRequest('game-start','',successCallback,errorCallback);
};

ServerManager.prototype.requestGameScoreUpdate = function(scoreIncrement,successCallback,errorCallback)
{
	// send the request with the score increment, receive the new score if successful
	this.sendRequest('game-score-update',scoreIncrement,successCallback,errorCallback);
};

ServerManager.prototype.requestGameEnd = function(successCallback,errorCallback)
{
	// send the request w/o any data, receive the score id if successful
	this.sendRequest('game-end','',successCallback,errorCallback);
};

ServerManager.prototype.requestTopScores = function(successCallback,errorCallback)
{
	// send the request w/o any data, receive the array of 5 user's top scores maximum
	this.sendRequest('user-top-scores','',successCallback,errorCallback);
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\2-inputs\InputManager.js **/

var InputManager = function()
{
	var self = this;
	
	this.playerControlsEnabled = true;
	this.mouseEnabled = true;
	
    $(document).keyup(function(e){ self.onKeyUp(e.which);});
    $(document).keydown(function(e){ lastKeyEvent = e; self.onKeyDown(e.which);});
    $(document).mousemove(function(e){ lastMouseEvent = e; self.onMouseMove(e.pageX,e.pageY);});
    $(document).mousedown(function(e){ lastMouseEvent = e; self.onMouseDown(e.which);});
    $(document).mouseup(function(e){ lastMouseEvent = e; self.onMouseUp(e.which);});

	this.keyList = {};
	this.mouseClicked = {};
	this.mouseMoved = false;
	this.mouseX = this.x;
	this.mouseY = this.y;
	
	this.canvasLeftX = 0;
	this.canvasTopY = 0;
	
	this.pauseKeysListeners = [];
};

InputManager.prototype.setCanvasLeftX = function(value)
{
	this.canvasLeftX = value;
};

InputManager.prototype.setCanvasTopY = function(value)
{
	this.canvasTopY = value;
};

InputManager.prototype.addPauseKeysListener = function(callback)
{
	this.pauseKeysListeners.push(callback);
};

InputManager.prototype.firePauseKeysEvent = function()
{
	for(var listenerIndex in this.pauseKeysListeners)
	{
		this.pauseKeysListeners[listenerIndex]();
	}
};

InputManager.prototype.onKeyDown = function(k)
{
    this.keyList[k] = true;
    this.checkSpecialKeys();
};

InputManager.prototype.onKeyUp = function(k)
{
    this.keyList[k] = false;
    this.checkSpecialKeys();
};

InputManager.prototype.isKeyDown = function(k)
{
    return this.keyList[k];
};

InputManager.prototype.onMouseMove = function(x,y)
{
	this.mouseX = x - this.canvasLeftX;
	this.mouseY = y - this.canvasTopY;
};

InputManager.prototype.onMouseDown = function(button)
{
	this.mouseClicked[button] = true;
};

InputManager.prototype.onMouseUp = function(button)
{
	this.mouseClicked[button] = false;
};

InputManager.prototype.isMouseDown = function(button)
{
    return this.mouseClicked[button];
};

InputManager.prototype.checkSpecialKeys = function()
{
	if ( this.isKeyDown(InputManager.ESC_KEY_CODE) || this.isKeyDown(InputManager.PAUSE_KEY_CODE) || this.isKeyDown(InputManager.P_KEY_CODE) )
	{
		this.firePauseKeysEvent();
	}
};

InputManager.ESC_KEY_CODE = 27;
InputManager.PAUSE_KEY_CODE = 19;
InputManager.P_KEY_CODE = 80;




/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\3-graphics\Sprite.js **/

var Sprite = function(id, img, width, height, colCount, rowCount, frameRate, loop)
{
	this.id = id;
	this.img = img;
	this.loop = loop;
	this.rowCount = rowCount;
	this.colCount = colCount;
	this.frameCount = this.rowCount * this.colCount;
	this.currentFrame = 0;
	this.setFrameRate(frameRate);
	this.invert = false;
	this.invertAnim = false;
    this.revertDirection = false;
	this.scale = 1;
	this.lastUpdateTime = 0;
	this.imgWidth = width;
	this.imgHeight = height;
	this.onAnimationComplete = false;
	this.completed = false;
	this.width = Math.round(this.imgWidth / this.colCount);
	this.height = Math.round(this.imgHeight / this.rowCount);
	this.centerX = parseInt(this.width/2);
	this.centerY = parseInt(this.height/2);
};

Sprite.prototype.setRevertDirection = function(v)
{
    this.revertDirection = v;
};

Sprite.prototype.setCenter = function(x, y)
{
	this.centerX = x;
	this.centerY = y;
};

Sprite.prototype.setFrameRate = function(frameRate)
{
	this.frameRate = frameRate;
	this.frameDuration = 1.0 / this.frameRate * 1000;
};

Sprite.prototype.setScale = function(scale)
{
	this.scale = scale;
};

Sprite.prototype.show = function(type, options)
{
	if(this.loop)
	{
		this.currentFrame = 0;
		this.play();
	}
};

Sprite.prototype.hide = function(hideType)
{
	this.stop();
};

Sprite.prototype.play = function(onComplete)
{
	var _this = this;
	if(this.player) clearTimeout(this.player);
	var frameDuration = this.frameDuration;
	if(this.character && this.character.slowMotion)
	{
		frameDuration = Math.round(frameDuration * 1.5);
	}
	this.player = setTimeout(function()
	{
		_this.nextFrame();
		if(_this.loop || _this.currentFrame < _this.frameCount - 1)
		{
			_this.play(onComplete);
		}
		else if((typeof onComplete) == "function")
		{
			onComplete(_this);
		}
	}, frameDuration);
};

Sprite.prototype.resetAnim = function()
{
	this.stop();
	this.currentFrame = 0;
	this.completed = false;
};

Sprite.prototype.stop = function()
{
	if(this.player)
	{
		clearTimeout(this.player);
		this.player = false;
	}
};

Sprite.prototype.nextFrame = function(frames)
{
	if(!frames) frames = 1;
	this.currentFrame = this.currentFrame + frames;
	if(this.currentFrame >= this.frameCount)
	{
		if(this.loop)
		{
			this.currentFrame %= this.frameCount;
		}
		else
		{
			this.currentFrame = this.frameCount - 1;
		}
	}
	if(this.currentFrame == this.frameCount - 1 && !this.loop && this.onAnimationComplete)
	{
		this.onAnimationComplete(this);
		this.onAnimationComplete = false;
		this.completed = true;
	}
};

Sprite.prototype.render = function(g)
{
	g.save();

    var frame = this.invertAnim ? ( this.frameCount - this.currentFrame - 1 ) : this.currentFrame;
    
    var currentCol = frame % this.colCount ;
    var currentRow = Math.floor( frame / this.colCount ) ;
    
    if(this.invert)
    {
        currentCol = this.colCount - currentCol - 1 ;
        currentRow = this.rowCount - currentRow - 1 ;
    }
    
    var sx = Math.round( this.width  * currentCol );
    var sy = Math.round( this.height * currentRow );
    
    var currentScaleX = this.scale * ( this.revertDirection ? -1 : 1 );
    g.scale(currentScaleX,this.scale);
    
    g.drawImage( this.img, sx, sy, this.width, this.height, -this.centerX, -this.centerY, this.width, this.height );
    
    g.restore();    
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\4-base-actors\0-PositionChanger.js **/

var PositionChanger = function()
{	
	this.x = 0;
	this.y = 0;
	this.positionListenerList = [];
};

PositionChanger.prototype.addPositionListener = function(listener)
{
	this.positionListenerList.push(listener);
};

PositionChanger.prototype.firePositionChange = function()
{
    for(var listenerIndex in this.positionListenerList){
        this.positionListenerList[listenerIndex](this.x,this.y);
    }
};

PositionChanger.prototype.getPosition = function()
{
	return { x: this.x, y: this.y };
};

PositionChanger.prototype.setPosition = function(x, y)
{
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.firePositionChange();
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\4-base-actors\1-Actor.js **/

var Actor = function(id,width,height)
{
	this.id = id;
	
	this.creationTimeMs = Date.now();

	this.spriteList = {};
	this.currentSprite = false;
	this.nextSprite = "";	
	this.lastAnimId = "";
	this.idleSpriteName = "";
	this.deadSpriteName = "";
	
	this.minX = -Infinity;
	this.maxX = Infinity;
	this.minY = -Infinity;
	this.maxY = Infinity;
	
	this.width = width;
	this.height = height;
	
	this.isVisible = false;
	
	this.radius = $.meanValue(width/2,height/2);
	this.areCollisionsChecked = true;
	
	this.state = Actor.State.INACTIVE;
	this.health = 100;
	this.lifeTimeSec = 0;
	this.deathPeriodSec = 0;
	
	this.collisionDamage = 0;
	this.collisionSound = false;
	
	this.killSound = false;
	this.killScore = 0;
};

Actor.State = { INACTIVE : 0, ACTIVE : 1, DYING : 2, DEAD : 3 };

Actor.prototype = new PositionChanger("Actor");

Actor.prototype.reset = function()
{
	if (this.idleSpriteName != "")
	{
		this.currentSprite = false;
		this.setSprite(this.idleSpriteName);
	}
	this.activate();
};

Actor.prototype.createSprite = function(id,img,width,height,colCount,rowCount,frameRate,loop)
{
    this.spriteList[id] = new Sprite(id,img,width,height,colCount,rowCount,frameRate,loop);
};

Actor.prototype.createSpriteWithUrl = function(id,url,width,height,colCount,rowCount,frameRate,loop)
{
	var img = assetManager.getImage(url);
    this.createSprite(id,img,width,height,colCount,rowCount,frameRate,loop);
};

Actor.prototype.setSprite = function(anim, onComplete)
{
	this.lastAnimId = anim;
	var spriteId = anim;
	
	if(this.currentSprite != this.spriteList[spriteId])
	{
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.completed)
		{
			if(this.currentSprite)
			{
				this.currentSprite.stop();
				this.currentSprite.hide();
			}
			this.currentSprite = this.spriteList[spriteId];
			this.currentSprite.resetAnim();
			this.currentSprite.play(onComplete);
			this.currentSprite.show();
        }
		else
		{
            this.nextSprite = anim;
        }
	}
};

Actor.prototype.checkSprite = function()
{
	if (this.state == Actor.State.ACTIVE)
	{
		if (!this.currentSprite || this.currentSprite.completed)
		{
			if (this.nextSprite != "")
			{
				this.setSprite(this.nextSprite);
			}
			else if (this.idleSpriteName != "")
			{
				this.setSprite(this.idleSpriteName);
			}
		}
	}
};

Actor.prototype.moveTo = function(x, y)
{
	if ((this.x == x) && (this.y == y)) return;
	
	x = $.clampValue(x,this.minX,this.maxX);
	y = $.clampValue(y,this.minY,this.maxY);
	
	var self = this;
	if(this.animHandler)
	{
		this.animHandler.stop(false, false);
	}
	this.animHandler = $.ease({
		x: this.x,
		y: this.y
	}, {
		x: x, 
		y: y
	}, function(o){
		self.setPosition(o.x, o.y);
	},
	{
		easing: "easeOutCirc",
		duration: 300
	});
};

Actor.prototype.move = function(x, y)
{
	this.moveTo(this.x + x, this.y + y);
};

Actor.prototype.getPositionInScene = function()
{
	return this.getPosition();
};

Actor.prototype.isInLeftScreenHalf = function()
{
	return this.isBeforeX(Scene.SCREEN_WIDTH/2);
};

Actor.prototype.isBeforeX = function(x)
{
	return this.x + this.width < x;
};

Actor.prototype.isAfterX = function(x)
{
	return x < this.x ;
};

Actor.prototype.isBeforeY = function(y)
{
	return this.y + this.height < y;
};

Actor.prototype.isAfterY = function(y)
{
	return y < this.y ;
};

Actor.prototype.isLifetimeOver = function()
{
	return ( this.deathPeriodSec != 0 ) && ( this.lifeTimeSec >= this.deathPeriodSec );
};

Actor.prototype.checkLifetime = function()
{
	if ((this.state == Actor.State.ACTIVE) && this.isLifetimeOver())
	{
		this.remove();
	}
};

Actor.prototype.setHealth = function(value)
{
	this.health = value;
};

Actor.prototype.getCollisionDamage = function()
{
	return this.collisionDamage;
};

Actor.prototype.damage = function(damage)
{
	this.setHealth(this.health-damage);
	
	if (this.health <= 0)
	{
		this.kill();
	}
};

Actor.prototype.isCollidingWith = function(otherActor)
{
	if (!      this.areCollisionsChecked) return false;
	if (!otherActor.areCollisionsChecked) return false;
	
	if (      this.state == Actor.State.DEAD) return false;
	if (otherActor.state == Actor.State.DEAD) return false;
	
	var actorPos = this.getPositionInScene();
	var otherPos = otherActor.getPositionInScene();
	var distSquared = $.getDistanceBetweenPointsSquared(actorPos,otherPos);
	var minDist = this.radius + otherActor.radius;
	var minDistSquared = minDist * minDist;
	
	//console.log("Checking collision between actor " + this.id + " and " + otherActor.id + " - distSquared=" + distSquared + " - minDistSquared=" + minDistSquared + " - radius= " + this.radius + " & " + otherActor.radius);
	
	return distSquared <= minDistSquared;
};

Actor.prototype.checkCollisionWith = function(otherActor)
{
	if (this.isCollidingWith(otherActor))
	{
		//console.log("Actor " + this.id + " is colliding with actor " + otherActor.id);
		this.handleCollisionWith(otherActor);
		otherActor.handleCollisionWith(this);
	};
};

Actor.prototype.handleCollisionWith = function(otherActor)
{
	this.damage(otherActor.getCollisionDamage());	
	if (this.collisionSound) this.collisionSound.play();
};

Actor.prototype.doUpdate = function(deltaTimeSec)
{	
	if (this.state == Actor.State.ACTIVE)
	{
		this.checkLifetime();
	}
	if (this.isVisible)
	{
		this.checkSprite();
	}
};

Actor.prototype.canUpdate = function()
{
	return !game.paused && scene.loaded;
};

Actor.prototype.update = function(deltaTimeSec)
{
	if (this.canUpdate())
	{
		this.lifeTimeSec += deltaTimeSec;
		this.doUpdate(deltaTimeSec);
	}
};

Actor.prototype.canRender = function()
{
	return $.isDefined(this.currentSprite);
};

Actor.prototype.doRender = function(g)
{
	this.currentSprite.render(g);
};

Actor.prototype.render = function(g)
{
    if(this.isVisible && this.canRender())
    {
        g.save();
        g.translate(this.x,this.y);
        
        this.doRender(g);
        
        g.restore();
    }
};

Actor.prototype.activate = function()
{
	//console.log("Activating actor " + this.id);
	this.state = Actor.State.ACTIVE;
	this.isVisible = true;
	this.lifeTimeSec = 0;
};

Actor.prototype.kill = function()
{
	//console.log("Killing actor " + this.id);
	var self = this;
	
	this.state = Actor.State.DYING;
	
	if (this.killSound) this.killSound.play();
	
	if (this.killScore > 0)
	{
		player.addScore(this.killScore);
		scene.actors.add(new ScoreFeedback(this, "+" + this.killScore )); 
	}
	
	var doRemove = function(value){ self.remove(); };
	
	if ( this.isVisible && (this.deadSpriteName != ""))
	{
		this.setSprite(this.deadSpriteName, doRemove);
	}
	else
	{
		doRemove(null);
	}
};

Actor.prototype.remove = function()
{
	//console.log("Removing actor");
	this.isVisible = false;
	this.state = Actor.State.DEAD;
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\4-base-actors\2-ActorsContainer.js **/

var ActorsContainer = function()
{
	this.list = {};
};

ActorsContainer.prototype.add = function(actor)
{
	this.list[actor.id] = actor;
};

ActorsContainer.prototype.addAll = function(actorsArray)
{
	for(var actorIndex in actorsArray)
	{
		this.add(actorsArray[actorIndex]);
	}
};

ActorsContainer.prototype.remove = function(actorId)
{
	delete this.list[actorId];
};

ActorsContainer.prototype.clean = function()
{
	var actorsToRemove = [];
	for (var actorId in this.list)
	{
		if (this.list[actorId].state == Actor.State.DEAD)
		{
			actorsToRemove.push(actorId);
		}
	}
	for (var actorToRemoveId in actorsToRemove)
	{
		this.remove(actorsToRemove[actorToRemoveId]);
	}
};

ActorsContainer.prototype.update = function(deltaTimeSec)
{
	for (var actorId in this.list)
	{
		this.list[actorId].update(deltaTimeSec);
	}
};

ActorsContainer.prototype.render = function(g)
{
	for (var actorId in this.list)
	{
		this.list[actorId].render(g);
	}
};

ActorsContainer.prototype.size = function()
{
	return Object.keys(this.list).length;
};

ActorsContainer.prototype.removeAll = function()
{
	for (var actorId in this.list)
	{
		delete this.list[actorId];
	}
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\4-base-actors\3-MovingActor.js **/

var MovingActor = function(id,width,height)
{
	Actor.call(this,id,width,height);
	this.speedX = 0;
	this.speedY = 0;
	this.accelX = 0;
	this.accelY = 0;
	this.minSpeedX = -Infinity;
	this.minSpeedY = -Infinity;
	this.maxSpeedX =  Infinity;
	this.maxSpeedY =  Infinity;
};

MovingActor.prototype = new Actor();

MovingActor.prototype.setSpeed = function(speedX,speedY)
{
	this.speedX = speedX;
	this.speedY = speedY;
};

MovingActor.prototype.updatePosition = function(deltaTimeSec)
{
	var deltaX = this.speedX * deltaTimeSec ;
	var deltaY = this.speedY * deltaTimeSec ;
	this.move(deltaX,deltaY);
};

MovingActor.prototype.updateSpeed = function(deltaTimeSec)
{
	var newSpeedX = this.speedX + this.accelX * deltaTimeSec;
	var newSpeedY = this.speedY + this.accelY * deltaTimeSec; 
	this.speedX = $.clampValue( newSpeedX, this.minSpeedX, this.maxSpeedX );
	this.speedY = $.clampValue( newSpeedY, this.minSpeedY, this.maxSpeedY );
};

MovingActor.prototype.doUpdate = function(deltaTimeSec)
{	
	Actor.prototype.doUpdate.call(this,deltaTimeSec);
	
	if (this.state == Actor.State.ACTIVE)
	{
		this.updatePosition(deltaTimeSec);
		this.updateSpeed(deltaTimeSec);
	}
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\0-Projectile.js **/

var Projectile = function(id,speedX,speedY,width,height,radius)
{
	MovingActor.call(this, id, width, height);

	if ($.isDefined(speedX)) this.speedX = speedX;
	if ($.isDefined(speedY)) this.speedY = speedY;
	if ($.isDefined(radius)) this.radius = radius;
	
	this.isVisible = true;
	this.state = Actor.State.ACTIVE;
	this.health = 1;
};

Projectile.prototype = new MovingActor();



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\1-Bullet.js **/

var Bullet = function(speedY,speedX)
{
	Projectile.call( this, "bullet_" + game.currentFrameTimeMs, speedX, speedY, Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.RADIUS );
	
	this.createSpriteWithUrl("bullet", "bullet", Bullet.SPRITE_NB*Bullet.SPRITE_WIDTH, Bullet.SPRITE_HEIGHT, Bullet.SPRITE_NB, 1, 20, true);
	
	this.setSprite("bullet");
	this.idleSpriteName = "bullet";
	
	this.collisionDamage = Bullet.DAMAGE;
	this.collisionSound = assetManager.getSound("bullet_hit");
};

Bullet.prototype = new Projectile();

Bullet.SPRITE_WIDTH = 1;
Bullet.SPRITE_HEIGHT = 4;
Bullet.SPRITE_NB = 1;
Bullet.RADIUS = 2;
Bullet.DAMAGE = 5;



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\2-FlyingEnemy.js **/

var FlyingEnemy = function(id,width,height,x,y)
{
	if ($.isDefined(id))
	{
		MovingActor.call(this,id,width,height);
		
		this.speedY = 500;
		this.setPosition(x,y);
	
		this.killSound = assetManager.getSound("explosion");
		
		this.createSpriteWithUrl( "explosion", "explosion1", FlyingEnemy.KILL_SPRITE_WIDTH * FlyingEnemy.KILL_SPRITE_NB_COL, FlyingEnemy.KILL_SPRITE_HEIGHT * FlyingEnemy.KILL_SPRITE_NB_ROW, FlyingEnemy.KILL_SPRITE_NB_COL, FlyingEnemy.KILL_SPRITE_NB_ROW, FlyingEnemy.KILL_SPRITE_FPS, false);
		this.deadSpriteName = "explosion";
		
		this.killScore = FlyingEnemy.KILL_SCORE;
	}
};

FlyingEnemy.SHOOT_PROB = 0.05;
FlyingEnemy.SHOOT_SPEED = 1000;
FlyingEnemy.SHOOT_REL_POS_Y = 20;
FlyingEnemy.KILL_SPRITE_NB_ROW = 1;
FlyingEnemy.KILL_SPRITE_NB_COL = 6;
FlyingEnemy.KILL_SPRITE_WIDTH  = 32;
FlyingEnemy.KILL_SPRITE_HEIGHT = 32;
FlyingEnemy.KILL_SPRITE_FPS = 10;
FlyingEnemy.KILL_SCORE = 20;
FlyingEnemy.COLLISION_DAMAGE = 50;

FlyingEnemy.prototype = new MovingActor();

FlyingEnemy.prototype.doUpdate = function(deltaTimeSec)
{	
	MovingActor.prototype.doUpdate.call(this,deltaTimeSec);
	
	if (this.state == Actor.State.ACTIVE)
	{
		this.checkShoot();
	}
};

FlyingEnemy.prototype.getCollisionDamage = function()
{
	return FlyingEnemy.COLLISION_DAMAGE;
};

FlyingEnemy.prototype.checkShoot = function()
{
	if (this.canShoot())
	{
		this.doShoot();
	}
};

FlyingEnemy.prototype.getShootProb = function()
{
	return FlyingEnemy.SHOOT_PROB;
};

FlyingEnemy.prototype.getShootPosition = function()
{
	return { x : this.x, y : this.y + FlyingEnemy.SHOOT_REL_POS_Y };
};

FlyingEnemy.prototype.getShootSpeed = function()
{
	return FlyingEnemy.SHOOT_SPEED;
};

FlyingEnemy.prototype.canShoot = function()
{
	return Math.random() < this.getShootProb();
};

FlyingEnemy.prototype.createProjectile = function()
{
	return new Bullet(this.getShootSpeed());
};

FlyingEnemy.prototype.doShoot = function()
{
	var projectile = this.createProjectile();
	var shootPos = this.getShootPosition();
	projectile.setPosition( shootPos.x, shootPos.y );
	scene.actors.add(projectile);
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\FlyingBoss1.js **/

var FlyingBoss1 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingBoss1.WIDTH, FlyingBoss1.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "explosion", "explosion2", FlyingBoss1.KILL_SPRITE_WIDTH * FlyingBoss1.KILL_SPRITE_NB_COL, FlyingBoss1.KILL_SPRITE_HEIGHT * FlyingBoss1.KILL_SPRITE_NB_ROW, FlyingBoss1.KILL_SPRITE_NB_COL, FlyingBoss1.KILL_SPRITE_NB_ROW, FlyingBoss1.KILL_SPRITE_FPS, false);
	this.createSpriteWithUrl( "attack"   , "boss1"     , FlyingBoss1.WIDTH             * FlyingBoss1.NB_SPRITES_COL,     FlyingBoss1.HEIGHT             * FlyingBoss1.NB_SPRITES_ROW,     FlyingBoss1.NB_SPRITES_COL,     FlyingBoss1.NB_SPRITES_ROW,     FlyingBoss1.SPRITE_FPS,       true);
	
	this.setSprite("attack");
	this.idleSpriteName = "attack";
	this.deadSpriteName = "explosion";
	
	this.speedX = 0;
	this.speedY = 0;
	this.radius = FlyingBoss1.RADIUS;
	this.health = FlyingBoss1.HEALTH;	
	this.killScore = FlyingBoss1.KILL_SCORE;	
	this.currentShootPos = -1;
	this.collisionDamage = FlyingBoss1.COLLISION_DAMAGE;
};

FlyingBoss1.prototype = new FlyingEnemy();

FlyingBoss1.prototype.checkShoot = function()
{
	this.currentShootPos = ++this.currentShootPos % FlyingBoss1.SHOOT_NB_POS ;
	FlyingEnemy.prototype.checkShoot.call(this);
};

FlyingBoss1.prototype.getShootProb = function()
{
	return FlyingBoss1.SHOOT_PROB;
};

FlyingBoss1.prototype.getShootPosition = function()
{
	var sinTime = Math.sin(game.elapsedGameTimeSinceStartup);
	var shootVarX = sinTime * FlyingBoss1.SHOOT_MAX_VAR_X;
	var shootVarY = sinTime * FlyingBoss1.SHOOT_MAX_VAR_Y;
	return { x : this.x + FlyingBoss1.SHOOT_REL_POS_X[this.currentShootPos] + shootVarX, y : this.y + FlyingBoss1.SHOOT_REL_POS_Y[this.currentShootPos] + shootVarY };
};

FlyingBoss1.prototype.createProjectile = function()
{
	return new Bullet( FlyingBoss1.SHOOT_PROJ_SP_Y[this.currentShootPos], FlyingBoss1.SHOOT_PROJ_SP_X[this.currentShootPos] );
};

FlyingBoss1.HEALTH = 1000;
FlyingBoss1.WIDTH = 128;
FlyingBoss1.HEIGHT = 180;
FlyingBoss1.RADIUS = 50;
FlyingBoss1.NB_SPRITES_ROW = 1;
FlyingBoss1.NB_SPRITES_COL = 1;
FlyingBoss1.SPRITE_FPS = 1;
FlyingBoss1.KILL_SPRITE_NB_ROW = 1;
FlyingBoss1.KILL_SPRITE_NB_COL = 6;
FlyingBoss1.KILL_SPRITE_WIDTH  = 65;
FlyingBoss1.KILL_SPRITE_HEIGHT = 65;
FlyingBoss1.KILL_SPRITE_FPS = 10;
FlyingBoss1.COLLISION_DAMAGE = 1000;
FlyingBoss1.SHOOT_PROB = 0.25;
FlyingBoss1.KILL_SCORE = 250;
FlyingBoss1.SHOOT_NB_POS = 5;
FlyingBoss1.SHOOT_REL_POS_X = [  -20,  -20,  20,  20,   0 ];
FlyingBoss1.SHOOT_REL_POS_Y = [  -20,   20,  20, -20,  30 ];
FlyingBoss1.SHOOT_PROJ_SP_X = [ -400, -200, 200, 400,   0 ];
FlyingBoss1.SHOOT_PROJ_SP_Y = [  200,  400, 400, 200, 500 ];
FlyingBoss1.SHOOT_MAX_VAR_X = 10;
FlyingBoss1.SHOOT_MAX_VAR_Y = 10;



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\FlyingEnemy1.js **/

var FlyingEnemy1 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy1.WIDTH, FlyingEnemy1.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy1", FlyingEnemy1.WIDTH * FlyingEnemy1.NB_SPRITES_COL, FlyingEnemy1.HEIGHT * FlyingEnemy1.NB_SPRITES_ROW, FlyingEnemy1.NB_SPRITES_COL, FlyingEnemy1.NB_SPRITES_ROW, FlyingEnemy1.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
	
	this.speedX = 300 * ( this.isInLeftScreenHalf() ? 1 : -1 );
	this.speedY = 500;
	
	this.killScore = FlyingEnemy1.KILL_SCORE;
};

FlyingEnemy1.prototype = new FlyingEnemy();

FlyingEnemy1.prototype.getShootProb = function()
{
	return FlyingEnemy1.SHOOT_PROB;
};

FlyingEnemy1.WIDTH = 32;
FlyingEnemy1.HEIGHT = 32;
FlyingEnemy1.NB_SPRITES_ROW = 1;
FlyingEnemy1.NB_SPRITES_COL = 3;
FlyingEnemy1.SPRITE_FPS = 20;
FlyingEnemy1.SHOOT_PROB = 0.06;
FlyingEnemy1.KILL_SCORE = 14;



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\FlyingEnemy2.js **/

var FlyingEnemy2 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy2.WIDTH, FlyingEnemy2.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy2", FlyingEnemy2.WIDTH * FlyingEnemy2.NB_SPRITES_COL, FlyingEnemy2.HEIGHT * FlyingEnemy2.NB_SPRITES_ROW, FlyingEnemy2.NB_SPRITES_COL, FlyingEnemy2.NB_SPRITES_ROW, FlyingEnemy2.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
};

FlyingEnemy2.prototype = new FlyingEnemy();

FlyingEnemy2.WIDTH = 32;
FlyingEnemy2.HEIGHT = 32;
FlyingEnemy2.NB_SPRITES_ROW = 1;
FlyingEnemy2.NB_SPRITES_COL = 3;
FlyingEnemy2.SPRITE_FPS = 20;



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\FlyingEnemy3.js **/

var FlyingEnemy3 = function(id,x,y)
{
	FlyingEnemy.call(this, id, FlyingEnemy3.WIDTH, FlyingEnemy3.HEIGHT, x, y );
	
	this.createSpriteWithUrl( "move", "enemy3", FlyingEnemy3.WIDTH * FlyingEnemy3.NB_SPRITES_COL, FlyingEnemy3.HEIGHT * FlyingEnemy3.NB_SPRITES_ROW, FlyingEnemy3.NB_SPRITES_COL, FlyingEnemy3.NB_SPRITES_ROW, FlyingEnemy3.SPRITE_FPS, true);
	this.setSprite("move");
	this.idleSpriteName = "move";
	
	this.killScore = FlyingEnemy3.KILL_SCORE;

	this.health = FlyingEnemy3.HEALTH;
	this.speedY = 700;
};

FlyingEnemy3.prototype = new FlyingEnemy();

FlyingEnemy3.prototype.getShootProb = function()
{
	return FlyingEnemy3.SHOOT_PROB;
};

FlyingEnemy.prototype.getShootSpeed = function()
{
	return FlyingEnemy3.SHOOT_SPEED;
};

FlyingEnemy3.HEALTH = 60;
FlyingEnemy3.WIDTH = 32;
FlyingEnemy3.HEIGHT = 32;
FlyingEnemy3.NB_SPRITES_ROW = 1;
FlyingEnemy3.NB_SPRITES_COL = 3;
FlyingEnemy3.SPRITE_FPS = 20;
FlyingEnemy3.SHOOT_PROB = 0.1;
FlyingEnemy3.KILL_SCORE = 45;
FlyingEnemy3.SHOOT_SPEED = 1200;



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\5-game-actors\ScoreFeedback.js **/

var ScoreFeedback = function(sourceActor,scoreText)
{
	var id = sourceActor.id + "-score-" + ScoreFeedback.SCORE_ID_COUNTER++;
	MovingActor.call(this,id,ScoreFeedback.SCORE_WIDTH,ScoreFeedback.SCORE_HEIGHT);
	
	this.scoreText = scoreText;
	this.deathPeriodSec = ScoreFeedback.SCORE_PERIOD_SEC;
	this.areCollisionsChecked = false;
	
	this.x = sourceActor.x + ScoreFeedback.SCORE_DECAL_X;
	this.y = sourceActor.y + ScoreFeedback.SCORE_DECAL_Y;
	this.speedY = ScoreFeedback.SCORE_SPEED_Y_ORIG;
	this.accelY = ScoreFeedback.SCORE_SPEED_ACCEL;
	this.maxSpeedY = 0;
	
	this.font = "12px Florsn01";
	this.fontStyle = "red";
};

ScoreFeedback.SCORE_WIDTH = 10;
ScoreFeedback.SCORE_HEIGHT = 10;
ScoreFeedback.SCORE_DECAL_X = -10;
ScoreFeedback.SCORE_DECAL_Y = -10;
ScoreFeedback.SCORE_SPEED_Y_ORIG = -10;
ScoreFeedback.SCORE_SPEED_ACCEL = 10;
ScoreFeedback.SCORE_PERIOD_SEC = 3;
ScoreFeedback.SCORE_ID_COUNTER = 0;

ScoreFeedback.prototype = new MovingActor();

ScoreFeedback.prototype.canRender = function()
{
	return true;
};

ScoreFeedback.prototype.doRender = function(g)
{
	g.font = this.font;
	g.fillStyle = this.fontStyle;
	g.fillText( this.scoreText, 0, 0 );
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\6-levels\0-LevelLoader.js **/

var LevelLoader = function()
{
	this.levelNumber = 0;
	this.levelData = false;
	this.levelScoreId = 0;
	this.levelLoaded = false;
	this.levelLaunched = false;
	this.levelError = false;
};

LevelLoader.prototype.loadLevel = function(levelNumber)
{
	var self = this;
	this.levelNumber = levelNumber;
	this.levelData = false;
	this.levelScoreId = 0;
	this.levelLoaded = false;
	this.levelLaunched = false;
	this.levelError = false;
	
	serverManager.requestLevelData(levelNumber,
	function(data)
	{
		self.onLevelLoaded(data);
	},
	function(error)
	{
		self.onLevelLoadingError(error);
	});	
};

LevelLoader.prototype.onLevelLoaded = function(levelData)
{
	this.levelData = levelData;
	this.levelScoreId = 0;
	this.levelLoaded = true;
	this.levelLaunched = false;
	this.levelError = false;
	this.launchGame();
};

LevelLoader.prototype.onLevelLoadingError = function(error)
{
	this.levelData = false;
	this.levelScoreId = 0;
	this.levelLoaded = false;
	this.levelLaunched = false;
	this.levelError = error;
};

LevelLoader.prototype.launchGame = function()
{
	var self = this;
	serverManager.requestGameStart(function(data)
	{
		self.onLevelLaunched(data);
	},
	function(error)
	{
		self.onLevelLoadingError(error);
	});	
	
};

LevelLoader.prototype.onLevelLaunched = function(levelScoreId)
{
	if (levelScoreId == 0)
	{
		this.onLevelLaunchError('Invalid score ID');
	}
	else
	{
		this.levelScoreId = levelScoreId;
		this.levelLaunched = true;
		this.levelError = false;
	}
};

LevelLoader.prototype.onLevelLaunchError = function(error)
{
	this.levelScoreId = 0;
	this.levelLaunched = false;
	this.levelError = error;
};

LevelLoader.prototype.getLevelNumber = function()
{
	return this.levelNumber;
};

LevelLoader.prototype.getLevelData = function()
{
	return this.levelData;
};

LevelLoader.prototype.getLevelScoreId = function()
{
	return this.levelScoreId;
};

LevelLoader.prototype.isLevelLoaded = function()
{
	return this.levelLoaded;
};

LevelLoader.prototype.isLevelLaunched = function()
{
	return this.levelLaunched;
};

LevelLoader.prototype.isLevelLoadingFailed = function()
{
	return this.levelError;
};

LevelLoader.prototype.getLevelLoadingError = function()
{
	return this.levelError;
};



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\6-levels\1-LevelBuilder.js **/

var LevelBuilder =
{
	parseLevelData : function(levelData)
	{
		//console.log("Parsing level data: " + $.objectToString(levelData));
		var levelProperties = {};
		for(var levelVar in levelData)
		{
			var levelVarContent = levelData[levelVar];
			
			switch(levelVar)
			{
				case "enemies" : levelProperties["enemies"] = this.parseEnemiesData(levelVarContent,"enemy"); break;
				case "boss"    : levelProperties["boss"   ] = this.parseEnemiesData(levelVarContent,"boss" ); break;
				default : levelProperties[levelVar] = levelVarContent; break;
			}
		}
		return levelProperties;
	},
	parseEnemiesData : function(enemiesData,idPrefix)
	{
		//console.log("Parsing enemies data: " + $.objectToString(enemiesData));
		var enemiesObjects = [];
		for(var enemyDataId in enemiesData)
		{
			var enemyData = enemiesData[enemyDataId];
			var enemyObject = this.parseEnemyData( enemyData, idPrefix + enemiesObjects.length + 1 );
			enemiesObjects.push(enemyObject);
		}
		return enemiesObjects;
	},
	parseEnemyData : function(enemyData,id)
	{
		//console.log("Parsing enemy " + id + " data: " + $.objectToString(enemyData));
		var posX = enemyData.posX;
		var posY = enemyData.posY;
		
		switch(enemyData.type)
		{
			case "FlyingEnemy1" : return new FlyingEnemy1(id,posX,posY);
			case "FlyingEnemy2" : return new FlyingEnemy2(id,posX,posY);
			case "FlyingEnemy3" : return new FlyingEnemy3(id,posX,posY);
			case "FlyingBoss1"  : return new  FlyingBoss1(id,posX,posY);
			default : console.log("Unknown enemy type: " + enemyData.type); break;
		}
		
		return null;
	}
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\6-levels\Scene.js **/

var Scene = function()
{
	this.actors = new ActorsContainer();
	this.playerActors = new ActorsContainer();
	this.boss = false;
	this.currentLevel = "";
	this.currentMusic = "";
	this.loaded = false;
};

Scene.State = { STARTING : 0, PLAYING : 1, BOSS_FIGHT : 2, VICTORY : 3, DEAD : 4, RESTARTING : 5, ENDGAME : 6 };

Scene.prototype.reset = function()
{
	this.actors.removeAll();
	this.playerActors.removeAll();
	this.speedY = Scene.CAMERA_SPEED;
	this.state = Scene.State.STARTING;
	this.loaded = false;
	this.stopMusic();
};

Scene.prototype.loadLevel = function(levelProperties)
{
	this.reset();
	this.currentLevel = levelProperties;
	var levelData = LevelBuilder.parseLevelData(levelProperties);
	this.backgroundImage = assetManager.getImage(levelData["background"]);
	this.maxY = this.backgroundImage.height;
	this.cameraY = this.maxY - Scene.SCREEN_HEIGHT;
	this.actors.addAll(levelData["enemies"]);
	this.musics = levelData["musics"];
	this.boss = levelData["boss"][0];
	this.actors.add(this.boss);
	this.loaded = true;
};

Scene.prototype.reloadLevel = function()
{
	var self = this;
	serverManager.requestGameStart(function(data){
		self.loadLevel(self.currentLevel);
	},function(err){
		alert('Error while starting level: ' + err);
		game.launchMainMenu();
	});
};

Scene.prototype.onGameEnd = function(victory)
{
	this.timeSinceEndMs = Date.now();
	this.state = Scene.State.ENDGAME;
	serverManager.requestGameEnd(function(data){
		if (victory) game.onVictory();
		else game.onGameOver();
	},function(err){
		alert('Error while ending game: ' + err);
		game.launchMainMenu();
	});
};

Scene.prototype.launchMusic = function(mode,loop)
{
	this.stopMusic();
	
	if ( $.isDefined(this.musics) && $.isDefined(this.musics[mode]) && (this.musics[mode] != '') )
	{
		//console.log("Loading music " + mode + ( loop ? " in loop" : "" ));
		this.currentMusic = mode;
		var music = assetManager.getSound(this.musics[mode]);
		if (loop) music.playLoop();
		else music.play();
	}
};

Scene.prototype.stopMusic = function(mode)
{
	if (!$.isDefined(mode) && (this.currentMusic != ""))
	{
		mode = this.currentMusic;
	}
	if ( $.isDefined(this.musics) && $.isDefined(mode) && $.isDefined(this.musics[mode]) )
	{
		var music = assetManager.getSound(this.musics[mode]);
		music.stop();
	}
};

Scene.prototype.checkCollisionsBetweenActorsAnd = function(actor)
{
	for (var otherActorId in this.actors.list)
	{
		var otherActor = this.actors.list[otherActorId];
		if (otherActor.state == Actor.State.ACTIVE)
		{
			//console.log("Checking collision between actor " + actor.id + " and actor " + otherActor.id);
			actor.checkCollisionWith(otherActor);
		}
	}
};

Scene.prototype.checkActorsCollision = function()
{
	this.checkCollisionsBetweenActorsAnd(player);
	
	for (var playerActorId in this.playerActors.list)
	{
		var playerActor = this.playerActors.list[playerActorId];
		if (playerActor.state == Actor.State.ACTIVE)
		{
			this.checkCollisionsBetweenActorsAnd(playerActor);
		}
	}
};

Scene.prototype.isActorOutOfXLimits = function(actor)
{
	return actor.isBeforeX(0) || actor.isAfterX(Scene.SCREEN_WIDTH);
};

Scene.prototype.checkActorPosition = function(actor)
{
	if (this.isActorOutOfXLimits(actor))
	{
		actor.remove();
	}
	else
	{
		var actorIsVisibleInY = this.isActorVisibleInY(actor);
		
		if (actor.state == Actor.State.INACTIVE)
		{
			if (actorIsVisibleInY)
			{
				//console.log("Inactive actor " + actor.id + " becomes visible, activation");
				actor.activate();
			}
		}
		else if (actor.state == Actor.State.ACTIVE)
		{
			if (!actorIsVisibleInY)
			{
				//console.log("Active actor " + actor.id + " becomes invisible, removal");
				actor.remove();
			}
		}
	}
};

Scene.prototype.checkActorsPosition = function()
{
	for (var actorId in this.actors.list)
	{
		var actor = this.actors.list[actorId];
		this.checkActorPosition(actor);
	}
	for (var actorId in this.playerActors.list)
	{
		var actor = this.playerActors.list[actorId];
		this.checkActorPosition(actor);
	}
};

Scene.prototype.getCameraPosition = function()
{
	return this.cameraY;
};

Scene.prototype.updateCameraPosition = function(deltaTimeSec)
{
	if (this.state == Scene.State.PLAYING)
	{
		this.cameraY += this.speedY * deltaTimeSec;
		this.cameraY = $.clampValue( this.cameraY, 0, this.maxY - Scene.SCREEN_HEIGHT );
	}
};

Scene.prototype.getMinVisibleY = function()
{
	return this.cameraY - Scene.VISIBILITY_OFFSET;
};

Scene.prototype.getMaxVisibleY = function()
{
	return this.cameraY + Scene.SCREEN_HEIGHT + Scene.VISIBILITY_OFFSET;
};

Scene.prototype.isActorVisibleInY = function(actor)
{
	return !actor.isBeforeY(this.getMinVisibleY()) && !actor.isAfterY(this.getMaxVisibleY());
};

Scene.prototype.isBossKilled = function()
{
	return this.boss.state == Actor.State.DEAD ;
};

Scene.prototype.updateState = function()
{
	switch(this.state)
	{
		case Scene.State.STARTING :
		{
			player.reset();
			this.state = Scene.State.PLAYING;
			this.launchMusic("fight", true);
			break;
		}
		case Scene.State.PLAYING :
		{
			if (player.state == Actor.State.DEAD)
			{
				this.launchMusic("defeat", false);
				this.state = Scene.State.DEAD;
			}
			else if (this.cameraY == 0)
			{
				this.launchMusic("boss", true);
				this.state = Scene.State.BOSS_FIGHT;
			}
			break;
		}
		case Scene.State.BOSS_FIGHT :
		{
			if (player.state == Actor.State.DEAD)
			{
				this.launchMusic("defeat", false);
				this.state = Scene.State.DEAD;
			}
			else if (this.isBossKilled())
			{
				this.launchMusic("victory", false);
				this.state = Scene.State.VICTORY;
			}
			break;
		}
		case Scene.State.VICTORY :
		{
			inputManager.playerControlsEnabled = false;
			if (player.y > -50)
			{
				player.y -= 2;
			}
			else
			{
				this.onGameEnd(true);
			}
			break;
		}
		case Scene.State.DEAD :
		{
			this.onGameEnd(false);
			break;
		}
		case Scene.State.RESTARTING :
		{
			var currentTimeMs = Date.now();
			if ((currentTimeMs - this.timeSinceEndMs) > Scene.WAIT_BEFORE_RESTART_MS)
			{
				this.actors.removeAll();
				this.playerActors.removeAll();
				this.stopMusic();
				this.reloadLevel();
			}
			break;
		}
	}
};

Scene.prototype.update = function(deltaTimeSec)
{
	if (!this.loaded) return;
	
	if (!game.paused)
	{
		this.actors.clean();
		this.actors.update(deltaTimeSec);
		
		this.playerActors.clean();
		this.playerActors.update(deltaTimeSec);
		
		this.updateCameraPosition(deltaTimeSec);
		this.updateState();
		
		this.checkActorsCollision();
		this.checkActorsPosition();
	}	
	//console.log("Camera Y: " + this.cameraY);
	//console.log("Nb actors in scene: " + this.actors.size());
};

Scene.prototype.render = function(g)
{
	if (!this.loaded) return;
	
	g.save();
	
	// go to the origin of the scene, and draw the scene actors from there
    g.translate(0,-this.cameraY);
    g.drawImage(this.backgroundImage,0,0);
    this.actors.render(g);
    this.playerActors.render(g);
    
    g.restore();
};

Scene.CAMERA_SPEED = -40;
Scene.VISIBILITY_OFFSET = 100;
Scene.SCREEN_WIDTH = 800;
Scene.SCREEN_HEIGHT = 600;
Scene.WAIT_BEFORE_RESTART_MS = 4000;



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\0-MenuFrame.js **/

var MenuFrame = function(menuId,title,items,menuExtraClass,menuTitleExtraClass)
{	
	if (!$.isDefined(menuId)) return;
	
	this.$menuFrame = $("<div/>").addClass("menu-frame").attr("id",menuId);
	$(".menu").append(this.$menuFrame);
	if ($.isDefined(menuExtraClass))
	{
		this.$menuFrame.addClass(menuExtraClass);
	}
	
	this.$title = $("<div/>").addClass("menu-frame-title").attr("id",menuId + "-title").append(title);
	this.$menuFrame.append(this.$title);
	if ($.isDefined(menuTitleExtraClass))
	{
		this.$title.addClass(menuTitleExtraClass);
	}
	
	this.$itemDivs = {};
	this.$itemCaptionCallbacks = {};
	
	for (var itemId in items)
	{
		var itemElem = items[itemId];
		var itemType = itemElem.type;
		var itemValidator = itemElem.validator;
		var itemValidatorCallback = itemElem.validatorCallback;
		var itemCaption = itemElem.caption;
		var itemCaptionCallback = itemElem.captionCallback;
		var itemClickCallback = itemElem.clickCallback;
		var itemClass = "menu-frame-"+itemType;
		var itemExtraClass = itemElem.extraClass;
		
		if ($.isDefined(itemValidator))
		{
			if(!itemValidator) continue;
		}
		if ($.isDefined(itemValidatorCallback))
		{
			if(!itemValidatorCallback()) continue;
		}
		
		if ($.isDefined(itemCaptionCallback))
		{
			this.$itemCaptionCallbacks[itemId] = itemCaptionCallback;
			itemCaption = itemCaptionCallback();
		}
		
		var $itemDiv = $("<div/>").addClass("menu-frame-item").addClass(itemClass).attr("id",menuId + "-" + itemId).html(itemCaption);
		this.$menuFrame.append($itemDiv);
		this.$itemDivs[itemId] = $itemDiv;
		
		if ($.isDefined(itemExtraClass))
		{
			$itemDiv.addClass(itemExtraClass);
		}
		if ($.isDefined(itemClickCallback))
		{
			$itemDiv.click(itemClickCallback);
		}
	}
};

MenuFrame.prototype.refreshCaptions = function()
{
	for (var itemId in this.$itemCaptionCallbacks)
	{
		var div = this.$itemDivs[itemId];
		var captionCallback = this.$itemCaptionCallbacks[itemId];
		div.html(captionCallback());
	}
};

MenuFrame.prototype.updateState = function(openMenu)
{
    if(openMenu)
    {
    	this.refreshCaptions();
    	this.$menuFrame.addClass("visible");
    }
    else
    {
    	this.$menuFrame.removeClass("visible");
    }
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\1-EndGameMenu.js **/

var EndGameMenu = function(menuId,title)
{
	if (!$.isDefined(menuId)) return;
	
	var items = {
		score1 : {
			type : "text",
			caption : "You scored",
			extraClass : "endgame-menu-score1"
		},
		score2 : {
			type : "text",
			captionCallback : function(){ return game.getPlayerScore() + " points"; },
			extraClass : "endgame-menu-score2"
		},
		restart : {
			type : "option",
			caption : "Restart",
			clickCallback : function(){ game.restart(); },
			extraClass : "endgame-menu-restart"
		},
		exit : {
			type : "option",
			caption : "Exit",
			clickCallback : function(){ game.launchMainMenu(); },
			extraClass : "endgame-menu-exit"
		}
	};
	
	MenuFrame.call(this,menuId,title,items,"endgame-menu","endgame-menu-title");
	this.$screen = $("#screen");
};

EndGameMenu.prototype = new MenuFrame();

EndGameMenu.prototype.updateState = function(gameEnd)
{
	MenuFrame.prototype.updateState.call(this,gameEnd);
	
    if(gameEnd)
    {
    	this.$screen.addClass("paused");
    }
    else
    {
    	this.$screen.removeClass("paused");
    }
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\GameOverMenu.js **/

var GameOverMenu = function()
{
	EndGameMenu.call(this,"game-over-menu","Game Over!");
};

GameOverMenu.prototype = new EndGameMenu();


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\MainMenu.js **/

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
		top : {
			type : "option",
			caption : "Show top scores",
			clickCallback : function(){ game.showTopScoresMenu(); }
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
    	//this.music.playLoop();
    	this.$menuTitleScreen.addClass("visible");
    	this.$screen.addClass("paused");
    }
    else
    {
    	//this.music.stop();
    	this.$menuTitleScreen.removeClass("visible");
    	this.$screen.removeClass("paused");
    }
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\PauseMenu.js **/

var PauseMenu = function()
{
	var items = {
		resume : {
			type : "option",
			caption : "Resume",
			clickCallback : function(){ game.switchPaused(); }
		},
		restart : {
			type : "option",
			caption : "Restart",
			clickCallback : function(){ game.restart(); }
		},
		exit : {
			type : "option",
			caption : "Exit",
			clickCallback : function(){ game.launchMainMenu(); }
		}
	};
	
	MenuFrame.call(this,"pause-menu","Pause",items);
	this.$screen = $("#screen");
};

PauseMenu.prototype = new MenuFrame();

PauseMenu.prototype.updateState = function(paused)
{
	MenuFrame.prototype.updateState.call(this,paused);
	
    if(paused)
    {
    	this.$screen.addClass("paused");
    }
    else
    {
    	this.$screen.removeClass("paused");
    }
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\TopScoresMenu.js **/

var TopScoresMenu = function()
{
	this.music = assetManager.getSound("music-menu");
	this.scores = [];
	var self = this;
	
	var items = {
		list : {
			type : "text",
			captionCallback : function(){ return self.getTopScores(); }
		},
		back : {
			type : "option",
			caption : "Back",
			clickCallback : function(){ game.launchMainMenu(); }
		}
	};
	
	MenuFrame.call(this,"top-scores","Top Scores",items);	
	this.$screen = $("#screen");
};

TopScoresMenu.prototype = new MenuFrame();

TopScoresMenu.prototype.getTopScores = function()
{
	var scoresDiv = $('<div/>');
	var scoreList = $('<table/>').addClass("top-scores-table");
	scoresDiv.append(scoreList);
	
	for(var scoreIndex in this.scores)
	{
		var score = this.scores[scoreIndex];
		var scoreItem = $('<tr/>').addClass("top-score-item");
		var scoreValue = $('<td/>').addClass("top-score-value").append(score.value);
		var scoreDate = $('<td/>').addClass("top-score-date");
		var scoreDT = new Date(score.gameDT * 1000).toLocaleDateString(LOCALE.replace('_','-'));
		scoreDate.append(scoreDT);
		scoreItem.append(scoreValue);
		scoreItem.append(scoreDate);
		scoreList.append(scoreItem);
	}

	return scoresDiv.html();
};

TopScoresMenu.prototype.updateState = function(showMenu)
{	
	var self = this;
	
    if(showMenu)
    {
    	serverManager.requestTopScores(function(data)
    	{
    		self.scores = data;
    		MenuFrame.prototype.updateState.call(self,showMenu);
    		//self.music.playLoop();
    		self.$screen.addClass("paused");
    	}
    	,function(err)
    	{
    		alert("Can't get top scores from server: " + err);
    		game.launchMainMenu();
    	});
    }
    else
    {
		MenuFrame.prototype.updateState.call(self,false);
    	//this.music.stop();
    	this.$screen.removeClass("paused");
    }
};


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\7-menus\VictoryMenu.js **/

var VictoryMenu = function()
{
	EndGameMenu.call(this,"victory-menu","Congratulations!");
};

VictoryMenu.prototype = new EndGameMenu();


/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\8-player\Player.js **/

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



/** From file D:\GitHub\raptor-web\raptor-web-static-src\js\9-game\Game.js **/

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
    
    assetManager.startLoading(imageList,soundList);
};

Game.prototype.onAssetsLoaded = function()
{	
	scene = new Scene();
	player = new Player(config.PLAYER);
	
	this.mainMenu = new MainMenu();
	this.topScoresMenu = new TopScoresMenu();
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
	this.topScoresMenu.updateState(false);
	this.victoryMenu.updateState(false);
	this.gameOverMenu.updateState(false);
	this.pauseMenu.updateState(false);
	this.mainMenu.updateState(true);
	this.pause = true;
	this.started = false;
};

Game.prototype.showTopScoresMenu = function()
{
	this.mainMenu.updateState(false);
	this.topScoresMenu.updateState(true);
};

Game.prototype.launchLevel = function(levelNumber)
{
	this.state = Game.State.LEVEL_LOAD;
	this.mainMenu.updateState(false);
	this.topScoresMenu.updateState(false);
	this.victoryMenu.updateState(false);
	this.gameOverMenu.updateState(false);
	levelLoader.loadLevel(levelNumber);
};

Game.prototype.startLevel = function(levelProperties)
{
	scene.loadLevel(levelProperties);
	this.elapsedGameTimeSinceStartup = 0;
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
    		if (levelLoader.isLevelLoadingFailed())
    		{
    			var errorMsg = 'Error while loading level ' + levelLoader.getLevelNumber() + ': ' + JSON.stringify(levelLoader.getLevelLoadingError(), null, '\n');
    			alert(errorMsg);
    			this.launchMainMenu();
    		}
    		else if (levelLoader.isLevelLaunched())
    		{
    			console.log('Switching to state LEVEL_LOAD_END');
    			this.showLoadingScreen(this.graphics, 'Loading level ' + levelLoader.getLevelNumber(), 30, 0.8, 1);
    			//alert(JSON.stringify(levelLoader.getLevelData(), null, '\n'));
    			//alert(levelLoader.getLevelScoreId());
    			this.startLevel(levelLoader.getLevelData());
            	this.timeSinceLoadingEnd = currentTimeMs;
    			this.state = Game.State.LEVEL_LOAD_END;
    		}
    		else if (levelLoader.isLevelLoaded())
    		{
    			this.showLoadingScreen(this.graphics, 'Loading level ' + levelLoader.getLevelNumber(), 30, 0.5, 1);
    		}
    		else
    		{
    			this.showLoadingScreen(this.graphics, 'Loading level ' + levelLoader.getLevelNumber(), 30, 0.2, 1);
    		}    		
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
    		
    		this.showLoadingScreen(this.graphics, 'Loading game', 60, 1, alphaLoad);    		
    		break;
    	}
    	case Game.State.LEVEL_LOAD_END:
    	{    		
    		var alphaLoad = $.tween(1,0,this.timeSinceLoadingEnd,1000,$.easeOutExpoCustom);
    		
    		if (alphaLoad < 0.01)
    		{
    			console.log('Switching to state PLAYING');
    			this.started = true;
    			this.setPaused(false);
    			this.state = Game.State.PLAYING;
    		}
    		
    		this.gameRender(this.graphics);
    		
    		this.showLoadingScreen(this.graphics, 'Loading level ' + this.loadingLevelName, 60, 1, alphaLoad);    		
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
	levelLoader = new LevelLoader();
	game = new Game();
});



