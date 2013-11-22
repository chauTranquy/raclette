/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.RichText' ,{					// extend:'Ext.form.field.TextArea',
					extend : 'Ext.panel.Panel',
					alias : 'widget.richtext',
					fieldName : 'Texte enrichi',
					layout : 'column',
					margin : '0 0 5 0',
					autoHeight : true,
                                        bodyStyle:'background:transparent',
					mediaObj : {},
					rights : {
						write : 1
					},
					height : 400,
					border : false,
					defaults : {
						border : false,
						autoHeight : true,
                                                 bodyStyle:'background:transparent',
						defaults : {
							border : false
						}
					},

					initComponent : function() {
					this.width = this.width + (this.labelWidth || 150)
								|| 800;
						this.labelWidth = this.labelWidth || 150;
						if (this.extraParams && this.extraParams.height != null)
							this.height = Number(this.extraParams.height);

						this.textArea = Ext.create('Ext.form.field.TextArea', {
							hidden : true,
							name : this.name,
							allowBlank : this.allowBlank,
							value : this.value

						});
                                                
                                             
                                                
						this.contentPanel = Ext.create('Ext.panel.Panel', {
							xtype : 'panel',
							html : this.value,
							border : true,
							bodyPadding : 5,
							collapsible : false,
							height : this.height,
							autoScroll : true,
                                                         bodyStyle:'background:white',
							width : this.width - this.labelWidth - 5,
							margin : '0 0 0 5',
							tbar : [ {
								disabled : this.rights.write == 0,
								hidden:this.rights.write==0,
								text : 'editer',
								tooltip : 'Ouvrir l\'&eacute;diteur HTML',
								scope : this,
								handler : this.openCKEditor,
								iconCls : 'editBtn'
							},'-' ],
							bodyCls : 'RichTextEditor',
							listeners : {
								scope : this,
								afterrender : this.desactiveLink
							}

						});

						this.items = [
								{
									width : this.labelWidth,
									autoHeight : true,
									items : [ {
										xtype : 'panel',
										html : this.fieldLabel
												+ (this.allowBlank ? '' : '*')
												+ ' :',
										style : 'text-align:right',
                                                                                bodyStyle:'background:transparent'
									} ]
								},
								{
									flex : 1,
									autoHeight : true,
									items : [ this.textArea, this.contentPanel ]
								} ];

						this.callParent(arguments);

					},
					openCKEditor : function(btn) {

						if (this.rights.write == 0)
							return;

						this.editorArea = Ext.create('Ext.form.field.TextArea',
								{
									xtype : 'textareafield',
									name : 'richText_tf_' + this.name,
									value : this.textArea.getValue(),
									width : '100%',
									height : '100%',
									layout:'fit'
								});

						this.validBtn = Ext.create('Ext.button.Button', {
							text : "Valider",
							handler : this.validateContent,
							scope : this
						});
						this.closeBtn = Ext.create('Ext.button.Button', {
							text : "Fermer",
							handler : this.closeEditor,
							scope : this
						});

						this.win = Ext.create('Ext.window.Window', {
							modal : true,
							title : 'Editer le texte HTML',
							width : 650,
							height : 500,
							bodyPadding : 5,
							resizable : true,
							maximizable:true,
							items : [ this.editorArea ],
							listeners : {
								scope : this,
								resize:function(win){
									
									
									
									if(this.editor) {
										var winHeight=win.body.getHeight();
										Ext.get(this.editor.container.getId()).setHeight(winHeight);
										
										Ext.get(this.editor.container.getId()).down('.cke_inner').down('.cke_contents').setHeight(winHeight-(125));
									}
									
									
								},
								show : function() {
									
									
									this.editor = CKEDITOR.replace(
											this.editorArea.getInputId(), {
												toolbar : 'Custom',
												contentsCss : '/admin/_css/editorStyle.css'
											});

									this.editor.on('instanceReady',
											function(e) {
										
										this.editor.on( 'doubleclick', function( evt ) {
											var element = evt.data.element;
												if ( element.is( 'img' ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() ){	
													evt.data.dialog=null;
													this.editor.execCommand('addmedias', this.editor);				
											}	else if(element.is('a')&& !element.data( 'cke-realelement' ) && !element.isReadOnly() ){
												
												evt.data.dialog=null;
												this.editor.execCommand('cmslink', this.editor);
												
											}
										}, this, null, 100000) 
										
											}.bind(this));

									this.editor.componentInstance = this;
								},
								beforeclose:function(){
									this.editor.destroy();
									this.editor=null;
					
									
								}
							},
							buttons : [ this.validBtn, this.closeBtn ]

						});

						this.win.show();

					},
					validateContent : function(btn) {

						content = this.editor.getData();
						this.textArea.setValue(content);
						this.contentPanel.update(content);
						this.desactiveLink();
						this.closeEditor();

					},
					closeEditor : function(btn) {
						
						this.win.close();

					},
					openMediaWindow : function(editor) {

						var fakeImage = editor.getSelection()
								.getSelectedElement();
						this.mediaObj = {};
						if (fakeImage && fakeImage.getName() == "img") {

							var width = fakeImage.getAttribute('width') != undefined ? fakeImage
									.getAttribute('width')
									: fakeImage.getSize('width');
							var height = fakeImage.getAttribute('height') != undefined ? fakeImage
									.getAttribute('height')
									: fakeImage.getSize('height');

							this.mediaObj = {
								width : width,
								height : height,
								originalWidth : width,
								originalHeight : height,
								path : fakeImage.getAttribute('src').replace(
										'/medias/', ''),
								alt : fakeImage.getAttribute('alt'),
								align : fakeImage.getAttribute('align'),
								css : fakeImage.getAttribute('class')

							};

						}

						var store = Ext.create('Ext.data.Store', {
							fields : [ 'value', 'name' ],
							data : [ {
								"value" : null,
								"name" : "Aucun"
							}, {
								"value" : "left",
								"name" : "A gauche"
							}, {
								"value" : "right",
								"name" : "A droite"
							}, {
								"value" : "middle",
								"name" : "Au milieu"
							}, {
								"value" : "center",
								"name" : "Au centre"
							}

							]
						});

						var cbAlignement = Ext.create('Ext.form.ComboBox', {
							fieldLabel : 'Alignement de l\'image',
							store : store,
							queryMode : 'local',
							displayField : 'name',
							valueField : 'value',
							name : 'alignement',

							value : this.mediaObj.align
						});

						this.imgForm = Ext
								.create(
										'Ext.form.Panel',
										{
											border : false,
											bodyStyle : 'background:transparent',
											title : 'Image',
											defaults : {
												labelWidth : 150,
												labelStyle : "text-align:right; width:150px",
												bodyStyle : 'background:transparent',
												border : false
											},

											items : [
													{
														hidden : true,
														xtype : 'radiogroup',
														columns : [ 75, 75 ],
														fieldLabel : 'Type de fichier',
														labelWidth : 150,
														labelStyle : "text-align:right; width:150px",
														items : [
																{
																	boxLabel : 'local',
																	name : 'imageType',
																	inputValue : 1,
																	checked : true
																},
																{
																	boxLabel : 'distant',
																	name : 'imageType',
																	inputValue : 2
																}

														],
														listeners : {
															scope : this,
															change : function(
																	cbox, value) {
																

															}
														}
													},

													{
														xtype : 'file',
														name : 'intermedia',
														filter : 'image',
														fieldLabel : 'Image',
														cb : this.selectImage
																.bind(this),
														value : this.mediaObj.path
													},
													{
														xtype : 'fieldset',
														defaults : {
															border : false,
															bodyStyle : 'background-color:transparent'
														},
														title : 'Options',
														items : [
																{
																	xtype : 'text',
																	fieldLabel : 'Titre de l\'image',
																	labelStyle : 'text-align:right;',
																	name : 'alt',
																	value : this.mediaObj.alt
																},
																{
																	width : 100,
																	xtype : 'label',
																	html : 'Taille : ',
																	style : 'text-align:right; padding-top:2px;margin-right:5px;'
																},
																{
																	xtype : 'panel',
																	layout : 'column',
																	border : false,
																	bodySyle : 'background-color:transparent',
																	defaults : {
																		border : false,
																		bodyStyle : 'background-color:transparent'
																	},
																	items : [
																			{
																				width : 40,
																				html : '&nbsp;'
																			},
																			{
																				width : 155,
																				maxValue:Number.MAX_VALUE,
																				step:1,
																				xtype : 'numberfield',
																				allowDecimals : false,
																				allowNegative : false,
																				fieldLabel : 'Largeur',
																				name : 'larg',
																				labelStyle : 'width:50px',
																				allowBlank : false,
																				value : this.mediaObj.width,
																				listeners : {
																					scope : this,
																					spin : this.setDimensions
																				}
																			},
																			{
																				width : 155,
																				xtype : 'numberfield',
																				allowDecimals : false,
																				allowNegative : false,
																				fieldLabel : 'Hauteur',
																				name : 'haut',
																				maxValue:Number.MAX_VALUE,
																				step:1,
																				labelStyle : 'width:50px',
																				allowBlank : false,
																				value : this.mediaObj.height,
																				listeners : {
																					scope : this,
																					spin : this.setDimensions
																				}
																			},
																			{
																				xtype : 'button',
																				tootip : 'Conserver les proportions',
																				id : 'dimBtn',
																				iconCls : 'linkBtn',
																				actionValue : 1,
																				scope : this,
																				handler : function(
																						btn) {
																					if (btn.actionValue == 1) {
																						btn
																								.setIconCls('unlinkBtn');
																						btn.actionValue = 2;
																						btn
																								.setTooltip('Dimensions libres');
																						return;

																					}

																					btn
																							.setIconCls('linkBtn');
																					btn.actionValue = 1;
																					btn
																							.setTooltip('Conserver les proportions');

																				}
																			} ]
																},
																cbAlignement,
																{
																	xtype : 'textfield',
																	fieldLabel : 'Style css',
																	allowBlank : true,
																	name : 'css',
																	value : this.mediaObj.css
																} ]
													}

											],
											listeners : {
												scope : this,
												scope : this,
												validitychange : function(form,
														isValid) {

													this.winMedia
															.down(
																	'button[action=insert]')
															.setDisabled(
																	!isValid);

												}
											}

										});

						var tabs = Ext.create('Ext.tab.Panel', {
							width : 440,
							height : 420,
							activeTab : 0,
							bodyStyle : 'background:transparent',

							defaults : {
								bodyStyle : 'background:transparent',
								border : false,
								bodyPadding : 5
							},
							items : [ this.imgForm ]

						});

						this.winMedia = Ext.create('Ext.window.Window', {
							title : 'Ins&eacute;rer/modifier un media',
							modal : true,
							width : 450,
							resizable : false,
							border : false,
							height : 430,
							items : [ tabs

							],

							buttons : [ {
								text : 'Ins&eacute;rer',
								disabled : true,
								action : 'insert',
								scope : this,
								handler : this.insertMedia
							}, {
								text : 'Fermer',
								scope : this,
								handler : function() {
									this.winMedia.close();

								}
							} ]

						});

						this.winMedia.show();
					},
					selectImage : function(record) {

						this.mediaObj = {
							path : record.get('path'),
							originalWidth : record.get('width'),
							originalHeight : record.get('height'),
							width : record.get('width'),
							height : record.get('height'),
							alt : record.get('alt'),
							align : record.get('align'),
							css : record.get('class')
						};

						this.imgForm.getForm().findField('larg').setValue(
								record.get('width'));
						this.imgForm.getForm().findField('haut').setValue(
								record.get('height'));

					},
					setDimensions : function(field) {

						if (Ext.getCmp('dimBtn').actionValue == 2)
							return;

						var value = field.getValue();

						switch (field.name) {

						case 'larg':
							var ratio = value / this.mediaObj.width;
							var haut = Math.round(ratio * this.mediaObj.height)
							this.imgForm.getForm().findField('haut').setValue(
									haut);
							return;
							break;
						case 'haut':
							var ratio = value / this.mediaObj.height;
							var larg = Math.round(ratio * this.mediaObj.width)
							this.imgForm.getForm().findField('larg').setValue(
									larg);
							return;

							break;

						}

					},
					insertMedia : function() {
						var img = new CKEDITOR.dom.element('img');

						img.setAttribute('alt', this.imgForm.getForm()
								.findField('alt').getValue());
						img.setAttribute('width', this.imgForm.getForm()
								.findField('larg').getValue());
						img.setAttribute('height', this.imgForm.getForm()
								.findField('haut').getValue());
						img.setAttribute('src', '/medias/'
								+ this.mediaObj.path.replace('/medias/', ''));
						if (!this.imgForm.getForm().findField('css').getValue()
								.empty())
							img.setAttribute('class', this.imgForm.getForm()
									.findField('css').getValue());

						if (this.imgForm.getForm().findField('alignement')
								.getValue() != null)
							img.setAttribute('align', this.imgForm.getForm()
									.findField('alignement').getValue());

						this.editor.insertElement(img);
						this.winMedia.close();

					},
					openLinkEditor : function() {

						elt = this.editor.getSelection().getStartElement();


						this.selectedElt = href = type = target = internalID = internalMediaID = null;

						if (elt) {

							var parents = elt.getParents(true);

							parents.each(function(node) {
								if (node.getName() == "a")
									this.selectedElt = node;
							}, this);

						}

						this.attributesString = "[]";

						if (this.selectedElt) {

							href = this.selectedElt.getAttribute('href');
							type = href.indexOf('mailto') > -1 ? 2 : (href
									.indexOf('internal:') > -1 ? 3 : 1);

							if (href.indexOf('internalMedia') > -1)
								type = 4;
							target = type == 2 ? null : this.selectedElt
									.getAttribute('target');

							if (type == 3)
								internalID = href.replace('internal:', '');
							if (type == 4)
								internalMediaID = href.replace(
										'internalMedia:', '');
							href = type < 3 ? href.replace('mailto:', '')
									: null;

							this.attributeArray = [];
							var arrayAtt = $(this.selectedElt.$).attributes;
							// console.log(arrayAtt);
							$A(arrayAtt).each(
									function(attribute) {

										if (attribute.name != "href"
												&& attribute.name
														.indexOf('cke') == -1) {
											this.attributeArray.push('{key:"'
													+ attribute.name
													+ '",value:"'
													+ attribute.value + '"}')
										}

									}, this);
							this.editor.getSelection().selectElement(
									this.selectedElt);

							this.attributesString = "["
									+ this.attributeArray.join(',') + "]";
						}

						var store = Ext.create('Ext.data.Store', {
							fields : [ 'value', 'name' ],
							data : [ {
								"value" : 1,
								"name" : "Lien externe (http, https)"
							}, {
								"value" : 3,
								"name" : "Lien interne"
							}, {
								"value" : 4,
								"name" : "Document"
							}, {
								"value" : 2,
								"name" : "Lien mailto"
							}

							]
						});

						var cbLinkType = Ext
								.create(
										'Ext.form.ComboBox',
										{
											fieldLabel : 'Type de lien',
											store : store,
											allowBlank : false,
											value : 1,
											queryMode : 'local',
											displayField : 'name',
											valueField : 'value',
											name : 'linkType',
											value : type,
											width : 350,
											listeners : {
												scope : this,
												select : function(tf) {

													this.linkForm.getForm()
															.findField(
																	'URLField').allowBlank = true;
													this.internalLink.allowBlank = true;
													this.internalMediaLink.allowBlank = true;
													this.linkForm.getForm()
															.findField(
																	'URLField').allowBlank = true;
													this.internalMediaLink
															.hide();
													this.internalLink.hide();
													this.optionsFS.show();
													this.linkForm.getForm()
															.findField(
																	'URLField')
															.hide();

													switch (tf.getValue()) {
													case 1:

														this.linkForm
																.getForm()
																.findField(
																		'URLField')
																.show();
														this.linkForm
																.getForm()
																.findField(
																		'URLField').allowBlank = false;
														this.linkForm.getForm().findField('URLField').setFieldLabel('URL');
														break;

													case 2:
														this.optionsFS.hide();
														this.linkForm
																.getForm()
																.findField(
																		'URLField')
																.show();
														this.linkForm
																.getForm()
																.findField(
																		'URLField').allowBlank = false;
														this.linkForm.getForm().findField('URLField').setFieldLabel('Adresse mail');
														break;

													case 3:

														this.internalLink
																.show();
														this.internalLink.allowBlank = false;

														break;

													case 4:

														this.internalMediaLink.allowBlank = false;
														this.internalMediaLink
																.show();

														break;

													}

												}
											}
										});

						this.internalLink = Ext
								.create(
										'TextoCMS.components.cms.fields.ContentBrowser',
										{
											name : 'internalLink',
											hidden : internalID == null,
											fieldLabel : 'Contenu s&eacute;lectionn&eacute; *',
											value : internalID,
											allowBlank : internalID == null
										});
						this.internalMediaLink = Ext
								.create(
										'TextoCMS.components.cms.fields.File',
										{
											name : 'internalMediaLink',
											hidden : internalMediaID == null,
											fieldLabel : 'Document s&eacute;lectionn&eacute;',
											value : internalMediaID,
											allowBlank : internalMediaID == null
										});

						this.optionsFS = Ext
								.create(
										'Ext.form.FieldSet',
										{
											title : 'Options',
											hidden : type == 2,
											items : [ {
												xtype : 'checkboxfield',
												fieldLabel : 'Ouverture dans une nouvelle fen&ecirc;tre',
												inputValue : "_blank",
												labelAlign : 'left',
												checked : target == "_blank",
												name : 'fieldTarget',
												labelWidth : 200,
												width : 350
											} ]
										});

						this.optionsForm = Ext.create('Ext.form.Panel', {
							title : 'Avanc&eacute;',
							items : [ {
								xtype : 'itemsmenu',
								name : 'options',
								showLabel : false,
								bodyStyle : 'background:transparent',
								width : 460,
								value : this.attributesString,
								extraParams : {
									fields : [ {
										field_type : 'text',
										compulsary : 1,
										name : 'key',
										label : 'Attribut',
										showCol : 1
									}, {
										field_type : 'text',
										name : 'value',
										compulsary : 1,
										label : 'Valeur',
										showCol : 1
									} ]
								}
							} ]
						});

						this.linkForm = Ext
								.create(
										'Ext.form.Panel',
										{
											border : false,
											id : 'linkForm',
											bodyStyle : 'background:transparent',
											title : 'G&eacute;n&eacute;ral',
											defaults : {
												labelWidth : 100,
												labelStyle : "text-align:right; width:100px",
												bodyStyle : 'background:transparent',
												border : false,
												defaults : {
													labelWidth : 100,
													labelStyle : "text-align:right; width:100px",
													bodyStyle : 'background:transparent',
													border : false
												}
											},
											items : [
													cbLinkType,
													Ext
															.create(
																	'Ext.form.field.Text',
																	{
																		fieldLabel : 'URL',
																		scope : this,
																		value : href,
																		name : 'URLField',
																		validator : function(
																				value) {

																			if (!this.linkForm)
																				return;

																			var linkType = this.linkForm
																					.getForm()
																					.findField(
																							'linkType')
																					.getValue();
																			switch (linkType) {
																			case 1:

																				var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
																				msgError = 'Url incorrecte';

																				break;

																			case 2:

																				var regexp = /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/;
																				msgError = 'Adresse mail incorrecte';

																				break;

																			default:
																				return true;
																				break;

																			}

																			var ok = regexp
																					.test(value);
																			return !ok ? msgError
																					: true;

																		}
																				.bind(this),
																		width : 350,
																		hidden : type > 2,
																		allowBlank : type > 2

																	}),
													this.internalLink,
													this.internalMediaLink,
													this.optionsFS ],
											buttons : [
													{
														text : 'G&eacute;n&eacute;rer le lien',
														formBind : true,
														scope : this,
														handler : function() {

															var options = Ext.JSON
																	.decode(this.optionsForm
																			.getValues().options);

															nodeType = this.editor
																	.getSelection()
																	.getType();
															var values = this.linkForm
																	.getValues();

															var aLink = new CKEDITOR.dom.element(
																	'a');
															linkType = values.linkType;

															if (values.fieldTarget)
																aLink
																		.setAttribute(
																				'target',
																				values.fieldTarget);

															switch (linkType) {
															case 1:

																aLink
																		.setAttribute(
																				'href',
																				values.URLField);

																break;

															case 2:
																aLink
																		.setAttribute(
																				'href',
																				'mailto:'
																						+ values.URLField);
																aLink
																		.removeAttribute('target');
																break;

															case 3:

																aLink
																		.setAttribute(
																				'href',
																				'internal:'
																						+ values.internalLink);

																break;

															case 4:

																aLink
																		.setAttribute(
																				'href',
																				'internalMedia:'
																						+ values.internalMediaLink);

																break;

															}

															options
																	.each(
																			function(
																					opt) {
																				aLink
																						.setAttribute(
																								opt.key,
																								opt.value);

																			},
																			this)

															switch (nodeType) {

															case CKEDITOR.SELECTION_TEXT:

																var text = this.editor
																		.getSelection()
																		.getRanges()[0]
																		.extractContents().$.textContent;
																aLink
																		.appendHtml(text);

																break;

															case CKEDITOR.SELECTION_ELEMENT:

																if (!this.selectedElt)
																	var text = this.editor
																			.getSelection()
																			.getSelectedElement();
																else
																	var text = this.selectedElt
																			.getChild(0);

																aLink
																		.append(text);

																break;

															}

															this.editor
																	.insertElement(aLink);
															this.winLink
																	.close();

														}
													},
													{
														text : 'Annuler',
														scope : this,
														handler : function() {
															this.winLink
																	.close();
														}
													} ]

										});

						var tabLink = Ext.create('Ext.tab.Panel', {
							width : 470,
							autoHeight : true,
							activeTab : 0,
							bodyStyle : 'background:transparent',

							defaults : {
								bodyStyle : 'background:transparent',
								border : false,
								bodyPadding : 5
							},
							items : [ this.linkForm, this.optionsForm ]
						});

						this.winLink = Ext.create('Ext.window.Window', {
							title : 'Liens',
							width : 480,
							resizable : false,
							modal : true,
							border : false,
							autoHeight : true,
							items : [ tabLink ]

						});

						this.winLink.show();

					},
					desactiveLink : function() {
						// blocage des liens a
						var elt = $$('#' + this.contentPanel.id + ' .RichTextEditor a ');
						elt
								.each(
										function(a) {

											var href = a.getAttribute('href');

											if(href==null)return;
											var tooltipText = href
													.indexOf('mailto') > -1 ? 'Lien '
													+ href
													: 'Lien hypertexte vers '
															+ href
															+ (a
																	.getAttribute('target') == '_blank' ? '(Ouverture dans une nouvelle fen&ecirc;tre)'
																	: '');
											if (href.indexOf('internal:') > -1)
												tooltipText = 'Lien interne '
														+ (a
																.getAttribute('target') == '_blank' ? '(Ouverture dans une nouvelle fen&ecirc;tre)'
																: '');
											if (href.indexOf('internalMedia') > -1)
												tooltipText = 'Lien sur un document '
														+ href
																.replace(
																		'internalMedia:',
																		'');

											a.setAttribute('data-qtip',
													tooltipText);
										try{	Event.observe(a, 'click', function(
													e) {
												Event.stop(e);
											});
										}catch(e){console.log(e);};

										}, this);

					}

				});