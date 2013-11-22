/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.Textarea' ,{
	extend:'Ext.form.field.TextArea',
	 alias : 'widget.textarea',
	 fieldName:'Zone de texte',
	xtype:'textareafield',
	rights:{
		write:1
	},
	initComponent:function(){
		
		this.readOnly=this.disabled=this.rights.write==0;
		
		
		this.callParent(arguments);
		
	}
	
});