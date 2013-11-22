Ext.define('TextoCMS.Modules.glutabye.store.EspaceProStore',{
	extend:'Ext.data.Store',
	requires:'TextoCMS.Modules.glutabye.model.EspaceProModel',
	model:'TextoCMS.Modules.glutabye.model.EspaceProModel',
	autoLoad:false,
	storeId:'EspaceProStore',
	sorters:[{
        property: 'name',
        direction:'ASC'
    }]
	
});