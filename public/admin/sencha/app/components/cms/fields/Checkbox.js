/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.Checkbox' ,{
	extend:'Ext.form.field.Checkbox',
	 alias : 'widget.check',
	 fieldName:'Case & cocher',
	xtype:'checkboxfield',
	rights:{
		write:1
	},
	initComponent:function(){
		
		
		this.readOnly=this.disabled=this.rights.write==0;
		
		this.callParent(arguments);
		
	}
	
});