<?php

/**
* Author: Zed Alaap
* Date: 11/08/16
*/

namespace App\Models;

use PDO;

class Country
{
	
	protected $table = 'i_country';
	protected $db;

	function __construct(PDO $db)
	{
		$this->db = $db;
	}

	function getCountry($fields="", $where="") {
		
		try {
			
			$fields = !empty($fields) ? $fields : " * ";

			$sql = "SELECT {$fields} FROM {$this->table}";

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
}