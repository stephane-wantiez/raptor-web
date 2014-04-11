<?php

require_once('build-generic.php');

function phpFileContentFilter($filePath,$fileContent)
{
	return NL .
		   '/** From file ' . $filePath . ' **/' .
		   NL .
		   NL .
           trim(str_replace('<?php','',$fileContent)) .
		   NL .
		   NL ;
}

function buildConfig( $configType = 'dev' )
{
	echo NL . NL . 'Building PHP config file for ' . $configType . NL;
	
	$mainPath = "../config/";
	$secPath = $mainPath . $configType . '/';
	$outputFileName = '../config.php';
	
	$filesContent = [];
	browseDir($mainPath,'.php',$filesContent, false);
	browseDir($secPath ,'.php',$filesContent, false);
	ksort($filesContent);
	
	$fileHeader = '<?php ' . NL . '/** ' . NL . '* Configuration file generated for ' . $configType . ' on ' . date(DATE_RFC2822) . NL . '**/' . NL;
	generateConfigFile($outputFileName,$filesContent,$fileHeader,'phpFileContentFilter');
}