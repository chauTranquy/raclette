<?php

class Admin_Model_ParamsMapper extends Admin_Model_Mapper
{

	private $_site;
	public $_tableName="Content";
	//protected $_moduleName="CmsClass.Main";
	
	public function __construct(){
	parent::__construct();
	
	$this->_site = Zend_Registry::get('site');
	
	
	
	}
	
	public function addOrModify($id_site,$id_params=null, $key,$value, $module=""){
//	$id_site= $this->_site->id_site;
	
		$result = $this->execQuery("call addOrModifyParam(?,?,?,?,?)",array($id_site,(int)$id_params, $key, $value, $module),1);

		return $result;
    
    }
    
    public function getParam($key, $id_params=0, $id_site=1){
 
    	
    	$result = $this->execQuery("call getParam(?,?,?)",array($key,$id_params, $id_site),1);
    	    	
    	return !$result?array():$result;
    
    
    
    
    }

}

