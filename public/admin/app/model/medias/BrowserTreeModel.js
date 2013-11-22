Ext.define('TextoCMS.model.medias.BrowserTreeModel', {
	extend : 'Ext.data.Model',
	
	fields : [ 'name', 'path', {
		name : 'qtip',
		mapping : 'name'
	},{name:'iconCls',convert:function(v, record){
		
		if(v=="folder") return v;
		
		var ext=record.get('name').split('.').pop();
		
		if(ext=="php"||ext=="phtml") return "file_php";
		if(ext=="css") return "file_css";
		if(ext=="js"||ext=="json") return "file_js";
		return v;
		
	}
		
		
	},/* {
		name : "isLeaf",
		mapping : "children",
		convert : function(v) {
			return v.length == 0;

		}
	}, */{
		name : 'text',
		mapping : 'name',
		convert:function(v,record){
			
			return record.raw.name;
			
			
		},
		sortType:Ext.data.SortTypes.asUCText
	} ]
});