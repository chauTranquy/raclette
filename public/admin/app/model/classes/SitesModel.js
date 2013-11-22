Ext.define('TextoCMS.model.classes.SitesModel',{
	requires:['TextoCMS.proxy.Proxy'],
	 extend: 'Ext.data.Model',
	 idProperty:'id_site',
	fields:['site_name','site_url', 'id_site'],
	autoLoad:false,
	 proxy:{type:'texto',extraParams:{API : 'Admin_Model_SitesMapper',
			APICall : 'getSiteList'},
	reader:{type:'json',root:'sites' }		
	 }
	
	
});