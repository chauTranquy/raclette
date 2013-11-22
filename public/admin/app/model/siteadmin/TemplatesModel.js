Ext.define('TextoCMS.model.siteadmin.TemplatesModel',{
	extend:'Ext.data.Model',
	id:'TemplatesModel',
	fields: [
             {type: 'string', name: 'title'},
		        {type: 'string', name: 'name'}
		    ],
		    proxy:{
		    	type:'memory'
		    }
	
});