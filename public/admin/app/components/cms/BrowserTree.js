/**
 * 
 */
Ext.define('TextoCMS.components.cms.BrowserTree' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.browsertree',
    requires:['TextoCMS.store.medias.BrowserTreeStore'],
    border:true,
    ajax : Ext.bind(TextoCMS.Ajax.ajaxRequest, TextoCMS.Ajax),
    baseFolder:null,
    root:{expanded:true, text:'Gestionnaire de m&eacute;dia', selected:true},
	rootVisible: false,
	folder:null,
	targetFolder:null,
	loadMask:true,
	API:'Application_Model_FileManager',
	APICall:'getFolderList',
	extraParams:{},
	recursive:false,
	selectedNode:null,
	rootparams:null,
	loadCB:Ext.emptyFn,
	initComponent: function() {
		this.store= Ext.create('TextoCMS.store.medias.BrowserTreeStore',{listeners:{scope:this, reload:this.reload}, reload:this.reload});
		
		/*this.store.model.getProxy().setExtraParam('API', this.API);
		this.store.model.getProxy().setExtraParam('APICall', this.APICall);
		this.store.model.getProxy().setExtraParam('baseFolder', this.baseFolder);
		this.store.model.getProxy().setExtraParam('id_site', TextoCMS.siteId);
		this.store.model.getProxy().setExtraParam('targetFolder', this.targetFolder);
		Ext.Object.each(this.extraParams,function(obj){
			this.store.model.getProxy().setExtraParam('targetFolder', this.targetFolder);
			
		},this);
		*/
		
		
		

		
	this.makeAjaxCall();
	
	    this.callParent(arguments);
	   
	    this.store.on('beforeload', function(tree, op){
	    	op.params.root=op.node.get('path');
	    	
	    	
	    this.setLoading('Chargement en cours');
	    	
	    }.bind(this));
	    
	    this.on('afterrender', function(){
		    if(this.store.isLoading())this.setLoading('Chargement en cours');
		    	
		    }.bind(this));
	    
	    
	           
    }, 
    reload:function(){
    	//console.log('reolad');
    	
    },
    
    afterLoad:function(){
    	this.setLoading(false);

    	if(this.store.getRootNode().firstChild&&this.store.getRootNode().firstChild.childNodes.length>0)this.store.getRootNode().firstChild.expand();
    	this.loadCB(this.store);
    	
    },
    makeAjaxCall:function(){
    	
    	    	
    	
    	var params={
    		API:this.API,
    		APICall:this.APICall,
    		baseFolder: this.baseFolder,
    		id_site: TextoCMS.siteId,
    		targetFolder:this.targetFolder,
    		root:this.rootparams,
    		recursive:this.recursive
    			
    	};
    	
    	Ext.Object.each(this.extraParams,function(obj){
			params[obj]=this.extraParams[obj];
			
		},this);
    	var me = this;
    	this.ajax(DEFAULT_ADMIN_URL, params, Ext.bind(me.ajaxLoaded,me), false);
    	
    	
    },
    ajaxLoaded:function(response){
    	
    	if(this.selectedNode===null){
    	this.store.getRootNode().removeAll();
    	this.store.getRootNode().appendChild(response);
    	
    	
    	}else{
    		
    		response.each(function(nodeData){
    		
    			var newNode = Ext.create('TextoCMS.model.medias.BrowserTreeModel', nodeData);
    			
    		}, this);
    		
    		this.selectedNode.appendChild(response);
    		
    	}
    	this.afterLoad(this.store);
    	
    }

});