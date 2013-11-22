Ext.define('TextoCMS.Modules.glutabye.view.GlutabyeMainTab', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.glutabyetab',
	requires : [ 'TextoCMS.Modules.glutabye.view.EspaceProTab' ],
	title : 'Espace Pro',
	iconCls : 'espacepro',
	border : false,
	layout : 'fit',
	items : [ {
		title : 'Demandes en attente',
		bodyPadding : 5,
		layout : 'hbox',
		tbar:[{
			xtype : 'combo',
			forceSelection:true,
			labelWidth:50,
			labelStyle:'text-align:right;',
			width:250,
			store : new Ext.data.ArrayStore(
					{
						fields : [ 'value',
								'label' ],
						data : [
						        
								[ 1, 'Afficher les demandes en attente'],
								[ 2, 'Afficher les demandes refusées' ],
								[ 3, 'Afficher toutes les demandes']]
					}),
			name : 'civilite',
			value:1,
			fieldLabel:'Trier',
			displayField : 'label',
			valueField : 'value',
			allowBlank:false

		},'-',{text:'Recharger les donn&eacute;es', iconCls:'refresh', id:'refreshRequestGrid'}],
		border : false,
		items : [ {
			xtype : 'clientsrequestgrid',
			width:'50%',
			border : true,
			margin : 5
		}, {
			xtype : 'validrequest',
			width:'50%',
			border : true,
			hidden : true,
			margin : 5
		} ]
	},

	{
		xtype : 'clientsprogrid'
	} ]

});