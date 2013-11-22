/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.Datefield' ,{
	extend:'Ext.form.field.Date',
	 aliases : ['widget.date,widget.datefield'],
	 fieldName:'Champ de date',
	
	rights:{
		write:1
	},
	initComponent:function(){
		
		this.readOnly=this.disabled=this.rights.write==0;
		
		this.width=200;
		
		this.callParent(arguments);
		
	}
	
});