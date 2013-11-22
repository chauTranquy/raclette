<?php
class Admin_Model_SendMail extends Zend_Mail{

	
	public function __construct(){
	
	$config=Zend_Registry::get("config");
		
	
	
	$mt = new Zend_Mail_Transport_Sendmail();//new Zend_Mail_Transport_Smtp($config->mail->host);
	Zend_Mail::setDefaultTransport($mt);
	
	}
	
	public function sendMail($to, $message, $subject){
	
		
	$config=Zend_Registry::get("config");
		
	$layout = new Zend_Layout();
	$layout->setLayoutPath(APPLICATION_PATH."/modules/default/layouts/scripts");
	$layout->setLayout('mail');
	
	$layout->content=$message;
	
	$html=$layout->render();
	
	$mail = new Zend_Mail();
	
	//$to = "chau@plusdeclic.com";
	try{
	$mail->setFrom($config->mail->from->address,$config->mail->from->name);
	$mail->addTo($to);
	$mail->setSubject($subject);
	$mail->setBodyHTML($html);
	
	$mail->send();
	}
	catch(Zend_Exception $e){
		
		var_dump($e);
		
	}
		
	}



}