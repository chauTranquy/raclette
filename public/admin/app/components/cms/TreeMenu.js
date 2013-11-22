Ext.define('TextoCMS.components.cms.TreeMenu' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.treemenu',
   // xtype:'panel',
	border:true,
	 collapseFirst:false,
	layout:'fit',
	
	//title:'Arborescence du site',
		
	viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            dragText:'{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}'
        }
    },
    
    initComponent: function() {
        	var me = this;
    	Ext.apply(me,{
    		tools:[{type:'refresh', handler:this.refreshTree, scope:this}],
    		loadingText:'Chargement de l\'arborescence',
    		singleSelect:true,
    		 collapseFirst:false,
    		//store:'TreeArbo',
    	    rootVisible: true,
    	    root:{expanded:true, text:'Racine du site', selected:true},
    		listeners:{
    		beforeload:function(store, op){
    			
    			
    			
    		},
    		load:function(){
    			
//    			this.renderered=true;
//    			this.getView().selModel.select(this.getRootNode());
    			//this.fireEvent('itemclick',this.getView(),this.getRootNode());
    			
    		},
    		scope:this
    		
    	}
    	}
    	);

        	
        this.callParent(arguments);
           
    },
    refreshTree:function(){
    	this.store.load();
        	
    }
    	});