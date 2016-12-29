<?php

/**
* Author: Zed Alaap
* 11/13/16
*/

namespace App\Models;

use PDO;

class Main
{
	
	public $PDO;

	public function __construct(PDO $db)
	{
		$this->PDO = $db;
	}

	public function getUniqueId()
	{
	    $statement = $this->PDO->prepare("SELECT SUBSTRING(UUID(), 1,8) as uniqueId");

	    $statement->execute();
	    $statement->setFetchMode(PDO::FETCH_ASSOC);

	    $results = $statement->fetchAll();

	    $uniqid = substr(uniqid(bin2hex(openssl_random_pseudo_bytes(1))), 0, 12) . $results[0]['uniqueId'];
	    
	    return $uniqid;
	}
	
	
}
		