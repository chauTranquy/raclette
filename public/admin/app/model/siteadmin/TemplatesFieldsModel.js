Ext.define('TextoCMS.model.siteadmin.TemplatesFieldsModel',{
	extend: 'Ext.data.Model',
	    fields: [
	             {type: 'int', name: 'id_field'},
	 	        {type: 'string', name: 'field_type',convert:function(v){
	 	        	return v.toLowerCase();
	 	        	
	 	        }},
	 	        {type: 'boolean', name: 'compulsary'},
	 	        {type: 'string', name: 'templateRef'},
	 	        {type: 'string', name: 'label'},
	 	        {type: 'int', name: 'ordre'},
	 	        {type: 'string', name: 'field_name'},
	 	        {type: 'string', name: 'label'},
	 	        {name:'extra_params', convert:function(v){
	 	        	
	 	        
	 	        	try{return Ext.JSON.decode(v);}
	 	        	catch(e){};
	 	        	
	 	        	return v;//Ext.JSON.decode(v);
	 	        	
	 	        }}
	    ],
	    proxy:{type:'texto'}
	
});