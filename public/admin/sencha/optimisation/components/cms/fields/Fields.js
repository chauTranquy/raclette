/**
 * 
 */

Ext.define('TextoCMS.components.cms.fields.Fields' ,{
	
	 override : 'Ext.form.field.Base',
	    initComponent : function()
	    {
	    		    	
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
	    	
	    	if(!this.labelSeparator)this.labelSeparator = "";
	        if(this.allowBlank!==undefined && !this.allowBlank)this.labelSeparator = '* :';
	        else this.labelSeparator = ' :';
	        this.callParent(arguments);
	    }
	});
