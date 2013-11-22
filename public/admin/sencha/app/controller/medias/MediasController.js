Ext
		.define(
				'TextoCMS.controller.medias.MediasController',
				{
					description : 'Biblioth&egrave;que de m&eacute;dias',
					extend : 'TextoCMS.controller.BaseController',
					requires : [ 'TextoCMS.components.cms.IconBrowser',
							'TextoCMS.components.cms.InfoPanel',
							'TextoCMS.components.cms.BrowserTree' ],
					views : [ 'TextoCMS.view.medias.MediasTab',
							'TextoCMS.view.medias.DirectoryForm',
							'TextoCMS.view.medias.UploadForm',
							'TextoCMS.view.medias.DetailGrid',
							'TextoCMS.view.widgets.InfoPanel' ],
							store:['TextoCMS.store.media.FileReaderStore'],
					/*arrayExt : {
						"image" : [ "jpg", "jpeg", "gif", "png" ],
						"pdf" : [ "pdf" ],
						"flash" : [ "flv", "swf" ]
					},*/
					refs : [ {
						ref : 'browserTree',
						selector : '#mediasBrowserTree'
					}, {
						ref : 'iconBrowser',
						selector : 'mediastab iconbrowser'
					}, {
						ref : 'deleteFolderBtn',
						selector : 'browsertoolbar [iconCls=deleteFolder]'
					}, {
						ref : 'deleteFileBtn',
						selector : 'browsertoolbar [iconCls=deleteFile]'
					}, {
						ref : 'addFileBtn',
						selector : 'browsertoolbar [iconCls=addFile]'
					}, {
						ref : 'folderForm',
						selector : 'directoryform'
					}, {
						ref : 'uploadForm',
						selector : 'uploadform'
					}, {
						ref : 'infoPanel',
						selector : 'mediastab infopanel'
					}, {
						ref : 'mediadetailGrid',
						selector : 'mediadetailGrid'
					},

					{
						ref : 'centerRegion',
						selector : '#centerTabRegion [region=center]'
					},
					{ref:'FileReaderDataview', selector :'FileReaderDataview'},
					{ref:'toolbar',selector:'browsertoolbar'}

					],
					selectedFolder : null,
					init : function() {
						this.defaultView = 'mediastab';
						var extArray=[];
						Ext.Object.each(arrayExt, function(key, value){
							extArray[key]=value;
							
						},this);
						
						
						
	            		this.arrayExt=arrayExt;
						
	            		
						this.fileSupport = window.File && window.FileReader && window.FileList
						&& window.Blob;

						this.control({
							'#mediasBrowserTree' : {
								afterlayout : this.selectDefaultFolder,
								itemclick : this.displayFolderDetail,
								expand:this.folderExpanded,
								afterload:this.displayFolderDetail
							},
							
							'mediastab tool[type=refresh]' : {
								click : this.refreshTree
							},

							'[toggleGroup=affiche]' : {
								click : this.changeView

							},
							'mediastab iconbrowser' : {
								itemdblclick : this.navigateBrowser,
								itemclick : this.fileInfo,
								selectionchange:this.mediaSelectionChanged
							},
							'browsertoolbar trigger' : {
								change : this.filterResult

							},
							'browsertoolbar [iconCls=addFolder]' : {
								click : this.openAddFolderForm

							},
							'browsertoolbar [iconCls=deleteFolder]' : {
								click : this.deleteFolder

							},
							'browsertoolbar [iconCls=deleteFile]' : {
								click : this.deleteFile

							},
							'browsertoolbar [iconCls=addFile]' : {
								click : this.openFileForm

							},
							'[iconCls=closeupload]':{ 
								click:this.closeWin 
								},
							
							'directoryform form, uploadform form' : {
								validitychange : this.formValidateChange

							},
							'button[iconCls=addFileUpload]' : {
								click : this.addFile
							},
							'directoryform [iconCls=addFolder]' : {
								click : this.addFolder
							},
							'mediastab infopanel' : {
								afterlayout : this.initPopinLink

							},
							'mediadetailGrid':{
								itemclick:this.fileInfo,
								itemdblclick : this.navigateBrowser
								
							},
							'FileReaderDataview':{
								
								afterrender:this.initFileReaderDataview,
								selectionchange : this.selectionChanged},
								'button[iconCls=openUploadBrowser]':{
									click:this.openBrowser
									
								},
								'button[cls=deleteUploadSelection]':{click: this.deleteSelection}
								
							
						});
						this.callParent(arguments);
						this.mediasTree = Ext
								.create('TextoCMS.components.cms.BrowserTree',{id:'mediasBrowserTree'});
						Ext.ComponentQuery.query('mediastab [region=west]')[0]
								.add(this.mediasTree);
						this.centerPanel = Ext.getCmp('centerTabRegion');// Ext.ComponentQuery.query('mediastab
						// [region=center]')[0];

					},
					
					initController:function(){
						
						this.getBrowserTree().store.model.getProxy().setExtraParam('id_site', TextoCMS.siteId);
						
						this.selectedFolder=null;
						this.selectDefaultFolder();
						
						if(!TextoCMS.AdminUser.isSuperAdmin())this.ajax(DEFAULT_ADMIN_URL, {API:'Admin_Model_UsersRightsMapper', APICall:'checkModuleRights',moduleName:'medias.MediasController',id_site:TextoCMS.siteId}, Ext.bind(
								this.checkRightsCB, this));
						
						
					},
					
					checkRightsCB:function(response){
						//this.getToolbar().items.map('hide');
						var rights=response.rights, buttons=this.getToolbar().query('buttongroup');
						if(rights.write==0){
							buttons[0].hide();
							buttons[1].hide();
						}else{
							buttons[0].show();
							buttons[1].show();
							
						}
						
						
						
					},
					
					/**
					 * Affiche le détail du répertoire dans le dataview
					 * 
					 * @param view
					 * @param record
					 * @param htmlElement
					 * @param index
					 * @param e
					 */
					displayFolderDetail : function(view, record, htmlElement,
							index, e) {
						
						
						if (this.selectedFolder == record)
							return;
						if(this.getInfoPanel())this.getInfoPanel().hide().loadRecord(null);
						
						this.getDeleteFolderBtn().setDisabled(true);
						
						this.selectedFolder = record;

						if (!this.getIconBrowser()) {
							
							var browserPanel = {
								xtype : 'iconbrowser',
								root : record.get('path'),
								bodyStyle : 'background-color:white',
								flex : 1,
								style : 'background-color:white',
								autoScroll:true,
								multiSelect: true,
								 plugins: [
							                Ext.create('Ext.ux.DataView.DragSelector', {
							                	onEnd:function(){
							                		console.log('fini');
							                		this.callParent(arguments);
							                		
							                	}
							                	
							                	
							                })
							                ],
							                listeners:{
						                		scope:this,
						                		end:this.onEndDrag
						                		
						                	},
								border : false
							};
							this.centerPanel.removeAll();
							this.centerPanel.add({
								items : [ 
								          browserPanel
								          ],
								region : 'center',
								border : false,
								layout: 'fit'
								//,autoScroll : true
							}, {
								region : 'east',
								bodyPadding : 10,
								items : {
									xtype : 'infopanel',
									border : false
								},
								collapsible : true,
								width : 200,
								layout : 'fit'
							});

							this.currentView = this.getIconBrowser();
							var me=this;
							
							this.getIconBrowser().plugins[0].tracker.onEnd=Ext.Function.createDelayed(function(e) {
						        var dataview = this.dataview,
					            selModel = dataview.getSelectionModel(),
					            dragSelector = this.dragSelector;

						        Ext.Array.each(selModel.getSelection(), function(rec){
						        	
						        	if(rec.get('type')=="folder"||rec.get('type')=="folderBack")dataview.deselect(rec);
						        	
						        }, this);
						        
					        this.dragging = false;
					        dragSelector.getProxy().hide();
					    }, 1);
							
							this.centerPanel.doLayout();

						} else {
							Ext.getCmp('searchFolder').reset();
							this.getIconBrowser().store.model
									.getProxy()
									.setExtraParam('folder', record.get('path'));
							this.getIconBrowser().store.model
							.getProxy()
							.setExtraParam('baseFolder', '');
							this.getIconBrowser().store.model
							.getProxy()
							.setExtraParam('displayFile', true);
							this.getIconBrowser().store.model
							.getProxy()
							.setExtraParam('id_site',TextoCMS.siteId);
							this.getIconBrowser().store.load();
							
							
						}
						console.log(this.getIconBrowser());

					},
					onEndDrag:function(){
						console.log(arguments);
						
					},
					/**
					 * Sélectionne par défaut le premier répertoire lors du
					 * premier affichage
					 * 
					 * @param tree
					 */
					selectDefaultFolder : function() {
						if (this.selectedFolder !== null)
							return;
						var tree= this.getBrowserTree();
						
						tree.getView().getSelectionModel().select(
								tree.store.getRootNode().firstChild);
						tree.fireEvent('itemclick', tree.getView(), tree.store
								.getRootNode().firstChild);

					},
					/**
					 * rafraichit le treepanel
					 * 
					 * @param btn
					 */
					refreshTree : function(btn) {

						this.getBrowserTree().getStore().un('load',
								this.getCurrentRecord, this);
						this.getBrowserTree().getStore().on('load',
								this.getCurrentRecord, this);
	
						this.getBrowserTree().getStore().model.getProxy().setExtraParam('baseFolder',null);
						
						btn.up('panel').down('treepanel').getStore().load();

					},
					/**
					 * call back après le refresh du treestore pour réouvrir le
					 * folder sélectionné
					 * 
					 * @param store
					 * @param node
					 * @param model
					 */
					getCurrentRecord : function(store, node, model) {

						if (this.selectedFolder !== null
								&& store.getRootNode().findChild('path',
										this.selectedFolder.get('path'), true)) {
							var test = store.getRootNode().findChild('path',
									this.selectedFolder.get('path'), true);

							this.selectedFolder = test;
							this.getBrowserTree().getSelectionModel().select(
									this.selectedFolder);

							this.getBrowserTree().getRootNode().firstChild
									.expand();

							node = test.parentNode;

						if(node != this.getBrowserTree()
								.getRootNode().firstChild&&node!==null)	do {

								try{
								//	console.log(node);
									
									node.expand();
									node = node.parentNode;
								}
								catch(err){
									//console.log(err);
									node=null;
									break;
									
								};
								

							} while (node != this.getBrowserTree()
									.getRootNode().firstChild||node!=null);

						}

						this.getBrowserTree().getStore().un('load',
								this.getCurrentRecord, this);
						// this.selectedTree = null;
					},

					/**
					 * Change le Xtemplate du data view
					 * 
					 * @param btn
					 */
					changeView : function(btn) {
						switch (btn.iconCls) {
						case 'toggleClassique':
							var tpl = Ext
									.create('TextoCMS.tpl.medias.DefaultBrowserTpl');
							break;

						case 'toggleIcone':
							var tpl = Ext
									.create('TextoCMS.tpl.medias.IconeBrowserTpl');
							break;

						case 'toggleListe':
							// var tpl =
							// Ext.create('TextoCMS.tpl.medias.ListeBrowserTpl');
							break;

						}
						if (tpl) {

							if (this.currentView != this.getIconBrowser()) {
								this.getCenterRegion().remove(this.currentView,
										false);
								
								var selection = this.getMediadetailGrid().getSelectionModel().getSelection();
								
																
								this.currentView = this.getIconBrowser();
								if(selection.length>0) {
									var record = selection[0];						
									this.currentView.getSelectionModel().select(record);
								}
								
								this.getCenterRegion().add(this.currentView);
								

							}
							this.getIconBrowser().tpl = tpl;
							this.getIconBrowser().refresh();
							return;
						}

						
						
						this.getCenterRegion().remove(
								this.getIconBrowser(), false);
						this.currentView = (!this.getMediadetailGrid()?Ext.widget({
							xtype : 'mediadetailGrid',store:this.getIconBrowser().store
						}):this.getMediadetailGrid()) ;
						
						var selection = this.getIconBrowser().getSelectionModel().getSelection();
						
						this.currentView.doLayout();
						
						
						
							this.getCenterRegion().add(this.currentView);
							this.getCenterRegion().doLayout();
						
							if(selection.length>0) {
								var record = selection[0];
								var index = this.currentView.store.find('path',record.get('path'));
							
								this.currentView.getView().select(record);
								this.currentView.getView().refresh(false);
								this.currentView.getView().focusRow(index);
								
							}
							

					},
					
				
					/**
					 * Gestion du double clique sur un répertoire dans le
					 * dataview pour l'ouvrir et le sélectionner dans le
					 * 
					 * @param view
					 * @param record
					 */
					navigateBrowser : function(view, record) {
						if (record.get('type') != "folder"&&record.get('type')!=="folderBack")
							return;
						if(record.get('type')=="folderBack")record=this.selectedFolder.parentNode;
						node = this.folderExpanded(record);
						
						
					
						if(!node){
						/*	var cb=Ext.bind(function(){
								
								this.folderExpanded(record);
								this.selectedFolder.un('expand', cb, this)
							}, this);
							
							this.selectedFolder.on('expand', cb, this)
							*/
							this.selectedFolder.expand();
							return;}
						
					},
					folderExpanded:function(record){
						var node = this.getBrowserTree().store.getRootNode()
						.findChild("path", record.get("path"), true);
						
						if(!node)return false;
						node.expand();
						this.getBrowserTree().selModel.select(node);
						this.displayFolderDetail(this.getBrowserTree().getView(), node);
						
					},
					
					/**
					 * filtre les résultats du dataView
					 * 
					 * @param field
					 * @param newValue
					 */
					filterResult : function(field, newValue) {
						var store = this.getIconBrowser().store;
						dataview = this.getIconBrowser();

						store.suspendEvents();
						store.clearFilter();
						dataview.getSelectionModel().clearSelections();
						store.resumeEvents();
						store.filter({
							property : 'name',
							anyMatch : true,
							value : newValue
						});
					},
					/**
					 * 
					 * @param view
					 * @param record
					 */
					fileInfo : function(view, record) {

						this.getDeleteFolderBtn().setDisabled(
								record.get('type') != 'folder'&&record.get('type') !== 'folderBack');

						this.getDeleteFileBtn().setDisabled(
								record.get('type') == 'folder'&&record.get('type') !== 'folderBack');
					/*	if (record.get('type') != 'file')
							return;
							*/

						if(record.get('type') != 'folderBack')console.log(view);
						
						this.getInfoPanel().show().loadRecord(record);

					},
					/**
					 * Ouvre le popin de création de répertoire
					 */
					openAddFolderForm : function() {
						if (!this.getFolderForm())
							return Ext.create(
									'TextoCMS.view.medias.DirectoryForm', {
										title : 'Nouveau r&eacute;pertoire'
									}).show();
						this.getFolderForm().down('form').getForm().reset();
						this.getFolderForm().show();

					},
					/**
					 * 
					 * @param btn
					 */
					closeWin : function(btn) {
						
						
						
						
						if(btn.up('window'))btn.up('window').close();

					},
					/**
					 * 
					 * @param form
					 * @param isValid
					 */
					formValidateChange : function(form, isValid) {
						form.owner.up('window').query('[action=add]')[0]
								.setDisabled(!isValid);

					},
					/**
					 * 
					 * @param btn
					 */
					addFolder : function(btn) {

						var params = this.getFolderForm().down('form')
								.getValues();
						params.API = 'Application_Model_FileManager';
						params.APICall = 'makeFolder';
						params.parentFolder = this.selectedFolder.get('path');
						params.id_site = TextoCMS.siteId;
						this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(
								this.addFolderCallBack, this));

					},
					/**
					 * 
					 * @param response
					 */
					addFolderCallBack : function(response) {

						var result = response.result;
						var obj = {
							qtip : result.name,
							text : result.name,
							isLeaf : true,
							children : [],
							path : result.path
						};
						var newNode = Ext.ModelManager.create(obj,
								'TextoCMS.model.medias.BrowserTreeModel');

						
						this.selectedFolder.appendChild(newNode);
						this.selectedFolder.beginEdit();
						this.selectedFolder.set('leaf',false);
						this.selectedFolder.endEdit();
						
						this.getBrowserTree().store.sort();
						this.selectedFolder.expand();
						this.getFolderForm().hide();
						
						this.getIconBrowser().store
						.load();
						
						var msg = "Le r&eacute;pertoire '" + result.name
								+ "' a &eacute;t&eacute; cr&eacute;&eacute;";
						msg += ".";

						TextoCMS.Utils.displayNotification("Succ&egrave;s",
								msg, null, 'mediaPanel');

					},
					/**
					 * 
					 * @returns
					 */
					openFileForm : function() {
						if (!this.getUploadForm())
							Ext.create(
									'TextoCMS.view.medias.UploadForm', {
										title : 'Nouveau Fichier',
										browser:this.getIconBrowser(),
										id:'uploadForm'
									}).show();
						
						var form = this.getUploadForm().down('form').getForm();
						form.baseParams.parentRoot = this.selectedFolder.get('path');
						form.baseParams.overwrite = 0;
						form.baseParams.baseFolder = '';
						form.baseParams.id_site= TextoCMS.siteId;
						form.reset();
						this.getUploadForm().show();

					},
					/**
					 * 
					 */
					addFile : function() {
						
						


						
						if(this.fileSupport) {
							this.selectedFileIndex=0;
							this.doUploadFiles();
							
							
							return;
						}
						

						var val = Ext.getCmp('form-file').getValue().replace(/.*(\/|\\)/, '');
						
						if (Ext.getCmp('form-file').findParentByType('uploadform').browser.store.findExact('name', val) > -1) {

							Ext.Msg
									.show({
										title : 'Nouveau fichier',
										msg : 'Le fichier existe d&eacute;j&agrave;<br />Voulez-vous &eacute;craser la version actuelle ?',
										buttons : Ext.Msg.OKCANCEL,
										icon : Ext.Msg.WARNING,
										scope : this,
										fn : function(btn) {
											if (btn == 'ok') {
												Ext.getCmp('form-file').findParentByType('form').getForm().baseParams.overwrite = 1;
												this.doUpload();
											}
										}
									});

							return;
						}
						this.doUpload();

					},
					/**
					 * 
					 */
					doUpload : function() {
						var uploadForm =Ext.getCmp('form-file').findParentByType('uploadform'); 
						
						Ext.getCmp('form-file').findParentByType('form')
								.getForm()
								.doAction(
										'submit',
										{
											scope : this,
											reset : false,
											waitMsg : 'T&eacute;l&eacute;chargement en cours',
											success : function(form1, action) {
												var result = action.result;

												if (result.success == "true") {
													var idBrowser=uploadForm.browser.getId()
													console.log(idBrowser);
													
													uploadForm
															.close();

													uploadForm.browser.store
															.load();
													TextoCMS.Utils
															.displayNotification(
																	"Succ&egrave;s",
																	'Le fichier a &eacute;t&eacute; t&eacute;l&eacute;charg&eacute;',
																	null,
																	idBrowser);

													return;
												}

												uploadForm.close();
												Ext.Msg.show({
													title : 'Nouveau fichier',
													msg : result.error,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR,
													scope : this
												});
											},
											failure : function(form, action) {
											}
										});

					},
					/**
					 * 
					 * @param btn
					 */
					deleteFile : function(btn) {
						if (this.currentView == this.getIconBrowser())selection = this.getIconBrowser()
						.getSelectionModel().getSelection();
				else selection = this.currentView.getSelectionModel().getSelection();
		
						if (selection.length == 0)
							return;

						//var record = selection[0];
						
						
						
						Ext.Msg
								.show({
									title : 'Suppression '+(selection.length>1?'de plusieurs fichier':'du fichier "'
											+ selection[0].get('name') + '"'),
									msg : 'Attention, la suppression est irr&eacute;versible.<br />Souhaitez-vous continuer ?',
									buttons : Ext.Msg.OKCANCEL,
									icon : Ext.Msg.WARNING,
									scope : this,
									fn : function(btn) {

										if (btn !== 'ok') return;
										
										var pathString =[]; 
										Ext.Array.each(selection,function(rec){
										
											pathString.push(rec.get('path'));
											
										}, this);
										
										
										pathString = pathString.join('|');
										
										
											this
													.ajax(
															DEFAULT_ADMIN_URL,
															{
																API : 'Application_Model_FileManager',
																APICall : 'deleteFile',
																path : pathString,
																id_site :TextoCMS.siteId
															},
															function(response) {
																
																Ext.Array.each(selection, function(record){
																
																this
																		.getIconBrowser().store
																		.remove(record);
																
																if(this.getInfoPanel().record==record)this.getInfoPanel().loadRecord(null);
																
																}, this);
																this
																		.getDeleteFileBtn()
																		.setDisabled(
																				true);
																var msg = selection.length>1?"Les fichiers ont bien &eacute;t&eacute; supprim&eacute;s.":"Le fichier a &eacute;t&eacute; supprim&eacute;.";
																
																TextoCMS.Utils
																		.displayNotification(
																				"Succ&egrave;s",
																				msg,
																				null,
																				'mediaPanel');

															}.bind(this));

									}

								});

					},
					/**
					 * 
					 * @returns
					 */
					deleteFolder : function() {
						if (this.currentView == this.getIconBrowser())selection = this.getIconBrowser()
								.getSelectionModel().getSelection();
						else selection = this.currentView.getSelectionModel().getSelection();
												
						if (selection.length == 0)
							return;

						var record = selection[0];

						var node = this.getBrowserTree().store.getRootNode()
								.findChild("path", record.get("path"), true);
						if (node.childNodes.length > 0)
							return Ext.Msg.show({
								title : 'Suppression du r&eacute;pertoire "'
										+ node.get('name') + '"',
								msg : 'le r&eacute;pertoire n\'est pas vide !',
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR

							});
						Ext.Msg
								.show({
									title : 'Suppression du r&eacute;pertoire "'
											+ record.get('name') + '"',
									msg : 'Attention, la suppression est irr&eacute;versible.<br />Souhaitez-vous continuer ?',
									buttons : Ext.Msg.OKCANCEL,
									icon : Ext.Msg.WARNING,
									scope : this,
									fn : function(btn) {

										if (btn == 'ok')
											this
													.ajax(
															DEFAULT_ADMIN_URL,
															{
																API : 'Application_Model_FileManager',
																APICall : 'deleteFolder',
																folderPath : record
																		.get('path'),
																		id_site : TextoCMS.siteId
															},
															function(response) {
																if(this.getInfoPanel().record==record)this.getInfoPanel().loadRecord(null);
																var parentNode = node.parentNode;
																parentNode
																		.removeChild(
																				node,
																				true,
																				false,
																				false);
																if (parentNode.childNodes.length == 0) {
																	parentNode
																			.beginEdit();
																	parentNode
																			.set(
																					'isLeaf',
																					true);
																	parentNode
																			.endEdit();
																	parentNode
																			.collapse();

																}
																this
																		.reselectNode(parentNode);
																this
																		.getIconBrowser().store
																		.remove(record);
																this
																		.getDeleteFolderBtn()
																		.setDisabled(
																				true);
																var msg = "Le r&eacute;pertoire a &eacute;t&eacute; supprim&eacute;.";

																TextoCMS.Utils
																		.displayNotification(
																				"Succ&egrave;s",
																				msg,
																				null,
																				'mediaPanel');

															}.bind(this));

									}

								});

					},
					initPopinLink : function(infoPanel) {
						if (infoPanel.getEl().down('a.popinLink'))
							infoPanel.getEl().down('a.popinLink').on('click',
									this.openPopinLink,
									infoPanel.getEl().down('a.popinLink'));

					},

					/**
					 * 
					 * @param e
					 */
					openPopinLink : function(e, a) {
						e.stopEvent();

						Shadowbox.open({
							player : 'img',
							content : a.href
						});

					},
					getRightsItems : function() {
						var modules=[];
						Ext.getCmp('siteCombo').getStore().each(function(record){
							modules.push({
								text : record.get('label'),
								children : [],
								moduleName : 'medias.MediasController',
								//plugin : null,
								id_site : record.get('value'),
								type : 'folder'
							});
							
						},this);
					return Ext.getCmp('siteCombo').getStore().getCount()>1?modules:modules;
					},
					/**
					 * fix le bug sencha de déselction d'un noeud après mise à
					 * jour
					 * 
					 * @see http://www.sencha.com/forum/showthread.php?239674-BUG-selected-node-lose-CSS-selection-class-after-editing
					 * @param selectedRub
					 */
					reselectNode : function(selectedRub) {

						this
								.getBrowserTree()
								.getView()
								.getNode(selectedRub)
								.addClassName(
										'x-grid-row-selected x-grid-row-focused');

					},
					/**
					 * upload des fichiers via filereader API
					 * @param overwrite int
					 */
					doUploadFiles:function(overwrite){
						var me =this;
						if(this.FileReaderStore.getCount()<=this.selectedFileIndex) {
							
							if(this.mysMask)this.myMask.hide();
							this.myMask=null;
							this.getFileReaderDataview().getSelectionModel().setLocked(false);
							
							return;
							//this.getUploadForm().close();
						}
						//if(!this.myMask)this.myMask = new Ext.LoadMask(this.getUploadForm(), {msg:"Veuillez patienter..."});
						//this.myMask.show();
						
						
						
						if(overwrite==undefined) overwrite=0;
						
						if(this.currentNode)this.currentNode.unmask();
						
						this.getFileReaderDataview().findParentByType('window').down('button[action=add]').setDisabled(true);
						
						
						
						var fileRec=this.FileReaderStore.getAt(this.selectedFileIndex),dataview=this.getFileReaderDataview(),node=Ext.get(dataview.getNode(fileRec));
						
						dataview.getSelectionModel().deselectAll();
						dataview.getSelectionModel().setLocked(true);

						
						node.mask('chargement');
						
						this.currentNode=node;
						
						if (dataview.findParentByType('uploadform').browser.store.findExact('name', fileRec.get('fileName')) > -1&&overwrite==0) {

							Ext.Msg
									.show({
										title : 'Nouveau fichier',
										msg : 'Le fichier '+fileRec.get('fileName')+' existe d&eacute;j&agrave;<br />Voulez-vous &eacute;craser la version actuelle ?',
										buttons : Ext.Msg.OKCANCEL,
										icon : Ext.Msg.WARNING,
										scope : this,
										fn : function(btn) {
											if (btn == 'ok') {
											return	this.doUploadFiles(1);
											}
											
											//me.getUploadForm().store.removeAt(0);
											 me.currentNode.unmask();
											 me.currentNode.update('<div class="errorDownload"></div>');
											 me.currentNode.addCls('error');
											
									 		  me.selectedFileIndex++;
											  me.doUploadFiles();
										}
									});

							return;
						}
						
						this.xhr = new XMLHttpRequest();

						this.xhr.open("POST", "/admin/doupload");
						var datas = new FormData();
						datas.append('fichier',fileRec.get('fileData'));
						datas.append('overwrite',overwrite);
						datas.append('parentRoot', this
								.getUploadForm()
								.down('form').baseParams.parentRoot);
						datas.append('baseFolder', this
								.getUploadForm()
								.down('form').baseParams.baseFolder);
						datas.append('id_site',TextoCMS.siteId);
					
						
						 this.xhr.onreadystatechange = function() {
					         if (me.xhr.readyState == 4 && me.xhr.status == 200) {
					         	var json = me.xhr.responseText.evalJSON();
					         						         	
							 	if(json.success=="false"&&json.fileExists==true){
					         		Ext.Msg
									.show({
										title : 'Nouveau fichier',
										msg : 'Le fichier '+json.error+'<br />Voulez-vous &eacute;craser la version actuelle ?',
										buttons : Ext.Msg.OKCANCEL,
										icon : Ext.Msg.WARNING,
										scope : this,
										fn : function(btn) {
											if (btn == 'ok') {
												return me.doUploadFiles(1);
											}
											
											//me.getUploadForm().store.removeAt(0);
									 		  me.selectedFileIndex++;
											  me.doUploadFiles();
										}
									});

							return;
					         		
					         		
					         	}
							 	
							 	else if(json.success=="false"){
							 		me.currentNode.unmask();
									  me.currentNode.update('<div class="errorDownload"></div>');
							 		Ext.Msg
									.show({
										title : 'Erreur',
										msg : 'Le fichier '+fileRec.get('fileName')+'<br />a g&eacute;n&eacute;r&eacute; une erreur.'+json.error+(me.FileReaderStore.getCount()-1>me.selectedFileIndex?'<br />Voulez-vous continuer avec les autres fichiers ?':''),
										buttons : me.FileReaderStore.getCount()-1>me.selectedFileIndex?Ext.Msg.OKCANCEL:Ext.Msg.OK,
										icon : Ext.Msg.WARNING,
										scope : this,
										fn : function(btn) {
											if (btn == 'ok'&&me.FileReaderStore.getCount()-1>me.selectedFileIndex) {
												me.selectedFileIndex++;
												 return me.doUploadFiles();
											}
											 
											me.getFileReaderDataview().getSelectionModel().setLocked(false);
											//me.getUploadForm().store.removeAt(0);
									 		 
										}
									});
							 		
							 	}
							 	
							 	else if(json.success=="true") {
							 	
							 		
							 		if (dataview.findParentByType('uploadform').browser.store.findRecord('name', fileRec.get('fileName'))){
							 			
							 			var rec=dataview.findParentByType('uploadform').browser.findRecord('name', fileRec.get('fileName'));
							 			
							 			rec.beginEdit();
							 			
							 			Ext.Array.each(Object.keys(json.data), function(key){
							 				
							 				rec.set(key, json.data[key]);
							 				
							 			}, this);
							 			
							 			rec.endEdit();
							 			
							 		}else dataview.findParentByType('uploadform').browser.store.add(json.data);
							 		
							 		dataview.findParentByType('uploadform').browser.store.sort();
							 		dataview.refresh();
							 		if(me.currentNode){
										  me.currentNode.unmask();
										  me.currentNode.update('<div class="okDownload"></div>');
										  
									  }
							 		
							 		//me.getUploadForm().store.removeAt(0);
							 		  me.selectedFileIndex++;
									  me.doUploadFiles();
							 		
							 	}
					         	
					         	
					         }
						 };
						 this.xhr.upload.addEventListener("progress", function(e){ me.updateProgress(e) }, false);
						this.xhr.send(datas);
						
					},
					/**
					 * Monitore la progression des uploads
					 * @param e Event
					 */
					updateProgress:function(e){
						  if (e.lengthComputable) {
						    var currentState = parseInt((e.loaded / e.total) * 100);
						    
						    if(this.currentNode)this.currentNode.mask(currentState+'%');
						    
						//  if(currentState>=100){
							  
							  
							  
						    msg=this.selectedFileIndex+1<this.FileReaderStore.getCount()?'T&eacute;l&eacute;chargement'+(this.FileReaderStore.getCount()>1?'s':'')+' en cours '+ (this.selectedFileIndex+1)+' sur '+this.FileReaderStore.getCount():'T&eacute;l&eacute;chargement'+(this.FileReaderStore.getCount()>1?'s':'')+' termin&eacute;'+(this.FileReaderStore.getCount()>1?'s':'');
						    		
						    		this.getFileReaderDataview().findParentByType('window').down('[cls=form-statusbar]').showBusy(msg);
						  //};
						    
						  }
					},
					/**
					 * trigger sur le changement de sélection sur
					 * @param view Ext.view.View
					 * @param selected array records selectionnés
					 */
					mediaSelectionChanged:function(view, selected){
						
						this.getDeleteFolderBtn().hide()
						Ext.Array.each(selected, function(rec){
						if(rec.get('type')=="folder")this.getDeleteFolderBtn().show();//this.getIconBrowser().deselect(rec);
							
						}, this);
						
						var newSelection = this.getIconBrowser().getSelectionModel().getSelection();
						
						this.getDeleteFileBtn().setDisabled(newSelection.length==0);
						
					},
					/**
					 * trigger quand la sélection change
					 * @param view Ext.view.View
					 * @param selected array records selectionnés
					 */
					selectionChanged:function(view, selected) {
						
						console.log(selected);
						
						this.getFileReaderDataview().ownerCt.down('[cls=deleteUploadSelection]').setDisabled(
								selected.length == 0);

					},
					/**
					 * initialisation du Drag and drop pour les fichiers
					 */
					
					initFileReaderDataview:function(){
						
						this.FileReaderStore = this.getFileReaderDataview().getStore();
						this.FileReaderStore.un('add', this.displayButtonState, this);
						this.FileReaderStore.un('remove', this.displayButtonState,
								this);
						this.FileReaderStore.on('add', this.displayButtonState, this);
						this.FileReaderStore.on('remove', this.displayButtonState,
								this);
						
						
						Event
						.stopObserving(
								$('dragload'),
								'dragover',
								this.handleDragOver
										.bindAsEventListener(this),
								false);
				Event
						.stopObserving(
								$('dragload'),
								'drop',
								this.handleFileSelect
										.bindAsEventListener(this),
								false);
				Ext
						.get(
								'fileUploadField')
						.removeListener(
								'change',
								this.selectionUploadFieldChanged,
								this)
						
						Event
						.observe(
								$('dragload'),
								'dragover',
								this.handleDragOver
										.bindAsEventListener(this),
								false);
				Event
						.observe(
								$('dragload'),
								'drop',
								this.handleFileSelect
										.bindAsEventListener(this),
								false);
				Ext
						.get(
								'fileUploadField')
						.addListener(
								'change',
								this.selectionUploadFieldChanged,
								this)
						
					},
					/**
					 * callback dragover
					 */
					handleDragOver : function(e) {

						e.preventDefault();
						return false;

					},
					/**
					 * callback drop de fichiers
					 */
					
					handleFileSelect : function(e) {
						e.stopPropagation();
						e.preventDefault();
					
						
						this.addFilesToStore(e.dataTransfer.files);
					},
					
					/**
					 * ajoute les fichiers au store du dataview de la fenêtre d'upload
					 * @param fileList array files objet
					 */
					addFilesToStore : function(fileList) {
						
						regExp=null;
						
						
						var browser = this.getFileReaderDataview().findParentByType('uploadform').browser;
						
						
						var filter=browser.filter;
						console.log(browser, filter);
						if(filter!==null&&filter!==""&&filter!==undefined){
						
							filterArray=filter.split(';');
							var extArray = [];
							Ext.Array.each(filterArray, function(key){
								
								
								if(typeof arrayExt[key]=="object")extArray.push(arrayExt[key].join('|'));
								else extArray.push(key);
								
								
							},this);
								regExtension = extArray.join('|');

								var regExp = new RegExp('([a-zA-Z0-9_-]+)(\.('
										+ regExtension + '))$', 'i')
						}

						
						Ext.Array.each(fileList, function(elt, index) {

							var reader = new FileReader();

							var me = this;
							if (me.FileReaderStore.findExact('fileName', elt.name) > -1)
								return;

							if (elt.type.indexOf('image') > -1) {

								if(regExp!==null&&!regExp.test(elt.name)&&filter!=='all')return;
								
								reader.onload = (function(theFile) {

									return function(e) {

										me.FileReaderStore.add({
											fileName : elt.name,
											fileData : elt,
											bgImage : e.target.result
										});
										return false;
									};
								})(elt);

								reader.readAsDataURL(elt);
							} else if (elt.type !== "") {

								if(regExp!==null&&!regExp.test(elt.name)&&filter!=='all')return;
								
								var match = /\.([a-zA-Z]{2,5})/;
								var test = match.exec(elt.name);

								this.FileReaderStore.add({
									fileName : elt.name,
									fileData : elt,
									bgImage : '/admin/img/' + test[1]
											+ 'Big.png'
								});

							}

						}, this);

						return false;

					},
					displayButtonState : function() {

						
						this.getFileReaderDataview().findParentByType('window').down('button[action=add]').setDisabled(
								this.FileReaderStore.getCount() == 0);
						if (this.FileReaderStore.getCount() == 0){
												
							this.getFileReaderDataview().findParentByType('window').down('[cls=form-statusbar]').setStatus({text:'&nbsp;-'});
							return;
							
						}
						var total = 0;
						this.FileReaderStore.each(function(record) {

							total += record.get('fileData').size;

						}, this);

												
						this.getFileReaderDataview().findParentByType('window').down('[cls=form-statusbar]').setStatus({
							text : this.FileReaderStore.getCount() + ' fichier'
									+ (this.FileReaderStore.getCount() > 1 ? 's' : '')
									+ ' - ' + Ext.util.Format.fileSize(total),
							iconCls : 'ok-icon'
						});

					},
					deleteSelection : function() {
						if (this.getFileReaderDataview().getSelectionModel().getSelection().length == 0)
							return;

						Ext.Array.each(this.getFileReaderDataview().getSelectionModel()
								.getSelection(), function(record) {

							this.FileReaderStore.remove(record);

						}, this);
						
						this.FileReaderStore.commitChanges();
						
					

					},
					openBrowser : function(btn) {

						Ext.get('fileUploadField').dom.click();

					},

					selectionUploadFieldChanged : function() {
						
					
						
						this
								.addFilesToStore(Ext.get('fileUploadField').dom.files);
						Ext.get('fileUploadField').dom.setValue(null);
					}

				});