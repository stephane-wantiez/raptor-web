<?php

namespace raptorWeb\model;

class Score extends ActiveRecord
{
	public $userId;
	public $gameDT;
	public $value;
	public $gameDone;
	
	public function Score($id=0,$userId=0,$gameDT=0,$value=0,$gameDone=false)
	{
		parent::ActiveRecord('score',$id);
		$this->fillWithData($id,$userId,$gameDT,$value,$gameDone);
	}
	
	protected function createRecord()
	{
		return new Score();
	}
	
	public function fillWithData($id=0,$userId=0,$gameDT=0,$value=0,$gameDone=false)
	{
		$this->id = $id;
		$this->userId = $userId;
		$this->gameDT = $gameDT;
		$this->value = $value;
		$this->gameDone = $gameDone;
	}
	
	public function fillWithDbTuple($scoreData)
	{
		$this->fillWithData($scoreData['id'],$scoreData['userId'],$scoreData['gameDT'],$scoreData['value'],$scoreData['gameDone']);
	}
	
	protected function getDbParamsForModification()
	{
		return [ 'userId'   => $this->userId,
				 'gameDT'   => $this->gameDT,
				 'value'    => $this->value,
				 'gameDone' => $this->gameDone ];
	}
	
	protected function getDbParamsForReading()
	{
		return [ 'userId' => $this->userId,
				 'gameDT' => $this->gameDT ];
	}
	
	public static function listForUser($userId,$onlyDone=false)
	{
		$selectParams = [ 'userId' => $userId ];
		if ($onlyDone) $selectParams['gameDone'] = true;
		return Score::select('score', $selectParams, [ 'gameDT' => 'ASC' ]);
	}
	
	public static function purgeOrphansForUser($userId)
	{
		Score::bulkDelete('score', [ 'userId' => $userId, 'gameDone' => false ]);
	}
	
	public function initForUser($userId)
	{
		$this->userId = $userId;
		$this->gameDT = time();
		$this->value = 0;
		$this->gameDone = false;
	}
	
	public function toJSON()
	{
		return json_encode([
			'id'       => $this->id,
			'userId'   => $this->userId,
			'value'    => $this->value,
			'gameDone' => $this->gameDone
		]);
	}
}