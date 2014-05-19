<?php

namespace raptorWeb\model;

class User extends ActiveRecord
{
    const USERNAME_MIN_LENGTH = 3;
    const PASS_MIN_LENGTH = 3;
    
    // persistent data
	public $facebookId;
	public $userName;
	public $password;
	public $firstName;
	public $lastName;
	public $email;
	public $lastConnectionDT;
	public $nbBombs;
	public $nbGiftBombs;
	public $nextGiftBombDT;
	
	// transient data
	public $friends;
	
	public function __construct($id=0,$facebookId="",$userName="",$password="",$firstName="",$lastName="",$email="",$lastConnectionDT=0,$nbBombs=0,$nbGiftBombs=0,$nextGiftBombDT=0)
	{
		parent::__construct('user',$id);
		$this->fillWithData($id,$facebookId,$userName,$password,$firstName,$lastName,$email,$lastConnectionDT,$nbBombs,$nbGiftBombs,$nextGiftBombDT);
	}
	
	public function fillWithData($id=0,$facebookId="",$userName="",$password="",$firstName="",$lastName="",$email="",$lastConnectionDT=0,$nbBombs=0,$nbGiftBombs=0,$nextGiftBombDT=0)
	{
		$this->id         		= (int) $id;
		$this->facebookId 		= $facebookId;
		$this->userName   		= $userName;
		$this->password   		= $password;
		$this->firstName  		= $firstName;
		$this->lastName   		= $lastName;
		$this->email      		= $email;
		$this->lastConnectionDT = (int) $lastConnectionDT;
		$this->nbBombs    		= (int) $nbBombs;
		$this->nbGiftBombs 		= (int) $nbGiftBombs;
		$this->nextGiftBombDT	= (int) $nextGiftBombDT;
		$this->friends    		= array();
	}
	
	protected function fillWithRecord($record)
	{
		parent::fillWithRecord($record);
		$this->facebookId 		= $record->facebookId;
		$this->userName   		= $record->userName;
		$this->password   		= $record->password;
		$this->firstName  		= $record->firstName;
		$this->lastName   		= $record->lastName;
		$this->email      		= $record->email;
		$this->lastConnectionDT = (int) $record->lastConnectionDT;
		$this->nbBombs    		= (int) $record->nbBombs;
		$this->nbGiftBombs 		= (int) $record->nbGiftBombs;
		$this->nextGiftBombDT	= (int) $record->nextGiftBombDT;
		$this->friends    		= $record->friends;
	}
	
	public function fillWithDbTuple($userData)
	{
		$this->fillWithData($userData->id,
							$userData->fb_id,
							$userData->username,
							$userData->password,
							$userData->firstname,
							$userData->lastname,
							$userData->email,
							$userData->last_cnx_dt,
							$userData->nb_bombs,
							$userData->nb_gift_bombs,
							$userData->next_gift_bomb_dt);
	}
	
	protected function getDbParamsForSaving()
	{
		return array( 'fb_id'       	  => $this->facebookId,
		              'username'    	  => $this->userName,
		              'password'    	  => $this->password,
		              'firstname'   	  => $this->firstName,
		              'lastname'    	  => $this->lastName,
		              'email'       	  => $this->email,
					  'last_cnx_dt' 	  => $this->lastConnectionDT,
					  'nb_bombs'    	  => $this->nbBombs,
					  'nb_gift_bombs'     => $this->nbGiftBombs,
					  'next_gift_bomb_dt' => $this->nextGiftBombDT );
	}
	
	protected function getDbParamsForReading()
	{
		return array( 'username' => $this->userName,
				      'fb_id'    => $this->facebookId,
				      'email'    => $this->email );
	}
	
	public function toJSON()
	{
		return json_encode(array(
			'id'          	 => $this->id,
			'username'    	 => $this->userName,
			'firstname'   	 => $this->firstName,
			'lastname'    	 => $this->lastName,
			'nbBombs'     	 => $this->nbBombs,
			'nbGiftBombs' 	 => $this->nbGiftBombs,
			'nextGiftBombDT' => $this->nextGiftBombDT,
			'friends'        => $this->friends
		));
	}
	
	public function storeConnectionTime()
	{
		$this->lastConnectionDT = time();
		$this->update();
	}
	
	public function checkGiftBombs($maxNbGiftBombs,$timeUntilNextGiftBombInSec)
	{
		if ($this->nbGiftBombs < $maxNbGiftBombs)
		{
			$now = time();
			
			if ($this->nextGiftBombDT <= $now)
			{
				$this->nbGiftBombs++;
				$this->nextGiftBombDT = $now + $timeUntilNextGiftBombInSec;
				$this->update();
			}
		}
	}
	
	/*private function setFriendsFromFacebookIds($friendsFacebookIds)
	{
		$whereCond = 'fb_id IN (' . join(',', $friendsFacebookIds) . ')';
		$orderParams = array( 'username' => 'ASC' );
		$this->friends = ActiveRecord::select('user',null,'',null,$whereCond,$orderParams,0,true);
	}*/
};

ActiveRecord::registerClass('user','\raptorWeb\model\User');
