<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

	
protected function _initDoctype()
    {
        $this->bootstrap('view');
        $view = $this->getResource('view');
        $view->doctype('HTML5');
        
    }
    
protected function _initLoaderResource()
{
	

     $resourceLoader = new Zend_Loader_Autoloader_Resource(array(
                'basePath'  =>APPLICATION_PATH."/modules/admin",
                'namespace' => 'Admin'
        ));
        $resourceLoader->addResourceTypes(array(
                'model' => array(
                        'namespace' => 'Model',
                        'path'      => 'models'
                ),
                 'table' => array(
                        'namespace' => 'Model_DbTable',
                        'path'      => 'models/DbTable'
                ),
                'plugin'=>array(
                        'namespace' => 'Plugin',
                        'path'      => 'plugins'
                )
        ));
       
 
        $resourceLoader2 = new Zend_Loader_Autoloader_Resource(array(
        		'basePath'  =>APPLICATION_PATH."/modules/cmsmodules",
        		'namespace' => 'Cmsmodules'
        ));
        $resourceLoader2->addResourceTypes(array(
        		'controller'=>array('namespace' => 'Controller',
        				'path'      => 'controllers'),
        		'model' => array(
        				'namespace' => 'Model',
        				'path'      => 'models'
        		),
        		'table' => array(
        				'namespace' => 'Model_DbTable',
        				'path'      => 'models/DbTable'
        		),
        		'plugin'=>array(
        				'namespace' => 'Plugin',
        				'path'      => 'plugins'
        		)
        ));
        
        
         $resourceLoader3 = new Zend_Loader_Autoloader_Resource(array(
        		'basePath'  =>APPLICATION_PATH."/modules/default",
        		'namespace' => 'Default'
        ));
        $resourceLoader3->addResourceTypes(array(
        		'controller'=>array('namespace' => 'Controller',
        				'path'      => 'controllers'),
        		'model' => array(
        				'namespace' => 'Model',
        				'path'      => 'models'
        		),
        		'table' => array(
        				'namespace' => 'Model_DbTable',
        				'path'      => 'models/DbTable'
        		),
        		'plugin' => array(
        				'namespace' => 'Plugin',
        				'path'      => 'plugins'
        		),
        		'view' => array(
        				'namespace' => 'View',
        				'path'      => 'views'
        		)
        ));
        
        
        
        

}

protected function _initActionHelpers ()
{
	       Zend_Controller_Action_HelperBroker::addPath(
        APPLICATION_PATH . '/../library/My/Action/Helpers/',
        'My_Action_Helpers_');
	       
	     //  echo  APPLICATION_PATH . '/../library/My/Action/Helpers/';

 
}

protected function _initCache(){
	$aFrontendConf = array ("lifetime" => 345600, "automatic_seralization" => true);
	$aBackendConf = array ('cache_dir' => APPLICATION_PATH.'/cache/');
	$oCache = Zend_Cache::factory('Core','File',$aFrontendConf,$aBackendConf);
	$oCache->setOption('automatic_serialization', true);
	Zend_Locale::setCache($oCache);
}
    
    public function _initRoutes()
    {
    	
    	$frontController = Zend_Controller_Front::getInstance();
		$config = new Zend_Config_Ini(APPLICATION_PATH . DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'application.ini', APPLICATION_ENV);
    	$frontController->getRouter()->addConfig($config, 'routes');
    	
    	$router = $frontController->getRouter();
    	
    	$route = new Zend_Controller_Router_Route_Regex(
    			'cmsmodules/([a-zA-Z]+)/([a-zA-Z]+)',
    			array(
    					'module'=>'cmsmodules',
    					'controller' => 'dispatcher',
    					'action'     => 'index',
    					'format'=>'json'
    			)
    	);
    	
    	$router->addRoute(
    			'cmsmodules',
    			$route
    	);
    	


    	
    }
    
    
public function run()
{
       Zend_Layout::startMvc();
	$acl = new Zend_Acl();
    $acl->addRole('adminUser');
    $acl->addRole('guest');
    $acl->allow('guest',null, array("read"));

   
 
    Zend_registry::set('adminACL', $acl);

    // redirection
    
    $requestUri = $_SERVER["REQUEST_URI"];
	$config = new Zend_Config_Ini(APPLICATION_PATH . DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'application.ini', APPLICATION_ENV);
	
    	Zend_Registry::set('config', $config);
    	
    	if(!defined('DBPREFIX'))define('DBPREFIX',isset($config->dbPrefix)?$config->dbPrefix:"cms_");
    	
    	
    	Zend_Controller_Action_HelperBroker::addPrefix('My_Action_Helpers');
    	$path=realpath(APPLICATION_PATH . '/../library/My/Action/Helpers');
    	
    	
    	
    	Zend_Controller_Action_HelperBroker::addPath($path, 'My_Action_Helpers');
    	
    	Zend_Controller_Action_HelperBroker::addPrefix('My_View_Helpers');
    	$path=realpath(APPLICATION_PATH . '/../library/My/View/Helpers');
    	 
    	 
    	 
    	Zend_Controller_Action_HelperBroker::addPath($path, 'My_View_Helpers');
    	
    	$front = Zend_Controller_Front::getInstance();
    	
    	$front->registerPlugin(new Admin_Plugin_ErrorControllerSelector(),1);
    	
    	if(!defined('DBPREFIX'))define('DBPREFIX',isset($config->dbPrefix)?$config->dbPrefix:"cms_");
    
        	
    	if($config->install){

    		
    	$siteClass = new Admin_Model_SitesMapper();
    	$idSite= $siteClass->findByHost();
    	
	    	
    	$site = $siteClass->find($idSite);
    	
    
    	Zend_Registry::set('site', $site);
    	if(!defined('IMG_FOLDER'))define('IMG_FOLDER',$site->site_url."/".$site->media_dir);
    	
    	
    	$this->auth=Zend_Auth::getInstance();
    	if(Zend_Registry::isRegistered("site"))$this->site=Zend_Registry::get("site");
    	
    	/*
    	 * Vérification si on a un utilisateur admin  connecté
    	 * 
    	 */
    	
    	$userModl= new Admin_Model_AdminUsersMapper();
    	
    	$this->isLogged=$userModl->checkUserLogin($this->auth->getIdentity()->uid);
    	
    	$this->userData=$userModl->getUserData($this->auth->getIdentity()->uid);
    	
    	//$this->isAdmin=$this->userData->id_user>0;
    	
    	//if(null!==$this->userData)$front->registerPlugin(new Default_Plugin_Initialisation());
    	
    	}
    	else{
    	$front = Zend_Controller_Front::getInstance();
    	$front->registerPlugin(new Admin_Plugin_CheckInstall(),2);
    	}
    
    	parent::run();
	    	
    
    }

    public function _initSession(){
	//Zend_Session::start();
    	$config = new Zend_Config_Ini(APPLICATION_PATH . DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'session.ini', APPLICATION_ENV);
    	Zend_Session::setOptions($config->toArray());
    	
        //initialisation du temps de session
        $storage = new Zend_Auth_Storage_Session();
        $sessionNamespace = new Zend_Session_Namespace($storage->getNamespace());
        $sessionNamespace->setExpirationSeconds(3600);
        Zend_Registry::set('auth_session', $sessionNamespace); //tu enregistre ta session dans le registre afin de pouvoir y accéder depuis ton plugin d'ACL
        $auth = Zend_Auth::getInstance();
        $auth->setStorage($storage);
    }
    
    /**
* Initialize data bases
*
* @return Zend_Db::factory
*/
protected function _initDb()
{
	$config = new Zend_Config_Ini(APPLICATION_PATH . DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'application.ini', APPLICATION_ENV);

	
	
    	try{
         $db = Zend_Db::factory($config->database);
     
         $db->getConnection();
          $db->setFetchMode(Zend_Db::FETCH_ASSOC);
     Zend_Db_Table_Abstract::setDefaultAdapter($db);
     
     }catch ( Exception $e ) {
     	$db=null;
     	die($e->getMessage());
     	
     	
     }
     // on stock notre dbAdapter dans le registre

     Zend_Registry::set( 'db', $db );
  
     return $db;
}

}

