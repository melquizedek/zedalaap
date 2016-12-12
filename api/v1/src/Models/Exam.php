<?php

namespace App\Models;

use PDO;

class Exam {

    /**
    * @var $db
    */
    private $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }
    
    // Validate User Email
    public function getUserIdByEmail($email) {
        try {
            $sql = "
                SELECT
                    user_id
                FROM
                    i_test_user
                WHERE
                    email = '$email'
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            $results = $statement->fetchAll();    

            if(count($results) === 1){
                return $results[0];
            } else {
                return false;
            }
        } catch(PDOException $e) {
            return $e;
        }
    }

    // Get All Users
    public function getAllUser($userId) {

        $whereClause = (!empty($userId)) ? "AND user_id = $userId " : null;

        try {
            $sql = "
                SELECT 
                    user_id, name, phone_number, email
                FROM
                    i_test_user
                WHERE
                    is_deleted = 0
                    $whereClause
                ORDER BY
                    date_created DESC
            ";

            $statement = $this->db->prepare($sql);

            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    // Add User
    public function insertUser($email, $name, $contact){
        try {

            $sql = "
                INSERT INTO 
                    i_test_user
                (email, name, phone_number, date_created)
                VALUES
                ('$email', '$name', '$contact', NOW())
            ";

            $statement = $this->db->prepare($sql);

            return $statement->execute();

        } catch(PDOException $e) {
            return $e;
        }
    }

    //Update User
    public function updateUser($userId, $email, $name, $contact) {
        try {

            $sql = "
                UPDATE
                    i_test_user
                SET
                    email = '$email',
                    name  = '$name',
                    phone_number   = '$contact'
                WHERE
                    user_id = $userId
            ";

            $statement = $this->db->prepare($sql);

            return $statement->execute();

        } catch(PDOException $e) {
            return $e;
        }
    }

    // Delete User
    public function deleteUser($userId) {
        try {

            $sql = "
                UPDATE
                    i_test_user
                SET
                    is_deleted = 1
                WHERE
                    user_id = $userId
            ";

            $statement = $this->db->prepare($sql);

            return $statement->execute();

        } catch(PDOException $e) {
            return $e;
        }
    }

}