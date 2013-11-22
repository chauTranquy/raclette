Ext.define('TextoCMS.components.cms.fields.Itemselect',{
	extend: 'Ext.ux.form.ItemSelector',
	requires:['TextoCMS.model.cms.ItemSelectorModel'],
	alias:'widget.itemselectfield',
	 fieldName:'Item selector',
	ddReorder:false,
	   displayField: 'label',
	    valueField: 'value',
	rights:{
		write:1
	},
	height:250,
	buttonsText: {
        top: "En haut",
        up: "Monter",
        add: "Ajouter &agrave; la s&eacute;lection",
        remove: "Supprimer de la s&eacute;lection",
        down: "Descendre",
        bottom: "En bas"
    },
	initComponent:function(){
		
		this.readOnly=this.disabled=this.rights.write==0;
		store = Ext.create('Ext.data.ArrayStore', {
		    autoDestroy: true,
		    idIndex: 0,
		    fields: [
		       'value',
		       'label'
		    ]
		});
			
		if(this.extraParams&&this.extraParams.data){
			
			var data = Ext.JSON.decode(this.extraParams.data);
			var arrayData = [];
			
			data.each(function(obj){
				arrayData.push([obj.value, obj.label]);
				
			}, this);
				
			store.loadData(arrayData);
		
			delete this.extraParams.data;
			
		}
		else if(this.extraParams&&this.extraParams.templateRef){
			store = Ext.create('Ext.data.ArrayStore', {
			    autoDestroy: true,
			    autoCreated:false,
			    model:'TextoCMS.model.cms.ItemSelectorModel'
			});
			var proxy = Ext.create('TextoCMS.proxy.Proxy');
			proxy.setExtraParam('API','Admin_Model_ArboMapper');
			proxy.setExtraParam('APICall','getRubByTemplateRef');
			proxy.setExtraParam('templateRef',this.extraParams.templateRef);
			proxy.setExtraParam('online',-1);
			proxy.setExtraParam('id_site',TextoCMS.siteId);
			proxy.setReader({type: 'json',root: 'result'});
		
			store.setProxy(proxy);
						
			//this.store = store;	
			delete this.extraParams.templateRef;
			store.load();
			
			
		}
		else if(this.extraParams&&this.extraParams.storeData){
		
			
			if(typeof this.extraParams.storeData=="string")this.extraParams.storeData=Ext.JSON.decode(this.extraParams.storeData);
		
			
			var customFields=[{name:'value', mapping:this.extraParams.storeData.valueField},{name:'label', mapping:this.extraParams.storeData.displayField}];
			var modelName='customModel'+new Date().getTime();
			Ext.define('TextoCMS.model.cms.'+modelName,{extend:'Ext.data.Model',
					fields:customFields
			});
			
					delete this.extraParams.storeData.displayField;
			delete this.extraParams.storeData.valueField;
			var	store = Ext.create('Ext.data.ArrayStore', {
			    autoDestroy: true,
			    autoCreated:false,
			    model:'TextoCMS.model.cms.'+modelName
			});

		var proxy = Ext.create('TextoCMS.proxy.Proxy');
		Ext.Object.each(this.extraParams.storeData, function(obj){
			proxy.setExtraParam(obj,this.extraParams.storeData[obj]);
		},this);
		
		proxy.setExtraParam('id_site',TextoCMS.siteId);
		proxy.setExtraParam('where','id_site='+TextoCMS.siteId);
		proxy.setReader({type: 'json',root: 'result'});
	
		store.setProxy(proxy);
		
		
		store.load();
			
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
		
		this.callParent(arguments);
		
	},
	afterLayout:function(){
		
		this.resetOriginalValue();
		this.callParent();
				
		
	}
	
});