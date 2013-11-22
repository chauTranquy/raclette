<?php

class Admin_Model_ContentMapper extends Admin_Model_Mapper {

    private $_site;
    private $_mediaPath;
    public $_tableName = "Content";
    protected $_moduleName = "cms.ContentController";

    public function __construct() {
        parent::__construct();

        $this->_site = Zend_Registry::get('site');

        $this->_mediaPath = realpath(APPLICATION_PATH . '/../public/' . $this->_site->media_dir);
    }

    public function addOrModify($id_element, $actionType, $version_id = 0, $statut = 0, $keywords = "", $description = "", $permalink = "", $baliseTitle = "", $startPub = "", $endPub = "") {


        if (empty($permalink)):

            $link = $this->getHrefLink($id_element);
            $permalinkObj = $this->checkPermalink($id_element, $link);

            $permalink = $permalinkObj["permalink"];

        else :

            $test = $this->checkPermalink($id_element, $permalink);


            if ($test["success"] !== true)
                return array("success" => false, "msg" => "Le permalink existe d&eacute;j&agrave; !");

        endif;



        $resourceName = $this->_moduleName . "__" . $id_element . '_' . $this->_site->id_site;
        $isAllowed = $this->checkUsersRights($resourceName);

        if (!$isAllowed["write"])
            return array("success" => false, "error" => "Vous n'avez pas le droit d'&eacute;dition sur cet &eacute;l&eacute;ment");

        $arboClass = new Admin_Model_ArboMapper();
        $dataError = array();
        $dataArray = array();
        $success = true;

        $element = $arboClass->getElement($id_element);

        if (!$element)
            return array("success" => false, "error" => "template inconnu");

        $templateClass = new Admin_Model_TemplateMapper();

        $fieldsArray = $templateClass->getTemplateData($element->id_template);
        $fields = $fieldsArray["result"];


        foreach ($fields as $field) {

            $isCompulsary = $field->compulsary;

            $field_name = $field->field_name;
            $field_type = $field->field_type;

            if ($field_type == "numberfield" && $isCompulsary && $field->extra_params->allowZero == "true"):

            elseif ($isCompulsary && empty($_POST[$field_name])):
                array_push($dataError, "<li>" . $field->label . "</li>");
                $success = false;
            else:
                $dataArray[$field_name] = $_POST[$field_name];

            endif;
        }


        $version_id = $this->getContentData($id_element, null, $version_id, $id_site);


        $this->auth = Zend_Auth::getInstance();
        $userModl = new Admin_Model_AdminUsersMapper();

        $this->userData = $userModl->getUserData($this->auth->getIdentity()->uid);


        if ($success)
            switch ($actionType):

                case -1:

                case 1:// enregistrement

                    if ($version_id == null || empty($version_id)) {

                        $newVersionID = $this->getVersionId($id_element);

                        $sql = "insert into " . DBPREFIX . "content(id_rubrique, data, version_id,keywords, description, id_user, baliseTitle) values (?,?,?,?,?,?,?)";


                        $arrayKey = array($id_element, json_encode($dataArray), $newVersionID->version_id_OUT, $keywords, $description, $this->userData->id_user, $baliseTitle);

                        $versionID = $newVersionID->version_id_OUT;
                    } else {

                        $sql = "update " . DBPREFIX . "content set data=?, keywords=?, description=?, update_date=CURRENT_TIMESTAMP, id_user=?, baliseTitle=? where id_content=? and version_id=?";
                        $arrayKey = array(json_encode($dataArray), $keywords, $description, $this->userData->id_user, $baliseTitle, $version_id->id_content, $version_id->version_id);

                        $versionID = $version_id->version_id;
                    }

                    break;

                default:

                    $newVersionID = $this->getVersionId($id_element, $version_id->version_id == 0 ? 0 : 1);
                    $versionID = $newVersionID->version_id_OUT;

                    $sql = "insert into " . DBPREFIX . "content(id_rubrique, data, version_id, keywords, description, id_user, baliseTitle) values (?,?,?,?,?,?, ?)";
                    $arrayKey = array($id_element, json_encode($dataArray), $newVersionID->version_id_OUT, $keywords, $description, $this->userData->id_user, $baliseTitle);

                    break;


            endswitch;

        if ($actionType == 3)
            $statut = 1;


        if (!$success)
            return array("success" => $success, "error" => "Les champs suivants sont manquants :<ol>" . implode("", $dataError) . "</ol>");

        $this->execQuery($sql, $arrayKey, -1);

        $this->execQuery('update ' . DBPREFIX . 'rubrique set permalink=? where id_rubrique=?', array($permalink, $id_element), -1);

        if ($statut == 1 || $actionType == -1):
            $result = $this->publish($id_element, $versionID, $statut, $startPub, $endPub);



            if (!$result["success"])
                return $result;

        endif;

        return $this->getContentData($id_element, $element->templateRef, $versionID);
    }

    public function getContentData($id_element, $templateRef = null, $version_id = 0, $displayFront = false) {



        $adminUserClass = new Admin_Model_AdminUsersMapper();

        if (Zend_Registry::get("role") != "guest")
            $adminUserClass->unlockUserElement($this->auth->getIdentity()->uid);

        $resourceName = $this->_moduleName . "__" . $id_element . '_' . $this->_site->id_site;


        $rights = $this->checkUsersRights($resourceName);


        if (!$rights["read"] && !$displayFront)
            return array("success" => false, "error" => "Vous n'avez pas les droits requis pour visualiser cet &eacute;l&eacute;ment");


        $sql = "call getContentData(?,?)";
        $row = $this->execQuery($sql, array($id_element, $version_id), 1);


        $isLocked = false;


        if (Zend_Registry::get("role") != "guest" && $row && $row->timelock && $row->user_lock_uid && trim($row->user_lock_uid) != $this->auth->getIdentity()->uid && !$displayFront):


            //if(trim($row->user_lock_uid)!=$this->auth->getIdentity()->uid&&$row->timelock<session_cache_expire()) $isLocked=true;
            if ($row->timelock < session_cache_expire())
                $isLocked = true;

        endif;




        if ($isLocked != true && $row && Zend_Registry::get("role") != "guest") {

            $this->execQuery("call lockContent(?,?)", array($row->id_content, $this->auth->getIdentity()->uid), -1);
        }
        else
            $result = "locked";



        //
        $permalink = $this->getHrefLink($id_element, false);

        if (!$templateRef)
            return $row;

        if (!$row)
            $row = (object) array();
        if (empty($row->permalink))
            $row->permalink = $permalink;

        $template = new Admin_Model_TemplateMapper();
        $tpFields = $template->getTemplateFields($templateRef);

        return array("success" => true, "result" => $row, "fields" => $tpFields["result"], "rights" => $rights, "isLocked" => $isLocked);
    }

    public function getVersionsList($id_rubrique) {

        $rowset = $this->execQuery("call getVersionsList(?)", array($id_rubrique));

        return $rowset;
    }

    public function getData($id_rubrique) {

        $row = $this->getContent($id_rubrique);


        return json_decode($row->data);
    }

    public function getVersionId($id_element, $updateCompteur = 0) {

        $stmt = $this->getDbTable()->getAdapter()->query("call getVersionId(?, ?)", array($id_element, $updateCompteur));
        $row = $stmt->fetch(PDO::FETCH_OBJ);

        return $row;
    }

    public function checkPermalink($id_article, $permalink) {


        //$permalink="/accueil";

        $i = 0;

        do {

            preg_match("/\.([^\.]+)$/", $permalink, $matches);

            if (count($matches) > 0) {

                $permalink = preg_replace('/' . $matches[0] . '/', '', $permalink) . ($i > 0 ? '-' . $i : '') . $matches[0];
            }
            else
                $permalink = $permalink . ($i > 0 ? '-' . $i : '');

            //die($permalink);

            $rowset = $this->execQuery("call checkPermalink(?,?)", array($id_article, $permalink), 1);
            if ($rowset->numrows > 0)
                return array("success" => false, "permalink" => $permalink);


            $i++;
        } while ($rowset->result != 0);
        return array("success" => true, "permalink" => $permalink);
    }

    public function publish($id_element, $version_id, $statut = 0, $startPub = "", $endPub = "") {
        $resourceName = $this->_moduleName . "__" . $id_element . '_' . $this->_site->id_site;

        $now = new Zend_Date();

        $startDate = $endDate = null;
        $startPub = "07/07/2013";

        if ($startPub !== ""):

            $startDate = new Zend_Date($startPub);

        //$startDate=$startDate->toString('YYYY-MM-dd');

        endif;

        if ($endPub !== ""):

            $endDate = new Zend_Date($endPub);
        //$endDate=$endDate->toString("d MMMM YYYY");

        endif;




        $rights = $this->checkUsersRights($resourceName);

        if ($rights["edit"] == 0)
            return array("success" => false, "error" => "Vous n'avez pas les droits requis pour publier cet &eacute;l&eacute;ment");

        $this->auth = Zend_Auth::getInstance();
        $userModl = new Admin_Model_AdminUsersMapper();

        $this->userData = $userModl->getUserData($this->auth->getIdentity()->uid);



        if ($startDate !== null && $startDate > $now && $statut == 1):
            $arrayArgs = array($id_element, $version_id, $startDate->toString('YYYY-MM-dd'), $endDate !== null ? $endDate->toString('YYYY-MM-dd') : null);

            if ($endDate == null):
                $query = "select id_publishQueue from " . DBPREFIX . "publishQueue where id_element=? and version_id=? and startDate=? and endDate is null";
                $args = array($id_element, $version_id, $startDate->toString('YYYY-MM-dd'));
            else:
                $query = "select id_publishQueue from " . DBPREFIX . "publishQueue where id_element=? and version_id=? and startDate=? and endDate=?";
                $args = $arrayArgs;
            endif;
            $result = $this->execQuery($query, $args, 1);

            if (!$result):
                $query = "insert into " . DBPREFIX . "publishQueue (id_element, version_id, startDate, endDate) values (?,?,?,?)";
                $this->execQuery($query, $arrayArgs, -1);
            endif;
        else:

            $stmt = $this->getDbTable()->getAdapter()->query("call publishElement(?, ?, ?, ?)", array($id_element, $version_id, $statut, (int) $this->userData->id_user));
            $stmt->execute();
            // gestion du cache


            $frontendOptions = array(
                'lifetime' => null
            );

// backend options
            $backendOptions = array(
                //'automatic_serialization'=> true,
                'cache_dir' => APPLICATION_PATH . '/cacheContent' // Directory where to put the cache files
            );

            $cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

            $cacheID = "file" . $id_element;

            $cache->remove($cacheID);

            if ($statut == 0)
                return array("success" => true);

            $contentdata = $this->getContent($id_element);

            if ($contentdata->publiable == 0)
                return array("success" => true);
            $data = $contentdata->data;



            $childRequired = $contentdata->child_required;
            $childs = array();

            $data = json_decode($contentdata->data);

            if (!$data)
                $data = (object) array();

            $data->permalink = $this->getPermalink($id_element);

            if ($childRequired == 1):

                $arboClass = new Admin_Model_ArboMapper();

                $children = $arboClass->getArbo($id_element, 1, true);


                foreach ($children as $child):

                    $rowChild = $this->getContent($child["id_rubrique"]);
                    $rowChild->id_rubrique = $child["id_rubrique"];

                    array_push($childs, $rowChild);

                endforeach;


                $data->children = $childs;

            endif;
            $data->id_rubrique = $contentdata->id_rubrique;


            $keywords = $contentdata->keywords;
            $description = $contentdata->description;
            $title = $contentdata->title;
            $baliseTitle = $contentdata->baliseTitle;
            $tweetURL = Admin_Model_ContentMapper::getShortURL("http://{$_SERVER["HTTP_HOST"]}" . $this->getHrefLink($id_element));

            if (!($cache->load($cacheID)) && $statut == 1) {

                ob_start();

                include_once APPLICATION_PATH . "/tpl/" . strtolower($contentdata->templateRef) . ".phtml";

                $out2 = ob_get_contents();

                ob_end_clean();


                $cacheStr = json_encode(array("content" => $out2, "keyword" => $keywords, "description" => $description, "title" => $title, "tpl" => $contentdata->templateRef, "baliseTitle" => $baliseTitle));

                $cache->save($cacheStr);
            }
        endif;
        return array("success" => true);
    }

    public function getContent($id_rub) {

        $row = $this->execQuery("call getRubContent(?)", array($id_rub), 1);


        return $row;
    }

    public function delete($items) {

        $item = explode(";", $items);

        $resultArray = array();

        foreach ($item as $it):

            $stmt = $this->getDbTable()->getAdapter()->query("call deleteVersion(?)", array($it));

            $row = $stmt->fetch(PDO::FETCH_OBJ);

            if ($row->result == -1) {

                return array("success" => false, "error" => "Vous ne pouvez pas effacer cette version " . $row->versionID);
            } elseif ($row->result == -2) {

                array_push($resultArray, "La version " . $row->versionID . " est en ligne. Vous devez la d&eacute;publier avant de la supprimer!");
            }


            unset($stmt);


        endforeach;

        return array("success" => count($resultArray) == 0, "error" => implode("<br />", $resultArray));
    }

    public function formatLink($match) {




        $return = $match[0];



        // liens internes
        if (preg_match('/internalMedia:/', $match[1])) {

            $mediaArray = explode(':', $match[1]);

            if (file_exists($this->_mediaPath . $mediaArray[1])) :
                $url = "/medias/" . $mediaArray[1];

                $finfo = finfo_open(FILEINFO_MIME_TYPE) or die("ouinnnnnnnnnn");

                $mime = finfo_file($finfo, $this->_mediaPath . $mediaArray[1]);

                $rel = preg_match('/image/', $mime) ? " rel=\"shadowbox\" class=\"mini\"" : "";

                $return = preg_replace("/href=\"(.*?)\"/i", "href=\"$url\" $rel", $match[0]);
            else:
                $return = $match[2];
            endif;
        }

        // liens internes
        else if (preg_match('/internal:/', $match[1])) {

            $displayLink = true;

            if (preg_match('/internal:([0-9]+)\|([0-9]{1})/', $match[1], $rubArray)):
                $displayLink = $rubArray[2];
            else :
                preg_match('/internal:([0-9]+)/', $match[1], $rubArray);
            endif;

            $url = $this->getHrefLink($rubArray[1]);
            $data = $this->getContentData($rubArray[1]);
            $data = $this->getContentData($rubArray[1], null, $data->inline_version);

            $data = json_decode($data->data);

            if ($url)
                $return = preg_replace("/href=\"(.*?)\"/i", "href=\"$url\" class=\"internalLink\" title=\"{$data->titre}\" ", $match[0]);
            else
                $return = $displayLink ? $match[2] : "";
        }
        return $return;
    }

    public function getRubContent($id_rubrique, $online = 1) {

        $arboClass = new Admin_Model_ArboMapper();
        $childArray = $arboClass->getArbo($id_rubrique, $online);

        $contentArray = array();

        foreach ($childArray as $rub):

            $rub = (object) $rub;

            $content = $this->getData($rub->id_rubrique);
            $content->id_rubrique = $rub->id_rubrique;
            $content->templateRef = $rub->templateRef;
            array_push($contentArray, $content);

        endforeach;

        return $contentArray;
    }

    public function getHrefLink($id, $isOnline = true, $attr = array()) {

        $arbo = new Admin_Model_ArboMapper();

        $permalink = $this->getPermalink($id, $isOnline);

        
        if (!empty($permalink))
            return $permalink;

        $rootsArray = $arbo->getRoots($this->_site->id_site);

        $roots = array();

        foreach ($rootsArray["roots"] as $root) {

            array_push($roots, $root->id_rubrique);
        };

        $idRub = $id;


        $arrayLink = array();

        do {
            $row = $this->execQuery("call getRubDetail(?)", array($idRub), 1);

            if (!$row)
                return false;

            $idRub = $row->parent_id;
            array_push($arrayLink, $this->stripAccents($row->title));

            if ($isOnline && $row->status != 1)
                return false;
        }
        while (!in_array($idRub, $roots));



        if (count($arrayLink) > 1)
            array_pop($arrayLink);
        $arrayLink = array_reverse($arrayLink);


        $url = implode("/", $arrayLink);



        return "/" . $url; //."-".$id.".html";
    }

    public function getPermalink($id, $isOnline = true) {

        $result = $this->execQuery("call getPermalink(?,?, ?)", array($id, (int) $isOnline, $this->_site->id_site), 1);


        return $result->result;
    }

    public function stripAccents($string) {

        $string = preg_replace('/\//', '', $string);
        $str = strtr(utf8_decode($string), 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ\'"', 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY--');



        $str = preg_replace('/(\?||!)/', '', $str);
        $str = preg_replace('/,/', '', $str);
        $str = trim($str);
        $str = preg_replace('/( ){1,}/', '-', $str);



        return strtolower($str);
    }

    public static function untilAccents($string) {
        $table = array(
            '&Egrave;' => 'e', '&Eacute;' => 'e', '&Ecirc;' => 'e', '&Euml;' => 'e',
            '&egrave;' => 'e', '&eacute;' => 'e', '&ecirc;' => 'e', '&euml;' => 'e',
            '&Agrave;' => 'a', '&Aacute;' => 'a', '&Acirc;' => 'a', '&Atilde;' => 'a', '&Auml;' => 'a', '&Aring;' => 'a',
            '&agrave;' => 'a', '&aacute;' => 'a', '&acirc;' => 'a', '&atilde;' => 'a', '&auml;' => 'a', '&aring;' => 'a',
            '&Igrave;' => 'i', '&Iacute;' => 'i', '&Icirc;' => 'i', '&Iuml;' => 'i',
            '&igrave;' => 'i', '&iacute;' => 'i', '&icirc;' => 'i', '&iuml;' => 'i',
            '&Ograve;' => 'o', '&Oacute;' => 'o', '&Ocirc;' => 'o', '&Otilde;' => 'o', '&Ouml;' => 'o',
            '&ograve;' => 'o', '&oacute;' => 'o', '&ocirc;' => 'o', '&otilde;' => 'o', '&ouml;' => 'o',
            '&Ugrave;' => 'u', '&Uacute;' => 'u', '&Ucirc;' => 'u', '&Uuml;' => 'u',
            '&ugrave;' => 'u', '&uacute;' => 'u', '&ucirc;' => 'u', '&uuml;' => 'u',
            '&oelig;' => 'oe',
            '&Scaron;' => 's', '&scaron;' => 's',
            '&Yacute;' => 'y',
            '&ccedil;' => 'c',
            '&ntilde;' => 'n',

        );

        return strtolower(strtr(($string), $table));
    }

    public static function findRubByPermalink($id, $isOnline = true, $id_site = 1) {

        $self = new self();
        $result = $self->execQuery("call findRubByPermalink(?,?,?)", array($id, $isOnline, $id_site), 1);

        return $result->result;
    }

    public static function enleveAccents($string) {


        return self::stripAccents($string);
    }

    public static function getShortURL($url) {

        $postData = array("longUrl" => $url);
        $jsonData = json_encode($postData);

        $curlObj = curl_init();

        curl_setopt($curlObj, CURLOPT_URL, 'https://www.googleapis.com/urlshortener/v1/url');
        curl_setopt($curlObj, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curlObj, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curlObj, CURLOPT_HEADER, 0);
        curl_setopt($curlObj, CURLOPT_HTTPHEADER, array('Content-type:application/json'));
        curl_setopt($curlObj, CURLOPT_POST, 1);
        curl_setopt($curlObj, CURLOPT_POSTFIELDS, $jsonData);

        $response = curl_exec($curlObj);

//change the response json string to object
        $json = json_decode($response);

        curl_close($curlObj);
        return $json->id;
    }

    public static function isMediaUsed($path) {

        $self = new self();

        $test = $self->mediaUtilisationCount($path);
        return $test == 0;
    }

    public static function mediaUtilisationCount($path) {
        $self = new self();


        $stmt = $self->getDbTable()->getAdapter()->query("call getMedia(?, ?)", array($path, $self->_site->id_site));



        $row = $stmt->fetch(PDO::FETCH_OBJ);

        return $row->nbre;
    }

    public function getImageUrl($imagePath, $thumbSize, $type = "thumb") {


        preg_match('/([a-zA-Z0-9\/_\-]+).(png|jpe?g|gif)/i', $imagePath, $match);

        return "/image/$type/$thumbSize/" . $match[2] . $match[1];
    }

    public static function getImageURLStatic($imagePath, $thumbSize, $type = "thumb") {

        return self::getImageUrl($imagePath, $thumbSize, $type);
    }

    public static function verifMail($email) {

        $atom = '[-a-z0-9!#$%&\'*+\\/=?^_`{|}~]';   // caractères autorisés avant l'arobase
        $domain = '([a-z0-9]([-a-z0-9]*[a-z0-9]+)?)'; // caractères autorisés après l'arobase (nom de domaine)

        $regex = '/^' . $atom . '+' . // Une ou plusieurs fois les caractères autorisés avant l'arobase
                '(\.' . $atom . '+)*' . // Suivis par zéro point ou plus
                // séparés par des caractères autorisés avant l'arobase
                '@' . // Suivis d'un arobase
                '(' . $domain . '{1,63}\.)+' . // Suivis par 1 à 63 caractères autorisés pour le nom de domaine
                // séparés par des points
                $domain . '{2,63}$/i';          // Suivi de 2 à 63 caractères autorisés pour le nom de domaine
// test de l'adresse e-mail
        return (preg_match($regex, $email));
    }

}

