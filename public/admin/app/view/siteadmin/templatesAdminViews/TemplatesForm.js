Ext
		.define(
				'TextoCMS.view.siteadmin.templatesAdminViews.TemplatesForm',
				{
					extend : 'Ext.form.Panel',
					requires : [ 'TextoCMS.store.siteadmin.ExtraParamsStore' ],
					alias : 'widget.templatesform',
					margin : 5,
					record : null,
					trackResetOnLoad : true,
					fieldDefaults : {
						labelAlign : 'left',
						labelWidth : 100,
						labelStyle : 'text-align:right',
						width : 450,
						labelWidth : 120

					},
					bodyPadding : 5,
					buttons : [ {
						text : 'Ajouter',
						disabled : true,
						action : 'submit'
					}, {
						text : 'Annuler',
						action : 'close'
					} ],

					initComponent : function() {

						var fieldsCombo = Ext.create('Ext.form.field.ComboBox',
								{
									fieldLabel : 'Type de champs',
									allowBlank : false,
									displayField : 'title',
									valueField : 'name',
									name : 'field_type',
									store : Ext.getStore('TemplatesStore'),
									queryMode : 'local',
									typeAhead : true
								});

						

						this.extra_params = (this.record.data.extra_params);

					Ext
								.create('TextoCMS.store.siteadmin.ExtraParamsStore');
						var extraparamsArray = [];

						if (null !== this.extra_params
								&& "null" !== this.extra_params)
							for (key in this.extra_params) {

								var value = this.extra_params[key];
								if(Ext.JSON.decode(this.extra_params[key], true)) value = Ext.JSON.decode(this.extra_params[key], true); 
								extraparamsArray.push( {key:key, value:typeof value != "string"?Ext.JSON.encode(value):value, isJson:typeof value != "string"?1:0} );

							}
						;
						
						this.extraParamsGrid = {
							xtype : 'itemsmenu',
							//title : 'Configuration',
							listeners: {
								scope:this,
								'openformevent':Ext.bind(this.openGridFormCB, this)
								
							},
							openFormEvent:Ext.bind(this.openGridFormCB,this),
							name:'extraParams',
							showStatus:false,
							showLabel:false,
							allowBlank:true,
							value:Ext.JSON.encode(extraparamsArray),
							width:380,
							extraParams : {
								fields : [ {
									name : 'key',
									field_type : 'text',
									compulsary : 1,
									showCol : 1,
									label:'Cl&eacute;'
								},
								{
									name : 'value',
									field_type : 'textarea',
									compulsary : 1,
									showCol : 1,
									label:'Valeur'
								},
								{
									name : 'isJson',
									field_type : 'check',
									compulsary:0,
									label:'Json'
								} 
								]
							}
						};

						this.items = [
										{allowBlank : false,
											xtype : 'textfield',
											fieldLabel : 'Label',
											name : 'label'
										},
										{allowBlank : false,
											xtype : 'textfield',
											name : 'field_name',
											fieldLabel : 'Nom du champ',
											validator : function(value) {
												var store = Ext
														.getStore('TemplatesFieldsStore');

												var index = store.find('field_name',
														value, 0, false, true, true);

												if (index == -1)
													return true;
												var rec = store.getAt(index);
												if (rec != this.record)
													return 'Le nom du champ doit &ecirc;tre unique';
												return true;

											}.bind(this),
											regex : /^[a-zA-Z]+$/,
											regexText : 'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques',
											minLength : 3
										}, fieldsCombo, {
											xtype : 'checkbox',
											name : 'compulsary',
											inputValue : 1,
											fieldLabel : 'Obligatoire '
										}, {
											xtype : 'fieldset',
											title : 'Configuration sp&eacute;cifique',
											fieldDefaults : this.fieldDefaults,
											items : [ this.extraParamsGrid]
										} ];
						
						
						
						this.callParent(arguments);
						if (this.record) {
							
							this.loadRecord(this.record);
							
							//this.extraParamsGrid.addListener({'openformevent': function(form){alert('form');}});
							
						}
					},
					openGridFormCB:function(form){
						
						form.getForm().findField('isJson').on('change', function(){
							form.getForm().findField('value').validate();
						});
						
					form.getForm().findField('value').validator=function(value){
					
						if(form.getForm().findField('isJson').getValue()&&Ext.JSON.decode(value, true)==null) return 'JSON mal form&eacute;';
						return true;
						
					};
						
					},
					
					checkSpecialFields : function(cb, value) {
					//	this.down('fieldset').removeAll();

					}

				});