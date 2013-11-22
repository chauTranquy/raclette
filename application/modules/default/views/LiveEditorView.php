<?php

include_once("My/Stream/View.php");

class Default_View_LiveEditorView extends Zend_View
{
    
	public function __construct($config = array()){
 
		
	parent::__construct($config);
	
	}
	
	
	public function render($tpl){

		
			
		return parent::render($tpl);
	
	}
	
	protected function _run(){
	
	
		include func_get_arg(0);
		
	//echo 'zend.view://' . func_get_arg(0);;
		
	//	parent::_run();
      
        
   
	
	}
	
	
}