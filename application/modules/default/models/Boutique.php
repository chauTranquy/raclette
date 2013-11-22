<?php

class Default_Model_Arbo
{

protected $id_rubrique;
protected $title;
protected $parent_id;
protected $creation_date;
protected $update_date;
protected $id_template;
protected $status;


	public function __construct(array $options=null){
	
		if(null!=$options):
			
			foreach($options as $key=>$value){
			
			$this->__set($key, $value);
			
			}
		
		endif;
	
		
	
	}
	
public function dataToArray(){
	
	return array(
				"id_rubrique"=>$this->id_rubrique,
				"title"=>$this->title,
				"creation_date"=>$this->creation_date,
				"parent_id"=>$this->parent_id,
				"update_date"=>$this->update_date,
				"id_template"=>$this->id_template,
				"status"=>$this->status
	);
	
	
	
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

