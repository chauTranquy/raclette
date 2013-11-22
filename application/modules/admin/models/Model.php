<?php
class Admin_Model_Model{

protected $_tableName;
protected $_colsArray;
private $infoCols;

public function __construct(array $options=null){


	$mapper = new Admin_Model_Mapper();
	$mapper->_tableName = $this->_tableName;
		
	$info = $mapper->getDbTable()->info();
	
	$this->_colsArray=new stdClass();
	
	$this->infoCols=$info['cols'];
	
	foreach($info['cols'] as $col):
	
	
	$this->_colsArray->{$col} = $cols;
	
	endforeach;
	
	
	if(null!=$options):
			
			foreach($options as $key=>$value){
			
			$this->__set($key, $value);
			
			}
		
		endif;
	
	
		
	}

public function __set($name, $value)
    {
     
        if ('mapper' == $name||!in_array($name,$this->infoCols))           die("error avec $name");//throw new Exception('Invalid property');
        
        $this->_colsArray->{$name}=$value;
    }
 
    public function __get($name)
    {
        
    	if(!in_array($name,$this->infoCols))return false;
        return $this->_colsArray->{$name};
    }

    public function dataToArray(){
    
    return (array) $this->_colsArray;
    
    }
    
 public function getData(){
    
    return $this->_colsArray;
    
    }


}