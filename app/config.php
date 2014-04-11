<?php 
/** 
* Configuration file generated for dev-sa on Fri, 11 Apr 2014 16:30:36 +0200
**/

/** From file C:\workspace\raptor-web\app\config\01-define.php **/

define('NL',"\n");
define('TAB',"\t");
define('BR',"<br/>");

define('PROJECT_PATH', __DIR__ . '/../' ); // relative to compiled config.php file

define('APP_PATH',    PROJECT_PATH . 'app/' );
define('VENDOR_PATH', PROJECT_PATH . 'vendor/' );

define('SRC_PATH',       APP_PATH . 'src/' );
define('TEMPLATES_PATH', APP_PATH . 'templates/' );

define('ENCRYPT_ENABLED', false );


/** From file C:\workspace\raptor-web\app\config\10-declare-namespace.php **/

include VENDOR_PATH . 'Zend/Loader/StandardAutoloader.php' ;

$zendLoader = new \Zend\Loader\StandardAutoloader();
$zendLoader->register();

$zendLoader->registerNamespace( 'aes',               VENDOR_PATH . 'aes' );
$zendLoader->registerNamespace( 'passwordHashUtils', VENDOR_PATH . 'passwordHashUtils' );
$zendLoader->registerNamespace( 'raptorWeb',            SRC_PATH . 'raptorWeb' );
$zendLoader->registerNamespace( 'raptorWeb\model',      SRC_PATH . 'raptorWeb/model' );
$zendLoader->registerNamespace( 'raptorWeb\services',   SRC_PATH . 'raptorWeb/services' );

include VENDOR_PATH . 'facebook/facebook.php' ;


/** From file C:\workspace\raptor-web\app\config\20-session.php **/

session_name('RAPTOR_WEB_SESSID');
session_start();


/** From file C:\workspace\raptor-web\app\config\dev-sa\10-database.php **/

define('DB_DRIVER','mysql');
define('DB_HOST','localhost');
define('DB_NAME','raptor-web');
define('DB_USER','root');
define('DB_PASS','');
define('DB_DEBUG','true');

define('DB_DSN', DB_DRIVER . ':host=' . DB_HOST . ';dbname=' . DB_NAME );


/** From file C:\workspace\raptor-web\app\config\dev-sa\10-uri.php **/

define( 'WEB_STATIC_URI', '/raptor-web-static/' );

