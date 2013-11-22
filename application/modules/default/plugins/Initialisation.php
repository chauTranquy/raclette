<?php
include_once("My/Stream/View.php");

class Default_Plugin_Initialisation extends Zend_Controller_Plugin_Abstract

{

    public function preDispatch(Zend_Controller_Request_Abstract $request)

    { 
       	if($request->getControllerName()!="index") return parent::preDispatch($request);
    	
    	
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('viewRenderer');

        $viewRenderer->setView(new My_Stream_View());



}
}