<?php

include_once(APPLICATION_PATH.'/../library/My/Classes/class.JavaScriptPacker.php');

class My_Action_Helpers_MinifyHeadScript extends Zend_View_Helper_HeadScript {

protected $_publicPath;
protected $_minPath, $_minDirectory ="/js.min/";
protected $_regKey = 'RC_View_Helper_MinifyHeadScript';
protected $_cdnPath="";

public function __construct($cdnPath=""){

	$this->_publicPath=APPLICATION_PATH.'/../public/';
	$this->_minPath = $this->_publicPath.$this->_minDirectory;
	$this->_cdnPath=$cdnPath;
	parent::__construct();
}

public function minifyHeadScript($mode = Zend_View_Helper_HeadScript::FILE, $spec = null, $placement = 'APPEND', array $attrs = array(), $type = 'text/javascript') {
	
	
	
	
		return parent::headScript($mode, $spec, $placement, $attrs, $type);
	}
	
public function toString($indent = null) {
				// An array of Script Items to be rendered
		$items = array();
		
		// An array of Javascript Items
		$scripts = array();
		

		
		// Any indentation we should use.
		$indent = (null !== $indent) ? $this->getWhitespace($indent) : $this->getIndent();
			
		// Determining the appropriate way to handle inline scripts
		if ($this->view) {
			$useCdata = $this->view->doctype()->isXhtml() ? true : false;
		} else {
			$useCdata = $this->useCdata ? true : false;
		}
		
		$escapeStart = ($useCdata) ? '//<![CDATA[' : '//<!--';
		$escapeEnd = ($useCdata) ? '//]]>' : '//-->';
		
		$this->getContainer()->ksort();
        $groupIndex = 0;
		foreach ($this as $i => $item) {
            if ($this->_isNeedToMinify($item)) {
                if (!empty($item->attributes['minify_split_before']) || !empty($item->attributes['minify_split'])) {
                    $items[] = $this->_generateMinifyItem($scripts);
                    $scripts = array();
                }                
                $scripts[] = $item->attributes['src'];
                if (!empty($item->attributes['minify_split_after']) || !empty($item->attributes['minify_split'])) {
                    $items[] = $this->_generateMinifyItem($scripts);
                    $scripts = array();
                    
                    
                }
            } else {
                if ($scripts) {
                    $items[] = $this->_generateMinifyItem($scripts);
                    
                   
                    
                    $scripts = array();
                }
                $items[] = $this->itemToString($item, $indent, $escapeStart, $escapeEnd);
            }
		}
        if ($scripts) {
            $items[] = $this->_generateMinifyItem($scripts);
        }       
		
		$items = $this->array_flatten($items);
		
		
		return $indent . implode($this->_escape($this->getSeparator()) . $indent, $items);
	}
	
	protected function array_flatten($a) {
    foreach($a as $k=>$v) $a[$k]=(array)$v;
    return call_user_func_array('array_merge',$a);
  }
	
	protected function _isNeedToMinify($item)
    {
    	
    	
        return isset($item->attributes ['src']) 
                && !empty($item->attributes ['src']) 
                && preg_match('/^https?:\/\//', $item->attributes['src']) == false
                && !isset($item->attributes['minify_disabled']);
    }
    
    protected function _generateMinifyItem(array $scripts){
    	
    	
    	
    	$return = array();
    	
    	
    	foreach($scripts as $script):
    	$path = $this->_publicPath.$script;	
    	
    	if(file_exists(($path))):
    	
    	$name=pathinfo($path,PATHINFO_FILENAME);
    	$fileTime = filemtime($path);
    	 
    	if(!file_exists($this->_minPath.$name.".js")||filemtime($this->_minPath.$name.".js")<$fileTime):
    		$js = file_get_contents($path);
    		
    		
    		$packer = new JavaScriptPacker($js, 'Normal', true, false);
			$packed = $packer->pack();

    		
    		
    		$fp = fopen($this->_minPath.$name.".js", "w+");
    		
    		fputs($fp, $packed);
    		fclose($fp);
    		
    		
    	
    	endif;
    	 $minScript = new stdClass();
    	$minScript->type="text/javascript";
    	$minScript->attributes['src']=$this->_cdnPath.$this->_minDirectory.$name.".js";
    	
    	
    	
    	array_push($return,$this->itemToString($minScript, '', '', ''));
    	
    	endif;
    	 
    	
    	
    	endforeach;
    	
    	
    	return $return;
    	
    //	$minScript->attributes['src']
    
    }

    
    
	
}