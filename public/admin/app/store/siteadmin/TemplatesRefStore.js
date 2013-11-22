Ext.define('TextoCMS.store.siteadmin.TemplatesRefStore',{
	extend:'Ext.data.Store',
	requires:['TextoCMS.model.siteadmin.TemplatesRefModel'],
	model:'TextoCMS.model.siteadmin.TemplatesRefModel',
	id:'TemplatesRefStore',
	autoLoad:false
	
});