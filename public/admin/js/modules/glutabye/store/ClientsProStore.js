Ext.define('TextoCMS.Modules.glutabye.store.ClientsProStore',{
	extend:'Ext.data.Store',
	requires:'TextoCMS.Modules.glutabye.model.ClientsProModel',
	model:'TextoCMS.Modules.glutabye.model.ClientsProModel',
	autoLoad:false,
	storeId:'ClientsProStore',
	groupField: 'groupName',
	sorters:[{
        property: 'groupName'
    }]
	
});