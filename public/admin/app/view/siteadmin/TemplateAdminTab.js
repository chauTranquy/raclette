Ext.define('TextoCMS.view.siteadmin.TemplateAdminTab',{
	extend:'Ext.tab.Panel',
	requires:['TextoCMS.view.siteadmin.templatesAdminViews.TemplatesTree','TextoCMS.view.siteadmin.templatesAdminViews.GridTemplatesPanel'],
	alias:'widget.templateadmintab',
	title:'Gestion des gabarits',
	iconCls:'templatesIcon',
	plain:true,
	border:false,
	items:[{xtype:'templatestree', border:true}, {xtype:'gridtemplatespanel'}],    
    initComponent:function(){
    
    	this.callParent(arguments);
    
    	
    }
	
});/**
 * 
 */