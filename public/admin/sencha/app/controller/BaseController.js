Ext
		.define(
				'TextoCMS.controller.BaseController',
				{
					extend : 'Ext.app.Controller',
					Gapi : TextoCMS.classes.Gapi,
					requires : [ 'TextoCMS.classes.Ajax',
							'TextoCMS.components.cms.fields.Combo',
							'TextoCMS.proxy.Proxy' ],
					stores : [ 'classes.SitesStore' ],
					ajax : Ext.bind(TextoCMS.Ajax.ajaxRequest, TextoCMS.Ajax),
					refs : [ {
						ref : "accountBtn",
						selector : 'button#myAccountBtn'

					}, {
						ref : "siteCombo",
						selector : '#siteCombo'
					} ],
					init : function() {
						console.log(this.id);
						this.control({
							'button[action=close]' : {
								click : this.closeWin
							},
							'#headerRegion' : {
							// afterlayout:this.initViewport

							}

						});

						this.viewport = Ext.ComponentQuery.query('viewport')[0];

						if (this.defaultView)
							this.viewport.down('[region=center]').add(
									Ext.widget(this.defaultView));
						if (this.viewport
								&& this.viewport.down('[region=center]').items.length == 1)
							this.viewport.down('[region=center]').setActiveTab(
									0);
						if (this.id == "BaseController") {
							if (!Ext.getCmp('accountBtn')) {
								this.loadMask = new Ext.LoadMask(Ext.getBody(),
										{
											msg : "Chargement de l'interface"
										}).show();

								this.initViewport();
							}
						}

					},
					/**
					 * 
					 * @returns Ext.app.Controller
					 */
					getContentController : function() {

						return this.getController('cms.ContentController');

					},

					getController : function(controllerName) {

						return TextoCMS.app.getController(controllerName);

					},

					closeWin : function(btn) {
						var win = btn.up('window');
						if (!win)
							return;
						win.close();

					},
					initViewport : function(panel) {
						if (Ext.getCmp('accountBtn'))
							return;

						this.viewport = Ext.ComponentQuery.query('viewport')[0];

						var btn = Ext.create('Ext.button.Button', {
							ui : 'plain',
							tooltip : 'Modifier mon profil',
							renderTo : 'myAccountBtn',
							id : 'accountBtn'
						});

						btn.on('click', this.openUserWindow, this)

						this.sitesStore = Ext
								.create('TextoCMS.store.classes.SitesStore');
						// console.log(this.sitesStore,
						// this.sitesStore.model.getProxy());
						this.sitesStore.on('load', this.getSiteList, this)
						this.sitesStore.load();
						/*
						 * this.ajax(DEFAULT_ADMIN_URL, { API :
						 * 'Admin_Model_SitesMapper', APICall : 'getSiteList' },
						 * Ext.bind(this.getSiteList, this), false);
						 */

					},
					openUserWindow : function() {

						var form = Ext
								.create(
										'Ext.form.Panel',
										{
											bodyStyle : 'background:transparent',
											margin : 5,
											trackResetOnLoad : true,
											listeners : {
												scope : this,
												validitychange : function(form,
														isValid) {
													var saveBtn = form.owner
															.down('button[action=submit]');

													if (!form.isDirty())
														return saveBtn
																.setDisabled(true);
													saveBtn
															.setDisabled(!isValid);

												},
												dirtychange : function(form,
														dirty) {

													var saveBtn = form.owner
															.down('button[action=submit]');

													if (dirty && form.isValid())
														return saveBtn
																.setDisabled(false);

													saveBtn.setDisabled(true);

												}
											},
											fieldDefaults : {
												labelAlign : 'left',
												labelWidth : 100,
												labelStyle : 'text-align:right'
											},
											defaults : {
												width : 310

											},
											border : false,
											items : [
													{
														xtype : 'textfield',
														fieldLabel : 'Nom *',
														name : 'lastname',
														allowBlank : false,
														minLength : 3
													},
													{
														xtype : 'textfield',
														fieldLabel : 'Pr&eacute;nom *',
														name : 'firstname',
														allowBlank : false,
														minLength : 3
													},
													{
														xtype : 'textfield',
														fieldLabel : 'Email *',
														readOnly : true,
														name : 'email',
														allowBlank : false,
														minLength : 3,
														vtype : 'email'
													},
													{
														xtype : 'fieldset',
														title : 'Nouveau mot de passe',
														collapsible : true,
														collapsed : true,
														width : 330,
														defaults : {
															width : 300

														},
														items : [
																{
																	xtype : 'textfield',
																	labelWidth : 90,
																	fieldLabel : 'Mot de passe',
																	name : 'newPass',
																	minLength : 6,
																	inputType : 'password',
																	validator : function(
																			value) {

																		if (form
																				.getForm()
																				.findField(
																						'newPassConfirm')
																				.getValue()
																				.empty()
																				&& value
																						.empty()) {

																			form
																					.getForm()
																					.findField(
																							'newPassConfirm')
																					.clearInvalid();
																			return true;
																		}
																		if (form
																				.getForm()
																				.findField(
																						'newPassConfirm')
																				.getValue()
																				.empty())
																			return "Veuillez saisir la v&eacute;rification de votre mot de passe";
																		if (form
																				.getForm()
																				.findField(
																						'newPassConfirm')
																				.getValue() != value)
																			return "Les mots de passe ne correspondent pas";
																		form
																				.getForm()
																				.findField(
																						'newPassConfirm')
																				.clearInvalid();
																		return true;
																	},
																	scope : this
																},
																{
																	xtype : 'textfield',
																	labelWidth : 90,
																	fieldLabel : 'V&eacute;rification',
																	name : 'newPassConfirm',
																	minLength : 6,
																	inputType : 'password',
																	validator : function(
																			value) {
																		if (form
																				.getForm()
																				.findField(
																						'newPass')
																				.getValue()
																				.empty()
																				&& value
																						.empty()) {
																			form
																					.getForm()
																					.findField(
																							'newPass')
																					.clearInvalid();
																			return true;
																		}
																		if (form
																				.getForm()
																				.findField(
																						'newPass')
																				.getValue()
																				.empty())
																			return "Veuillez saisir votre mot de passe";
																		if (form
																				.getForm()
																				.findField(
																						'newPass')
																				.getValue() != value)
																			return "Les mots de passe ne correspondent pas";
																		form
																				.getForm()
																				.findField(
																						'newPass')
																				.clearInvalid();
																		return true;

																	},
																	scope : this
																}

														]
													}

											],
											buttons : [
													{
														text : 'Enregistrer',
														disabled : true,
														action : 'submit',
														scope : this,
														handler : function(btn) {
															if (!form.getForm()
																	.isValid())
																return;

															form
																	.getForm()
																	.submit(
																			{
																				url : '/admin/getjsondata?format=json',
																				params : {
																					API : 'Application_Model_AdminUsersMapper',
																					APICall : 'updateUserData'
																				},
																				method : 'post',
																				waitMsg : 'Mise &agrave; jour des informations',
																				success : function(
																						f,
																						action) {

																					$(
																							'nameWrapper')
																							.update(
																									'Bonjour, '
																											+ action.result.data.firstname
																											+ ' '
																											+ action.result.data.lastname);
																					form
																							.up(
																									'window')
																							.close();

																				},
																				failure : function(
																						form,
																						action) {
																					Ext.Msg
																							.alert(
																									"Erreur",
																									action.result.msg);
																				}

																			});

														}
													},
													{
														text : 'Annuler',
														handler : function(btn) {
															var win = btn
																	.up('window');
															win.close();

														},
														scope : this
													} ]

										});

						var winContact = Ext.create('Ext.window.Window', {
							title : 'Modification de vos informations',
							modal : true,

							width : 350,
							items : [ form ]
						});

						winContact.show();

						form.getForm().load({
							url : '/admin/getjsondata?format=json',
							params : {
								API : 'Application_Model_AdminUsersMapper',
								APICall : 'getUserInfo'
							},
							waitMsg : 'Chargement des informations',
							failure : function(form, action) {
								Ext.Msg.alert("Erreur", action.result.msg);
							}

						})

					},

					getSiteList : function(st, records) {

						TextoCMS.siteId = st.getAt(0).get('id_site');

						var cbSites = Ext.widget('combobox', {
							style : "bottom: 0;position: absolute;",
							queryMode : 'local',
							hidden : st.getCount() == 1,
							store : st,
							displayField : 'site_name',
							valueField : 'id_site',
							name : 'siteCb',
							id : 'siteCombo',
							fieldLabel : 'Sites',
							value : TextoCMS.siteId
						});
						cbSites.bindStore(st);
						Ext.getCmp('headerRegion').add(cbSites);
						cbSites.on('change', this.changeSite, this);

						this.changeSiteLink();

						// this.getContentController().initController();
						TextoCMS.AdminUser.loadUserModule(Ext.bind(
								this.loadModule, this));

					},
					changeSiteLink : function() {
						var rec = this.sitesStore.findRecord('id_site', Ext
								.getCmp('siteCombo').getValue());

						$('viewSite').setAttribute('href', rec.get('site_url'));
						var title = 'Administration du site '
								+ rec.get('site_name');
						$$('h1')[0].update(title);
						window.document.title = title;

					},
					loadModule : function(response) {
						this.viewport = Ext.ComponentQuery.query('viewport')[0];
						TextoCMS.app.modules = response;
						response.each(function(module) {
							console.log(module.module_name);
							var controller = this
									.getController(module.module_name);
							// controller.init();
							controller.initController();
						}, this);

					},
					changeSite : function(cb) {

						TextoCMS.siteId = cb.getValue();
						this.changeSiteLink();
						if (!TextoCMS.AdminUser.isSuperAdmin()) {
							this.viewport.down('tabpanel').removeAll(true);
							TextoCMS.AdminUser.loadUserModule(Ext.bind(
									this.loadModule, this));
						} else
							TextoCMS.app.modules.each(function(module) {

								var controller = this
										.getController(module.module_name);
								// controller.init();
								controller.initController();
							}, this);
						return;

					}

				});