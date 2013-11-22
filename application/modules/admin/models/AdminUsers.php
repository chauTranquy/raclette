<?php

class Admin_Model_AdminUsers
{

protected $id_user=0;
protected $email;
protected $firstname;
protected $lastname;
protected $uid;
protected $creation_date;
protected $last_connexion;
protected $id_user_group;
protected $pass;
protected $pass_salt;
protected $active;
protected $ip_address;
protected $session_id;
protected $connexion_timestamp;


	public function dataToArray(){
	
	return array("id_user"=>$this->id_user,
				"email"=>$this->email,
				"firstname"=>$this->firstname,
				"lastname"=>$this->lastname,
				"uid"=>$this->uid,
				"creation_date"=>$this->creation_date,
				"last_connexion"=>$this->last_connexion,
				"id_user_group"=>$this->id_user_group,
				"pass"=>$this->pass,
				"pass_salt"=>$this->pass_salt,
				"active"=>$this->active,
				"ip_address"=>$this->ip_address,
				"session_id"=>$this->session_id,
				"connexion_timestamp"=>$this->connexion_timestamp
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

