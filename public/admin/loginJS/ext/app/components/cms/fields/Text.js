/**
 * 
 */

Ext.define('CMS.components.cms.fields.Text' ,{
	extend:'CMS.components.cms.fields.Fields',
	 alias : 'widget.text',
	xtype:'textfield',
	rights:{
		write:1
	},
	initComponent:function(){
		
		if(this.extraParams){
			
			for(param in this.extraParams){
				this[param]=this.extraParams[param];
				
				
			}
			
		}
		var me=this;
		this.fieldLabel+=(this.allowBlank?'':'*');
		this.readOnly=this.rights.write==0;
		this.callParent(arguments);
		
	}
	
});