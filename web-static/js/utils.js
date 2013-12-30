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

// UNIT TESTS

testValue = $.getDistanceBetweenPointsSquared({x:1,y:1},{x:2,y:1});
if (testValue != 1) console.error("$.getDistanceBetweenPointsSquared is WRONG: " + testValue);
testValue = $.getDistanceBetweenPointsSquared({x:1,y:1},{x:1,y:3});
if (testValue != 4) console.error("$.getDistanceBetweenPointsSquared is WRONG: " + testValue);

testValue = $.expandValueDigits(1234,8);
if (testValue != "00001234") console.error("$.expandValueDigits is WRONG: " + testValue);

