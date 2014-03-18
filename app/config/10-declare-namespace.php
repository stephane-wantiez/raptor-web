<?php

include VENDOR_PATH . 'Zend/Loader/StandardAutoloader.php' ;

$zendLoader = new \Zend\Loader\StandardAutoloader();
$zendLoader->register();

$zendLoader->registerNamespace( 'aes',               VENDOR_PATH . 'aes' );
$zendLoader->registerNamespace( 'passwordHashUtils', VENDOR_PATH . 'passwordHashUtils' );
$zendLoader->registerNamespace( 'raptorWeb',            SRC_PATH . 'raptorWeb' );

include VENDOR_PATH . 'facebook/facebook.php' ;
