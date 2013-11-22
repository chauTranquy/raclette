<?php

class Admin_AdminController extends Zend_Controller_Action
{

	public function init()
	{

	
            
            
            
		/*
		  
		$gapi = new Admin_Model_GAnalytics();
		 
		die();
		*/
		 
		/*
		 $test = new Admin_Model_CommandMapper();
		 
		$result = $test->getCommandeList('id_commande','ASC', 5, 1);
		 
		var_dump($result);
		 
		die();
		*/
		 
		session_cache_expire(60);
		 
		$this->_helper->layout->setLayoutPath(APPLICATION_PATH.'/modules/admin/layouts/');
		$this->_helper->layout->setLayout('admin');

		Zend_Registry::set('role','adminUser');
		 
		$this->site=Zend_registry::get("site");
		$this->view->headTitle('Administration du site '.$this->site->site_name)->setSeparator(' - ');
		$contextSwitch = $this->_helper->getHelper('contextSwitch');
		$contextSwitch->addActionContext('getjsondata', 'json')
		->initContext();

		$this->isLogged=null;

	}


	public function preDispatch(){

		$this->auth=Zend_Auth::getInstance();
		$request=$this->getRequest();

		$action = $this->getRequest()->getActionName();


		if((!$this->auth->hasIdentity()||$this->auth->hasIdentity()&&$this->auth->getIdentity()->uid==null)&&$request->getActionName()!='login'&&$request->getActionName()!='getjsondata') $this->_redirect('/admin/login');
		elseif($this->auth->hasIdentity()&&$this->auth->getIdentity()->uid!=null) {

			$userModl= new Admin_Model_AdminUsersMapper();

			$this->isLogged=$userModl->checkUserLogin($this->auth->getIdentity()->uid);
			 
			
			if($this->isLogged==-2) $this->_redirect('/admin/login');
			$this->userData=$userModl->getUserData($this->auth->getIdentity()->uid);
			
			$authSession = Zend_Registry::get('auth_session');
			$authSession->setExpirationSeconds(3600);
			$siteClass = new Admin_Model_SitesMapper();
			$usersRightClass= new Admin_Model_UsersRightsMapper();

			$this->usersRights = $usersRightClass->loadUsersRights($this->userData->id_user_group, $this->userData->id_user);


			$acl = Zend_Registry::get('adminACL');
			 
			if($this->userData->superadmin==1) :
			$acl->allow('adminUser');
			 
			Zend_Registry::set("superadmin",true);
			else:
			Zend_Registry::set("superadmin",false);
			 
			endif;

			foreach($this->usersRights["result"] as $rights):

			 
			$resourceName=preg_replace("/TextoCMS.controller./","",$rights->module)."_".$rights->plugin.'_'.$rights->rubId.'_'.$rights->id_site;
			
			
			
			if(!$acl->has($resourceName)):
			
			$resource = new Zend_Acl_Resource($resourceName);

			$acl->add($resource);

			$arrayRights=array();

			if($rights->edit==1)array_push($arrayRights, 'edit');

			if($rights->write==1)array_push($arrayRights, 'write');
			if($rights->read==1)array_push($arrayRights, 'read');


			if(count($arrayRights)>0) $acl->allow('adminUser', $resourceName,$arrayRights);
			else $acl->deny('adminUser', $resourceName);
			endif;
			endforeach;

			Zend_registry::set("adminACL", $acl);
			if($this->_request->id_site) :
			
			
			
			
			$siteMapper = new Admin_Model_SitesMapper();
			$site = $siteMapper->find($this->_request->id_site);
			
			Zend_Registry::set('site', $site);
			
			endif;
			
			if($this->isLogged==-2&&$request->getActionName()=='getjsondata') return $this->getjsondataAction();
			$this->arrayModule = $usersRightClass->checkAdminUserModules($this->site->id_site);

		}

		 

		$this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js');
		$this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js');

		/* $this->view->headScript()->appendFile(CDN_URL.'/_cmsAdmin/ext/ext-all-debug.js');
		 $this->view->headScript()->appendFile(CDN_URL.'/_cmsAdmin/ext/locale/ext-lang-fr.js');
		$this->view->headLink()->appendStylesheet(CDN_URL.'/_cmsAdmin/ext/resources/css/ext-all.css');
		$this->view->headLink()
		*/

		$this->view->headScript()->appendFile('/admin/ext/ext-all-debug.js')->appendFile('/admin/ext/locale/ext-lang-fr.js');

		$this->view->headLink()->appendStylesheet('/admin/_css/ext-theme-classic-all.css')->appendStylesheet('/admin/_css/adminStyle.css')
		->appendStylesheet('/admin/ext/src/ux/css/ItemSelector.css')->appendStylesheet('/admin/ext/src/ux/DataView/DragSelector.css')->appendStylesheet('/admin/_css/font-awesome.css');
		
		
		
	}




	public function indexAction()
	{

		$this->view->headScript()->appendFile('/admin/bootstrap.js')->appendFile('/admin/app/app.js')->appendFile('/admin/ckeditor/ckeditor.js')->appendFile('https://apis.google.com/js/client.js');
		$this->view->headLink()->appendStylesheet('/admin/_css/editorStyle.css');
//		$this->view->headLink()->appendStylesheet(CDN_URL.'/_cmsAdmin/shadowbox/shadowbox.css')->appendStylesheet('bootstrap.css');
//		$this->view->headLink()->appendStylesheet(CDN_URL.'/_cmsAdmin/ext/app/css/chooser.css');
	
		$this->view->headLink()->appendStylesheet('/admin/js/shadowbox/shadowbox.css')->appendStylesheet('bootstrap.css');
		$this->view->headLink()->appendStylesheet('/admin/loginJS/ext/app/css/chooser.css');
		 
		$this->view->headLink()->appendStylesheet('/admin/ext/src/ux/CheckColumn.css');
		 
		$this->view->headScript()->appendFile('/admin/js/shadowbox/shadowbox.js');

//		$this->view->headLink()->appendStylesheet('/_css/fonts/fonts.css');
		$this->view->modules=$this->arrayModule;
		$this->view->site=$this->site;
		$this->view->userData=$this->userData;

		 
	}


	public function loginAction(){
		 
		if($this->auth->hasIdentity()&&$this->auth->getIdentity()->uid!=null) $this->_redirect('/admin/index');
		$this->view->headTitle()->prepend('Connexion');
		$this->view->site=$this->site;
		 
	}


	public function getjsondataAction(){
		 
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		 
		$API=$this->getRequest()->API;
		$APICall = $this->getRequest()->APICall;

		
		$API = preg_replace('/Application\_Model/','Admin_Model',$API);
		
		 
		if($this->_request->getControllerName()=="admin"):
		if($this->isLogged==-1&&$APICall!="connectNewSession"&&$APICall!="killIdentity"):
		 
		$this->view->error="Vous &ecirc;tes d&eacute;j&agrave; connect&eacute; sur un autre poste.<br />Souhaitez-vous vous connecter sur cette session ?";
		$this->view->errorCode=-2;
		$this->view->success=false;
		return;
		 
		elseif($this->isLogged==-2):
		 
		$this->view->error="Vous avez &eacute;t&eacute; d&eacute;connect&eacute;.<br /><a href=\"/admin/\">Cliquez ici pour vous authentifier</a>";
		$this->view->errorCode=-1;
		$this->view->success=false;
		return;
		 
		elseif(!$this->auth->hasIdentity()&&($APICall!='authenticate'&&$API!='Admin_Model_AdminUsersMapper'||$APICall=="checkConnect")):

		$this->view->error="Vous avez &eacute;t&eacute; d&eacute;connect&eacute;.<br /><a href=\"/admin/\">Cliquez ici pour vous authentifier</a>";
		$this->view->errorCode=-1;
		$this->view->success=false;
		return;

		endif;
		 
		endif;
		 
		if(empty($API))$API=$this;
		
		if ($API!=$this&&!class_exists($API)) {

			$this->view->success=false;
			$this->view->msg="Classe $API introuvable";
			return;
		}
		 
		else {
			$class=new reflectionClass($API);

			if(!$class->hasMethod($APICall)){
				 
				$this->view->msg="M&eacute;thode inconnue";
				$this->view->success=false;
				return;
				 
			}

			$method=$class->getMethod($APICall);

			$args=array();

			foreach($method->getParameters() as $Params){
					
				if(!$Params->isOptional() && empty($this->getRequest()->{$Params->name})){
						
					$this->view->success=false;
					$this->view->msg="Param&egrave;tre ".$Params->name." manquant. API:".($API!=$this?$API:"")." , APICall:$APICall";
					return;
				}
				elseif(!empty($this->getRequest()->{$Params->name}))array_push($args,is_array($this->getRequest()->{$Params->name})?$this->getRequest()->{$Params->name}:stripslashes($this->getRequest()->{$Params->name}));
				elseif($Params->isOptional()) array_push($args,$Params->getDefaultValue());

			}

			if($API!=$this)$result=$method->invokeArgs(new $API,$args);
			else $result=$method->invokeArgs($this,$args);

			if(!is_array($result)) $result =(array) $result;

			if(is_array($result))foreach($result as $key=>$value):
			$this->view->{$key}=$value;
			endforeach;

		}
		 
	}

	public function douploadAction(){

		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);

		$imageClass= new Admin_Model_FileManager();
		echo json_encode($imageClass->uploadFile($this->getRequest()->parentRoot,$this->getRequest()->overwrite, $this->getRequest()->baseFolder));
		 
	}

	public function logoutAction(){


		$userModl= new Admin_Model_AdminUsersMapper();

		$this->userData->__set('ip_address',null);
		$this->userData->__set('connexion_timestamp',null);
		$this->userData->__set('session_id',null);
		$userModl->addOrModify($this->userData);
		 
		$userModl->killIdentity();

		$this->_redirect('/admin/login');

	}



	
public function loadAdminUserInfo(){
	
	$array=$this->userData->dataToArray();
	
	$result=array('uid'=>$this->userData->uid, "superAdmin"=>$this->userData->superadmin);
	
	return array("success"=>true,"userData"=>$result);
	
	
} 


public function minifyadminAction(){
	
	$this->_helper->layout()->disableLayout();
	$this->_helper->viewRenderer->setNoRender(true);
	
	include_once(APPLICATION_PATH.'/../library/My/Classes/class.JavaScriptPacker.php');
	$fileClass = new Admin_Model_FileManager();
	$folders=$fileClass->getFolderList(null, 0, '\admin\sencha\app',1, true);
	
	$this->parseAdminJSArbo($folders);
	
	//packer = new JavaScriptPacker($js, 'Normal', true, false);
			//$packed = $packer->pack();
	
	die('ok');
	
}

private function parseAdminJSArbo($arbo,$path=null){
	
	$baseFolder=APPLICATION_PATH.'/../public/admin/sencha/optimisation/';
	
	echo '<ul>';
	
	foreach($arbo as $rub){
		
		echo "<li>".$rub["name"]." ".APPLICATION_PATH.'/../public/admin/sencha/app/'.($path.$rub['path']);
		
		$opendir=opendir(APPLICATION_PATH.'/../public/admin/sencha/app/'.$rub['path']);
		if(!file_exists($baseFolder.$rub['path']))mkdir($baseFolder.$rub['path']);

		while ($file=readdir($opendir)):
		if($file!=="."&&$file!=='..'&&preg_match('/\.js$/', $file)) {
			$js = file_get_contents(APPLICATION_PATH.'/../public/admin/sencha/app/'.$rub['path']."/".$file);
			
			
			$packer = new JavaScriptPacker($js, 'None', true, false);
			$packed = $packer->pack();
			
			
			
			$fp = fopen($baseFolder.$rub['path']."/".$file, "w+");
			
			fputs($fp, $packed);
			fclose($fp);
			
			echo "fichier".$file.'<br />';
		}
		
		endwhile;
		
		if(count($rub["children"])>0)$this->parseAdminJSArbo($rub["children"], $rub['path']);
		
		echo '</li>';
	}
	
	echo '</ul>';
	
}


public function publishallAction(){
	
	set_time_limit(0);
	
	$this->_helper->layout()->disableLayout();
	$this->_helper->viewRenderer->setNoRender(true);
	$arboClass = new Admin_Model_ArboMapper();
	
	$recetteList = $arboClass->getRubByTemplateRef("produits");
	$contentClass=new Admin_Model_ContentMapper();
	
	foreach($recetteList as $key=>$recette):
	
	$version_id=$contentClass->getContentData($recette->id_rubrique, null, 0, 1);
	
	
	$versionID=$version_id->version_id;
	
	echo "====>";
	var_dump($recette);
	
	$contentClass->publish($recette->id_rubrique, $versionID,1);
	
	if($key>10) die();
	
	
	endforeach;
	
	
	die('ok');
	
}

public function duplicatearboAction(){
    
    die();
    
    $this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
                
                $mapper = new Admin_Model_ArboMapper();
                
            //    $sql="delete from cms_arbo where id_site=2 and id_rubrique>0"
                
                $arbo = $mapper->getArbo(40, false, true);
    
                $this->copyRub($arbo,338);
    
}

private function copyRub($rub, $parentId){
    
     $mapper = new Admin_Model_ArboMapper();
     $content=new Admin_Model_ContentMapper();
     
    echo "<ul>";
    
    
foreach($rub as $node):
  
    
      echo "<li>{$node["title"]}</li>";
    
      $newNode = $mapper->find($node["id_rubrique"]);
      $newNode->__set('id_rubrique',null);
      $newNode->__set('id_site',2);
      $newNode->__set('parent_id',$parentId);
      
    $newParentId= $mapper->addData($newNode->dataToArray());
      
    $idContent = $content->execQuery('select id_content from cms_content where id_rubrique=?',array($node["id_rubrique"]),1);
    if($idContent):
    $newContent=$content->find($idContent->id_content);
    $newContent->__set('id_content',null);
    $newContent->__set('id_rubrique', $newParentId);
    
    $content->addData($newContent->dataToArray());
     endif;
      
    if(count($node["children"])>0) $this->copyRub($node["children"], $newParentId);
  
    

endforeach;
    
echo "</ul>";
    
}

}

