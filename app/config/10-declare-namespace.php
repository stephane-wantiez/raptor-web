<?php

include VENDOR_PATH . 'Zend/Loader/StandardAutoloader.php' ;

$zendLoader = new \Zend\Loader\StandardAutoloader();
$zendLoader->register();

$zendLoader->registerNamespace( 'aes',               VENDOR_PATH . 'aes' );
$zendLoader->registerNamespace( 'passwordHashUtils', VENDOR_PATH . 'passwordHashUtils' );
$zendLoader->registerNamespace( 'raptorWeb',            SRC_PATH . 'raptorWeb' );
$zendLoader->registerNamespace( 'raptorWeb\model',      SRC_PATH . 'raptorWeb/model' );
$zendLoader->registerNamespace( 'raptorWeb\services',   SRC_PATH . 'raptorWeb/services' );

include VENDOR_PATH . 'facebook/facebook.php' ;
