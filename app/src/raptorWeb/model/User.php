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
	
	// transient data
	public $friends;
	
	public function __construct($id=0,$facebookId=0,$userName="",$password="",$firstName="",$lastName="",$email="")
	{
		parent::__construct('user',$id);
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
		$this->friends    = array();
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
		return array( 'fb_id'      => $this->facebookId,
		              'username'   => $this->userName,
		              'password'   => $this->password,
		              'firstname'  => $this->firstName,
		              'lastname'   => $this->lastName,
		              'email'      => $this->email );
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
			'id'        => $this->id,
			'username'  => $this->userName,
			'firstname' => $this->firstName,
			'lastname'  => $this->lastName,
			'friends'   => $this->friends
		), JSON_PRETTY_PRINT );
	}
	
	public function setFriendsFromFacebookIds($friendsFacebookId)
	{
		foreach ( $friendsFacebookId as $friendFacebookId )
		{
			$friendUser = new User();
			$friendUserFound = $friendUser->read(array( 'fb_id' => $friendFacebookId ));
			
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
};

ActiveRecord::registerClass('user','\raptorWeb\model\User');
