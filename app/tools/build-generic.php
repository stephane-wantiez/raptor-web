<?php

define('NL',"\n");

function genericFileContentFilter($filePath,$fileContent)
{
	return NL .
		   '/** From file ' . $filePath . ' **/' .
		   NL .
		   NL .
		   $fileContent .
		   NL .
		   NL ;
}

function browseDir($path,$fileExt,&$filesContent)
{
	$fileExtSize = strlen($fileExt);
    $dir = opendir($path);
    echo 'Reading directory ' . $path . NL;
    
    while ($file = readdir($dir))
    {
        $fullPath = realpath($path . '/' . $file);
    
        if (($file != '.') && ($file != '..'))
        {
            if (is_dir($fullPath))
            {
                browseDir($fullPath,$fileExt,$filesContent);
            }
            else if (is_file($fullPath) && (substr($fullPath,-$fileExtSize) == $fileExt))
            {
            	echo 'Reading file ' . $fullPath . NL;
			    $filesContent[$fullPath] = file_get_contents($fullPath);
            }
        }
    }
    
    closedir($dir);
}

function generateConfigFile($targetFile,&$filesContent,$headerText,$fileContentFilter='genericFileContentFilter')
{
    $outputFile = fopen($targetFile,'w');
    fwrite($outputFile, $headerText);

    foreach ( $filesContent as $file => $content )
    {
    	$filePath = realpath($file);
    	$fileText = call_user_func($fileContentFilter,$filePath,$content);
    	fwrite($outputFile,$fileText);
        echo 'File ' . $filePath . ' written' . NL;
    }

    fclose($outputFile);
}
