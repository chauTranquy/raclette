Ext.define('TextoCMS.model.classes.AdminUserModel',{
	requires:['TextoCMS.proxy.Proxy'],
	 extend: 'Ext.data.Model',
	fields:['uid',{name:'superAdmin', type:'boolean'}],
	 proxy:{
		 type:'texto',
		 extraParams:{API : '',
	 
			APICall : 'loadAdminUserInfo'},
	reader:{type:'json',root:'userData' }		
	 }
	
	
});