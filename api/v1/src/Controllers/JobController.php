<?php
/**
 * Created by Zed Paala.
 * Date: 11/06/16
 */

namespace App\Controllers;

/**
 * Class JobController
 * @package App\Controllers
 */

use App\Models\Job;
use App\Models\Resources;
use App\Helpers\JobHelper;
use App\Helpers\PostingValidation;

class JobController
{

	protected $Job;
	protected $Resources;
	protected $JobHelper;
	protected $PostingValidation;
	
	public function __construct(Job $Job, Resources $Resources, 
		JobHelper $JobHelper, PostingValidation $PostingValidation) {
		$this->Job = $Job;
		$this->Resources = $Resources;
		$this->JobHelper = $JobHelper;
		$this->PostingValidation = $PostingValidation;
	}

	public function getCountry($request, $response, $args) {
		
		$fields = $request->getParam('fields', "");
		$where = $request->getParam('where', "");

		$result = array('success' => 0, 'data' => null);

		if ($countries = $this->Resources->getCountry($fields, $where)) {
			
			$result['success'] = 1;
			$result['data'] = $countries;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function getIndustry($request, $response, $args) {
		
		$fields = $request->getParam('fields', "");
		$where = $request->getParam('where', "");

		$result = array('success' => 0, 'data' => null);

		if ($industries = $this->Resources->getIndustry($fields, $where)) {
			
			$result['success'] = 1;
			$result['data'] = $industries;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function getCurrency($request, $response, $args) {
		
		$fields = $request->getParam('fields', "");
		$where = $request->getParam('where', "");

		$result = array('success' => 0, 'data' => null);

		if ($currencies = $this->Resources->getCurrency($fields, $where)) {
			
			$result['success'] = 1;
			$result['data'] = $currencies;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function postJob($request, $response, $args) {

		$formData = $request->getParsedBody();
		
		$result = array(
			'success' => false,
			'data' => null,
			'validation' => false,
		);

		//posting data validation - START HERE
		$error = array();
		foreach ($formData as $index => $jobs) 
		{
			if ($index === "employment_type_id")
				$employment_type_id = $jobs;

			if ($index === "headline") {
				$resultVali = $this->PostingValidation->headline($jobs);
				if (!$resultVali[0]) 
					array_push($error, $resultVali[1]);
			}

			if ($index === "headline_desc") {
				$resultVali = $this->PostingValidation->description($jobs);
				if (!$resultVali[0]) 
					array_push($error, $resultVali[1]);
			}

			if ($index === "hiring_duration_from") {
				$resultVali = $this->PostingValidation->hiringDurationFrom($jobs);
				if (!$resultVali[0])
					array_push($error, $resultVali[1]);
			}

			if ($index === "hiring_duration_to") {
				$resultVali = $this->PostingValidation->hiringDurationTo($jobs);
				if (!$resultVali[0])
					array_push($error, $resultVali[1]);
			}

			if (is_array($jobs) AND $index === "jobs") {

				foreach ($jobs as $index2 => $jobs2) 
				{
					$formNum = explode("-", $index2)[1];

					foreach ($jobs2 as $key => $val) 
					{
						if ($key === "job_title") {
							$resultVali	= $this->PostingValidation->jobTitle($val);
							if (!$resultVali[0])
								array_push($error, $resultVali[1]);
						}

						if ($key === "job_desc") {
							$resultVali	= $this->PostingValidation->jobDesc($val);
							if (!$resultVali[0])
								array_push($error, $resultVali[1]);
						}

						if ($key === "salary") {
							$resultVali	= $this->PostingValidation->salary($val);
							if (!$resultVali[0])
								array_push($error, $resultVali[1]);
						}

						if ($key === "currency_id") {
							$resultVali	= $this->PostingValidation->currency($val);
							if (!$resultVali[0])
								array_push($error, $resultVali[1]);
						}

						if ($key === "yr_exp") {
							$resultVali	= $this->PostingValidation->yrExp($val);
							if (!$resultVali[0])
								array_push($error, $resultVali[1]);
						}

						if ($employment_type_id == 2)
						{
							if ($key === "duration_from") {
								$resultVali	= $this->PostingValidation->jobDurationFrom($val);
								if (!$resultVali[0])
									array_push($error, $resultVali[1]);
							}

							if ($key === "duration_to") {
								$resultVali	= $this->PostingValidation->jobDurationTo($val);
								if (!$resultVali[0])
									array_push($error, $resultVali[1]);
							}

							if ($key === "durations") 
							{	
								foreach ($val as $timeStamp => $duraVal) 
								{
									foreach ($duraVal as $key => $val1) 
									{
										if (is_array($val1))
										{		
											foreach ($val1 as $val2)
											{
												if ($key === "duration_time_from") {
													$resultVali	= $this->PostingValidation->durationTimeFrom($val2);
													if (!$resultVali[0])
														array_push($error, $resultVali[1]);
												}

												if ($key === "duration_time_to") {
													$resultVali	= $this->PostingValidation->durationTimeTo($val2);
													if (!$resultVali[0])
														array_push($error, $resultVali[1]);			
												}
											}
										}
							
									}
								}

							}

						}

						if ($employment_type_id == 3) {

							if ($key === "duration_from") {
								$resultVali	= $this->PostingValidation->jobDurationFrom($val);
								if (!$resultVali[0])
									array_push($error, $resultVali[1]);
							}

							if ($key === "duration_to") {
								$resultVali	= $this->PostingValidation->jobDurationTo($val);
								if (!$resultVali[0])
									array_push($error, $resultVali[1]);		
							}
						}
					}

					$resultVali	= $this->PostingValidation->location("location", $jobs2);
					if (!$resultVali[0])
						array_push($error, $resultVali[1]);

					$resultVali	= $this->PostingValidation->industry("industry", $jobs2);
					if (!$resultVali[0])
						array_push($error, $resultVali[1]);
				}

			}
		}

		// Return if there's error
		if (!empty($error)) {
			$result['data'] = $error;
			return $result;
		}
		//posting data validation - END HERE
		
		$result = $this->JobHelper->doJobPosting($formData);
		
		if ($result['success']) 
			$result['data'] = "New added job has been successfully posted.";

		return $response->withStatus(200)->withJson($result);
	}

	public function getAppliedApplicant($request, $response, $args) {
		
		$result = array(
			'success' => true,
			'data' => array(),
		);

		$postData = $request->getParsedBody();
		$jobPostId = $postData['job_post_id'];
		
		$queryResults = $this->Job->getApplicantApplied("", 
			"AppliedJob.job_id = :job_post_id",
		 	array(':job_post_id' => $jobPostId));

		if (!empty($queryResults)) 
		{
			$job_details = null;

			foreach ($queryResults as $job) {
				$job_details = array(
					'job_post_id' => $job['job_post_id'],
					'job_title' => $job['job_title'],
					'job_description' => $job['job_description'],
					'country_location' => $job['country_location'],
					'job_industries' => $job['job_industries'],
					'employment_type_id' => $job['employment_type_id'],
					'duration_end' => $job['duration_end'],
					'job_duration_start' => $job['job_duration_start'],
					'job_duration_end' => $job['job_duration_end'],
					'day_time' => $job['day_time'],
					'currency_code' => $job['currency_code'],
					'salary' => $job['salary'],
					'date_created' => $job['date_created'],
					'yr_exp' => $job['yr_exp'],
					'posted_date' => (strtotime($job['date_created']) < time()) ? 
						$this->JobHelper->getDateDiff($job['date_created'], date('Y-m-d H:i:s', time()), '%a') . " days ago"
						: "Today"
					); 
				}

				$result['data'] = array(
					'job_post_id' => $jobPostId,
					'job_details' => $job_details,
				 	'applicants' => $queryResults,
			 	);

		} else {

			if ($queryResults === false) {
				$result['success'] = false;
			}
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function shortListedFulltime($request, $response, $args)
	{
		$result = array(
			'success' => true,
			'data' => array(),
		);

		$postData = $request->getParsedBody();

		$searchKeys = str_replace(array('[', ']', '"'), 
			"", $this->JobHelper->sanitize($postData['searchKeys']));

		$shortListed = $this->Job->getShortListed("", $searchKeys);

		if (!empty($shortListed)) {
			$result['data'] = $shortListed;
		} else {
			if ($shortListed === false)
				 $result['success'] = false;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function jobList($request, $response, $args) 
	{
		$postData = $request->getParsedBody();
		
		$employment_type_id = $postData['employment_type_id'];

		$post_status_id = $postData['post-status-id'];

		$keywords = !empty($postData['keywords']) ? $this->JobHelper->sanitize($postData['keywords']) : "";
			
		$duration_start = !empty($postData['validity-from']) ?
			$this->JobHelper->getDateTime(strtotime($postData['validity-from']), "Y-m-d") : "";
			
		$duration_end = !empty($postData['validity-to']) ?
			$this->JobHelper->getDateTime(strtotime($postData['validity-to']), "Y-m-d") : "";
		
		$params = array(':employment_type_id' => $employment_type_id,
			':post_status_id' => $post_status_id);

		if (!empty($keywords)) 
			$params[':keywords'] = $keywords;
		
		if (!empty($duration_start)) 
			$params[':duration_start'] = $duration_start;
		
		if (!empty($duration_end))
			$params[':duration_end'] = $duration_end;
		
		$where = array();

		$sqlResponseData = $this->Job->jobList($params, "jobPost.job_post_id",
			"jobObject.date_created DESC", "15");
		
		if ($sqlResponseData === false) {
			return false;
		}

		$jobList = array();
		
		foreach ($sqlResponseData as $key => $value)
		{	
			$jobList['groupJobs'][$value['job_group_id']]
				= array(
					'job_group_id' => $value['job_group_id'],
					'employment_type_id' => $value['employment_type_id'],
					'post_type_id' => $value['post_type_id'],
					'job_group_name' => $this->JobHelper->sanitize($value['job_group_name']),
					'description' => $this->JobHelper->sanitize($value['description']),
					'cover_photo' => $value['cover_photo'],
					'date_created' => $value['date_created'],
					'duration_start' => $this->JobHelper->getDateTime(strtotime($value['duration_start']), "M, d, Y"),
					'duration_end' => $this->JobHelper->getDateTime(strtotime($value['duration_end']), "M, d, Y"),
					'for_editing' => stripcslashes($value['for_editing']),
				);
		}

		$countJobs = 0;
		foreach ($sqlResponseData as $key => $value)
		{
			$countJobs++;
			
			$posted_date = (strtotime($value['date_created']) < time()) ? 
					$this->JobHelper->getDateDiff($value['date_created'], date('Y-m-d H:i:s', time()), '%a') . " days ago" : "Today";

			$jobList['groupJobs'][$value['job_group_id']]['jobs'][]
				= array(
					'job_group_id' => $value['job_group_id'],
					'job_post_id' => $value['job_post_id'],
					'job_title' => $this->JobHelper->sanitize($value['job_title']),
					'job_description' => $this->JobHelper->sanitize($value['job_description']),
					'salary' => $value['salary'],
					'currency_code' => $value['currency_code'],
					'post_status' => $value['post_status'],
					'yr_exp' => $value['yr_exp'],
					'country_location' => $value['country_location'],
					'job_industries' => $value['job_industries'],
					'job_duration_start' => $this->JobHelper->getDateTime(strtotime($value['job_duration_start']), "M, d, Y"),
					'job_duration_end' => $this->JobHelper->getDateTime(strtotime($value['job_duration_end']), "M, d, Y"),
					'day_time' => $value['day_time'],
					'date_created' => $value['date_created'],
					'posted_date' => $posted_date
				);
		}
		
		$result['success'] = true;
		$result['data'] = $jobList;
		$result['numJobs'] = $countJobs;

		return $response->withStatus(200)->withJson($result);
	}

	public function closeJob($request, $response, $args) 
	{
		$job_group_id = $args['group_job_id'];

		$result = array('success' => 1, 
			'data' => array(
				'msg' => 'Job has been successfully closed.', 
				'job_group_id' => $job_group_id
				)
			);

		$where = array(':job_group_id' => $job_group_id);

		if (!$this->Job->updateIsDeleted($where)) {

			$result = array('success' => 0, 
				'data' => array(
					'msg' => 'Job failed to close..pls try again later.',
					'job_group_id' => $job_group_id,
				)
			);
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function updateJob($request, $response, $args)
	{
		$result = array('success' => false, 'data' => null);

		$postData = $request->getParsedBody();

		$json_file_id = $postData['json_file_id'];	
		$group_job_id = $postData['job_group_id'];
		$jobs = $postData['jobs'];
		
		$params = array(':job_group_id' => $group_job_id);	
		$where = "i_job_object.job_group_id = :job_group_id";
		
		$job_post_ids = $this->Job->getFrom("i_job_object", "job_post_id", $where, $params);

		foreach ($jobs as $jobIndex => $job) {
			
			list($job, $index) = explode("-", $jobIndex);

			if (isset($job_post_ids[$index]['job_post_id'])) 
				$postData['jobs'][$jobIndex]['job_post_id'] 
					= $job_post_ids[$index]['job_post_id'];
		}
		
		$condition = array(':job_group_id' => $group_job_id);

		$jobGroupDel = $this->Job->deleteFrom('i_job_group', $condition);
		$jobPostDel = $this->Job->deleteFrom('i_job_post', $condition);
		$jobPostObjectDel = $this->Job->deleteFrom('i_job_object', $condition);

		
		if (!empty($job_post_ids) && $jobGroupDel 
				&& $jobPostDel && $jobPostObjectDel) {
			
			$result = $this->JobHelper->doJobPosting($postData, $group_job_id, "update");

			if ($result['success']) {
				$this->JobHelper->deleteFile($json_file_id . '.json', 'html_db');
				$result['data'] = "Job has been successfully updated.";
			}
		}			

		return $response->withStatus(200)->withJson($result);
	}

	function publish($request, $response, $args) 
	{
		$result = array('success' => false, 
			'data' => "Server could not process your request..please try later.");
		
		$postData = $request->getParsedBody();
		
		$updatedSuccess = false;

		foreach ($postData['job_post_ids'] as $job_post_id) {

			$updatedSuccess = $this->Job->updateTable('i_job_post', 
				'i_job_post.post_status = 1', 
				'i_job_post.job_post_id = :job_post_id', 
				array(':job_post_id' => $job_post_id));	
		}
		
		if ($updatedSuccess) {
			$result['success'] = true;
			$result['data'] = "Job has been successfully publish.";
		}

		return $response->withStatus(200)->withJson($result);
	}
}