<?php

class Admin_Model_TemplateMapper extends Admin_Model_Mapper
{

	public $_tableName="Template";

	
	public function addOrModify($template_name, $templateRef, $id_site, $parent_id=0, $id_template=0){
	
	$check = $this->tplExists($templateRef);
		if(!$check) return array("success"=>false, "error"=>"Gabarit inexistant"); 
		
		if($id_template!=0):
		$tpl = $this->find($id_template);
		
		if(!$tpl)return array("success"=>false, "error"=>"Template introuvable");
		
		$data=$tpl->dataToArray();
		
		
		
		$data["template_name"]=$template_name;
		$data["templateRef"] = $templateRef;
		
		$this->getDbTable()->update($data, $this->getDbTable()->getAdapter()->quoteInto(" id_template=?", $id_template));
		
		else: // creation
		//if($parent_id==0) return array("success"=>false, "error"=>"Parent id vide");
		//if(!$this->find($parent_id)) return array("success"=>false, "error"=>"Parent id inexistant");
		$data=array("template_name"=>$template_name,
			"templateRef"=>$templateRef,
			"parent_id"=>$parent_id,
				"id_site"=>$id_site);
		
		$id_template=$this->getDbTable()->insert($data);
		
		
		
		
		endif;
		
		$tpl=$this->find($id_template);
		
		
		//var_dump($expression)
		
		$data=array(
	"id_template"=>$tpl->__get("id_template"),
	"template_name"=>$tpl->__get("template_name"),
	"parent_id"=>$tpl->__get("parent_id"),
	"type"=>$tpl->__get("type"),
	"templateRef"=>$tpl->__get("templateRef"),
	"child_required"=>$tpl->__get("child_required")
	
	);
		
		return array("success"=>true, "result"=>$data);
	}
	
	
	public function tplExists($templateRef){
		
		$sql="select id_templateRef from ".DBPREFIX."templateRef where templateRef=?";
		$row=$this->execQuery($sql, array($templateRef),1);
		
		return $row;
	
	}
	
	
	
public function getTemplateList($templateId=0, $id_site){
	
	
	
	$sql="select id_template, template_name from ".DBPREFIX."templates ".(!empty($templateId)?" where parent_id=? ":"")." order by template_name asc";
	

	
	$rowset=$this->execQuery($sql, array($templateId));
	return $rowset;



}


public function getTemplateFields($templateRef=null){
	
	$rowset=$this->execQuery("call getTemplateFields(?)", array($templateRef));
	
	$templateFields=array();
	
	foreach($rowset as $field):
	$field->extra_params=json_decode(($field->extra_params));
	
	array_push($templateFields,$field);
	
	endforeach;
	
	return array("success"=>true, "result"=>$templateFields);


}

public function getTemplateDataById($templateRef){
	
	$result = $this->execQuery('select A.*, B.type, B.description, B.publiable, B.callback  from cms_templates A, cms_templateRef B where A.templateRef=B.templateRef and A.templateRef=?', array($templateRef),1);
	return $result;
	
}

public function getFieldByName($templateRef, $fieldName){

	$result =$this->getTemplateFields($templateRef);
	
	$fields=$result["result"];
	
	foreach($fields as $field):

	
	if($fieldName == $field->field_name) :
	$field->extra_params = ($field->extra_params);
	
	return $field;
	
	endif;
	
	endforeach;
	
	return false;
	


}

public function getTemplateData($id_template){

	
	$row=$this->execQuery("select templateRef from ".DBPREFIX."templates where id_template=?", array($id_template),1);

	$templateRef=$row->templateRef;
	return 	$this->getTemplateFields($templateRef);
	
	


}

public function getTemplates($id_template=0, $level=0, $id_site=1){
	
	$sql="select id_template from ".DBPREFIX."templates where parent_id=? and id_site=?";
	
	$stmt=$this->getDbTable()->getAdapter()->query($sql, array($id_template, $id_site));
	$rowset=$stmt->fetchAll(PDO::FETCH_OBJ);
	
	$arrayResult=array();
	
	unset($stmt);
	
	if(count($rowset)>0)foreach($rowset as $result):
	$tpl = $this->find($result->id_template);
	$children=$this->getTemplates($result->id_template, $level+1, $id_site);
	
	if($tpl):$arrayTpl=array(
	"id_template"=>$tpl->__get("id_template"),
	"template_name"=>$tpl->__get("template_name"),
	"parent_id"=>$tpl->__get("parent_id"),
	"type"=>$tpl->__get("type"),
	"templateRef"=>$tpl->__get("templateRef"),
	"child_required"=>$tpl->__get("child_required"),
	"children"=>$children
	
	);
	
	array_push($arrayResult, $arrayTpl);
		endif;
	
	endforeach;
	return $arrayResult;

}

public function moveTemplate(array $items,$parentID=0){
	
	
	foreach($items as $cle=>$pos):
	
	
	$sql="call updateTemplateOrder(?,?)";

	$this->execQuery($sql,array($parentID,$pos),-1);
	
	endforeach;


	return array("success"=>true);

}

public function find($id){

	$sql="call getTemplateData(?)";
	$row=$this->execQuery($sql, array($id),1, PDO::FETCH_ASSOC);
	
	if(!$row)return;
	
	$tpl = new Admin_Model_Template($row);
	
	
	return $tpl;


}

public function deleteTemplate($id_template){

	$sql="call deleteTemplate(?)";
	$row=$this->execQuery($sql,array($id_template),1);
	
	$result=(int)$row->result;
	
	return array("success"=>$result==0, "error"=>(
	$result > 0?"Le noeud n'est pas vide":
	($result==-1?"Ce template est utilis&eacute; dans la gestion de contenu.<br />Vous devez supprimer tous les &eacute;l&eacute;ments l'utilisant avant de pouvoir le supprimer.":""))
	);

}
public function getTemplateRefList(){
	
	$rowset=$this->execQuery("call getTemplateRefList()");
	
	return $rowset;

}


public function addOrModifyTemplateRef($templateRef,$type, $description="" , $id_templateRef=0, $fieldsList=array(), $publiable=0, $callback=""){
	
	
$sql="call addOrModifyTemplateRef(?,?,?,?,?,?)";
$stmt=$this->execQuery($sql,array($id_templateRef, $templateRef, $description, $type, $publiable, $callback),1);

$id_templateRefOut=$stmt->id_templateRef_OUT;
if(count($fieldsList)>0){
	$fieldsNotToDelete=array();
	foreach($fieldsList as $key=>$field):
	$field=(object)$field;
	$sql="call addOrModifyTemplateFields(?,?,?,?,?,?,?,?)";
	$row=$this->execQuery($sql,array($field->id_field, $field->field_type, $field->compulsary, $field->templateRef, $field->label, $field->ordre, $field->field_name, $field->extra_params),1);
	array_push($fieldsNotToDelete,$row->result);
	endforeach;
	
	
	
	
	$fieldsNotToDelete=implode(',', $fieldsNotToDelete);
		
	
	
	$sql="delete from ".DBPREFIX."template_fields where id_field not in ($fieldsNotToDelete) and templateRef=?";
	$row=$this->execQuery($sql,array($templateRef),-1);
	
	}
	$msg=null;
	if($publiable==1){
		
		$templateName=strtolower($templateRef).'.phtml';
		$path=APPLICATION_PATH.DIRECTORY_SEPARATOR.'tpl'.DIRECTORY_SEPARATOR.$templateName;
		if(!file_exists($path)):
		
		$fp = @fopen($path,"w+");
		
		if(!$fp) return array('success'=>false,"error"=>"Erreur lors de la cr&eacute;ation du template");
		fclose($fp);
		$msg="Cr&eacute;ation du template $templateName r&eacute;ussie";
		
		endif;
		
		
	}
	
	return array("success"=>true, "id_templateRef"=>$id_templateRefOut,"msg"=>$msg);
}


public function deleteTemplateFields($id_field){

	$sql="call deleteTemplateFields(?)";
	$row=$this->execQuery($sql,array($id_field),1);
	
	return array("success"=>true);

}

public function deleteTemplateRef($id_templateRef){


	$sql="call deleteTemplateRef(?)";
	$row=$this->execQuery($sql,array($id_templateRef),1);
	
	return array("success"=>$row->result==0, "error"=>$row->result==0?"":"Ce gabarit est utilis&eacute;");
	

}

}
