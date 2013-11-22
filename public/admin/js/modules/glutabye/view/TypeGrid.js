Ext
		.define(
				'TextoCMS.Modules.glutabye.view.TypeGrid',
				{
					extend : 'Ext.grid.Panel',
				//	title : 'Gestion des types',
					alias : 'widget.espaceprotypegrid',
					border:false,
					bodyPadding : '0',
					//margin : 10,
					isLoaded : false,
					//frame : true,
					requires : [ 'TextoCMS.Modules.glutabye.store.TypeProStore','Ext.grid.plugin.CellEditing' ],
					initComponent : function() {
						this.cellEditing = new Ext.grid.plugin.CellEditing({
				            clicksToEdit: 2
				        });
						this.plugins=[this.cellEditing];
						this.columns =[
									{
										dataIndex : 'type',
										header : 'Type',
										flex : 1,
										editor:{
											allowBlank:false
										}
									}
									];
						
						sm = Ext.create('Ext.selection.CheckboxModel', {

							checkOnly : true

						});

						
						
						var deleteBtn = Ext.create('Ext.button.Button', {
							text : 'Supprimer',
							tooltip : 'Supprimer la s&eacute;lection',
							disabled : true,
							iconCls : 'removeBtn'
						});

						var addBtn = Ext.create('Ext.button.Button', {
							text : 'Nouveau',
							tooltip : 'Ajouter un type de client',
							iconCls : 'addBtn'
						});

																
						this.tbar = [addBtn,deleteBtn];

						

						this.selModel = sm;
						this.callParent(arguments);
						return;
						
					},
					setLoaded : function() {

						
					}

				});