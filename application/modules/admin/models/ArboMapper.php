<?php

class Admin_Model_ArboMapper extends Admin_Model_Mapper
{

	public $_tableName="Arbo";
	protected $_moduleName="cms.ContentController";

	
	public function __construct(){
	
	parent::__construct();
	
	
	}
	
	public function getRoots($id_site=1,$onlyIDs=false){
	
		$rows=$this->execQuery("call getRoots(?)", array($id_site));
		
		$arrayResult=array();

		
		foreach($rows as $row):
		
		$resourceName=$this->_moduleName."__".$row->id_rubrique."_".$row->id_site;
		

		$rights=$this->checkUsersRights($resourceName);
		
	if($rights["read"]):
	if($onlyIDs):
	array_push($arrayResult,$row->id_rubrique);
	
	else:
	
	array_push($arrayResult,$row);
	endif;
	
	endif;
	
		endforeach;
		
		if(!$onlyIDs)return array("success"=>true, "roots"=>$arrayResult);
		
		return $arrayResult;
		
	}
	
	public function getArbo($rootID=0, $onlyActive=false, $deep=true, $level=0,$displayFront=false){

	$rowset=$this->execQuery("call getArbo(?,?)", array($rootID, $onlyActive?1:0));
	
	
	
//	if($deep=="false") $deep=false;
	
	$arrayArbo=array();
	
	foreach($rowset as $row):

	
	$children=array();
	
	if($deep)$children=$this->getArbo($row->id_rubrique,$onlyActive, $deep, $level+1, $displayFront);
	$isLeaf=count($children)==0;
	
	$resourceName=$this->_moduleName."__".$row->id_rubrique."_".$row->id_site;
	$rights=$this->checkUsersRights($resourceName);
	
	if($displayFront==true)$rights['read']=true;
	
	if($rights["read"]):
	$arrayProv=array("id_rubrique"=>$row->id_rubrique,"callback"=>$row->callback,"title"=>$row->title,"write"=>$rights["write"],"edit"=>$rights["edit"],"templateRef"=>$row->templateRef,"statut"=>$row->status,"children"=>$children, "isLeaf"=>$isLeaf, "id_template"=>$row->id_template, "creation_date"=>$row->creation_date, "update_date"=>$row->update_date, "type"=>$row->type);
	

	array_push($arrayArbo,$arrayProv);
	
	endif;
	
	endforeach;
	

	
	if($level>0)return $arrayArbo;
	

	
	
	return $arrayArbo;
	
	}
	
public function addOrModify($title,$id_site, $id_rubrique=0, $id_template=0, $parentID=0, $ordre=0, $originalId=0){
	
	$userModl= new Admin_Model_AdminUsersMapper();

	
    $this->userData=$userModl->getUserData($this->auth->getIdentity()->uid);
	
	if(empty($id_rubrique)): // verification droit d'ajout sur la rubrique parente
	$resourceName=$this->_moduleName."__".$parentID.'_'.$id_site;
	
	$rights=$this->checkUsersRights($resourceName);
	
	if(!$rights["edit"])return array("success"=>false, "error"=>"Vous n'avez pas les droits n&eacute;cessaires pour ajouter une rubrique");
	
	endif;
	
	// verification des droits de modification sur la rubrique en cours
	
	$resourceName=$this->_moduleName."__".$id_rubrique.'_'.$id_site;
	
	$rights=$this->checkUsersRights($resourceName);
	
	if(!$rights["edit"])return array("success"=>false, "error"=>"Vous n'avez pas les droits n&eacute;cessaires pour modifier cette rubrique");
	
	
	$sql="call addOrModifyRub(?,?,?,?,?,?, ?, ?)";
	
	$arraykey=array($title,$id_rubrique,$parentID,$id_template,$ordre, $originalId, $this->userData->id_user, $id_site);
	
	
	
	$row=$this->execQuery($sql, $arraykey,1);
	$this->addAcl($this->_moduleName, $id_site,$row->result, $rights);
	
	return array("success"=>true, "result"=>$this->getElement($row->result),"key"=>$arraykey);
}
	
public function getElement($id_rubrique, $isJSONCall=false){

	
	$res=$this->execQuery("call getRubDetail(?)", array($id_rubrique),1);
	
	
	return $isJSONCall?array("success"=>true,"result"=>$res):$res;

}

public function delete($id_rubrique){
	
	$site = Zend_registry::get('site');
	
	
	$resourceName=$this->_moduleName."__".$id_rubrique."_".$site->id_site;
	
	$rights=$this->checkUsersRights($resourceName);
	
	if(!$rights["edit"])return array("success"=>false, "error"=>"Vous n'avez pas les droits n&eacute;cessaires pour supprimer cette rubrique");
	$res=$this->execQuery("call deleteRub(?)", array($id_rubrique),1);
	
	return array("success"=>$res->result==1, "error"=>$res->result==-1?"L'&eacute;l&eacute;ment n'est pas vide !":"");

}
		

public function moveRub(array $items,$parentID=0){

	
	foreach($items as $cle=>$pos):
	
	
	$sql="call moveRub(?,?,?)";
	
	$stmt=$this->execQuery($sql, array($cle,$parentID,$pos),-1);
		endforeach;


	return array("success"=>true);
}


public function getParentID($id){

	$sql = "call getParentRub(?) ";
	
	$result = $this->execQuery($sql, array($id),1);
	
		
	return $result->parent_id_OUT;

}


public function getRubByTemplateRef($templateRef, $online = 1, $id_site=1){

	if($online==-1) $online=0;
	$sql = "call getRubByTemplateRef(?, ?, ?)";

	$result = $this->execQuery($sql, array($templateRef, $online, $id_site));
	
	$arrayResult=array();
	
	foreach($result as $rub){
		
		$rub->leaf=true;
		$rub->children=array();
		$rub->type="page";
		$rub->statut=$rub->status;
		unset($rub->status);
		
		array_push($arrayResult, $rub);
		
	}
	
	return $arrayResult;

}

public function getSitesArbo(){
	
	$siteMapper = new Admin_Model_SitesMapper();
	$sites = $siteMapper->getSiteList();
	$arboArray=array();
	
	foreach($sites["sites"] as $site):
	$id_site = $site->id_site;
	$arraySite=array("id_site"=>$id_site,"name"=>$site->site_name,"children"=>array());
	
	$roots = $this->getRoots($id_site, false);
	
	
	foreach($roots["roots"] as $root):
	
	
	//$root=(object)$arrayRoot[0];
	$rootID=$root->id_rubrique;

	$arbo = $this->getArbo($rootID);

	
	array_push($arraySite["children"], array("id_rubrique"=>$root->id_rubrique,"title"=>$root->title,"type"=>"folder", "isLeaf"=>count($arbo[0])==0,"children"=>$arbo[0]));
	
	endforeach;
	array_push($arboArray, $arraySite);

	
	
	endforeach;

	return array("success"=>true, "result"=>$arboArray);
	
}


}

