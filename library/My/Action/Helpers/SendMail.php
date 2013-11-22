<?php
class My_Action_Helpers_SendMail extends Zend_Mail{

	
	public function __construct(){
	
	$config=Zend_Registry::get("config");
		
	
	
	$mt = new Zend_Mail_Transport_Sendmail();//new Zend_Mail_Transport_Smtp($config->mail->host);
	Zend_Mail::setDefaultTransport($mt);
	
	}
	
	public function sendMail($to, $message, $subject, $from=null){
	
		
	$config=Zend_Registry::get("config");
		
	$layout = new Zend_Layout();
	$layout->setLayoutPath(APPLICATION_PATH."/layouts/scripts");
	$layout->setLayout('mail');
	
	$layout->content=$message;
	
	$html=$layout->render();
	
	$mail = new Zend_Mail();
	
	if(null==$from)$mail->setFrom($config->mail->from->address,$config->mail->from->name);
	else $mail->setFrom($from);
	$mail->addTo($to);
	$mail->setSubject($subject);
	$mail->setBodyHTML($html);
	
	//if(!preg_match('/tcho-pc/',$_SERVER['HTTP_HOST']))
	$mail->send();

	
	
	}



}