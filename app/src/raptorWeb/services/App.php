<?php

namespace raptorWeb\services;

class App
{
	const PAGE_LOCATION = 'Location: index.php';
    private static $instance = null;
    private $fb;
    private $db;
    
    private function __construct()
    {
        $this->db = new \PDO( DB_DSN, DB_USER, DB_PASS );
        $this->db->setAttribute( \PDO::ATTR_ERRMODE,            \PDO::ERRMODE_WARNING );
        $this->db->setAttribute( \PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ );
        $this->db->exec('SET CHARACTER SET utf8');
    }
    
    public static function getInstance()
    {
        if (self::$instance === null)
        {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getDb()
    {
    	return $this->db;
    }
    
    private function reloadPage()
    {
    	header(self::PAGE_LOCATION);
    	exit;
    }
    
    private function reloadPageWithParams($params)
    {
    	$loc = self::PAGE_LOCATION;
    	$firstParam = true;
    	foreach($params as $paramKey => $paramValue)
    	{
    		$loc = $loc . ($firstParam ? '?' : '&') . $paramKey . "=" . $paramValue;
    		$firstParam = false;
    	}
    	header($loc);
    	exit;
    }
	
	public static function authentifyOnFacebook(\Facebook $fb)
	{
		$fbLoginUrl = $fb->getLoginUrl([
			'scope'        => 'email,user_likes,publish_actions',
			'redirect_uri' => 'https://apps.facebook.com' . FB_APP_NAMESPACE
		]);
		
		die('<!doctype html><html><body>
			 	<script>
					top.location.href="' . $fbLoginUrl . '"
				</script>
			 </body></html>');
	}
    
    public function run()
    {
    	if (!isset($_SESSION['locale'])) $_SESSION['locale'] = 'fr_BE';
    	/*if (!isset($_SESSION['config']))*/ $_SESSION['config'] = \raptorWeb\model\Config::read();
    	
    	if(defined('FB_APP_ID'))
    	{
    		$this->runFacebook();
    	}
    	else
    	{
    		$this->runStandalone();
    	}
    }
    
    private function runFacebook()
    {
    	$this->fb = new \Facebook([
			'appId'  => FB_APP_ID,
    		'secret' => FB_APP_SECRET	
    	]);
        
    	// received requests from other users in app
        if (isset($_SESSION['request_ids']))
        {
        	$requestList = explode(",", $_SESSION['request_ids']);
        	foreach($requestList as $req)
        	{
        		var_dump($this->fb->api('/'.$req));
        	}
            exit;
        }
    	
    	$signedRequest = $this->fb->getSignedRequest();
    	if (isset($signedRequest['user']['locale']))
    	{
    		$_SESSION['locale'] = $signedRequest['user']['locale'];
    	}
    	
    	UserService::loginFacebookUser($this->fb);
        
        if (isset($_SESSION['user']))
        {
        	include( TEMPLATES_PATH . 'main.tpl' );
        }    	
    }

    private function runStandalone()
    {
        $okMessage = false;
        $errorMessage = false;
        
        if (isset($_REQUEST['user-created']))
        {
        	$okMessage = 'User ' . $_REQUEST['user-created'] . ' created';
        }
        else if (isset($_REQUEST['user-deleted']))
        {
        	$okMessage = 'User deleted';
        }
        
        try
        {        	
	        if (isset($_REQUEST['logout']))
	        {
	        	session_destroy();
				$this->reloadPage();        	
	        }
	        else if (isset($_REQUEST['delete']) && isset($_SESSION['user']))
	        {
	        	$_SESSION['user']->delete();
	        	session_destroy();
				$this->reloadPageWithParams(['user-deleted' => 1]);
	        }
	        else if (isset($_REQUEST['action-login']) || isset($_REQUEST['action-register']))
	        {
	            if (!isset($_REQUEST['username']))
	            {
	                $errorMessage = 'The user name is missing!';
	            }
	            else if (!isset($_REQUEST['password']))
	            {
	                $errorMessage = 'The password is missing!';
	            }
	            else
	            {
	                $userName = trim($_REQUEST['username']);
	                $password = $_REQUEST['password'];
	                
	                if (isset($_REQUEST['action-register']))
	                {
	                	if (!isset($_REQUEST['password2']))
	                	{
	                		$errorMessage = 'The password check is missing!';
	                	}
	                	else 
	                	{	                	
		                	$password2 = $_REQUEST['password2'];
		                	$firstName = $_REQUEST['firstname'];
		                	$lastName  = $_REQUEST['lastname'];
		                	$email     = $_REQUEST['email'];
		                	
		                	if ($password != $password2)
		                	{
		                		$errorMessage = 'The password is invalid!';
		                	}
		                	else
		                	{
		                		try
		                		{
		                			UserService::registerUser($userName, $password, $firstName, $lastName, $email, 0, true);
		                			$this->reloadPageWithParams(['user-created' => $userName]);
		                		}
		                		catch(Exception $e)
		                		{
		                			$errorMessage = $e->getMessage();
		                		}
		                	}
	                	}
	                }
	                else if (isset($_REQUEST['action-login']))
	                {
	                	try
	                	{
		                	$user = UserService::loginUser($userName, $password);
		                	
		                	if ($user == null)
		                	{
		                		$errorMessage = 'Invalid login and/or password for user';
		                	}
		                	else
		                	{
								$this->reloadPage();
		                	}
                		}
                		catch(Exception $e)
                		{
                			$errorMessage = $e->getMessage();
                		}
	                }
	            }
	        }        
        }
        catch(UserException $e)
        {
        	$errorMessage = $e->getMessage();
        }
        
        if (isset($_SESSION['user']))
        {
            include( TEMPLATES_PATH . 'main.tpl' );
        }
        else if(isset($_REQUEST['action-register-page']))
        {
            include( TEMPLATES_PATH . 'register.tpl' );
        }
        else
        {
            include( TEMPLATES_PATH . 'login.tpl' );
        }
    }
    
    private function checkSessionUser()
    {
    	if (!isset($_SESSION['user']))
    	{
    		throw new UserException('The user session has expired');
    	}
    }
    
    private function checkSessionScore()
    {
    	if (!isset($_SESSION['score']))
    	{
    		throw new UserException('No valid score in session');
    	}
    }
    
    public function api($action,$data)
    {
    	$res = false;
    	
   		try
   		{
	    	$this->checkSessionUser();
	    	$user = $_SESSION['user'];
    				
		    switch($action)
		    {
		    	case 'get-level':
		    		$res = \raptorWeb\model\Level::readLevel($data);
		    		break;
		    		
		    	case 'game-start':
		   			UserService::onGameStart($user);
		   			break;
		    			
		   		case 'game-score-update':
		   			$this->checkSessionScore();
		   			$score = $_SESSION['score'];
		   			UserService::onGameScoreUpdate($score, $data, false);
		   			break;
		    			
		   		case 'game-end':
		   			$this->checkSessionScore();
		   			$score = $_SESSION['score'];
		   			UserService::onGameScoreUpdate($score, $data, true);
		   			break;
		    }
   		}
   		catch(UserException $e)
   		{
   			$res = [ 'error' => $e->getMessage(), 'reload' => true ];
   		}
   		
		if ($res) echo json_encode($res);
    }
    
    public function testDB()
    {
    	$user = new \raptorWeb\model\User(0,42,"john_doe","password","John","Doe","john.doe@email.com");
    	$user->create();
    	echo "User:<br/>";
    	echo $user->toJSON() . "<br/>";
    	$user->email = "test@gmail.com";
    	$user->update();
    	echo $user->toJSON() . "<br/>";
    	$score = new \raptorWeb\model\Score(0,$user->id,time(),42,false);
    	$score->create();
    	echo "Score:<br/>";
    	echo $score->toJSON() . "<br/>";
    	$score->value = 666;
    	$score->gameDone = true;
    	$score->update();
    	echo $score->toJSON() . "<br/>";
    	$user->delete();
    }
}