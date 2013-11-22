Ext.define('TextoCMS.view.siteadmin.templatesAdminViews.GridTemplatesPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.gridtemplatespanel',
	iconCls : 'templatesEdit',
	title : 'Structure des gabarits',
	border:false,
	requires : [ 
	             'TextoCMS.view.siteadmin.templatesAdminViews.GridTemplates'
			 
	             ],
	layout : 'border',
	defaults:{
		border:true
	},
	items : [ 
	     {
		xtype:'gridtemplates',
		region : 'west',
		width : 400
	}, {
		xtype : 'panel',
		region : 'center',
		padding:'10 0 0 10',
		layout:'fit',
		border:false
	} ],
	initComponent:function(){
		

		
		this.callParent(arguments);
	}

});
