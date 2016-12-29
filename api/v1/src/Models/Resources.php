<?php

namespace App\Models;

use PDO;

class Resources {

    /**
    * @var $db
    */
    private $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAllIndustry($industry_id = null) {

        $whereClause = (!empty($industry_id)) ? "AND industry_id = $industry_id " : null;
  
        try {
            $sql = "
                SELECT
                    industry_id, industry
                FROM
                    i_zconnected_industry
                WHERE
                    1 = 1
                    $whereClause
                ORDER BY
                    industry
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getAllCountry($country_id = null) {

        $whereClause = (!empty($country_id)) ? "AND country_id = " . $country_id : null;

        try {
            $sql = "
                SELECT
                    country_id, iso, nicename, iso3, numcode, phonecode, nationality
                FROM
                    i_zconnected_country
                WHERE
                    1 = 1
                    $whereClause
                ORDER BY
                    nicename
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    /*public function getAllLocation($keyword) {
        try {
            $sql = "
                SELECT
                    a.city_id, a.country_id, a.name, nicename,
                    CONCAT(a.name, ', ', nicename) as name_readable
                FROM
                    i_zconnected_city as a
                    INNER JOIN i_zconnected_country as b
                    ON a.country_id = b.country_id
                WHERE
                    a.name != ''
                    AND a.name LIKE '%$keyword%'
                ORDER BY
                    a.name
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getAllCity() {
        try {
            $sql = "
                SELECT
                    a.city_id, a.name
                FROM
                    i_zconnected_city as a
                WHERE
                    a.name != ''
                ORDER BY
                    a.name
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }*/

    public function getStateByCountry($country_id = null){

        $whereClause = (!empty($country_id)) ? "AND country_id = " . $country_id : null;

        try {
            $sql = "
                SELECT
                    state_id, state, code, state
                FROM
                    i_zconnected_state
                WHERE
                    1 = 1
                    $whereClause
                ORDER BY
                    state
            ";

            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getSpecificStateByCountry($country_id, $state_code) {

         $whereClause = (!empty($state_code)) ? "AND code = " . $state_code : null;

        try {
            $sql = "
                SELECT
                    state_id, state, code, state
                FROM
                    i_zconnected_state
                WHERE
                    country_id = $country_id
                    $whereClause
                ORDER BY
                    state
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getCityByState($country_id, $state_code){

        $whereClause = (!empty($country_id)) ? "AND region = " . $state_code : null;

        try {
            $sql = "
                SELECT
                    city_id, name
                FROM
                    i_zconnected_city
                WHERE
                    1 = 1
                    AND name IS NOT NULL
                    AND country_id = $country_id
                    $whereClause
                ORDER BY
                    name
            ";

            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getAllCurrency($currency_id = null) {

        $whereClause = (!empty($currency_id)) ? "AND currency_id = $currency_id " : null;
  
        try {
            $sql = "
                SELECT
                    currency_id, currency_code
                FROM
                    i_zconnected_currency
                WHERE
                    1 = 1
                    $whereClause
                ORDER BY
                    currency_code
            ";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }


    public function getEmployerSize() {
        try {
            $sql = "
                SELECT 
                    employer_size_id, employer_size
                FROM
                    i_zconnected_employer_size
            ";  
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getEmployerType() {
        try {
            $sql = "
                SELECT 
                    employer_type_id, employer_type
                FROM
                    i_zconnected_employer_type
            ";  
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getEmployerStatus() {
        try {
            $sql = "
                SELECT 
                    employer_status_id, employer_status
                FROM
                    i_zconnected_employer_status
            ";  
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getPostStatus() {
        try {
            $sql = "
                SELECT 
                    post_status_id, post_status_name
                FROM
                    i_zconnected_post_status
            ";  
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();
        } catch(PDOException $e) {
            return $e;
        }
    }

    public function getFilterJob() {

        try {
            $sql = "
                SELECT filter_job_id, filter_name 
                FROM i_zconnected_filter_job ";
                
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();

        } catch(PDOException $e) {
            return $e;
        }
    }

    function getCountry($fields="", $where="") {
        
        try {
            
            $fields = !empty($fields) ? $fields : " * ";

            $sql = "SELECT {$fields} FROM i_country";

            if (!empty($where)) $sql .= $where;

            $sql .= " ORDER BY country_name ASC";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();

        } catch(PDOException $e) {

            return $e;
        }

    }

    function getIndustry($fields="", $where="") {
        
        try {
            
            $fields = !empty($fields) ? $fields : " * ";

            $sql = "SELECT {$fields} FROM i_industry";

            if (!empty($where)) $sql .= $where;

            $sql .= " ORDER BY industry ASC";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();

        } catch(PDOException $e) {

            return $e;
        }

    }

    function getCurrency($fields="", $where="") {
        
        try {
            
            $fields = !empty($fields) ? $fields : " * ";

            $sql = "SELECT {$fields} FROM i_currency";

            if (!empty($where)) $sql .= $where;

            $sql .= " ORDER BY currency_code ASC";
            
            $statement = $this->db->prepare($sql);
            
            $statement->execute();
            $statement->setFetchMode(PDO::FETCH_ASSOC);

            return $statement->fetchAll();

        } catch(PDOException $e) {

            return $e;
        }

    }
}