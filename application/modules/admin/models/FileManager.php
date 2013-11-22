<?php

class Admin_Model_FileManager{


	private $_site;
	private $_mediaPath;

	private $_arrayAllowedExt = array("jpg","jpeg","png","pdf","ppt","swf","flv","gif","xsl","xslt","doc","xls","ppt","pps","docx","xlsx","pptx","zip","txt","odt","ods","odp","odg","fodt","fods","fodp","fodg","rar","css","js","html","php");

	public function __construct(){

		$this->_site=Zend_Registry::get("site");
		$this->_config=Zend_Registry::get("config");
		
		$this->_forbiddenFolders=$this->_config->forbiddenFolders!==null?$this->_config->forbiddenFolders->toArray():array();
	
                // var_dump($this->_site);
		
		$this->_mediaPath = realpath($this->_site->path.DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR.$this->_site->media_dir).DIRECTORY_SEPARATOR;
                
          
	}


	public function getFolderList($root=null,$level=0, $baseFolder = null,$id_site=0, $recursive=false, $targetFolder=null, $detail=false, $filter=null){

		
		$arrayFolder=array();
		$arrayTarget=array();
		if($targetFolder!==null)$arrayTarget=explode('/', $targetFolder);
		
		
		$dir=$this->_mediaPath.(null==$root?"":$root);
                
                
		if($baseFolder!==null&&$baseFolder!=""){
		
			$dir = $this->_site->path.DIRECTORY_SEPARATOR.$baseFolder.(null==$root?"":$root);
		
		}
				
		$fdir=opendir($dir);

		while($file=readdir($fdir)):
			
		if($file!=".."&&$file!="."&&!in_array($file, $this->_forbiddenFolders)):

		if(is_file($dir.DIRECTORY_SEPARATOR.$file)&&$detail==true):
		
		$goOn=true;
		
		if($filter!==null&&is_array($filter)):
		
		$extArray=explode('.',$file);
		$ext=array_pop($extArray);
		$goOn=in_array($ext, $filter);
	
		endif;
		
		endif;
		
		if(is_dir($dir.DIRECTORY_SEPARATOR.$file)||is_file($dir.DIRECTORY_SEPARATOR.$file)&&$detail==true&&$goOn==true):
		$path='/'.$file;
		$continue=false;
		$isDir=is_dir($dir.DIRECTORY_SEPARATOR.$file);
		if($targetFolder!==null&&$arrayTarget[$level+1]==$file||$recursive) $continue=true;
		
		$arrayresult=array("path"=>$detail?$baseFolder.$root.$path:$root.$path,"iconCls"=>is_dir($dir.DIRECTORY_SEPARATOR.$file)?"folder":"file","name"=>$file);
		if(!$recursive&&!$continue){
		
		$children=$isDir?$this->checkDirectoryChildren($dir.$path):array();//, $level+1, $baseFolder, $id_site);
		
		$arrayresult['children']=$children;
		}else{

			$children=$isDir?$this->getFolderList($root.$path,$level+1, $baseFolder, $id_site, $recursive, $targetFolder, $detail, $filter):array();
			//print_r($children);
			
			if($continue)$arrayresult["children"]=$children;
			//else $arrayresult["children"]=array(array());
			//if($continue)$arrayresult["expanded"]=true;
			
		}
		if(!$children||count($children)==0) $arrayresult["leaf"]=true;
		else $arrayresult['leaf']=false;
		array_push($arrayFolder,$arrayresult);
		
		endif;
		
		
		
		
		
		
		
		endif;
		endwhile;// end while
			
		
		if(!empty($root)){
			$info = pathinfo($dir, PATHINFO_BASENAME);

		/*
		*/

		}
		
		if($level==0) return (empty($root)||$root==null?array(array("path"=>"$root", "name"=>(empty($root)?"Racine":$info), "children"=>$arrayFolder)):$arrayFolder);
		
		
		return $arrayFolder;
	}

public function checkDirectoryChildren($path){

	
	$result = false;
	if($dh = opendir($path)) {
		while(!$result && ($file = readdir($dh)) !== false) {

			
			$result = $file !== "." && $file !== ".."&&is_dir($path.DIRECTORY_SEPARATOR.$file);
		}
	
		closedir($dh);
	}

	//if($result)$result=array('{}');
	
	return $result;
	
	
}

	public function getFolderDetail($folder="", $filter="all", $displayFile=true, $baseFolder=null, $displayAllFile=false){

		$displayFile=filter_var($displayFile, FILTER_VALIDATE_BOOLEAN);
		
		$dir=$this->_mediaPath.(empty($folder)?"":$folder);
	
		if($baseFolder!==null&&$baseFolder!=""):
		
			$dir = $this->_site->path.DIRECTORY_SEPARATOR.$baseFolder.(empty($folder)?"":$folder);
		
		endif;
		
		
		
		$fp=opendir($dir);
			
		$arrayFolder=array();
		if(!empty($folder))array_push($arrayFolder,array("path"=>$dir, "type"=>"folderBack", "name"=>"...", "ext"=>"folder","size"=>null, "utilisation"=>$utilisation, "baseFolder"=>$baseFolder, "sitePath"=>$this->_site->site_url));
		
		while($file=readdir($fp)):
		if($file!=".."&&$file!="."&&!in_array($file, $this->_forbiddenFolders)):
		$path=($folder=="/"?"":$folder)."/".$file;
		$date=date (" d/m/Y H:i:s", filemtime($dir."/".$file));
		if(is_dir($dir."/".$file)):
		array_push($arrayFolder,array("path"=>$path, "type"=>"folder", "name"=>$file, "ext"=>"folder","date"=>$date));
		elseif(is_file($dir."/".$file)&&$displayFile):
		$info=pathinfo($dir."/".$file);
		$ext=$info["extension"];
		$filtre=$filter;
		$filtreArray=explode(";",$filtre);
		$filtreExt="";
		foreach($filtreArray as $val){
			if($val=="image")$filtreExt.="jpg;jpeg;png;gif;";
			if($val=="flash") $filtreExt.="flv;swf;";
			else $filtreExt.=$val.";";
		}
		//$date=date (" d/m/Y H:i:s", filemtime($dir."/".$file));
		$filesize=$this->ByteSize(filesize($dir."/".$file));
		$size=@getimagesize($dir."/".$file);
		$filterArray=explode(";",$filtreExt);
		//$path = $folder.$file;

		$pathtest=addslashes(preg_replace('#/#','\/',$path));
		$utilisation = Admin_Model_ContentMapper::mediaUtilisationCount($pathtest);
			
		
		if(in_array(strtolower($ext),$this->_arrayAllowedExt)&&($filter=="all"||in_array(strtolower($ext),$filterArray))||$displayAllFile&&in_array(strtolower($ext),$filterArray))array_push($arrayFolder,array("path"=>$path, "type"=>"file", "name"=>$file, "ext"=>$ext,"width"=>$size[0], "height"=>$size[1], "date"=>$date, "size"=>$filesize, "utilisation"=>$utilisation, "baseFolder"=>$baseFolder, "sitePath"=>$this->_site->site_url));

		endif;
		endif;

			
		endwhile;
		return array("result"=>$arrayFolder);
	}


	public function deleteFile($path, $baseFolder=null){

		
		$pathArray = explode("|",$path);
		
		foreach($pathArray as $path):
		
		$filePath=$this->_mediaPath.$path;
		if($baseFolder!==null&&$baseFolder!=""){
		
			$filePath = APPLICATION_PATH.'/../public/'.$baseFolder.$path;
		
		}

		if(!is_file($filePath))return array("success"=>false, "error"=>"le fichier n'existe pas");

		$path=addslashes(preg_replace('#/#','\/',$path));

		if(!Admin_Model_ContentMapper::isMediaUsed($path)):
		$info=pathinfo($filePath);
		
		
		return array("success"=>false,"error"=>"Le fichier '".$info["filename"].".".$info["extension"]."' est actuellement utilis&eacute;.");
		
		endif;

		//chmod($filePath,0777);
		if(!@unlink($filePath))return array("success"=>false, "error"=>"Erreur lors de la suppression du fichier");

		endforeach;
		
		return array("success"=>true);



	}


	public function makeFolder($folderName,$parentFolder="", $baseFolder=null){

		// verification de la syntaxe du folder


		if(!preg_match('/^([a-zA-Z]{1}[a-zA-Z0-9_-]+)$/', $folderName)) return array("success"=>false,"error"=>"Le nom du r&eacute;pertoire doit uniquement comporter des caract&egrave;res alphanum&eacute;riques, des '-' ou des '_' et aucun espace!");
		$folderPath=(empty($parentFolder)?"":$parentFolder)."/".$folderName;
			
		$path=$this->_mediaPath.$folderPath;
		$dirPath=$folderPath;
			if($baseFolder!==null&&$baseFolder!=""){
				$dirPath=$baseFolder.$folderPath;
				
				$path = $this->_site->path.DIRECTORY_SEPARATOR.$dirPath;
				
			}
		if(file_exists($path))return array("success"=>false,"error"=>"Ce r&eacute;pertoire existe d&eacute;j&agrave;");
		
		if(!mkdir($path)) return array("success"=>false, "result"=>"Erreur lors de la cr&eacute;ation du dossier","err"=>error_get_last());
		chmod($path,0777);
			
		return array("success"=>true, "result"=>array('name'=>$folderName,'path'=>$dirPath));
	}

	public function deleteFolder($folderPath, $baseFolder=null){

		$path=$this->_mediaPath."/".$folderPath;
			
		if($baseFolder!==null&&$baseFolder!=""){
			$path = APPLICATION_PATH.'/../public/'.$baseFolder.$folderPath;
		
		}
			
		if(!file_exists($path))return array("success"=>false,"error"=>"Ce r&eacute;pertoire n'existe pas");
		if(!$this->is_empty_dir($path)) return array("success"=>false,"error"=>"Ce r&eacute;pertoire n'est pas vide");
			
		chmod($path, 0777);
		try {

			rmdir($path);
			return array("success"=>true);

		} catch (Exception $e) {



			return array("success"=>false);
		};
	}
		
		
	public function uploadFile($parentRoot="", $overwrite=0, $baseFolder=null){

		$images_dir = $this->_mediaPath."/".$parentRoot."/";

		if($baseFolder!==null&&$baseFolder!=""){
		
			$images_dir =$this->_site->path."/".$baseFolder.(null==$parentRoot?"":$parentRoot.'/');
		
		}
			
		$max_size = 1073741824; // 100K

		
	//	$images_dir="/var/www/vhosts/lesfantastiques.fr/httpdocs/public/medias/produits/pains/";
		
		
		
		
		//chmod($this->_mediaPath,'0777');
	 //chmod($images_dir,0777);
	 if (!is_dir($images_dir)) {
	 	return array("success"=>"false", "error"=>"$images_dir does not exist");
	 }
	 // verify images directory is writable
	 if (!is_writeable("$images_dir")) {
	 	return  array("success"=>"false", "error"=>"Unable to write to $images_dir");
	 }
	 // verify file uploaded
	 if (count($_FILES) == 0) {
	 	return array("success"=>"false", "error"=>"No files were uploaded");
	 }
	 // get uploaded file record
	 $file = $_FILES["fichier"];
	 // get temporary filename used to store uploaded file
	 $file_tmp = $file["tmp_name"];
	 // verify valid upload file or result of hacking


	if(!is_uploaded_file($file_tmp)) {
	 	return   array("success"=>"false", "error"=>"Invalid upload file $images_dir","errorMsg"=>error_get_last());
	 };
	 
	 

	 // get original filename
	 $file_name = $file['name'];
	 // verify file does not already exist
	 if (file_exists($images_dir.$file_name)&&$overwrite==0) {
	 	return array("success"=>"false", "error"=>"$file_name existe d&eacute;j&agrave;", "fileExists"=>true);
	 }
	 // verify file extension is valid
	 $file_ext = pathinfo($file_name,PATHINFO_EXTENSION);
	 if (!in_array(strtolower($file_ext), $this->_arrayAllowedExt)) {
	 	return array("success"=>"false", "error"=>"format de fichier incorrect");
	 }
	 // get size of uploaded file
	 $file_size = $file['size'];
	 if ($file_size > $max_size) {
	 	return array("success"=>"false", "error"=>"Image is too large");
	 }


	 if (!move_uploaded_file($file_tmp, $images_dir.$file_name)) {
	 	// report reason why file did not move
	 	switch ($filearray["error"]) {
	 		case UPLOAD_ERR_INI_SIZE:
	 			$error = "The uploaded file exceeded the upload_max_filesize directive (".ini_get("upload_max_filesize").") in php.ini.";
	 			break;
	 		case UPLOAD_ERR_FORM_SIZE:
	 			$error = "The uploaded file exceeded the MAX_FILE_SIZE directive specified in the HTML form";
	 			break;
	 		case UPLOAD_ERR_PARTIAL:
	 			$error = "The uploaded file was only partially uploaded";
	 			break;
	 		case UPLOAD_ERR_NO_FILE:
	 			$error = "No file was uploaded";
	 			break;
	 		case UPLOAD_ERR_NO_TMP_DIR:
	 			$error = "Missing a temporary folder";
	 			break;
	 		case UPLOAD_ERR_CANT_WRITE:
	 			$error = "Failed to write file to disk";
	 			break;
	 		default:
	 			$error = $filearray["error"] - "Unknown File Error";
	 	}
	 	return     array("success"=>"false", "error"=>"Error occurred: $error");
	 }
	 // report success
	 // chmod($images_dir.$file_name, 0644);
	 // chmod($images_dir,0644);
	  
	 $data = Admin_Model_FileManager::getFileData("/".$parentRoot."/".$file_name);
	 $data->path = (empty($parentRoot)?"":"/".$parentRoot)."/".$file_name;
	 $data->file = (empty($parentRoot)?"":"/".$parentRoot)."/".$file_name;
	 $info=pathinfo("/".$parentRoot."/".$file_name);
	 $data->name = $file_name;
	 $data->size=$filesize=$this->ByteSize(filesize($images_dir."/".$file_name));
		$data->baseFolder=$baseFolder;
	 $data->sitePath=$this->_site->site_url;
	 $data->ext=$info["extension"];
	 $data->date=date (" d/m/Y H:i:s", filemtime($images_dir."/".$file_name));
	 $data->type="file";
	 unset($data->mime);
	 return array("success"=>"true", "data"=>$data);

	 return;

	}


	private function is_empty_dir($dir)
	{
		if (($files = @scandir($dir)) && count($files) <= 2) {
			return true;
		}
		return false;
	}

	private function isImage($path){


		if(!@getimagesize($path)) return false;
		return true;


	}

	private function ByteSize($bytes)
	{
		$size = $bytes / 1024;
		if($size < 1024)
		{
			$size = number_format($size, 2);
			$size .= ' Ko';
		}
		else
		{
			if($size / 1024 < 1024)
			{
				$size = number_format($size / 1024, 2);
				$size .= ' Mo';
			}
			else if ($size / 1024 / 1024 < 1024)
			{
				$size = number_format($size / 1024 / 1024, 2);
				$size .= ' Go';
			}
		}
		return $size;
	}


	public static function getFileData($path){

		$mediaReg = preg_replace('/\//','\/',IMG_FOLDER);

		$site = Zend_Registry::get('site');
		 

		if(!preg_match('/'.$mediaReg.'/', $path)) $path=$site->path.$site->media_dir.$path;
		 
		$path=($path);

		
		
		
		$finfo = finfo_open(FILEINFO_MIME);
		 
		if(!$finfo):
		 
		
		
		return false;

		endif;
		 


		$mimeType = finfo_file($finfo,$path);
		$size=self::ByteSize(filesize($path));
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		$arrayData = array("mime"=>$mimeType, "size"=>$size,"ext"=>$ext,"filename"=>basename($path));
		 
		 
		if(self::isImage($path)):
		 
		$data = getimagesize($path);
		 
		$arrayData["width"]=$data[0];
		$arrayData["height"]=$data[1];
		 
		endif;
		 
		 
		return (object) $arrayData;

	}
	
	
	public function getFileEditorFolderList($id_site, $type=1){
	
		$arrayFolders=array();//"path"=>'/',"name"=>"backOffice", "type"=>"folder", "iconCls"=>"backoffice","children"=>array());
		
		if($type==1):
		
		
		$folder1=$this->getFolderList(null,0,'../application/modules/default/layouts/',$id_site, true, null, true,array("css","js","php","phtml","xml","txt","ini"));
		$folder1[0]["name"]="layouts";
		$folder1[0]["path"]='/modules/default/layouts/';
		
		
		
		$folder2=$this->getFolderList(null,0,'../application/modules/default/views/',$id_site, true, null, true,array("css","js","php","phtml","xml","txt","ini"));
		$folder2[0]["name"]="views";
		$folder2[0]["path"]='/modules/default/views/';
		$folder3=$this->getFolderList(null,0,'../application/tpl/',$id_site, true, null, true,array("css","js","php","phtml","xml","txt","ini"));
		$folder3[0]["name"]="tpl";
		$folder3[0]["path"]='/modules/default/tpl/';
		
		array_push($arrayFolders,$folder1[0],$folder2[0], $folder3[0]);
		else:
		
		$site = Zend_Registry::get('site');
		
		
		$folder1=$this->getFolderList(null,0,'/_css/',$id_site, true, null, true,array("css","js","php","phtml","xml","txt","ini"));
		$folder1[0]["name"]="_css";
		$folder1[0]["path"]='/_css/';
		
		
		
		$folder2=$this->getFolderList(null,0,'/_js/',$id_site, true, null, true,array("css","js","php","phtml","xml","txt","ini"));
		$folder2[0]["name"]="_js";
		$folder2[0]["path"]='/_js/';
		array_push($arrayFolders,$folder1[0],$folder2[0]);
		
		
		endif;
		
		
		
		return $arrayFolders;
		
		
		
		
	}
	
	public function getFileContent($path){
		$site = Zend_Registry::get('site');

		
		$path=preg_match('#application\/#',$path)?realpath(APPLICATION_PATH.DIRECTORY_SEPARATOR.$path):$site->path.$path;

		if(!file_exists($path))return array("success"=>false,"error"=>"Impossible d'ouvrir le fichier");
		
		$content=file_get_contents($path);
		
		$size=filesize($path);
		$modif=date ("Y/m/d H:i:s", filemtime($path));
		
		
		return array("success"=>true, "result"=>$content, "stats"=>array("size"=>$size,"modif"=>$modif));
		
		
		
	}
	
	
	public function saveFileContent($path, $content){
		
		$site = Zend_Registry::get('site');
		
		
		$path=preg_match('#application\/#',$path)?realpath(APPLICATION_PATH.DIRECTORY_SEPARATOR.$path):$site->path.$path;
		
		//echo $path;
		
		$filename = basename($path);
		$destName=$filename.'.'.time().'.bak';
		include_once('My/Action/Helpers/Utils.php');
		$util = new My_Action_Helpers_Utils();
		
		$siteDir = $util->stripAccents($site->site_name);
	
		$destDir=APPLICATION_PATH.DIRECTORY_SEPARATOR.'fileBak'.DIRECTORY_SEPARATOR.$siteDir;
		if(!file_exists($destDir)){
			//chown(APPLICATION_PATH.DIRECTORY_SEPARATOR.'fileBak'.DIRECTORY_SEPARATOR, 'apache');
			
			// Vérification du résultat
			$stat = stat($path);
			
			
			//chmod(APPLICATION_PATH.DIRECTORY_SEPARATOR.'fileBak'.DIRECTORY_SEPARATOR,0777);
			mkdir($destDir);
			//die('chmod');
			
			
		}
		if(!file_exists($destDir.DIRECTORY_SEPARATOR.$filename))mkdir($destDir.DIRECTORY_SEPARATOR.$filename);
		
		
		copy($path,$destDir.DIRECTORY_SEPARATOR.$filename.DIRECTORY_SEPARATOR.$destName);
		
		file_put_contents($path, $content,LOCK_EX);
		

		
		
		return array("success"=>true,"message"=>"Le fichier a bien &eacute;t&eacute; modifi&eacute;<br />Une copie de la pr&eacute;c&eacute;dente version a&eacute;t&eacute; sauvegard&eacute;e dans le fichier $destName");
		
		
		
		
		
	}

}