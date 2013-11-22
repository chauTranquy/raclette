<?php

include_once(("Image/Image.php"));

class ImageController extends Zend_Controller_Action{


	private $_site;
	private $_mediaPath;
	
	private $_type;
	private $_loaded=false;
	
	private $_imgWidth=null;
	private $_imgHeight=null;
	
	
	const IMAGE_PNG="image/png";
	const IMAGE_JPG="image/jpeg";
	
	
	public function init(){
		
		$this->_helper->layout()->disableLayout();
    	$this->_helper->viewRenderer->setNoRender(true);
	
    	if($this->_request->id_site) :
    		
    		
    		
    		
    	$siteMapper = new Admin_Model_SitesMapper();
    	$site = $siteMapper->find($this->_request->id_site);
    		
    	Zend_Registry::set('site', $site);
    		
    	endif;
    	
    	if (Zend_Registry::isRegistered("site"))$this->_site = Zend_Registry::get('site');
		
		$query=$this->_request->getQuery();
				
		$this->_mediaPath = realpath($this->_site->path.DIRECTORY_SEPARATOR.(empty($this->_request->base)?$this->_site->media_dir:$this->_request->base)).DIRECTORY_SEPARATOR;

		$this->setImgDmensions();
		
		
	}
	
	
		
	public function indexAction(){
	
		if(method_exists($this, $this->getRequest()->appMethod)) {
	
		$method=$this->getRequest()->appMethod;

		$this->{$method}();
		
	
	}
	
	
	}
	
	public function previewAction(){
		
		
		$path=$this->_mediaPath.$this->getRequest()->path.".".$this->getRequest()->ext;
		
		//$path = APPLICATION_PATH."/uploads/tmp/".$this->_request->fileName.$this->getRequest()->ext;
		
		
		$this->_mediaPath = APPLICATION_PATH."/uploads/tmp/";
		$this->_request->setParam('path',substr($this->_request->fileName,0,-1));
		$this->_request->setParam('ext',strtolower($this->_request->ext));
		$this->_request->setParam('thumbsize','100-125');

		//$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$this-> setImgDmensions();
		$this->crop();
		
		
	}
	
	
	private function setImgDmensions(){
		
		$dim=explode("-",$this->getRequest()->thumbsize);

		$this->_imgWidth = $dim[0];
		$this->_imgHeight = $dim[1];
		
		
	}
	
	public function crop(){
	
		$path=$this->_mediaPath.$this->getRequest()->path.".".$this->getRequest()->ext;
	
		$this->_load($path);
	
	$finfo = finfo_open(FILEINFO_MIME_TYPE); 
	
	$type=finfo_file($finfo, $path);
	if(!$type) :
	
	$path=$this->_mediaPath.$this->getRequest()->path.".".strtoupper($this->getRequest()->ext);
	$type=finfo_file($finfo, $path);
	endif;
	
	$this->_type=$type;
	
	$this->_image=new Image($path);

	if($this->_image->image_width>$this->_image->image_height&&$this->_image->image_width>$this->_imgWidth) $ratio = $this->_imgHeight/$this->_image->image_height;//$this->_image->width($this->_imgWidth);
	
	elseif($this->_image->image_height>$this->_imgHeight)$ratio = $this->_imgWidth/$this->_image->image_width;
	
	$this->_image->resize($ratio*100);
		
	$cropped=$this->_image->save(false, false, true);
	
	
	$img = imagecreatetruecolor($this->_imgWidth, $this->_imgHeight);
	
	$color=imagecolorallocate($img, 255, 255, 255);
	imagefill($img, 0, 0, $color);
	
	//imagecopyresampled($img,$cropped, 0,0, (imagesx($cropped)-$this->_imgWidth)/2,(imagesy($cropped)-$this->_imgHeight)/2, $this->_imgWidth, $this->_imgHeight, imagesx($cropped), imagesy($cropped));
imagecopy($img,$cropped, 0,0, (imagesx($cropped)-$this->_imgWidth)/2,(imagesy($cropped)-$this->_imgHeight)/2, $this->_imgWidth, $this->_imgHeight);
	

	header("Content-Type: $type");
		
		
	switch($type):

		default:
	imagejpeg($img, null, 100);
	break;
	
	
	
	
	endswitch;
	
	imagedestroy($img);
	
	}
	
	
	public function thumb(){
	
		
		
	$path=$this->_mediaPath.$this->getRequest()->path.".".$this->getRequest()->ext;

	$this->_load($path);

	if(!$this->_loaded):
	$path=$this->_mediaPath.$this->getRequest()->path.".".strtoupper($this->getRequest()->ext);
	
	$this->_load($path);
	
	endif;

	
	
	$finfo = finfo_open(FILEINFO_MIME_TYPE); 
	
	
	$type=finfo_file($finfo, $path);
	if(!$type) :
	
	$path=$this->_mediaPath.$this->getRequest()->path.".".strtoupper($this->getRequest()->ext);
	$type=finfo_file($finfo, $path);
	endif;
	$this->_type=$type;


	$this->_image=new Image($path);
	
	$size=$this->_imgWidth;//$this->getRequest()->thumbsize;
	
	if($this->_image->image_width>$this->_image->image_height&&$this->_image->image_width>$size)$this->_image->width($size);
	
	elseif($this->_image->image_height>$size) $this->_image->height($size);
	$this->_image->save(true);
	
	
	}

	private function _load($path){
		

		if(!file_exists($path)) $this->_loaded=false;//throw new Zend_Exception("erreur");
		$this->_loaded=true;
		
		
	}

	

}




?>