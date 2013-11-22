<?php
 class Admin_Plugin_CheckInstall extends Zend_Controller_Plugin_Abstract{
 
 public function preDispatch(){
 

 		// verification connexion DB
 		
 	$config=Zend_Registry::get("config");
 	
 	
 	$front = Zend_Controller_Front::getInstance();
 	$request = $front->getRequest();

 	if(!$config->install){
 	
 		
 		
 		 		
 		if($request->getModuleName()!='admin'&&$request->getControllerName()!='install'||$request->getModuleName()!='admin'&&$request->getControllerName()!='error')$request->setModuleName('admin')
        ->setControllerName('install')
        ->setActionName('index');
      
 		

 		
 		/*
 		 * $request->setModuleName('default')
        ->setControllerName('search'))
        ->setActionName('form')
        ->setDispatched(false);
}
 		 */
 	
 	}
 	
 	
 
 
 }
 
 
 }