Ext.define('TextoCMS.model.siteadmin.TemplatesTreeModel',{
	 extend: 'Ext.data.Model',
     fields: [
         {name: 'id_template',     type: 'int'},
         {name: 'template_name',     type: 'string'},
         {name: 'parent_id', type: 'int'},
         {name: 'templateRef', type: 'string'},
         {name: 'child_required', type: 'int'},
         {name:'iconCls', mapping:'type'}
     ],
     proxy:{type:'texto'}
	
});