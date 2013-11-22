Ext.define('TextoCMS.store.siteadmin.TemplatesTreeStore',{
	extend:'Ext.data.TreeStore',
	requires:['TextoCMS.model.siteadmin.TemplatesTreeModel'],
	model:'TextoCMS.model.siteadmin.TemplatesTreeModel',
	storeId:'TemplatesTreeStore',
	autoLoad:false
	
});