Ext.define('TextoCMS.components.cms.fields.NumberField' ,{
	extend:'Ext.form.field.Number',
	 alias: 'widget.numberfield',
	 fieldName:'Champ nombre',
	allowDecimals:true,
	step:0.1,
	 maxValue:100,
	 minValue:0,
	 allowZero:false,
	 extraParams:{},
	rights:{
		write:1
	},
	initComponent:function(){
		
		Ext.Object.each(this.extraParams, function(key, value){


			if(key=='step')this.extraParams[key]=parseFloat(value);
			if(key=='maxValue')this.extraParams[key]=parseInt(value);
			if(key=='minValue')this.extraParams[key]=parseInt(value);
			if(key=='decimalPrecision')this.extraParams[key]=parseInt(value);
			if(key=='allowDecimals')this.extraParams[key]=value=="true";
			if(key=='allowZero')this.allowZero=value=="true"?true:false;
			
			
		}, this);
		
		var me =this;

		if(this.allowBlank==false&&!this.validator)this.validator=function(value){
			if(value<=0&&!me.allowZero) return "la valeur de ce champ doit &ecirc;tre sup&eacute;rieure &agrave; 0";
			return true;
		}

		
		this.readOnly=this.disabled=this.rights.write==0;
		this.callParent(arguments);
	}
});