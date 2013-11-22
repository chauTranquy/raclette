<?php

include_once("AdminController.php");

class Admin_InstallController extends Admin_AdminController{

	protected $_config;

public function init(){

  $contextSwitch = $this->_helper->getHelper('contextSwitch');
  $contextSwitch->addActionContext('getjsondata', 'json')
     ->addActionContext('checkconfig', 'json')
                      ->initContext();
                
         Zend_Registry::set('role','guest');   
         $db= Zend_Registry::get("db");
        
         if($db!=null&&$this->getTableList()>0){
        $siteClass = new Admin_Model_SitesMapper();
    	$site = $siteClass->find(1);
    	Zend_Registry::set('site', $site);
    	

         }

}
	
	public function indexAction(){
	
	$this->_helper->layout->setLayoutPath(APPLICATION_PATH.'/modules/admin/layouts/');
    $this->_helper->layout->setLayout('admin');
	
  
    
    
        
	
	}

	public function preDispatch(){
		
		if($this->_request->getActionName()=="getjsondata") return;

		if(!preg_match('/tcho-pc/', $_SERVER["HTTP_HOST"])):

	$this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js');
	$this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js');
	else:
	
//	$this->view->headScript()->appendFile(CDN_URL.'/common/libs/prototype.js');
//	$this->view->headScript()->appendFile(CDN_URL.'/common/libs/scriptaculous.js');
        
        $this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js');
	$this->view->headScript()->appendFile('https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js');
	
	endif;
    $this->view->headScript()->appendFile(CDN_URL.'/_cmsAdmin/ext/ext-all-debug.js');
    $this->view->headScript()->appendFile(CDN_URL.'/_cmsAdmin/ext/locale/ext-lang-fr.js');
	$this->view->headLink()->appendStylesheet(CDN_URL.'/_cmsAdmin/ext/resources/css/ext-all.css');
	$this->view->headTitle('Texto CMS - Installation '.$this->site->site_name)->setSeparator(' - ');
  	$this->view->headLink()->appendStylesheet('/admin/_css/adminStyle.css');
  	$this->view->headLink()->appendStylesheet('/install/_css/install.css');
		
		
	}
	
	
	public function getjsondataAction(){
	
	parent::getjsondataAction();
	}
	
	public function createAdministrator($email, $firstname, $lastname, $newPass){
	
		$class = new Admin_Model_AdminUsersMapper();
		
		$res=$class->addOrModifyUser($email, $firstname, $lastname, 1, 1, $newPass, $newPass, 0, 0,1);
		
		$result = $class->find(1);

		//if(!$result->id_user_group)
		$class->execQuery("insert into ".DBPREFIX."user_group (id_user_group,group_name, id_site, superadmin) values('1', 'SuperAdmin',1,1)",array(),-1);
		
		return $this->checkconfigAction();
	
	}
	
	public function checkconfigAction(){
	
		$this->_helper->layout()->disableLayout();
    	$this->_helper->viewRenderer->setNoRender(true);
    	
    	// database ok
    	
    	$response=array();
    	    	
    	$db= Zend_Registry::get("db");
 		
    	
    	if($db==null)$response["db"]=false;
    	else $response["db"]=true;
    	
    	if($db!=null)$response["table"]=$this->getTableList()>0; // tables cr��es ?
    	
    	// site cr�� ?
    	
    	if($db!=null&&$this->getTableList()>0):
		$siteClass = new Admin_Model_SitesMapper();
				
    	$site = $siteClass->find(1);
    	$response["site"]=$site!=null;
    	

    	
    	$arboClass = new Admin_Model_ArboMapper();
    	
    	$roots = (object)$arboClass->getRoots();
    	
    	$response["arbo"]=count($roots->roots)>0;
    	
    	$adminUserClass=new Admin_Model_AdminUsersMapper();
    	
    	$nbUsers = $adminUserClass->fetchAll("id_user_group=1");
    	$response["administrator"]=(count($nbUsers))>0;
    	
    	$templatesClass = new Admin_Model_TemplateMapper();
    	$nbTpl = $templatesClass->getTemplateList();
    	
    	$response["tpl"]=(count($nbTpl))>0;
    	
    	
    	
    	endif;
    	
    	
    	//
    	

    	/*
    	$location=APPLICATION_PATH.'/configs/application2.ini';
    	
    	$writer = new Zend_Config_Writer_Ini(
    array(
        'config'   => $config,
    'filename' => $location));
$writer->write();
    	*/
    	
    //	echo PHP_VERSION;
    	
    	$this->view->testResult=$response;
    	$this->view->success=true;
	
	}
	
	public function configSite(){
	
	$siteName = $this->_request->siteName;
	$mediaDir = $this->_request->mediaDir;
	
	$data = array("site_name"=>$siteName,"media_dir"=>$mediaDir, "site_url"=>"http://".$_SERVER["HTTP_HOST"]);
	
	$path = APPLICATION_PATH.'/../public/'.$mediaDir."/";
	
	if(!file_exists($path))mkdir($path);
	
	$siteClass = new Admin_Model_SitesMapper();
	
	$siteClass->addData($data);
		
	return $this->checkconfigAction();
	
	}
	
	
	public function checkDBConnexion($dbHost, $dbName, $dbUser, $dbPass=""){
		

		
	try{
         	$db = Zend_Db::factory('Pdo_Mysql', array(
    'host'     => $dbHost,
    'username' => $dbUser,
    'password' => empty($dbPass)?"xxxx":$dbPass,
    'dbname'   => $dbName
));
		

     
       $db->getConnection();
          	
           
     }catch ( Exception $e ) {
     	
     	switch($e->getCode()):
     	
     	case 1049:
     	$erreur = "la base de donn&eacute;es $dbName est introuvable";
     	break;
     	case 2002:
		$erreur = "H&ocirc;te $dbHost inconnu";
		break;
     	case 1045:
     		$erreur = "Acc&egrave;s refus&eacute; pour l'utilisateur $dbUser";
     	break;
     	default:
			$erreur = "Erreur lors de la tentative de connexion &agrave; la base de donn&eacute;es [{$e->getMessage()}]";
     		
     		break;
     	
     	endswitch;
     	
     	return array("success"=>false, "error"=>$erreur. "[code {$e->getCode()}]");
     	
     }

     $result = $this->changeDB($dbHost, $dbName, $dbUser, $dbPass);
        
     if(is_array($result)&&array_key_exists("success", $result)&&!$result["success"]) return $result;
     
     return $this->checkconfigAction();
	}
	
	
private	function changeDb($dbHost, $dbName, $dbUser, $dbPass){
	
		
 $config= new Zend_Config_Ini(APPLICATION_PATH.'/configs/application.ini', null, array('skipExtends'=> true,'allowModifications' => true));
    
$location=APPLICATION_PATH.'/configs/application2.ini';
		 $writer = new Zend_Config_Writer_Ini(
    array(
        'config'   => $config,
    'filename' => $location));
	$configKey=APPLICATION_ENV;
		

		
		
    if(APPLICATION_ENV!="production")$configKey=APPLICATION_ENV;  
    
    $section=($config->{APPLICATION_ENV});
		
    if(!$section->database){

    
    	
    	$section->database=new Zend_Config(array("params"=>array("host"=>$dbHost,
    	"dbname"=>$dbName,"username"=>$dbUser,"password"=>$dbPass)));
    }
    
    	
      else{  
      	
      	if(!$section->database->params){

      		$section->database->params=new Zend_Config(array("host"=>$dbHost,
    	"dbname"=>$dbName,"username"=>$dbUser,"password"=>$dbPass));
      		
      	}
      	else{
      	
      	$section->database->params->host=$dbHost;
      	$section->database->params->dbname=$dbName;
        $section->database->params->username=$dbUser;
        $section->database->params->password=$dbPass;
      	}
      }
      
   return $this->writeConfigFile($writer);
}

private function writeConfigFile($writer){
      
      
     $str=$writer->render();
       $reg='';
       
      $reg=preg_replace('#\\\\#',"\\\\\\", APPLICATION_PATH);
      
            
       $reg=preg_replace('#\:#','\:',$reg);

       $str1=preg_replace('#"'.$reg.'#','APPLICATION_PATH "',$str);

       
       // verification chmod
       
       //chmod(APPLICATION_PATH.'/configs/application.ini',0777);
       
       if(!$fp=fopen(APPLICATION_PATH.'/configs/application.ini',"w+")) return array("success"=>false,"error"=>"Le fichier application.ini est en lecture seule !");

       fputs($fp, $str1);
       fclose($fp);
       
	return true;
	}
	
	function createDBPrefix(){
	
		if(empty($this->_request->dbPrefix))$dbPrefix ="cms_";
		else $dbPrefix=$this->_request->dbPrefix;
		
		
		$location=APPLICATION_PATH.'/configs/application2.ini';
		
		$config= new Zend_Config_Ini(APPLICATION_PATH.'/configs/application.ini', null, array('skipExtends'=> true,'allowModifications' => true));
		 $writer = new Zend_Config_Writer_Ini(
    array(
        'config'   => $config,
    'filename' => $location));
    
    
 
  $config->{APPLICATION_ENV}->dbPrefix=$dbPrefix;
  
  $this->writeConfigFile($writer);
		
  return array("success"=>true);
	
	}
	
	public function createDB(){
	
	
		$dbPrefix =DBPREFIX;

		
		//importation tables
		
		$sqlFile = realpath(dirname(__FILE__)."/../sql/cmsSQL.sql");
		$fp = fopen($sqlFile, "r");
		while($line = fgets($fp)) :
		if(!preg_match('/(-{2,})/',$line))$content.=$line;
		endwhile;
		
		$db= Zend_Registry::get("db");
		$db->beginTransaction();
		$content = preg_replace('/\#DBPREFIX/',$dbPrefix, $content);
	
		
		try{
$db->query($content);

}catch(Exception $e){
return array("success"=>false, "error"=>$e->getMessage());
	
}
$db->commit();


	$sqlFile = realpath(dirname(__FILE__)."/../sql/procedures.sql");
		if(!$fp=@fopen($sqlFile,"r")) return array("success"=>false, "error"=>"Fichier introuvable");
		
		$content="";
		
		$sql_query=fread($fp, @filesize($sqlFile));
		
		$sql_query = remove_remarks($sql_query);
		$sql_query = split_sql_file($sql_query, ';;');

		
		

		


foreach($sql_query as $sql){
$db->beginTransaction();
$sql=preg_replace('/\#DBPREFIX/',$dbPrefix, $sql);
$sql=preg_replace('/DELIMITER/','', $sql);

try{
$db->query($sql);

}catch(Exception $e){
return array("success"=>false, "error"=>$e->getMessage());
	
}
$db->commit();
}


if(!defined('DBPREFIX'))define('DBPREFIX', $dbPrefix);



$tplClass = new Admin_Model_TemplateMapper();

// tpl page

	$fieldArray=array();
	
	$fieldTitre=new stdClass();
	$fieldTitre->id_field=null;
	$fieldTitre->field_type="Text";
	$fieldTitre->compulsary=1;
	$fieldTitre->templateRef="page";
	$fieldTitre->label="Titre";
	$fieldTitre->ordre=1;
	$fieldTitre->field_name="title";
	$fieldTitre->extra_params="null";
	
	array_push($fieldArray, $fieldTitre);
	
	$fieldRichText=new stdClass();
	$fieldRichText->id_field=null;
	$fieldRichText->field_type="RichText";
	$fieldRichText->compulsary=1;
	$fieldRichText->templateRef="page";
	$fieldRichText->label="Contenu";
	$fieldRichText->ordre=2;
	$fieldRichText->field_name="content";
	$fieldRichText->extra_params="null";
	
	array_push($fieldArray, $fieldRichText);
	
	$field=new stdClass();
	$field->id_field=null;	
	$field->field_type="ItemsMenu";
	$field->compulsary=0;
	$field->templateRef="page";
	$field->label="Articles Connexes";
	$field->ordre=3;
	$field->field_name="connexe";
	$field->extra_params=json_decode("{\"fields\":[{\"name\":\"title\",\"field_type\":\"text\",\"showCol\":\"1\",\"label\":\"Intitul&eacute;\",\"compulsary\":\"1\"},{\"name\":\"article\",\"field_type\":\"contentbrowser\",\"showCol\":\"1\",\"label\":\"Article\",\"compulsary\":\"1\"}]}");
	
	array_push($fieldArray, $field);
	
	$tplClass->addOrModifyTemplateRef("page","page", "Page simple", 0,json_encode($fieldArray),1, "");

	
	// rub
	$fieldArray=array();
	$fieldTitre->templateRef="rubrique";
	array_push($fieldArray, $fieldTitre);
	$tplClass->addOrModifyTemplateRef("rubrique","folder", "Rubrique", 0,json_encode($fieldArray),0, "");
	
	// formulaire de contact
	
	$fieldArray=array();
	$fieldTitre->templateRef="contact";
	$fieldRichText->templateRef="contact";
	$field->templateRef="contact";
	$field->label="Formulaires";
	$field->field_name="form";
	$field->extra_params=json_decode('{\"fields\":[{\"field_type\":\"text\",\"compulsary\":\"1\",\"label\":\"Intitul&eacute\",\"name\":\"label\",\"showCol\":\"1\"},{\"field_type\":\"combo\",\"compulsary\":\"true\",\"label\":\"type\",\"name\":\"type\",\"extraParams\":[{\"value\":\"1\",\"label\":\"Champ texte\"},{\"value\":\"2\",\"label\":\"Email\"},{\"value\":\"3\",\"label\":\"Zone de texte\"},{\"value\":\"4\",\"label\":\"Liste de s&eacute;lection\"},{\"value\":\"6\",\"label\":\"Liste des pays\"},{\"value\":\"5\",\"label\":\"Case &agrave; cocher\"}]},{\"field_type\":\"textarea\",\"label\":\"Param&egrave;tres\",\"compulsary\":\"0\",\"name\":\"params\"},{\"field_type\":\"checkbox\",\"label\":\"Obligatoire\",\"compulsary\":\"0\",\"name\":\"obligatoire\"}]}');
	
	array_push($fieldArray, $fieldTitre);
	array_push($fieldArray, $fieldRichText);
	array_push($fieldArray, $field);
	
	$tplClass->addOrModifyTemplateRef("contact","page", "Formulaire de contact", 0,json_encode($fieldArray),1, "");
	
	return $this->checkconfigAction();
	
	}
	
	public function getTableList(){
	
		
		$db= Zend_Registry::get("db");
		
		$query = $db->query("show tables like '".DBPREFIX."%'");
		
		$liste = $query->fetchAll();

		if(count($liste)==0) $result= -1;
		else $result = count($liste);
		
		return $result;
		
	}

	
	public function recordArbo($arbo){
		
		$obj=json_decode($arbo);
			
		
		
		$arboClass = new Admin_Model_ArboMapper();
		$tplClass = new Admin_Model_TemplateMapper();
		
		$rootParentId=-1;
		
		foreach($obj as $menu):
		
		$data=array("title"=>$menu->text, "parent_id"=>$rootParentId, "status"=>1,"id_template"=>-1);
		
		$id = $arboClass->addData($data);
		
				
		// nom du template original
		
		$nom = Admin_Model_ContentMapper::enleveAccents(preg_replace('/ /','', $menu->child->text)); 
		
		$id_template = $tplClass->addData(array("template_name"=>$menu->child->text,"parent_id"=>0, "templateRef"=>$nom));
		
		$data=array("title"=>$menu->child->text, "parent_id"=>$id, "status"=>1,"id_template"=>$id_template, "rub_order"=>1);
		
		$title= new stdClass();
		$title->id_field=null;
		$title->field_type="Text";
		$title->compulsary=1;
		$title->templateRef=$nom;
		$title->label="Titre";
		$title->ordre=0;
		$title->field_name="title";
		$title->extra_params="null";
		
		$fields=array($title);
		
		//$field->id_field, $field->field_type, $field->compulsary, $field->templateRef, $field->label, $field->ordre, $field->field_name, json_encode($field->extra_params)
		
		$tplClass->addOrModifyTemplateRef($nom,"folder", $menu->child->text , 0,json_encode($fields), 0, "");
		
		
		$id_rub=$tplClass->addData(array("template_name"=>"Rubrique","parent_id"=>$id_template, "templateRef"=>"rubrique"));
		$id_rubPage=$tplClass->addData(array("template_name"=>"Page","parent_id"=>$id_rub, "templateRef"=>"page"));
		$id_rubContact=$tplClass->addData(array("template_name"=>"Contact","parent_id"=>$id_rub, "templateRef"=>"contact"));
		
		$id_ssRub=$tplClass->addData(array("template_name"=>"Sous-rubrique","parent_id"=>$id_rub, "templateRef"=>"rubrique"));
		$id_rubPage=$tplClass->addData(array("template_name"=>"Page","parent_id"=>$id_ssRub, "templateRef"=>"page"));
		
		$id=$arboClass->addData($data);
		
		
		$rootParentId--;
		
		endforeach;
		
		return array("success"=>true);
	
	}
	
	public static function getTableListStatic(){
	
	return self::getTableList();
	
	
	
	}
	
	public function setFinished(){
	
		
		$config= new Zend_Config_Ini(APPLICATION_PATH.'/configs/application.ini', null, array('skipExtends'=> true,'allowModifications' => true));
    
$location=APPLICATION_PATH.'/configs/application2.ini';
		 $writer = new Zend_Config_Writer_Ini(
    array(
        'config'   => $config,
    'filename' => $location));
	
    	$config->production->install=true;
	
	
    	 $this->writeConfigFile($writer);
    	 return array("success"=>true);
    	
	
	}
	

	
	

}


function remove_comments(&$output)
{
   $lines = explode("\n", $output);
   $output = "";

   // try to keep mem. use down
   $linecount = count($lines);

   $in_comment = false;
   for($i = 0; $i < $linecount; $i++)
   {
      if( preg_match("/^\/\*/", preg_quote($lines[$i])) )
      {
         $in_comment = true;
      }

      if( !$in_comment )
      {
         $output .= $lines[$i] . "\n";
      }

      if( preg_match("/\*\/$/", preg_quote($lines[$i])) )
      {
         $in_comment = false;
      }
   }

   unset($lines);
   return $output;
}

//
// remove_remarks will strip the sql comment lines out of an uploaded sql file
//
function remove_remarks($sql)
{
   $lines = explode("\n", $sql);

   // try to keep mem. use down
   $sql = "";

   $linecount = count($lines);
   $output = "";

   for ($i = 0; $i < $linecount; $i++)
   {
      if (($i != ($linecount - 1)) || (strlen($lines[$i]) > 0))
      {
         if (isset($lines[$i][0]) && $lines[$i][0] != "#")
         {
            $output .= $lines[$i] . "\n";
         }
         else
         {
            $output .= "\n";
         }
         // Trading a bit of speed for lower mem. use here.
         $lines[$i] = "";
      }
   }

   return $output;

}

//
// split_sql_file will split an uploaded sql file into single sql statements.
// Note: expects trim() to have already been run on $sql.
//
function split_sql_file($sql, $delimiter)
{
   // Split up our string into "possible" SQL statements.
   $tokens = explode($delimiter, $sql);

   // try to save mem.
   $sql = "";
   $output = array();

   // we don't actually care about the matches preg gives us.
   $matches = array();

   // this is faster than calling count($oktens) every time thru the loop.
   $token_count = count($tokens);
   for ($i = 0; $i < $token_count; $i++)
   {
      // Don't wanna add an empty string as the last thing in the array.
      if (($i != ($token_count - 1)) || (strlen($tokens[$i] > 0)))
      {
         // This is the total number of single quotes in the token.
         $total_quotes = preg_match_all("/'/", $tokens[$i], $matches);
         // Counts single quotes that are preceded by an odd number of backslashes,
         // which means they're escaped quotes.
         $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$i], $matches);

         $unescaped_quotes = $total_quotes - $escaped_quotes;

         // If the number of unescaped quotes is even, then the delimiter did NOT occur inside a string literal.
         if (($unescaped_quotes % 2) == 0)
         {
            // It's a complete sql statement.
            $output[] = $tokens[$i];
            // save memory.
            $tokens[$i] = "";
         }
         else
         {
            // incomplete sql statement. keep adding tokens until we have a complete one.
            // $temp will hold what we have so far.
            $temp = $tokens[$i] . $delimiter;
            // save memory..
            $tokens[$i] = "";

            // Do we have a complete statement yet?
            $complete_stmt = false;

            for ($j = $i + 1; (!$complete_stmt && ($j < $token_count)); $j++)
            {
               // This is the total number of single quotes in the token.
               $total_quotes = preg_match_all("/'/", $tokens[$j], $matches);
               // Counts single quotes that are preceded by an odd number of backslashes,
               // which means they're escaped quotes.
               $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$j], $matches);

               $unescaped_quotes = $total_quotes - $escaped_quotes;

               if (($unescaped_quotes % 2) == 1)
               {
                  // odd number of unescaped quotes. In combination with the previous incomplete
                  // statement(s), we now have a complete statement. (2 odds always make an even)
                  $output[] = $temp . $tokens[$j];

                  // save memory.
                  $tokens[$j] = "";
                  $temp = "";

                  // exit the loop.
                  $complete_stmt = true;
                  // make sure the outer loop continues at the right point.
                  $i = $j;
               }
               else
               {
                  // even number of unescaped quotes. We still don't have a complete statement.
                  // (1 odd and 1 even always make an odd)
                  $temp .= $tokens[$j] . $delimiter;
                  // save memory.
                  $tokens[$j] = "";
               }

            } // for..
         } // else
      }
   }

   return $output;
}
