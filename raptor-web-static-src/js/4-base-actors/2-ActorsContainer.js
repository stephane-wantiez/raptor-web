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
