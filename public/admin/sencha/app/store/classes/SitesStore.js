Ext.define('TextoCMS.store.classes.SitesStore',{
	extend:'Ext.data.Store',
	storeId:'SitesStore',
	requires:['TextoCMS.model.classes.SitesModel'],
	model:'TextoCMS.model.classes.SitesModel'
	
});