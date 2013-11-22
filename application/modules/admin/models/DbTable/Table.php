<?php
class Admin_Model_DbTable_Table extends Zend_Db_Table_Abstract{

 	protected $_name;
    protected $_primary;
    protected $use_prefix=true;

    public function __construct(){
    
    $this->_name=($this->use_prefix?DBPREFIX:'').$this->_name;
     parent::__construct();
    
    }
    
public function __get($name)
    {
        if($this->{$name})return is_array($this->{$name})?$this->{$name}[1]:$this->{$name};
    }
	

}