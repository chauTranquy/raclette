<?php

class Admin_Model_Mapper
{

	
	
	protected $_dbTable;
	public $_tableName;
 	protected $acl;
 	protected $auth;
	protected $userData;
	protected $config;
	protected $tablePrefix="Admin_Model";
 	
	public function __construct(){
	
		$this->acl=Zend_Registry::get('adminACL');
		$this->auth=Zend_Auth::getInstance();
		$this->config = Zend_Registry::get('config');
		//$this->site = Zend_Registry::get('site');


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
    
public function find($id){
		
		
		$result=$this->getDbTable()->find($id);
		
	//echo "id=>$id";
	
		if(0 == count($result)) return false;
		
		$row = $result->current();
		$model_className = "Admin_Model_" . ucfirst($this->_tableName);
		$object = new $model_className ( $row->toArray () );
		return $object;
		
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
		

		$data[$primary]=null;
		$id = $this->getDbTable()->insert($data);

		endif;
		return $id;
		
	
		
	}
	
	public function checkUsersRights($resourceName){

		
		$role=Zend_Registry::get('role');

		
				
		if(Zend_Registry::isRegistered("superadmin")&&Zend_Registry::get('superadmin')==1) :
	
	$write=$read=$edit=1;		

	 
	else:


	//$resourceName=preg_replace("/TextoCMS.controller./","",$resourceName);
	
	
	if(!$this->acl->has($resourceName)):
	
	if($role=="guest"):
	
	$write=$edit=0;
	 $read=1;
	 
	
	 
	 else :

	 preg_match('#([a-zA-Z\.]+)(__)([0-9]+)(_)([0-9]+|)#',$resourceName,$match);

	 $id=$match[3];//explode("__", $resourceName);
	
	$id_rub=$id;//[1];
		
	
	$class = new Admin_Model_ArboMapper();
	
	$parentID=$class->getParentID($id_rub);
	
	if($parentID>0) return $this->checkUsersRights($id[0]."__".$parentID."_".$this->site->site_id);
	 
	$write=$read=$edit=0;
	
	
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
    
    
    public function addAcl($moduleName, $id_site, $id,$rights){
    	
    	$userModl= new Admin_Model_AdminUsersMapper();
    	$superUser=Zend_Registry::get("superadmin");
    	$this->userRights = new Admin_Model_UsersRightsMapper();
    	
    	if(!$superUser):
    	
    	$this->userData=$userModl->getUserData($this->auth->getIdentity()->uid);
    	 
    	$id_user = $this->userData->__get('id_user');
    	$id_user_group= $this->userData->__get('id_user_group');
    	$rightsObj = new stdClass();
    	$rightsObj->write=$rights["write"];
    	$rightsObj->edit=$rights["edit"];
    	$rightsObj->read=$rights["read"];
    	    	 
    	$this->addRights($moduleName, $id_site, $id, $rightsObj, $id_user_group,$id_user);
    	 
    //	$userRights->updateRights($items, $id_user, $id_user_group);
    	 
    	
    	
    	endif;
    	
    	// mise a jour de tous les 

    	$rightsClass=new Admin_Model_AdminUsersMapper();
    	 
    	$userGroup =$rightsClass->getUsers();
    	$class=new Admin_Model_ArboMapper();
    	$parentID=$class->getParentID($id);
    	
    	unset($userGroup[0]);
    	
    	foreach($userGroup as $group):
    	 $group=(object)$group;
    	
    	
    	$result= $this->execQuery("select * from ".DBPREFIX."users_rights where rubId=? and id_user_group=?", array($parentID, $group->id_user_group),1);
    	
    	if((int)$result->write==1||(int)$result->read==1||(int)$result->edit==1) :
    	$rightsObj = new stdClass();
    	$rightsObj->write=$result->write;
    	$rightsObj->read=$result->read;
    	$rightsObj->edit=$result->edit;
    	$this->addRights($moduleName, $id_site, $id, $rightsObj, $group->id_user_group,0);
    	
    	endif;
    	
    	foreach($group->children as $user):
    	$user=(object)$user;
    	$result2= $this->execQuery("select * from ".DBPREFIX."users_rights where rubId=? and id_user_group=? and id_user=?", array($parentID, $group->id_user_group, $user->id_user),1);
    	
    	//on verifie si l'utilisateur a les droits sur le repertoire parent
    	
    	
    	if((int)$result2->write==1||(int)$result2->read==1||(int)$result2->edit==1) :
    	$rightsObj = new stdClass();
    	$rightsObj->write=$result2->write;
    	$rightsObj->read=$result2->read;
    	$rightsObj->edit=$result2->edit;
    	$this->addRights($moduleName, $id_site, $id, $rightsObj, $group->id_user_group, $user->id_user);
    	 
    	endif;
    	 
    	
    	 endforeach;
    	 
    	 
    	 
    	endforeach;
    	 
    
    	
    	
    }
    
    private function addRights($moduleName, $id_site, $id, $rights, $id_user_group, $id_user){
    	
    	$items=array(array("module"=>$moduleName,"plugin"=>null,"id_site"=>$id_site,"rubId"=>$id,"read"=>$rights->read,"write"=>$rights->write,"edit"=>$rights->edit));
    	$this->userRights->updateRights($items, $id_user, $id_user_group);
    	
    
    	
    	
    }
	
}

