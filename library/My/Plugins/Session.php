<?php
class My_Plugins_Session extends Zend_Controller_Plugin_Abstract
{
	
	private $_session;
	private $_clientHeaders;
	
	
	public function __construct(){
	
	$this->_session= Zend_Registry::get("session");
	$this->_clientHeaders=$_SERVER['HTTP_USER_AGENT'];
	if(array_key_exists('REMOTE_ADDR',$_SERVER))$this->_clientHeaders.=$_SERVER['REMOTE_ADDR'];

	$this->_clientHeaders=md5($this->_clientHeaders);

	}
	
	public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request){
		
		
	if(isset($this->_session->clientBrowser)&&$this->_session->clientBrowser!=$this->_clientHeaders):

	Zend_Session::destroy();
	throw new Zend_Controller_Action_Exception("erreur 403",403);
	
	exit;
	
	endif;
	
	
	
	
	}
	
	public function postDispatch(){
		//echo $this->_request->getActionName();
		
		
		
		if($this->_request->getActionName()=="ajax"||$this->_request->getActionName()=="getform"){
		
		$this->_session->clientBrowser=$this->_clientHeaders;
		}
	}
	
public function dispatchLoopShutdown(){
		//echo $this->_request->getActionName();
		
	
	
		if($this->_request->getActionName()!="ajax"&&$this->_request->getActionName()!="getform"){
			//echo $this->_session->clientBrowser;
			$this->_session->clientBrowser=$this->_clientHeaders;
			
		}
	
	}
	
	
	
	
}