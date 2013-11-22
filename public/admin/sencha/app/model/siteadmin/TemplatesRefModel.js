Ext.define('TextoCMS.model.siteadmin.TemplatesRefModel',{
	extend: 'Ext.data.Model',
	    fields: [
	        {type: 'int', name: 'id_templateRef'},
	        {type: 'string', name: 'templateRef'},
	        {type: 'string', name: 'description'},
	        {type: 'string', name: 'callback'},
	        {type: 'string', name: 'type'},
	        {name:'publiable', type:'bool'},
	        {type: 'int', name: 'numFields'}
	    ],
	    proxy:{type:'texto'}
	
});