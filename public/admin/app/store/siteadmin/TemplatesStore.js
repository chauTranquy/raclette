Ext.define('TextoCMS.store.siteadmin.TemplatesStore',{
	extend:'Ext.data.Store',
	id:'TemplatesStore',
	requires:['TextoCMS.model.siteadmin.TemplatesModel'],
	model:'TextoCMS.model.siteadmin.TemplatesModel',
	//autoLoad:false,
	  sorters: [{
		  property : 'title',
		  direction: 'ASC'
	              }]
});