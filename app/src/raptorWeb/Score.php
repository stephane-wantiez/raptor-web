<?php

namespace raptorWeb;

class Score
{
	public $id;
	public $gameDT;
	public $value;
	
	public function __construct($id,$gameDT,$value)
	{
		$this->id = $id;
		$this->gameDT = $gameDT;
		$this->value = $value;
	}
	
	public function toJSON()
	{
		return json_encode([
			'id'    => $this->id,
			'value' => $this->value
		]);
	}
}