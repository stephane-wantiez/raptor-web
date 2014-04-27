<?php

namespace raptorWeb\model;

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
	
	public static function listForUser($userId,$limit=0)
	{
		$selectParams = array( 'score.game_dt game_dt', 'score.value value', 'user.username user' );
		$customQueryPart = 'LEFT JOIN user ON user.id=score.user_id';
		$whereParams = array( 'game_done' => true );
		if ($userId)
		{
			$whereParams['user_id'] = $userId;
		}
		$orderParams = array( 'score.value' => 'DESC' , 'score.game_dt' => 'DESC' );
		return Score::select('score', $selectParams, $customQueryPart, $whereParams, $orderParams, $limit, false);
	}
	
	public static function purgeOrphansForUser($userId)
	{
		Score::bulkDelete('score', array( 'user_id' => $userId, 'game_done' => false ));
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
