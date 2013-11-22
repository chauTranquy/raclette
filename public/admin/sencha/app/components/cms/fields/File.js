/**
 * IconBrowser V2.0 CTR Septembre 2012
 */

Ext
		.define(
				'TextoCMS.components.cms.fields.File',
				{
					extend : 'Ext.panel.Panel',
					fieldName : 'Champ fichier',
					alias : 'widget.file',
					rights : {
						write : 1
					},
					layout : 'column',
					selectedRecord : null,
					border : false,
					margin : '0 0 5 0',
					value : null,
					cb : Ext.emptyFn,
					displayFile : true,
					baseFolder : null,
					displayAllFile : false,
					filter : null,
					defaults : {
						border : false,
						bodyStyle : 'background-color:transparent',
						defaults : {
							bodyStyle : 'background-color:transparent',
							border : false

						}
					},

					initComponent : function() {
						this.classInstance = TextoCMS.classes.Ajax;
						this.fileSupport = window.File && window.FileReader
								&& window.FileList && window.Blob;

						
						
						this.tpl = new Ext.XTemplate(

								'<tpl for=".">',

								'<tpl if="this.isImage(ext)">',
								'<div data-qtip="{[this.qtip(values.name,values.size)]} <br />cliquez pour visualiser le fichier">',
								'<a data-url="{[this.getUrl(values.path, values.baseFolder)]}" class="file lightbox" title="{[this.qtip(values.name,values.size)]}">',
								(!Ext.isIE6 ? '<div style="width:160px; height:100px; background:url({[this.makeThumbUrl(values.path, values.ext)]}) no-repeat 50% 50%; background-size:contain;" ></div>'
										: '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{[this.makeThumbUrl(values.path, values.ext, values.baseFolder)]}\')">{values.baseFolder}</div>'),
								'</a></div></tpl>',
								'<tpl if="this.isImage(ext)==false&&!this.isFolder(ext)">',
								'<div data-qtip="{[this.qtip(values.name,values.size)]} <br />cliquez pour visualiser le fichier">',
								(!Ext.isIE6 ? '<div style="width:160px; height:100px; background:url(img/{[this.iconUrl(values.ext)]}) no-repeat 50% 50%; background-size:contain;"></div>'
										: '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.gif\')"></div>'),
								'</div></tpl>',
								'<tpl if="this.isFolder(ext)"><div>{path}</div></tpl>',
								'</div>',
								'</tpl>',
								{
									compiled : true,
									scope : this,
									makeThumbUrl : function(path, ext,
											baseFolder) {

										return '/image/thumb/150/'
												+ ext.toLowerCase()
												+ '/'
												+ path.replace('.' + ext, '')
												+ (this.baseFolder !== null
														&& this.baseFolder !== undefined ? '?base='
														+ this.baseFolder
														: '');

									}.bind(this),
									isFolder : function(ext) {

										return ext == 'folder';

									},
									getUrl : function(path, baseFolder) {
										if (baseFolder == null
												|| baseFolder == undefined)
											return '/medias/' + path;

										return (baseFolder != '/' ? baseFolder
												: '')
												+ path;

									},
									isImage : function(ext) {
										if (!ext)
											return false;
										arrayImageExt = arrayExt.image;
										return (arrayImageExt.indexOf(ext
												.toLowerCase()) > -1);

									}.bind(this),
									qtip : function(name, size) {

										return name
												+ (size ? ' - ' + size : '');

									},
									iconUrl : function(ext) {
										var extArray = $H(arrayExt).toArray()
												.flatten();
										extArray = Ext.Array.merge(extArray,
												otherFileExt);
										extArray.push('folder');

										if (extArray.indexOf(ext) > -1) {
											return ext + 'Big.png';

										}

										if (arrayTTF.indexOf(ext) > -1)
											return 'fontBig.png';
										return 'otherBig.png';

									}
								}

						);

						if (this.extraParams && this.extraParams.filter) {
							this.filter = this.extraParams.filter;
							this.fieldLabel += "("
									+ this.filter.split(';').join(',') + ")";
						}

						this.labelWidth = (this.labelWidth || 150);

						this.addButton = Ext.create('Ext.button.Button', {
							iconCls : 'addBtn',
							tooltip : 'Ajouter un fichier',
							scope : this,
							hidden : this.rights.write == 0,
							handler : this.openBrowser

						});

						this.removeButton = Ext.create('Ext.button.Button', {
							iconCls : 'removeBtn',
							tooltip : 'Supprimer le fichier',
							hidden : this.value == null,
							scope : this,
							hidden : this.rights.write == 0,
							handler : this.resetValue

						});

						this.textField = Ext.create('Ext.form.field.Text', {
							name : this.name,
							hidden : true,
							allowBlank : this.allowBlank,
							value : this.value,
							mainFieldCT : this,
							listeners : {
								scope : this,
								change : this.displayMini
							}

						});

						displayHtml = '<div><div style="width:160px; height:100px; background:none no-repeat 50% 50%; background-size:contain;"></div></div>';
						
						if (this.value) {
							var regExp = new RegExp(/\.([0-9a-z]+)$/i);// '([a-zA-Z0-9_-]+)(\.([a-zA-Z]+))$','i');
							var fileNameArray = this.value.split('/');
							var regResult = regExp.exec(this.value);
							var ext = regResult ? regResult[1] : 'folder';
							this.selectedRecord = {
								data : {
									path : this.value,
									ext : ext,
									name : fileNameArray[fileNameArray.length - 1],
									baseFolder : this.baseFolder

								}
							};

							displayHtml = this.tpl
									.apply(this.selectedRecord.data);
						};
					
						this.contentPanel = Ext.create('Ext.panel.Panel', {
							xtype : 'panel',
							//bodyPadding : 5,
							border:false,
							width : 160,
							html : this.value,
							height : 100,
							margin : '0 5',
							listeners : {
								scope : this,
								click : {
									 element: 'el', // bind to the underlying el property on the panel
							            fn: this.showFile
									
								}
							}
						});
						this.width = 170 + this.labelWidth + 100;

						this.items = [
								{
									width : this.labelWidth,
									items : [ {
										xtype : 'panel',
										html : this.fieldLabel
												+ (this.allowBlank ? '' : '*')
												+ ' :',
										width : this.labelWidth,
										style : 'text-align:right'
									} ]
								},
								{
									width : 170,
									items : [ this.textField, this.contentPanel ]
								}, {
									width : 100,
									height : 50,
									layout : {
										type : 'vbox',
										align : 'center'
									},
									defaults : {
										border : false
									},
									items : [ {
										items : [ this.addButton ]
									}, {
										items : [ this.removeButton ]
									} ]
								} ];

						this.listeners = {
							scope : this,
							afterrender : function(panel) {
								this.contentPanel.update(displayHtml);
								
							}
						};

						this.callParent(arguments);
					},

					showFile : function(btn) {
						
						if (!this.selectedRecord)
							return;
						console.log(this.selectedRecord);
						
						var ext = this.selectedRecord.data.ext;
					var siteRec=	Ext.getStore('SitesStore').findRecord('id_site',Ext.getCmp('siteCombo').getValue());
					console.log(siteRec);
						arrayImageExt = arrayExt.image;
						if(arrayImageExt.indexOf(ext
								.toLowerCase()) == -1) return;
						//console.log(this.selectedRecord.data.path, '/'+siteRec.raw.media_dir+'/'+this.selectedRecord.data.path);
						var path=(this.selectedRecord.data.baseFolder!==""&&this.selectedRecord.data.baseFolder!==null&&this.selectedRecord.data.baseFolder!==undefined?this.selectedRecord.data.baseFolder:'/'+siteRec.raw.media_dir)+'/'+this.selectedRecord.data.path;
						console.log('path'+path);
						
						Shadowbox.open({
							player : 'img',
							//title : this.selectedRecord.data.name,
							content : path
						});
						

					},
					openBrowser : function() {
						if (this.rights.write == 0)
							return;

						this.createFolderBtn = Ext
								.create(
										'Ext.button.Button',
										{
											tooltip : 'cr&eacute;er un r&eacute;pertoire',
											iconCls : 'addFolder',
											scope : this,
											handler : this.makeDir,
											disabled : true
										});
						var items = [ this.createFolderBtn ];

						this.deleteFolderBtn = Ext.create('Ext.button.Button',
								{
									xtype : 'button',
									tooltip : 'Supprimer le r&eacute;pertoire',
									iconCls : 'deleteFolder',
									scope : this,
									tooltip : 'Supprimer',
									scope : this,
									handler : this.deleteFolder,
									disabled : true
								});

						this.deleteFileBtn = Ext.create('Ext.button.Button', {
							tooltip : 'Supprimer le fichier',
							disabled : true,
							iconCls : 'deleteFile',
							scope : this,
							handler : this.deleteFile
						});

						this.uploadFileBtn = Ext.create('Ext.button.Button', {
							tooltip : 'Nouveau fichier',
							scope : this,
							handler : this.displayUploadForm,
							disabled : true,
							iconCls : 'addFile'
						});

						items.push(this.deleteFolderBtn, {
							xtype : 'tbspacer',
							width : 120
						}, this.uploadFileBtn, this.deleteFileBtn);

						this.panel = Ext.widget({
							xtype : 'browsertree',
							region : 'west',
							width : 150,
							baseFolder : this.baseFolder,
							height : 350,
							layout : 'fit',
							border : false,
							// autoWidth:true,
							loadMask : true,

							listeners : {
								scope : this,

								afterlayout : function(tree) {

									// tree.getView().getSelectionModel().select(tree.store.getRootNode().firstChild);
									// tree.fireEvent('itemclick',
									// tree.getView(),
									// tree.store.getRootNode().firstChild);

									// if($$('#'+tree.body.dom.id+'
									// table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+'
									// table.x-grid-table-resizer')[0].setStyle({width:'100%'});

								},

								itemclick : this.getFolderDetail,
								expand:this.folderExpanded,
								remove : function() {

									return false;

								}

							}

						});

						this.panel.store.on('load', Ext.bind(
								this.selectRootNode, this));

						this.win = Ext.create('Ext.window.Window', {
							modal : true,
							layout : 'border',
							width : 500,
							height : 400,
							tbar : items,
							title : 'Choisissez '
									+ (this.displayFile ? 'un fichier ' /*
																		 * +
																		 * (this.filter!=null?this.filter:'')
																		 */
											: ' un r&eacutepertoire'),
							items : [ this.panel, {
								xtype : 'panel',
								region : 'center',
								width : 350,
								autoScroll : true
							} ],
							buttons : [ {
								text : 'Choisir',
								action : 'save',
								handler : this.selectFile,
								disabled : true,
								scope : this
							}, {
								text : 'Fermer',
								scope : this,
								handler : function() {
									this.win.close();
								}
							} ]

						});

						this.win.show();

					},
					selectRootNode : function() {

						var node = this.selectedRub?this.selectedRub:this.panel.store.getRootNode().firstChild;
						
						this.panel.getView().getSelectionModel().select(node
								);
						this.panel.fireEvent('itemclick', this.panel.getView(),
								node);

					},
					getFolderDetail : function(view, record) {

						var panel = this.win.query('browsertree')[0];
						var store = panel.store;
						var node = store.getRootNode().findChild("path",
								record.get("path"), true);
						this.selectedRub = node;

						this.createFolderBtn.setDisabled(false);
						this.win.query('button[action=save]')[0]
								.setDisabled(true);
						this.deleteFolderBtn.setDisabled(node.parentNode
								.isRoot());
						this.uploadFileBtn.setDisabled(false);

						var panel = this.win.query('panel[region=center]')[0];

						panel.removeAll();

						panel
								.add({

									xtype : 'iconbrowser',
									displayFile : this.displayFile,
									baseFolder : this.baseFolder,
									displayAllFile : this.displayAllFile,
									root : record.get('path'),
									layout : 'fit',
									filter : this.filter,
									bodyStyle : 'background-color:transparent',
									id : 'img-chooser-view2',
									listeners : {
										scope : this,
										itemclick : function(view, record) {
											if (record.get('type') == 'file') {
												this.selectedRecord = record;
											} else if (record.get('type') == 'folder') {
												this.selectedRecord = record;
											}

											this.deleteFileBtn
													.setDisabled(record
															.get('type') == 'folder'
															&& this.displayFile);

											this.win
													.query('button[action=save]')[0]
													.setDisabled(record
															.get('type') == 'folder'
															&& this.displayFile);
										},
										itemdblclick : this.navigateBrowser
									}
								});

					},
					navigateBrowser : function(view, record) {
						if (!record.get('type') == "folder")
							return;
						var node = this.folderExpanded(record);
						if(!node){
							
							this.selectedRub.expand();
							
							return;
							
						}
							
											},
					folderExpanded:function(record){
						var panel = this.win.query('browsertree')[0];
						var store = panel.store;
						var node = store.getRootNode().findChild("path",
								record.get("path"), true);
						if(!node)return false;
						node.expand();
						this.selectedRub = node;
						this.deleteFolderBtn.setDisabled(node.isRoot());
						this.deleteFileBtn.setDisabled(true);
						this.uploadFileBtn.setDisabled();
						panel.selModel.select(node);
						this.getFolderDetail(null, node);
					},
					
					selectFile : function() {
						this.textField
								.setValue(this.selectedRecord.get('path'));
						this.textField.validate();
						this.win.close();
						this.removeButton.show();
						this.cb(this.selectedRecord);
					},
					resetValue : function() {

						this.selectedRecord = null;
						this.textField.setValue(null);
						this.textField.validate();
						this.tpl.overwrite(this.contentPanel.body,
								null);
						this.removeButton.hide();
					},
					displayMini : function() {

						this.contentPanel.update();
						if (!this.selectedRecord)
							return;


						this.tpl.overwrite(this.contentPanel.body,
								this.selectedRecord.data);
						
					},

					makeDir : function() {

						var win = Ext
								.create(
										"Ext.window.Window",
										{
											modal : true,

											autoHeight : true,
											layout : 'fit',
											title : "Nouveau r&eacute;pertoire",
											items : [ {
												xtype : 'form',
												bodyStyle : 'background-color:transparent',
												border : false,

												listeners : {
													scope : this,
													validitychange : function(
															form, isValid) {

														var btn = win
																.query('button[action=save]')[0];
														btn
																.setDisabled(!isValid);

													}

												},
												autoHeight : true,
												padding : '5',
												// height:250,
												items : [ {
													xtype : 'textfield',
													name : 'folderName',
													labelWidth : 120,
													labelStyle : 'text-align:right',
													width : 300,
													allowBlank : false,
													fieldLabel : 'Nom du r&eacute;pertoire',
													minLengh : 3,
													regex : /^([a-zA-Z]{1}[a-zA-Z0-9_-]+)$/,
													regexText : 'Le nom du r&eacute;pertoire doit uniquement comporter des caract&egrave;res alphanum&eacute;riques,<br />des \'-\' ou des \'_\' et aucun espace'
												} ]
											} ],
											buttons : [
													{
														text : 'Cr&eacute;er',
														disabled : true,
														scope : this,
														handler : function() {
															var form = win
																	.down('form');

															var params = form
																	.getForm()
																	.getValues();
															params.API = 'Application_Model_FileManager';
															params.APICall = 'makeFolder';
															params.parentFolder = this.selectedRub
																	.get('path');
															params.baseFolder = this.baseFolder;

															form
																	.getForm()
																	.submit(
																			{
																				scope : this,
																				url : '/admin/getjsondata?format=json',
																				params : params,
																				waitMsg : 'Cr&eacute;ation en cours',
																				success : function(
																						form,
																						action) {
																					var result = action.result.result[0];
																					result.qtip = result.name;
																					result.text = result.name;
																					result.isLeaf = true;
																					result.treeRef = "treeFileManager";
																					var newNode = Ext.ModelManager
																							.create(
																									result,
																									'TextoCMS.model.medias.BrowserTreeModel');
																					this.selectedRub
																							.appendChild(newNode);
																					var panel = this.win
																							.query('browsertree')[0];
																					var store = panel.store;
																					store
																							.sort();

																					// if(this.panel&&this.panel.body&&$$('#'+this.panel.body.dom.id+'
																					// table.x-grid-table-resizer').length>0)$$('#'+this.panel.body.dom.id+'
																					// table.x-grid-table-resizer')[0].setStyle({width:'100%'});
																					this
																							.getFolderDetail(
																									null,
																									this.selectedRub);
																					this.selectedRub
																							.expand();

																					win
																							.close();

																				}
																						.bind(this),
																				failure : function(
																						form,
																						action) {

																					Ext.Msg
																							.show({
																								title : 'Erreur lors de la cr&eacute;tion du r&eacute;pertoire',
																								msg : action.result.error,
																								buttons : Ext.Msg.OK,
																								icon : Ext.Msg.ERROR

																							});

																				}
																			});

														},
														action : 'save'
													}, {
														text : "Fermer",
														handler : function() {
															win.close();
														}
													} ]

										});

						win.show();

					},
					deleteFolder : function() {

						if (this.selectedRub.childNodes.length > 0)
							return Ext.Msg.show({
								title : 'Suppression du r&eacute;pertoire "'
										+ this.selectedRub.get('name') + '"',
								msg : 'le r&eacute;pertoire n\'est pas vide !',
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR

							});

						Ext.Msg
								.show({
									title : 'Suppression du r&eacute;pertoire "'
											+ this.selectedRub.get('name')
											+ '"',
									msg : 'Attention, la suppression est irr&eacute;versible.<br />Souhaitez-vous continuer ?',
									buttons : Ext.Msg.OKCANCEL,
									icon : Ext.Msg.WARNING,
									scope : this,
									fn : function(btn) {

										if (btn == 'ok')
											this.classInstance
													.ajaxRequest(
															'/admin/getjsondata?format=json',
															{
																API : 'Application_Model_FileManager',
																APICall : 'deleteFolder',
																folderPath : this.selectedRub
																		.get('path'),
																baseFolder : this.baseFolder
															},
															function(response) {
																var parentNode = this.selectedRub.parentNode;
																parentNode
																		.removeChild(
																				this.selectedRub,
																				true,
																				false,
																				false);
																this.panel.selModel
																		.select(parentNode);
																this
																		.getFolderDetail(
																				null,
																				parentNode);

															}.bind(this));

									}

								});

					},
					displayUploadForm : function() {

						var form = Ext.create(
								'TextoCMS.view.medias.UploadForm', {
									filter : this.filter,
									browser : Ext.getCmp('img-chooser-view2')
								}).show();

						form.down('form').baseParams.parentRoot = this.selectedRub
								.get('path');

						form.down('form').baseParams.baseFolder = this.baseFolder;

						return;

					},
					deleteFile : function(btn) {

						msg = 'Attention, la suppression est irr&eacute;versible.<br />Souhaitez-vous continuer ?';

						params = {
							API : 'Application_Model_FileManager'
						};
						params.baseFolder = this.baseFolder;

						switch (this.selectedRecord.get('type')) {
						case "folder":
							title = 'Suppression du r&eacute;pertoire "'
									+ this.selectedRecord.get('name') + '"';
							params.APICall = "deleteFolder";
							params.folderPath = this.selectedRecord.get('path');

							cb = function(response) {
								var node = this.panel.store
										.getRootNode()
										.findChild(
												"path",
												this.selectedRecord.get("path"),
												true);
								this.selectedRub.removeChild(node, true, false,
										false);
								this.getFolderDetail(null, this.selectedRub);
							}.bind(this);

							break;

						default:

							title = 'Suppression du fichier "'
									+ this.selectedRecord.get('name') + '"';
							params.APICall = "deleteFile";
							params.path = this.selectedRecord.get('path');

							cb = function() {
								this.getFolderDetail(null, this.selectedRub);
							}.bind(this);

							break;
						}

						Ext.Msg.show({
							title : title,
							msg : msg,
							buttons : Ext.Msg.OKCANCEL,
							icon : Ext.Msg.WARNING,
							scope : this,
							fn : function(btn) {

								if (btn == 'ok')
									this.classInstance.ajaxRequest(
											'/admin/getjsondata?format=json',
											params, cb);

							}
						});

					},
					setValue : function(value) {

						if (value == null)
							return;
						this.value = value;
						var regExp = new RegExp(/\.([0-9a-z]+)$/i);// '([a-zA-Z0-9_-]+)(\.([a-zA-Z]+))$','i');

						var fileNameArray = this.value.split('/');
						var regResult = regExp.exec(this.value);
						var ext = regResult ? regResult[1] : 'folder';

						this.selectedRecord = {
							data : {
								path : value,
								ext : ext,
								name : fileNameArray[fileNameArray.length - 1],
								baseFolder : this.baseFolder

							}
						};

						html = this.tpl.apply(this.selectedRecord.data);

						this.contentPanel.update(html);
						
					}

				});