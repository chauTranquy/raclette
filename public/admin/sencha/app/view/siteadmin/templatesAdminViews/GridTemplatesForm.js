Ext
		.define(
				'TextoCMS.view.siteadmin.templatesAdminViews.GridTemplatesForm',
				{
					extend : 'Ext.form.Panel',
					alias : 'widget.gridtemplatesform',
					requires:['TextoCMS.view.siteadmin.templatesAdminViews.GridTemplatesFields'],
					bodyStyle : 'background:transparent',
					 margin:'0 10 0 0',
					//width:820,
					border : true,
					bodyPadding : 10,
					record : null,
					layout : 'hbox',
					trackResetOnLoad : true,
					fieldDefaults: {
				        labelAlign: 'left',
				       labelStyle:'text-align:right',
				        width:400,labelWidth:120
				    	
				    },
					defaults : {
						border:false
						
					},
					tbar:[{iconCls:'saveBtn', text:'Sauvegarder', disabled:true}],
					// buttons:[{text:'Enregistrer', action:'submit',
					// disabled:true},{text:'Annuler', action:'close'}],
					initComponent : function() {

						this.title = (this.record.get('id_templateRef') == 0 ? 'Ajout d\'un template'
								: 'Modification du template '
										+ this.record.get('templateRef'));
						
						Ext.define('fieldType',{extend: 'Ext.data.Model',
						    fields: [{type: 'string', name: 'name'},{type: 'string', name: 'title'}]});
					

					var storeType = Ext.create('Ext.data.Store', {
					    model: 'fieldType',
					    id:'fieldTypeStore',
					    autoLoad:true,
					    data:  [{name:'folder', title:'Répertoire'}, {name:'page', title:'Page'}],
					    sorters: [
					              {
					                  property : 'title',
					                  direction: 'ASC'
					              }]
					              
					});

					
					
					var typeCombo = Ext.create('Ext.form.field.ComboBox', {
					    fieldLabel: 'Type de gabarit',
					    displayField: 'title',
					    valueField:'name',
					    name:'type',
					    allowBlank:false,
					    store: storeType,
					    queryMode: 'local',
					    typeAhead: true
					});
					
					
						var formItems = [
								{
									xtype : 'textfield',
									name : 'templateRef',
									allowBlank : false,
									fieldLabel : 'Nom du gabarit',
									readOnly : this.record.get('id_templateRef') > 0 ? true : false,
									regex : /^[a-zA-Z]+$/,
									regexText : 'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques',
									minLength : 3
								},
								{
									xtype : 'textfield',
									name : 'callback',
									allowBlank : true,
									fieldLabel : 'Callback administration',
									regex : /^[a-zA-Z\.|]+$/,
									regexText : 'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques',
									minLength : 3
								}, {
									xtype : 'textarea',
									name : 'description',
									allowBlank : false,
									fieldLabel : 'Description'
								}, typeCombo, 
								{
									xtype : 'checkbox',
									inputValue : 1,
									name : "publiable",
									fieldLabel : "Publiable"
								} , {xtype:'hidden', name:'fields', id:"fields"}];

						this.items = [ {
							anchor:'0 0',
							width:450,
							border:false,
							items:formItems,
							bodyPadding:'0 10 0 0',
							fieldDefaults:{width : 440,
						labelAlign : 'left',
						labelWidth : 150,
						labelStyle : 'text-align:right'}
						}, {xtype:'gridtemplatesfields', templateRef:this.record.get('templateRef'), border:true}	];

						/*
						 * this.items=[{xtype:'textfield',
						 * fieldLabel:'Intitul&eacute;', allowBlank:false,
						 * name:'template_name'}, {xtype:'hiddenfield',
						 * name:'id_template'}];
						 */

						this.callParent(arguments);

						if(this.record) this.loadRecord(this.record);
					}

				});