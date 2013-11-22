<?php

class Admin_Model_Content
{

protected $id_content;
protected $id_rubrique;
protected $data;
protected $creation_date;
protected $update_date;
protected $version_id;
protected $id_user;
protected $status;
protected $keywords;
protected $description;
protected $baliseTitle;
protected $timelock;
protected $user_lock_uid;


	public function dataToArray(){
	
	return array("id_content"=>$this->id_content,
				"id_rubrique"=>$this->id_rubrique,
				"data"=>$this->data,
				"creation_date"=>$this->creation_date,
				"update_date"=>$this->update_date,
				"version_id"=>$this->version_id,
				"id_user"=>$this->id_user,
				"status"=>$this->status,
				"keywords"=>$this->keywords,
				"description"=>$this->description,
				"baliseTitle"=>$this->baliseTitle,
            "timelock"=>$this->timelock,
            "user_lock_uid"=>$this->user_lock_uid
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

