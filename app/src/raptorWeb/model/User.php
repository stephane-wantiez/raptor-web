<?php

namespace raptorWeb\model;

class User extends Record
{
    const LOGIN_MIN_LENGTH = 3;
    const PASS_MIN_LENGTH = 3;
    
	public $id;
	public $login;
	public $facebookId;
	public $firstName;
	public $lastName;
	public $email;
	public $picture;
	public $friends;
	
	private function __construct($id="",$login="",$facebookId=0,$firstName="",$lastName="",$email="",$picture="")
	{
		$this->id = (int) $id;
		$this->login = $login;
		$this->facebookId = (int) $facebookId;
		$this->firstName = $firstName;
		$this->lastName = $lastName;
		$this->email = $email;
		$this->picture = $picture;
		$this->friends = [];
	}
	
	public function toJSON()
	{
		return json_encode([
			'id'      => $this->id,
			'name'    => $this->login,
			'picture' => $this->picture,
			'friends' => $this->friends
		]);
	}
	
	private static function getPasswordHash($password)
	{
		return \passwordHashUtils\PasswordHashUtils::create_hash($password);
	}
	
	private static function validatePassword($inputPassword,$dbPasswordHashed)
	{
		return \passwordHashUtils\PasswordHashUtils::validate_password($inputPassword, $dbPasswordHashed);
	}
	
	private static function doLogin($userData,$password)
	{
		if ($userData && self::validatePassword($password, $userData->passHash))
		{
			$user = new User($userData->id,$userData->login);
			$_SESSION['user'] = $user;
		}
	}
	
	public static function login($login,$password)
	{
		$user = new User();
		$user->read(['login' => $login], 'User::doLogin', $password);
	}
	
	private function readCallback($userData)
	{
		$this->id 			= $userData['id'];
		$this->login 		= $userData['login'];
		$this->facebookId   = $userData['facebookId'];
		$this->firstName    = $userData['firstName'];;
		$this->lastName  	= $userData['lastName'];
		$this->email 		= $userData['email'];
	}
	
	public function create()
	{
		$createParams = [ 'login' 	   => $this->firstName,
						  'facebookId' => $this->facebookId,
						  'firstName'  => $this->firstName,
						  'lastName'   => $this->lastName,
						  'email'      => $this->email ];
				
		$this->create($createParams);
		
		$readParams = [ 'login' 	 => $this->firstName,
						'facebookId' => $this->facebookId,
						'email' 	 => $this->email ];
		
		$readCallback = array( $this, 'readCallback' );
		
		$this->read($readParams, $readCallback, null);
	}
	
	private static function insertFacebookUser($fbUser)
	{		
		$user = new User( 0, $fbUser['first_name'], $fbUser['id'], $fbUser['first_name'], $fbUser['last_name'], $fbUser['email']);
		$user->addPictureToUser();
		$user->create();
	}
	
	private function addPictureToUser()
	{
		if ($this->facebookId != 0)
		{
			$this->picture = '//graph.facebook.com/' . $this->facebookId . '/picture';
		}
	}
	
	private function setUserWithDBValues($data)
	{
		$this->id = $data->id;
		$this->login = $data->login;
		$this->facebookId = $data->facebookId;
		$this->firstName = $data->firstName;
		$this->lastName = $data->lastName;
		$this->email = $data->email;
		$this->addPictureToUser();
	}
	
	private function loadUser()
	{
		$queryStr = '';
		$params = [];
		
		if ($id != 0)
		{
			$query = 'SELECT * FROM user WHERE id=:id';
			$params = [ 'id' => $this->id ];
		}
		else if ($facebookId != 0)
		{
			$query = 'SELECT * FROM user WHERE facebookId=:facebookId';
			$params = [ 'facebookId' => $this->facebookId ];
		}
		else if ($login != "")
		{
			$query = 'SELECT * FROM user WHERE login=:login';
			$params = [ 'login' => $this->login ];
		}
		else
		{
			throw new UserException('Can\'t load user w/o any key set');
		}
		
		$query = $db->prepare($queryStr);
		
		if (!$query->execute($params))
		{
			throw new UserException("Couldn't load user from DB");
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
			throw new UserException("Couldn't get facebook user from DB");
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
				throw new UserException("Couldn't execute insert facebook user into DB");
			}
			
			$query = $db->prepare('SELECT * FROM user WHERE facebookId=:facebookId');
			
			if (!$query->execute([ 'facebookId' => $fbUserId ]))
			{
				throw new UserException("Couldn't get created facebook user from DB");
			}
			
			$userData = $query->fetch();
		
			if (!$userData)
			{
				throw new UserException("Couldn't get created facebook user from DB");
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
			throw new UserException('The login is too short! It must have at least ' . self::LOGIN_MIN_LENGTH . ' characters.');
		}
		else if (strlen($password) < self::PASS_MIN_LENGTH)
		{
			throw new UserException('The password is too short! It must have at least ' . self::PASS_MIN_LENGTH . ' characters.');
		}
		else
		{
			$db = App::getInstance()->getDb();
			$query = $db->prepare('SELECT 1 as value FROM user WHERE login=:login');
		
			if ($query->execute([ 'login' => $login ]))
			{
				if ($query->fetch())
				{
					throw new UserException('The login already exists!');
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
						throw new UserException("Couldn't execute register query on DB");
					}
				}
			}
			else
			{
				throw new UserException("Couldn't execute register check query on DB");
			}
		}
	}
	
	public function delete()
	{		
		$db = App::getInstance()->getDb();
		$query = $db->prepare('DELETE FROM user WHERE id=:id');
		
		if (!$query->execute([ 'id' => $this->id ]))
		{
			throw new UserException('Couldn\'t execute delete query on DB');
		}
	}
	
	public function updateFriends($friendsId)
	{
		$queryStr = 'SELECT facebookId AS id, firstName AS name FROM user WHERE facebookId IN ("' . implode('","', $friendsId) . '")';
		
		$db = App::getInstance()->getDb();
		$query = $db->prepare($queryStr);
		
		if (!$query->execute())
		{
			throw new UserException('Couldn\'t execute delete query on DB');
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