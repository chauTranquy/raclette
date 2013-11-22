<?php

class Cmsmodules_Model_Mapper
{

	
	
	protected $_dbTable;
	public $_tableName;
 	protected $acl;
 	protected $auth;
	protected $userData;
	protected $config;
	protected $tablePrefix="Cmsmodules_Model";
 	
	public function __construct(){
	
/*		$this->acl=Zend_Registry::get('adminACL');
		$this->auth=Zend_Auth::getInstance();
		*/
		$this->config = Zend_Registry::get('config');


	}
	
    public function setDbTable($dbTable)
    {
        if (is_string($dbTable)) {
            $dbTable = new $dbTable();
        }
        if (!$dbTable instanceof Zend_Db_Table_Abstract) {
            throw new Exception('Invalid table data gateway provided');
        }
        $this->_dbTable = $dbTable;
        return $this;
    }
 
    public function getDbTable()
    {
    	
    
        if (null === $this->_dbTable) {
            $this->setDbTable($this->tablePrefix.'_DbTable_'.ucfirst($this->_tableName));
        }
        return $this->_dbTable;
    }
	
    public function fetchAll($where=""){
    
    	$select=$this->getDbTable()->select();//
    	
    	if(!empty($where))$select->where($where);
    	$result= $this->getDbTable()->getAdapter()->fetchAll($select);
    	return $result;
    
    }
    
    public function delete($id){
    	
    	$where = $this->getDbTable()->getAdapter()->quoteInto($this->_dbTable->__get('_primary').'=?', $id);
    	return $this->getDbTable()->delete($where); 
    	
    }
    
public function find($id){
		
		
		$result=$this->getDbTable()->find($id);
		
	//echo "id=>$id";
	
		if(0 == count($result)) return false;
		
		$row = $result->current();
		return $this->getNewModel( $row->toArray () );
		
	}
	
	public function getNewModel(array $data=array()){
		
			$model_className = $this->tablePrefix."_" . ucfirst($this->_tableName);
			return new $model_className ( $data);
		
	}
	
	public function execQuery($sql, array $args=array(), $return=0, $type=PDO::FETCH_OBJ){
		
		$stmt=$this->getDbTable()->getAdapter()->query($sql, $args);

		
		$result=true;
		
		if($return==0)$result=$stmt->fetchAll($type);
		elseif($return==1) $result=$stmt->fetch($type);
		unset($stmt);
	
		return $result;
	
	}
	
	
	public function addData($data){
		setlocale(LC_TIME, "fr_FR");
		
		$info=$this->getDbTable()->info();
	
		
		if(empty($data["creation_date"])&&in_array('creation_date', $info['cols']))$data["creation_date"]=strftime('%Y-%m-%d %H:%M',time());
		
		$primary = $this->_dbTable->__get('_primary');
		if(array_key_exists($primary, $data)&&$data[$primary]>0):
		$id=$data[$primary];
		unset($data[$primary]);
		$this->getDbTable()->update($data, $this->getDbTable()->getAdapter()->quoteInto($primary.'=?', $id));
		else :
		if(array_key_exists($primary, $data))unset($data[$primary]);
		$id = $this->getDbTable()->insert($data);
		endif;
		return $id;
		
	
		
	}
	
	public function checkUsersRights($resourceName){

		
		$role=Zend_Registry::get('role');

		
				
		if(Zend_Registry::isRegistered("superadmin")&&Zend_Registry::get('superadmin')==1) :
	
	$write=$read=$edit=1;		

	 
	else:


	
	
	if(!$this->acl->has($resourceName)):
		
	if($role=="guest"):
	
	$write=$edit=0;
	 $read=1;
	 
	
	 
	 else :

	 $id=explode("__", $resourceName);
	
	$id_rub=$id[1];
	
	$class = new Admin_Model_ArboMapper();
	
	$parentID=$class->getParentID($id_rub);
	 return $this->checkUsersRights($id[0]."__".$parentID);
	 
	 endif;
	 
	else:
	
	
	$write=$this->acl->isAllowed($role,$resourceName,'write')?1:0;
	$read=$this->acl->isAllowed($role,$resourceName,'read')?1:0;
	$edit=$this->acl->isAllowed($role,$resourceName,'edit')?1:0;
	
	endif;
	endif;
		
	
	return array("write"=>$write, "read"=>$read, "edit"=>$edit);
	
	
	} 

    public function __get($name)
    {
        
        return $this->{$name};
    }
	
}

