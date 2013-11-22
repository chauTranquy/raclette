/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.Text' ,{
	extend:'Ext.form.field.Text',
	 alias : 'widget.text',
	 fieldName:'Champs texte',
	xtype:'textfield',
	rights:{
		write:1
	},
	initComponent:function(){


		
		this.readOnly=this.disabled=this.rights.write==0;
		
		this.callParent(arguments);
		
	}
	
});