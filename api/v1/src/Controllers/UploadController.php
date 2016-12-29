<?php
/**
 * Created by Zed Paala.
 * Date: 11/06/16
 */

namespace App\Controllers;

/**
 * Class UploadController
 * @package App\Vendor
 */

class UploadController
{
	protected $UploadHanler;

	function __construct($uploadHanler)
	{
		$this->UploadHanler = $uploadHanler;
	}

	public function doUpload() {
		
	}	
}