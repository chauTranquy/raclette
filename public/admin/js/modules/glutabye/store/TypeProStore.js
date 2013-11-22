Ext.define('TextoCMS.Modules.glutabye.store.TypeProStore',{
	extend:'Ext.data.Store',
	requires:'TextoCMS.Modules.glutabye.model.TypeProModel',
	model:'TextoCMS.Modules.glutabye.model.TypeProModel',
	autoLoad:false,
	storeId:'TypeProStore',
	sorters:[{
        property: 'type'
    }]
	
});