-- ----------------------------
-- Table structure for `#DBPREFIXadmin_users`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXadmin_users`;
CREATE TABLE `#DBPREFIXadmin_users` (
  `id_user` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `uid` varchar(128) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT NULL,
  `last_connexion` datetime DEFAULT NULL,
  `id_user_group` bigint(20) DEFAULT '1',
  `pass` varchar(128) DEFAULT NULL,
  `pass_salt` varchar(40) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `ip_address` char(50) DEFAULT NULL,
  `session_id` char(128) DEFAULT NULL,
  `connexion_timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of #DBPREFIXadmin_users
-- ----------------------------
-- ----------------------------
-- Table structure for `#DBPREFIXcontent`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXcontent`;
CREATE TABLE `#DBPREFIXcontent` (
  `id_content` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_rubrique` bigint(20) DEFAULT NULL,
  `data` longblob,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `version_id` bigint(20) DEFAULT NULL,
  `id_user` bigint(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `keywords` text,
  `description` text,
  `timelock` timestamp NULL DEFAULT NULL,
  `user_lock_uid` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id_content`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `#DBPREFIXhistory`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXhistory`;
CREATE TABLE `#DBPREFIXhistory` (
  `id_history` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_content` bigint(20) DEFAULT NULL,
  `version_id` bigint(20) DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `changes` blob,
  PRIMARY KEY (`id_history`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of #DBPREFIXhistory
-- ----------------------------

-- ----------------------------
-- Table structure for `#DBPREFIXmodules`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXmodules`;
CREATE TABLE `#DBPREFIXmodules` (
  `id_module` bigint(20) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(50) DEFAULT NULL,
  `id_site` bigint(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `pos` char(20) DEFAULT NULL,
  `items` varchar(255) DEFAULT NULL,
  `ordre` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_module`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `#DBPREFIXparams`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXparams`;
CREATE TABLE `#DBPREFIXparams` (
  `id_params` bigint(20) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `value` longtext,
  `module` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_params`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of #DBPREFIXparams
-- ----------------------------

-- ----------------------------
-- Table structure for `#DBPREFIXpublication`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXpublication`;
CREATE TABLE `#DBPREFIXpublication` (
  `id_publication` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_rubrique` bigint(20) DEFAULT NULL,
  `data` longblob,
  `publication_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `keywords` text,
  `description` text,
  `id_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_publication`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `#DBPREFIXrubrique`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXrubrique`;
CREATE TABLE `#DBPREFIXrubrique` (
  `id_rubrique` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `rub_order` int(11) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `id_template` bigint(20) DEFAULT NULL,
  `status` smallint(1) DEFAULT '0',
  `permalink` text NOT NULL,
  PRIMARY KEY (`id_rubrique`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `#DBPREFIXsites`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXsites`;
CREATE TABLE `#DBPREFIXsites` (
  `id_site` bigint(20) NOT NULL AUTO_INCREMENT,
  `site_name` varchar(50) DEFAULT NULL,
  `site_url` varchar(50) DEFAULT NULL,
  `site_logo` varchar(50) DEFAULT NULL,
  `media_dir` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_site`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `#DBPREFIXtemplateRef`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXtemplateRef`;
CREATE TABLE `#DBPREFIXtemplateRef` (
  `id_templateRef` bigint(20) NOT NULL AUTO_INCREMENT,
  `templateRef` char(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` char(20) DEFAULT NULL,
  `publiable` tinyint(1) DEFAULT '0',
  `callback` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_templateRef`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


INSERT INTO `#DBPREFIXtemplateRef` VALUES ('1', 'accueil', 'Page d\'accueil', 'folder', '1', '');
INSERT INTO `#DBPREFIXtemplateRef` VALUES ('2', 'rub', 'Rubrique', 'folder', '0', '');
INSERT INTO `#DBPREFIXtemplateRef` VALUES ('3', 'page', 'Page publique', 'page', '1', null);
INSERT INTO `#DBPREFIXtemplateRef` VALUES ('11', 'ssRub', 'Sous-Rubrique', 'folder', '1', null);
INSERT INTO `#DBPREFIXtemplateRef` VALUES ('29', 'contact', 'Formulaire de Contact', 'page', '1', '');

-- ----------------------------
-- Table structure for `#DBPREFIXtemplates`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXtemplates`;
CREATE TABLE `#DBPREFIXtemplates` (
  `id_template` bigint(20) NOT NULL AUTO_INCREMENT,
  `template_name` varchar(50) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `templateRef` char(20) DEFAULT NULL,
  `child_required` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_template`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `#DBPREFIXtemplate_fields`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXtemplate_fields`;
CREATE TABLE `#DBPREFIXtemplate_fields` (
  `id_field` bigint(20) NOT NULL AUTO_INCREMENT,
  `field_type` char(20) DEFAULT NULL,
  `compulsary` tinyint(1) DEFAULT '0',
  `templateRef` char(20) DEFAULT NULL,
  `extra_params` text,
  `label` char(50) DEFAULT NULL,
  `ordre` int(11) DEFAULT NULL,
  `field_name` char(20) DEFAULT NULL,
  PRIMARY KEY (`id_field`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('1', 'RichText', '1', 'accueil', '\"null\"', 'Edito', '0', 'edito');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('2', 'Text', '1', 'rub', '\"null\"', 'Titre', '0', 'titre');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('39', 'RichText', '1', 'ssRub', '\"null\"', 'Contenu', '1', 'content');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('49', 'ItemsMenu', '0', 'page', '{\"fields\":[{\"name\":\"title\",\"field_type\":\"text\",\"showCol\":\"1\",\"label\":\"Intitul&eacute;\",\"compulsary\":\"1\"},{\"name\":\"article\",\"field_type\":\"contentbrowser\",\"showCol\":\"1\",\"label\":\"Article\",\"compulsary\":\"1\"}]}', 'Articles connexes', '3', 'connexe');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('5', 'RichText', '1', 'page', '\"null\"', 'Contenu', '1', 'contenu');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('6', 'Text', '1', 'page', '\"null\"', 'Titre', '0', 'titre');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('38', 'Text', '1', 'ssRub', '\"null\"', 'Titre', '0', 'title');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('43', 'File', '0', 'ssRub', '{\"filter\":\"image\"}', 'Visuel', '2', 'visuel');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('44', 'File', '0', 'page', '{\"filter\":\"image\"}', 'Visuel', '2', 'visuel');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('45', 'ItemsMenu', '0', 'accueil', '{\"fields\":[{\"field_type\":\"text\",\"compulsary\":\"1\",\"label\":\"Titre\",\"showCol\":true,\"name\":\"title\"},{\"name\":\"visuel\",\"field_type\":\"file\",\"extra_params\":{\"filter\":\"image\"},\"compulsary\":\"0\",\"label\":\"Visuel\"},{\"field_type\":\"richtext\",\"width\":\"200\",\"extraParams\":{\"height\":\"100\"},\"compulsary\":\"0\",\"label\":\"Titre formatt&eacute;\",\"name\":\"ftitre\"},{\"field_type\":\"richtext\",\"width\":\"200\",\"extraParams\":{\"height\":\"100\"},\"compulsary\":\"1\",\"label\":\"Ch&acirc;peau\",\"name\":\"chapeau\"},{\"name\":\"link\",\"label\":\"Lien\",\"compulsary\":\"0\",\"field_type\":\"contentbrowser\"},{\"field_type\":\"text\",\"name\":\"css\",\"label\":\"Style Css\",\"compulsary\":\"0\"}]}', 'Actus', '1', 'actu');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('113', 'checkbox', '0', 'ssRub', '\"null\"', 'Acc&egrave;s priv&eacute;', '3', 'privateAccess');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('119', 'Text', '1', 'contact', '\"null\"', 'Titre', '0', 'titre');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('120', 'RichText', '0', 'contact', '\"null\"', 'Ch&acirc;peau', '1', 'chapeau');
INSERT INTO `#DBPREFIXtemplate_fields` VALUES ('121', 'ItemsMenu', '1', 'contact', '{\"fields\":[{\"field_type\":\"text\",\"compulsary\":\"1\",\"label\":\"Intitul&eacute\",\"name\":\"label\",\"showCol\":\"1\"},{\"field_type\":\"combo\",\"compulsary\":\"true\",\"label\":\"type\",\"name\":\"type\",\"extraParams\":[{\"value\":\"1\",\"label\":\"Champ texte\"},{\"value\":\"2\",\"label\":\"Email\"},{\"value\":\"3\",\"label\":\"Zone de texte\"},{\"value\":\"4\",\"label\":\"Liste de s&eacute;lection\"},{\"value\":\"6\",\"label\":\"Liste des pays\"},{\"value\":\"5\",\"label\":\"Case &agrave; cocher\"}]},{\"field_type\":\"textarea\",\"label\":\"Param&egrave;tres\",\"compulsary\":\"0\",\"name\":\"params\"},{\"field_type\":\"checkbox\",\"label\":\"Obligatoire\",\"compulsary\":\"0\",\"name\":\"obligatoire\"}]}', 'Formulaire', '2', 'form');


-- ----------------------------
-- Table structure for `#DBPREFIXusers_rights`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXusers_rights`;
CREATE TABLE `#DBPREFIXusers_rights` (
  `id_users_rights` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_user_group` bigint(20) DEFAULT NULL,
  `id_user` bigint(20) DEFAULT NULL,
  `module` char(50) DEFAULT NULL,
  `plugin` char(50) DEFAULT NULL,
  `rubId` bigint(20) DEFAULT NULL,
  `read` tinyint(4) DEFAULT NULL,
  `write` tinyint(4) DEFAULT NULL,
  `edit` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id_users_rights`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `#DBPREFIXuser_group`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXuser_group`;
CREATE TABLE `#DBPREFIXuser_group` (
  `id_user_group` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_name` char(50) DEFAULT NULL,
  `id_site` bigint(20) DEFAULT NULL,
  `superadmin` int(11) DEFAULT '0',
  PRIMARY KEY (`id_user_group`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
INSERT INTO `#DBPREFIXuser_group` VALUES ('1', 'Super Admin', '1', '1');

-- ----------------------------
-- Table structure for `#DBPREFIXversions`
-- ----------------------------
DROP TABLE IF EXISTS `#DBPREFIXversions`;
CREATE TABLE `#DBPREFIXversions` (
  `id_version_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_rub` bigint(20) DEFAULT NULL,
  `compteur` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_version_id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
