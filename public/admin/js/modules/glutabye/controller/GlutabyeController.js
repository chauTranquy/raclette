Ext
		.define(
				'TextoCMS.Modules.glutabye.controller.GlutabyeController',
				{
					description : 'Espace Pro',
					arraySearch : {
						'keyword' : 'Mot Cl&eacute;',
						'keyword' : 'Mot Cl&eacute;',
						'cp' : 'Code Postal',
						'email' : 'Email',
						'siret' : 'N&deg; de SIRET',
						'raison_sociale' : 'Raison Sociale'
					},
					extend : 'TextoCMS.controller.BaseController',
					refs : [
							{
								ref : 'centerpanel',
								selector : 'viewport tabpanel'
							},
							{
								ref : 'ClientsProGrid',
								selector : 'glutabyetab clientsprogrid'
							},
							{
								ref : 'ClientsRequestGrid',
								selector : 'clientsrequestgrid'
							},
							{
								ref : 'AddBtn',
								selector : 'clientsprogrid button[iconCls=addBtn]'
							},
							{
								ref : 'RemoveBtn',
								selector : 'clientsprogrid button[iconCls=removeBtn]'
							},
							{
								ref : 'EspaceProForm',
								selector : 'espaceproform'
							},
							{
								ref : 'ClientProForm',
								selector : '#winFormGlutabye clientproform'
							},
							{
								ref : 'TypeGrid',
								selector : 'espaceprotypegrid'
							},
							{
								ref : 'RemoveTypeBtn',
								selector : 'espaceprotypegrid button[iconCls=removeBtn]'
							},
							{
								ref : 'saveBtn',
								selector : '#winFormGlutabye button[action=save]'
							},
							{
								ref : 'sortGroup',
								selector : '#sortGroup'
							},
							{
								ref : 'ValidRequestForm',
								selector : 'validrequest'
							},
							{
								ref : 'winFormGlutabye',
								selector : '#winFormGlutabye'
							},
							{
								ref : 'SearchClientForm',
								selector : 'searchclientform'
							},
							{
								ref : 'MainTab',
								selector : 'glutabyetab'
							},
							{
								ref : 'ResultClientGrid',
								selector : 'searchclientsresultgrid'
							},
							{
								ref : 'SearchResultPanel',
								selector : '#searchResultPanel'
							},
							{
								ref : 'ValidRequestBtn',
								selector : 'validrequest clientproform button[iconCls=valid]'

							},
							{
								ref : 'ValidRequestClientForm',
								selector : 'validrequest clientproform'

							},
							{
								ref : 'RefreshValidFormBtn',
								selector : 'validrequest clientproform button[iconCls=refresh]'
							}, {
								ref : 'ClientRequestCombo',
								selector : 'glutabyetab toolbar combo'
							}, {
								ref : 'ContentRightsGrid',
								selector : 'contentrightsgrid'
							}, {
								ref : 'ContentForm',
								selector : 'contentform'
							}

					],
					views : [
							'TextoCMS.Modules.glutabye.view.GlutabyeMainTab',
							'TextoCMS.Modules.glutabye.view.EspaceProForm',
							'TextoCMS.Modules.glutabye.view.TypeGrid',
							'TextoCMS.Modules.glutabye.view.ClientProForm',
							'TextoCMS.Modules.glutabye.view.ClientsProGrid',
							'TextoCMS.Modules.glutabye.view.ValidRequestClientsForm',
							'TextoCMS.Modules.glutabye.view.SearchClientForm',
							'TextoCMS.Modules.glutabye.view.SearchClientsResultGrid',
							'TextoCMS.Modules.glutabye.view.ContentRightsGrid' ],
					stores : [
							'TextoCMS.Modules.glutabye.store.EspaceProStore',
							'TextoCMS.Modules.glutabye.store.TypeProStore',
							'TextoCMS.Modules.glutabye.store.ClientsProStore',
							'TextoCMS.Modules.glutabye.store.ClientsRequestStore',
							'TextoCMS.Modules.glutabye.store.SearchClientsResultStore',
							'TextoCMS.Modules.glutabye.store.ContentRightsStore'],
					init : function() {
						this
								.loadStyleSheet('/admin/js/modules/glutabye/_css/GlutabyeModule.css');

						this
								.control({

									'clientsprogrid' : {
										selectionchange : this.selectionChanged
									},
									'clientsprogrid button[iconCls=removeBtn]' : {
										click : this.deleteSelection

									},
									'clientsprogrid button[iconCls=refreshBtn]' : {
										click : this.refreshStore

									},
									'clientsprogrid button[iconCls=addTypeBtn]' : {
										click : this.openTypeGrid

									},
									'button[iconCls=sync], button[iconCls=syncAll]' : {
										click : this.syncField

									},
									'clientsprogrid button[iconCls=addBtn]' : {
										click : Ext.bind(function() {
											this.openForm(null)
										}, this)

									},
									'clientsprogrid actioncolumn, searchclientsresultgrid actioncolumn' : {
										click : this.dispatchAction

									},
									'espaceproform, #winFormGlutabye clientproform' : {
										validitychange : this.checkForm,
										dirtychange : this.checkDirty

									},
									'clientproform checkbox[name=statut]' : {
										change : this.checkClientStatutCB

									},
									'#winFormGlutabye button[action=save]' : {
										click : this.saveForm

									},
									'espaceprotypegrid' : {
										validateedit : this.checkTypeEdit,
										canceledit : this.checkTypeEdit,
										selectionchange : this.selectionChanged

									},
									'espaceprotypegrid button[iconCls=addBtn]' : {
										click : this.addType
									},
									'espaceprotypegrid button[iconCls=removeBtn]' : {
										click : this.deleteSelection

									},
									'#sortGroup button[toggleGroup=sortGroup]' : {
										click : this.toogleSort

									},
									'#sortGroup button[toggleGroup=collapseGroup]' : {
										click : this.toogleCollapse

									},
									'button[iconCls=generatePass]' : {
										click : this.generatePass
									},
									'clientsrequestgrid actioncolumn' : {
										click : this.dispatchAction

									},
									'validrequest button[iconCls=search]' : {
										click : this.openSearchClientForm

									},
									'searchclientform button[action=search]' : {
										click : this.searchClient

									},
									'validrequest button[iconCls=addClient]' : {
										click : this.createNewClient

									},
									'searchclientform' : {
										dirtychange : this.checkSearchFormDirty

									},
									'searchclientform checkboxgroup checkbox' : {
										afterrender : function(c) {

											Ext.create('Ext.tip.ToolTip', {
												target : c.getEl(),
												html : c.tooltip
											});
										}

									},
									'validrequest clientproform' : {
										validitychange : this.checkRequestClientFormValidity,
										dirtychange : this.checkRequestClientFormDirty
									},
									'validrequest clientproform button[iconCls=valid]' : {
										click : this.validClientRequest

									},
									'validrequest clientproform button[iconCls=refresh]' : {
										click : function(btn) {
											btn.up('form').getForm().reset();

										}

									},
									'validrequest button[iconCls=sync]' : {
										beforerender : function(c) {
											c.tooltip = "Mettre &agrave; jour le champ '"
													+ c.ownerCt
															.down('textfield').fieldLabel
													+ "'";

										}

									},
									'#refreshRequestGrid' : {
										click : function(btn) {
											this.getValidRequestForm().hide();
											this.getClientsRequestGrid().store
													.load();

										}

									},
									'validrequest button[iconCls=delete]' : {
										click : function() {
											this
													.refuseClientRequest(this
															.getValidRequestForm().mainForm
															.getRecord());
										}

									},
									'glutabyetab toolbar combo' : {
										change : this.changeRequestStore

									},
									'contentpanel tabpanel' : {
										afterrender : this.initEspaceProTab

									},
									'contentrightsgrid checkcolumn':{
										checkchange:this.checkChanged
										
									},
									'contentrightsgrid':{
									checkedUpdated:this.checkedUpdated
									
									}

								});

						this.callParent(arguments);
						this.onLaunch(this);

					},

					initController : function() {

						this.tab = Ext.widget('glutabyetab', {
							title : this.description
						});

						this.tab.on('activate', this.tabActivated, this);

						this.viewport.down('tabpanel').add(this.tab);

						this.getTextoCMSModulesGlutabyeStoreTypeProStoreStore()
								.getProxy().setExtraParam('where',
										'id_site=' + TextoCMS.siteId);

						this.getTextoCMSModulesGlutabyeStoreTypeProStoreStore()
								.load();

						/*
						 * this.getTextoCMSModulesGlutabyeStoreClientsRequestStoreStore()
						 * .load();
						 */

						this
								.getTextoCMSModulesGlutabyeStoreEspaceProStoreStore()
								.load();

					},
					tabActivated : function(tab) {
						this.tab.un('activate', this.tabActivated, this);

						if (!this.getClientsProGrid().isLoaded) {
							this.getClientsRequestGrid().isLoaded = false;
						/*	this.getClientsProGrid().store.getProxy()
									.setExtraParam('where',
											'id_site=' + TextoCMS.siteId);
											*/

							this.getClientsProGrid().store
									.on(
											'load',
											function() {

												if (!this
														.getClientsRequestGrid().isLoaded) {

													this
															.getClientsRequestGrid().store
															.getProxy()
															.setExtraParam(
																	'where',
																	'id_site='
																			+ TextoCMS.siteId
																			+ ' and statut<>1');
													this
															.getClientsRequestGrid().store
															.on(
																	'load',
																	function() {

																		this
																				.changeRequestStore(
																						this
																								.getClientRequestCombo(),
																						this
																								.getClientRequestCombo()
																								.getValue())

																		this
																				.getMainTab()
																				.up(
																						'panel')
																				.setLoading(
																						false);
																		this
																				.getClientsRequestGrid()
																				.setLoading(
																						false);

																	}, this);

													this
															.getClientsRequestGrid().store
															.load();
													this
															.getClientsRequestGrid()
															.setLoading(false);
												}

											}, this);

							this.getClientsProGrid().store.load();

							this.getMainTab().up('panel').setLoading(
									'Chargement des informations');

						}

					},

					buildGlutabyeStores : function(store, records) {

						this
								.getTextoCMSModulesGlutabyeStoreEspaceProStoreStore()
								.un(
										'load',
										Ext
												.bind(this.buildGlutabyeStores,
														this));
						this.ClientsProGrid().store.getProxy().setExtraParam(
								'where', 'id_site=' + TextoCMS.siteId);
						this.ClientsProGrid().store.load();

					},
					initInterface : function() {

						// if(!this.getClientsProGrid().isLoaded)this.getClientsProGrid().store.load();

					},
					selectionChanged : function(panel, selection) {

						this.getRemoveTypeBtn().setDisabled(
								selection.length == 0);
					},
					deleteSelection : function(record) {

						Ext.Msg
								.confirm(
										'Suppression du client "'
												+ record.get('raison_sociale')
												+ '"',
										'Voulez-vous vraiment supprimer ce client ?<br />La suppression est d&eacute;finitive !',
										Ext.bind(this.doDeleteClient, this,
												[ record ], true)

								);

					},
					dispatchAction : function(view, cell, row, item, e, record,
							rowElt) {

						switch (view.ownerCt.xtype) {
						case 'clientsprogrid':
							if (e.target.hasClassName('edit'))
								return this.openForm(view, cell, row);
							this.deleteSelection(this.getClientsProGrid()
									.getStore().getAt(row));
							break;

						case 'searchclientsresultgrid':
							var rec = view.ownerCt.getStore().getAt(row).get(
									'client');

							this.updateClientPanel(rec);

							this.displaySyncButtons(true);
							view.ownerCt.up('window').close();
							break;

						case 'clientsrequestgrid':
							rec = this.getClientsRequestGrid().getStore()
									.getAt(row);

							if (e.target.hasClassName('edit'))
								return this.openFormRequest(rec);
							if (e.target.hasClassName('refuse'))
								return this.refuseClientRequest(rec);

							return this.deleteClientRequest(rec);

							break;

						}
					},
					openFormRequest : function(rec) {

						title = 'Valider la demande de "'
								+ rec.get('raison_sociale') + '"';
						// if(this.getWinFormGlutabye())this.getWinFormGlutabye().destroy();

						this.getValidRequestForm().show();
						this.getValidRequestForm().mainForm.loadRecord(rec);
						this.getValidRequestForm().mainForm.show();

						show = false;

						var client = null;

						if (parseInt(rec.get('id_client')) > 0
								&& Ext.getStore('ClientsProStore').findExact(
										'id_client',
										parseInt(rec.get('id_client'))) > -1) {

							client = Ext.getStore('ClientsProStore').getAt(
									Ext.getStore('ClientsProStore').findExact(
											'id_client',
											parseInt(rec.get('id_client'))));

							show = true;

						}
						;

						this.updateClientPanel(client);
						this.displaySyncButtons(show);

					},
					updateClientPanel : function(client) {

						this.getValidRequestForm().clientPanel.removeAll(true);

						if (!client)
							return this.getValidRequestForm().clientPanel
									.add({
										xtype : 'panel',
										title : 'Client associ&eacute;',
										layout : {
											type : 'vbox',
											pack : 'center'
										},
										height : '100%',
										border : false,
										items : [ {
											xtype : 'panel',
											border : false,
											layout : 'fit',
											width : '100%',
											margin : '10 0',
											style : 'text-align:center; color:red',
											html : 'Aucun client ne correspond &agrave; cette demande'
										} ]
									});

						client.set('statut', 1);
						client.set('sendMail', 1);

						var clientForm = Ext.widget('clientproform', {

							record : client,
							title : 'Client associ&eacute;',
							buttonAlign : 'center',
							buttons : [ {
								text : 'R&eacute;initialiser les informations',
								iconCls : 'refresh',
								disabled : true
							}, {
								text : 'Valider la demande',
								disabled : true,
								iconCls : 'valid'
							} ]
						});

						clientForm.getForm().findField('sendMail').hide();

						this.getValidRequestForm().clientPanel.add(clientForm);

					},
					openSearchClientForm : function(btn) {

						var searchForm = Ext.widget('searchclientform');

						this.searchWin = Ext.widget('window', {
							title : 'Rechercher un client',
							modal : true,
							width : 400,
							items : [ searchForm ]
						});
						this.searchWin.show();

					},
					checkSearchFormDirty : function(form, dirty) {
						form.owner.down('button[action=search]').setDisabled(
								!dirty && !form.isValid());
					},

					searchClient : function(btn) {
						var params = this.searchWin.down('searchclientform')
								.getValues();
						params.API = 'Cmsmodules_Model_ClientsProMapper';
						params.APICall = "search";
						params.id_client_request = this.getValidRequestForm().mainForm
								.getRecord().get('id_client_request');

						this.searchWin.setLoading('Recherche en cours');
						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.searchClientCB, this), false);

					},
					searchClientCB : function(response) {

						// this.getSearchResultPanel().removeAll(true)

						it = [];

						Ext.Object
								.each(
										response,
										function(key, groupe) {

											if (groupe.length > 0) {
												var store = Ext
														.create('TextoCMS.Modules.glutabye.store.SearchClientsResultStore');
												Ext.Array
														.each(
																groupe,
																function(rec) {

																	rec.groupName = key;
																	rec.client = Ext
																			.getStore(
																					'ClientsProStore')
																			.findRecord(
																					'id_client',
																					rec.id_client);
																	var record = Ext
																			.create(
																					'TextoCMS.Modules.glutabye.model.SearchClientsResultModel',
																					rec);
																	store
																			.add(record);

																}, this);

												var widget = Ext
														.widget(
																'searchclientsresultgrid',
																{
																	store : store,
																	title : 'Recherche par '
																			+ this.arraySearch[key]
																			+ ' ('
																			+ store
																					.getCount()
																			+ ' r&eacute;sultat'
																			+ (store
																					.getCount() > 1 ? 's'
																					: '')
																			+ ')',
																	maxHeight : 500,
																	autoScroll : true
																});

												it.push(widget);

											}
										}, this);

						this.searchWin.setLoading(false);
						this.searchWin.close();

						if (it.length == 0) {

							Ext
									.widget(
											'window',
											{
												title : 'R&eacute;sultat de la recherche',
												modal : true,
												width : 600,
												bodyStyle : 'background:white',
												height : 500,
												layout : {
													type : 'vbox',
													pack : 'center'
												},
												items : [ {
													xtype : 'panel',
													html : 'La recherche n\'a retourn&eacute;e aucun r&eacute;sultat',
													border : false,
													width : '100%',
													layout : 'fit',
													bodyStyle : 'text-align:center'
												} ],
												autoShow : true,
												buttons : [
														{
															text : 'fermer',
															handler : function(
																	btn) {
																btn
																		.up(
																				'window')
																		.close();
															}
														},
														{
															text : 'retour &agrave; la recherche',
															iconCls : 'search',
															scope : this,
															handler : function(
																	btn) {
																btn
																		.up(
																				'window')
																		.close();
																this
																		.openSearchClientForm();

															}
														} ]
											});

						} else
							Ext.widget('window', {
								title : 'R&eacute;sultat de la recherche',
								modal : true,
								width : 600,
								height : 500,
								layout : 'accordion',
								items : it,
								autoShow : true,
								buttons : [ {
									text : 'fermer',
									handler : function(btn) {
										btn.up('window').close();
									}
								}, {
									text : 'retour &agrave; la recherche',
									iconCls : 'search',
									scope : this,
									handler : function(btn) {
										btn.up('window').close();
										this.openSearchClientForm();

									}
								} ]
							});

					},

					openForm : function(view, cell, row) {

						if (view == null) {
							rec = Ext
									.create('TextoCMS.Modules.glutabye.model.ClientsProModel');
							rec.beginEdit();
							rec.set('type', null);
							rec.set('id_groupe', null);
							rec.endEdit();
							title = 'Ajouter un client';
						} else {
							rec = this.getClientsProGrid().getStore()
									.getAt(row);
							title = 'Modifier le client "'
									+ rec.get('raison_sociale') + '"';
						}

						this.win = Ext.widget('window', {
							id : 'winFormGlutabye',
							modal : true,
							width : 500,
							items : [ {
								xtype : 'clientproform',
								record : rec
							} ],
							title : title,
							buttons : [ {
								text : 'Sauvegarder',
								action : 'save',
								disabled : true
							}, {
								text : 'Annuler',
								action : 'close'
							} ]
						}).show();

					},
					checkForm : function(form, isValid) {

						if (!form.owner.up('window'))
							return;

						if (!this.getSaveBtn())
							return;

						if (!form.isDirty())
							return this.getSaveBtn().setDisabled(true);
						this.getSaveBtn().setDisabled(!isValid);

					},
					/**
					 * handler dirtychange du formulaire contentform, change
					 * l'état des botons
					 * 
					 * @param form
					 * @param dirty
					 * @returns
					 */
					checkDirty : function(form, dirty) {

						if (dirty && form.isValid()) {
							return this.getSaveBtn().setDisabled(false);
						}

						this.getSaveBtn().setDisabled(true);
					},
					saveForm : function(btn) {

						var API = this.getEspaceProForm() ? 'EspacePro'
								: 'ClientsPro', form = this.getEspaceProForm() ? this
								.getEspaceProForm().getForm()
								: this.getClientProForm().getForm(), key = this
								.getEspaceProForm() ? 'id_espacepro'
								: 'id_client';

						var values = form.getValues();
						form.updateRecord();
						var record = form.getRecord();

						record.beginEdit();
						if (values.statut == 1) {

							record.set('statut', 1);

						}
						;
						if (API == "ClientsPro") {

							record
									.set(
											'libelleType',
											this
													.getTextoCMSModulesGlutabyeStoreTypeProStoreStore()
													.findRecord('id_type',
															values.type).get(
															'type'));
							record
									.set(
											'groupName',
											this
													.getTextoCMSModulesGlutabyeStoreEspaceProStoreStore()
													.findRecord('id_espacepro',
															values.id_groupe)
													.get('name'));

						}

						record.endEdit();

						if (record.get(key) > 0)
							record.commit();

						var callValues = {
							API : 'Cmsmodules_Model_' + API + 'Mapper',
							APICall : 'addData',
							id_site : TextoCMS.siteId
						}

						var params = Ext.Object.merge(values, callValues);
						// this.win.close();

						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.saveFormCB, this, [ record ], true));

					},
					saveFormCB : function(response, record) {
						var title = (parseInt(record.get(record.idProperty)) == 0 ? "Ajout"
								: "Modification")
								+ " d'un client";
						var msg = 'Le client "'
								+ record.get('raison_sociale')
								+ '" a &eacute;t&eacute '
								+ (parseInt(record.get(record.idProperty)) == 0 ? ' ajout&eacute;'
										: 'Modifi&eacute;')
						if (parseInt(record.get(record.idProperty)) == 0) {

							record.beginEdit();
							record.set(record.idProperty,
									response[record.idProperty]);
							record.endEdit();

							this
									.getTextoCMSModulesGlutabyeStoreClientsProStoreStore()
									.add(record);
							this
									.getTextoCMSModulesGlutabyeStoreClientsProStoreStore()
									.commitChanges();

						}
						this.getClientsProGrid().getView().focusRow(record);

						TextoCMS.Utils.displayNotification(title, msg);

						this.win.close();

					},
					doDeleteClient : function(btn, chaispasquoi, window, record) {
						if (btn !== 'yes')
							return;

						var params = {
							API : 'Cmsmodules_Model_ClientsProMapper',
							APICall : 'delete',
							id : record.get('id_client')
						}
						var me = this;

						this
								.ajax(
										DEFAULT_ADMIN_URL,
										params,
										function(response) {
											TextoCMS.Utils
													.displayNotification(
															'Suppression',
															'Le client "'
																	+ record
																			.get('raison_sociale')
																	+ '" a &eacute;&eacute; supprim&eacute; de la base');
											Ext.getStore('ClientsProStore')
													.remove(record);
										});

					},
					doDeleteSelection : function(btn, chaispasquoi, window,
							record) {

						if (btn !== 'yes')
							return;
						var sel = this.getTypeGrid().getSelectionModel()
								.getSelection();

						var params = {
							API : 'Cmsmodules_Model_TypeProMapper',
							APICall : 'deleteSelection',
							ids : []
						}
						Ext.Array.each(sel, function(record) {

							params.ids.push(record.get('id_type'));
						}, this);

						params.ids = params.ids.join('|');
						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.deleteSelectionCB, this));

					},
					deleteSelectionCB : function(response) {
						this.getTypeGrid().getStore().remove(
								this.getTypeGrid().getSelectionModel()
										.getSelection());

					},
					refreshStore : function(btn) {

						this.getClientsProGrid().getStore().reload();

					},
					openTypeGrid : function(btn) {
						if (this.getTypeGrid())
							this.getTypeGrid().destroy();
						grid = Ext
								.widget(
										'espaceprotypegrid',
										{
											store : this
													.getTextoCMSModulesGlutabyeStoreTypeProStoreStore()
										});

						Ext.create('Ext.window.Window', {
							closeAction : 'destroy',
							title : 'gestion des types de clients',
							modal : true,
							items : [ grid ],
							autoShow : true,
							layout : 'fit',
							width : 400,
							height : 300,
							buttons : [ {
								text : "fermer",
								handler : function() {
									this.up('window').close();
								}
							} ]
						});
						/*
						 * this.getTypeGrid().store.getProxy().setExtraParam(
						 * 'where', 'id_site=' + TextoCMS.siteId);
						 * this.getTypeGrid().store.load();
						 */

					},
					addType : function() {

						var rec = Ext.create(
								'TextoCMS.Modules.glutabye.model.TypeProModel',
								{
									id_site : TextoCMS.siteId
								});
						this.getTypeGrid().getStore().insert(0, rec);
						this.getTypeGrid().cellEditing.startEdit(rec, 1);

					},
					checkTypeEdit : function(editor, e) {
						var rec = e.record;

						if (rec.get('id_type') == 0 && e.value == "")
							return this.getTypeGrid().getStore().remove(rec);
						// rec.save()
						var me = this;

						var params = {
							id_type : rec.get('id_type'),
							type : e.value,
							id_site : rec.get('id_site'),
							APICall : 'addData',
							API : 'Cmsmodules_Model_TypeProMapper'
						};
						this.ajax(DEFAULT_ADMIN_URL, params, function() {
							me.getTypeGrid().getStore().load();
						});
					},
					toogleSort : function(btn) {
						var btnCollapse = Ext.ComponentQuery
								.query('#sortGroup button[toggleGroup=collapseGroup]');
						btnCollapse.each(function(button) {

							button.setDisabled(btn.iconCls == 'clients');

						});
						Ext.suspendLayouts();
						switch (btn.iconCls) {

						case 'clients':
							this.getClientsProGrid().getView().getFeature(
									'groupingGroup').disable();
							Ext.getCmp('columnGroup').show();
							Ext.getCmp('typeColumn').show();
							this.getClientsProGrid().getStore().sort(
									'raison_sociale', 'ASC');
							break;
						default:

							if (this.getClientsProGrid().getView().getFeature(
									'groupingGroup').disabled)
								this.getClientsProGrid().getView().getFeature(
										'groupingGroup').enable();

							if (btn.iconCls == "group") {
								this.getClientsProGrid().getStore().group(
										'groupName', 'ASC');
								Ext.getCmp('typeColumn').show();
								Ext.getCmp('columnGroup').hide();
							} else {
								this.getClientsProGrid().getStore().group(
										'libelleType', 'ASC');
								Ext.getCmp('typeColumn').hide();
								Ext.getCmp('columnGroup').show();

							}

							this
									.toogleCollapse(btnCollapse[0].pressed ? btnCollapse[0]
											: btnCollapse[1]);

							break;

						}
						Ext.resumeLayouts(true);

					},
					toogleCollapse : function(btn) {

						feature = this.getClientsProGrid().getView()
								.getFeature('groupingGroup');

						if (btn.cls == 'open')
							feature.expandAll();
						else
							feature.collapseAll();

					},
					generatePass : function(btn) {

						btn.ownerCt.up('form').setLoading('Patientez...');

						this.ajax('/cmsmodules/glutabye/generepass', {},
								Ext.bind(this.generatePassCB, this, [ btn ],
										true), false);
					},
					generatePassCB : function(response, btn) {

						btn.ownerCt.down('field').setValue(response.pass);
						btn.ownerCt.up('form').setLoading(false);
					},
					checkClientStatutCB : function(cb) {

						var f = cb.up('form').getForm().findField('password');

						f.allowBlank = !cb.getValue();// ,cb.up('form').findField('password'));
						f.up('fieldcontainer').setFieldLabel(
								'Mot de passe ' + (cb.getValue() ? '*' : ''));
						f.validate();
						if (!f.isValid())
							this.generatePass();

					},
					syncField : function(btn) {

						if (btn.iconCls == "sync") {

							this.getValidRequestForm().down('clientproform')
									.getForm().findField(
											btn.ownerCt.down('textfield')
													.getName()).setValue(
											btn.ownerCt.down('textfield')
													.getValue());

						}

						else {
							Ext.Object.each(this.getValidRequestForm().mainForm
									.getValues(), function(key, val) {
								this.getValidRequestForm()
										.down('clientproform').getForm()
										.findField(key).setValue(val);

							}, this);

						}

					},

					displaySyncButtons : function(show) {
						Ext.Array.each(this.getValidRequestForm().query(
								'button[iconCls=sync]'), function(btn) {
							if (show)
								btn.show();
							else
								btn.hide();

						}, this);

						if (show)
							this.getValidRequestForm().query(
									'button[iconCls=syncAll]')[0].show();
						else
							this.getValidRequestForm().query(
									'button[iconCls=syncAll]')[0].hide();

					},
					createNewClient : function(btn) {

						var rec = Ext
								.create(
										'TextoCMS.Modules.glutabye.model.ClientsProModel',
										this.getValidRequestForm().mainForm
												.getRecord().data);

						this.updateClientPanel(rec);

					},
					checkRequestClientFormValidity : function(form, isValid) {

						this.getValidRequestBtn().setDisabled(!isValid);

					},
					checkRequestClientFormDirty : function(form, isDirty) {
						this.getRefreshValidFormBtn().setDisabled(!isDirty);

					},
					validClientRequest : function() {

						var params = this.getValidRequestClientForm().getForm()
								.getValues();
						// comparaison des adresses mail

						var requestData = this.getValidRequestForm().mainForm
								.getValues();
						var msg = "";
						if (params.statut !== 1)
							msg = "Le client est inactif !<br />Si la case statut n'est pas coch&eacute;e, le client ne pourrapas acc&eacute;der &agrave; l'espace pro.";
						else if (params.email !== requestData.email)
							msg = "Les adresses mails sont diff&eacute;rentes !<br />Le demandeur risque de ne pas recevoir la confirmation de son acc&egrave;s.";
						else if (params.sendMail !== 1)
							msg = "La notification par email a &eacute;t&eacute; d&eacute;selectionn&eacute;e.";

						if (msg !== "")
							return Ext.Msg.confirm('Attention', msg
									+ '<br />Voulez-vous continuer ?',
									function(btn) {
										if (btn == 'no')
											return;

										this.validateClientRequest();
									}, this);

						this.validateClientRequest();

					},
					validateClientRequest : function() {

						var params = this.getValidRequestClientForm().getForm()
								.getValues();
						params.APICall = "validClientRequest";
						params.API = "Cmsmodules_Model_ClientsProMapper";
						params.id_client_request = this.getValidRequestForm().mainForm
								.getRecord().get('id_client_request');

						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.validateClientRequestCB, this, [ params ],
								true), false);

					},
					validateClientRequestCB : function(response, params) {

						params.libelleType = this
								.getTextoCMSModulesGlutabyeStoreTypeProStoreStore()
								.findRecord('id_type', params.type, 0, false,
										true, true).get('type');
						params.groupName = this
								.getTextoCMSModulesGlutabyeStoreEspaceProStoreStore()
								.findRecord('id_espacepro', params.id_groupe,
										0, false, true, true).get('name');

						if (params.id_client > 0 && params.statut == 1) {

							var clientId = Ext.getStore('ClientsProStore')
									.findExact('id_client',
											parseInt(params.id_client)), client = Ext
									.getStore('ClientsProStore')
									.getAt(clientId);

							client.beginEdit();
							Ext.Object.each(params, function(key, val) {
								client.set(key, val);

							});

							client.endEdit();
							client.commit();

						} else {
							var client = rec = Ext
									.create(
											'TextoCMS.Modules.glutabye.model.ClientsProModel',
											params);

							Ext.getStore('ClientsProStore').add(client);
						}

						// this.getClientsProGrid().getView().refresh();

						TextoCMS.Utils
								.displayNotification(
										"Demande Valid&eacute;e",
										"La demande de '"
												+ client.get('raison_sociale')
												+ "' a &eacute;t&eacute; valid&eacute;e."
												+ (params.sendMail == 1 ? '<br />Un mail de confirmation a &eacute;t&eacute; envoy&eacute;'
														: 'ATTENTION ! <br />Aucun mail de confirmation n\'a &eacute;t&eacute; envoy&eacute;.'));

						this.getClientsRequestGrid().store.remove(this
								.getValidRequestForm().mainForm.getRecord());

						// this.getClientsRequestGrid().getView().refresh()

						this.getValidRequestForm().hide();

					},
					refuseClientRequest : function(rec) {

						Ext
								.widget(
										'window',
										{
											title : 'Refuser la demande de \''
													+ rec.get('raison_sociale')
													+ '\'',
											modal : true,
											width : 400,

											layout : 'form',
											items : [ {
												xtype : 'form',
												border : false,
												bodyPadding : '10',
												items : [
														{
															xtype : 'panel',
															border : false,
															bodyStyle : 'padding:0 0 10px; font-weight:bold; font-size:12px',
															html : 'Pr&eacute;cisez le cas &eacute;ch&eacute;ant la raison du refus'
														},
														{
															width : 340,
															xtype : 'textarea',
															fieldLabel : 'Raison du refus',
															allowBlank : true,
															labelWidth : 100,
															name : 'raison_refus',
															labelStyle : 'text-align:right;'
														},
														{
															xtype : 'hidden',
															name : 'id_client_request',
															value : rec
																	.get('id_client_request')

														} ]
											} ],
											autoShow : true,
											buttons : [ {
												text : 'Fermer',
												handler : function(btn) {
													btn.up('window').close();
												}
											}, {
												text : 'Valider',
												iconCls : 'valid',
												scope : this,
												handler : this.doRefuseClient
											} ]
										});

					},
					doRefuseClient : function(btn) {

						var params = btn.ownerCt.ownerCt.down('form')
								.getValues();
						params.APICall = "refuseClientRequest";
						params.API = "Cmsmodules_Model_ClientsProMapper";

						btn.ownerCt.ownerCt.close();

						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.refuseClientRequestCB, this, [ params ],
								true), true);

					},
					refuseClientRequestCB : function(response, params) {

						var clientRequestIndex = this.getClientsRequestGrid()
								.getStore().findExact('id_client_request',
										params.id_client_request);

						if (clientRequestIndex == -1)
							return;
						var rec = this.getClientsRequestGrid().getStore()
								.getAt(clientRequestIndex);

						rec.beginEdit();
						rec.set('statut', -1);
						rec.endEdit();

					},
					changeRequestStore : function(cb, value) {

						this.getClientsRequestGrid().store.clearFilter();

						switch (value) {

						case 1:

							this.getClientsRequestGrid().store.filter('statut',
									0);
							break;
						case 2:

							this.getClientsRequestGrid().store.filter('statut',
									-1);

							break;
						}

						this.getClientsRequestGrid().store.sort('statut',
								'DESC')

					},
					deleteClientRequest : function(record) {

						Ext.Msg
								.confirm(
										'Suppression de la demande de "'
												+ record.get('raison_sociale')
												+ '"',
										'Voulez-vous vraiment supprimer cette demande ?<br />La suppression est d&eacute;finitive !',
										Ext.bind(this.doDeleteClientRequest,
												this, [ record ], true)

								);

					},
					doDeleteClientRequest : function(btn, arg, win, record) {

						if (btn !== 'yes')
							return;

						var params = {};
						params.API = 'Cmsmodules_Model_ClientsRequestMapper';
						params.APICall = "delete";
						params.id_client_request = record
								.get('id_client_request');

						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.doDeleteClientRequestCB, this, [ record ],
								true), false);

					},
					doDeleteClientRequestCB : function(response, record) {

						this.getClientsRequestGrid().store.remove(record);

					},
					initEspaceProTab : function(cmp) {

						Ext.Array.each(Ext.ComponentQuery
								.query('contentform buttongroup [action]'),
								function(btn) {
									btn.un('click', this.contentButtonsClick);
								}, this);

						if (this.getContentForm().selectedRub
								.get('templateRef') !== "documentPro")
							return;

						var params = {};
						
						params.id_rubrique = this.getContentForm().selectedRub
								.get('id_rubrique');
						params.APICall = "getClientRights";
						params.API = "Cmsmodules_Model_ClientsProMapper";

						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.buildClientsRightsTab, this), false);
					},
					buildClientsRightsTab : function(response) {
					
						var sel =response.sel;

						if(this.getContentRightsGrid()) this.getContentRightsGrid().destroy();
						
						this.getContentForm().up('tabpanel').add({
							xtype : 'panel',
											title : 'Gestion des droits de consultation ('
													+ (sel.length == 0 ? 'aucun client s&eacute;lectionn&eacute;'
															: sel.length+' '+(sel.length > 1 ? 'clients s&eacute;lectionn&eacute;s'
																	: 'client s&eacute;lectionn&eacute;'))
													+ ')',
							iconCls : 'proTab',
							layout : 'fit',
							autoScroll:true,
							items : [ {
								
								xtype : 'contentrightsgrid',
								
								selArray:sel,
								border:false,
								title : 'Liste des clients'
							} ]
						});

					
						//this.getContentRightsGrid().store.on('update',this.checkedUpdated, this);
						Ext.Array.each(Ext.ComponentQuery
								.query('contentform buttongroup [action]'),
								function(btn) {
									btn.on('click', Ext.bind(
											this.contentButtonsClick, this));
								}, this);
						
						var array=[];
						sel.each(function(el){
							array.push(el.id_client);
							
						},this);
						
						this.getContentForm().add({
							xtype : 'hidden',
							allowBlank : true,
							value:array.join('|'),
							name : 'clientsRights'
						});

					},
					contentButtonsClick : function() {

						var sel = this.getContentRightsGridSelection();

						var params = {};
						params.sel = sel.join('|');
						params.id_rubrique = this.getContentForm().selectedRub
								.get('id_rubrique');
						params.APICall = "addClientRights";
						params.API = "Cmsmodules_Model_ClientsProMapper";

						this.ajax(DEFAULT_ADMIN_URL, params, null, false);

					},

					destroyInstance : function() {

						this.tab.un('activate', this.tabActivated, this);

					},
					checkedUpdated : function() {
						
					
						var sel = this.getContentRightsGridSelection();
							
						this.getContentForm().getForm().findField('clientsRights').setValue(sel.join('|'));
					
					},
					getContentRightsGridSelection : function() {
						//this.getContentRightsGrid().store.clearFilter();
						//var data = this.getContentRightsGrid().store.filter('selected',true);
						var sel = [];
						this.getContentRightsGrid().store.each(function(rec){
							if(rec.get('selected'))sel.push(rec.get('id_client'));
						},this);
						
						this.getContentRightsGrid().up('panel').setTitle('Gestion des droits de consultation ('
						+ (sel.length == 0 ? 'aucun client s&eacute;lectionn&eacute;'
								: sel.length+' '+(sel.length > 1 ? 'clients s&eacute;lectionn&eacute;s'
										: 'client s&eacute;lectionn&eacute;'))
						+ ')');
						
						return sel;

					},
					checkChanged:function(checkcol, rowindex, state){
						
						var rec = this.getContentRightsGrid().store.getAt(rowindex);
						
						;
						if(rec.get('selected')==true){
							groupName=rec.get('groupName');
							var feature = this.getContentRightsGrid().features[0];
							
							var selected=0;
							
							feature.groupCache[groupName].children.each(function(record){
								if(record.get('selected'))selected++;
								}, this);
							if(selected==feature.groupCache[groupName].children.length){
								feature.groupCache[groupName].selected=true;
								Ext.get('groupcheck'+groupName).addCls('x-grid-checkcolumn-checked');
							}else feature.groupCache[groupName].selected=false;
						};
						
						this.checkedUpdated();
						
					}

				});