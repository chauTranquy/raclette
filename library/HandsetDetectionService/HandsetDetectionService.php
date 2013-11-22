<?php
class HandsetDetectionService   {       private $_instance;       private $_caching = true;       private $_hdapi_path;              public function __construct()       {           $this->_importHdApi();
$this->_instance = new HandsetDetection();
$this->_instance->setTimeout( 10 );
$this->_instance->detectInit();
}
public function isMobile()
{
	if( !$_caching ){ $this->_instance->clearCache(); }
	return $this->_instance->ismobile();
}
public function mobileRedirect( $url = "http://m.google.com" )
{
	$this->_instance->setMobileSite( $url );
	if( $this->isMobile() ) $this->_instance->redirectToMobileSite();
}
public function detect()
{
	if( !$_caching ){ $this->_instance->clearCache(); }
	$this->_instance->detect();
	return $this->_instance->getDetect();
}
public function vendorList()
{
	if( !$_caching ){ $this->_instance->clearCache(); }
	$this->_instance->vendor();
	return $this->_instance->getVendor();
}
public function modelList( $vendor_name )
{
	if( !$_caching ){ $this->_instance->clearCache(); }
	$this->_instance->model( $vendor_name );
	return $this->_instance->getModel();
}
public function getError()
{
	$error = $this->_instance->getError();
	return ( $error == 'Not Found' ? '' : $error );
}
private function _importHdApi()
{
	$this->_hdapi_path = APPLICATION_PATH . DIRECTORY_SEPARATOR . '../library' .
	DIRECTORY_SEPARATOR . 'hdapi' . DIRECTORY_SEPARATOR;
	require_once( $this->_hdapi_path . 'class.wsse.php' );
	if (!function_exists('json_encode')) require_once( $this->_hdapi_path . 'json.php');
	require_once( $this->_hdapi_path . 'hdbase.php' );
}
}