Ext
		.define(
				'TextoCMS.Modules.glutabye.view.EspaceProTab',
				{
					extend : 'Ext.panel.Panel',
					//title : 'Base client',
					requires:['TextoCMS.Modules.glutabye.view.ClientsProGrid','TextoCMS.Modules.glutabye.view.ClientsRequestGrid'],
					layout:'fit',
					border:false,
					items:[{xtype:'clientsprogrid', region:'center', flex:1}
					       ],
					
					alias : 'widget.espaceprotab',
					bodyPadding : '0',
					margin : 10,
					
					initComponent : function() {
						this.callParent(arguments);
					}
				});