<?php
class Default_Controller_Helpers_GetLayoutData extends Zend_Controller_Action_Helper_Abstract{
	
	
	public function __construct(){
		
		
		$this->frontController = Zend_Controller_Front::getInstance();
		$this->arboClass = new Admin_Model_ArboMapper();
		$this->site = Zend_Registry::get("site");
              
		$this->roots = $this->arboClass->getRoots($this->site->id_site,true);
		
		$this->mainRootID = $this->roots[0];
		
		$this->layout = Zend_Layout::getMvcInstance();
		$this->class = new Admin_Model_ContentMapper();
		$this->view=$this->layout->getView();
		
		
	}
	
	public function getHeaderData(){
		
		include_once(APPLICATION_PATH . '/../library/My/Action/Helpers/MinifyHeadScript.php');
		include_once(APPLICATION_PATH . '/../library/My/Action/Helpers/MinifyHeadLink.php');
		include_once(APPLICATION_PATH . '/../library/My/View/Helpers/GoogleAnalytics.php');
		include_once(APPLICATION_PATH . '/../library/My/Action/Helpers/Utils.php');
		
		$this->view->addHelperPath(APPLICATION_PATH . '/../library/My/View/Helpers/GoogleAnalytics.php', 'My_View_Helpers');
		
		if ((int)$this->site->googleActivated==1&&!$this->site->googleWebPropertyId!==""):
		$this->view->GoogleAnalytics(null, $this->site->googleWebPropertyId);
		
		
		
		endif;
		
		
		$this->view->registerHelper(new My_Action_Helpers_MinifyHeadScript(), 'headScript');
		$this->view->registerHelper(new My_Action_Helpers_MinifyHeadLink(), 'headLink');
		
		
		$paramsClass = new Admin_Model_ParamsMapper();
		
               
		$jsFilesObj = $paramsClass->getParam("jsFiles", null, $this->site->id_site);
		
		
		$jsFiles = json_decode($jsFilesObj->value);

                
		foreach ($jsFiles as $file):
		
		$arrayOptions = array();
		
		
		if($file->statut===1) :
		if (!empty($file->conditionale))
			$arrayOptions['conditional'] = $file->conditionale;
		
		if ($file->type == 2):
		$this->view->headScript()->appendFile($file->file, 'text/javascript', $arrayOptions);
		else:
		
		if ($file->minify != 1)
			$arrayOptions['minify_disabled'] = true;
		
		$this->view->headScript()->appendFile($file->file, 'text/javascript', $arrayOptions);
		endif;
		endif;
		endforeach;
		
		$cssFilesObj = $paramsClass->getParam("cssFiles",null, $this->site->id_site);
		$cssFiles = json_decode($cssFilesObj->value);
		
		foreach ($cssFiles as $file):
		
		$media = array();
		if ($file->screen == 1)
			array_push($media, 'screen');
		if ($file->print == 1)
			array_push($media, 'print');
		if (!empty($file->othermedia)):
		
		$otherMediaArray = explode(',', $file->othermedia);
		$media = array_merge($media, $otherMediaArray);
		
		
		endif;
		
		
		$mediaStr = implode(',', $media);
		$arrayOptions = array();
		if (!empty($file->conditionale))
			$arrayOptions['conditional'] = $file->conditionale;
		if ($file->type == 2):
		$this->view->headLink()->appendStylesheet($file->file, $mediaStr, null, $arrayOptions);
		else:
		
		
		if ($file->minify != 1)
			$arrayOptions = array('minify_disabled' => true);
		$this->view->headLink()->appendStylesheet($file->file, $mediaStr, null, $arrayOptions);
		
		endif;
		
		endforeach;
		
	}
	
	public function getMenu(){
		
		$arboClass = $this->arboClass;
		$menu = $arboClass->getArbo($this->mainRootID, 1, true,0,true);
		$layout =$this->layout;
		$class = $this->class;

		$menuTop = array();
		
		
		foreach ($menu[0]["children"] as $item):
		
		
		
		$link = $class->getHrefLink($item["id_rubrique"]);
		$data = $class->getContentData($item["id_rubrique"]);
		
		$data1 = $class->getContentData($item["id_rubrique"], null, $data->inline_version);
		$data = json_decode($data1->data);
		
		$item["link"] = $link;
		
		$children = array();
		
		
		foreach ($item["children"] as $child):
		
		$subchildren = array();
		
		foreach ($child["children"] as $child2):
		
		array_push($subchildren, array("link" => $class->getHrefLink($child2["id_rubrique"]), "title" => $child2["title"], "id_rubrique" => $child2["id_rubrique"], "tpl" => $child2["templateRef"]));
		
		endforeach;
		
		array_push($children, array("link" => $class->getHrefLink($child["id_rubrique"]), "title" => $child["title"], "id_rubrique" => $child["id_rubrique"], "tpl" => $child["templateRef"], "children" => $subchildren));
		
		
		
		endforeach;
		
		
		array_push($menuTop, array("link" => $item["link"], "title" => $item["title"], "id_rubrique" => $item["id_rubrique"], "children" => $children, "tpl" => $item["templateRef"]));
		
		endforeach;
		
	
		$layout->assign('menuTop', $menuTop);
		
		$subMenu = $arboClass->getArbo($this->roots[1], 1, true);
		
		$menuBas = array();
		
		foreach ($subMenu[0]["children"] as $item):
		
		
		
		$link = $class->getHrefLink($item["id_rubrique"]);
		
		$item["link"] = $link;
		$data = $class->getContentData($item["id_rubrique"]);
		
		$data = $class->getData($item["id_rubrique"]);
		
		//$data=json_decode($data["result"]->data);
		
		array_push($menuBas, array("link" => $item["link"], "title" => $item["title"], "id_rubrique" => $item["id_rubrique"], "titre" => $data->titre));
		
		endforeach;
		
		$layout->assign('menuBas', $menuBas);
		
		
	}
	
	
	
}