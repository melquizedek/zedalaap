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
use App\Controllers\MainController;
use Interop\Container\ContainerInterface;
use Exception;

class JobController extends MainController
{

	protected $job;
	protected $country;
	protected $industry;
	protected $currency;
	protected $mainModel;

	public function __construct(ContainerInterface $dc)
	{
		$this->job = $dc->get('Job');
		$this->currency = $dc->get('Currency');
		$this->country = $dc->get('Country');
		$this->industry = $dc->get('Industry');
		$this->db = $dc->get('db');
		$this->mainModel = $dc->get('mainModel');

		parent::__construct($dc);
	}

	public function __invoke($request, $response, $args) {}

	public function getCountry($request, $response, $args) {
		
		$fields = $request->getParam('fields', "");
		$where = $request->getParam('where', "");

		$result = array('success' => 0, 'data' => null);

		if ($countries = $this->country->getCountry($fields, $where)) {
			
			$result['success'] = 1;
			$result['data'] = $countries;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function getIndustry($request, $response, $args) {
		
		$fields = $request->getParam('fields', "");
		$where = $request->getParam('where', "");

		$result = array('success' => 0, 'data' => null);

		if ($industries = $this->industry->getIndustry($fields, $where)) {
			
			$result['success'] = 1;
			$result['data'] = $industries;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function getCurrency($request, $response, $args) {
		
		$fields = $request->getParam('fields', "");
		$where = $request->getParam('where', "");

		$result = array('success' => 0, 'data' => null);

		if ($currencies = $this->currency->getCurrency($fields, $where)) {
			
			$result['success'] = 1;
			$result['data'] = $currencies;
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function postJob($request, $response, $args, $job_group_id=null, $postData=null) {
		
		$result = array(
			'success' => true,
			'data' => "New added job has been successfully posted.",
		);

		try {

			$this->db->beginTransaction();

			$formData = (!empty($postData)) ? $postData : $request->getParsedBody();

			//echo '<pre>'; var_dump($formData);

			$employment_type_id = $formData['employment_type_id'];
			$employment_type_text = $formData['employment_type_text'];

			$for_editing = $this->createFile($formData['for_editing'], 'json', 'html_db');
			
			//var_dump($for_editing);exit;
			
			$job_group_name = isset($formData['headline']) ? $formData['headline'] : null;
			$description = isset($formData['headline_desc']) ? $formData['headline_desc'] : null;

			$job_group = array();
			$job_group['post_type_id'] = $formData['post_type_id'];
			$job_group['employment_type_id'] = $employment_type_id;
			$job_group['job_group_name'] = $job_group_name;
			$job_group['description'] = $description;
			$job_group['cover_photo'] = isset($formData['file_name']) ? $formData['file_name'] : null;
			$job_group['duration_start'] = $formData['hiring_duration_from'];
			$job_group['duration_end'] = $formData['hiring_duration_to'];
			$job_group['industry'] = $this->makeJsonStr($formData['jobs'], "industry_text_json");
			$job_group['date_created'] = $this->getDateTime();
			$job_group['for_editing'] = addslashes(json_encode($for_editing));

			$job_group_id = $this->job->insertToJobGroup($job_group, $job_group_id);
			
			$job_details = json_encode(array(
				'job_group_name' => htmlspecialchars($job_group_name, ENT_QUOTES),
				'description' => htmlspecialchars($description, ENT_QUOTES),
			));

			$job_post_id = ""; $job_post = array(); $job_post_ids = array(); $job_object = array();

			foreach ($formData['jobs'] as $job) {
				
				if (!isset($job['job_title']) || !isset($job['industry_text_json'])) continue;

				$job_post_id = isset($job['job_post_id']) ? $job['job_post_id'] : null;

				$job_post = array(
					'employment_type_id' => $employment_type_id,
					'job_group_id' => $job_group_id,
					'job_title' =>  $job['job_title'],
					'salary' => $job['salary'],
					'currency_id' => $job['currency_id'],
					'post_status' => $job['post_status_id'],
					'job_description' => $job['job_desc'],
					'yr_exp' => $job['yr_exp'],
					'date_created' => $this->getDateTime(),
				);

				if ($employment_type_id == 2) {
					$job_post['job_duration_start'] = $job['duration_from'];
					$job_post['job_duration_end'] = $job['duration_to'];
					$job_post['day_time'] = addslashes($job['day_time']);
				}

				if ($employment_type_id == 3) {
					$job_post['job_duration_start'] = $job['duration_from'];
					$job_post['job_duration_end'] = $job['duration_to'];
				}

				$job_post_id = $this->job->insertToJobPost($job_post, $job_post_id);
				
				$job_object = array(
					'job_post_id' => $job_post_id,
					'employment_type' => $employment_type_text,
					'job_post_id' => $job_post_id,
					'job_group_id' => $job_group_id,
					'job_details' => $job_details,
					'duration_start' => $job_group['duration_start'],
					'duration_end' => $job_group['duration_end'],
					'salary' => $job['salary'],
					'currency_code' =>  $job['currency_text'],
					'job_industries' => "[" . implode(",", $job['industry_text']) . "]",
					'country_location' => "[" . implode(",", $job['location_text']) . "]",
					'date_created' => $this->getDateTime(),
				);

				
				if ($employment_type_id == 2) {
					$job_object['job_duration_start'] = $job['duration_from'];
					$job_object['job_duration_end'] = $job['duration_to'];
					$job_object['day_time'] = addslashes($job['day_time']);
				}

				if ($employment_type_id == 3) {
					$job_object['job_duration_start'] = $job['duration_from'];
					$job_object['job_duration_end'] = $job['duration_to'];
				}

				$this->job->insertToJobObject($job_object, $job_post_id);

				$job_post = array(); $job_post_id = ""; $job_object = array();
			}

			$result['job_group_id'] = $job_group_id;

			$this->db->commit();

		} catch (PDOException $e) {
			
			$this->db->rollBack();

			$result = array(
				'success' => false,
				'data' => "Failed..please try again later.",
				'Error Exception:' => "postJob: " . $e->getMessage()
			);
		}
			
		if ($request->isPut()) return $result['job_group_id'];

		return $response->withStatus(200)->withJson($result);
	}

	public function getAppliedApplicant($request, $response, $args) {
		
		//sleep(1);

		$result = array(
			'success' => false,
			'data' => "",
		);

		try {

			$postData = $request->getParsedBody();
			$jobPostId = $postData['job_post_id'];
			//$searchKeys = $postData['searchKeys'];
			
			$fields = "User.first_name,
				User.last_name,
				User.position_preferred AS position,
				UserObjectData.industry AS user_industries,
				UserObjectData.*,
				JobPost.*,
				JobObject.*";

			$where = "AppliedJob.job_id = :job_post_id";

			$queryResults = $this->job->getApplicantApplied($fields, $where,
			 	array(':job_post_id' => $jobPostId));
			
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
						$this->getDateDiff($job['date_created'], date('Y-m-d H:i:s', time()), '%a') . " days ago"
						: "Today"
				); 
			}

			$result['success'] = true;			
			$result['data'] = array(
					'job_post_id' => $jobPostId,
					'job_details' => $job_details,
				 	'applicants' => $queryResults,
			 	);

		} catch (PDOException $e) {

			die($e->getMessage());
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function shortListedFulltime($request, $response, $args)
	{
		$result = array(
			'success' => false,
			'data' => "",
		);

		try {

			$postData = $request->getParsedBody();
			
			$searchKeys = str_replace(array('[', ']', '"'), "", $this->sanitize($postData['searchKeys']));

			$result['success'] = 1;
			$result['data'] = $this->job->getShortListed("", $searchKeys);

		} catch (PDOException $e) {

			$result['data'] = $e->getMessage();
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function jobList($request, $response, $args) 
	{
			$postData = $request->getParsedBody();
			
			$employment_type_id = $postData['employment_type_id'];

			$post_status_id = $postData['post-status-id'];

			$keywords = !empty($postData['keywords']) ? $this->sanitize($postData['keywords']) : "";
				
			$duration_start = !empty($postData['validity-from']) ?
				$this->getDateTime(strtotime($postData['validity-from']), "Y-m-d") : "";
				
			$duration_end = !empty($postData['validity-to']) ?
				$this->getDateTime(strtotime($postData['validity-to']), "Y-m-d") : "";
			
			$fields = "jobObject.job_group_id,
						jobObject.employment_type_id,
						jobObject.post_type_id,
					    jobObject.job_group_name,
					    jobObject.description,
					    jobObject.cover_photo,
					    jobObject.date_created,
					    jobObject.duration_start,
					    jobObject.duration_end,
					    jobObject.salary,
					    jobObject.currency_code,
					    jobObject.job_industries,
					    jobObject.country_location,
					    jobObject.for_editing,
					    jobObject.job_duration_start,
					    jobObject.job_duration_end,
					    jobObject.day_time,
					    jobObject.country_location,
					    jobPost.job_post_id,
					    jobPost.job_title,
					    jobPost.job_description,
					    jobPost.post_status,
					    jobPost.yr_exp,
					    jobPost.date_created";
						
			$where = "jobObject.employment_type_id = {$employment_type_id} 
				AND jobPost.post_status = {$post_status_id}
				AND jobObject.is_deleted = 0";
			
			if (!empty($keywords))
				$where .= " AND MATCH (jobPost.job_title, jobPost.job_description)
					AGAINST ('" . $keywords . "' IN NATURAL LANGUAGE MODE)";
			
			if (!empty($duration_start))
				$where .= " AND jobObject.duration_start >= '{$duration_start}'";
			
			if (!empty($duration_end))
				$where .=" AND jobObject.duration_end <= '{$duration_end}'";
			
			$sqlResponseData = $this->job->jobList($fields,
				$where, 
				"jobPost.job_post_id",
				"jobObject.date_created DESC",
				"");
				
			$jobList = array();
			
			foreach ($sqlResponseData as $key => $value)
			{	
				$jobList['groupJobs'][$value['job_group_id']]
					= array(
						'job_group_id' => $value['job_group_id'],
						'employment_type_id' => $value['employment_type_id'],
						'post_type_id' => $value['post_type_id'],
						'job_group_name' => $this->sanitize($value['job_group_name']),
						'description' => $this->sanitize($value['description']),
						'cover_photo' => $value['cover_photo'],
						'date_created' => $value['date_created'],
						'duration_start' => $this->getDateTime(strtotime($value['duration_start']), "M, d, Y"),
						'duration_end' => $this->getDateTime(strtotime($value['duration_end']), "M, d, Y"),
						'for_editing' => stripcslashes($value['for_editing']),
					);
			}

			$countJobs = 0;
			foreach ($sqlResponseData as $key => $value)
			{
				$countJobs++;
				
				$posted_date = (strtotime($value['date_created']) < time()) ? 
						$this->getDateDiff($value['date_created'], date('Y-m-d H:i:s', time()), '%a') . " days ago" : "Today";

				$jobList['groupJobs'][$value['job_group_id']]['jobs'][]
					= array(
						'job_group_id' => $value['job_group_id'],
						'job_post_id' => $value['job_post_id'],
						'job_title' => $this->sanitize($value['job_title']),
						'job_description' => $this->sanitize($value['job_description']),
						'salary' => $value['salary'],
						'currency_code' => $value['currency_code'],
						'post_status' => $value['post_status'],
						'yr_exp' => $value['yr_exp'],
						'country_location' => $value['country_location'],
						'job_industries' => $value['job_industries'],
						'job_duration_start' => $this->getDateTime(strtotime($value['job_duration_start']), "M, d, Y"),
						'job_duration_end' => $this->getDateTime(strtotime($value['job_duration_end']), "M, d, Y"),
						'day_time' => $value['day_time'],
						'date_created' => $value['date_created'],
						'posted_date' => $posted_date
					);
			}
			
			$result['success'] = true;
			$result['data'] = $jobList;
			$result['numJobs'] = $countJobs;

			return $result;
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

		$sql = "UPDATE i_job_group SET is_deleted = 1 
			WHERE job_group_id = '{$job_group_id}'";

		if (!$this->job->updateIsDeleted($sql)) {

			$result = array('success' => 0, 
				'data' => array(
					'msg' => 'Job failed to close..pls try again later.',
					'job_group_id' => $job_group_id,
				)
			);
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function getJob($request, $response, $args)
	{
		$result = array('success' => false, 'data' => null, 'numJobs' => 0);
		
		try {
		
			if ($request->isPost()) 
			{
				$result = $this->jobList($request, $response, $args);
			}

			if ($request->isPut())
			{
				$result = $this->updateJob($request, $response, $args);
			}

		} catch (PDOException $e) {

			exit($e->getMessage());
		}

		return $response->withStatus(200)->withJson($result);
	}

	public function updateJob($request, $response, $args)
	{
		$result = array('success' => false, 'data' => null);

		try {

			$postData = $request->getParsedBody();
			$json_file_id = $postData['json_file_id'];	
			$group_job_id = $postData['job_group_id'];
			$jobs = $postData['jobs'];
			
			$params = array(':job_group_id' => $group_job_id);	
			$where = "i_job_object.job_group_id = :job_group_id";
			
			$job_post_ids = $this->job->getFrom("i_job_object", "job_post_id", $where, $params);

			foreach ($jobs as $jobIndex => $job) {
				
				list($job, $index) = explode("-", $jobIndex);

				if (isset($job_post_ids[$index]['job_post_id'])) 
					$postData['jobs'][$jobIndex]['job_post_id'] = $job_post_ids[$index]['job_post_id'];
			}
			
			$sql = "DELETE FROM i_job_group
				WHERE job_group_id = '{$group_job_id}'";
		
			if (!$this->db->prepare($sql)->execute()) {
				throw new PDOException("updateJob: deleting i_job_group failed.", 1);
			}

			$sql = "DELETE FROM  i_job_post
				WHERE job_group_id = '{$group_job_id}'";

			if (!$this->db->prepare($sql)->execute()) {
				throw new PDOException("updateJob: deleting i_job_post failed.", 1);
			}

			$sql = "DELETE FROM  i_job_object
				WHERE job_group_id = '{$group_job_id}'";

			if (!$this->db->prepare($sql)->execute()) {
				throw new PDOException("updateJob: deleting i_job_object failed.", 1);
			}
			
			$this->postJob($request, $response, $args, $group_job_id, $postData);

			$result = array('success' => true, 
				'data' => "Job has been successfully updated.");

			$this->deleteFile($json_file_id . '.json', 'html_db');

		} catch (PDOException $e) {

			$result['data'] = $e->getMessage();
		}

		return $result;
	}

	function publish($request, $response, $args) 
	{
		$result = array('success' => false, 
			'data' => "Server could not process your request..please try later.");
		
		$this->db->beginTransaction();

		try {

			$postData = $request->getParsedBody();
			
			foreach ($postData['job_post_ids'] as $job_post_id) {
				
				$this->job->updateTable('i_job_post', 'i_job_post.post_status = 1', 
					'i_job_post.job_post_id = :job_post_id', 
					array(':job_post_id' => $job_post_id));	
			}
			
			$result['success'] = true;
			$result['message'] = "Job has been successfully publish.";

			$this->db->commit();

		} catch (PDOException $e) {

			$this->db->rollBack();

			die($e->getMessage());
		}

		return $response->withStatus(200)->withJson($result);
	}
}