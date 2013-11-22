/**
 * 
 */
Ext.define('CMS.components.cms.BrowserTree' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.browsertree',
    border:true,
	layout:'fit',
	modelName:'model_tree',
	initComponent: function() {
    	Ext.define(this.modelName, {
		    extend: 'Ext.data.Model',
		    fields: ['name','path',{name:'qtip', mapping:'name'},{name:"isLeaf", mapping:"children",convert:function(v){
		    	return v.length==0;
		    	
		    }},{name:'text',mapping:'name'},{name:'treeRef',convert:function(){return "treeFileManager";}}],
		proxy: {
			actionMethods:'post',
		    extraParams: {
		       API: 'Application_Model_FileManager',
		        APICall: 'getFolderList',
		        batchAction:false
		    },		  
		   request:null,
		    type: 'ajax',
		    url: '/admin/getjsondata?format=json'
		}
});
		
		this.treeStore= Ext.create('Ext.data.TreeStore',{
			
			model:this.modelName,
			storeId:'store_'+this.modelName,
			sorters: [
                      
                      {
                          property : 'text',
                          direction: 'ASC'
                      }
                  ]
			
		  });
    	//store.storeId="store"+this.rootID;
    	
	
		
    	var me = this;
    	Ext.apply(me,{
    		loadingText:'Chargement de l\'arborescence',
    		loadMask:true,
    		singleSelect:true,
    		store:me.treeStore
    		
    	}
    	);

        	
    	
    	
        this.callParent(arguments);
           
    }	});