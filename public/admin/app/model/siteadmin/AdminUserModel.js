Ext.define('TextoCMS.model.siteadmin.AdminUserModel',{
	 extend: 'Ext.data.Model',
	    fields: [
	             {name:'text', type:'string', convert:function(v, record){
	            	 if(record.data.type=="user") return record.data.firstname+' '+record.data.lastname;		            	 
//	            	 var extraText = record.data.children.length==0?"aucun utilisateur":record.data.children.length+' utilisateur'+(record.data.children.length>1?"s":"");
	            	 
	            	 return "<strong>"+record.data.group_name+'</strong>';// ('+extraText+')';
	            	 
	             }},
	             'firstname','lastname','group_name',{name:'id_user_group', type:'int'},
	             {name:'isLeaf'},
	             'children','type',{name:'id_user', type:'int'},
	             {name:'iconCls', mapping:'type', convert:function(v){
	            	 
	            	 return v+'Icon';
	            	 
	             }},
	             {name:'superadmin', type:'boolean'},
	             'pseudo',
	             'email',{name:'active', type:'boolean'},{name:'creation_date', type:'date', dateFormat:'Y-m-d H:i:s'}, {name:'last_connexion', type:'date', dateFormat:'Y-m-d H:i:s'}

	    ],
	    proxy:{type:'texto'}
	
});