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

Sound.prototype.setMute = function(mute)
{
	this.audio.volume = mute ? 0 : 1;
};
