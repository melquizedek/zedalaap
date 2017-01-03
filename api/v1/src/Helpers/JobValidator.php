<?php

/**
* Author: Zed Alaap
* Date: 11/16/16
*/

namespace App\Helpers;

use Exception;

class JobValidator
{
	
	protected $formData;

	function __construct(){}

	public function setDataToValidate($data = array(), $returnPostData = true) {

		$errorMsg = array(); $this->formData = $data; $employment_type_id = null;

		foreach ($this->formData as $fieldsToVal => $jobs) 
		{
			if ($fieldsToVal === "employment_type_id")
				$employment_type_id = $jobs;

			if ($fieldsToVal === "headline")
				$errorMsg['errorMsg'][] = $this->headline($jobs);

			if ($fieldsToVal === "headline_desc")
				$errorMsg['errorMsg'][] = $this->headlineDesc($jobs);

			if ($fieldsToVal === "hiring_duration_from")
				$errorMsg['errorMsg'][] = $this->duration($jobs, 
					"Hiring duration start is required.");

			if ($fieldsToVal === "hiring_duration_to")
				$errorMsg['errorMsg'][] = $this->duration($jobs, 
					"Hiring duration end is required.");

			if (is_array($jobs) AND $fieldsToVal === "jobs") {

				foreach ($jobs as $fieldsToVal2 => $jobs2) 
				{
					$formNum = explode("-", $fieldsToVal2)[1];

					foreach ($jobs2 as $key => $val) 
					{
						
						if ($key === "job_title") {
							$errorMsg['errorMsg'][] = 
								$this->isEmptyStr($val, "Job title is required.", $formNum);
						}

						if ($key === "job_desc") {
							$errorMsg['errorMsg'][] = 
								$this->isEmptyStr($val, "Job description is required.", $formNum);
						}

						if ($key === "salary") {
							$errorMsg['errorMsg'][] = 
								$this->isEmptyStr($val, "Salary is required.", $formNum);
						}

						if ($key === "currency_id") {
							$errorMsg['errorMsg'][] = 
								$this->isEmptyStr($val, "Currency is required.", $formNum);
						}

						if ($key === "yr_exp") {
							$errorMsg['errorMsg'][] = 
								$this->isNumber($val, "Year of experiences is required.", $formNum);
						}

						if ($employment_type_id == 2)
						{
							if ($key === "duration_from")
								$errorMsg['errorMsg'][] = 
									$this->isEmptyStr($val, "Duration from is required.", $formNum);
							if ($key === "duration_to")
								$errorMsg['errorMsg'][] = 
									$this->isEmptyStr($val, "Duration to is required.", $formNum);

							if ($key === "durations") 
							{	
								//echo $key; exit;
								foreach ($val as $timeStamp => $duraVal) 
								{
									foreach ($duraVal as $key => $val1) 
									{
									
										//echo '<pre>'; var_dump($key);
										if (is_array($val1))
										{		
											//echo '<pre>'; var_dump($val1);
											foreach ($val1 as $val2)
											{
												if ($key === "duration_time_from") 
													$errorMsg['errorMsg'][] = 
														$this->isEmptyStr($val2, "Duration time from is required.", $formNum);

												if ($key === "duration_time_to") 
													$errorMsg['errorMsg'][] = 
														$this->isEmptyStr($val2, "Duration time to is required.", $formNum);				
											}
										}
							
									}
								}
								//exit;
							}

						}

						if ($employment_type_id == 3) {

							if ($key === "duration_from")
								$errorMsg['errorMsg'][] = 
									$this->isEmptyStr($val, "Duration from is required.", $formNum);
							if ($key === "duration_to")
								$errorMsg['errorMsg'][] = 
									$this->isEmptyStr($val, "Duration to is required.", $formNum);							
						}
					}

					$errorMsg['errorMsg'][] = $this->notInJobData("location",
						$jobs2, "Location is required.", $formNum);

					$errorMsg['errorMsg'][] = $this->notInJobData("industry",
						$jobs2, "Industry is required.", $formNum);

				}

			}
		}

		$hasError = 0;
		foreach($errorMsg['errorMsg'] as $val) {
			if (!is_null($val)) 
				$hasError++;
		}

		if ($hasError) 
			return $errorMsg;

		if ($returnPostData)
			return $this->formData;
	}

	public function headline($val) {
		
		$headline = trim($val);

		if (empty($headline)) {

			return "Headline is required.";
		}
	}

	public function headlineDesc($val) {
		
		$headline = trim($val);

		if (empty($headline)) {

			return "Headline description is required.";
		}
	}

	public function duration($val, $msg) {
		
		$date = trim($val);

		if (empty($date)) {

			return $msg;
		}
	}

	public function notInJobData($key, $data, $msg, $formNum) {

		if (!array_key_exists($key, $data)) {

			return $msg;
		}
	}

	public function isNumber($val, $msg, $formNum) {
		$str = trim($val);

		if (!is_numeric($val)) {
			return $msg;
		}
	}

	public function isEmptyStr($val, $msg, $formNum) {
		$str = trim($val);

		if (empty($str)) {
			return $msg;
		}
	}

}