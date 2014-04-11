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
		$this->registerClass('\raptorWeb\model\Score');
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
		return [ 'user_id'   => $this->userId,
				 'game_dt'   => $this->gameDT,
				 'value'     => $this->value,
				 'game_done' => $this->gameDone ];
	}
	
	protected function getDbParamsForReading()
	{
		return [ 'user_id' => $this->userId,
				 'game_dt' => $this->gameDT ];
	}
	
	public static function listForUser($userId,$onlyDone=false)
	{
		$selectParams = [ 'user_id' => $userId ];
		if ($onlyDone) $selectParams['game_done'] = true;
		return Score::select('score', $selectParams, [ 'game_dt' => 'ASC' ]);
	}
	
	public static function purgeOrphansForUser($userId)
	{
		Score::bulkDelete('score', [ 'user_id' => $userId, 'game_done' => false ]);
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
		return json_encode([
			'id'       => $this->id,
			'userId'   => $this->userId,
			'gameDT'   => $this->gameDT,
			'value'    => $this->value,
			'gameDone' => $this->gameDone
		], JSON_PRETTY_PRINT );
	}
}