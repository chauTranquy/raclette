<?php

include_once(("Image/Image.php"));

class Cmsmodules_BoutiqueController extends Zend_Controller_Action
{

public function init()
    {

    	/*
    	$contextSwitch = $this->_helper->getHelper('contextSwitch');
        $contextSwitch->addActionContext('getjsondata', 'json')
                      ->initContext();
        */
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
    
    }
	
	
	public function preDispatch(){
		

        
	}
	
	
    

    public function indexAction()
    {


    	
    }
    
    
    

}

