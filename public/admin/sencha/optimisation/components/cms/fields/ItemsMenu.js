/**
 * 
 */

Ext
		.define(
				'TextoCMS.components.cms.fields.ItemsMenu',
				{
					extend : 'Ext.panel.Panel',
					fieldName : 'Eléments multiples',
					uses : [ 'Ext.data.Store', 'Ext.grid.Panel','Ext.grid.plugin.DragDrop' ],
					alias : 'widget.itemsmenu',
					layout : 'column',
					showStatus : true,

					value : null,
					rights : {
						write : 1

					},
					
					compulsaryParam : 'fields',
					autoExpand : null,
					data : [],
					showLabel : true,
					bodyStyle : "margin-bottom:10px",
					border : false,
					defaults : {
						border : false,
						autoHeight : true

					},
					autoHeight : true,
					initComponent : function() {

						this.addEvents({
							"openformevent" : true
						});
						if (this.value != null)
							this.data = Ext.JSON.decode(this.value);

						this.textField = Ext.create('Ext.form.field.Text', {
							hidden : true,
							mainFieldCT:this,
							name : this.name,
							allowBlank : this.allowBlank,
							value : this.value

						});

						this.width = this.width + (this.labelWidth || 150)
								|| 750;
						gridWidth = this.showLabel ? this.width - 150
								: this.width;

						this.actionCol = Ext.create('Ext.grid.column.Action', {
							xtype : 'actioncolumn',
							menuDisabled : true,
							sortable : false,
							hidden:this.rights.write==0,
							width : 50,
							bodyStyle : 'cursor:pointer',
							align : 'center',
							items : [ {
								icon : 'img/icons/pencil.png', 
								tooltip : 'Editer l\'&eacute;l&eacute;ment',
								scope : this,

								handler : function(grid, rowIndex, colIndex) {
									var rec = grid.getStore().getAt(rowIndex);
									this.openForm(rec);
								}
							} ]
						});

						if (this.extraParams && this.extraParams.maxItems) {
							var height = this.extraParams.maxItems * 30 + 50;
							if (height > 350)
								height = 350;

						} else
							height = 250;

						this.sm = Ext
								.create(
										'Ext.selection.CheckboxModel',
										{

											checkOnly : true,
											listeners : {
												scope : this,
												selectionchange : function(sm,
														selections) {
													if (this.rights.write == 0)
														return;

													this.deleteBtn
															.setDisabled(selections.length == 0);

												},
												select : function(sm) {
													if (this.rights.write == 0)
														return;
													this.deleteBtn
															.setDisabled(sm
																	.getSelection().length == 0);
												},
												deselect : function(sm) {
													if (this.rights.write == 0)
														return;
													this.deleteBtn
															.setDisabled(sm
																	.getSelection().length == 0);

												}
											}

										});

						this.cols = [];
						this.editors = [];
						this.storeFields = [];

						this.showCol = 0;

						if (this.extraParams){
							if(typeof this.extraParams.fields==="string") this.extraParams.fields = Ext.JSON.decode(this.extraParams.fields);
							Ext.Array.filter(this.extraParams.fields, function(
									obj) {
								if (obj.showCol == 1)
									this.showCol++;
							}, this);
						};

						this.showColLength = (gridWidth) / this.showCol;

						if (this.extraParams)
							this.extraParams.fields
									.each(
											function(elt) {

												var extra_params = (elt.extraParams ? elt.extraParams
														: {});
												this.storeFields.push({
													name : elt.name
												});
												if (elt.showCol == true)
													this.cols
															.push({
																header : elt.label,
																flex : this.showCol,
																height : 40,
															
																hidden : elt.showCol != true,
																style : elt.showCol != true ? "display:none"
																		: "",
																dataIndex : elt.name,
																menuDisabled : true,
																sortable : false
															});

												if (elt.field_type != "combo"){
													
											
													var field = {
														xtype : elt.field_type,
														name : elt.name,
														allowBlank : elt.compulsary == 0,
														fieldLabel : elt.label,
														rights : this.rights
													};

													delete elt.field_type;
													delete elt.name;
													delete elt.compulsary;
													delete elt.label;
													
													for(key in elt)field[key] = elt[key];
													
													
												}
												else {

													var dataStore = extra_params;

													var cbStore = Ext
															.create(
																	'Ext.data.Store',
																	{
																		fields : [
																				'value',
																				'label' ],
																		data : dataStore
																	});

													var field = {
														xtype : elt.field_type
																.toLowerCase(),
														rights : this.rights,
														fieldLabel : elt.label,
														allowBlank : elt.compulsary == 0,
														name : elt.name,
														store : cbStore,
														queryMode : 'local',
														displayField : 'label',
														valueField : 'value',
														rights : this.rights
													};
												}

												if (elt.field_type == "checkbox"
														|| elt.field_type == "check")
													field.inputValue = 1;

												this.editors.push(field);// {xtype:elt.type,name:elt.name,
																			// allowBlank:elt.compulsary==0,
																			// fieldLabel:elt.label,
																			// extraParams:extra_params,
																			// rights:this.rights}

											}, this);

						if (this.showStatus)
							this.cols
									.push({
										dataIndex : 'statut',
										header : 'Statut',
										renderer : function(v) {

											if (v == 1)
												return '<img src="img/icons/accept.png" data-qtip="En ligne" />';
											return '<img src="img/icons/stop.png" data-qtip="Hors ligne" />';
										},
										width : 40,
										align : 'center',
										menuDisabled : true,
										sortable : false
									});
						this.cols.push(this.actionCol);

						if (this.showStatus) {
							this.storeFields.push({
								name : 'statut',
								type : 'int'
							});

							this.editors.push({
								xtype : 'checkbox',
								name : 'statut',
								fieldLabel : 'Statut',
								inputValue : 1
							});
						}

						this.modelName = 'Item_' + this.name;

						this.model = Ext.define(this.modelName, {
							extend : 'Ext.data.Model',
							fields : this.storeFields
						});

						this.store = Ext.create('Ext.data.Store', {
							model : this.modelName,
							data : this.data,
							proxy : {
								type : 'memory',
								reader : {
									type : 'json'
								}
							},
							listeners : {
								scope : this,

								datachanged : function(store) {
									var textvalue = [];
									store.data.each(function(elt) {
										textvalue.push(Ext.JSON
												.encode(elt.data));
									}, this);
									this.textField.setValue('['
											+ textvalue.join(',') + ']');
									if(this.fireDirty)this.textField.fireEvent("dirtychange",
											this.textField.isDirty());
									else this.textField.resetOriginalValue();
									this.fireDirty=true;
								}
							}
						});

						this.deleteBtn = Ext.create('Ext.button.Button', {
							text : 'Supprimer',
							tooltip : 'Supprimer la s&eacute;lection',
							scope : this,
							hidden:this.rights.write==0,
							handler : this.deleteItem,
							disabled : true,
							iconCls : 'removeBtn'
						}

						);

						if (this.rights.write == 1)
							viewConf = {
								plugins : {
									ptype : 'gridviewdragdrop'
								},
								multiselect : true

							};
						else
							viewConf = {};

						this.gridPanel = Ext.create('Ext.grid.Panel', {
							border : true,
							collapsible : false,
							flex : 1,
							margin : '0 0 10 5',
							store : this.store,
							selModel : this.sm,
							height : height,
							viewConfig : viewConf,

							columns : this.cols,
							tbar : [ {
								text : 'ajouter',
								tooltip : 'Ajouter un &eacute;l&eacute;ment',
								iconCls : 'addBtn',
								scope : this,
								hidden:this.rights.write==0,
								disabled : this.rights.write == 0,
								handler : function() {
									this.openForm(null);
								}
							}, this.deleteBtn,'-'  ]
						});

						this.items = [];
						if (this.showLabel)
							this.items.push({
								width : 150,
								autoHeight : true,
								hidden : this.showLabel == false,
								items : [ {
									xtype : 'panel',
									html : this.fieldLabel
											+ (this.compulsary == 1 ? '*' : '')
											+ ' :',
									style : 'text-align:right',
									border : false
								} ]
							});

						this.items.push({
							width : gridWidth,
							autoHeight : true,
							items : [ this.textField, this.gridPanel ]
						});

						this.callParent(arguments);

					},
					openForm : function(record) {
if(this.rights.write==0)return;
						if (record == undefined)
							record = null;
						fields = [];

						this.form = Ext
								.create(
										'Ext.form.Panel',
										{
											border : false,
											trackResetOnLoad : true,
											// width:510,

											bodyStyle : 'padding:5px',
											defaults : {
												labelStyle : "text-align:right",
												labelWidth : 100,
												width : 350,

												bodyStyle : 'background-color:transparent',
												border : false
											},
											items : [],
											listeners : {
												scope : this,
												validitychange : function(form,
														isValid) {
													if (this.rights.write == 0)
														return;
													this.win
															.query('button[action=save]')[0]
															.setDisabled(!isValid);
												},
												dirtychange : function(form,
														isDirty) {
													if (this.rights.write == 0)
														return;
													if (isDirty
															&& form.isValid())
														return this.win
																.query('button[action=save]')[0]
																.setDisabled(false);

												}

											}

										});
						
						this.editors.each(function(editor) {

							if (editor.xtype != 'checkbox'
									&& editor.xtype != 'check')
								editor.value = (record != null ? record
										.get(editor.name) : null);
							else
								editor.checked = record ? record
										.get(editor.name) == 1 ||record
										.get(editor.name) == "on" : false;

							
							this.form.add(editor);
						}, this);

						// this.form.doLayout();

						this.win = Ext.create('Ext.window.Window',
								{
									modal : true,
									bodyStyle : 'background-color:transparent',
									title : (record ? '&Eacute;dition d\'un'
											: 'Nouvel')
											+ ' &eacute;l&eacute;ment',
									autoWidth : true,
									padding : 5,

									items : [ this.form ],
									buttons : [
											{
												text : 'Enregistrer',
												iconCls : 'saveBtn',
												action : 'save',
												scope : this,
												handler : this.saveItem.bind(
														this, record),
												disabled : true
											}, {
												text : 'Fermer',
												scope : this,
												handler : function() {
													this.win.close();
												}
											} ]

								});

						

						this.fireEvent('openformevent', this.form);

						this.win.show();

					},
					saveItem : function(record) {
						if (this.rights.write == 0)
							return;
						var values = this.form.getValues();

						
						if (record) {
							record.beginEdit();
							this.storeFields.each(function(elt) {
								record.set(elt.name, values[elt.name]);

							}, this);

							record.endEdit();
							record.commit();
							this.win.close();
							return this.store.fireEvent('datachanged', this.store);
						} else {

							var item = {};

							this.storeFields.each(function(elt) {

								item[elt.name] = values[elt.name];

							}, this);

							var record = Ext.ModelManager.create(item,
									this.modelName);
							
							var col=this.gridPanel.query('gridcolumn[flex=1]')[0];
								if(col){												
							var check = this.store.findExact(col.dataIndex, item[col.dataIndex]);
							
							
							
							if(check>-1)return Ext.Msg
								.show({
									title : 'Attention ',
									msg : 'Cet &eacute;l&eacute;ment existe d&eacute;j&agrave;<br />Voulez-vous continuer ?',
									buttons : Ext.Msg.YESNO,
									icon : Ext.Msg.INFO,
									scope : this,
									fn : function(btn) {
										if (btn == 'no')
											return;
										
									
								this.store.add(record);
								this.win.close();
								}
								
								

								});
								}
							this.store.add(record);
							this.win.close();
							};
							
							
						

							

					},
					deleteItem : function() {
						if (this.rights.write == 0)
							return;
						var selection = this.sm.getSelection();

						Ext.Msg
								.show({
									title : 'Suppression '
											+ (selection.length < 2 ? 'd\'un &eacute;l&eacute;ment'
													: 'de plusieurs &eacute;l&eacute;ments'),
									msg : 'Attention, la suppression est d&eacute;finitive !<br />Voulez-vous continuer ?',
									buttons : Ext.Msg.YESNO,
									icon : Ext.Msg.WARNING,
									scope : this,
									fn : function(btn) {
										if (btn == 'no')
											return;

										selection.each(function(elt) {
											this.store.remove(elt);
										}, this);

									}

								});

					},
					setValue : function(value, fireDirty) {
						
						if(!Ext.JSON.decode(value, true)) return;
						if(fireDirty==undefined) fireDirty = true;
						
						this.store.loadData(Ext.JSON.decode(value));
						
					}

				});