/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.Combo' ,{
	extend:'Ext.form.field.ComboBox',
	 alias: 'widget.combofield',
	 fieldName:'Liste',
	 queryMode: 'local',
	    displayField: 'label',
	    valueField: 'value',
	rights:{
		write:1
	},
	initComponent:function(){
		
		this.readOnly=this.disabled=this.rights.write==0;
		
		var store = Ext.create('Ext.data.ArrayStore', {
		    
		    autoDestroy: true,
		 
		    idIndex: 0,
		    fields: [
		       'value',
		       'label'
		    ]
		});
			
		
		if(Ext.isString(this.extraParams))this.extraParams=Ext.JSON.decode(this.extraParams, true);
		
		if(this.extraParams&&this.extraParams.data){
					
			var data = Ext.isString(this.extraParams.data)?Ext.JSON.decode(this.extraParams.data):this.extraParams.data;
			var arrayData = [];
		
			data.each(function(obj){
				arrayData.push([obj.value, obj.label]);
				
			}, this);
			
			store.loadData(arrayData);
			
			delete this.extraParams.data;
			
		}
		
		this.store = store;	
		this.callParent(arguments);
		
	}
	
});