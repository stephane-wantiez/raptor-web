<?php 
/** 
* Configuration file generated on Tue, 18 Mar 2014 15:32:41 +0100
**/

/** From file C:\workspace\raptor-web\app\config\01-define.php **/

define('NL',"\n");
define('TAB',"\t");
define('BR',"<br/>");

define('PROJECT_PATH', __DIR__ . '/../' ); // relative to compiled config.php file

define('APP_PATH', PROJECT_PATH . 'app/' );
define('VENDOR_PATH', PROJECT_PATH . 'vendor/' );

define('SRC_PATH', APP_PATH . 'src/' );
define('TEMPLATES_PATH', APP_PATH . 'templates/' );

define('ENCRYPT_ENABLED', false );


/** From file C:\workspace\raptor-web\app\config\10-declare-namespace.php **/

include VENDOR_PATH . 'Zend/Loader/StandardAutoloader.php' ;

$zendLoader = new \Zend\Loader\StandardAutoloader();
$zendLoader->register();

$zendLoader->registerNamespace( 'aes',               VENDOR_PATH . 'aes' );
$zendLoader->registerNamespace( 'passwordHashUtils', VENDOR_PATH . 'passwordHashUtils' );
$zendLoader->registerNamespace( 'coursWeb',             SRC_PATH . 'coursWeb' );

include VENDOR_PATH . 'facebook/facebook.php' ;


/** From file C:\workspace\raptor-web\app\config\20-session.php **/

session_name('SIGWEB_SESSID');
session_start();


/** From file C:\workspace\raptor-web\app\config\dev\10-database.php **/

define('DB_DRIVER','mysql');
define('DB_HOST','localhost');
define('DB_NAME','cours-web');
define('DB_USER','root');
define('DB_PASS','');

define('DB_DSN', DB_DRIVER . ':host=' . DB_HOST . ';dbname=' . DB_NAME );


/** From file C:\workspace\raptor-web\app\config\dev\10-uri.php **/

define( 'WEB_STATIC_URI', '/sigWeb-static/' );


/** From file C:\workspace\raptor-web\app\config\dev\20-facebook.php **/

define('FB_APP_ID','663616497013077');
define('FB_APP_SECRET','73deda9ba398def7150573f80d2b1476');
define('FB_APP_NAMESPACE','sigwebswan');


/** From file C:\workspace\raptor-web\app\config\prod\database.php **/

// define DB parameters here
$dbType = "oracle";
