<?php
/**
 * Created by Jyacer Abante.
 * User: jamcoder
 * Date: 8/9/16
 */

namespace App\Controllers;

use App\Models\Exam;
use App\Helpers\Validation;
/**
 * Class ExamController
 * @package App\Controllers
 */

class ExamController {

	protected $exam;
	protected $validation;

	public function __construct(Exam $exam, Validation $validation) {

		// Model
		$this->exam = $exam;

		// Validation Helper
		$this->validation = $validation;

	}

	/**
     * @param $request
     * @param $response
     * @return $response
     */

	// Validate Email if exist
	public function checkIfEmailAvailableUser($request, $response) {
		$email 	= $request->getParam('email');

		if(!empty($email)) {

			$result = $this->exam->getUserIdByEmail($email);

			if(!empty($result)) {
				$error = 'User with email: ' . $email . ' exists.';

				return $response->withStatus(200)->withJson(array(
					'success'	=> false,
					'message'	=> 'User with email: ' . $email . ' exists.'
				));
			} else {
				return $response->withStatus(200)->withJson(array(
					'success'	=> true,
					'data'		=> $result
				));
			}
		}
	}

	//Get All Users
	public function getAllUser($request, $response, $args) {

		$userId = (!empty($args['user_id'])) ? $args['user_id'] : NULL;

		$result = $this->exam->getAllUser($userId);

		if(empty($result)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $result
		);

		return $response->withStatus(200)->withJson($output);

	}

	// Get All Users By limit
	public function getAllUserByLimit($request, $response, $args) {

		$queryParams = $request->getQueryParams();
		$userId = (!empty($args['user_id'])) ? $args['user_id'] : NULL;

        $limit = (isset($queryParams['limit']) ? $queryParams['limit'] : 5);
        $page = (isset($queryParams['page']) ? $queryParams['page'] : 1);
        $offset = ($page - 1) * $limit;

		$result = $this->exam->getAllUser($userId, $limit, $offset);

		if(empty($result)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $result
		);

		return $response->withStatus(200)->withJson($output);

	}

	// Add User
	public function insertUser($request, $response, $args) {

		$email 			= $request->getParam('email');
		$name 			= ucwords($request->getParam('name'));
		$contact 		= ucwords($request->getParam('contact'));

		// SERVER SIDE VALIDATION

		$error = array();

		//Validation Helper
		$ArrEmail = $this->validation->validateEmail($email);
		$ArrName = $this->validation->validateName($name);
		$ArrContact = $this->validation->validateContact($contact);

		if(!$ArrEmail[0]) {
			array_push($error, $ArrEmail[1]);
		}

		if(!$ArrName[0]) {
			array_push($error, $ArrName[1]);
		}

		if(!$ArrContact[0]) {
			array_push($error, $ArrContact[1]);
		}

		// Return if there's error
		if(!empty($error)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false,
				'data'		=> $error,
				'validation'=> false
			));
		}

		// Model Function
		$result = $this->exam->insertUser($email, $name, '+' . $contact);

		if(!$result) {
			$output = array(
				'success'	=> false,
				'data'		=> $result
			);
		}

		$output = array(
			'success'	=> true,
			'data'		=> $result
		);

		return $response->withStatus(200)->withJson($output);
	}

	// Update User
	public function updateUser($request, $response, $args) {

		$userId 		= $request->getParam('userId');
		$email 			= $request->getParam('email');
		$name 			= ucwords($request->getParam('name'));
		$contact 		= ucwords($request->getParam('contact'));

		// SERVER SIDE VALIDATION

		$error = array();

		//Validation Helper
		$ArrEmail = $this->validation->validateEmailEdit($email);
		$ArrName = $this->validation->validateName($name);
		$ArrContact = $this->validation->validateContact($contact);

		if(!$ArrEmail[0]) {
			array_push($error, $ArrEmail[1]);
		}

		if(!$ArrName[0]) {
			array_push($error, $ArrName[1]);
		}

		if(!$ArrContact[0]) {
			array_push($error, $ArrContact[1]);
		}

		// Return if there's error
		if(!empty($error)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false,
				'data'		=> $error,
				'validation'=> false
			));
		}

		// Model Function
		$result = $this->exam->updateUser($userId, $email, $name, '+' . $contact);

		if(!$result) {
			$output = array(
				'success'	=> false,
				'data'		=> $result
			);
		}

		$output = array(
			'success'	=> true,
			'data'		=> $result
		);

		return $response->withStatus(200)->withJson($output);
	}

	// Deactivate User
	public function deleteUser($request, $response, $args) {

		$userId	= $args['user_id'];

		$result = $this->exam->deleteUser($userId);

		if(!$result) {
			$output = array(
				'success'	=> false,
				'data'		=> $result
			);
		}

		$output = array(
			'success'	=> true,
			'data'		=> $result
		);

		return $response->withStatus(200)->withJson($output);
	}

}