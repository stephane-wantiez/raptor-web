<?php

namespace raptorWeb\model;

use raptorWeb\services\App;
class Score extends ActiveRecord
{	
	public $userId;
	public $gameDT;
	public $value;
	public $gameDone;
	
	public function __construct($id=0,$userId=0,$gameDT=0,$value=0,$gameDone=false)
	{
		parent::__construct('score',$id);
		$this->fillWithData($id,$userId,$gameDT,$value,$gameDone);
	}
	
	public function fillWithData($id=0,$userId=0,$gameDT=0,$value=0,$gameDone=false)
	{
		$this->id       = $id;
		$this->userId   = $userId;
		$this->gameDT   = $gameDT;
		$this->value    = $value;
		$this->gameDone = $gameDone;
	}
	
	public function fillWithDbTuple($scoreData)
	{
		$this->fillWithData($scoreData->id,
							$scoreData->user_id,
							$scoreData->game_dt,
							$scoreData->value,
							$scoreData->game_done);
	}
	
	protected function fillWithRecord($record)
	{
		parent::fillWithRecord($record);
		$this->userId   = $record->userId;
		$this->gameDT   = $record->gameDT;
		$this->value    = $record->value;
		$this->gameDone = $record->gameDone;
	}
	
	protected function getDbParamsForSaving()
	{
		return array( 'user_id'   => $this->userId,
				      'game_dt'   => $this->gameDT,
				      'value'     => $this->value,
				      'game_done' => $this->gameDone );
	}
	
	protected function getDbParamsForReading()
	{
		return array( 'user_id' => $this->userId,
				      'game_dt' => $this->gameDT );
	}
	
	public static function listForUser($userId,$friendsFb=null,$limit=0)
	{
		$selectParams = array( 'score.game_dt game_dt', 'score.value value', 'user.firstname firstname, user.lastname lastname' );
		$customQueryPart = 'LEFT JOIN user ON user.id=score.user_id';
		$whereParams = array( 'game_done' => true );
		$whereCond = '';
		if ($userId)
		{
			$whereParams['user_id'] = $userId;
		}
		else if ($friendsFb != null)
		{
			$friendsList = join(',',array_values($friendsFb));
			$whereCond = 'fb_id IN (' . $friendsList . ')';
		}
		$orderParams = array( 'score.value' => 'DESC' , 'score.game_dt' => 'DESC' );
		return Score::select('score', $selectParams, $customQueryPart, $whereParams, $whereCond, $orderParams, $limit, false);
	}
	
	public static function purgeOrphansForUser($userId)
	{
		Score::bulkDelete('score', array( 'user_id' => $userId, 'game_done' => false ));
	}
	
	public static function purgeSmallestScores($userId)
	{
		$gameConfig = App::getInstance()->getGameConfig();
		$maxNbScores = $gameConfig['MAX_NB_SCORES_PER_USER'];
		$selectBestScoreQuery1 = 'SELECT id FROM score WHERE user_id=:user_id ORDER BY value DESC LIMIT ' . $maxNbScores;
		$selectBestScoreQuery2 = 'SELECT * FROM (' . $selectBestScoreQuery1 . ') user_scores_tmp'; // needed due to MySQL limitations...
		$deleteCondition = 'id NOT IN (' . $selectBestScoreQuery2 . ')';
		$deleteParams = array( 'user_id' => $userId, 'game_done' => true );
		Score::bulkDelete('score', $deleteParams, $deleteCondition);
	}
	
	public function initForUser($userId)
	{
		$this->userId   = $userId;
		$this->gameDT   = time();
		$this->value    = 0;
		$this->gameDone = false;
	}
	
	public function toJSON()
	{
		return json_encode(array(
			'id'       => $this->id,
			'userId'   => $this->userId,
			'gameDT'   => $this->gameDT,
			'value'    => $this->value,
			'gameDone' => $this->gameDone
		), JSON_PRETTY_PRINT );
	}
};

ActiveRecord::registerClass('score','\raptorWeb\model\Score');
