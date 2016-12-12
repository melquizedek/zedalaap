<?php
/**
 * Created by Jams Abdul.
 * User: jamcoder
 * Date: 5/9/16
 */

namespace App\Controllers;

use App\Models\Resources;

/**
 * Class GeographicalLocationController
 * @package App\Controllers
 */

class ResourcesController {

	protected $resource;

	public function __construct(Resources $resources) {
		$this->resource = $resources;
	}

	/**
     * @param $request
     * @param $response
     * @return $response
     */

	public function getAllIndustry($request, $response, $args) {

		$industry_id = (!empty($args['industry_id']) ? $args['industry_id'] : null);
		$query		 = $this->resource->getAllIndustry($industry_id);

		if(empty($query)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $query
		);

		return $response->withStatus(200)->withJson($output);
		
	}

	public function getAllCountry($request, $response, $args) {

		$country_id = (!empty($args['country_id']) ? $args['country_id'] : null);
		$query 		= $this->resource->getAllCountry($country_id);

		if(empty($query)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $query
		);

		return $response->withStatus(200)->withJson($output);

	}

	public function getStateByCountry($request, $response, $args) {

		$country_id = (!empty($args['country_id']) ? $args['country_id'] : null);
		$query 		= $this->resource->getStateByCountry($country_id);

		if(empty($query)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $query
		);

		return $response->withStatus(200)->withJson($output);
	}

	public function getSpecificStateByCountry($request, $response, $args) {

		$country_id = (!empty($args['country_id']) ? $args['country_id'] : null);
		$state_code = "'" . $args['code'] . "'";

		$query = $this->resource->getSpecificStateByCountry($country_id, $state_code);

		if(empty($query)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $query
		);

		return $response->withStatus(200)->withJson($output);

	}

	public function getCityByState($request, $response, $args) {

		$country_id = (!empty($args['country_id']) ? $args['country_id'] : null);
		$state_code = "'" . $args['code'] . "'";

		$query 	  = $this->resource->getCityByState($country_id, $state_code);

		if(empty($query)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $query
		);

		return $response->withStatus(200)->withJson($output);
	}

	public function getAllCurrency($request, $response, $args) {

		$currency_id = (!empty($args['currency_id']) ? $args['currency_id'] : null);
		
		$query 	  = $this->resource->getAllCurrency($currency_id);

		if(empty($query)) {
			return $response->withStatus(200)->withJson(array(
				'success'	=> false
			));
		}

		$output = array(
			'success'	=> true,
			'data'		=> $query
		);

		return $response->withStatus(200)->withJson($output);
	}


	public function getEmployerSize($request, $response, $args) {
		
		$result = $this->resource->getEmployerSize();

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


	public function getEmployerType($request, $response, $args) {
		
		$result = $this->resource->getEmployerType();

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

	public function getEmployerStatus($request, $response, $args) {
		
		$result = $this->resource->getEmployerStatus();

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

	public function getEducationalLevel($request, $response, $args) {
        return $response->withStatus(200)->withJson([
            [
                'id'=> 1,
                'description' => 'Associate\'s Degree',
                'value' =>  'Associate\'s Degree'
            ],
            [
                'id'=> 2,
                'description' => 'Bachelor\'s Degree',
                'value' =>  'Bachelor\'s Degree'
            ],
            [
                'id'=> 3,
                'description' => 'Master\'s Degree',
                'value' =>  'Master\'s Degree'
            ],
            [
                'id'=> 4,
                'description' => 'Doctoral Degree',
                'value' =>  'Doctoral Degree'
            ],
            [
                'id'=> 5,
                'description' => 'Professional Degree',
                'value' =>  'Professional Degree'
            ],
        ]);

    }

    public function getSalaryRange($request, $response, $args) {
        return $response->withStatus(200)->withJson([
            [

                'id'=>1,
                'description' => 'Less than 500',
                'value' =>  '1|500'
            ],
            [

                'id'=>2,
                'description' => '501 - 1000',
                'value' =>  '501|1000'
            ],
            [

                'id'=>3,
                'description' => '1001 - 2000',
                'value' =>  '1001|2000'
            ],
            [

                'id'=>4,
                'description' => '2001 - 3000',
                'value' =>  '2001|3000'
            ],
            [

                'id'=>5,
                'description' => '3001 - 5000',
                'value' =>  '3001|5000'
            ],
            [

                'id'=>6,
                'description' => '5001 - 10000',
                'value' =>  '5001|10000'
            ],
            [

                'id'=>7,
                'description' => '10001+',
                'value' =>  '10001|+'
            ]
        ]);
    }

    public function getExperienceYear($request, $response, $args) {
        return $response->withStatus(200)->withJson([
            [
                'id'=>1,
                'description'   =>  '0 - 1 years',
                'value' =>  '0|1'
            ],
            [
                'id'=>2,
                'description'   =>  '1 - 3 years',
                'value' =>  '1|3'
            ],
            [
                'id'=>3,
                'description'   =>  '3 - 5 years',
                'value' =>  '3|5'
            ],
            [
                'id'=>4,
                'description'   =>  '5 - 10 years',
                'value' =>  '5|10'
            ],
            [
                'id'=>5,
                'description'   =>  '10+ years',
                'value' =>  '10|+'
            ]
        ]);
    }

    public function getAgeRange($request, $response, $args) {
        return $response->withStatus(200)->withJson([
            [

                'id'=>1,
                'description'   =>  '15 - 24 years old',
                'value' =>  '15|24'
            ],
            [

                'id'=>1,
                'description'   =>  '25 - 54 years old',
                'value' =>  '25|54'
            ],
            [

                'id'=>1,
                'description'   =>  '55 - 64 years old',
                'value' =>  '55|64'
            ],
            [

                'id'=>1,
                'description'   =>  '65+ years old',
                'value' =>  '64|+'
            ]
        ]);

    }

	public function getPostStatus($request, $response, $args) {
		
		$result = $this->resource->getPostStatus();

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

    public function getFilterJob($request, $response, $args){

        $result = $this->resource->getFilterJob();

        if(empty($result)) {
            return $response->withStatus(200)->withJson(array(
                'success'   => false
            ));
        }

        $output = array(
            'success'   => true,
            'data'      => $result
        );

        return $response->withStatus(200)->withJson($output);
    }
}