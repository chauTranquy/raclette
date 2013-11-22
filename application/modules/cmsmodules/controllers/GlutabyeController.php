<?php


class Cmsmodules_GlutabyeController extends Zend_Controller_Action
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
    
    
    public function import(){
    	
    	$fp = fopen(APPLICATION_PATH.'/importClients.csv','r');
    	
    	$class = new Cmsmodules_Model_ClientsProMapper();
    	$typeClass = new Cmsmodules_Model_TypeProMapper();
    	$groupeClass = new Cmsmodules_Model_EspaceProMapper();
    	
    	
    	while($line=fgetcsv($fp,"1000",';')):
    	
    	$line=array_map('utf8_encode',$line);
    	$type = ($line[3]);
    	$groupe=($line[4]);
    	$code_client=$line[0];
    	// on recherche le type
    	$queryType= $class->execQuery("select id_type from cms_type_clients where type=?", array($type),1);
    	
    	if(!$queryType):
    	$result=$typeClass->addData(1, $type);
    	$id_type=$result['id_type'];
    	else:
    	
    	
    	$id_type=$queryType->id_type;
    	
    	endif;
    //	echo $type."=>$id_type<br />";
    
    	//on recherche le groupe
    	
    	$queryType= $class->execQuery("select id_espacepro from cms_espacepro where name=?", array($groupe),1);
    	
    	if(!$queryType):
    	$result=$groupeClass->addData($groupe, "", 1,1);
    	$id_espacepro=$result['id_espacepro'];
    	else:
    	 
    	 
    	$id_espacepro=$queryType->id_espacepro;
    	 
    	endif;
    	echo $groupe."=>$id_espacepro<br />";
    	
    	$queryType= $class->execQuery("select id_client from cms_clients where num_client=?", array($code_client),1);

    	if(!$queryType):
    	$result=$class->addData($line[1], $line[2], $line[5], $line[6], $id_type, $id_espacepro, $code_client,$line[7], $line[8]);
    	$id_client=$result['id_clients'];
    	else:
    	
    	
    	$id_client=$queryType->id_client;
    	$result=$class->addData($line[1], $line[2], $line[5], $line[6], $id_type, $id_espacepro, $code_client, $line[7], $line[8], $id_client);
    	endif;
    	
    	endwhile;
    	
    	die('import');
    	
    }
    
    public function generepass(){
    	include_once('My/Action/Helpers/RandomString.php');
    	$class = new My_Action_Helpers_RandomString();
    	
    	$pass = $class->direct(8,"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    	
    	return array("success"=>true,"pass"=>$pass);
    }

}

