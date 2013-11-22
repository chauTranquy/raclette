Ext.define('TextoCMS.components.cms.fields.Multiselect',{
	extend:'Ext.ux.form.MultiSelect',
	alias:'widget.multiselectfield',
	 fieldName:'Liste &agrave; s&eacute;lection multiple',
	ddReorder:true,
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
		    ],
		    sorters:[{property:'label', direction:'ASC'}]
		});
		if(this.extraParams&&this.extraParams.data){
			
			var data = Ext.JSON.decode(this.extraParams.data);
			var arrayData = [];
			
			data.each(function(obj){
				arrayData.push([obj.value, obj.label]);
				
			}, this);
			
			store.loadData(data);
			
			
			
		}
		this.store = store;	
		if(this.extraParams)for(key in this.extraParams){
			
			var value=this.extraParams[key];
			switch(value){
			case "true":
			case "false":
				value = value=="true";
			break;
			case "height":
			case "width":
				value = parseInt(value);
				break;

			}
			this[key]=value;
    		
    	};
		this.height=parseInt(this.height);
		
		this.callParent(arguments);
		
	}
	
});