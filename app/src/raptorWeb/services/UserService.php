<?php

namespace raptorWeb\services;

class UserService
{
	private static function getUser($userId)
	{
		$user = new raptorWeb\model\User();
		$userFound = $user->readWithId($userId);
		if (!$userFound) throw new UserException('Could find user with id ' . $userId);
		return $user;
	}
	
	public static function onGameStart($user)
	{
		raptorWeb\model\Score::purgeOrphansForUser($user->id);
		$score = new raptorWeb\model\Score();
		$score->initForUser($user->id);
		$score->create();
		$_SESSION['score'] = $score;
	}
	
	public static function onGameScoreUpdate($score,$scoreValue,$gameIsDone)
	{
		$score->value = $scoreValue;
		$score->gameDone = $gameIsDone;
		$score->update();
	}
	
	private static function getPasswordHash($password)
	{
		return \passwordHashUtils\PasswordHashUtils::create_hash($password);
	}
	
	private static function validatePassword($inputPassword,$dbPasswordHashed)
	{
		return \passwordHashUtils\PasswordHashUtils::validate_password($inputPassword, $dbPasswordHashed);
	}
	
	public static function registerUser($userName,$password,$firstName,$lastName,$email,$facebookId=0,$checkCredentials=true)
	{
		if ( $checkCredentials && (strlen($login) < raptorWeb\model\User::LOGIN_MIN_LENGTH))
		{
			throw new UserException('The login is too short! It must have at least ' . raptorWeb\model\User::LOGIN_MIN_LENGTH . ' characters.');
		}
		else if ( $checkCredentials && (strlen($password) < raptorWeb\model\User::PASS_MIN_LENGTH))
		{
			throw new UserException('The password is too short! It must have at least ' . raptorWeb\model\User::PASS_MIN_LENGTH . ' characters.');
		}
		else
		{
			$passHash = '';
			if ($password) $passHash = self::getPasswordHash($password);
			$user = new raptorWeb\model\User( 0, $facebookId, $userName, $passHash, $firstName, $lastName, $email);
			$user->create();
			return $user;
		}
	}
	
	public static function registerFacebookUser($fbUser)
	{		
		$userName = $fbUser['first_name'] . '_' . $fbUser['last_name'] . '_' . $fbUser['id'];
		return self::registerUser($userName, '', $fbUser['first_name'], $fbUser['last_name'], $fbUser['email'], $fbUser['id'], false);
	}
	
	public static function loginUser($userName,$password)
	{		
		$user = new raptorWeb\model\User();
		$userFound = $user->read([ 'userName' => $userName ]);
	
		if ($userFound && self::validatePassword($password, $user->password))
		{
			$_SESSION['user'] = $user;
			return $user;
		}
		else
		{
			return null;
		}
	}
	
	public static function loginFacebookUser(\Facebook $fb)
	{
		// check logged FB user
		$fbUserId = $fb->getUser();
		if (!$fbUserId)
		{
			// not logged -> redirect to login
			self::authentifyAppOnFacebook($fb);
		}
		
		$fbUser = $fb->api('/me');
		
		$user = new raptorWeb\model\User();
		$userFound = $user->read([ 'facebookId' => $fbUserId ]);
		
		// if none, register FB user
		if (!$userFound)
		{			
			$user = self::registerFacebookUser($fbUser);
		}
		
		$_SESSION['user'] = $user;
		
		return true;
	}
	
	public static function loadFacebookFriendsList(\Facebook $fb, $userId)
	{
		$user = self::getUser($userId);
		
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
			
			$user->setFriendsFromFacebookIds($friendsId);
		}
	}
}