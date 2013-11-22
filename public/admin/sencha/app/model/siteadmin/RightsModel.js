Ext.define('TextoCMS.model.siteadmin.RightsModel', {
	    extend: 'Ext.data.Model',
	    fields: [
	        
	        {name:'text'},
	        {name:'moduleName'},
	        {name:'plugin'},
	        {type: 'string', name: 'type'},
	        {name:'children',convert:function(v, record){
	        	var children=[];
	        	if(typeof v=="array"||typeof v=="object") return v;
	        	return children;
	        
	        }
	        },
	        {name:'rubId', type:'int'},
	        {name:'isLeaf', mapping:'children', convert:function(v,record){
	    
	        if(record.get('children')==null) return true; 
	        
	        return record.get('children').length==0?true:false;	
	        
	        }
	        },{name:'leaf',mapping:'children', convert:function(v, record){
	        	if(record.get('children')==null) return true; 
		        
		        return record.get('children').length==0?true:false;
	        	
	        }},
	        {name:'iconCls', mapping:'type', convert:function(v){
	        	
	        	
	        	if(v=="folder") return 'folder';
	        	if(v=="page") return 'page';
	        	if(v=="plugin") return 'pluginIcon';
	        	
	        	return 'moduleIcon';
	        	
	        }},
	        {type:'bool', name:'read'},
	        {type:'bool', name:'write'},
	        {type:'bool', name:'edit'},
	        {type:'int',name:'id_site'}
//	        'rights'
	    ]});