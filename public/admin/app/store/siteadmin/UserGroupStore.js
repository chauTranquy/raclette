Ext.define('TextoCMS.store.siteadmin.UserGroupStore',{
	extend:'Ext.data.Store',
	requires:['TextoCMS.model.siteadmin.UserGroupModel'],
	model:'TextoCMS.model.siteadmin.UserGroupModel',
	autoLoad:false,
	  sorters: [
	              {
	                  property : 'title',
	                  direction: 'ASC'
	              }]
});