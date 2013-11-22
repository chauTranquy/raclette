<?php
class Cmsmodules_Model_DbTable_Table extends Zend_Db_Table_Abstract{

 	protected $_name;
    protected $_primary;

public function __get($name)
    {
        if($this->{$name})return is_array($this->{$name})?$this->{$name}[1]:$this->{$name};
    }
	

}