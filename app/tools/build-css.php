<?php

require_once('build-generic.php');

function buildCss()
{
	$basePath = '../../';
	$sourcePath = $basePath . 'raptor-web-static-src/css';
	$targetFile = $basePath . 'raptor-web-static/css/style.css';
	$filesContent = [];
	
	echo NL . NL . "Building CSS style file..." . NL;
	echo "Source path: " . realpath($sourcePath) . NL;
	echo "Target file: " . $targetFile . NL;
	
	
	browseDir($sourcePath,'.css',$filesContent);
	ksort($filesContent);
	
	$fileHeader = '/** ' . NL . '* CSS style file generated on ' . date(DATE_RFC2822) . NL . '**/' . NL ;
	generateConfigFile($targetFile,$filesContent,$fileHeader);
	
	echo "Generation done.";
}