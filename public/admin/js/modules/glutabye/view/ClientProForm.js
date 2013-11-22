Ext
		.define(
				'TextoCMS.Modules.glutabye.view.ClientProForm',
				{
					extend : 'Ext.form.Panel',
					alias : 'widget.clientproform',
					trackResetOnLoad : true,
					layout : 'form',
					border : false,
					bodyPadding : 10,
					defaults : {
						labelAlign : 'right',
						labelWidth : 100,
						width : 400,
						xtype : 'textfield',
						allowBlank : false,
						labelStyle : 'text-align:right'

					},

					initComponent : function() {

						var cbType = Ext
								.create(
										'Ext.form.field.ComboBox',
										{
											fieldLabel : 'Type de client',
											labelWidth : 100,
											name : 'type',
											allowBlank:false,
											store : Ext
													.getStore('TextoCMS.Modules.glutabye.store.TypeProStore'),
											queryMode : 'local',
											displayField : 'type',
											valueField : 'id_type',
											forceSelection:true

										});

						var cbGroupe = Ext
								.create(
										'Ext.form.field.ComboBox',
										{
											fieldLabel : 'Groupe de client',
											labelWidth : 100,
											name : 'id_groupe',
											allowBlank:false,
											store : Ext
													.getStore('TextoCMS.Modules.glutabye.store.EspaceProStore'),
											queryMode : 'local',
											displayField : 'name',
											valueField:'id_groupe',
											forceSelection:true

										});

						this.items = [
								
								{
									xtype : 'fieldset',
									title : 'Coordonn&eacute;es',
									defaults:{
										labelAlign : 'right',
										labelWidth : 100,
										width : 400,
										xtype : 'textfield',
										allowBlank : false,
										labelStyle : 'text-align:right'

									},

									items : [{

										fieldLabel : 'N&deg;. client',
										name : 'num_client',
										maskRe : /[0-9]/,
										xtype:'numberfield',
										step:1, 
										allowDecimal:false,
										minValue:1,
										maxValue:1000000,
										scope:this,
										validator:function(value){
										
											var recIndex=Ext.getStore('ClientsProStore').findExact('num_client', parseInt(value));
											if(recIndex>-1&&this.ownerCt.up('form').record.get('id_client')==0) return 'Ce num&eacute;ro client est d&eacute;j&agrave; attribu&eacute;';
											
											return true;
											
										},
										hidden : this.record.get('id_client') > 0

									},
									{

										fieldLabel : 'N&deg;. client',
										xtype : 'displayfield',
										hidden : this.record.get('id_client') == 0,
										value : this.record.get('num_client'),
										name : 'displayNum'

									},
											{
												xtype : 'textfield',
												name : 'raison_sociale',
												fieldLabel : 'Raison Sociale'

											},
											{
												xtype : 'textfield',
												name : 'siret',
												fieldLabel : 'N&deg; SIRET',
												allowBlank : true

											},
											{
												xtype : 'combo',
												forceSelection:true,
												store : new Ext.data.ArrayStore(
														{
															fields : [ 'value',
																	'label' ],
															data : [
																	[ 1, 'Mme' ],
																	[ 2, 'Mr.' ] ]
														}),
												name : 'civilite',
												fieldLabel : 'Civilit&eacute;',
												displayField : 'label',
												valueField : 'value',
												allowBlank:false

											},

											{
												xtype : 'textfield',
												name : 'nom',
												fieldLabel : 'Nom'
											}, {
												xtype : 'textfield',
												name : 'prenom',
												fieldLabel : 'Pr&eacute;nom'
											}, {
												xtype : 'textfield',
												name : 'email',
												fieldLabel : 'Email',
												vtype : 'email'
											}, {
												xtype : 'textfield',
												name : 'tel',
												minLength : 10,
												maxLength : 10,
												maskRe : /[0-9]/,
												fieldLabel : 'T&eacute;l.',
												allowBlank : true
											} ]
								},
								{
									xtype : 'fieldset',
									title : 'Adresse',
									defaults:{
										labelAlign : 'right',
										labelWidth : 120,
										width : 400,
										xtype : 'textfield',
										allowBlank : false,
										labelStyle : 'text-align:right'

									},

									items : [ {
										xtype : 'textfield',
										name : 'adresse',
										fieldLabel : 'Adresse'
									}, {
										xtype : 'textfield',
										name : 'adresse2',
										fieldLabel : 'Adresse 2',
										allowBlank : true
									}, {
										xtype : 'textfield',
										name : 'adresse3',
										fieldLabel : 'Adresse 3',
										allowBlank : true
									}, {
										xtype : 'textfield',
										name : 'cp',
										minLength : 5,
										maxLength : 5,
										maskRe : /[0-9]/,
										fieldLabel : 'Code Postal'
									}, {
										xtype : 'textfield',
										name : 'ville',
										fieldLabel : 'Ville'
									} ]
								},
								 cbType, cbGroupe, {
									xtype : 'checkbox',
									fieldLabel : 'Statut',
									allowBlank : true,
									name : 'statut',
									inputValue : 1
								},
								{
									xtype : 'fieldcontainer',
									fieldLabel : 'Mot de passe'
											+ (this.record.get('statut') == 0 ? ''
													: '*'),
									layout : 'hbox',
									items : [
											{
												xtype : 'textfield',
												name : 'password',
												allowBlank : this.record
														.get('statut') == 0,
												minLength : 6
											},
											{
												xtype : 'splitter'
											},
											{
												xtype : 'button',
												// id : 'generatePass',
												tooltip : 'G&eacute;n&eacute;rer le mot de passe',
												iconCls : 'generatePass'
											} ]
								},
								
								{
									xtype : 'checkbox',
									fieldLabel : 'Mail de confirmation',
									allowBlank : true,
									name : 'sendMail',
									inputValue : 1
								}, {
									name : 'id_client',
									xtype : "hidden"
								} ]

						this.callParent(arguments);
						console.log("record", this.record);
						
						this.loadRecord(this.record);

					}

				});