Ext.define('TextoCMS.model.cms.ItemSelectorModel', {
	extend : 'Ext.data.Model',
	idProperty : 'id_rubrique',
	fields:[{name:'value', mapping:'id_rubrique'},{name:'status', type:'bool'},{name:'label',mapping:'title', convert:function(v, record){
		
		var statusIcon=record.get('status')?'accept.png':'stop.png';
		
		return v+'<img src="/admin/img/icons/'+statusIcon+'" />';
		
	}}]
});