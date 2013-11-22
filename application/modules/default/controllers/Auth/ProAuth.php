<?php 
class Default_Controller_Auth_ProAuth{
    /**
     * Username
     *
     * @var string
     */
    protected $username = null;

    /**
     * Password
     *
     * @var string
     */
    protected $password = null;

    /**
     * Class constructor
     *
     * The constructor sets the username and password
     *
     
     * @param string $password
     */
    public function __construct($password) {
        
        $this->password = $password;
    }

    /**
     * Authenticate
     *
     * Authenticate the username and password
     *
     * @return Zend_Auth_Result
     */
    public function authenticate() {
        // Try to fetch the user from the database using the model
        
    	$class=new Admin_Model_ContentMapper();
    	
    	$dbAdapter = $class->getDbTable()->getAdapter();
    	$authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
    	$auth=Zend_Auth::getIdentity();
    	
    	$class=new Admin_Model_ContentMapper();
    	$user=$class->execQuery("select id_espacepro,status from ".DBPREFIX."espacepro where pass=?", array($this->password),1);
    	
    	// Do we have a valid user?
    	if (!$user||(int)$user->status!==1)return false;
    	
    	if(!$auth->hasIdentity()):
    	
    	$authAdapter->setTableName( DBPREFIX.'espacepro')
    	->setIdentityColumn('pass')
    	->setCredentialColumn('pass');
    	$authAdapter->setIdentity($this->password)->setCredential($this->password);
    	 
    	$auth=Zend_Auth::getInstance();
    	 
    	$result=$auth->authenticate($authAdapter);
    	endif;
    	
    	
    	$data=$auth->getStorage()->read();
    	
    	$data->zonepro=md5($user->id_espacepro);
    	$auth->getStorage()->write($data);
    	
    	var_dump($auth->getIdentity());
    	
    	die();
    	
        // Initialize return values
        $code = Zend_Auth_Result::FAILURE;
        $identity = null;
        $messages = array();
		
        $class=new Admin_Model_ContentMapper();
        $user=$class->execQuery("select id_espacepro,status from ".DBPREFIX."espacepro where pass=?", array($this->password),1);
      
        // Do we have a valid user?
        if (!$user||(int)$user->status!==1){
        $messages[] = 'Authentication error';
        
        } else {
        	        	
        		$code = Zend_Auth_Result::SUCCESS;
        		$identity = $user;
        	
        }

        return new Zend_Auth_Result($code, array("id_espacepro"=>md5($user->id_espacepro)), $messages);
    }


}