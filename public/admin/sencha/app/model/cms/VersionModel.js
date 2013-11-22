Ext.define('TextoCMS.model.cms.VersionModel', {
		    extend: 'Ext.data.Model',
		    idProperty:'id_content',			
			fields: [{name:'status',type:'int'},{name:'creation_date', convert:function(v){
				var date=Ext.Date.parseDate(v,'Y-m-d H:i:s');
				return date;
				
			}},{name:'update_date', convert:function(v){
				
				if (v==null) return null;
							var date=Ext.Date.parseDate(v,'Y-m-d H:i:s');
				return date;
			}},
			{name:'version_id', type:'int'}, 'userName'],
			proxy:{type:'texto'}
});