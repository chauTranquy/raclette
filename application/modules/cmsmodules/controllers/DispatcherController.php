<?php

class Cmsmodules_DispatcherController extends Zend_Controller_Action
{

public function init()
    {

    
    }
	
	
	public function preDispatch(){
		
	
	}
	
	
    

    public function indexAction()
    {

    	$this->_helper->layout()->disableLayout();
    	$this->_helper->viewRenderer->setNoRender(true);

    	$controllerName= ucfirst(strtolower($this->_request->getParam(1)));
    	
    	$API = "Cmsmodules_{$controllerName}Controller";
    	$APICall = $this->_request->getParam(2)."";
    	
    	include_once dirname(__FILE__)."/{$controllerName}Controller.php";
    	
    	$return = new stdClass();
    	
    	if ($API!=$this&&!class_exists($API)) {
      
    	$return->success=false;
    	$return->msg="Classe $API introuvable";
    	//return;
    }
    	
    	else {
    		$class=new reflectionClass($API);

    		if(!$class->hasMethod($APICall)){
    			
    			$return->msg="M&eacute;thode inconnue";
    			$return->success=false;
    		
    			
    		}
    		else{
    		$method=$class->getMethod($APICall);
    		
    $args=array();
	
	foreach($method->getParameters() as $Params){
		
		if(!$Params->isOptional() && empty($this->getRequest()->{$Params->name})){
			
			$return->success=false;
			$return->msg="Param&egrave;tre ".$Params->name." manquant. API:".($API!=$this?$API:"")." , APICall:$APICall";
			return;
		} 
		elseif(!empty($this->getRequest()->{$Params->name}))array_push($args,is_array($this->getRequest()->{$Params->name})?$this->getRequest()->{$Params->name}:stripslashes($this->getRequest()->{$Params->name}));
		elseif($Params->isOptional()) array_push($args,$Params->getDefaultValue());
	
	}
	

	
	if($API!=$this)$result=$method->invokeArgs(new $API($this->getRequest(), $this->getResponse()),$args);
else $result=$method->invokeArgs($this,$args);
	


	
	if(is_array($result))foreach($result as $key=>$value):
	    $return->{$key}=$value;
	endforeach;
    		}
    }
   
   echo json_encode($return);
    
    }
    
  
}

