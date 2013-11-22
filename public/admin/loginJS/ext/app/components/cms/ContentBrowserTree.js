/**
 * 
 */
Ext.define('CMS.components.cms.ContentBrowserTree' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.contentbrowsertree',
    border:true,
    layout:'accordion',
    selectCB:Ext.emptyFn,
	items:[],
	filter:{},
	initComponent: function() {
		this.rootIDs.each(function(rootID){
			Ext.define('model1_'+rootID, {
			    extend: 'Ext.data.Model',
			    idProperty:'id_rubrique',			
				fields: ['type','title','templateRef',{name:'id_template', type:'int'},{name:'statut',type:'int'},{name:'id_rubrique', type:'int'}, {name:'text', mapping:'title'},{name:'id_template', type:'int'},{name:'iconCls', mapping:'type', 
				convert:function(v,record){
					
					var v=record.data.type;
					
					if(record.data.statut==0)v+='Offline';
					return v;
				}
			},{name:'qtip', mapping:'title',convert:function(v,record){
				v=record.data.title+' - '+(record.data.statut==0?'Hors ligne':'En ligne');
				return v;
				
			}}, {name:'treeRef', convert:function(){
				
				return 'browserArbo_'+rootID;
			}}],
			proxy: {
				actionMethods:'post',
			    extraParams: {
			       API: 'Application_Model_ArboMapper',
			        APICall: 'getArbo',
			        onlyActive:0,
			        rootID:rootID
			    },
			    type: 'ajax',
			    url: '/admin/getjsondata?format=json'
			}
	});
			
			var store2 = Ext.create('Ext.data.TreeStore',{
				model:'model1_'+rootID,
				storeId:'storeArbo_'+rootID,
				listeners:{
					scope:this,
					load:function(store){
						var tree=Ext.getCmp('browserArbo_'+rootID);
						
						if(tree.getRootNode().childNodes[0])tree.setTitle(tree.getRootNode().childNodes[0].get('text'));
						if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
						
					}
					
				}
			  });
	 
			var treeMenu=Ext.create('Ext.tree.Panel',{
				border:true,
				layout:'fit',
				collapseFirst:true,
				//title:title,
				id:'browserArbo_'+rootID,
				autoWidth:true,			
			    store:store2,
			    tools:[{type:'refresh', scope:this, handler:this.refreshTree}],
			    loadMask:true,
	    		loadingText:'Chargement de l\'arborescence',
	    		singleSelect:true,
	    		root:{expanded:true, text:'', selected:true, id_rubrique:rootID},
	    		rootVisible: false,
	    		listeners:{
	    		scope:this,
	    		
	    		afterlayout:function(tree){
	    		
	    			if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
	    			
	    		},
	    		itemclick:this.selectCB
	    		
	    	}
	});
			this.items.push(treeMenu);
			
		}, this);
		
        this.callParent(arguments);
           
    },
    refreshTree:function(e,elt,panel, tool){
		
    	panel.up("treepanel").store.load();//.store.reload();
    	},

});
