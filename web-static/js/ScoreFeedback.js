var ScoreFeedback = function(sourceActor,scoreText)
{
	var id = sourceActor.id + "-score-" + ScoreFeedback.SCORE_ID_COUNTER++;
	MovingActor.call(this,id,ScoreFeedback.SCORE_WIDTH,ScoreFeedback.SCORE_HEIGHT);
	
	this.scoreText = scoreText;
	this.deathPeriodMs = ScoreFeedback.SCORE_PERIOD_MS;
	this.areCollisionsChecked = false;
	
	this.x = sourceActor.x + ScoreFeedback.SCORE_DECAL_X;
	this.y = sourceActor.y + ScoreFeedback.SCORE_DECAL_Y;
	this.speedY = ScoreFeedback.SCORE_SPEED_Y_ORIG;
	this.accelY = ScoreFeedback.SCORE_SPEED_ACCEL;
	this.maxSpeedY = 0;
	
	this.font = "12px 5metrik_bold";
	this.fontStyle = "red";
};

ScoreFeedback.SCORE_WIDTH = 10;
ScoreFeedback.SCORE_HEIGHT = 10;
ScoreFeedback.SCORE_DECAL_X = -10;
ScoreFeedback.SCORE_DECAL_Y = -10;
ScoreFeedback.SCORE_SPEED_Y_ORIG = -10;
ScoreFeedback.SCORE_SPEED_ACCEL = 10;
ScoreFeedback.SCORE_PERIOD_MS = 3000;
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
