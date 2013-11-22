/**
 * 
 */
Ext.define('CmsClass.Users', {
	extend:'CmsClass.BaseClass',
	isTree:true,
	panelTitle:'Mon profil',
	
	constructor:function(){
		
		this.initUserPanel();
		
	},
	
	initUserPanel:function(){
		
		Ext.define('userTreeModel', {
		    extend: 'Ext.data.Model',
		    fields: [{name:'qtip', mapping:'qtip'},'isLeaf','text',{name:'treeRef',convert:function(){return "treeUsers";}}, 'callback'],
		    proxy: {
		        type: 'memory',
		        reader:{
		        type:'json',
		        root:'rows'
		        }
		        
			}
			
		});
		
		var store = Ext.create('Ext.data.TreeStore', {
			model:'userTreeModel',
			autoLoad:true,
			listeners:{
				scope:this,
				load:function(st){
					var newNode=Ext.ModelManager.create({"text":"Mes informations", "leaf": "true", "callback":this.displayInfosForm.bind(this) }, 'userTreeModel');
					
					st.getRootNode().appendChild(newNode);
					
				}
				
			}
			 
		    
		});     

		
		
		
		this.panel = Ext.create('Ext.tree.Panel',{
			title:this.panelTitle,
			iconCls:'userPanel',
			id:'treeUsers',
			store:store,
			rootVisible:false,
			listeners:{
	    		scope:this,
	    		
	    		afterlayout:function(tree){

	    			if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
	    			
	    		},

	    		itemclick:this.itemClick
	    	}
			
		});
		store.load();
		
		
		
		
	},
	itemClick:function(view,record,htmlElement,index,e){
		
		if(record==undefined)record=this.selectedRub;
		
		var callBack=record.get('callback');
		console.log(callBack);
		console.log(record);
		
		var cb=(callBack!=undefined&& typeof callBack=="function"?callBack:Ext.emptyFn)
		if(this.cmsClass.selectedRub!=null&&!this.checkCMSFormDirty(callBack, record, view, this.cmsClass.selectedRub)) return;
		callBack();
		this.panel.expand();
		
	},
	displayInfosForm:function(elt){
		
		console.log('ok');
		
	}
	
	
});
