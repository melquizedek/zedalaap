function validateEmail(email) {
  	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(email);
}

function validateTextWithNumber(field) { // with whitespace
	var re = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
  	return re.test(field);
}

function validateInteger(field) {
	var re = /^\d+$/;
  	return re.test(field);
}

function validateTextOnly(field) {
	var re = /^[a-zA-Z]*$/;
  	return re.test(field);
}

function validateAlphanumeric(field) {
	var re = /^[a-z0-9]+$/i;
  	return re.test(field);
}

function validatePasswordMatch(field1, field2) {
	if($.trim(field1) == $.trim(field2)) {
		return true;
	} 

	return false;
}

// API Constant

var apiUrl = 'api/v1/public/';

var employerId = $.cookie('employer_id');
var employerUserId = $.cookie('employer_user_id');
var employerUserFirstName = $.cookie('employer_user_first_name');
var employerUserLastName = $.cookie('employer_user_last_name');
var employerUserEmail = $.cookie('employer_user_email');
var employerUserRoleId = $.cookie('employer_user_role_id');
var employerUserRole = $.cookie('employer_user_role');
var employerUserVerified = $.cookie('employer_user_verified');