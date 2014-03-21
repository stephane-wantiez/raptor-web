<?php

namespace raptorWeb;

class Record
{	
	private $tableName;
	public $id;
	
	private function __construct($tableName,$id=0)
	{
		$this->tableName = $tableName;
		$this->id = (int) $id;
	}
	
	public function toJSON($params)
	{
		return json_encode($params);
	}
	
	public function toJSON()
	{
		return toJSON([ 'id' => $this->id ]);
	}
	
	public function create($createParams,$readParams)
	{
		$queryParams = "";
		$queryValues = "";
		$firstParam = true;
		
		foreach ( $createParams as $paramName => $paramValue )
		{
			if (!$firstParam)
			{
				$queryParams += ', ';
				$queryValues += ', ';
			}
			
			$queryParams += $paramName;
			$queryValues += ':' . $paramName;
		}
		
		$queryStr = 'INSERT INTO ' . $this->tableName . ' (  ' . $queryParams . ' ) VALUES ( ' . $queryValues . ' )';		
		$query = $db->prepare($queryStr);
			
		if (!$query->execute($createParams))
		{
			throw new DbException("Couldn't execute insert ' . $this->tableName . ' into DB");
		}
		
		$this->read($readParams);
			
		/*$query = $db->prepare('SELECT id FROM ' . $this->tableName . ' WHERE login=:login, facebookId=:facebookId, email=:email');
			
		if (!$query->execute([ 'login' => $this->firstName, 'facebookId' => $this->facebookId, 'email' => $this->email ]))
		{
			throw new DbException("Couldn't get created user from DB");
		}
			
		$userData = $query->fetch();
	
		if (!$userData)
		{
			throw new DbException("Couldn't get created user from DB");
		}
	
		$this->id = $userData->id;*/
	}
	
	public function setUserWithDBValues($data)
	{
		$this->id = $data->id;
	}
	
	public function readFromId($id)
	{
		$queryStr = 'SELECT * FROM ' . $this->tableName . ' WHERE id=:id';	
		$query = $db->prepare($queryStr);
	
		if (!$query->execute([ 'id' => $id ]))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with id ' . $id . ' from DB");
		}
	
		$userData = $query->fetch();
	}
	
	public function read($dbParams)
	{
		$queryStr = 'SELECT * FROM ' . $this->tableName . ' WHERE id=:id';	
		$query = $db->prepare($queryStr);
	
		if (!$query->execute([ 'id' => $id ]))
		{
			throw new DbException("Couldn't load ' . $this->tableName . ' with id ' . $id . ' from DB");
		}
	
		$userData = $query->fetch();
	}
	
	public static function loginFacebook(\Facebook $fb)
	{
		// check logged FB user
		$fbUserId = $fb->getUser();
		if (!$fbUserId)
		{
			// not logged -> redirect to login
			App::authentifyOnFacebook($fb);
		}
	
		$fbUser = $fb->api('/me');
	
		// get DB user tuple for FB user
		$db = App::getInstance()->getDb();
		$query = $db->prepare('SELECT * FROM user WHERE facebookId=:facebookId');
	
		if (!$query->execute([ 'facebookId' => $fbUserId ]))
		{
			throw new DbException("Couldn't get facebook user from DB");
		}
	
		$userData = $query->fetch();
	
		// if none, create DB user from FB user
		if (!$userData)
		{
			$query = $db->prepare('INSERT INTO user (  login,  facebookId,  firstName,  lastName,  email )' .
					' VALUES ( :login, :facebookId, :firstName, :lastName, :email )');
				
			//var_dump($fbUser);
	
			$params = [ 'login' 	=> $fbUser['first_name'],
			'facebookId'  	=> $fbUserId,
			'firstName' => $fbUser['first_name'],
			'lastName'  => $fbUser['last_name'],
			'email'     => $fbUser['email']];
				
			if (!$query->execute($params))
			{
				throw new DbException("Couldn't execute insert facebook user into DB");
			}
				
			$query = $db->prepare('SELECT * FROM user WHERE facebookId=:facebookId');
				
			if (!$query->execute([ 'facebookId' => $fbUserId ]))
			{
				throw new DbException("Couldn't get created facebook user from DB");
			}
				
			$userData = $query->fetch();
	
			if (!$userData)
			{
				throw new DbException("Couldn't get created facebook user from DB");
			}
		}
	
		// save user in session
		$user = new User($userData->id,$userData->login,$userData->facebookId,$userData->firstName,$userData->lastName,$userData->email);
		$user->addPictureToUser();
		$user->loadFacebookFriendsList($fb);
		$_SESSION['user'] = $user;
		//var_dump($user);
		return true;
	}
	
	public static function register($login,$password)
	{
		if (strlen($login) < self::LOGIN_MIN_LENGTH)
		{
			throw new DbException('The login is too short! It must have at least ' . self::LOGIN_MIN_LENGTH . ' characters.');
		}
		else if (strlen($password) < self::PASS_MIN_LENGTH)
		{
			throw new DbException('The password is too short! It must have at least ' . self::PASS_MIN_LENGTH . ' characters.');
		}
		else
		{
			$db = App::getInstance()->getDb();
			$query = $db->prepare('SELECT 1 as value FROM user WHERE login=:login');
	
			if ($query->execute([ 'login' => $login ]))
			{
				if ($query->fetch())
				{
					throw new DbException('The login already exists!');
				}
				else
				{
					$passwordHash = self::getPasswordHash($password);
					$query = $db->prepare('INSERT INTO user ( login, password ) VALUES ( :login , :password )');
	
					if ($query->execute([ 'login' => $login, 'password' => $passwordHash ]))
					{
						return true;
					}
					else
					{
						throw new DbException("Couldn't execute register query on DB");
					}
				}
			}
			else
			{
				throw new DbException("Couldn't execute register check query on DB");
			}
		}
	}
	
	public function delete()
	{
		$db = App::getInstance()->getDb();
		$query = $db->prepare('DELETE FROM user WHERE id=:id');
	
		if (!$query->execute([ 'id' => $this->id ]))
		{
			throw new DbException('Couldn\'t execute delete query on DB');
		}
	}
	
	public function updateFriends($friendsId)
	{
		$queryStr = 'SELECT facebookId AS id, firstName AS name FROM user WHERE facebookId IN ("' . implode('","', $friendsId) . '")';
	
		$db = App::getInstance()->getDb();
		$query = $db->prepare($queryStr);
	
		if (!$query->execute())
		{
			throw new DbException('Couldn\'t execute delete query on DB');
		}
	
		$this->friends = [];
	
		while($friendInfo = $query->fetch())
		{
			$this->friends[] = $friendInfo;
		}
	}
	
	public function loadFacebookFriendsList(\Facebook $fb)
	{
		$friends = $fb->api('/me/friends?fields=installed,first_name');
		//var_dump($friends);
	
		if ($friends && isset($friends["data"]))
		{
			$friendsId = [];
				
			foreach($friends['data'] as $friend)
			{
				if (isset($friend['installed']) && $friend['installed'])
				{
					$friendsId[] = $friend['id'];
				}
			}
				
			$this->updateFriends($friendsId);
		}
	}
}