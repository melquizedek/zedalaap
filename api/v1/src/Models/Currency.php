<?php

/**
* Author: Zed Alaap
* Date: 11/08/16
*/

namespace App\Models;

use PDO;

class Currency
{
	
	protected $table = 'i_currency';
	protected $db;

	function __construct(PDO $db)
	{
		$this->db = $db;
	}

	function getCurrency($fields="", $where="") {
		
		try {
			
			$fields = !empty($fields) ? $fields : " * ";

			$sql = "SELECT {$fields} FROM {$this->table}";

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