<?php
class Admin_Model_UsersRightsMapper extends Admin_Model_Mapper
{

	public $_tableName="UsersRights";
	
	
	
	public function updateRights(array $items, $id_user=0, $id_user_group=0){
	
		//phpinfo();
		
		
		foreach($items as $key=>$post):
		
//		echo "<li>=>$key : ".$item['id_site']."</li>";

		
		
		
		$array=explode('|',$post);
		
		$item=array(
				"rubId"=>$array[0],
				"plugin"=>$array[1],
				"module"=>$array[2],
				"read"=>$array[3],
				"write"=>$array[4],
				"edit"=>$array[5],
				"id_site"=>$array[6]
				);
		
		$test=$this->execQuery("call updateUsersRights(?,?,?,?,?,?,?,?, ?)", array($id_user_group, $id_user,$item['module'], empty($item['plugin'])?'':$item['plugin'], $item['rubId'], $item['read'],$item['write'],$item['edit'], $item['id_site']),-1);

		
		endforeach;
		
		return array('success'=>true);
	

	
	}
	
	public function loadUsersRights($id_user_group, $id_user=0){
	
	
		$result = $this->execQuery('call loadUsersRights(?,?)',array($id_user_group, $id_user));
		
		
		
		return array("success"=>true, "result"=>$result);
		
	
	}
	
	
	public function checkAdminUserModules($id_site){
		
		$acl=$this->acl;
		$siteClass = new Admin_Model_SitesMapper();
		
	$modules = $siteClass->getSiteModules($id_site,1);

			 
			$arrayModule=array();

			foreach($modules["result"] as $module):

			$moduleName=preg_replace("/TextoCMS.controller./","",$module->module_name);

			$moduleResource=$moduleName."__0".'_'.$id_site;

			if($acl->has($moduleResource)&&$acl->isAllowed('adminUser', $moduleResource,'read')||(!$acl->has($moduleResource)&&$acl->isAllowed('adminUser'))):

			 
			 
			$items=json_decode($module->items);

			
			array_push($arrayModule, $module);

			else:



			endif;

			// droits des plugins

			// var_dump($items);

			endforeach;

		
			
			return $arrayModule;
		
	}
	
	public function checkModuleRights($moduleName, $id_site){
		
		$resourceName=$moduleName.'__0_'.$id_site;
		$rights=$this->checkUsersRights($resourceName);
		return array("success"=>true,"rights"=>$rights);
		
	}
	
}