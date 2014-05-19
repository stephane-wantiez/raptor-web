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
	this.soundVolumeChangeListeners = [];
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

AssetManager.prototype.loadSound = function(url, id, music, onload)
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
	    
	    if (music)
	    {
		    this.addSoundVolumeChangeListener(function(enabled){
		    	sound.setMute(!enabled);
		    });
	    }
	    
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

AssetManager.prototype.startLoading = function(imgLoadingList, soundLoadingList, musicLoadingList)
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
	for(var i in musicLoadingList)
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
		this.loadSound(soundLoadingList[i], i, false);
	}
	for(var i in musicLoadingList)
	{
		this.loadSound(musicLoadingList[i], i, true);
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

AssetManager.prototype.addSoundVolumeChangeListener = function(listener)
{
	this.soundVolumeChangeListeners.push(listener);
};

AssetManager.prototype.fireSoundVolumeChange = function(enabled)
{
	for(var listenerIndex in this.soundVolumeChangeListeners)
	{
		this.soundVolumeChangeListeners[listenerIndex](enabled);
	}
};
