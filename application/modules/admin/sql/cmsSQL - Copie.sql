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
  `baliseTitle` varchar(255) NOT NULL,
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
  `baliseTitle` varchar(255) NOT NULL,
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
