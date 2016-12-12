<?php
// Define Namespace
namespace App\Helpers;

// Model Exam
use App\Models\Exam;

//Class
class Validation {

    protected $exam;

    public function __construct(Exam $exam) {
        $this->exam = $exam;
    }

    // Validate Email if Exist Or Have data
    public function validateEmail($email) {

        if(empty($email)) {
            return array(false, 'Please enter a valid Email Address.');
        } else {

            $emailExist = $this->exam->getUserIdByEmail($email);

            if(!empty($emailExist)) {
                return array(false, 'User with email: ' . $email . ' exists.');
            }
        }

        return array(true);

    }

    // Validate Name if not null
    public function validateName($name) {
        if(empty($name)) {
            return array(false, 'Please enter valid Name.');
        }

        return array(true);
    }

    //Validate Contact if not null
    public function validateContact($contact) {
        if(empty($contact)) {
            return array(false, 'Please enter valid Contact.');
        }

        return array(true);
    }

    //Validate Edit Email
    public function validateEmailEdit($email) {

        if(empty($email)) {
            return array(false, 'Please enter a valid Email Address.');
        }
        
        return array(true);
    }
}