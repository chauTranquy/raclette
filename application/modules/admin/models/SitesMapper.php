<?php

class Admin_Model_SitesMapper extends Admin_Model_Mapper
{

	public $_tableName="Sites";
	
	public function getSiteList(){
	
	
	$rowset=$this->execQuery("call getSiteList()");
	return array("success"=>true, "sites"=>$rowset);
	
	}
	
	public function addOrModify($site_name, $site_url, $site_logo, $media_dir,$id_site=0){
	
	
	
	}
	
	public function getSiteParams($id_site){
		
		$siteParam = $this->find($id_site);
		
		if(!$siteParam) return array("success"=>false, "errorMessage"=>"id site invalide");
		$data = $siteParam->getData();
		$data->currentIp=$_SERVER['REMOTE_ADDR'];
		$data->currentPath=realpath(APPLICATION_PATH.DIRECTORY_SEPARATOR.'..');
		return array("success"=>true,"data"=>$data);
		
	}
	
	public function getSiteModules($id_site=1, $active=1){
	
	$result = $this->execQuery("call getSiteModules(?,?)", array($id_site, $active));

	
	
	return array("success"=>true, "result"=>$result);
	
	
	}
	
	public function saveSiteParams($media_dir,  $site_name, $layout,$site_url, $site_logo="", $id_site=1, $maintenance=0, $allowed_ip=null, $path=""){
		
		$site = $this->find($id_site);
		
		if(!empty($maintenance)):
		
		$arrayIP = explode(';', $allowed_ip);
		foreach($arrayIP as $ip):
		
		if(!filter_var($ip, FILTER_VALIDATE_IP))return array("success"=>false, "msg"=>"Adresse IP invalide ($ip)");
		
		endforeach;
		
		endif;
		
		
		$site->__set('media_dir', $media_dir);
		$site->__set('site_name', $site_name);
		$site->__set('site_logo', $site_logo);
		$site->__set('site_url', $site_url);
		$site->__set('maintenance', $maintenance);
		$site->__set('allowed_ip', $allowed_ip);
		$site->__set('layout', $layout);
		//$site->__set('googleAnalytics', $googleAnalytics);
		$site->__set('path', urldecode($path));
		$this->addData($site->dataToArray());
		return array("success"=>true, "msg"=>"Param&egrave;tres sauvegard&eacute;s");
		
		
	}
	
	public function saveCssJsFilesParams($id_site=1, $cssFiles="", $jsFiles=""){
		
		
		$paramsClass = new Admin_Model_ParamsMapper();
		
		$paramsClass->addOrModify($id_site,0,"jsFiles", $jsFiles);
		$paramsClass->addOrModify($id_site,0,"cssFiles", $cssFiles);
		return array("success"=>true, "msg"=>"Param&egrave;tres sauvegard&eacute;s");
		
	}

	public function findByHost(){
		
		$query="select id_site from ".DBPREFIX."sites where site_url=?";
		
		$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https')
		=== FALSE ? 'http' : 'https';

		$url=$protocol.'://'.$_SERVER['HTTP_HOST'];
		
		$result=$this->execQuery($query, array($url),1);
		
		return $result->id_site;
		
		//$array=array($_SERVER["SERVER_PROTOCOL"])
		
		
	}
	
	public function updateGoogleAnalyticsData($id_site,$googleClientID,$googleUrl, $googleClientSecret, $googleProfileId, $googleAccountId, $googleWebPropertyId,$googleActivated=0){
		
		$site = $this->find($id_site);
		$site->__set('googleClientID', $googleClientID);
		$site->__set('googleClientSecret', $googleClientSecret);
		$site->__set('googleProfileId', $googleProfileId);
		$site->__set('googleAccountId', $googleAccountId);
		$site->__set('googleWebPropertyId', $googleWebPropertyId);
		$site->__set('googleActivated',$googleActivated);
		$site->__set('googleUrl',$googleUrl);
		
		$this->addData($site->dataToArray());
		return array("success"=>true, "msg"=>"Param&egrave;tres Google Analytics sauvegard&eacute;s");
		
		
		
	}
	
	public function getGoogleData($id_site){
		
		$site = $this->find($id_site);
		
		$result = array('googleClientID'=>$site->__get('googleClientID'),
				"googleClientSecret"=>$site->__get('googleClientSecret'),
		"googleProfileId"=>$site->__get('googleProfileId'),
		"googleAccountId"=>$site->__get('googleAccountId'),
		"googleWebPropertyId"=>$site->__get('googleWebPropertyId'),
		"googleActivated"=>$site->__get('googleActivated'),
		"googleUrl"=>$site->__get('googleUrl'));
		
		return array("success"=>true,"result"=>$result);
		
	}
		

}

