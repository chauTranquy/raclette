Ext.define('TextoCMS.Modules.glutabye.model.EspaceProModel',{
extend : 'Ext.data.Model',
idProperty:'id_espacepro',
	fields : [ {mapping:'id_espacepro',name:'id_groupe',type:'int'},
	           {
		name : 'name',
		mapping : 'name',
		sortType:Ext.data.SortTypes.asUCText
	}, 'description',{name:'status', type:'bool'} ],
	proxy:{type:'texto', extraParams : {
		API : 'Cmsmodules_Model_EspaceProMapper',
		APICall : 'fetchAll',
		where:'id_site='+TextoCMS.siteId
		
	}}
	
});