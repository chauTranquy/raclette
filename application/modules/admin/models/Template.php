<?php

class Admin_Model_Template
{

protected $id_template;
protected $template_name;
protected $parent_id;
protected $templateRef;


	public function dataToArray(){
	
	return array("id_template"=>$this->id_template,
				"template_name"=>$this->template_name,
				"parent_id"=>$this->parent_id,
				"templateRef"=>$this->templateRef
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

