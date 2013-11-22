<?php

class Admin_Model_ContactMapper extends Admin_Model_Mapper
{

	public $_tableName="Contact";
	

	
	public function __construct(){
	
			parent::__construct();
	}
	
	public function add($id){
		
		//$postVars["nom"]=null;
		
		$front = Zend_Controller_Front::getInstance();
		
		$vars = $front->getRequest()->getPost();
		unset($vars["apiCall"]);
		unset($vars["referer"]);
		//$vars["email"]="hjhjhj";
		$newVars=array_filter($vars, array(&$this,"filterVars"));
			
		$class = new Admin_Model_ContentMapper();
    	$content = $class->getContent($id);
    	
    	$data=json_decode($content->data);
    	
    	$fields=json_decode($data->form);

    	$finalFieldData = array();
    	$htmlContent = "";
    	
    	foreach($fields as $key=>$value):
    	
    	
    	$label=Admin_Model_ContentMapper::enleveAccents($value->label);
		$fValue = $newVars[$label];
	
		
    	if($value->obligatoire==1&&!$fValue)return array("success"=>false,"error"=>"Le champ {$value->label} est obligatoire");
    	
    	if(isset($newVars[$label])&&$value->statut==1) {
    
    		switch($value->type):
    		case 2:
    		if(!Admin_Model_ContentMapper::verifMail($fValue))return array("success"=>false,"error"=>"Le champ {$value->label} est invalide");
    		break;    		
    		endswitch;
    		
    	} 
    	array_push($finalFieldData,array("label"=>$value->label,"value"=>$fValue));
    	$htmlContent.="{$value->label}:{$fValue}.<br />";
    	
    	endforeach;
 	
	
				
		$data=array("fields"=>json_encode($finalFieldData),
					"id_rubrique"=>$id,
					"date_created"=>strftime("%Y-%m-%d %H:%M:%S")
					);
		
		 		$this->getDbTable()->insert($data);
		
		//envoi d'un mail à l'admin
		
		$mail = new Admin_Model_SendMail();
		
		$subject="Nouveau message depuis la page {$content->title} le site {$this->config->mail->from->name}";
		
		$msg="<p>Bonjour,<br />Un nouveau message a &eacute;t&eacute; envoy&eacute; depuis la page {$content->title}</p><p>$htmlContent</p>";
		$mail->sendMail($this->config->mail->admin->adresse, $msg, $subject);
				
		return array("success"=>true,"error"=>"Votre message nous a bien &eacute;t&eacute; transmis. Nous y r&eacute;pondrons dans les plus brefs d&eacute;lais.");
	}	
		
	private function filterVars($value){

		return !empty($value);
	} 
	
	
	}

