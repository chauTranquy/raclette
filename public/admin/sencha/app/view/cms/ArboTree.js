Ext.define('TextoCMS.view.cms.ArboTree',{
	extend:'Ext.tree.Panel',
	alias:'widget.arbotree',
	//collapseFirst:true,
		tools:[{type:'refresh'}],
	    loadMask:true,
		loadingText:'+ de l\'arborescence',
		singleSelect:true,
		 collapseFirst:false,
		rootVisible: false,
		isRendered:false,
		viewConfig: {
			deferInitialRefresh:false,
			plugins: {
	            ptype: 'treeviewdragdrop',
	            dragText:'{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}'
	        }
	    },
		initComponent:function(){
			this.root = {expanded:true, text:'fdfdfdfd', selected:true, id_rubrique:this.rubrique_id};
			var store = Ext.create('TextoCMS.store.cms.ArboTreeStore');//rubrique_id
			store.model.getProxy().setExtraParam('rootID', this.rubrique_id);
			store.model.getProxy().setExtraParam('id_site',TextoCMS.siteId);
			store.model.getProxy().setExtraParam('API', 'Admin_Model_ArboMapper');
			store.model.getProxy().setExtraParam('APICall', 'getArbo');
			//store.model.getProxy().setExtraParam('deep', false);
			store.on('beforeload', function(st){
				
				return this.isRendered;
				
				
			}, this);
			store.on('load',function(store, model){

				
				if(store.getRootNode().firstChild.childNodes.length>0)store.getRootNode().firstChild.expand();
				//this.store.reload();
				//if(!this.isLoadedOnce)this.getView().refresh();
				//if(!this.isLoadedOnce)this.down('[type=refresh]').fireEvent('click', this.down('[type=refresh]'));
				
				
				this.isLoadedOnce=true;
				
			}, this);
			
			
			this.store=store;
			
			
			this.on('afterrender', function(view){
				
				this.isRendered=true;
				store.load();
				
				
			}, this);
			 this.callParent(arguments);
		}

	
});