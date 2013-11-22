<?php
class Admin_Model_GAnalytics {

	private $_site;
	
public function __construct(){
	
	require_once '../library/Gapi/gapi.class.php';

	
		$email = "agencetexto@gmail.com";
		$password = "massonnet";
	
		$this->analytics  = new gapi($email,$password);

		$this->_report_id=33864608;
		
		
			
	}
	
	public function query($dimensions, $metrics, $sort_metric=null, $filter=null, $start_date=null, $end_date=null, $start_index=1, $max_results=30){
		
		
		return $this->analytics->requestReportData(33864608,array('browser','browserVersion'),array('pageviews','visits'));
		
		die();
		
		$metrics=explode(',',$metrics);
		$dimensions=explode(',',$dimensions);
				
		return $this->analytics->requestReportData($this->_report_id, $dimensions, $metrics, $sort_metric, $filter, $start_date, $end_date, $start_index, $max_results);
	
	
	}
	
function getFirstprofileId(&$analytics) {
  $accounts = $analytics->management_accounts->listManagementAccounts();

  if (count($accounts->getItems()) > 0) {
    $items = $accounts->getItems();
    $firstAccountId = $items[0]->getId();

    $webproperties = $analytics->management_webproperties
        ->listManagementWebproperties($firstAccountId);

    if (count($webproperties->getItems()) > 0) {
      $items = $webproperties->getItems();
      $firstWebpropertyId = $items[0]->getId();

      $profiles = $analytics->management_profiles
          ->listManagementProfiles($firstAccountId, $firstWebpropertyId);

      if (count($profiles->getItems()) > 0) {
        $items = $profiles->getItems();
        return $items[0]->getId();

      } else {
        throw new Exception('No profiles found for this user.');
      }
    } else {
      throw new Exception('No webproperties found for this user.');
    }
  } else {
    throw new Exception('No accounts found for this user.');
  }
}	
	
	public function getData(){
	
		
$url	= "https://www.google.com/analytics/web/?hl=en&pli=1#dashboard/default/a33864608w61238197p62704231/";
$client 	= new Zend_Http_Client($url);
$client->setHeaders( "Authorization: GoogleLogin auth=".$this->token);
$r 	= $client->request(Zend_Http_Client::GET);
$xmlBody 	= $r->getBody();


echo $xmlBody;
die();

$xmlBody 	= str_replace('dxp:','',$xmlBody);

//
// utilisation de SimpleXML
$xml 		= simplexml_load_string($xmlBody);
$tProfiles	= array();	// tableau qui va recevoir tous les profils

//
// pour chaque résultat
foreach($xml->entry as $entry) {

	//
	// tableau qui va contenir temporairement les infos d'un seul profil
	$tVal 	= array();
		
	//
	// récupérer les infos principales
	$tVal['title']	= strval( $entry->title );
	$tVal['id']	= strval( $entry->id );
	$tVal['tableId']	= strval( str_replace('ga:', '', $entry->tableId) );
	
	//
	// récupérer les propriétés, qui sont stockées sous forme d'attribut, dans des noeuds "property"
	foreach($entry->property as $r) {
		$name	= strval($r['name']);
		$name	= trim( str_replace('ga:', '', $name) );
		$tVal[$name] = strval($r['value']);
	}
	
	//
	// ajouter au tableau final
	$tProfiles[]	= $tVal;

}

//
// afficher
print_r($tProfiles);
		die();
		
		
		$accounts = $this->service->getAccountFeed();  
$properties = array(  
  'webPropertyId', 'accountName', 'accountId',  
  'profileId', 'currency', 'timezone',  
  'title', 'tableId', 'id', 'updated', 'link'  
);  
  
foreach($accounts as $account) {  
  echo "\n{$account->title}\n";  
  foreach($properties as $property) {  
    echo "\t{$property} = {$account->$property}\n";  
  }  
}  ;
return;
		
	
		    $dimensions = array(  
      Zend_Gdata_Analytics_DataQuery::DIMENSION_MEDIUM,  
      Zend_Gdata_Analytics_DataQuery::DIMENSION_SOURCE,  
      Zend_Gdata_Analytics_DataQuery::DIMENSION_BROWSER_VERSION,  
      Zend_Gdata_Analytics_DataQuery::DIMENSION_MONTH,  
    );  
      
    $query = $this->service->newDataQuery()->setProfileId('UA-33864608-1')  
      ->addMetric(Zend_Gdata_Analytics_DataQuery::METRIC_BOUNCES)   
      ->addMetric(Zend_Gdata_Analytics_DataQuery::METRIC_VISITS)   
      //->addFilter("ga:browser==Firefox")  
      ->setStartDate('2011-05-01')   
      ->setEndDate('2011-05-31')   
      ->addSort(Zend_Gdata_Analytics_DataQuery::METRIC_VISITS, true)  
      ->addSort(Zend_Gdata_Analytics_DataQuery::METRIC_BOUNCES, false)  
      ->setMaxResults(50);  
      
    foreach($dimensions as $dim){  
      $query->addDimension($dim);  
    }  
      
    $result = $this->service->getDataFeed($query);   
    foreach($result as $row){  
      echo $row->getMetric('ga:visits')."\t";  
      echo $row->getValue('ga:bounces')."\n";  
    }  
	
	
	
	}

}