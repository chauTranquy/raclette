<?php

class Cmsmodules_Model_NewsletterMapper extends Cmsmodules_Model_Mapper{
	
	
	private $_site;
	public $_tableName="Newsletter";
	protected $tablePrefix= "Cmsmodules_Model";
	
	//protected $_moduleName="CmsClass.Main";

	
	public function find($email){
		$sql= "select id_newsletter from ".$this->getDbTable()->__get('_name').' where email=?';
		$result=$this->execQuery($sql, array($email),1);

		return $result;
	
	
	}
	
}