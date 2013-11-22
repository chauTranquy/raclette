<?php

class IndexController extends Zend_Controller_Action {

    protected $isHome = false;
    protected $id_article = false;

    public function init() {
        $this->auth = Zend_Auth::getInstance();
        if (Zend_Registry::isRegistered("site"))
            $this->site = Zend_Registry::get("site");

        /*
         * Google API Key
         */


        /*
         * V�rification si on a un utilisateur admin  connect�
         * 
         */


        $userModl = new Admin_Model_AdminUsersMapper();
        $this->isLogged = $userModl->checkUserLogin($this->auth->getIdentity()->uid);
        $this->userData = $userModl->getUserData($this->auth->getIdentity()->uid);
        $this->isAdmin = $this->userData->id_user > 0;
        $this->acl = Zend_Registry::get('adminACL');
        if (!$this->isAdmin):
            Zend_Registry::set('role', 'guest');
        else :
            Zend_Registry::set('role', 'adminUser');
            $siteClass = new Admin_Model_SitesMapper();
            $usersRightClass = new Admin_Model_UsersRightsMapper();
            $this->usersRights = $usersRightClass->loadUsersRights($this->userData->id_user_group, $this->userData->id_user);
            $acl = Zend_Registry::get('adminACL');
            if ($this->userData->superadmin == 1) :
                $acl->allow('adminUser');

                Zend_Registry::set("superadmin", true);
            else:
                Zend_Registry::set("superadmin", false);

            endif;

            foreach ($this->usersRights["result"] as $rights):


                $resourceName = $rights->module . "_" . $rights->plugin . '_' . $rights->rubId;
                $resource = new Zend_Acl_Resource($resourceName);

                $acl->add($resource);

                $arrayRights = array();

                if ($rights->edit == 1)
                    array_push($arrayRights, 'edit');

                if ($rights->write == 1)
                    array_push($arrayRights, 'write');
                if ($rights->read == 1)
                    array_push($arrayRights, 'read');


                if (count($arrayRights) > 0)
                    $acl->allow('adminUser', $resourceName, $arrayRights);
                else
                    $acl->deny('adminUser', $resourceName);

            endforeach;


            Zend_registry::set("adminACL", $acl);

        endif;

        /* eo v�rification role 
         * TBD gestion des roles
         * */

        $this->config = Zend_Registry::get('config');
        $this->crawler = preg_match('/([bB]ot|[sS]pider|[yY]ahoo|facebookexternalhit)/', $_SERVER["HTTP_USER_AGENT"]);
        if ($this->crawler):
            $redacteur = new Zend_Log_Writer_Stream(APPLICATION_PATH . '/log/logs.txt');
            $logger = new Zend_Log($redacteur);
            $logger->info('crawler detecte');
            $logger->info($_SERVER["HTTP_USER_AGENT"] . ' ' . $_SERVER['REQUEST_URI']);
        endif;

        $this->view->setScriptPath(array(APPLICATION_PATH . '/modules/default/views/scripts/', APPLICATION_PATH . '/modules/default/views/scripts/index/', APPLICATION_PATH . '/tpl/'));
    }

    public function preDispatch() {
        $action = $this->getRequest()->getActionName();

        $this->view->headMeta()->appendHttpEquiv('Content-Type', 'text/html; charset=UTF-8')->appendHttpEquiv('Content-Language', 'fr-FR');

        /* CSS FILE */
        if ($action == "index") {
            $this->view->headLink()->appendStylesheet('/_css/stylesAccueil.css')->appendStylesheet('/_css/responsiveAccueil.css');
        } else {
            $this->view->headLink()->appendStylesheet('/_css/styles.css')->appendStylesheet('/_css/responsive.css');
        }
        $this->view->headLink()->appendStylesheet('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css');


        /* JS FILE */
        $this->view->headScript()->appendFile('/_js/prefixfree.min.js')
                ->appendFile('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js')
                ->appendFile('/_js/jquery.timer.js')
                ->appendFile('/_js/jquery.nicescroll.min.js')
                ->appendFile('/_js/galleria-1.3.1.js')
                ->appendFile('/_js/paulmeJS.js');


        $this->layout = Zend_Layout::getMvcInstance();


        $arboClass = new Admin_Model_ArboMapper();

        $this->roots = $arboClass->getRoots(true);
        $this->mainRootID = intval($this->roots[roots][0]->id_rubrique);


        $mainIndex = $arboClass->getArbo($this->mainRootID, 1, false);

        $this->mainIndexID = $mainIndex[0]['id_rubrique'];

        if (null == $this->getRequest()->id_article) {
            $id = Admin_Model_ContentMapper::findRubByPermalink($_SERVER['REQUEST_URI'], 1);
            $this->getRequest()->setParam('id_article', $id);
            $this->id_article = $id;
        }
        else
            $this->id_article = $this->getRequest()->id_article;

        if ($action == "index") {
            $this->id_article = $this->mainIndexID;
            $this->isHome = true;
            $this->view->addScriptPath(APPLICATION_PATH . '\modules\default\layouts\scripts');
        } else {
            // test sous nav et affecter au layout !
            $arrayTmp = $arboClass->getArbo($this->id_article);


            if (empty($arrayTmp)) {
                $parent = $arboClass->getParentID($this->id_article);
                $children = $arboClass->getArbo($parent);
            } else {
                $children = $arboClass->getArbo($this->id_article);
            }

            $arraySubMenu = array();
            $mapper = new Admin_Model_ContentMapper();
            foreach ($children as $key => $child):

                if ($child['statut'] == "1"):

                    $dataChild = $mapper->getData($child['id_rubrique']);
                    array_push($arraySubMenu, array($dataChild->title, $mapper->getHrefLink($child['id_rubrique']), $this->id_article == $child['id_rubrique'] ? 'true' : 'false', $dataChild->titleuk));

                endif;
            endforeach;
            $this->layout->subMenu = $arraySubMenu;
        }



        if ($action != "sitemap" && $action != "robots" && $action != "logout") :

            $this->getContentData();
            $this->view->assign('filAriane', $this->getFilAriane(true));

        endif;

        $this->getMenu();
    }

    public function indexAction() {

        $this->layout->isHome = $this->isHome;
        $this->view->content = $this->html;
    }

    private function getContentData() {

        $class = new Admin_Model_ContentMapper();
        $arbo = new Admin_Model_ArboMapper();


        /*
         * Bandeau de news
         */

        $homeData = $class->getData($this->mainIndexID);

//        $this->layout->assign('bandeauNews', json_decode($homeData->news));

        $this->view->mainRubID = $this->id_article;
//        $this->layout->assign('maintenance', $this->maintenance);
//        if ($this->maintenance)
//            return $this->_helper->viewRenderer->setScriptAction("maintenance");





        $content = $this->loadCacheData($this->id_article);




        if (null == $content) :

            $data = $class->getContentData($this->id_article);


            if (!$data):
                throw new Zend_Controller_Action_Exception("erreur 404", 404);
            endif;

            $content = json_decode($data->data);
            $content->tpl = $data->templateRef;
            $content->description = $data->description;
            $content->keywords = $data->keywords;
            $content->baliseTitle = $data->baliseTitle;
        endif;


        if ($content->tpl == "contact") {

            $this->view->headLink()->appendStylesheet('http://' . $_SERVER["HTTP_HOST"] . '/_js/tipTip/tipTip.css', 'text/css', array('minify_disabled' => true));
            $this->view->headScript()->appendFile('http://' . $_SERVER["HTTP_HOST"] . '/_js/jquery.validate.js', 'text/javascript', array('minify_disabled' => false));
            $this->view->headScript()->appendFile('http://' . $_SERVER["HTTP_HOST"] . '/_js/tipTip/jquery.tipTip.minified.js', 'text/javascript', array('minify_disabled' => false));
//            $this->view->headScript()->appendFile('http://' . $_SERVER["HTTP_HOST"] . '/_js/jquery.reveal.js', 'text/javascript', array('minify_disabled' => false));


            $info = $arbo->getArbo($this->id_article, 1);
            $formDetail = $class->getData($this->id_article);

            $this->view->form = $formDetail;
        }


        if ($content->tpl == "page") {
            $this->view->headLink()->appendStylesheet('http://' . $_SERVER["HTTP_HOST"] . '/_css/reveal.css', 'text/css', array('minify_disabled' => true));
            $this->view->headScript()->appendFile('http://' . $_SERVER["HTTP_HOST"] . '/_js/jquery.reveal.js', 'text/javascript', array('minify_disabled' => false));
            $pageContent = $class->getData($this->id_article);

            $this->view->visuels = json_decode($pageContent->visuel);
            $this->view->contentfr = $pageContent->content;
            $this->view->contentuk = $pageContent->contentuk;
        }


        if ($content->tpl == "rubrique") {
//            $content->tpl = "page";
            $this->view->headLink()->appendStylesheet('http://' . $_SERVER["HTTP_HOST"] . '/_css/reveal.css', 'text/css', array('minify_disabled' => true));
            $this->view->headScript()->appendFile('http://' . $_SERVER["HTTP_HOST"] . '/_js/jquery.reveal.js', 'text/javascript', array('minify_disabled' => false));

            $tmp = $arbo->getArbo($this->id_article, true);
//            var_dump($this->id_article);
//            var_dump($tmp[0]['id_rubrique']);
//          
            if ($tmp[0]['id_rubrique']) {
                $this->id_article = $tmp[0]['id_rubrique'];
                $pageContent = $class->getData($tmp[0]['id_rubrique']);

                $this->view->visuels = json_decode($pageContent->visuel);
                $this->view->contentfr = $pageContent->content;
                $this->view->contentuk = $pageContent->contentuk;
            }
        }








        if ($this->mainIndexID == $this->id_article):
            $this->_helper->viewRenderer->setScriptAction('index');
        else:
            $this->_helper->viewRenderer->setScriptAction($content->tpl);
        endif;



        $this->view->data = $content;

        $this->view->rubTitle = $content->titre;
        $this->view->headTitle()->prepend($content->titre);


        $this->formatHTML($content);
        $this->view->data->content = $this->html;
        $this->view->content = $content;
    }

    public final function getFilAriane($html = true, $id_article = null) {

        $arboClass = new Admin_Model_ArboMapper();

        $roots = $arboClass->getRoots(1, true);

        if ($id_article == null)
            $id_article = $this->id_article;




        if (in_array($id_article, $roots))
            return;
        $class = new Admin_Model_ContentMapper();

        $arrayFil = array();


        do {
            $detail = $arboClass->find($id_article);


            $id_article = $detail->__get('parent_id');

            $tplClass = new Admin_Model_TemplateMapper();

            $tpl = $tplClass->find($detail->__get("id_template"));

            if ($tpl->__get("templateRef") == "rubrique"):

                $childs = $arboClass->getArbo($detail->__get('id_rubrique'), true, false);

                $link = $childs[0]["id_rubrique"];

            else:

                $link = $detail->__get('id_rubrique');

            endif;



            $hrefLink = $class->getHrefLink($link);

            $parentID = $arboClass->getParentID($detail->__get('id_rubrique'));


            if (!in_array($parentID, $roots)):

                if ($html)
                    array_push($arrayFil, ($detail->__get('id_rubrique') == $this->id_article ? "<h1 class=\"strong\">" . $detail->__get('title') . "</h1>" : '<a href="' . $hrefLink . '" data-parentid="' . $detail->__get('id_rubrique') . '">' . $detail->__get('title') . '</a>'));
                else
                    array_push($arrayFil, $detail->__get('id_rubrique'));
            endif;
        } while (!in_array($id_article, $roots));


        //if(count($arrayFil)>2)array_pop($arrayFil);
        $arrayFil = array_reverse($arrayFil);
        if ($html)
            return $this->fil = implode("&nbsp;&gt;&nbsp;", $arrayFil);


        return $arrayFil;
    }

    public function loadCacheData($id_article) {


        $frontendOptions = array(
            'lifetime' => null
        );

        // backend options
        $backendOptions = array(
            'cache_dir' => APPLICATION_PATH . '/cacheContent' // Directory where to put the cache files
        );

        // make object
        $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);




        $idCache = "file" . $id_article;

        $content = json_decode($cache->load($idCache));



        return $content;
    }

    private function formatHTML($content) {

        $class = new Admin_Model_ContentMapper();
        $pattern = "#<a [^>]*href=\"([^\"]+)\"[^>]*>(.*)</a>#Usi";

        $out2 = preg_replace_callback($pattern, array($class, 'formatLink'), $content->content);

        $pattern = "#<img [^>]*src=\"([^\"]+)\"[^>]* />#Usi";

        $out2 = preg_replace_callback($pattern, array($this, 'formatImageHTML'), $out2);



        $this->view->keywords = $content->keyword;
        $this->view->description = $content->description;
        $this->html = $out2;

        return $out2;
    }

    private function formatImageHTML($match) {


        if (!preg_match("#class=\"imgContent\"#", $match[0]))
            return $match[0];


        $dim = Admin_Model_FileManager::getFileData($match[1]);
        if ($dim->width <= 194 && $dim->height <= 209)
            return $match[0];
        $url = Admin_Model_ContentMapper::getImageURLStatic(preg_replace("#\/medias\/#", "", $match[1]), "194-209", "crop");
        $pattern = "#(src=)\"([^\"]+)\"#Usi";
        $result = preg_replace($pattern, "$1$url", $match[0]);




        $pattern = "#(width=)\"([0-9]+)\"#Usi";
        $result = preg_replace($pattern, "", $result);
        $pattern = "#(height=)\"([0-9]+)\"#Usi";
        $result = preg_replace($pattern, "", $result);


        return "<a href=\"{$match[1]}\" target=\"_blank\" class=\"linkImage\" rel=\"{$dim->width}|{$dim->height}\">$result</a>";
    }

    public function getMenu() {


        $arboClass = new Admin_Model_ArboMapper();
        $selectedParentId = $arboClass->getParentID($this->id_article);
        $menu = $arboClass->getArbo($this->mainRootID, 1, true);

        $class = new Admin_Model_ContentMapper();

        $menuTop = array();

        //        echo "<!--";
//                var_dump($menu[0]["children"]);
        //        echo "-->";

        foreach ($menu[0]["children"] as $item):

//            echo "<!--" . $item["id_rubrique"] . "-->";

            $link = $class->getHrefLink($item["id_rubrique"]);
            $data = $class->getContentData($item["id_rubrique"]);

            $data1 = $class->getContentData($item["id_rubrique"], null, $data->inline_version);
            $data = json_decode($data1->data);

            $item["link"] = $link;

            $children = array();


            foreach ($item["children"] as $child):

                $subchildren = array();
// pas de menu à 3 niveau
//                foreach ($child["children"] as $child2):
//                    var_dump($child2);
//                
//                    array_push($subchildren, array("link" => $class->getHrefLink($child2["id_rubrique"]), "title" => $child2["title"], "titleuk"=>"toto", "id_rubrique" => $child2["id_rubrique"], "tpl" => $child2["templateRef"]));
//
//                endforeach;

                $data2 = $class->getContentData($child["id_rubrique"], null);
                $data3 = json_decode($data2->data);


                array_push($children, array("link" => $class->getHrefLink($child["id_rubrique"]), "title" => $data3->title, "titleuk" => $data3->titleuk, "id_rubrique" => $child["id_rubrique"], "tpl" => $child["templateRef"], "children" => $subchildren));



            endforeach;


            array_push($menuTop, array("link" => $item["link"], "title" => $data->title, "titleuk" => $data->titleuk, "id_rubrique" => $item["id_rubrique"], "selectedParentId" => $selectedParentId, "children" => $children, "tpl" => $item["templateRef"]));

        endforeach;

        //->assign('whatever', 'foo');


        $this->layout->assign('menuTop', $menuTop);

//        $subMenu = $arboClass->getArbo($this->roots[1], 1, true);
        $subMenu = $arboClass->getArbo($this->roots[roots][1]->id_rubrique, 1, true);

        $menuBas = array();

        foreach ($subMenu[0]["children"] as $item):



            $link = $class->getHrefLink($item["id_rubrique"]);

            $item["link"] = $link;
            $data = $class->getContentData($item["id_rubrique"]);

            $data = $class->getData($item["id_rubrique"]);




            //$data=json_decode($data["result"]->data);

            array_push($menuBas, array("link" => $item["link"], "title" => $data->title, "id_rubrique" => $item["id_rubrique"], "titleuk" => $data->titleuk));

        endforeach;

        $this->layout->assign('menuBas', $menuBas);
    }

    public function getcontentAction() {
        $this->view->content = $this->html;
    }

}

