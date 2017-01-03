<?php

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------


$app->group('/user', function () {
	$this->map(['GET'], '', 'ExamController:getAllUser');
	$this->map(['POST'], '', 'ExamController:insertUser');
	$this->map(['PUT'], '', 'ExamController:updateUser');
	$this->group('/{user_id:[0-9]+}', function() {
		$this->map(['GET'], '', 'ExamController:getAllUser');
		$this->map(['DELETE'], '', 'ExamController:deleteUser');
	});

});

$app->group('/validate', function () {
	$this->post('/email', 'ExamController:checkIfEmailAvailableUser');
});

$app->group('/resources', function () {

	$this->group('/industry', function() {
		$this->map(['GET'] ,'', 'ResourcesController:getAllIndustry');	
		$this->map(['GET'] ,'/{industry_id:[0-9]+}', 'ResourcesController:getAllIndustry');	
	});

	$this->group('/country', function() {
		$this->map(['GET'] ,'', 'ResourcesController:getAllCountry');
		$this->group('/{country_id:[0-9]+}', function() {
			$this->map(['GET'] ,'', 'ResourcesController:getAllCountry');
			$this->group('/state', function(){
				$this->map(['GET'] ,'', 'ResourcesController:getStateByCountry');
				$this->group('/{code}', function() {
				$this->map(['GET'] ,'', 'ResourcesController:getSpecificStateByCountry');
					$this->group('/city', function(){
						$this->map(['GET'] ,'', 'ResourcesController:getCityByState');
						$this->map(['GET'] ,'/{city_id:[0-9]+}', 'ResourcesController:getCityByState');
					});
				});
			});
		});
	});

	$this->group('/filterjob', function() {
		$this->map(['GET'] ,'', 'ResourcesController:getFilterJob');
	});

	$this->group('/currency', function() {
		$this->map(['GET'] ,'', 'ResourcesController:getAllCurrency');
		$this->map(['GET'] ,'/{currency_id:[0-9]+}', 'ResourcesController:getAllCurrency');
	});

	$this->group('/poststatus', function() {
		$this->map(['GET'] ,'', 'ResourcesController:getPostStatus');
	});

	$this->group('/employer', function() {
		$this->get('/access-role', 'EmployerUserAccessRoleController:getEmployerUserAccessRole');
		$this->get('/size', 'ResourcesController:getEmployerSize');
		$this->get('/status', 'ResourcesController:getEmployerStatus');
		$this->get('/type', 'ResourcesController:getEmployerType');
	});

	$this->get('/salary-range', 'ResourcesController:getSalaryRange');
	$this->get('/educational-level', 'ResourcesController:getEducationalLevel');
	$this->get('/experience-year', 'ResourcesController:getExperienceYear');
	$this->get('/age-range', 'ResourcesController:getAgeRange');
});

/* Routes for Job posting functionality
======================================= */
$app->group('/job', function() {
	
	$this->group('/list[/{group_job_id}]', function() {
		$this->map(['GET', 'POST', 'PUT'], '', 'JobController:getJob');
	});

	$this->get('/close/{group_job_id}', 'JobController:closeJob');
	$this->post('/posting', 'JobController:postJob');
	$this->post('/publish', 'JobController:publish');
	$this->post('/suggested', 'JobController:shortListedFulltime');

	$this->group('/applicants', function() {
		$this->post('/shortlisted', 'JobController:getAppliedApplicant');
	});
	
	$this->group('/resources', function() {
		$this->map(['POST', 'GET'], '/country', 'JobController:getCountry');
		$this->map(['POST', 'GET'], '/industry', 'JobController:getIndustry');
		$this->map(['POST', 'GET'], '/currency', 'JobController:getCurrency');
	});
});

/* Use to convert form data to JSON object
======================================= */
$app->map(['POST', 'GET'], '/to-json-encode', function($request, $response, $args) {
	$result = $this->get('JobValidator')->setDataToValidate($request->getParsedBody());
	echo json_encode($result);
});

/* Routes Api for file uploading
======================================= */
$app->group('/file', function() {
	//sleep(6);
	$this->post('/upload', 'UploadController:doUpload');
});