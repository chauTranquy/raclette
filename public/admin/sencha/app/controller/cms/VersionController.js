Ext.define('TextoCMS.controller.cms.VersionController',{
	extend: 'TextoCMS.controller.BaseController',
	refs:[
	      {ref:'deleteVersionBtn', selector:'versiontab [iconCls=removeBtn]'},
	      {ref:'versionTab', selector:'versiontab'}
	      ],
	init:function(){
		this.control({
			'versiontab [iconCls=removeBtn]':{
				click:this.deleteVersion
				
			},
			'versiontab':{
				selectionchange: this.filterVersionSelection,
                select:this.filterVersionSelection,
                deselect:this.filterVersionSelection
				
			},
			'versiontab actioncolumn':{
				click:this.editVersion
				
			}
			
			
		});
		
		this.callParent(arguments);
	},
	/**
	 * Supprime la sélection
	 * @param sm
	 */
	deleteVersion:function(){
		
		var sm = this.getVersionTab().getSelectionModel();
		
		var selection=this.getVersionSelection(sm);
		if(selection.length==0)return;
		
		var intitule=selection.length==1?'d\'une version':'de plusieurs versions';
		
		Ext.Msg.show({
		     title:'Suppression '+intitule,
		     msg: 'Attention, la suppression '+intitule+' est d&eacute;finitive !<br />Voulez-vous continuer ?',
		     buttons: Ext.Msg.YESNO,
		     icon: Ext.Msg.WARNING,
		     fn:function(btn){
		    	 if(btn=='no') return;
		    	 
		    	 var items=[];
		    	 
		    	 selection.each(function(elt, index){
		    		 items.push(elt.internalId);
		    		 
		    	 }, this);

		    	 var params={API:'Application_Model_ContentMapper', APICall:'delete', items:items.join(';')};
		    	 this.ajax(DEFAULT_ADMIN_URL,params, function(response){
		    	
		    		 if(response.result)this.version_id=response.result.version_id;
		    		 this.getVersionTab().store.load();
		    		 			    		 
		    	 }.bind(this));	    	 
		    	 
		     }.bind(this),
		     scope:this
		     
		});
		
		
	},
	/**
	 * filtre la sélection pour ne pas sélectionner la version courante
	 * @param sm selmodel
	 * returns {Void}
	 */
	filterVersionSelection:function(sm){
		var selection=this.getVersionSelection(sm);
		this.getDeleteVersionBtn().setDisabled(selection.length==0);
		if(selection.length==0)sm.deselectAll();
	},
	/**
	 * supprime le record de la version courante dans la sélection
	 * @param sm
	 * @returns {Array}
	 */
	getVersionSelection:function(sm){
		
		var selection = sm.getSelection();
		var selection2=[];
		
		selection.each(function(elt,index){
			    			
			if(elt.store.getCount()!=1&&elt.get('status')!=1&&elt.get('version_id')!=this.version_id)selection2.push(elt);
			else sm.deselect(elt); 			
			
		}, this);
		
		return selection2;
		
	},
	/**
	 * Edite la version sélectionnée
	 * @param grid
	 * @param rowIndex
	 * @param colIndex
	 */
	editVersion:function(view, cell, row) {
        var rec = this.getVersionTab().getStore().getAt(row);       
        var contentController = this.getContentController();
  		contentController.checkCMSFormDirty(contentController.loadFormData.bind(contentController,contentController.selectedRub, rec.get('version_id')), contentController.selectedRub, null, contentController.selectedRub);
       
        }
});