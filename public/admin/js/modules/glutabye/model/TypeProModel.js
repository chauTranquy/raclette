Ext.define('TextoCMS.Modules.glutabye.model.TypeProModel',{
extend : 'Ext.data.Model',
	
	fields : [ {name:'id_type',type:'int'}, 'type',{name:'id_site', type:'int'}],
	proxy:{type:'texto', extraParams : {
		API : 'Cmsmodules_Model_TypeProMapper',
		APICall : 'fetchAll',
		where:'id_site='+TextoCMS.siteId
		
	}}
	
});