<?php

class Cmsmodules_Model_RecetteMapper extends Cmsmodules_Model_Mapper {

    public $_tableName = "Recette";

    public function insertRecette($recetteNomPersonne, $recettePrenomPersonne, $email, $recetteTitle, $ingredients, $recette, $visuelUrl, $condition, $infoCom) {


        $this->execQuery("INSERT INTO cms_ajoutezVotreRecette (recetteNomPersonne, recettePrenomPersonne, email, recetteTitle, ingredients, recette, visuelUrl, cms_ajoutezVotreRecette.condition, infoCom) VALUES (?,?,?,?,?,?,?,?,?)", array($recetteNomPersonne, $recettePrenomPersonne, $email, $recetteTitle, $ingredients, $recette, $visuelUrl, $condition, $infoCom));
    }

    public function fetchAllClient() {

        $sql = "select * from cms_ajoutezVotreRecette";
        $result = $this->execQuery($sql, array());
        return $result;
    }

    public function addOrModifySelection($ids, $statut = 0) {

        $arrayIDs = explode('|', $ids);

        foreach ($arrayIDs as $id)
            parent::addData(array('id_ajoutRecette' => $id, 'statut' => $statut));


        return array("success" => true);
    }

    public function removeRecette($ids) {

        $arrayIDs = explode('|', $ids);

        foreach ($arrayIDs as $id)
            parent::delete($id);

        return array("success" => true);
    }

    public function addOrModify($email, $recetteTitle, $ingredients, $recette, $visuelUrl, $id_ajoutRecette, $typeRecetteListe, $condition = 0, $statut = 0, $recetteNomPersonne = " ", $recettePrenomPersonne = " ", $infoCom = 0) {
        if ($id_ajoutRecette != null):

            $initialData = $this->execQuery("select * from cms_ajoutezVotreRecette where id_ajoutRecette = ? ", array($id_ajoutRecette), 1);

            if ($initialData->statut != $statut):

                $config = Zend_registry::get('config');
                $mail = new Admin_Model_SendMail();

                $to = $initialData->email;
                $subject = "[" . $config->jeu->nom . "] Votre recette \"" . $recetteTitle . "\" " . ($statut == 1 ? " a été validée" : " a été refusée");

                $msg = '<p style="font-size:16px; color:#537224; font-family:Verdana, Arial;"><strong style="font-weight:bold;font-size:18px; color:#537224;font-family:Verdana, Arial;">' .
                        "Bonjour " . utf8_decode($recetteNomPersonne . " " . $recettePrenomPersonne) . ",</strong><br />";

                if ($statut == 1)
                    $msg.="Nous avons le plaisir de vous annoncer que votre recette<br /><strong " . 'style="color:#537224;font-weight:bold;"' . ">\"" . utf8_decode($recetteTitle) . "\"</strong> a retenu notre attention, et qu'elle est d&eacute;sormais publi&eacute;e ! merci et &agrave; bient&ocirc;t sur Glutabye !</p>";
                /* 	<br />Vous gagnerez peut-&ecirc;tre <strong>1 week-end gastronomique pour 2 personnes au Clos des Sens </strong> ou l'un des autres cadeaux mis en jeu<br /><br />
                  N'h&eacute;sitez pas &agrave; nous proposer de nouvelles recettes &agrave; base de Tomme de Savoie !
                  <br /><br />Vous souhaitant bonne chance,"; */
                if ($statut == 2)
                    $msg.="Nous avons le regret de vous annoncer que votre recette<br /><strong " . 'style="color:#537224;font-weight:bold;"' . ">\""
                            . utf8_decode($recetteTitle) . "\"</strong><br /> n'a pas &eacute;t&eacute; valid&eacute;e.<br /><br />";
//    		Retentez votre chance, <strong ".'style="color:#537224;font-weight:bold;"'.">n'h&eacute;sitez pas &agrave; nous proposer de nouvelles recettes Pommes et Poires de Savoie</strong> !<br />";
                if ($statut == 1 || $statut == 2)
                    $mail->sendMail($to, $msg, $subject);

            endif;
        endif;
        $infoCom = intval($infoCom);
        $id_ajoutRecette = intval($id_ajoutRecette);
        $condition = intval($condition);

        $initialData = $this->execQuery("select * from cms_ajoutezVotreRecette where id_ajoutRecette = ? ", array($id_ajoutRecette), 1);
        $id = ($initialData ? $id_ajoutRecette : 0);
        parent::addData(array("recetteNomPersonne" => $recetteNomPersonne, "recettePrenomPersonne" => $recettePrenomPersonne, "typeRecetteListe" => $typeRecetteListe, "email" => $email, "recetteTitle" => $recetteTitle, "ingredients" => $ingredients, "recette" => $recette, "visuelUrl" => $visuelUrl, "condition" => $condition, "infoCom" => $infoCom, "id_ajoutRecette" => $id, "statut" => $statut));

        $returnObj = array("success" => true, "responseText" => " ");
        return ($returnObj);
    }

    public static function getTypeList() {

        $site = Zend_Registry::get('site');

        $arbo = new Admin_Model_ArboMapper();

        $rubRecette = $arbo->getRubByTemplateRef('ssrubrecettes', 1, $site->id_site);

        $arrayTypeRecette = array();

        foreach ($rubRecette as $rub):

            array_push($arrayTypeRecette, array('id_rubrique' => $rub->id_rubrique, 'titre' => $rub->title));



        endforeach;

        return $arrayTypeRecette;
    }

    public static function getAllTypeList() {


        $arbo = new Admin_Model_ArboMapper();
        $arrayTypeRecette = array();



        for ($i = 1; $i < 3; $i++) {
            $rubRecette = $arbo->getRubByTemplateRef('ssrubrecettes', 1, $i);
            foreach ($rubRecette as $rub):
                array_push($arrayTypeRecette, array('id_rubrique' => $rub->id_rubrique, 'titre' => $rub->title));
            endforeach;
        }
        return $arrayTypeRecette;
    }

}

