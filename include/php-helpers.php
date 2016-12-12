<?php

function serverDocRoot() 
{
	$pattern = '/(([\w-\.])+.php)?$/';
	$host = preg_replace($pattern, "", $_SERVER['SERVER_NAME']);
	$docRoot = preg_replace($pattern, "", $_SERVER['SCRIPT_NAME']);

	return $_SERVER['REQUEST_SCHEME'] . '://' . $host . $docRoot;
}
?>