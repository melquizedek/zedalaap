<?php
/**
* Author: Zed Alaap
* Date: 11/16/16
*/

// Define Namespace
namespace App\Helpers;


class PostingValidation
{
	
	function __construct()
	{
		
	}

	public function headline($data)
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job headline is required.');
		}
		return array(true);
	}

	public function description($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job description is required.');
		}
		return array(true);
	}

	public function hiringDurationFrom($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job hiring duration from is required.');
		}
		return array(true);
	}

	public function hiringDurationTo($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job hiring duration to is required.');
		}
		return array(true);
	}

	public function jobTitle($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job title to is required.');
		}
		return array(true);
	}

	public function jobDesc($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job description to is required.');
		}
		return array(true);
	}

	public function salary($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Salary is required.');
		}
		return array(true);
	}

	public function currency($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Currency is required.');
		}
		return array(true);
	}

	public function yrExp($data) 
	{
		if ( !is_numeric(trim($data)) ) {
			return array(false, 'Year of experiences is required.');
		}
		return array(true);
	}

	public function jobDurationFrom($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job duration from is required.');
		}
		return array(true);
	}

	public function jobDurationTo($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Job duration to is required.');
		}
		return array(true);
	}

	public function durationTimeFrom($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Duration time from is required.');
		}
		return array(true);
	}

	public function durationTimeTo($data) 
	{
		if ( empty(trim($data)) ) {
			return array(false, 'Duration time to is required.');
		}
		return array(true);
	}

	public function location($key, $data) {

		if (!array_key_exists($key, $data)) {
			return array(false, 'Location is required.');
		}
		return array(true);
	}

	public function industry($key, $data) {

		if (!array_key_exists($key, $data)) {
			return array(false, 'Industry is required.');
		}
		return array(true);
	}
}