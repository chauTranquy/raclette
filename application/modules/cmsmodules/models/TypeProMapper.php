<?php

class Cmsmodules_Model_TypeProMapper extends Cmsmodules_Model_Mapper{
	
	
	private $_site;
	public $_tableName="TypePro";
	protected $tablePrefix= "Cmsmodules_Model";
	
	//protected $_moduleName="CmsClass.Main";

	
	public function addData($id_site,$type,$id_type=0 ){
		
		$data = array('id_type'=>$id_type,
				"type"=>$type,
				"id_site"=>$id_site);
		
		$result= parent::addData($data);
		return array("success"=>true, "id_type"=>$result);
		
		
	}
	
	
	public function deleteSelection($ids){
		
		
		$arrayIds = explode('|',$ids);
		
		foreach($arrayIds as $id)$this->delete($id);
				return array("success"=>true);
		
	}
	
}