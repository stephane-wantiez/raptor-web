var MenuFrame = function(menuId,title,items,menuExtraClass,menuTitleExtraClass)
{	
	if (!$.isDefined(menuId)) return;
	
	this.$menuFrame = $("<div/>").addClass("menu-frame").attr("id",menuId);
	$(".menu").append(this.$menuFrame);
	if ($.isDefined(menuExtraClass))
	{
		this.$menuFrame.addClass(menuExtraClass);
	}
	
	this.$title = $("<div/>").addClass("menu-frame-title").attr("id",menuId + "-title");
	this.$menuFrame.append(this.$title);
	
	this.titleCallback = false;
	var titleStr = title;
	if ($.isFunction(title))
	{
		titleStr = title();
		this.titleCallback = title;
	}
	this.$title.html(titleStr);
	
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
	if (this.titleCallback)
	{
		this.$title.html(this.titleCallback());
	}
	
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