<?php

namespace raptorWeb\services;

class UserService
{
	private static function getUser($userId)
	{
		$user = new \raptorWeb\model\User();
		$userFound = $user->readWithId($userId);
		if (!$userFound) throw new UserException('Could find user with id ' . $userId);
		return $user;
	}
	
	public static function onGameStart(\raptorWeb\model\User $user)
	{
		\raptorWeb\model\Score::purgeOrphansForUser($user->id);
		$score = new \raptorWeb\model\Score();
		$score->initForUser($user->id);
		$score->create();
		$_SESSION['score'] = $score;
		return $score->id;
	}
	
	public static function onGameScoreUpdate(\raptorWeb\model\Score $score,$scoreIncrement)
	{
		$score->value += $scoreIncrement;
		$score->update();
		return $score->value;
	}
	
	public static function onGameEnd(\raptorWeb\model\Score $score)
	{
		$score->gameDone = true;
		$score->update();
		\raptorWeb\model\Score::purgeSmallestScores($score->userId);
		return $score->id;
	}
	
	public static function dropBomb(\raptorWeb\model\User $user)
	{
		if ($user->nbBombs > 0)
		{
			$user->nbBombs--;
			$user->update();
			return array( 'nbBombs' => $user->nbBombs );
		}
		return 0;
	}
	
	public static function consumeGift(\raptorWeb\model\User $user)
	{
		if ($user->nbGiftBombs > 0)
		{
			$user->nbGiftBombs--;
			$user->update();
			return array( 'nbGiftBombs' => $user->nbGiftBombs );
		}
		return 0;
	}
	
	public static function receiveGift(\raptorWeb\model\User $user)
	{
		$user->nbBombs++;
		$user->update();
	}
	
	public static function listTopScores(\raptorWeb\model\User $user, $maxNbScores)
	{
		$userScores    = \raptorWeb\model\Score::listForUser($user->id, null, $maxNbScores);
		$friendsScores = \raptorWeb\model\Score::listForUser(0, $user->friends, $maxNbScores);
		$allScores     = \raptorWeb\model\Score::listForUser(0, null, $maxNbScores);
		$topScores = array();
		$topScores['user'   ] = $userScores;
		$topScores['friends'] = $friendsScores;
		$topScores['all'    ] = $allScores;
		return $topScores;
	}
	
	public static function getFriendsToInvite(\Facebook $fb, \raptorWeb\model\User $user)
	{
		return self::listFacebookFriends($fb, false, true);
	}
	
	private static function getPasswordHash($password)
	{
		return \passwordHashUtils\PasswordHashUtils::create_hash($password);
	}
	
	private static function validatePassword($inputPassword,$dbPasswordHashed)
	{
		//die('Comparing passwords ['. $inputPassword .'] and [' . $dbPasswordHashed . ']');
		return \passwordHashUtils\PasswordHashUtils::validate_password($inputPassword, $dbPasswordHashed);
	}
	
	public static function authentifyOnFacebook(\Facebook $fb)
	{
		$fbLoginUrl = $fb->getLoginUrl(array(
			'scope'        => 'email,user_likes,publish_actions',
			'redirect_uri' => 'https://apps.facebook.com/' . FB_APP_NAMESPACE
		));
		
		die('<!doctype html><html><body>
			 	<script>
					top.location.href="' . $fbLoginUrl . '"
				</script>
			 </body></html>');
	}
	
	public static function registerUser($userName,$password,$firstName,$lastName,$email,$facebookId="",$checkCredentials=true)
	{
		if ( $checkCredentials && (strlen($userName) < \raptorWeb\model\User::USERNAME_MIN_LENGTH))
		{
			throw new UserException('The user name is too short! It must have at least ' . raptorWeb\model\User::USERNAME_MIN_LENGTH . ' characters.');
		}
		else if ( $checkCredentials && (strlen($password) < \raptorWeb\model\User::PASS_MIN_LENGTH))
		{
			throw new UserException('The password is too short! It must have at least ' . raptorWeb\model\User::PASS_MIN_LENGTH . ' characters.');
		}
		
		$passHash = '';
		if ($password) $passHash = self::getPasswordHash($password);
		$user = new \raptorWeb\model\User( 0, $facebookId, $userName, $passHash, $firstName, $lastName, $email);
		$user->create();
		$_SESSION['user'] = $user;
		return $user;
	}
	
	public static function registerFacebookUser($fbUser)
	{		
		$userName = $fbUser['first_name'] . '_' . $fbUser['last_name'] . '_' . $fbUser['id'];
		return self::registerUser($userName, '', $fbUser['first_name'], $fbUser['last_name'], $fbUser['email'], $fbUser['id'], false);
	}
	
	public static function loginUser($userName,$password)
	{		
		$user = new \raptorWeb\model\User();
		$userFound = $user->read(array( 'username' => $userName ));
		
		//if (!$userFound) throw new UserException('No such user found');
	
		if ($userFound && self::validatePassword($password, $user->password))
		{
			$user->storeConnectionTime();
			$_SESSION['user'] = $user;
			return $user;
		}
		else
		{
			return null;
		}
	}
	
	public static function loginFacebookUser(\Facebook $fb, $config)
	{
		// check logged FB user
		$fbUserId = $fb->getUser();
		if (!$fbUserId)
		{
			// not logged -> redirect to login
			self::authentifyOnFacebook($fb);
		}
		
		$fbUser = $fb->api('/me');
		
		$user = new \raptorWeb\model\User();
		$userFound = $user->read(array( 'fb_id' => $fbUserId ));
		
		// if none, register FB user
		if (!$userFound)
		{			
			$user = self::registerFacebookUser($fbUser);
		}
		
		$maxNbGiftBombs = (int) $config['MAX_NB_GIFT_BOMBS_PER_USER'];
		$timeUntilNextGiftBombInSec = (int) $config['PERIOD_GIFT_BOMBS_SEC'];
		$user->checkGiftBombs($maxNbGiftBombs, $timeUntilNextGiftBombInSec);
		$user->storeConnectionTime();
		$friends = self::listFacebookFriends($fb, true, false);
		$user->friends = isset($friends) && isset($friends['friends']) ? $friends['friends'] : array();
		$_SESSION['user'] = $user;
		
		return true;
	}
	
	public static function listFacebookFriends(\Facebook $fb, $onlyInstalled, $notInstalled)
	{
		$friends = $fb->api('/me/friends?fields=installed,first_name,last_name');
		//die(json_encode($friends));
		$friendsIds = array();
		
		if ($friends && isset($friends["data"]))
		{
			foreach($friends['data'] as $friend)
			{
				$installed = isset($friend['installed']) && $friend['installed'];
				$friend_ok = $onlyInstalled ? $installed : ( $notInstalled ? !$installed : true ); 
				
				if ($friend_ok)
				{
					// key define order of friends in the list
					$friendName = $friend['first_name'] . '_' . $friend['last_name'] . '_' . $friend['id'];
					$friendsIds[$friendName] = array ( 'id' => $friend['id'], 'firstName' => $friend['first_name'], 'lastName' => $friend['last_name'] );
				}
			}
		}
		
		ksort($friendsIds);
		//die(json_encode($friendsIds));
		return array ( 'friends' => $friendsIds );
	}
}