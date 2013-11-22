<?php

class Cmsmodules_Model_ClientsProMapper extends Cmsmodules_Model_Mapper{


	private $_site;
	public $_tableName="ClientsPro";
	protected $tablePrefix= "Cmsmodules_Model";

	//protected $_moduleName="CmsClass.Main";


	public function addData($raison_sociale, $adresse, $cp, $ville, $type, $id_groupe,$num_client,$nom,$prenom,$civilite,$pays="FR", $siret="",$adresse2="",$adresse3="",$tel="",$email="",$id_client=0, $password=null,$statut=0){

		$data = array('raison_sociale'=>$raison_sociale,
				"adresse"=>$adresse,
				"adresse2"=>$adresse2,
				"adresse3"=>$adresse3,
				"prenom"=>$prenom,
				"nom"=>$nom,
				"pays"=>$pays,
				"siret"=>$siret,
				"cp"=>$cp,
				"ville"=>$ville,
				"type"=>$type,
				"id_groupe"=>$id_groupe,
				"email"=>$email,
				"tel"=>$tel,
				"num_client"=>$num_client,
				"id_client"=>$id_client,
				"civilite"=>$civilite,
				"password"=>$password,
				"statut"=>$statut);

		$result= parent::addData($data);
		return array("success"=>true, "id_client"=>$result);


	}
	public function delete($id){
		parent::delete($id);
		return array("success"=>true);

	}
	public function fetchAllClient($where=""){

		$sql="select A.*, B.type as libelleType, C.name as groupName, C.description, C.status from cms_clients A, cms_type_clients B, cms_espacepro C where A.id_groupe=C.id_espacepro and A.type=B.id_type";
		if(!empty($where))$sql.=" and $where";
		
		//$sql="select * from cms_clients ";

		$result = $this->execQuery($sql, array());
		return $result;


	}

	public function deleteSelection($ids){


		$arrayIds = explode('|',$ids);

		foreach($arrayIds as $id)$this->delete($id);
		return array("success"=>true);

	}

	public function search($id_client_request,$keyword="",$searchEmail=0, $searchSIRET=0,$searchRS=0,$searchCP=0 ){


		$clientRequestMapper = new Cmsmodules_Model_ClientsRequestMapper();

		$clientRequest = $clientRequestMapper->find($id_client_request);


		$arrayResult=array();
		$keyword='*'.trim($keyword).'*';

		if(!empty($keyword)):
		$arrayResult['keyword']=array();

		$sql="SELECT id_client, raison_sociale,
		MATCH (raison_sociale) AGAINST ('$keyword') AS rs_match,
		MATCH (nom, prenom) AGAINST ('$keyword') AS name_match,
		MATCH (adresse,adresse2,adresse3) AGAINST ('$keyword') AS adresse_match,
		MATCH (ville) AGAINST ('$keyword') AS ville_match,
		MATCH (email) AGAINST ('$keyword') AS email_match
		FROM cms_clients
		WHERE MATCH (raison_sociale,nom, prenom,adresse, adresse2, adresse3,email) AGAINST ('$keyword' IN BOOLEAN MODE)
		ORDER BY (rs_match*4+name_match*3+ adresse_match*2+ ville_match*2+email_match*3) DESC LIMIT 0,100;";

		$results = $clientRequestMapper->execQuery($sql,array());

		$arrayResult['keyword']=$results;

		endif;

		if($searchEmail==1):

		$sql="SELECT id_client, raison_sociale,MATCH (email) AGAINST (?) AS email_match  from cms_clients where MATCH (email) AGAINST (? IN BOOLEAN MODE) ORDER BY email_match";

		$results = $clientRequestMapper->execQuery($sql,array($clientRequest->__get('email'), $clientRequest->__get('email')));

		$arrayResult['email']=$results;

		endif;

		if($searchSIRET==1):

		$sql="SELECT id_client, raison_sociale,MATCH (siret) AGAINST (?) AS siret_match  from cms_clients where MATCH (siret) AGAINST (? IN BOOLEAN MODE) ORDER BY siret_match";
		$results = $clientRequestMapper->execQuery($sql,array($clientRequest->__get('siret'), $clientRequest->__get('siret')));
		$arrayResult['siret']=$results;

		endif;

		if($searchSIRET==1):

		$sql="SELECT id_client, raison_sociale,MATCH (raison_sociale) AGAINST (?) AS raison_sociale_match  from cms_clients where MATCH (raison_sociale) AGAINST (? IN BOOLEAN MODE)ORDER BY raison_sociale_match";
		$results = $clientRequestMapper->execQuery($sql,array($clientRequest->__get('raison_sociale'), $clientRequest->__get('raison_sociale')));
		$arrayResult['raison_sociale']=$results;

		endif;

		if($searchCP==1):

		$sql="SELECT id_client, raison_sociale,MATCH (cp) AGAINST (?) AS cp_match  from cms_clients where MATCH (cp) AGAINST (? IN BOOLEAN MODE) ORDER BY cp_match";
		$results = $clientRequestMapper->execQuery($sql,array($clientRequest->__get('cp'), $clientRequest->__get('cp')));
		$arrayResult['cp']=$results;

		endif;


		return $arrayResult;


	}


	public function validClientRequest($raison_sociale, $adresse, $cp, $ville, $type, $id_groupe,$num_client,$nom,$prenom,$civilite, $id_client_request,$pays="FR", $siret="",$adresse2="",$adresse3="",$tel="",$email="",$id_client=0, $password=null,$statut=0, $sendMail=1){

		$data = array('raison_sociale'=>$raison_sociale,
				"adresse"=>$adresse,
				"adresse2"=>$adresse2,
				"adresse3"=>$adresse3,
				"prenom"=>$prenom,
				"nom"=>$nom,
				"pays"=>$pays,
				"siret"=>$siret,
				"cp"=>$cp,
				"ville"=>$ville,
				"civilite"=>$civilite,
				"type"=>$type,
				"id_groupe"=>$id_groupe,
				"email"=>$email,
				"tel"=>$tel,
				"num_client"=>$num_client,
				"id_client"=>$id_client,
				"password"=>$password,
				"statut"=>$statut);

		// mise à jour du statut de la demande

		$requestClass= new Cmsmodules_Model_ClientsRequestMapper();

		$request=$requestClass->find($id_client_request);

		if(!$request) return array("success"=>false, "msg"=>"la demande est introuvable");


		$idFinal=parent::addData($data);
		$request->__set('id_client', $idFinal);
		$request->__set('statut', 1);

		$requestClass->addData($request->dataToArray());

		if($statut==1&&$sendMail==1) $this->sendMail($idFinal, $statut);
		return array("success"=>true,"id_client"=>$idFinal,"statut"=>$statut,"sendMail"=>$sendMail);


	}

	public function refuseClientRequest($id_client_request, $raison_refus=""){

		$requestClass= new Cmsmodules_Model_ClientsRequestMapper();

		$client=$requestClass->find($id_client_request);
		$site = Zend_Registry::get('site');
		if(!$client) return array("success"=>false, "msg"=>"la demande est introuvable");

		$client->__set('statut', -1);

		$requestClass->addData($client->dataToArray());

		$site = Zend_Registry::get('site');

		$mail = new Admin_Model_SendMail();

		$obj = "Votre demande d'accès à l'espace professionnel a été refusée";

		$msg="<p style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\">Bonjour ".$client->__get("prenom")." ".$client->__get('nom').", <br />suite &agrave; votre demande d'acc&egrave;s &agrave; notre l'espace professionnel du site ".$site->site_name;
		$msg.=" nous avons le regret de vous informer que nous ne pouvons donner suite &agrave; votre demande"
				.(!empty($raison_refus)?" pour la raison suivante : <br />\"<em>$raison_refus</em>\".":".<br />Veuillez nous contacter pour plus d'informations.</p>");


		$msg.="<p style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\">&Agrave; bient&ocirc;t sur le site <a href=\"".$site->site_url."\">{$site->site_name} !<br /><strong>L'&eacute;quipe {$site->site_name}</p>";
		$mail->sendMail($client->__get('email'), $msg, $obj);
		return array("success"=>true);
	}

	public function sendMail($id_client, $statut=1,$raison_refus=""){

		$client = $this->find($id_client);
		if(!$client) return false;

		$site = Zend_Registry::get('site');

		$mail = new Admin_Model_SendMail();

		$obj = "Votre demande d'accès à l'espace professionnel a été".($statut==1?" validée":" refusée");

		$msg="<p style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\">Bonjour ".$client->__get("prenom")." ".$client->__get('nom').", <br />suite &agrave; votre demande d'acc&egrave;s &agrave; notre l'espace professionnel ";

		if($statut!==1):

		$msg.=" nous avons le regret de vous informer que nous ne pouvons donner suite &agrave; votre demande.<br />Veuillez nous contacter pour plus d'informations.</p>";

		else:
		$msg.=" nous avons le plaisir de vous informer que votre demande a &eacute;t&eacute; valid&eacute;e</p>"
				."<p style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\">Voici vos informations de connexion :</p>"
						."<ul><li style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\"><strong>Identifiant : </strong>".$client->__get("email")."</li>"
								."<li style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\"><strong>Mot de passe : </strong>".$client->__get("password")."</li></ul>"
										."<p style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\"><strong>Vouspourrez modifier votre mot de passe dans une fois connect&eacute; &agrave; notre espace professionnel</p>";

		endif;

		$msg.="<p style=\"font-family:Arial, Verdana; position: relative; display: block; font-size:12px; color:#FFFFFF;\">&Agrave; bient&ocirc;t sur le site <a href=\"".$site->site_url."\">{$site->site_name} !<br /><strong>L'&eacute;quipe {$site->site_name}</p>";
		$mail->sendMail($client->__get('email'), $msg, $obj);

		return true;


	}

	
	public function getClientRights($id_rubrique){
		
		$sel = $this->execQuery("select id_client from cms_clients_rights where id_rubrique=?", array($id_rubrique));
		
		return array("success"=>true, "sel"=>$sel);
		
	}

	public function addClientRights($id_rubrique, $sel=""){

		$this->execQuery("delete from cms_clients_rights where id_rubrique=?", array($id_rubrique),-1);

		if(!empty($sel)):
		$selArray=explode('|',$sel);

		foreach($selArray as $id_client):
		$this->execQuery('insert into cms_clients_rights (id_rubrique, id_client) values (?,?)', array($id_rubrique, $id_client),-1);
		endforeach;
	endif;
		return array("success"=>true);

	}
}