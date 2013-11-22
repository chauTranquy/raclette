Ext
		.define(
				'TextoCMS.controller.siteadmin.SiteAdminController',
				{
					description : 'Administration du site',
					extend : 'TextoCMS.controller.BaseController',
					views : [
							'TextoCMS.view.siteadmin.SiteAdminTab',
							'TextoCMS.view.siteadmin.UserAdminTab',
							'TextoCMS.view.siteadmin.userAdminViews.UserForm',
							'TextoCMS.view.siteadmin.userAdminViews.GroupForm',
							'TextoCMS.view.siteadmin.TemplateAdminTab',
							'TextoCMS.view.siteadmin.templatesAdminViews.TemplatesTreeForm',
							'TextoCMS.view.siteadmin.templatesAdminViews.GridTemplatesForm',
							'TextoCMS.view.siteadmin.templatesAdminViews.TemplatesForm',
							'TextoCMS.view.siteadmin.userAdminViews.GridRights',
							'TextoCMS.view.siteadmin.siteParamsTab.siteParamsTab',
							'TextoCMS.view.siteadmin.siteParamsTab.SiteParamsForm',
							'TextoCMS.view.siteadmin.siteParamsTab.JsCssFilesForm',
							'siteadmin.siteParamsTab.GoogleAnalyticsForm' ],
					stores : [ 'TextoCMS.store.siteadmin.UserGroupStore',
							'TextoCMS.store.siteadmin.TemplatesTreeStore',
							'TextoCMS.store.siteadmin.TemplatesRefStore',
							'TextoCMS.store.siteadmin.TemplatesStore',
							'TextoCMS.store.siteadmin.RightsStore' ],
					activeTab : 0,
					refs : [ {
						ref : 'tab',
						selector : 'siteadmintab'
					}, {
						ref : 'siteparamsform',
						selector : 'siteparamsform'
					}, {
						ref : 'siteparams',
						selector : 'siteparams'
					}, {
						ref : 'usergrid',
						selector : 'useradmintab'
					}, {
						ref : 'adminuserform',
						selector : 'adminuserform'
					}, {
						ref : 'admingroupform',
						selector : 'admingroupform'
					}, {
						ref : 'templatestree',
						selector : 'templatestree'
					}, {
						ref : 'templatestreeform',
						selector : 'templatestreeform'
					}, {
						ref : 'addFolder',
						selector : 'templatestree [iconCls=addFolder]'
					}, {
						ref : 'gridtemplates',
						selector : 'gridtemplates'
					}, {
						ref : 'gridtemplatescenterpanel',
						selector : 'gridtemplatespanel [region=center]'
					}, {
						ref : 'gridtemplatesform',
						selector : 'gridtemplatesform'
					}, {
						ref : 'gridtemplatesfields',
						selector : 'gridtemplatesfields'
					}, {
						ref : 'templatesform',
						selector : 'templatesform'
					}, {
						ref : 'gridrights',
						selector : 'gridrights'
					}, {
						ref : 'jscssform',
						selector : 'jscssform'
					}, {
						ref : 'refreshButton',
						selector : 'templatestree button[iconCls="refreshBtn"]'
					}, {
						ref : 'GoogleAnalyticsForm',
						selector : 'GoogleAnalyticsForm'
					} ],
					init : function() {
						this.defaultView = "siteadmintab";
						this
								.control({
									'siteadmintab actioncolumn' : {
										click : this.getTabAction
									},
									'button[iconCls=addUserBtn]' : {
										click : this.addUser
									},
									'button[iconCls=addUserGroupBtn]' : {
										click : this.addGroup
									},
									'adminuserform, admingroupform, templatestreeform, templatesform' : {
										validitychange : this.checkForm,
										dirtychange : this.checkDirty
									},
									'adminuserform button[action=submit]' : {
										click : this.saveUser
									},
									'admingroupform button[action=submit]' : {
										click : this.saveGroup
									},
									'templatestree' : {
										itemmove : this.moveNode
									// activate:this.loadTemplatesTreeStore
									},
									'templatestree actioncolumn' : {
										click : this.getTemplatesTabAction
									},
									'templatestree dataview' : {

										beforedrop : this.templatesTreebeforeDrop,
										itemclick : function() {
											this.getAddFolder().setDisabled(
													false);
										}.bind(this)

									},
									'templatestree [iconCls=addMainFolder], templatestree [iconCls=addFolder]' : {
										click : this.openAddTemplatesTreeForm

									},
									'templatestreeform [action=submit]' : {
										click : this.saveTemplatesTreesForm

									},
									'gridtemplatesform' : {
										dirtychange : this.checkgridTemplatesFormDirty,
										validitychange : this.checkgridTemplatesFormValidity

									},
									'gridtemplatesform textfield[name=templateRef]' : {
										change : this.templatesFieldsStoreDataChanged
									},
									'gridtemplates [iconCls=addBtn]' : {
										click : this.addTemplate
									},
									'gridtemplates actioncolumn' : {
										click : this.getTemplatesAction
									},
									'gridtemplatesfields actioncolumn' : {
										click : this.getGridTemplatesFieldsAction
									},

									'gridtemplatesfields [iconCls=addBtn]' : {
										click : Ext
												.bind(
														this.getGridTemplatesFieldsAction,
														this, [ null, null,
																null, null,
																null ])

									},
									'gridtemplatesform [iconCls=saveBtn]' : {
										click : this.addOrModifyTemplate
									},
									'templatesform [action=submit]' : {
										click : this.updateTemplatesRecord
									},
									'gridrights checkcolumn' : {
										'checkchange' : this.rightsCheckChange

									},
									'gridrights button[action=submit]' : {
										click : this.saveGridRights
									},
									'siteparamsform, jscssform, GoogleAnalyticsForm' : {
										dirtychange : this.checkSiteParamsFormDirty,
										validitychange : this.checkSiteParamsFormValidity
									},
									'siteparamsform' : {

										afterrender : this.loadSiteParams
									},
									'siteparamsform button[action=refresh], GoogleAnalyticsForm button[action=refresh]' : {
										click : this.refreshForm
									},
									'siteparamsform button[action=save]' : {
										click : this.saveSiteParamsForm
									},
									'jscssform button[action=save]' : {
										click : this.saveFilesParamsForm
									},
									'jscssform itemsmenu' : {
										openformevent : this.filesFormOpened

									},
									'form combofield[name=type]' : {
										change : this.changeJsCssForm

									},
									'form file textfield[name=url], form [name=urlFile]' : {

										change : this.changeFileUrlValue

									},
									'templatestree button[iconCls="refreshBtn"]' : {
										click : this.loadTemplatesTreeStore

									},
									'GoogleAnalyticsForm checkbox[name=googleActivated]' : {
										change : this.activateGoogleForm

									},
									'GoogleAnalyticsForm [iconCls=saveBtn]' : {
										click : this.saveGoogleForm
									}
									

								});
						this.callParent(arguments);
						this.getTemplatesRefStore();
						this.getTemplatesStore();

					},
					initController : function() {
						this.getTab().removeAll(true);


						this.getTab().add({
							xtype : 'siteparams'
						}, {
							xtype : 'useradmintab'
						}, {
							xtype : 'templateadmintab'
						}, {
							title : 'R&eacute;pertoires et fichiers'

						});
						this.getTab().setActiveTab(0);
						this.loadSiteParams();
						Ext.getStore('TemplatesTreeStore').model.getProxy()
								.setExtraParam('id_site', TextoCMS.siteId);
						Ext.getStore('TemplatesTreeStore').load();
						Ext.getCmp('JsCssFilesForm').callAjax();

					},

					/**
					 * Traite le clique sur les boutons d'actions et dispatch
					 * vers les fonctions correspondates
					 * 
					 * @param view
					 * @param cel
					 * @param row
					 * @param rowIndex
					 * @param e
					 * @returns function
					 */
					getTabAction : function(view, cel, row, rowIndex, e) {
						var target = e.target;

						var rec = this.getUsergrid().getView().getStore()
								.getAt(row);

						if (target.hasClassName('actionGroup')) {
							if (target.hasClassName('rights')
									&& rec.get('superadmin') != 1)
								this.openGridRights(rec);
							else if (target.hasClassName('edit'))
								this.openGroupForm(rec);
							else if (target.hasClassName('delete'))
								this.confirmDeleteUserOrGroup(rec);
							return;

						}

						if (target.hasClassName('rights')
								&& rec.get('superadmin') != 1)
							this.openGridRights(rec);
						else if (target.hasClassName('edit'))
							return this.openUserForm(rec);
						else if (target.hasClassName('delete'))
							return this.confirmDeleteUserOrGroup(rec);

					},
					/**
					 * 
					 * @returns
					 */
					addGroup : function() {
						var record = Ext.ModelManager.create({
							id_user_group : 0
						}, 'TextoCMS.model.siteadmin.AdminUserModel');
						return this.openGroupForm(record);

					},
					/**
					 * Ouvre le formulaire de cr�ation/modification d'un group
					 * 
					 * @param rec
					 */
					openGroupForm : function(record) {
						var groupForm = {
							xtype : 'admingroupform',
							record : record
						};

						Ext
								.create(
										'Ext.window.Window',
										{
											title : record.get('id_user_group') > 0 ? 'Modification du groupe '
													+ record.get('group_name')
													: 'Nouveau groupe',
											modal : true,
											width : 350,
											items : [ groupForm ]
										}).show();

					},
					/**
					 * 
					 */
					saveGroup : function() {

						var form = this.getAdmingroupform();

						if (!form.getForm().isValid())
							return;

						var record = form.record;

						var values = form.getForm().getValues();
						if (record.get('id_user_group') > 0)
							values.id_user_group = record.get('id_user_group');
						values.API = "Application_Model_AdminUsersMapper";
						values.APICall = "addOrModifyUserGroup";

						this.ajax(DEFAULT_ADMIN_URL, values,
								this.saveGroupCallBack.bind(this, record));

					},
					/**
					 * 
					 * @param record
					 * @param response
					 */
					saveGroupCallBack : function(record, response) {

						result = response.result;
						var isNew = record.get('id_user_group') == 0;

						record.beginEdit();

						for (key in result) {
							record.set(key, result[key]);
						}

						record.set('text', record.get('group_name'));

						if (isNew) {

							record.set('type', 'group');
							record.set('leaf', true);
							record.set('children', []);
							record.set('iconCls', 'group');

						}
						record.endEdit();
						record.commit();

						if (isNew) {

							this.getUsergrid().getRootNode()
									.appendChild(record);
						}

						this.getAdmingroupform().up('window').close();

					},

					/**
					 * Cr�ation d'un nouvel utilisateur
					 * 
					 * @returns function
					 */
					addUser : function() {
						var record = Ext.ModelManager.create({
							id_user_group : null,
							id_user : 0
						}, 'TextoCMS.model.siteadmin.AdminUserModel');
						return this.openUserForm(record);

					},

					/**
					 * Ouvre le formulaire de cr�ation,/modification d'un
					 * utilisateur
					 * 
					 * @param record
					 */
					openUserForm : function(record) {

						this.getUserGroupStore();
						var userForm = {
							xtype : 'adminuserform',
							groupStore : this.userGroupStore,
							record : record
						};

						Ext
								.create(
										'Ext.window.Window',
										{
											title : record.get('id_user') > 0 ? 'Modification de l\'utilisateur '
													+ record.get('firstname')
													+ ' '
													+ record.get('lastname')
													: 'Nouvel utilisateur',
											modal : true,
											width : 350,
											items : [ userForm ]
										}).show();

					},
					/**
					 * Call back du bouton submit du formulaire utilisateur
					 * 
					 * @param btn
					 * @returns
					 */
					saveUser : function(btn) {
						var form = this.getAdminuserform();
						if (!form.getForm().isValid())
							return;

						var record = form.record;

						var values = form.getForm().getValues();

						if (record.get('id_user') == 0
								|| record.get('id_user') > 0
								&& record.get('email') != values.email) {
							var check = this.getUsergrid().getView().getStore()
									.findRecord('email', values.email);

							if (check)
								return Ext.Msg
										.show({
											title : 'Erreur',
											msg : 'Cet utilisateur existe d&eacute;j&agrave; !',
											buttons : Ext.Msg.OK,
											scope : this,
											icon : Ext.Msg.ERROR
										});

						}
						if (record.get('id_user') == 0
								&& ((values.newPass && values.newPassConfirm && (values.newPass
										.empty() || values.newPassConfirm
										.empty())) || !values.newPass
										&& !values.newPassConfirm
										&& !values.generatePass))
							return Ext.Msg
									.alert('Erreur',
											'Vous devez pr&eacute;ciser un mot de passe');
						if (record.get('id_user') > 0)
							values.id_user = record.get('id_user');

						values.API = "Application_Model_AdminUsersMapper";
						values.APICall = "addOrModifyUser";

						if (record.get('id_user') > 0
								&& record.get('id_user_group') != values.id_user_group)
							return Ext.Msg
									.show({
										title : 'Modification du groupe utilisateur',
										msg : 'Attention, le groupe utilisateur a &eacute;t&eacute; modifi&eacute; !<br />'
												+ record.get('firstname')
												+ ' '
												+ record.get('lastname')
												+ ' h&eacute;ritera par d&eacute;faut des droits par d&eacute;faut de sont nouveau groupe.<br />Souhaitez-vous continuer ?',
										buttons : Ext.Msg.OKCANCEL,
										fn : function(btn) {
											if (btn == "ok")
												this
														.ajax(
																DEFAULT_ADMIN_URL,
																values,
																this.saveUserCallBack
																		.bind(
																				this,
																				record));

										},
										scope : this,
										icon : Ext.Msg.ALERT
									});

						this.ajax(DEFAULT_ADMIN_URL, values,
								this.saveUserCallBack.bind(this, record));

					},
					/**
					 * Call back de la requ�te ajax de modification/cr�ation
					 * d'un utilisateur
					 * 
					 * @param record
					 * @param response
					 */
					saveUserCallBack : function(record, response) {

						result = response.result;

						var isNew = record.get('id_user') == 0;
						initialGroupId = record.get('id_user_group');
						record.beginEdit();
						for (key in result) {
							record.set(key, result[key]);
						}
						if (isNew) {
							record.set('type', 'user');

							record.set('iconCls', 'user');
							record.set('leaf', true);
							record.set('children', []);

						}
						record.set('text', result.firstname + ' '
								+ result.lastname);

						record.endEdit();
						record.commit();

						this.getUsergrid().getRootNode().childNodes
								.each(
										function(node) {
											if (node.get('id_user_group') == record
													.get('id_user_group')
													&& record
															.get('id_user_group') != initialGroupId) {

												node.appendChild(record);
												node.expand();
											}

										}, this);
						this.getAdminuserform().up('window').close();
						this.getUsergrid().store.sort([ {
							property : 'superadmin',
							direction : 'DESC'
						}, {
							property : 'group_name',
							direction : 'ASC',
							transform : function(value) {
								return value.toLowerCase();

							}
						}, {
							property : 'firstname',
							direction : 'ASC',
							transform : function(value) {
								return value.toLowerCase();

							}
						} ]);

					},
					/**
					 * ouvre la fen&ecirc;tre de confirmation de suppression
					 * d'un utilisateur ou d'un groupe,
					 * 
					 * @param record
					 */
					confirmDeleteUserOrGroup : function(rec) {
						var type = rec.get('type');

						if (type == 'group' && rec.childNodes.length > 0)
							return Ext.Msg
									.show({
										title : 'Suppression d\'un groupe',
										msg : 'Vous ne pouvez pas supprimer ce groupe car il contient des utilisateurs',
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});

						if (type == "user"
								&& rec.parentNode.get('superadmin') == 1
								&& rec.parentNode.childNodes.length == 1)
							return Ext.Msg
									.show({
										title : 'Suppression d\'un super administrateur',
										msg : 'Le groupe SuperAdmin doit toujours avoir au moins un utilisateur',
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});

						if (type == "user"
								&& rec.parentNode.get('superadmin') == 1
								&& rec.parentNode.childNodes.length > 1) {
							msgTitle = 'Suppression d\'un super administrateur';
							msgContent = 'Attention, vous allez supprimer un super administrateur.<br />Souhaitez-vous continuer ?';

						} else if (type == "user") {

							msgTitle = 'Suppression d\'un utilisateur';
							msgContent = 'Attention, vous allez supprimer un utilisateur.<br />Souhaitez-vous continuer ?';
						} else {
							msgTitle = 'Suppression d\'un groupe d\'utilisateurs';
							msgContent = 'Attention, vous allez supprimer un groupe.<br />Souhaitez-vous continuer ?';
						}

						return Ext.Msg.show({
							title : msgTitle,
							msg : msgContent,
							buttons : Ext.Msg.OKCANCEL,
							fn : function(btn) {

								if (btn == 'ok')
									this.deleteUserOrGroup(rec);
							},
							scope : this,

							icon : Ext.Msg.QUESTION
						});

					},
					/**
					 * Suppression d'un utilisateur ou d'un groupe
					 * 
					 * @param rec
					 */
					deleteUserOrGroup : function(rec) {
						var params = {
							type : rec.get('type'),
							id_user_group : rec.get('type') == 'group' ? rec
									.get('id_user_group') : null,
							id_user : rec.get('type') == 'group' ? null : rec
									.get('id_user'),
							API : 'Application_Model_AdminUsersMapper',
							APICall : 'deleteAdminElement'
						};

						this.ajax(DEFAULT_ADMIN_URL, params,
								function(response) {
									rec.remove();

								}.bind(this));

					},

					/**
					 * Cr�e et r�cup�re le store de la liste des groupes
					 * utilisateurs
					 */
					getUserGroupStore : function() {

						if (!this.userGroupStore)
							this.userGroupStore = Ext
									.create('TextoCMS.store.siteadmin.UserGroupStore');
						var arrayGroup = [];
						this.getUsergrid().getRootNode().childNodes.each(
								function(node) {
									arrayGroup.push({
										id_user_group : node
												.get('id_user_group'),
										title : node.get('group_name')
									});

								}, this);

						this.userGroupStore.loadData(arrayGroup);

					},
					/**
					 * Rechrage
					 */
					loadTemplatesTreeStore : function() {

						Ext.getStore('TemplatesTreeStore').load();

					},
					/**
					 * 
					 * @param node
					 * @param data
					 * @param overModel
					 * @param dropPosition
					 * @param dropFn
					 */
					templatesTreebeforeDrop : function(node, data, overModel,
							dropPosition, dropFn) {
						if (overModel.isRoot() || overModel.parentNode.isRoot()
								&& dropPosition != 'append')
							return false;

						if (data.records[0].parentNode == overModel
								&& dropPosition != "before")
							return false;

						Ext.Msg
								.confirm(
										'D&eacute;placer le template',
										'Attention, si vous d&eacute;placer ce template, cela peut avoir des r&eacute;percussions sur la gestion de contenu.<br />Souhaitez-vous continuer ?',
										function(btn) {
											if (btn == 'yes')
												this.getTemplatestree().view.plugins[0].dropZone
														.handleNodeDrop(data,
																overModel,
																dropPosition);

										}, this);

						return false;
					},
					/**
					 * 
					 * @param node
					 * @param oldParent
					 * @param newParent
					 * @param index
					 */
					moveNode : function(node, oldParent, newParent, index) {

						var items = newParent.childNodes;

						node.beginEdit();

						node.set('parent_id', newParent.get('id_template'));
						node.endEdit();
						node.commit();
						var queryString = "";
						items.each(function(it, index) {
							queryString += 'items[' + index + ']='
									+ it.get('id_template') + '&';

						}, this);

						queryString += '&parentID='
								+ newParent.get('id_template') + '&id_site='
								+ TextoCMS.siteId;

						this
								.ajax(
										DEFAULT_ADMIN_URL,
										queryString
												+ '&API=Admin_Model_TemplateMapper&APICall=moveTemplate');

					},
					/**
					 * 
					 * @param btn
					 */
					openAddTemplatesTreeForm : function(btn) {

						var obj = {
							id_template : 0
						};
						switch (btn.iconCls) {

						case 'addMainFolder':

							obj.parent_id = -1;

							break;

						}

						var record = Ext.ModelManager.create(obj,
								'TextoCMS.model.siteadmin.TemplatesTreeModel');

						this.displayTemplatesTreeForm(record);

					},
					/**
					 * 
					 * @param record
					 */
					displayTemplatesTreeForm : function(record) {
						this.getTemplatesRefStore();
						var form = Ext.widget('templatestreeform', {
							templatesRefStore : this.templatesRefStore,
							record : record
						});
						Ext
								.create(
										'Ext.window.Window',
										{
											title : (record.get('id_template') > 0 ? 'Modification'
													: 'Ajout')
													+ ' d\'un Template',
											modal : true,
											width : 350,
											items : [ form ]
										}).show();

					},
					/**
					 * 
					 * @param btn
					 */
					saveTemplatesTreesForm : function(btn) {

						var record = this.getTemplatestreeform().record;
						var params = this.getTemplatestreeform().getForm()
								.getValues();
						if (record.get('id_template') == 0)
							params.parent_id = record.get('parent_id') == 0 ? this
									.getTemplatestree().getView().selModel
									.getSelection()[0].get('id_template')
									: 0;
						this.getTemplatestreeform().up('window').body
								.mask((record.get('id_template') > 0 ? 'Modification'
										: 'Ajout')
										+ ' en cours');
						params.API = 'Admin_Model_TemplateMapper';
						params.APICall = 'addOrModify';
						params.id_site = TextoCMS.siteId;

						this.ajax(DEFAULT_ADMIN_URL, params,
								this.templatesTreesFormCallBack.bind(this,
										record));

					},
					/**
					 * 
					 * @param record
					 * @param response
					 */
					templatesTreesFormCallBack : function(record, response) {

						result = response.result;

						var selectedRub = this.getTemplatestree().getView().selModel
								.getSelection().length > 0 ? this
								.getTemplatestree().getView().selModel
								.getSelection()[0] : null;

						var isNew = record.get('id_template') == 0;
						record.beginEdit();
						for (key in result) {
							record.set(key, result[key]);
						}
						record.set('iconCls',
								record.get('parent_id') == 0 ? 'folder'
										: result.type);

						if (isNew) {

							record.set('leaf', true);
							record.set('children', []);

						}
						record.endEdit();
						record.commit();

						if (record.get('parent_id') > 0 && selectedRub && isNew) {

							selectedRub.appendChild(record);
							if (selectedRub.isLeaf()) {
								selectedRub.beginEdit();
								selectedRub.set('leaf', false);
								selectedRub.endEdit();
								selectedRub.commit();

							}

							this.getTemplatestree().getView().refresh();
							selectedRub.expand();

						} else if (record.get('parent_id') == 0 && isNew)
							this.getTemplatestree().getRootNode().appendChild(
									record);
						this.getTemplatestreeform().up('window').body.unmask();

						this.getTemplatestreeform().up('window').close();

						if (selectedRub)
							this.reselectNode(this.getTemplatestree(),
									selectedRub);

					},
					/**
					 * 
					 * @param view
					 * @param cel
					 * @param row
					 * @param rowIndex
					 * @param e
					 */
					getTemplatesTabAction : function(view, cel, row, rowIndex,
							e) {
						var target = e.target;

						var rec = this.getTemplatestree().getView().getStore()
								.getAt(row);
						if (target.hasClassName('editBtn'))
							return this.displayTemplatesTreeForm(rec);
						else if (target.hasClassName('removeBtn'))
							return this.deleteTemplatesTreeRecord(rec);

					},
					/**
					 * 
					 * @param record
					 */
					deleteTemplatesTreeRecord : function(rec) {
						Ext.Msg
								.confirm(
										'Suppression d\'un gabarit',
										'Souhaitez-vous supprimer ce gabarit ?<br />Cela peut entrainer des probl&egrave;mes dans la gestion de contenu.',
										function(btn) {
											if (btn != 'yes')
												return;

											this
													.ajax(
															DEFAULT_ADMIN_URL,
															{
																API : 'Admin_Model_TemplateMapper',
																APICall : 'deleteTemplate',
																id_template : rec
																		.get('id_template')
															},
															function() {
																if (rec.parentNode
																		.isLeaf()
																		&& !rec.parentNode
																				.isRoot()
																		&& rec.parentNode.childNodes.length == 1) {
																	rec.parentNode
																			.beginEdit();
																	rec.parentNode
																			.set(
																					'leaf',
																					false);
																	rec.parentNode
																			.endEdit();
																	rec.parentNode
																			.commit();
																	rec.parentNode
																			.collapse();
																}

																rec.parentNode
																		.removeChild(rec);
																this
																		.getTemplatestree()
																		.getView()
																		.refresh();
															}.bind(this));
										}.bind(this));
					},
					/**
					 * 
					 */
					getTemplatesRefStore : function() {

						if (!this.templatesRefStore) {
							this.templatesRefStore = Ext
									.create('TextoCMS.store.siteadmin.TemplatesRefStore');
							this.templatesRefStore.model.getProxy()
									.setExtraParam('API',
											'Admin_Model_TemplateMapper');
							this.templatesRefStore.model.getProxy()
									.setExtraParam('APICall',
											'getTemplateRefList');
							this.templatesRefStore.model.getProxy()
									.setExtraParam('id_site', TextoCMS.siteId);

							// this.templatesRefStore.load();
						}

					},
					/**
					 * 
					 */
					getTemplatesStore : function() {

						if (!this.templatesStore) {
							var arrayFields = [];

							for (key in TextoCMS.components.cms.fields) {
								if (key != "Fields") {
									var elt = Ext
											.create(TextoCMS.components.cms.fields[key]);
									arrayFields.push({
										'title' : elt.fieldName,
										'name' : elt.alias[0].split('.')[1]
									});
									Ext.destroy(elt);
								}
							}
							;

							this.templatesStore = Ext
									.create('TextoCMS.store.siteadmin.TemplatesStore');
							this.templatesStore.loadData(arrayFields);

						}

					},
					/**
					 * 
					 * @param view
					 * @param cel
					 * @param row
					 * @param rowIndex
					 * @param e
					 * @returns
					 */
					getTemplatesAction : function(view, cel, row, rowIndex, e) {
						var target = e.target;
						var rec = this.getGridtemplates().getStore().getAt(row);

						if (target.hasClassName('editBtn'))
							return this.openTemplatesForm(rec);
						else if (target.hasClassName('removeBtn'))
							return this.deleteTemplatesRecord(rec);

					},
					addTemplate : function(btn) {
						var record = Ext.ModelManager.create({
							id_templateRef : 0
						}, 'TextoCMS.model.siteadmin.TemplatesRefModel');
						this.openTemplatesForm(record);

					},
					/**
					 * 
					 * @param rec
					 *            Ext.data.Model
					 */
					deleteTemplatesRecord : function(rec) {

						Ext.Msg
								.confirm(
										'Suppression d\'un gabarit',
										'Souhaitez-vous supprimer ce gabarit ?<br />Cela peut entrainer des probl&egrave;mes dans la gestion de contenu.',
										function(btn) {
											if (btn != 'yes')
												return;

											this
													.ajax(
															DEFAULT_ADMIN_URL,
															{
																API : 'Application_Model_TemplateMapper',
																APICall : 'deleteTemplateRef',
																id_templateRef : rec
																		.get('id_templateRef')
															},
															function() {
																if (this
																		.getGridtemplatesform()
																		&& this
																				.getGridtemplatesform().record == rec)
																	this
																			.getGridtemplatescenterpanel()
																			.removeAll();

																Ext
																		.getStore(
																				'TemplatesRefStore')
																		.remove(
																				rec);
															}.bind(this));
										}, this);

					},
					/**
					 * 
					 * @param record
					 */
					openTemplatesForm : function(record, forceLoad) {

						if (this.getGridtemplatesform()) {

							if (this.getGridtemplatesform().record == record)
								return;

							if (this.getGridtemplatesform().record != record
									&& forceLoad != true) {

								if (!this.getGridtemplatesform().getForm()
										.isValid()
										|| this.getGridtemplatesform()
												.getForm().isDirty())
									return Ext.Msg
											.show({
												title : 'Attention',
												msg : 'Vous n\'avez pas sauvegard&eacute; le gabarit actuel.<br />Souhaitez-vous continuer ?',
												buttons : Ext.Msg.OKCANCEL,
												scope : this,
												icon : Ext.Msg.ERROR,
												fn : function(btn) {
													if (btn != 'ok')
														return;
													this.openTemplatesForm(
															record, true);

												}
											});
							}
							;

						}
						;

						this.getGridtemplatescenterpanel().removeAll();
						this.getGridtemplatescenterpanel().add({
							xtype : 'gridtemplatesform',
							id : 'tplForm',
							record : record
						});
						this.getGridtemplatescenterpanel().getEl()
								.setOpacity(0);

						this.getGridtemplatesfields().getStore().un({
							update : this.templatesFieldsStoreDataChanged,
							add : this.templatesFieldsStoreDataChanged,
							remove : this.templatesFieldsStoreDataChanged,
							load : this.templatesFieldsSoreLoaded,
							scope : this
						});

						this.getGridtemplatesfields().getStore().on({
							update : this.templatesFieldsStoreDataChanged,
							add : this.templatesFieldsStoreDataChanged,
							remove : this.templatesFieldsStoreDataChanged,
							load : this.templatesFieldsSoreLoaded,
							scope : this
						});

						Ext.create('Ext.fx.Anim', {
							target : this.getGridtemplatescenterpanel(),
							duration : 1000,
							from : {
								opacity : 0
							// starting width 400
							},
							to : {
								opacity : 1
							}
						});

					},
					/**
					 * 
					 * @param view
					 * @param cel
					 * @param row
					 * @param rowIndex
					 * @param e
					 * @returns
					 */
					getGridTemplatesFieldsAction : function(view, cel, row,
							rowIndex, e) {

						var target = null;
						if (e) {
							target = e.target;
							var rec = this.getGridtemplatesfields().getStore()
									.getAt(row);
						} else
							rec = Ext.ModelManager.create({
								id_field : 0,
								extra_params : null
							}, 'TextoCMS.model.siteadmin.TemplatesFieldsModel');
						var form = {
							xtype : 'templatesform',
							record : rec
						};

						if (target && target.hasClassName('editBtn') || !e)
							Ext.create(
									'Ext.window.Window',
									{
										modal : true,
										items : [ form ],
										width : 600,
										record : rec,
										title : e ? 'Modification d\'un champ'
												: 'Ajout d\'un champ'
									}).show();

						else
							return Ext.Msg.show({
								title : 'Suppression d\'un champ',
								msg : 'Voulez-vous supprimer ce champ ?',
								buttons : Ext.Msg.YESNO,
								scope : this,
								fn : function(btn) {

									if (btn != 'yes')
										return;
									this.getGridtemplatesfields().getStore()
											.remove(rec);

								},
								icon : Ext.Msg.ERROR
							});

					},
					/**
					 * 
					 * @param btn
					 */
					updateTemplatesRecord : function(btn) {

						var values = this.getTemplatesform().getForm()
								.getValues();
						var extraParams = Ext.JSON.decode(values.extraParams);
						var obj = {};

						extraParams.each(function(elt) {

							obj[elt.key] = elt.value;

						}, this);

						values.extra_params = Ext.JSON.encode(obj);
						var record = this.getTemplatesform().record;

						var isNew = record.get('id_field') == 0;

						record.beginEdit();
						for (key in values) {
							record.set(key, values[key]);
						}
						if (isNew)
							record.set('id_field', Ext.Number.randomInt(0,
									10000)
									* -1);
						record.endEdit();

						record.commit();

						if (isNew)
							this.getGridtemplatesfields().getStore()
									.add(record);
						this.getTemplatesform().up('window').close();

					},
					/**
					 * 
					 * @param form
					 * @param dirty
					 * @returns
					 */
					checkgridTemplatesFormDirty : function(form, dirty) {
						var btn = form.owner.down('[iconCls=saveBtn]');
						if (dirty && form.isValid())
							return btn.setDisabled(false);
						btn.setDisabled(true);

					},
					/**
					 * 
					 * @param form
					 * @param isValid
					 * @returns
					 */
					checkgridTemplatesFormValidity : function(form, isValid) {
						var btn = form.owner.down('[iconCls=saveBtn]');
						if (!form.isDirty())
							return btn.setDisabled(true);
						btn.setDisabled(!isValid);

					},
					/**
					 * 
					 */
					templatesFieldsStoreDataChanged : function() {

						var store = this.getGridtemplatesfields().getStore();
						var records = store.getRange();
						var ids = {
							fields : []
						};

						records.each(function(rec, ordre) {
							var objArray = {};
							for (key in rec.data) {
								if (key != 'extraParams') {
									value = rec.data[key];

									switch (key) {

									case 'id_field':
										if (value < 0)
											value = 0;
										break;

									case 'compulsary':
										value = value ? 1 : 0;
										break;

									case "extra_params":

										value = (value == "{}" || value == null
												|| value == ""
												|| value == "null" ? null
												: value);

										break;

									}

									objArray[key] = value;
								}

							}

							objArray.ordre = '' + ordre + '';
							objArray.templateRef = this.getGridtemplatesform()
									.getForm().findField('templateRef')
									.getValue();
							ids.fields.push(objArray);

						}, this);

						this.getGridtemplatesform().getForm().findField(
								'fields').setValue(Ext.JSON.encode(ids));

					},
					/**
					 * 
					 * @param st
					 */
					templatesFieldsSoreLoaded : function(st) {
						this.templatesFieldsStoreDataChanged(st);
						this.getGridtemplatesform().getForm().findField(
								'fields').resetOriginalValue();

					},
					/**
					 * 
					 */
					addOrModifyTemplate : function() {
						var values = this.getGridtemplatesform().getForm()
								.getValues();
						values.API = 'Application_Model_TemplateMapper';
						values.APICall = 'addOrModifyTemplateRef';
						var record = this.getGridtemplatesform().record;
						values.id_templateRef = record.get('id_templateRef');
						this.ajax(DEFAULT_ADMIN_URL, values,
								this.addOrModifyTemplateCallBack.bind(this,
										record, values));

					},
					/**
					 * 
					 * @param response
					 */
					addOrModifyTemplateCallBack : function(record, values,
							response) {

						var isNew = record.get('id_templateRef') == 0;

						record.beginEdit();
						for (key in values) {

							record.set(key, values[key]);

						}
						record.set('numFields',
								this.getGridtemplatesfields().store.getCount());
						if (isNew)
							record.set('id_templateRef',
									response.id_templateRef);
						record.endEdit();
						record.commit();
						this.getGridtemplatesform().getForm().setValues(values);
						this.getGridtemplatesfields().store.model.getProxy()
								.setExtraParam('templateRef',
										record.get('templateRef'));
						this.getGridtemplatesfields().store.load();

						if (isNew) {
							this.getGridtemplatesform().getForm().findField(
									'templateRef').readOnly = true;
							Ext.getStore('TemplatesRefStore').add(record);
						}

						var msg = 'Le gabarit a &eacute;t&eacute; '
								+ (isNew ? 'cr&eacute;&eacute;'
										: 'modifi&eacute;');
						TextoCMS.Utils.displayNotification("Succ&egrave;s",
								msg, null, 'tplForm');

					},

					/**
					 * 
					 * @param rec
					 */
					openGridRights : function(rec) {
						this.selectedRec = rec;
						var modulesRights = [];
						TextoCMS.app.modules.each(function(module) {
							var controller = this
									.getController(module.module_name);

							modulesRights.push({
								text : controller.description,
								type : "plugin",
								plugin : '',
								moduleName : module.module_name,
								read : 0,
								write : 0,
								edit : 0,
								children : controller.getRightsItems()
							});

						}, this);

						var rightStore = Ext
								.create('TextoCMS.store.siteadmin.RightsStore');
						rightStore.setRootNode({
							text : 'ok',
							expanded : true,
							children : modulesRights
						});
						// righStore.loadData(modulesRights);

						var grid = Ext.widget('gridrights', {
							store : rightStore,
							record : rec
						});
						rightStore.on('datachanged', function() {
							this.getGridrights().down('button[action=submit]')
									.setDisabled(false);

						}, this);
						var win = Ext.create('Ext.window.Window', {
							modal : true,
							items : [ grid ]
						});
						win.show();

						win.body.mask('chargement des droits');

					},

					getUsersRights : function() {
						this.ajax(DEFAULT_ADMIN_URL, {
							API : 'Application_Model_UsersRightsMapper',
							APICall : 'loadUsersRights',
							id_user_group : this.selectedRec
									.get('id_user_group'),
							id_user : this.selectedRec.get('id_user')
						}, this.updateGridRights.bind(this), false);

					},

					/**
					 * 
					 * @param response
					 */
					updateGridRights : function(response) {
						var result = response.result;

						result
								.each(
										function(elt) {
											console.log(elt);

											this.getGridrights().store
													.getRootNode()
													.cascadeBy(
															function(node) {

																if (node
																		.get('moduleName') == elt.module
																		&& node
																				.get('plugin') == elt.plugin
																		&& node
																				.get('rubId') == elt.rubId
																		&& node
																				.get('id_site') == parseInt(elt.id_site)) {

																	node
																			.beginEdit();
																	node
																			.set(
																					'read',
																					elt.read);
																	node
																			.set(
																					'write',
																					elt.write);
																	node
																			.set(
																					'edit',
																					elt.edit);
																	node
																			.endEdit();
																	node
																			.commit();
																}

															}, this);

										}, this);

						this.getGridrights().up('window').body.unmask();

					},
					/**
					 * Sauvegarde les droits
					 * 
					 * @param btn
					 */

					saveGridRights : function(btn) {

						var rec = this.getGridrights().record;

						var params = "API=Application_Model_UsersRightsMapper&APICall=updateRights&id_user_group="
								+ rec.get('id_user_group')
								+ '&id_user='
								+ rec.get('id_user');

						var index = 0;
						this.getGridrights().store.getRootNode().cascadeBy(
								function(node) {
									if (!node.isRoot()) {
										params += "&items[" + index
												+ "][rubId]="
												+ node.get('rubId') + "&items["
												+ index + "][plugin]="
												+ node.get('plugin')
												+ "&items[" + index
												+ "][module]="
												+ node.get('moduleName')
												+ "&items[" + index
												+ "][read]="
												+ (node.get('read') ? 1 : 0)
												+ "&items[" + index
												+ "][write]="
												+ (node.get('write') ? 1 : 0)
												+ "&items[" + index
												+ "][edit]="
												+ (node.get('edit') ? 1 : 0)
												+ "&items[" + index
												+ "][id_site]="
												+ node.get('id_site');
										index++;

									}
								}, this);

						this.ajax(DEFAULT_ADMIN_URL, params);
						btn.up('window').close();

					},

					/**
					 * 
					 * @param cb
					 * @param recordIndex
					 * @param checked
					 */
					rightsCheckChange : function(cb, recordIndex, checked) {

						var record = this.getGridrights().view.store
								.getAt(recordIndex);
						displayAncestor = false;
						var node = record;
						var parentSearch = false;
						if (!node.parentNode.isRoot()) {
							parentSearch = true;
							do {

								node = node.parentNode;

							} while (!node.parentNode.isRoot());
						}
						if (checked && cb.dataIndex == "read"
								&& node.parentNode.isRoot() && parentSearch) {
							displayAncestor = true;
							// node=node;
						} else
							node = record;

						node.cascadeBy(function(child) {

							if (displayAncestor == true
									&& !record.isAncestor(child)
									&& child != record)
								return;

							child.beginEdit();
							child.set(cb.dataIndex, checked);

							if (cb.dataIndex == "read" && !checked) {

								child.set('edit', checked);
								child.set('write', checked);

							}

							if (cb.dataIndex != "read" && checked) {
								child.set('read', checked);

							}

							child.endEdit();
							child.commit();

						}, this);

						Ext.getStore('rightsStore').fireEvent('datachanged',
								Ext.getStore('rightsStore'));

					},

					/**
					 * 
					 * @returns {Array}
					 */
					getRightsItems : function() {

						var items = this.getTab().items;

						var modules = [];

						Ext
								.getCmp('siteCombo')
								.getStore()
								.each(
										function(record) {

											var children = [];

											items
													.each(
															function(it) {

																children
																		.push({
																			text : it.title,
																			children : [],
																			moduleName : 'siteadmin.SiteAdminController',
																			plugin : it.xtype,
																			// rubId
																			// :
																			// null,
																			id_site : record
																					.get('value'),
																			type : 'plugin'
																		});

															}, this);

											modules
													.push({
														text : record
																.get('label'),
														children : children,
														moduleName : 'siteadmin.SiteAdminController',
														// plugin : null,
														id_site : record
																.get('value'),
														type : 'site'
													});

										}, this);

						return Ext.getCmp('siteCombo').getStore().getCount() > 1 ? modules
								: children;

					},
					/**
					 * 
					 * @param form
					 * @param isValid
					 * @returns
					 */
					checkSiteParamsFormValidity : function(form, isValid) {

						var btn = form.owner.down('button[action=save]');
						if (!form.isDirty())
							return btn.setDisabled(true);
						btn.setDisabled(!isValid);

					},
					/**
					 * 
					 * @param form
					 * @param dirty
					 * @returns
					 */
					checkSiteParamsFormDirty : function(form, dirty) {
						var btn = form.owner.down('button[action=save]');
						form.owner.down('button[action=refresh]').setDisabled(
								!dirty);
						if (dirty && form.isValid())
							return btn.setDisabled(false);
						btn.setDisabled(true);

					},
					refreshForm : function(btn) {
						btn.up('form').getForm().reset();

					},
					saveSiteParamsForm : function(btn) {

						var params = this.getSiteparamsform().getForm()
								.getValues();
						params.API = 'Admin_Model_SitesMapper';
						params.APICall = "saveSiteParams";
						params.id_site = TextoCMS.siteId;
						
						params.path=encodeURIComponent(params.path);
						
						this.ajax(DEFAULT_ADMIN_URL, params,
								function(response) {
							params.path=decodeURIComponent(params.path);
									this.getSiteparamsform().getForm()
											.setValues(params);
									var store =Ext.getCmp('siteCombo').getStore();//Ext.getCmp('')
									var record = store.findRecord('id_site',Ext.getCmp('siteCombo').getValue());
																	record.beginEdit();
									record.set('site_name', params.site_name);
									record.endEdit();
									store.commitChanges();
									Ext.getCmp('siteCombo').select(record);
									
									this.changeSiteLink();
									
									//store.load(store.data().items);
									//console.log(store);
									
									TextoCMS.Utils.displayNotification(
											'Sauvegarde', response.msg, null,
											'SiteParamsForm');

								}.bind(this));

					},

					/**
					 * 
					 */
					loadSiteParams : function() {

						// this.getSiteparamsform().setLoading('Chargement des
						// donn&eacute;es');
						this
								.getSiteparamsform()
								.getForm()
								.load(
										{
											url : DEFAULT_ADMIN_URL,
											waitMsg : 'Chargement des donn&eacute;es',
											params : {
												API : 'Admin_Model_SitesMapper',
												APICall : 'getSiteParams',
												id_site : TextoCMS.siteId
											},
											scope:this,
											success:this.initGoogleForm,
											failure : function(form, action) {
												var msg = action.result.errorMessage ? action.result.errorMessage
														: action.result.msg;
												Ext.Msg.alert("Erreur", msg);
											}
										});

					},
					/**
					 * sauvegarde les fichiers js et css � inclure
					 * 
					 * @param btn
					 */
					saveFilesParamsForm : function(btn) {

						this
								.getJscssform()
								.getForm()
								.submit(
										{
											url : DEFAULT_ADMIN_URL,
											waitMsg : 'Enregistrement des donn&eacute;es',
											params : {
												API : 'Admin_Model_SitesMapper',
												APICall : 'saveCssJsFilesParams',
												id_site : TextoCMS.siteId
											},
											failure : function(form, action) {
												var msg = action.result.errorMessage ? action.result.errorMessage
														: action.result.msg;
												Ext.Msg.alert("Erreur", msg);
											},
											success : function(form, action) {

												TextoCMS.Utils
														.displayNotification(
																'Sauvegarde',
																action.result.msg,
																null,
																'JsCssFilesForm');

												form
														.setValues(form
																.getValues());

											}
										});

					},
					filesFormOpened : function(formPanel) {

						var form = formPanel.getForm();
						var type = form.findField('type').getValue();

						if (type == null) {
							form.findField('type').setValue(1);
							type = 1;
						}

						form.findField('type').fireEvent('change',
								form.findField('type'), type);

						// if(type==null)

					},
					changeFileUrlValue : function(tf, newValue) {

						var form = tf.up('form').getForm();
						var type = form.findField('type').getValue();
						var field = form.findField('file');

						switch (tf.name) {

						case 'url':
							if (type == 1)
								field.setValue(newValue);
							break;

						default:
							if (type == 2)
								field.setValue(newValue);
							break;

						}

					},

					changeJsCssForm : function(cb, newValue) {

						var form = cb.up('form').getForm();

						switch (newValue) {
						case 1:

							form.findField('url').mainFieldCT.show();
							form.findField('url').allowBlank = false;
							form.findField('urlFile').hide().allowBlank = true;

							form.findField('minify').show();

							break;

						case 2:

							form.findField('url').mainFieldCT.hide();
							form.findField('url').allowBlank = true;
							form.findField('urlFile').show().allowBlank = false;
							form.findField('minify').hide();

							break;

						}

					},

					/**
					 * fix le bug sencha de d�selction d'un noeud apr�s mise �
					 * jour
					 * 
					 * @see http://www.sencha.com/forum/showthread.php?239674-BUG-selected-node-lose-CSS-selection-class-after-editing
					 * @param tree
					 * @param selectedRub
					 */
					reselectNode : function(tree, selectedRub) {

						tree.getView().getNode(selectedRub).addClassName(
								'x-grid-row-selected x-grid-row-focused');

					},

					/**
					 * handler validitychange du formulaire contentform, modifie
					 * l'�tat des boutons de la tbar
					 * 
					 * @param form
					 * @param isValid
					 * @returns
					 */
					checkForm : function(form, isValid) {

						var btn = form.owner.down('button[action=submit]');
						if (!form.isDirty())
							return btn.setDisabled(true);
						btn.setDisabled(!isValid);

					},
					/**
					 * handler dirtychange du formulaire contentform, change
					 * l'�tat des boutons
					 * 
					 * @param form
					 * @param dirty
					 * @returns
					 */
					checkDirty : function(form, dirty) {

						var btn = form.owner.down('button[action=submit]');
						if (dirty && form.isValid())
							return btn.setDisabled(false);
						btn.setDisabled(true);
					},
					/**
					 * active ou d�sactive le formulaire GoogleAnalytics
					 */
					saveGoogleForm : function(btn) {

						
						var fields = this.getGoogleAnalyticsForm().query(
						'field');
				fields.each(function(field) {
					if (field.name !== 'googleActivated') {
						//field.allowBlank = !btn.getValue();
						field.setDisabled(false);

					}

				}, this);
						
						var params = this.getGoogleAnalyticsForm().getForm()
								.getValues();
						params.API = 'Admin_Model_SitesMapper';
						params.APICall = "updateGoogleAnalyticsData";
						params.id_site = TextoCMS.siteId;
						this.ajax(DEFAULT_ADMIN_URL, params,
								function(response) {

									this.getGoogleAnalyticsForm().getForm()
											.setValues(params);
									TextoCMS.Utils.displayNotification(
											'Sauvegarde', response.msg, null,
											'SiteParamsForm');

								}.bind(this));

					},
					activateGoogleForm : function(btn) {
						// if(btn.getValue()){
						var fields = this.getGoogleAnalyticsForm().query(
								'field');
						fields.each(function(field) {
							if (field.name !== 'googleActivated') {
								field.allowBlank = !btn.getValue();
								field.setDisabled(!btn.getValue());

							}

						}, this);

					},
					initGoogleForm:function(form, action){
						
						var data = action.result.data;
					
						this.getGoogleAnalyticsForm().getForm().setValues(data);
						
					}

				});