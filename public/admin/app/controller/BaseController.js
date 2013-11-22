Ext
		.define(
				'TextoCMS.controller.BaseController',
				{
					extend : 'Ext.app.Controller',
					Gapi : TextoCMS.classes.Gapi,
					requires : [ 'TextoCMS.classes.Ajax',
							'TextoCMS.components.cms.fields.Combo',
							'TextoCMS.proxy.Proxy'],
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
				
						this.control({
							'button[action=close]' : {
								click : this.closeWin
							}
						});

						this.viewport = Ext.ComponentQuery.query('viewport')[0];
						
						if (this.id == "BaseController") {
							if (!Ext.getCmp('accountBtn')) {
								
								this.initViewport();
							}
						};
						
					},
					
					onLaunch:function(){
					
						
						try{
							TextoCMS.app.moduleLoaded++;
							var value=TextoCMS.app.modules.length==0?0:TextoCMS.app.moduleLoaded/TextoCMS.app.modules.length;
												
													
							
							TextoCMS.AdminUser.loadMask.updateProgress(value,'chargement du module '+TextoCMS.app.moduleLoaded+'/'+TextoCMS.app.modules.length, true);
							
							var task = new Ext.util.DelayedTask(function(){
								if(TextoCMS.app.moduleLoaded==TextoCMS.app.modules.length)this.launchAll();
								else this.loadModule();
								
							}, this);
							
							
							
							task.delay(500);
						
						
						}catch(e){
							
							
						};
						
					},
					/**
					 * 
					 * @returns Ext.app.Controller
					 */
					getContentController : function() {

						return this.getController('TextoCMS.controller.cms.ContentController');

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
						
						this.sitesStore.on('load', this.getSiteList, this)
						this.sitesStore.load();
						

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
						this.viewport.down('[region=center]').hide();
						// this.getContentController().initController();
						TextoCMS.AdminUser.loadUserModule(Ext.bind(
								this.initModules, this));

					},
					changeSiteLink : function() {
						
						
						
						var rec = Ext.getStore('SitesStore').findRecord('id_site', Ext
								.getCmp('siteCombo').getValue());
						TextoCMS.site=rec;
						$('viewSite').setAttribute('href', rec.get('site_url'));
						var title = 'Administration du site '
								+ rec.get('site_name');
						$$('h1')[0].update(title);
						window.document.title = title;

					},
					initModules:function(response){
	this.viewport = Ext.ComponentQuery.query('viewport')[0];
	
	Ext.Array.each(TextoCMS.app.modules, function(module){
		var controller = this
		.getController(module.module_name);
		
		if(controller.initialized)controller.destroyInstance();
		
	}, this);
	
	TextoCMS.app.modules = response;
	TextoCMS.app.moduleLoaded=0;
		
	this.viewport.down('tabpanel').removeAll(true);
	
	
	this.loadModule();
	
},
					
					loadModule : function() {
                                    
                                   
                                    
						var value=TextoCMS.app.modules.length==0?0:TextoCMS.app.moduleLoaded/TextoCMS.app.modules.length;
						if(TextoCMS.AdminUser.loadMask)TextoCMS.AdminUser.loadMask.updateProgress(value,'chargement du module '+TextoCMS.app.moduleLoaded+'/'+TextoCMS.app.modules.length, true);
						//response.each(function(module) {
							var module=TextoCMS.app.modules[TextoCMS.app.moduleLoaded];
							
							
							var controller = this
									.getController(module.module_name);
                                                                
                                                                
                                                             
                                                                
							if(controller.initialized){
								
								controller.onLaunch(controller);
							}
							
						//}, this);

					},
				
					changeSite : function(cb) {

						TextoCMS.siteId = cb.getValue();
						
						this.changeSiteLink();
						this.viewport.down('[region=center]').hide();
						//	
							TextoCMS.AdminUser.loadUserModule(Ext.bind(
									this.initModules, this));
						 
							
							
						return;

					},
					loadScript:function (filePath, cb){
                        
						if(cb==undefined) cb=Ext.emptyFn;
						
                        // create a script tag - set its src - and listen out for it to load
                        var scriptTag = document.createElement("script");

                        // and listen to it
                        var cacheBuster = "";

                        cacheBuster = "?bust=" + new Date().getTime();

                        // set the type of file and where it can be found
                        scriptTag.type = "text/javascript";
                        scriptTag.src = filePath + cacheBuster;
                        
                        scriptTag.on('load',cb);
                            // finally add it to the <head>
                            document.getElementsByTagName("head")[0].appendChild(scriptTag);
					},
					loadStyleSheet:function(cssFile){
						var ss = document.createElement("link");
						ss.type = "text/css";
						ss.rel = "stylesheet";
						ss.href = cssFile+'?'+new Date().getTime();
						document.getElementsByTagName("head")[0].appendChild(ss);
						
					},
					launchAll:function(){
						
						
						TextoCMS.AdminUser.loadMask.updateProgress(1,'chargement termin&eacute;', true);
						var task = new Ext.util.DelayedTask(function(){
							if(TextoCMS.AdminUser.loadMask)TextoCMS.AdminUser.loadMask.destroy();
					
							TextoCMS.AdminUser.loadMask=null;
							this.viewport.down('[region=center]').show();
							this.viewport.down('[region=north]').show();
							
						}, this);
						
						
						
						task.delay(500);
						
						TextoCMS.app.modules.each(function(module, index) {
							
							var controller = this
									.getController(module.module_name);
									
							var taskAutre = new Ext.util.DelayedTask(function(){
								controller.initController();
								controller.initialized=true;
								
								if(index==1)
									this.viewport.down('[region=center]').setActiveTab(
											0);
								
							}, this);
							taskAutre.delay(500);
							
							
						}, this);
						
						
					},
					getRightsItems:function(){
						var modules=[];
						Ext.getCmp('siteCombo').getStore().each(function(record){
							modules.push({
								text : record.get('site_name'),
								children : [],
								moduleName : this.self.getName(),
								//plugin : null,
								id_site : record.get('id_site'),
								type : 'folder'
							});
							
						},this);
						
						return modules;
					},
					
					destroyInstance:function(){
						
						
						
					}
					
					


				});