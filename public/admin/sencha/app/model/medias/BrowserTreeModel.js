Ext.define('TextoCMS.model.medias.BrowserTreeModel', {
	extend : 'Ext.data.Model',
	
	fields : [ 'name', 'path', {
		name : 'qtip',
		mapping : 'name'
	},/* {
		name : "isLeaf",
		mapping : "children",
		convert : function(v) {
			return v.length == 0;

		}
	}, */{
		name : 'text',
		mapping : 'name'
	} ],
	proxy:{type:'texto'}
});