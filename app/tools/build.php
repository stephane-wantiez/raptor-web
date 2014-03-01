<?php

require_once('build-js.php');
require_once('build-css.php');
require_once('build-config.php');

buildJs();
buildCss();

if ($argc > 1)
{
	buildConfig($argv[1]);
}
else
{
	buildConfig();
}
