<?php

class Cmsmodules_Model_DbTable_EspacePro extends Cmsmodules_Model_DbTable_Table
{

    protected $_name ;
    protected $_primary = 'id_espacepro';

    public function __construct(){
    	
    	$this->_name=DBPREFIX.'espacepro';
    	parent::__construct();
    	
    }
    

}

