<?php

class Cmsmodules_Model_EspaceProMapper extends Cmsmodules_Model_Mapper{
	
	
	private $_site;
	public $_tableName="EspacePro";
	protected $tablePrefix= "Cmsmodules_Model";
	
	//protected $_moduleName="CmsClass.Main";

	
	public function addData($name, $description, $id_site,$status=0,$id_espacepro=0 ){
		
		$data = array('id_espacepro'=>$id_espacepro,
				"name"=>$name,
				"description"=>$description,
				"status"=>$status,
				"id_site"=>$id_site);
		
		$result= parent::addData($data);
		return array("success"=>true, "id_espacepro"=>$result);
		
		
	}

	
	public function deleteSelection($ids){
		
		
		$arrayIds = explode('|',$ids);
		
		foreach($arrayIds as $id)$this->delete($id);
				return array("success"=>true);
		
	}
	
}