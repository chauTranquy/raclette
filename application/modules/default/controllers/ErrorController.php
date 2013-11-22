<?php

class ErrorController extends Zend_Controller_Action
{

    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');

  		$this->getViewdata($errors);
		$module = $this->getRequest()->getModuleName();

		$exception = $errors->exception;
		$msg="";
  		if(APPLICATION_ENV!="production")$msg ="<pre>".$exception->getMessage()."</pre>"; 
        if (!$errors || !$errors instanceof ArrayObject) {
            $this->view->message = 'You have reached the error page';
            return;
        }
        
        
        var_dump($errors);
        
        die();
        
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
                $this->view->message = empty($msg)?'Vous n\'avez pas l\'autorisation d\'acc&eacute;der &agrave; cette ressource.':$msg;
            	else:
                $this->getResponse()->setHttpResponseCode(500);
                $priority = Zend_Log::CRIT;
              
                $this->view->message = empty($msg)?'Une erreur critique est intervenue.'.$exception->getMessage():$msg;
                endif;
                break;
        }
        
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
        
       $helper=new Default_Controller_Helpers_GetLayoutData();

        $helper->getHeaderData();
        $helper->getMenu();
    
    
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

