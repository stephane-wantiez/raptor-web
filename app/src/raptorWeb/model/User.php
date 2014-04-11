<?php

namespace raptorWeb\model;

class User extends ActiveRecord
{
    const LOGIN_MIN_LENGTH = 3;
    const PASS_MIN_LENGTH = 3;
    
    // persistent data
	public $facebookId;
	public $userName;
	public $password;
	public $firstName;
	public $lastName;
	public $email;
	
	// transient data
	public $friends;
	
	public function __construct($id=0,$facebookId=0,$userName="",$password="",$firstName="",$lastName="",$email="")
	{
		parent::__construct('user',$id);
		$this->registerClass('\raptorWeb\model\User');
		$this->fillWithData($id,$facebookId,$userName,$password,$firstName,$lastName,$email);
	}
	
	public function fillWithData($id=0,$facebookId=0,$userName="",$password="",$firstName="",$lastName="",$email="")
	{
		$this->id         = (int) $id;
		$this->facebookId = (int) $facebookId;
		$this->userName   = $userName;
		$this->password   = $password;
		$this->firstName  = $firstName;
		$this->lastName   = $lastName;
		$this->email      = $email;
		$this->friends    = [];
	}
	
	protected function fillWithRecord($record)
	{
		parent::fillWithRecord($record);
		$this->facebookId = (int) $record->facebookId;
		$this->userName   = $record->userName;
		$this->password   = $record->password;
		$this->firstName  = $record->firstName;
		$this->lastName   = $record->lastName;
		$this->email      = $record->email;
		$this->friends    = $record->friends;
	}
	
	public function fillWithDbTuple($userData)
	{
		$this->fillWithData($userData->id,
							$userData->fb_id,
							$userData->username,
							$userData->password,
							$userData->firstname,
							$userData->lastname,
							$userData->email);
	}
	
	protected function getDbParamsForSaving()
	{
		return [ 'fb_id'      => $this->facebookId,
		         'username'   => $this->userName,
		         'firstname'  => $this->firstName,
		         'lastname'   => $this->lastName,
		         'email'      => $this->email ];
	}
	
	protected function getDbParamsForReading()
	{
		return [ 'username' => $this->userName,
				 'fb_id'    => $this->facebookId,
				 'email'    => $this->email ];
	}
	
	public function toJSON()
	{
		return json_encode([
			'id'      => $this->id,
			'name'    => $this->userName,
			'friends' => $this->friends
		], JSON_PRETTY_PRINT );
	}
	
	public function setFriendsFromFacebookIds($friendsFacebookId)
	{
		foreach ( $friendsFacebookId as $friendFacebookId )
		{
			$friendUser = new User();
			$friendUserFound = $friendUser->read([ 'fb_id' => $friendFacebookId ]);
			
			if ($friendUserFound)
			{
				$this->friends[$friendFacebookId] = $friendUser;
			}
			else
			{
				$this->friends[$friendFacebookId] = null;
			}
		}
	}
}