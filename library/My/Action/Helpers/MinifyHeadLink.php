<?php

include_once(APPLICATION_PATH.'/../library/My/Classes/cssMin.php');

class My_Action_Helpers_MinifyHeadLink extends Zend_View_Helper_HeadLink {
	/**
	 * 
	 * The folder to be appended to the base url to find minify on your server.
	 * The default assumes you installed minify in your documentroot\min directory
	 * if you modified the directory name at all, you need to let the helper know 
	 * here.
	 * @var string
	 */
	protected $_publicPath;
	protected $_minPath;
	
	protected $_minifyLocation = '/css.min/';
	
	/**
	 * Registry key for placeholder
	 * @var string
	 */
	protected $_regKey = 'RC_View_Helper_MinifyHeadLink';
	
	/**
	 * 
	 * Known Valid CSS Extension Types
	 * @var array
	 */
	protected $_cssExtensions = array(".css", ".css1", ".css2", ".css3");
	
	protected $_cdnPath="";
	
	/**
	* Constructor
	* initialize variables
	 */
	public function __construct($cdnPath=""){
	$this->_publicPath=APPLICATION_PATH.'/../public/';
	$this->_minPath = $this->_publicPath.$this->_minifyLocation;
	$this->_cdnPath=$cdnPath;
	parent::__construct();
	}
	
	
	
	/**
	 * Returns current object instance. Optionally, allows passing array of
	 * values to build link.
	 *
	 * 
	 * @param array $attributes
	 * @param string $placement
	 * @return Zend_View_Helper_HeadLink
	 */
	public function minifyHeadLink(array $attributes = null, $placement = Zend_View_Helper_Placeholder_Container_Abstract::APPEND) {
		return parent::headLink($attributes, $placement);
	}
	
	
/**
	 * 
	 * Gets a string representation of the headLinks suitable for inserting
	 * in the html head section. 
	 * 
	 * It is important to note that the minified files will be minified
	 * in reverse order of being added to this object, and ALL files will be rendered
	 * prior to inline being rendered.
	 *
	 * @see Zend_View_Helper_HeadScript->toString()
	 * @param  string|int $indent
	 * @return string
	 */
	
	
	
	public function toString($indent = null) {
		
	
		
		$indent = (null !== $indent) ? $this->getWhitespace($indent) : $this->getIndent();
		$trimmedBaseUrl = trim($this->getBaseUrl(), '/');
		
		$items = array();
		$stylesheets = array();
		$this->getContainer()->ksort();
		foreach ( $this as $item ) :
		
			if ($item->type == 'text/css' && strpos($item->href, 'http://') === false && $this->isValidStyleSheetExtension($item->href)&&!isset($item->extras['minify_disabled'])) {
			$css =$this->minifyCss($item);
			if($css!=false)$items[]=$css;
		}
		
		else {

			unset($item->extras['minify_disabled']);
			$items [] = $this->itemToString($item);
			
		}
		endforeach;

		return $indent . implode($this->_escape($this->getSeparator()) . $indent, $items);
	
	}
	
	/**
	 * 
	 * Loops through the defined valid static css extensions we use.
	 * @param string $string
	 */
	public function isValidStyleSheetExtension($string) {
		foreach ( $this->_cssExtensions as $ext ) {
			if (substr_compare($string, $ext, -strlen($ext), strlen($ext)) === 0) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Retrieve the currently set base URL
	 *
	 * @return string
	 */
	public function getBaseUrl() {
		return Zend_Controller_Front::getInstance()->getBaseUrl();
	}
	
/**
	 * Retrieve the minify url
	 *
	 * @return string
	 */
	public function getMinUrl() {
		return $this->getBaseUrl() . $this->_minifyLocation;
	}
	
	/**
	 * Check if minify file exists and is up to date and MiniFy the Css
	 *  
	 *  @return string
	 * 
	*/
	
	private function minifyCss($item){
	
	$css = clone $item;
		
		$path = $this->_publicPath.$item->href;	
    	
    	if(file_exists(($path))):
    	
    	$info=(object)pathinfo($path);
    	$name = $info->filename;

    	$ext = $info->extension;
    	
    	
    	$fileTime = filemtime($path);
    	
    	$filePath = preg_replace("#{$name}.{$ext}#",'',$css->href);

    	$recordPath=realpath($this->_publicPath.$filePath).DIRECTORY_SEPARATOR;
    
    	if(!file_exists($recordPath.$name.".min.css")||filemtime($recordPath.$name.".min.css")<$fileTime):
    		$js = file_get_contents($path);
    	
    	$buffer = file_get_contents($path);
    	
    	$buffer = str_replace(': ', ':', $buffer);

// Remove whitespace

$filters = array
        (
       // "ImportImports"                 => array("BasePath" => "path/to/base"),
        "RemoveComments"                => true, 
        "RemoveEmptyRulesets"           => true,
        "RemoveEmptyAtBlocks"           => true,
        "ConvertLevel3AtKeyframes"      => array("RemoveSource" => false),
        "ConvertLevel3Properties"       => true,
        "Variables"                     => true,
        "RemoveLastDelarationSemiColon" => true
        );

// Write everything out
$cssStr = CssMin::minify($buffer, $filters);
    	

	file_put_contents($recordPath.$name.".min.css", $cssStr);

endif;

	$css->href = $this->_cdnPath.$filePath.$name.".min.css";

	return $this->itemToString($css);

endif;
	
	
	}
	
}