<?php

class Admin_Model_Contact
{

protected $id_contact;
protected $id_rubrique;
protected $fields;
protected $date_created;


	public function dataToArray(){
	
	return array("id_contact"=>$this->id_contact,
				"id_rubrique"=>$this->id_rubrique,
				"fields"=>$this->fields,
				"date_created"=>$this->date_created
	);
	
	
	
	}


	
	public function __construct(array $options=null){

		
		if(null!=$options):
			
			foreach($options as $key=>$value){
			
			$this->__set($key, $value);
			
			}
		
		endif;
	
		
	
	}
	
	
	
	
	public function __set($name, $value)
    {
     
        if ('mapper' == $name)           throw new Exception('Invalid property');
        
        $this->{$name}=$value;
    }
 
    public function __get($name)
    {
        
        return $this->{$name};
    }
	

	
}

