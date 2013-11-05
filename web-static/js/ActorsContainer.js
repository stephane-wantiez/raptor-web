var ActorsContainer = function()
{
	this.list = [];
};

ActorsContainer.prototype.add = function(actor)
{
	this.list[actor.id] = actor;
};

ActorsContainer.prototype.remove = function(actor)
{
	this.list.splice(actor.id,1);
};

ActorsContainer.prototype.clean = function()
{
	var actorsToRemove = [];
	for (var actor in this.list)
	{
		if (actor.state == Actor.State.DEAD)
		{
			actorsToRemove.push(actor);
		}
	}
	for (var actorToRemove in actorsToRemove)
	{
		this.remove(actorToRemove);
	}
};

ActorsContainer.prototype.update = function(deltaTimeSec)
{
	for (var actor in this.list)
	{
		actor.update(deltaTimeSec);
	}
};
