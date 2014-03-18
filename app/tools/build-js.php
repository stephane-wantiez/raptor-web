<?php

require_once('build-generic.php');

function buildJs()
{
	$basePath = '../../';
	$sourcePath = $basePath . 'raptor-web-static-src/js';
	$targetFile = $basePath . 'raptor-web-static/js/script.js';
	$filesContent = [];
	
	echo NL . NL . "Building JavaScript script file..." . NL;
	echo "Source path: " . realpath($sourcePath) . NL;
	echo "Target file: " . $targetFile . NL;
	
	
	browseDir($sourcePath,'.js',$filesContent);
	ksort($filesContent);
	
	$fileHeader = '/** ' . NL . '* Script file generated on ' . date(DATE_RFC2822) . NL . '**/' . NL ;
	generateConfigFile($targetFile,$filesContent,$fileHeader);
	
	echo "Generation done.";
}