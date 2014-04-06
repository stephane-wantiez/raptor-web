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
    	$_SESSION['locale'] = 'fr_BE';
    	
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
        $userData = false;
        
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
	            if (!isset($_REQUEST['userName']))
	            {
	                $errorMessage = 'The login is missing!';
	            }
	            else if (!isset($_REQUEST['password']))
	            {
	                $errorMessage = 'The password is missing!';
	            }
	            else
	            {
	                $userName = trim($_REQUEST['userName']);
	                $password = $_REQUEST['password'];
	                
	                if (isset($_REQUEST['action-register']))
	                {
	                	$firstName = $_REQUEST['firstName'];
	                	$lastName  = $_REQUEST['lastName'];
	                	$email     = $_REQUEST['email'];
	                	
                		UserService::registerUser($userName, $password, $firstName, $lastName, $email);
                		$this->reloadPageWithParams(['user-created' => $userName]);
	                }
	                else if (isset($_REQUEST['action-login']))
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
}