<?php

class Default_Model_BoutiqueMapper extends Admin_Model_Mapper
{

	public $_tableName="Boutique";
	protected $tablePrefix="Default_Model";
	protected $_id_rubrique_promo;
	protected $contentClass;
	
	public function __construct(){
	
			$arboClass = new Admin_Model_ArboMapper();
 	
 	$promo = $arboClass->getRubByTemplateRef('rubpromo',1);
 	
 	$this->_id_rubrique_promo = $promo[0]->id_rubrique;
	
 	$this->contentClass = new Admin_Model_ContentMapper();
 	
	parent::__construct();
	
	}
	
	
public final function getBoutiqueData($id_boutique){
 
 	
 	$class= new Admin_Model_ContentMapper();
	
	$dataBoutique = $class->getData($id_boutique);
	$tpl = new Admin_Model_TemplateMapper();
	
	$catField = $tpl->getFieldByName("boutique", "cat");
	$niveauxField = $tpl->getFieldByName("boutique", "niveau");
	
	$catValues = json_decode($catField->extra_params);
	
	$niveauxArray =json_decode($niveauxField->extra_params); 
	
	$boutiqueClass = new Default_Model_BoutiqueMapper();
	
	
	foreach($niveauxArray as $niveau):
	
		if($niveau->value ==(int) $dataBoutique->niveau):
		preg_match('#[0-9]#', $niveau->label, $match);
		$dataBoutique->selectedNiveau = (int)$match[0];

		
		
		$dataBoutique->niveau = ucfirst($niveau->label);
		
		break;
		
		endif;
	
	endforeach;
	
	
	$arrayCat = explode(',', $dataBoutique->cat);
	
	$arrayProv=array();
	
	$catBoutique = array();
	foreach($catValues as $value)$catBoutique[$value->value]=$value->label;
	
	foreach($arrayCat as $value):
	
	array_push($arrayProv, $catBoutique[$value]);
	
	endforeach;
	
	$dataBoutique->link = $class->getHrefLink($id_boutique);
	$dataBoutique->catTexte = implode(' - ',$arrayProv);
	
	//$self = new self();
	$promo = self::getBoutiquePromo($id_boutique);
	
	$dataBoutique->promo = $promo;
	
	return $dataBoutique;
 	
 
 }
 
public static function getBoutiques(){

	
	$class = new Admin_Model_ArboMapper();
	$contentClass = new Admin_Model_ContentMapper();
	
	$boutiqueListe = $class->getRubByTemplateRef('boutique',1);
	
	$tplClass = new Admin_Model_TemplateMapper();
	
	$niveauField = $tplClass->getFieldByName('boutique','niveau');
	$niveauData = json_decode($niveauField->extra_params);
	$niveauArray=array();
	
	foreach($niveauData as $niveau) $niveauArray[$niveau->value] = $niveau->label;
	

	
	$arrayBoutique = array();
	
	foreach($boutiqueListe as $boutique):
	
		$boutiqueData = $contentClass->getData($boutique->id_rubrique);

		$self = new self();
		
		$promo=self::getBoutiquePromo($boutique->id_rubrique);
				
		$imgData = Admin_Model_FileManager::getFileData($boutiqueData->logo);
		array_push($arrayBoutique, array("promo"=>$promo,"nom"=>$boutiqueData->titre, "logo"=>$boutiqueData->logo,"link"=>$contentClass->getHrefLink($boutique->id_rubrique),"cat" =>$boutiqueData->cat,"logomini"=>$boutiqueData->logomini, "niveau"=>$niveauArray[$boutiqueData->niveau], "width"=>$imgData->width,"height"=>$imgData->height, "coords"=>$boutiqueData->coords, "id"=>$boutique->id_rubrique));
		
	
	endforeach;
	

	
/*	//for($i=0; $i<10; $i++):
	
	foreach($arrayBoutique as $boutique):
	
	if(count($arrayBoutique)<50)array_push($arrayBoutique, $boutique);
	else break;
	
	endforeach;
	
	//endfor;
	*/
	return $arrayBoutique;
	

}
 
 
 public static function getBoutiquePromo($id_boutique){
 
 	$promoListe = self::getPromoListe(false);
 	
 	foreach($promoListe as $promo):
 	
 	
 	
 		if((int)$promo->boutique == $id_boutique) :
 		
 		return $promo;
 		
 		endif;
 		
 	
	endforeach;
 
	return false;
 	
 	
 //	$promoListe = 
 	
 	
 
 }
 
 
 public static function getPromoListe($showBoutique=true){

 	$self = new self();
 
 	$arbo = new Admin_Model_ArboMapper();
 	
 	$children =$arbo->getArbo($self->_id_rubrique_promo);
 
 	$listePromo=array();
 	
foreach($children as $key=>$promoID):

//var_dump($promoID);

$promo =  $self->contentClass->getData($promoID["id_rubrique"]);

$dateDebut = new Zend_Date($promo->datedebut);


$dateDebut->addDay(-2);

$dateFin = new Zend_Date($promo->datefin);
$now = new Zend_Date();

if($dateDebut->getTimestamp()>time()||$dateFin->getTimestamp()<time()):

else:

	
	
	$promo->dateText = "du ".($dateDebut->getMonth()!=$dateFin->getMonth()?$dateDebut->toString('dd MMMM'):$dateDebut->toString('dd'))." au ".$dateFin->toString("dd MMMM");
	if($dateFin->getYear()!=$dateDebut->getYear())$promo->dateText.=" ".$dateFin->toString('YYYY');
	
	$promo->promoID = $promoID["id_rubrique"];
	
	if($showBoutique):
	$boutique = $self->getBoutiqueData($promo->boutique);
	$promo->boutique = $boutique;
	
	endif;
	
	array_push($listePromo, $promo);	
endif;


endforeach;
 return $listePromo;
 
 }
	

}

