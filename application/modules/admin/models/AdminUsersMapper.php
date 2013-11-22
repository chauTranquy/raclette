<?php

class Admin_Model_AdminUsersMapper extends Admin_Model_Mapper
{

	public $_tableName="AdminUsers";
	
	
	public function addOrModifyUserGroup($group_name, $id_user_group=0){
	
		$result = $this->execQuery("call addOrModifyUserGroup(?,?,?)",array($id_user_group, $group_name, 1),1);
		return array("success"=>true,"result"=>array("id_user_group"=>$result->id_user_group_IN, "group_name"=>$group_name));

	
	
	}
	
	
	
	public function checkConnect(){
	
		$this->checkUserLogin($this->auth->getIdentity()->uid);
		return array("success"=>true);
	
	}
	
	public function addOrModifyUser($email, $firstname, $lastname, $id_user_group, $active=0, $newPass="", $newPassConfirm="", $id_user=0, $generatePass=0,$sendMail=0 ){
	
		
		// vérification que l'email est bien 
		
	 $regexp="/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i";
 	 if ( !preg_match($regexp, $email) ) return array("success"=>false, "error"=>"Adresse email invalide");
		
		if(empty($id_user)){
			
			// vérifications que le mail n'existe pas déjà
			
			$sql = "select id_user from ".DBPREFIX."admin_users where email=?";
			$result = $this->execQuery($sql, array(trim($email)),1);
			
			//if($result) return array("success"=>false, "error"=>"Cet utilisateur existe d&eacute;j&agrave;");
			
			$arrayUser=array("email"=>$email, "firstname"=>$firstname, "lastname"=>$lastname, "active"=>$active, "id_user_group"=>$id_user_group);

			
		}
		
		else {
		$user = $this->find($id_user);
		
		$checkResult = $this->execQuery("call checkUserGroup(?)", array($user->id_user_group), 1);
		
		if($checkResult->result ==-1) return array("success"=>false, "error"=>"Le groupe Super Admin doit toujours avoir au moins un utilisateur");
		
		if($user->id_user_group!=$id_user_group):
		$this->execQuery("delete from ". DBPREFIX."users_rights where id_user=?", array($id_user),-1);
		$this->copyUserRights($id_user_group, $id_user);
		
		endif;
		
		
		$arrayUser=$user->dataToArray();
		
		$arrayUser["email"]=$email;
		$arrayUser["firstname"]=$firstname;
		$arrayUser["lastname"]=$lastname;
		$arrayUser["active"]=$active;
		$arrayUser["id_user_group"]=$id_user_group;
		
		}
		
		// filtre et vérification des mot de passe
		
		
		$pass=null;
		
		if(!empty($newPass)&&empty($newPassConfirm))return array("result"=>false, "msg"=>"Il manque la confirmation du mot de passe");
		
		if(!empty($newPass)&&!empty($newPassConfirm)):
		
		
		$filter = new Zend_Filter_StripTags();
		
		$newPass=$filter->filter($newPass);
		$newPassConfirm=$filter->filter($newPassConfirm);
		
		if($newPass!=$newPassConfirm) return array("result"=>false, "msg"=>"les mots de passe ne correspondent pas");
		
		$pass=$newPass;
		
		endif;
		
		if($generatePass==1||null!==$pass):
	 		$passdata = $this->generatePass();
	 		$pass=null==$pass?$passdata[0]:$pass;
	
		if(empty($id_user)):
		$arrayUser["pass_salt"]=$passdata[1];
		$salt=$passdata[1];
		
		else:
		
		$salt=$arrayUser["pass_salt"];
		
		endif;
		$arrayUser["pass"]=sha1($pass.$salt);
	 
	 endif;

	if($id_user>0):
	$uid=$arrayUser["uid"];
	$arrayUser["id_user"]=$id_user;
	 else:
	$arrayUser["creation_date"] = strftime("%Y-%m-%d %H:%M");
	$uid=$this->generateUUID();
	$arrayUser["uid"]=$uid;
	 endif;
		

	 
	$user=new Admin_Model_AdminUsers($arrayUser); 
	$id=$this->addOrModify($user);
	
	$userData=$this->find($id);
	
	if($id_user==0)$this->copyUserRights($id_user_group, $id);
	$arrayResult=$userData->dataToArray();
	
	unset($arrayResult["pass_salt"]);
	unset($arrayResult["pass"]);
	unset($arrayResult["uid"]);

		
	if($sendMail==1&&null!==$pass) $this->sendPassMail($userData, $pass);
	
	return array("success"=>true, "result"=>$arrayResult);
	
	
	}
	
	public function addOrModify(Admin_Model_AdminUsers $adminUser){
	
		
		$id=$adminUser->__get('id_user');
		
		$data=$adminUser->dataToArray();


		if(isset($id)&&$id>0)$this->getDbTable()->update($data, $this->getDbTable()->getAdapter()->quoteInto('id_user=?', $id));
		else {
			
			$id=$this->addData($data);
			
			
		}

		return $id;
		
	}
	
	public function authenticate($email, $pass, $newConnection=0){
	
		$row=$this->execQuery("call getAdminUserDetail(?,?)",array('',$email),1);
		
			if(!$row) return array("success"=>false,"msg"=>"utilisateur inconnu, veuillez contacter l'administrateur du site");
			elseif($row->active!=1)return array("success"=>false,"msg"=>"Votre profil n'est pas activ&eacute;, veuillez contacter l'administrateur du site");
		
			$check=$this->checkUserLogin($row->uid);
		
			
			if($check==-1&&$newConnection==0)return array("success"=>false,"errorCode"=>-2,"msg"=>"Vous &ecirc;tes d&eacute;j&agrave; connect&eacute; sur un autre poste.<br />Souhaitez-vous vous connecter sur cette session ?");
			
        $dbAdapter = $this->getDbTable()->getAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
        
        $authAdapter->setTableName( DBPREFIX.'admin_users')
            ->setIdentityColumn('email')
            ->setCredentialColumn('pass')
            ->setCredentialTreatment('SHA1(CONCAT(?,pass_salt))');
         $authAdapter->setIdentity($email)->setCredential($pass);
         
         $auth=Zend_Auth::getInstance();
         
         $result=$auth->authenticate($authAdapter);
        
        
         if($result->isValid()){
         
        	$user = $authAdapter->getResultRowObject(array('uid'));
         	 
            $auth->getStorage()->write($user);
			$this->unlockUserElement($row->uid);
            
           
            
            $adminUser = new Admin_Model_AdminUsers((array)$row);
	        $adminUser->__set('last_connexion',strftime("%Y-%m-%d %H:%M"));
			$adminUser->__set('connexion_timestamp', strftime("%Y-%m-%d %H:%M"));
			$adminUser->__set('ip_address', $_SERVER['REMOTE_ADDR']);
			$adminUser->__set('session_id', Zend_Session::getId());
	        $this->addOrModify($adminUser);
	       
            return array("success"=>true);
            
         }
         
         return array("success"=>false,"msg"=>"mot de passe invalide ");
	}
	
	public function getUserData($uid){
	
	
		$stmt=$this->getDbTable()->getAdapter()->query("call getAdminUserDetail(?,?)",array($uid,''));
		$row=$stmt->fetch(PDO::FETCH_ASSOC);
		unset($stmt);

		
		if($row)$user = new Admin_Model_AdminUsers($row);
		else $user=null;
		return $user;
		
		
	}
	
	public function getUserInfo(){
	
	
		 $auth=Zend_Auth::getInstance();
		 
		 if(!$auth->hasIdentity()) return array("success"=>false, "msg"=>"Vous avez &eacute;t&eacute; d&eacute;connect&eacute;s !");
		 
		 $uid=$auth->getIdentity()->uid;
		 
		 $user=$this->getUserData($uid);
		 
		 
		 
		
		 
		 return array("success"=>true, "data"=>array("firstname"=>$user->__get("firstname"), "lastname"=>$user->__get("lastname"), "email"=>$user->__get("email")));
		 
	
	}
	
	public function lostPass($email){
	
	
		$stmt=$this->getDbTable()->getAdapter()->query("call getAdminUserDetail(?,?)",array('',$email));
		$row=$stmt->fetch(PDO::FETCH_ASSOC);
				unset($stmt);
		if(!$row) return array("success"=>false,"msg"=>"Utilisateur inconnu, veuillez contacter l'administrateur du site");
		
	$adminUser = new Admin_Model_AdminUsers($row);
	
	$passdata = $this->generatePass();
	
	
	$pass=$passdata[0];
	$salt=$passdata[1];
	
	$adminUser->__set('pass_salt',$salt);
	$adminUser->__set('pass', sha1($pass.$salt));
	
	// envoi du mail
	
	$this->sendPassMail($adminUser, $pass);
	
	//sauvegarde des infos
	
	$this->addOrModify($adminUser);
	
	return array("success"=>true,"msg"=>"Un message vous a &eacute;t&eacute; adress&eacute; &agrave; $email avec vos informations de connexion.");

		
	}
	
	public function updateUserData($firstname, $lastname, $newPass="", $newPassConfirm=""){
		$auth=Zend_Auth::getInstance();
		$uid=$auth->getIdentity()->uid;
		$adminUser=$this->getUserData($uid);
		
		
		
		if(!empty($newPass)&&!empty($newPassConfirm)):
		
		if($newPass!=$newPassConfirm) return array("success"=>false, "msg"=>"Les mots de passe ne correspondent pas");
		else {
			
		$passdata = $this->generatePass();
	
		$salt=$passdata[1];
	
	
	
		$adminUser->__set('pass_salt',$salt);
		$adminUser->__set('pass', sha1($newPass.$salt));
	
	// envoi du mail
	
		$this->sendPassMail($adminUser, $newPass);
	}
		endif;
		
	$adminUser->__set("firstname", $firstname);
	$adminUser->__set("lastname", $lastname);
	
	$this->addOrModify($adminUser);
	
	return $this->getUserInfo();
		
	}
	
	private function sendPassMail(Admin_Model_AdminUsers $adminUser, $pass){
	
	$site=Zend_registry::get("site");
	
	$message="<p>Bonjour ".utf8_decode($adminUser->__get('firstname'))." ".utf8_decode($adminUser->__get('lastname')).",<br />";
	$message.="Veuillez trouver vos informations pour vous connecter &agrave; l'administration du site ".$site->site_name." :<br /><ul><li>Identifiant : ".$adminUser->__get("email")."</li><li>Mot de passe : $pass</li></ul>";
	$mail = new Admin_Model_SendMail();
	$mail->sendMail($adminUser->__get('email'), $message, "Vos informations de connexion à l'administration du site ".$site->site_name);
	
	
	}
	

	public function getUsers(){
	
	$rowset=$this->execQuery("call getUserGroup(?)",array(1));
		
	$arrayResult=array();
	
	foreach($rowset as $row):
		
	$children=$this->execQuery("call getAdminUsers(?)", array($row->id_user_group));
	
	$arrayProv=array("group_name"=>$row->group_name, "id_user_group"=>$row->id_user_group,"type"=>"group","active"=>null, "superadmin"=>$row->superadmin, "children"=>array());
	
	foreach($children as $child):
	
	array_push($arrayProv["children"], array("firstname"=>$child->firstname,"lastname"=>$child->lastname, "id_user"=>$child->id_user,"type"=>"user","id_user_group"=>$row->id_user_group,"creation_date"=>$child->creation_date, "last_connexion"=>$child->last_connexion,"email"=>$child->email,"active"=>$child->active, "isLeaf"=>true,"children"=>array()));
	
	endforeach;
	
	$arrayProv["isLeaf"]=count($children)==0;
	
	
	
	array_push($arrayResult, $arrayProv);
		
	endforeach;
	
return $arrayResult;
		
	
	}
	
	public function deleteAdminElement($id_user_group=0, $id_user=0){
	
	
	$result = $this->execQuery("call deleteAdminElement(?,?)", array($id_user_group, $id_user),1);
	
	
	
	switch($result->result):
	
		default:
		$success=true;
		$error=null;
		break;
		
		case -1:
			$success=false;
			$error="id_user_group inconnue";
		break;
		
		case -2 :
			$success=false;
			$error="Le groupe n'est pas vide";
		break;

		case -3 :
			$success=false;
			$error="Vous ne pouvez pas supprimer le groupe Super Admin";
		break;
		
		case -4 :
			$success=false;
			$error="le groupe Super Admin doit avoir au moins un utilisateur d'affect&eacute;";
		break;
	
	endswitch;
	
	return array("success"=>$success, "error"=>$error);
	
	
	}
	
	/*
	 * Private functions
	 * 
	 */
	
	private function generatePass(){
	
		
		
	$helper=Zend_Controller_Action_HelperBroker::getStaticHelper('RandomString');
	
	$pass=$helper->direct(6);
	
	$salt=$helper->direct(40);
	
	
	return array($pass, $salt);
	
	}

	private function generateUUID(){
	
		$result=$this->execQuery("select UUID() as uuid",array(),1);
		return $result->uuid;
	
	}
	
	public function checkUserLogin($uid){
		
		$userData=$this->getUserData($uid);
		
		$ip = $userData->ip_address;
		$connexion_tmsp=strtotime($userData->connexion_timestamp);
		$dif=abs(time()-$connexion_tmsp)/60;
	
	
		if(null!==$ip&&null!==$userData->session_id&&($_SERVER['REMOTE_ADDR']!=$ip || $userData->session_id!=Zend_Session::getId())&&$dif<session_cache_expire()):
		
		
		return -1;
		
		endif;
					
		if(null==$userData) :
		
		
		if(null!==$userData):
		$userData->__set('ip_address',null);
    	$userData->__set('connexion_timestamp',null);
    	$userData->__set('session_id',null);
		$this->addOrModify($userData);
    	endif;
    	$auth=Zend_Auth::getInstance();
		$auth->clearIdentity();
		
		return -2; // -2 la session a expirée

		endif;
		 $storage = new Zend_Auth_Storage_Session();
		// Zend_Session::regenerateId();
		$sessionNamespace=Zend_Registry::get('auth_session'); //tu enregistre ta session dans le registre afin de pouvoir y accéder depuis ton plugin d'ACL
        //$sessionNamespace->setExpirationSeconds(3600);
        $sessionNamespace->timeout = time()+3600*60;
        $auth = Zend_Auth::getInstance();
        $auth->setStorage($storage);
		
	}
	
	public function connectNewSession($email=0){
	
		$auth=Zend_Auth::getInstance();
		
		$userData = $this->getUserData($auth->getIdentity()->uid);	
		$dbAdapter = $this->getDbTable()->getAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
        
        $authAdapter->setTableName( DBPREFIX.'admin_users')
            ->setIdentityColumn('email')
            ->setCredentialColumn('email');            
        $authAdapter->setIdentity($userData->email)->setCredential($userData->email);
        $result=$auth->authenticate($authAdapter);
         
         
         if($result->isValid()){
        	$user = $authAdapter->getResultRowObject(array('uid'));
            $auth->getStorage()->write($user);
            $this->unlockUserElement($this->auth->getIdentity()->uid);
            $userData->__set('last_connexion',strftime("%Y-%m-%d %H:%M"));
			$userData->__set('connexion_timestamp', strftime("%Y-%m-%d %H:%M"));
			$userData->__set('ip_address', $_SERVER['REMOTE_ADDR']);
			$userData->__set('session_id', Zend_Session::getId());
	        $this->addOrModify($userData);
		
	        return array("success"=>true);
	        
         }
         
         return array("success"=>false);
	
	}
	
	public function killIdentity(){
	$auth=Zend_Auth::getInstance();
	
	$this->unlockUserElement($auth->getIdentity()->uid);
		$auth->clearIdentity();
		
		return array("success"=>true);
	
	}
	
	public function unlockUserElement($uid){
	
	 $this->execQuery('call unlockUserElement(?)', array($uid),-1);
	
	}
	

	public function copyUserRights($id_user_group, $id_user){

		$sql ="select * from ".DBPREFIX."users_rights where id_user_group=? and id_user=0";
		$result = $this->execQuery($sql, array($id_user_group));

		foreach($result as $right):
		
		$this->execQuery("insert into ".DBPREFIX."users_rights (module,id_user_group,`plugin`,rubId,`write`, `read`, `edit`, id_user, id_site) values (?,?,?,?,?,?,?,?,?)", array($right->module, $id_user_group, $right->plugin, $right->rubId, $right->write, $right->read, $right->edit, $id_user, $right->id_site), -1);
		
		
		endforeach;

		
	}
	
}

