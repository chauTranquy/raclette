-- ----------------------------
-- Procedure structure for `addOrModifyParam`
-- ----------------------------
DROP PROCEDURE IF EXISTS `addOrModifyParam`;
CREATE PROCEDURE `addOrModifyParam`(IN `id_param_IN` bigint,IN `key_IN` varchar(255),IN `value_IN` longtext, IN `module_IN` varchar(255))
BEGIN
	
	declare result integer default 0;
	declare id_param_out bigint default 0;

if(id_param_IN=0) then

select id_params into id_param_out from #DBPREFIXparams where `key`=key_IN;

if(id_param_out>0) then

set id_param_out =0;
set result=-1; #existe déjà

else

insert into #DBPREFIXparams (`key`, `value`, `module`) values (key_IN, value_IN, module_IN);
SELECT LAST_INSERT_ID() into id_param_out;
set result=1;

end if;
	

else

select id_params into id_param_out from #DBPREFIXparams where id_params = id_param_IN and `key` is not null;

if not (id_param_out is null) then
set result=-2;

else 
update #DBPREFIXparams set `value`=value_IN where id_params = id_param_IN;
set id_param_out = id_param_IN;
set result=1;
end if;
end if;

select id_param_out, result;

END
;;


-- ----------------------------
-- Procedure structure for `addOrModifyRub`
-- ----------------------------
DROP PROCEDURE IF EXISTS `addOrModifyRub`;

CREATE PROCEDURE `addOrModifyRub`(IN `title_IN` varchar (50),IN `id_rubrique_IN` bigint, `parent_id_IN` bigint,IN `id_template_IN` bigint,IN `ordre_IN` int, IN `originalId_IN` bigint, IN `userID_IN` bigint)
BEGIN

declare result bigint;
declare templateID bigint;
declare _data blob;
declare _keywords longtext;
declare _description longtext;

if(id_rubrique_IN=0) then

if(originalId_IN>0) then



select id_template into templateID from #DBPREFIXrubrique where id_rubrique = originalId_IN;
insert into #DBPREFIXrubrique (title, parent_id, rub_order, id_template) values(title_IN,parent_id_IN,ordre_IN,templateID);
select LAST_INSERT_ID() into result;

/*On récupère la dernière version du contenu
*/

select `data`, keywords, description into _data, _keywords, _description from #DBPREFIXcontent where id_rubrique = originalId_IN order by version_id desc limit 0,1;

insert into #DBPREFIXcontent (`data`, keywords, description, id_rubrique, version_id, creation_date, id_user) values(_data, _keywords, _description, result, 1, NOW(), userID_IN);

else
insert into #DBPREFIXrubrique (title, parent_id, rub_order, id_template) values(title_IN,parent_id_IN,ordre_IN,id_template_IN);
select LAST_INSERT_ID() into result;

insert into #DBPREFIXcontent (`data`, keywords, description, id_rubrique, version_id, creation_date, id_user) values(_data, _keywords, _description, result, 1, NOW(), userID_IN);

end if;
else

update #DBPREFIXrubrique set title=title_IN, update_date=CURDATE() where id_rubrique=id_rubrique_IN;

set result=id_rubrique_IN;

end if;
select result;

END
;;


-- ----------------------------
-- Procedure structure for `addOrModifyTemplateFields`
-- ----------------------------
DROP PROCEDURE IF EXISTS `addOrModifyTemplateFields`;

CREATE PROCEDURE `addOrModifyTemplateFields`(IN `id_field_IN` bigint,IN `field_type_IN` char(50),IN `compulsary_IN` char(50),IN `templateRef_IN` char(50),IN `label_IN` char(50),IN `ordre_IN` char(50),IN `field_name_IN` char(50),IN `extra_params_IN` text)
BEGIN
	
declare result bigint default 0;

if(id_field_IN<>0) then

select id_field into result from #DBPREFIXtemplate_fields where id_field=id_field_IN;

if(result=0) then
set result=id_field_IN;

else 

update #DBPREFIXtemplate_fields set field_type=field_type_IN, compulsary=compulsary_IN, templateRef=templateRef_IN, ordre = ordre_IN, field_name=field_name_IN, extra_params = extra_params_IN, label = label_IN where id_field=id_field_IN;
set result =id_field_IN;

end if;

else

insert into #DBPREFIXtemplate_fields (field_type, compulsary, templateRef, ordre , field_name, extra_params, label) values (field_type_IN, compulsary_IN, templateRef_IN, ordre_IN , field_name_IN, extra_params_IN, label_IN);
select LAST_INSERT_ID() into result;

end if;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `addOrModifyTemplateRef`
-- ----------------------------
DROP PROCEDURE IF EXISTS `addOrModifyTemplateRef`;

CREATE PROCEDURE `addOrModifyTemplateRef`(IN `id_templateRef_IN` bigint,IN `templateRef_IN` varchar(50),IN `description_IN` varchar(255),IN `type_IN` varchar(50), IN `publiable_IN` smallint, IN `callback_IN` varchar(100))
BEGIN
	
declare id_templateRef_OUT bigint default 0;
set id_templateRef_OUT  = id_templateRef_IN;

if(id_templateRef_IN=0) then
insert into #DBPREFIXtemplateRef (templateRef, description, type, publiable, callback) values(templateRef_IN, description_IN, type_IN, publiable_IN, callback_IN);

select  LAST_INSERT_ID() into id_templateRef_OUT;

else
update #DBPREFIXtemplateRef set description=description_IN, templateRef=templateRef_IN, type=type_IN, publiable = publiable_IN, callback=callback_IN where id_templateRef=id_templateRef_IN;

end if;

select id_templateRef_OUT ;

END
;;


-- ----------------------------
-- Procedure structure for `addOrModifyUserGroup`
-- ----------------------------
DROP PROCEDURE IF EXISTS `addOrModifyUserGroup`;
CREATE PROCEDURE `addOrModifyUserGroup`(IN  `id_user_group_IN` bigint,IN `group_name_IN` char(50),IN `id_site_IN` bigint)
BEGIN
	
declare isadmin bigint default 0;
declare result bigint default 0;

if(id_user_group_IN=0) then

insert into #DBPREFIXuser_group (group_name, id_site) values (group_name_IN, id_site_IN);
select LAST_INSERT_ID() into id_user_group_IN;

else




update #DBPREFIXuser_group set group_name=group_name_IN where id_user_group=id_user_group_IN;



end if;
select id_user_group_IN;

END
;;


-- ----------------------------
-- Procedure structure for `authenticateUser`
-- ----------------------------
DROP PROCEDURE IF EXISTS `authenticateUser`;
CREATE PROCEDURE `authenticateUser`(IN `login_IN` varchar(50),IN `passwordIN` varchar(50))
BEGIN
	#Routine body goes here...


select uid from #DBPREFIXadmin_users where email=login_IN and pass=passwordIN;

END
;;


-- ----------------------------
-- Procedure structure for `checkPermalink`
-- ----------------------------
DROP PROCEDURE IF EXISTS `checkPermalink`;
CREATE PROCEDURE `checkPermalink`(IN `id_article_IN` bigInt,IN `permalink_IN` text)
BEGIN
	
declare result bigint default 0;

select id_rubrique into result from #DBPREFIXrubrique where permalink=permalink_IN and id_rubrique<>id_article_IN;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `checkUserGroup`
-- ----------------------------
DROP PROCEDURE IF EXISTS `checkUserGroup`;
CREATE PROCEDURE `checkUserGroup`(IN `id_user_group_IN` bigint)
BEGIN
	
declare isadmin bigint default 0;
declare result bigint default 0;



select superadmin into isadmin from #DBPREFIXuser_group where id_user_group = id_user_group_IN;

select count(id_user) into result from #DBPREFIXadmin_users where id_user_group = id_user_group_IN;

if(isadmin=1 and result=1) then
set result = -1;
end if;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `deleteAdminElement`
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteAdminElement`;
CREATE PROCEDURE `deleteAdminElement`(IN `id_user_group_IN` bigint,IN `id_user_IN` bigint)
BEGIN
	
declare result tinyint default 0;
declare isadmin tinyint default 0;

if(id_user_group_IN>0) then



select id_user_group into result from #DBPREFIXuser_group where id_user_group=id_user_group_IN;

if(result=0) then

set result=-1;

else 



select count(id_user) into result from #DBPREFIXadmin_users where id_user_group=id_user_group_IN;

	if(result >0) then
	
set result = -2;
		
	else

		# on test si le groupe est super admin

		select superadmin into result from #DBPREFIXuser_group where id_user_group = id_user_group_IN;
			if(result>0) then
				set result = -3;
			else

			delete from #DBPREFIXuser_group where id_user_group=id_user_group_IN;
			delete from #DBPREFIXusers_rights where id_user_group=id_user_group_IN;

		end if;


	end if;

end if;

else #

	select A.superadmin, A.id_user_group  into isadmin, id_user_group_IN from #DBPREFIXuser_group A, #DBPREFIXadmin_users B where B.id_user = id_user_IN and A.id_user_group=B.id_user_group;
	
select count(id_user) into result from #DBPREFIXadmin_users where id_user_group = id_user_group_IN;
	

		if(result = 1 and isadmin>0) then
			
					set result =-4;
			
				
		else

delete from #DBPREFIXadmin_users where id_user=id_user_IN;
delete from #DBPREFIXusers_rights where id_user=id_user_IN;

set result =0;
		end if;


end if;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `deleteRub`
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteRub`;
CREATE PROCEDURE `deleteRub`(IN `id_rubrique_IN` bigint)
BEGIN


declare numChilds int;
declare result tinyint;

select count(id_rubrique) into numChilds from #DBPREFIXrubrique where parent_id=id_rubrique_IN;


if numChilds>0 then
set result=-1;
else
delete from #DBPREFIXrubrique where id_rubrique=id_rubrique_IN;
delete from #DBPREFIXcontent where id_rubrique=id_rubrique_IN;
set result = 1;
end if;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `deleteTemplate`
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteTemplate`;
CREATE PROCEDURE `deleteTemplate`(IN `id_template_IN` bigint)
BEGIN
	declare result bigint default 0;
	

select count(id_template) into result from #DBPREFIXtemplates where parent_id=id_template_IN;

if(result=0) then

select count(id_rubrique) into result from #DBPREFIXrubrique where id_template=id_template_IN;

if(result=0) then
delete from #DBPREFIXtemplates where id_template=id_template_IN;
else
set result=-1;
end if;

end if;

select result;


END
;;


-- ----------------------------
-- Procedure structure for `deleteTemplateFields`
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteTemplateFields`;
CREATE PROCEDURE `deleteTemplateFields`(IN `id_field_IN` bigint)
BEGIN

declare result bigint default 1;
	
delete from #DBPREFIXtemplate_fields where id_field=id_field_IN;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `deleteTemplateRef`
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteTemplateRef`;
CREATE PROCEDURE `deleteTemplateRef`(IN `id_templateRef_IN` bigint)
BEGIN
	declare result bigint default 0;
declare template_name char(50);

select count(A.id_template) into result from #DBPREFIXtemplates A, #DBPREFIXtemplateRef B where A.templateRef=B.templateRef and B.id_templateRef=id_templateRef_IN;
select templateRef into template_name from #DBPREFIXtemplateRef where id_templateRef=id_templateRef_IN;

if(result=0) then



delete from #DBPREFIXtemplateRef where id_templateRef=id_templateRef_IN;
delete from #DBPREFIXtemplate_fields where templateRef=template_name;

end if;

select result;


END
;;


-- ----------------------------
-- Procedure structure for `deleteVersion`
-- ----------------------------
DROP PROCEDURE IF EXISTS `deleteVersion`;
CREATE PROCEDURE `deleteVersion`(IN `version_id_IN` bigint)
BEGIN
	#Routine body goes here...

declare result tinyint default 0;
declare statusCheck tinyint default 0;
declare countVersion bigint default 0;
declare id_rub bigint;
declare versionID bigint;

select id_rubrique, `status`, version_id into id_rub, statusCheck, versionID from #DBPREFIXcontent where id_content=version_id_IN;

select count(id_content) into countVersion from #DBPREFIXcontent where id_rubrique=id_rub;

if(countVersion=1) then
set result =-1;
elseif statusCheck=1 then

set result =-2;
else 

delete from #DBPREFIXcontent where id_content=version_id_IN;

set result=1;

end if;
select result, countVersion, versionID;

END
;;


-- ----------------------------
-- Procedure structure for `findRubByPermalink`
-- ----------------------------
DROP PROCEDURE IF EXISTS `findRubByPermalink`;
CREATE PROCEDURE `findRubByPermalink`(IN `permalink_IN` longtext, IN `isOnline_IN` int)
BEGIN

declare result longtext;

if(isOnline_IN=0) then

select id_rubrique into result from #DBPREFIXrubrique where permalink = permalink_IN;

else


select id_rubrique into result from #DBPREFIXrubrique where permalink = permalink_IN and status=1;

end if;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `getAdminUserDetail`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getAdminUserDetail`;
CREATE PROCEDURE `getAdminUserDetail`(IN `uid_IN` varchar(128), IN `email_IN` varchar(128))
BEGIN
	#Routine body goes here...


if uid_IN<>'' then
select A.*, B.superadmin from #DBPREFIXadmin_users A, #DBPREFIXuser_group B where A.uid=uid_IN and B.id_user_group=A.id_user_group ;
else

select A.*, B.superadmin from #DBPREFIXadmin_users A, #DBPREFIXuser_group B WHERE A.email=email_IN and A.id_user_group=B.id_user_group;
end if;


END
;;


-- ----------------------------
-- Procedure structure for `getAdminUsers`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getAdminUsers`;
CREATE PROCEDURE `getAdminUsers`(IN `id_user_group_IN` bigint)
BEGIN

select firstname, lastname, email, id_user, last_connexion, creation_date, active from #DBPREFIXadmin_users where id_user_group=id_user_group_IN;

END
;;


-- ----------------------------
-- Procedure structure for `getArbo`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getArbo`;
CREATE PROCEDURE `getArbo`(IN `idRub_IN` bigint, IN active_IN tinyint)
BEGIN
	#Routine body goes here...
Declare outvalue int;

set outvalue=active_IN; 

if active_IN=0 then

select distinct(A.id_rubrique), A.*, C.type, B.templateRef, C.callback from #DBPREFIXrubrique A, #DBPREFIXtemplates B, #DBPREFIXtemplateRef C where A.parent_id=idRub_IN and A.id_template=B.id_template and C.templateRef=B.templateRef order by A.rub_order asc;

else

select distinct(A.id_rubrique),A.*, C.type, B.templateRef from #DBPREFIXrubrique A, #DBPREFIXtemplates B, #DBPREFIXtemplateRef C  where A.parent_id=idRub_IN and A.id_template=B.id_template AND A.`status` = active_IN and C.templateRef=B.templateRef order by A.rub_order asc;

end if;


END
;;


-- ----------------------------
-- Procedure structure for `getContentdata`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getContentdata`;
CREATE PROCEDURE `getContentdata`(IN `id_element_IN` bigint, IN `version_id_IN` bigint)
BEGIN
	#Routine body goes here...

declare inline_version_id bigint default null;

if(version_id_IN=0) then
select A.id_content ,A.keywords,A.description, A.id_rubrique ,A.baliseTitle ,A.`data` , A.creation_date,C.templateRef, A.update_date, A.version_id , A.`status`,MINUTE(TIMEDIFF(NOW(),A.timelock))+HOUR(TIMEDIFF(NOW(),A.timelock))*60 as timelock,A.user_lock_uid, CONCAT_WS(' ',B.firstname, B.lastname) as userName,(select version_id from #DBPREFIXcontent where `status`=1 and id_rubrique=id_element_IN limit 0,1) as inline_version, (select publication_date from #DBPREFIXpublication where id_rubrique=id_element_IN limit 0,1) as publication_date from #DBPREFIXcontent A,#DBPREFIXadmin_users B, #DBPREFIXtemplates C, #DBPREFIXrubrique D where A.id_rubrique=id_element_IN and A.id_rubrique=D.id_rubrique  and C.id_template=D.id_template and A.id_user = B.id_user order by A.version_id desc limit 0,1;
else

select A.id_content ,A.keywords,A.description, A.id_rubrique ,A.baliseTitle ,A.`data` , A.creation_date,C.templateRef, A.update_date, A.version_id , A.`status`,MINUTE(TIMEDIFF(NOW(),A.timelock))+HOUR(TIMEDIFF(NOW(),A.timelock))*60 as timelock,A.user_lock_uid,CONCAT_WS(' ',B.firstname, B.lastname) as userName,(select version_id from #DBPREFIXcontent where `status`=1 and id_rubrique=id_element_IN limit 0,1) as inline_version, (select publication_date from #DBPREFIXpublication where id_rubrique=id_element_IN limit 0,1) as publication_date from #DBPREFIXcontent A,#DBPREFIXadmin_users B, #DBPREFIXtemplates C, #DBPREFIXrubrique D where A.id_rubrique=id_element_IN and A.id_rubrique=D.id_rubrique and C.id_template=D.id_template and A.version_id=version_id_IN and A.id_user = B.id_user order by version_id desc limit 0,1;

end if;

END
;;


-- ----------------------------
-- Procedure structure for `getMedia`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getMedia`;
CREATE PROCEDURE `getMedia`(IN `path_IN` varchar(255))
BEGIN
	
	select count(id_content) as nbre from #DBPREFIXcontent where `data` like CONCAT('%',path_IN,'%');

END
;;


-- ----------------------------
-- Procedure structure for `getParam`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getParam`;
CREATE PROCEDURE `getParam`(IN `key_IN` varchar(255),IN `id_params_IN` bigint)
BEGIN

	#Routine body goes here...
	

END
;;


-- ----------------------------
-- Procedure structure for `getParentRub`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getParentRub`;
CREATE PROCEDURE `getParentRub`(IN `id_rub_IN` bigint)
BEGIN
	#Routine body goes here...

declare parent_id_OUT bigint default 0;

select parent_id into parent_id_OUT from #DBPREFIXrubrique where id_rubrique = id_rub_IN;
select parent_id_OUT;

END
;;


-- ----------------------------
-- Procedure structure for `getPermalink`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getPermalink`;
CREATE PROCEDURE `getPermalink`(IN `id_rubrique_IN` bigint, IN `isOnline_IN` int)
BEGIN

declare result longtext;

if(isOnline_IN=0) then

select permalink into result from #DBPREFIXrubrique where id_rubrique = id_rubrique_IN;

else

select permalink into result from #DBPREFIXrubrique where id_rubrique = id_rubrique_IN and status=1;

end if;

select result;

END
;;


-- ----------------------------
-- Procedure structure for `getRoots`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getRoots`;
CREATE PROCEDURE `getRoots`()
BEGIN
	select id_rubrique, title from #DBPREFIXrubrique where parent_id<=0 order by parent_id desc;

END
;;


-- ----------------------------
-- Procedure structure for `getRubByTemplateRef`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getRubByTemplateRef`;
CREATE PROCEDURE `getRubByTemplateRef`(IN `templateRef_IN` varchar(255), IN `online_IN` tinyint)
BEGIN
	#Routine body goes here...

if online_IN=1 then

select A.id_rubrique FROM #DBPREFIXrubrique A, #DBPREFIXtemplates B where A.id_template = B.id_template AND B.templateRef = templateRef_IN and A.status=1;

else

select  A.id_rubrique FROM #DBPREFIXrubrique A, #DBPREFIXtemplates B where A.id_template = B.id_template AND B.templateRef = templateRef_IN; 
end if;


END
;;


-- ----------------------------
-- Procedure structure for `getRubContent`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getRubContent`;
CREATE PROCEDURE `getRubContent`(IN `id_rubrique_IN` bigint)
BEGIN
	#Routine body goes here...

select A.`data`,A.keywords, A.description,A.baliseTitle ,A.id_rubrique, B.templateRef, D.publiable, C.title, B.child_required from #DBPREFIXpublication A, #DBPREFIXrubrique C, #DBPREFIXtemplates B, #DBPREFIXtemplateRef D where A.id_rubrique=id_rubrique_IN and C.`status`=1 and B.id_template=C.id_template and B.templateRef=D.templateRef and C.id_rubrique=A.id_rubrique;

END
;;


-- ----------------------------
-- Procedure structure for `getRubDetail`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getRubDetail`;
CREATE PROCEDURE `getRubDetail`(IN `id_rubrique_IN` bigint)
BEGIN
	#Routine body goes here...


select A.*, B.templateRef,C.callback, C.type from #DBPREFIXrubrique A, #DBPREFIXtemplates B, #DBPREFIXtemplateRef C where A.id_rubrique=id_rubrique_IN and A.id_template=B.id_template and B.templateRef=C.templateRef;



END
;;


-- ----------------------------
-- Procedure structure for `getSiteList`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getSiteList`;
CREATE PROCEDURE `getSiteList`()
BEGIN
	
select * from #DBPREFIXsites order by site_name ASC;

END
;;


-- ----------------------------
-- Procedure structure for `getSiteModules`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getSiteModules`;
CREATE PROCEDURE `getSiteModules`(IN `id_site_IN` bigint,IN `active_IN` tinyint)
BEGIN
	
if(active_IN=1) then

select id_module, module_name, active, pos, items from #DBPREFIXmodules where id_site=id_site_IN and active=1 order by ordre asc;

else

select id_module, module_name, active, pos, items from #DBPREFIXmodules where id_site=id_site_IN;

end if;

END
;;


-- ----------------------------
-- Procedure structure for `getTemplateData`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getTemplateData`;
CREATE PROCEDURE `getTemplateData`(IN `id_template_IN` bigint)
BEGIN
	
select A.*, B.type, B.description, B.publiable, B.callback  from #DBPREFIXtemplates A, #DBPREFIXtemplateRef B where A.templateRef=B.templateRef and A.id_template=id_template_IN;

END
;;


-- ----------------------------
-- Procedure structure for `getTemplateFields`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getTemplateFields`;
CREATE PROCEDURE `getTemplateFields`(IN `templateRef_IN` varchar(20))
BEGIN
	#Routine body goes here...

select * from #DBPREFIXtemplate_fields where templateRef=templateRef_IN order by ordre ASC;

END
;;


-- ----------------------------
-- Procedure structure for `getTemplateRefList`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getTemplateRefList`;
CREATE PROCEDURE `getTemplateRefList`()
BEGIN


select A.templateRef as tplRef, A.*, (select count(field_type) from #DBPREFIXtemplate_fields where templateRef=tplRef) as numFields from #DBPREFIXtemplateRef A group by A.templateRef order by A.templateRef asc;

END
;;


-- ----------------------------
-- Procedure structure for `getUserGroup`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getUserGroup`;
CREATE PROCEDURE `getUserGroup`(IN `id_site_IN` bigint)
BEGIN
	

select * from #DBPREFIXuser_group where id_site=id_site_IN;

END
;;


-- ----------------------------
-- Procedure structure for `getVersionId`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getVersionId`;
CREATE PROCEDURE `getVersionId`(IN `id_rub_IN` bigint, IN `update_IN` bigint)
BEGIN
	#Routine body goes here...

declare version_id_OUT bigint default 0;

select compteur into version_id_OUT from #DBPREFIXversions where id_rub = id_rub_IN;

if version_id_OUT =0 then

insert into #DBPREFIXversions (id_rub, compteur) values (id_rub_IN, 1);
set version_id_OUT=1;

end if;

if(update_IN=1) then

update #DBPREFIXversions set compteur=compteur+1 where id_rub = id_rub_IN;

set version_id_OUT=version_id_OUT+1;

end if;

select version_id_OUT;

END
;;


-- ----------------------------
-- Procedure structure for `getVersionsList`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getVersionsList`;
CREATE PROCEDURE `getVersionsList`(IN `id_rubrique_IN` bigint)
BEGIN
	
	select A.creation_date, A.update_date, A.version_id, A.`status`, A.id_content, CONCAT_WS(' ',B.firstname, B.lastname) as userName from #DBPREFIXcontent A,#DBPREFIXadmin_users B where A.id_rubrique=id_rubrique_IN and A.id_user=B.id_user order by A.version_id asc;


END
;;


-- ----------------------------
-- Procedure structure for `loadUsersRights`
-- ----------------------------
DROP PROCEDURE IF EXISTS `loadUsersRights`;
CREATE PROCEDURE `loadUsersRights`(IN `id_user_group_IN` bigint,IN `id_user_IN` bigint)
BEGIN
	
declare result bigint default 0;
if(id_user_IN>0) then

	select count(id_users_rights) into result from #DBPREFIXusers_rights where id_user=id_user_IN and id_user_group=id_user_group_IN;

if(result>0) then

select module, `plugin`, rubId, `read`, `write`, edit  from #DBPREFIXusers_rights where id_user=id_user_IN and id_user_group=id_user_group_IN;


end if;

end if;
	

if(result=0) then

select module, `plugin`, rubId, `read`, `write`, edit  from #DBPREFIXusers_rights where id_user_group=id_user_group_IN and id_user=0;

end if;
	

END
;;


-- ----------------------------
-- Procedure structure for `lockContent`
-- ----------------------------
DROP PROCEDURE IF EXISTS `lockContent`;
CREATE PROCEDURE `lockContent`(IN `id_content_IN` bigint,IN `uid_IN` varchar (128))
BEGIN
	#Routine body goes here...

update #DBPREFIXcontent set timelock=NOW(), user_lock_uid=uid_IN where id_content = id_content_IN;

END
;;


-- ----------------------------
-- Procedure structure for `moveRub`
-- ----------------------------
DROP PROCEDURE IF EXISTS `moveRub`;
CREATE PROCEDURE `moveRub`(IN `ordre_IN` bigint,IN `parent_id_IN` bigint,IN `id_rubrique_IN` bigint)
BEGIN
update #DBPREFIXrubrique set rub_order=ordre_IN, parent_id=parent_id_IN where id_rubrique=id_rubrique_IN;

END
;;


-- ----------------------------
-- Procedure structure for `publishElement`
-- ----------------------------
DROP PROCEDURE IF EXISTS `publishElement`;
CREATE PROCEDURE `publishElement`(IN `id_element_IN` bigint,IN `version_id_IN` bigint, IN `status_IN`  smallint, IN `id_user_IN`  bigint)
BEGIN
	#remise à 0 des statuts des versions
declare publication_id bigint default 0;
declare data_in longtext;
declare keywords_in longtext;
declare description_in longtext;
declare baliseTitle_in longtext;

update #DBPREFIXcontent set `status`=0 where id_rubrique=id_element_IN and `status`=1;



update #DBPREFIXcontent set `status`=status_IN where id_rubrique=id_element_IN and version_id=version_id_IN;
update #DBPREFIXrubrique set `status`=status_IN where id_rubrique=id_element_IN;



select id_publication into publication_id from #DBPREFIXpublication  where id_rubrique =id_element_IN;



if status_IN=0 and publication_id > 0 then

delete from #DBPREFIXpublication  where id_publication=publication_id;

elseif status_IN=1 then

select `data`, keywords, description, baliseTitle into data_in, keywords_in, description_in, baliseTitle_in from #DBPREFIXcontent where id_rubrique=id_element_IN and version_id=version_id_IN;

	if(publication_id=0) then
		
insert into #DBPREFIXpublication (id_rubrique,`data`, publication_date, description, keywords,baliseTitle, id_user) values (id_element_IN, data_in, CURRENT_TIMESTAMP, keywords_in, description_in, id_user_IN, baliseTitle_in);

	else

update #DBPREFIXpublication set id_user=id_user_IN,`data`=data_in, publication_date=CURRENT_TIMESTAMP, keywords=keywords_in, baliseTitle=baliseTitle_in, description=description_in where id_publication = publication_id;

	end if;

end if;
	


END
;;


-- ----------------------------
-- Procedure structure for `unlockUserElement`
-- ----------------------------
DROP PROCEDURE IF EXISTS `unlockUserElement`;
CREATE PROCEDURE `unlockUserElement`(IN `uid_IN` varchar(128))
BEGIN
	update #DBPREFIXcontent set user_lock_uid=null, timelock=null where user_lock_uid=uid_IN;

END
;;


-- ----------------------------
-- Procedure structure for `updateTemplateOrder`
-- ----------------------------
DROP PROCEDURE IF EXISTS `updateTemplateOrder`;
CREATE PROCEDURE `updateTemplateOrder`(IN `parent_id_IN` bigint,IN `id_template_IN` bigint)
BEGIN

	update #DBPREFIXtemplates set parent_id=parent_id_IN where id_template=id_template_IN;

END
;;


-- ----------------------------
-- Procedure structure for `updateUsersRights`
-- ----------------------------
DROP PROCEDURE IF EXISTS `updateUsersRights`;
CREATE PROCEDURE `updateUsersRights`(IN `id_user_group_IN` bigint,IN `id_user_IN` bigint,IN `module_IN` char(50),IN `plugin_IN` char(50),IN `rubId_IN` bigint,IN `read_IN` tinyint,IN `write_IN` tinyint,IN `edit_IN` tinyint)
BEGIN
declare idRights bigint default 0;	

select id_users_rights into idRights from #DBPREFIXusers_rights where module=module_IN and `plugin` = plugin_IN and rubId=rubId_In and id_user_group=id_user_group_IN and id_user=id_user_IN;

	if(idRights=0) then
	
insert into #DBPREFIXusers_rights (module, `plugin` , rubId, id_user_group, id_user, `read`, `write`, edit) values (module_IN, `plugin_IN` , rubId_IN, id_user_group_IN, id_user_IN, `read_IN`, `write_IN`, edit_IN);

else 
update #DBPREFIXusers_rights set `read`=read_IN, `write`= write_IN, edit=edit_IN where id_users_rights=idRights;

end if;

select idRights;
END
;;


