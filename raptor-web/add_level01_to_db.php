<?php

require_once('../app/config.php');

$res = raptorWeb\model\Level::insertLevelFromFile('../raptor-web-static/levels/test-level-01.dat');

if ($res)
{
	$level = raptorWeb\model\Level::readLevel(1);
	
	if ($level)
	{
		echo '<html><body><pre>' . json_encode($level,JSON_PRETTY_PRINT) . '</pre></body></html>';
	}
	else
	{
		echo 'Reading failed';
	}
}
else
{
	echo 'Insertion failed';
}
