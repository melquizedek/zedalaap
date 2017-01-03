<?php

/**
* Author: Zed Alaap
* Date: 11/13/16
*/

namespace App\Models;

use App\Models\Main;
use PDO;

class Job extends Main
{
	var $PDO;

	function __construct(PDO $db)
	{
		$this->PDO = $db;
		parent::__construct($db);
	}

	public function insertToJobGroup($dataArr=array(), $job_group_id=null) 
	{
		try {
			
			$job_group_id = ($job_group_id) ? $job_group_id : $this->getUniqueId();
			
			$fieldsArr = array();
			$valuesArr = array();

			foreach ($dataArr as $key => $value) {

				$fieldsArr[] = $key;
				$valuesArr[] = '"' . $value . '"';
			}

			$fields = "job_group_id," . implode(",", $fieldsArr);
			$values = "'{$job_group_id}'," . implode(",", $valuesArr);

			$sql = "INSERT INTO i_job_group ({$fields}) VALUES ({$values})";

			$statement = $this->PDO->prepare($sql);
			$statement->execute();

			return $job_group_id;

		} catch(PDOException $e) {
			return false;
		}
	}

	public function insertToJobPost($dataArr=array(), $job_post_id=null) {
		
		try {
			$job_post_id = ($job_post_id) ? $job_post_id : $this->getUniqueId();

			$fieldsArr = array();
			$valuesArr = array();

			foreach ($dataArr as $key => $value) {

				$fieldsArr[] = $key;
				$valuesArr[] = '"' . $value . '"';
			}

			$fields = "job_post_id," . implode(",", $fieldsArr);
			$values = '"' . $job_post_id . '",' . implode(",", $valuesArr);

			$sql = "INSERT INTO i_job_post ({$fields}) VALUES ({$values})";
			
			$statement = $this->PDO->prepare($sql);
			$statement->execute();

			return $job_post_id;

		} catch(PDOException $e) {
			return false;
		}
	}

	public function updateIsDeleted($where = null) 
	{
		$result = false;
		
		$sql = "UPDATE i_job_group SET is_deleted = 1 
			WHERE job_group_id = :job_group_id";

		$statement = $this->PDO->prepare($sql);

	    if ($statement->execute($where)) 
	    	$result = true;

	    return $result;
	}

	public function insertToJobObject($dataArr=array()) {

		try {
			$fieldsArr = array();
			$valuesArr = array();

			foreach ($dataArr as $key => $value) {

				$fieldsArr[] = $key;
				$valuesArr[] = "'" . $value . "'";
			}

			$fields = implode(",", $fieldsArr);
			$values = implode(",", $valuesArr);

			$sql = "INSERT INTO i_job_object ({$fields}) VALUES ({$values})";

			$statement = $this->PDO->prepare($sql);
			$statement->execute();
		
			return true;

		} catch(PDOException $e) {
			return false;
		}
	}

	public function getApplicantApplied($fields="", $where="", $params=array()) {

		try {

			if (!strlen(trim($fields))) {
				$fields = "User.first_name,
				User.last_name,
				User.position_preferred AS position,
				UserObjectData.industry AS user_industries,
				UserObjectData.*,
				JobPost.*,
				JobObject.*";
			}

			$sql = "SELECT {$fields} 
						FROM  i_user_applied_jobs AS AppliedJob
					INNER JOIN 
						i_users_object_data AS UserObjectData ON(UserObjectData.user_id = AppliedJob.user_id)
					INNER JOIN
						i_users AS User ON(User.user_id = UserObjectData.user_id)
					INNER JOIN
						i_job_post AS JobPost ON(JobPost.job_post_id =  AppliedJob.job_id)
					INNER JOIN
						i_job_object AS JobObject ON(JobObject.job_post_id = JobPost.job_post_id)";

			if (strlen(trim($where))) $sql .= " WHERE " . $where;

			$statement = $this->PDO->prepare($sql);  
            $statement->execute($params);
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();

		} catch (PDOException $e) {

			return false;
		}

	}

	public function getShortListed($tblCols="", $searchKeys="", 
		$where="", $orderBy="") {

		try {

			$fields = "JobPost.job_post_id,
					JobPost.job_industries,
					JobPost.job_title,
					JobPost.job_description,
					JobPost.job_industries,
					User.position_preferred,
				    User.first_name,
				    User.last_name,
					User.user_id, 
				    User.personal_info, 
				    User.skills, 
				    User.industry AS user_industries,
				    User.location,
	    			User.nationality";

	    	if (!empty($tblCols)) $fields = $tblCols;

	   		$sql = "SELECT
	   				{$fields}
	   			FROM 
	   				i_user_applied_jobs AS AppliedJob 
	   			INNER JOIN
	   				(
	   					SELECT 
	   						i_job_post.job_post_id,
	    					i_job_post.job_title,
	    					i_job_post.job_description,
	    					i_job_object.job_industries,
	   						i_job_object.country_location,
	   						i_job_object.currency_code
	   					FROM 
	   						i_job_post
	   					INNER JOIN
	   						i_job_object 
	   					ON(i_job_object.job_post_id = i_job_post.job_post_id)
	   				) 
	   				AS JobPost ON(JobPost.job_post_id = AppliedJob.job_id)
	   			INNER JOIN
	   				(
	   					SELECT 
	   						i_users.position_preferred,
						    i_users.first_name,
						    i_users.last_name,
	    					i_users.user_id, 
						    i_users_object_data.location,
			    			i_users_object_data.nationality,
						    i_users_object_data.personal_info, 
						    i_users_object_data.skills, 
						    i_users_object_data.industry
			    		FROM 
	   						i_users_object_data
	   					INNER JOIN
	   						i_users ON(i_users.user_id = i_users_object_data.user_id)
	   				) 
	   				AS User ON(User.user_id = AppliedJob.user_id)
	   			WHERE";

	   			if ( strlen(trim($where)) ) {

	   				$sql .= $where;

	   			} else {

	   				$sql .= " MATCH(JobPost.job_title, JobPost.job_description)
	   					AGAINST ( :searchKeys IN NATURAL LANGUAGE MODE)
	   				OR 
	   					JobPost.country_location LIKE '%:searchKeys%'
	   				OR 
	   					JobPost.currency_code LIKE '%:searchKeys%'
	   				OR
	   					JobPost.job_industries LIKE '%:searchKeys%'
	   				OR 
	   					User.skills LIKE '%:searchKeys%'";
	   			}
	   			
	   			if ( strlen(trim($orderBy)) ) $sql .= $orderBy;

				$statement = $this->PDO->prepare($sql);  
	            $statement->execute(array(':searchKeys' => $searchKeys));
	            $statement->setFetchMode(PDO::FETCH_ASSOC);

	            return $statement->fetchAll();

		} catch (PDOException $e) {
			return false;
		}

	}

	public function getFrom($table="", $fields="", $where="", $params=array()) {

		try {

			$sql = "SELECT {$fields} FROM {$table}";
			
			if (!empty($where)) $sql .= " WHERE " . $where;

			$statement = $this->PDO->prepare($sql);      
	        $statement->execute($params);
	        $statement->setFetchMode(PDO::FETCH_ASSOC);

	        return $statement->fetchAll();

		} catch(PDOException $e) {

			throw new PDOException("Error at getJobPostObject: " . $e->getMessage, 1);
		}
	}

	public function jobList($params=array(), $groupBy="", $orderBy="", $limit="") {

		try {
 			
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

 			$where = "jobObject.employment_type_id = :employment_type_id
				AND jobPost.post_status = :post_status_id
				AND jobObject.is_deleted = 0";

			if (isset($params[':keywords'])) {
				$where .= " AND MATCH (jobPost.job_title, jobPost.job_description)
					AGAINST (:keywords IN NATURAL LANGUAGE MODE)";
			}

			if (isset($params[':duration_start'])) {
				$where .= " AND jobObject.duration_start >= :duration_start";
			}

			if (isset($params[':duration_end'])) {
				$where .=" AND jobObject.duration_end <= :duration_end";
			}

			$sql = "SELECT 
						{$fields}
					FROM
					(
						SELECT 
							jobGroup.employment_type_id,
							jobGroup.job_group_id,
							jobGroup.post_type_id,
							jobGroup.job_group_name,
							jobGroup.description,
							jobGroup.cover_photo,
							jobGroup.date_created,
							jobGroup.duration_start,
							jobGroup.duration_end,
							jobGroup.for_editing,
							jobGroup.is_deleted,
					        jobObject.job_post_id,
					        jobObject.salary,
							jobObject.currency_code,
							jobObject.job_industries,
							jobObject.country_location,
							jobObject.job_duration_start,
							jobObject.job_duration_end,
							jobObject.day_time
					    FROM 
							i_job_group AS jobGroup
					    INNER JOIN 
							i_job_object AS jobObject ON(jobObject.job_group_id = jobGroup.job_group_id)
					) AS jobObject
					INNER JOIN 
						i_job_post AS jobPost ON(jobPost.job_post_id = jobObject.job_post_id)";
					
			if (!empty($where)) $sql .= " WHERE " . $where;
			if (!empty($groupBy)) $sql .= " GROUP BY " . $groupBy;
			if (!empty($orderBy)) $sql .= " ORDER BY " . $orderBy;
			if (!empty($limit)) $sql .= " LIMIT " . $limit;
			
			//echo $sql;exit;
			
			$statement = $this->PDO->prepare($sql);            
	        $statement->execute($params);
	        $statement->setFetchMode(PDO::FETCH_ASSOC);

	        return $statement->fetchAll();

        } catch (PDOException $e) {

        	return false;
		}
	}

	function updateTable($table="", $set="", $where="", $params=null) {

		try {

			$sql = "UPDATE {$table} SET {$set}";
			
			if (!empty($where)) $sql .= " WHERE {$where}";

			$statement = $this->PDO->prepare($sql);            
	        
	        if ($statement->execute($params))
	        	return true;

		} catch(PDOException $e) {
			return false;
		}
	}

	function deleteFrom($table="", $params="") {
		
		try {
			
			$sql = "DELETE FROM {$table} WHERE job_group_id = :job_group_id";

			$statement = $this->PDO->prepare($sql);
			$statement->execute($params);
			return true;

		} catch(PDOException $e) {

			return false;
		}
	}

	public function insertAll($formData=null, $job_group_id=null, $jobHelper=null) 
	{
		$job_group_id = null; 
		$job_post_id = null; 
		$insertToJobObjectStatus = false;
		$insertToJobPostStatus = false;

		$result = array(
			'job_group_id' => $job_group_id,
			'insertToJobPostStatus' => $insertToJobPostStatus,
			'insertToJobObjectStatus' => $insertToJobObjectStatus
		);

		$this->PDO->beginTransaction();

		$employment_type_id = $formData['employment_type_id'];
		$employment_type_text = $formData['employment_type_text'];

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
		$job_group['industry'] = $jobHelper->makeJsonStr($formData['jobs'], "industry_text_json");
		$job_group['date_created'] = $jobHelper->getDateTime();
		$job_group['for_editing'] = $formData['for_editing'];

		//echo '<pre>'; var_dump($job_group);exit;

		$job_group_id = $this->insertToJobGroup($job_group, $job_group_id);
		if (!$job_group_id) {
			$this->PDO->rollBack();
		}
		
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
				'date_created' => $jobHelper->getDateTime(),
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

			$job_post_id = $insertToJobPostStatus = $this->insertToJobPost($job_post, $job_post_id);
			if (!$insertToJobPostStatus) {
				$this->PDO->rollBack();
			}
			
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
				'date_created' => $jobHelper->getDateTime(),
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

			$insertToJobObjectStatus = $this->insertToJobObject($job_object, $job_post_id);
			if (!$insertToJobObjectStatus) {
				$this->PDO->rollBack();
			}

			$job_post = array(); $job_post_id = ""; $job_object = array();
		}

		if ($job_group_id && $insertToJobPostStatus && $insertToJobObjectStatus) {
			
			$this->PDO->commit();

			return array(
				'job_group_id' => $job_group_id,
				'insertToJobPostStatus' => $insertToJobPostStatus,
				'insertToJobObjectStatus' => $insertToJobObjectStatus
			);
		}

		return $result;
	}

	public function startTransaction() {
		$this->PDO->beginTransaction();
	}

	public function commit() {
		$this->PDO->commit();
	}

	public function rollback() {
		$this->PDO->rollBack();
	}
}