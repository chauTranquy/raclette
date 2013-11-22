<?php

class Cmsmodules_Model_DbTable_ClientsPro extends Cmsmodules_Model_DbTable_Table
{

    protected $_name ;
    protected $_primary = 'id_client';

    public function __construct(){
    	
    	$this->_name=DBPREFIX.'clients';
    	parent::__construct();
    	
    }
    

}

