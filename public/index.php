<?php


defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

    
if($_SERVER['HTTP_HOST']=="glutabye.com"):
header("location:http://www.glutabye.com".$_SERVER['REQUEST_URI'],null,"301");
die();
endif;
    
    if(preg_match('/glutabyepreprod/',$_SERVER["HTTP_HOST"]))define('APPLICATION_ENV','development');
    elseif(preg_match('/agence-texto.fr/',$_SERVER["HTTP_HOST"]))define('APPLICATION_ENV','production');
    else define('APPLICATION_ENV','production');
    define('CDN_URL',getenv('APPLICATION_ENV')!="development"?'http://cdn.agence-texto.fr/_js/':'http://cdn.tcho-pc/_js/');

// Define application environment
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    (APPLICATION_PATH . '/../library'),
     (APPLICATION_PATH . '/../library/My/Action/Helpers'),
    get_include_path(),
)));



/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'application.ini'
);

$application->bootstrap()
            ->run();