Ext
		.define(
				'TextoCMS.view.cms.ContentTab',
				{
					extend : 'Ext.form.Panel',
					title : 'Contenu',
					id : 'contentForm',
					alias : 'widget.contentform',
					layout : 'border',
					iconCls : 'contentTab',
					bodyPadding : 10,
					isLocked : false,
					trackResetOnLoad : true,
					tbar : [],
					items : [ {
						layout : 'form',
						width : 320,
						bodyPadding : 5,
						border : false,
						region : 'east'
					}, {
						border : false,
						region : 'center',
						autoScroll : true,
						bodyPadding : 10,
						margin : '0 10 10 0',
						id : 'mainFormPanel',
						defaults : {
							labelClsExtra : 'formLabel',
							width : 600,
							labelWidth : 150
						}
					} ],
					initComponent : function() {

						this.rights = this.data.rights;
						this.fields = this.data.fields;
						this.fieldsData = Ext.JSON
								.decode(this.data.result.data);
						this.callParent(arguments);
						this.buildForm();

					},

					buildForm : function() {
						this.selectedRub = TextoCMS.app
								.getController('cms.ContentController').selectedRub;
						this.publishBtn = Ext.create('Ext.button.Button', {
							xtype : 'button',
							text : 'Publier',
							id : 'publishBtn',
							iconCls : 'publishBtn',
							action : 4,
							disabled : this.rights.edit == 0 || this.isLocked
									|| !this.fieldsData
						});
						this.saveBtn = Ext
								.create(
										'Ext.button.Button',
										{
											xtype : 'splitbutton',
											text : 'Enregistrer',
											iconCls : 'saveBtn',
											disabled : true,
											scope : this,
											menu : [
													{
														text : 'Enregistrer la version actuelle',
														action : 1
													},
													{
														text : 'Cr&eacute;er une nouvelle version',
														action : 2
													},
													{
														text : 'Cr&eacute;er une nouvelle version et publier',
														action : 3
													} ]
										});

						this.unpublishBtn = Ext
								.create(
										'Ext.button.Button',
										{
											xtype : 'button',
											text : 'D&eacute;publier',
											iconCls : 'unpublishBtn',
											disabled : (this.rights.edit == 0
													|| this.isLocked || Number(this.data.result.status != 1)),
											action : -1
										});

						var items = [];

						this.refreshBtn = Ext.create('Ext.button.Button', {
							text : 'Recharger',
							iconCls : 'refreshBtn',
							disabled : true,
							scope : this,
							id : 'refreshBtn',
							handler : function() {

							}
						});
						
						this.previewBtn = Ext.create('Ext.button.Button', {
							text : 'Pr&eacute;visualiser',
							iconCls : 'previewBtn',
							disabled : true,
							scope : this,
							id : 'previewBtn',
							handler : function() {

							}
						});

						var items2 = [ this.saveBtn, this.publishBtn,
								this.unpublishBtn, this.refreshBtn,this.previewBtn];
						var menuItem2 = {
							title : 'Contenu',
							xtype : 'buttongroup',
							columns : 5,
							defaults : {
								scale : 'small'
							},
							items : items2
						};

						var items = [];
						if (this.selectedRub.get('type') == "folder")
							items.push({
								xtype : 'button',
								text : 'Nouveau',
								iconCls : 'addBtn',
								tooltip : 'Ajouter un &eacute;l&eacute;ment',
								disabled : this.rights.edit == 0
										|| this.isLocked
							});
						if (!this.selectedRub.isRoot()
								&& !this.selectedRub.parentNode.isRoot())
							items
									.push(
											{
												xtype : 'button',
												iconCls : 'editBtn',
												text : 'Modifier',
												tooltip : 'Modifier l\'&eacute;l&eacute;ment',
												disabled : this.rights.edit == 0
														|| this.isLocked
											},
											{
												xtype : 'button',
												text : 'Supprimer',
												iconCls : 'removeBtn',
												tooltip : 'Supprimer l\'&eacute;l&eacute;ment s&eacute;lectionn&eacute;',
												hidden : this.rights.edit == 0
														|| this.isLocked
														|| this.selectedRub.childNodes.length > 0,
												disabled : this.data.result.status == 1
											});

						var menuItem = {
							title : '&Eacute;l&eacute;ment',
							xtype : 'buttongroup',
							id : 'folderBtn',
							columns : 3,
							defaults : {
								scale : 'small'
							},
							items : items
						};

						if (items.length > 0)
							this.getDockedItems()[0].add(menuItem);

						this.getDockedItems()[0].add(menuItem2);
						var fieldset = {
								collapsible:true,
							xtype : 'panel',
							bodyPadding:'5px 10px',
							defaults : {
								border : false
							},
							title : 'R&eacute;f&eacute;rencement',
							items : [],
							defaults : {
								labelAlign : 'top',
								width : 280,
								margin:'auto'
							}
						};
						fieldset.items
								.push(
										{
											xtype : 'text',
											fieldLabel : 'Permalink',
											rights : this.rights,
											name : 'permalink',
											allowBlank : false,
											maskRe : /([a-zA-Z0-9\/\.\-_]+)$/,
											value : this.data.result.permalink,
											regex : /^\/([a-zA-Z0-9\/\.\-_]+)$/,
											regexText : 'Le permalink doit commencer par / et doit uniquement comporter des caract&egrave;res alphanum&eacute;riques,<br />des \'-\', des \'_\' ou des / et aucun espace'
										},
										/*{
											xtype : 'textarea',
											fieldLabel : 'Mots cl&eacute;s',
											rights : this.rights,
											value : this.data.result.keywords,
											name : 'keywords'
										},*/
										{
											xtype : 'textareafield',
											fieldLabel : 'Description',
											name : 'description',
											rights : this.rights,
											value : this.data.result.description
										});

						var publicationDate = {
							xtype : 'fieldset',
							hidden:true,
							title : 'Dates de mise en ligne',
							items : [ {
								xtype : 'datefield',
								rights : this.rights,
								name:'startPub',
								id:'startPub',
								endDateField:'endPub',
								vtype:'daterange',
								format: 'd/m/Y',
								fieldLabel : 'D&eacute;but de la publication'
							},
							 {
								xtype : 'datefield',
								rights : this.rights,
								name:'endPub',
								id:'endPub',
								format: 'd/m/Y',
								startDateField:'startPub',
								vtype:'daterange',
								fieldLabel : 'Fin de la publication'
							}],
							margin : '10px auto',
							defaults : {
								labelAlign : 'top',
								width : 280,
								border : false
							}
						}

						this.query('[region=east]')[0].add([fieldset, publicationDate,{id:'infosPanel', title:'Infos',iconCls:'infoPanel',collapsible:true,title:'infos', border:true, bodyPadding:5}]);
						this.formPanel = this.query('[region=center]')[0];

						this.fields
								.each(
										function(item) {

											var field = Ext
													.widget(
															item.field_type
																	.toLowerCase(),
															{
																labelWidth : 150,
																fieldLabel : item.label,
																name : item.field_name,
																rights : this.rights,
																allowBlank : parseInt(item.compulsary) != 1,
																extraParams : Ext.JSON
																		.decode(item.extra_params),
																value : this.fieldsData
																		&& this.fieldsData[item.field_name] ? this.fieldsData[item.field_name]
																		: null
															});

											this.formPanel.add(field);

										}, this);

					}
				});