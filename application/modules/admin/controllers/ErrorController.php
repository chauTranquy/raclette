<?php

class Admin_ErrorController extends Zend_Controller_Action
{

    public function errorAction()
    {
    	
    	$this->_helper->layout->setLayoutPath(APPLICATION_PATH.'/modules/admin/layouts/');
   	 $this->_helper->layout->setLayout('admin');
    	
        $errors = $this->_getParam('error_handler');
  		// $this->getViewdata($errors);
		$module = $this->getRequest()->getModuleName();
    	
	//	echo "error";
var_dump($errors);

die();
	 if(APPLICATION_ENV=="development"||APPLICATION_ENV=="staging")echo ($errors->exception->getMessage());

			$exception = $errors->exception;

        if (!$errors || !$errors instanceof ArrayObject) {
            $this->view->message = 'You have reached the error page';
            return;
        }
        
       $msg=$this->_request->getParam("errorMsg");
        
        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ROUTE:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                // 404 error -- controller or action not found
                $this->getResponse()->setHttpResponseCode(404);
                $priority = Zend_Log::NOTICE;
                
                $this->view->message = empty($msg)?'la page demand&eacute;e n\'existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;e':$msg;
                break;
            default:
                // application error
                
            	if($exception->getCode()==401):
  			 
            		$this->getResponse()->setHttpResponseCode(401);
                $priority = Zend_Log::CRIT;
                $this->view->message = 'Vous devez vous connecter pour acc&eacute;der &agrave; cette ressource.';
            	else:
                $this->getResponse()->setHttpResponseCode(500);
                $priority = Zend_Log::CRIT;
                $this->view->message = 'Une erreur critique est intervenue.';
                endif;
                break;
        }
        
         $this->view->exception = $errors->exception;
        
        // Log exception, if logger available
        if ($log = $this->getLog()) {
            $log->log($this->view->message, $priority, $errors->exception);
            $log->log('Request Parameters', $priority, $errors->request->getParams());
        }
        
        // conditionally display exceptions
        if ($this->getInvokeArg('displayExceptions') == true) {
            $this->view->exception = $errors->exception;
        }

      
        
    }

    public function notauthorizedAction(){
    
    $this->getViewdata();
    	
    $this->view->message = 'Vous devez vous connecter pour acc&eacute;der &agrave; cette page.';
    
    }
    
    public function getViewdata($errors){
    
    	$this->acl=Zend_Registry::get('adminACL');
    	Zend_Registry::set('role','guest');
    	
        $this->auth=Zend_Auth::getInstance();
    	if(Zend_Registry::isRegistered("site"))$this->site=Zend_Registry::get("site");
        $this->view->auth=$this->auth->getIdentity();
        
      	$this->view->headScript()->appendFile('/admin/js/modernizr.js');
    	$this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js');
	    $this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js');
	    $this->view->headScript()->appendFile('/admin/js/popupClass.js');
	    $this->view->headScript()->appendFile('/admin/js/formClass.js');
	    $this->view->headScript()->appendFile('/admin/js/tooltip.js');
	   	$this->view->headScript()->appendFile('/admin/js/carousel.js');
	   	$this->view->headScript()->appendFile('/_js/origine-montagne.js');
	   	$this->view->headScript()->appendFile('/_js/native.history.js');

	//$this->view->headLink()->appendStylesheet('/css/popup.css');
	$this->view->headLink()->appendStylesheet('/_css/fonts/fonts.css','print');
    $this->view->headLink()->appendStylesheet('/_css/origine-montagne.css','screen,print');
    
    $this->view->headLink()->appendStylesheet('/admin/js/tooltip.css');

    	$this->session= new Zend_Session_Namespace('connected');
    	
    	$this->view->isHome =true;
    	
    	
    	if (!isset($this->session->isConnected))$this->session->isConnected= false;
    	
    	if($this->auth->hasIdentity()) $this->session->isConnected= true;
    	
    	
    	
    $arboClass= new Admin_Model_ArboMapper();
    
    
    
	$menu= $arboClass->getArbo(8,1, true);

	
	$class= new Admin_Model_ContentMapper();
	
	$menuTop=array();
	
	foreach($menu as $item):
	
	
	
	
	$link=$class->getHrefLink($item["id_rubrique"]);
	
	$data=$class->getContentData($item["id_rubrique"]);
	
	$data=$class->getContentData($item["id_rubrique"], $data->inline_version);
	
	$data=json_decode($data["result"]->data);
	
	$item["img"]=$data->menuImage;
//	$item["bgColor"]=$data->bgColor;
	
	$item["link"]=$link;
	
	$children=array();
	
	foreach($item["children"] as $child):

	$link2=$class->getHrefLink($child["id_rubrique"]);
	
	$child["link"]=$link2;
	
	array_push($children, array("link"=>$child["link"],"title"=>$child["title"]));
	
	endforeach;
	
	array_push($menuTop, array("link"=>$item["link"],"title"=>$item["title"], "id_rubrique"=>$item["id_rubrique"], "children"=>$children, "img"=>$item["img"]));
	
	endforeach;
	
	$this->view->menuTop=$menuTop;
	
	
    
    
    }
    
    
    public function getLog()
    {
        $bootstrap = $this->getInvokeArg('bootstrap');
        if (!$bootstrap->hasResource('Log')) {
            return false;
        }
        $log = $bootstrap->getResource('Log');
        return $log;
    }


}

