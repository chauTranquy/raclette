Ext.define('TextoCMS.store.siteadmin.ExtraParamsStore', {
	requires:['TextoCMS.model.siteadmin.ExtraParamsModel'],
	model:'TextoCMS.model.siteadmin.ExtraParamsModel',
        extend: 'Ext.data.ArrayStore',
        id:'ExtraParamsStore',
        autoDestroy:true
    });
/**
 * 
 */