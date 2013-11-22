Ext.define('TextoCMS.controller.cms.FormController',{ 
	extend: 'TextoCMS.controller.BaseController',
	refs:[
	    {ref:'form',selector:'cmstab form'},
	    {ref:'contentform', selector:'contentform'},
	    {ref:'saveBtn', selector:'contentform [iconCls=saveBtn]'},
	    {ref:'publishBtn',selector:'#publishBtn'},
	    {ref:'unpublishBtn',selector:'#unpublishBtn'},
	    {ref:'refreshBtn', selector:'#refreshBtn'},
	    {ref:'removeBtn', selector:'#folderBtn button[iconCls=removeBtn]'},
	    {ref:'infoPanel', selector:'#infoPanel'},
	    {ref:'previewBtn', selector:'#previewBtn'}
	],
	/**
	 * Initialisation
	 */
	init:function(){
		this.control({
			'contentform':{
			validitychange:this.checkForm,
			dirtychange:this.checkDirty		
			},
			'contentform buttongroup [action]':{
				click:this.saveForm		
			},
			'#refreshBtn':{
				'click':this.refreshForm
			},
			'#folderBtn button[iconCls=editBtn],#folderBtn button[iconCls=addBtn]':{
				click: this.addArboItems
				
			},
			'#folderBtn button[iconCls=removeBtn]':{
				click:this.deleteFolder
			},
			'#saveArboBtn':{
				click: this.updateArbo
				
			},
			'#previewBtn':{
				click:this.previewPage
				
			}
			
		});
	
		this.callParent(arguments);
		
	},
	/**
	 * handler validitychange du formulaire contentform, modifie l'état des boutons de la tbar
	 * 
	 * @param form
	 * @param isValid
	 * @returns
	 */
	checkForm:function(form, isValid) {
		var rights = this.getContentform().data.rights;
		if(!form.isDirty()) return this.getSaveBtn().setDisabled(true);
		this.getSaveBtn().setDisabled(!isValid||rights.write==0);
		this.getPublishBtn().setDisabled(!isValid||rights.write==0);
	},
	/**
	 * handler dirtychange du formulaire contentform, change l'état des botons
	 * @param form
	 * @param dirty
	 * @returns
	 */
	checkDirty:function(form, dirty){
				
		var rights = this.getContentform().data.rights;
		this.getRefreshBtn().setDisabled(!dirty||rights.write==0);
		this.getPublishBtn().setDisabled(!form.isValid()||rights.write==0);
		
		if(dirty&&form.isValid()&&rights.write==1){
			this.getPreviewBtn().setDisabled(false);
			
			
			return this.getSaveBtn().setDisabled(false);
		}
		
		console.log('disabled');
		this.getSaveBtn().setDisabled(true);
	},
	/**
	 * handler des boutons d'enregistrer, publier et dépublier - lance la requête ajax
	 * @param btn
	 */
	saveForm:function(btn){
		
		this.action=btn.action;
		
		var params=this.getForm().getValues();
    	params.API="Application_Model_ContentMapper";
    	params.APICall="addOrModify";
    	params.actionType=btn.action==4?1:btn.action;
    	params.id_element=this.getContentform().selectedRub.get('id_rubrique');
    	params.version_id=this.getContentform().data.result.version_id;
    	params.statut=0;
    	params.id_site=TextoCMS.siteId;
    	if(btn.action==4)params.statut=1;
    	this.ajax(DEFAULT_ADMIN_URL,params, Ext.bind(this.saveFormCB,this));
	},
	/**
	 * callback de la requête ajax de modification du formulaire, modification des données acrtives
	 * @see saveForm
	 * @param response
	 */
	saveFormCB:function(response){
		var data=Ext.JSON.decode(response.result.data);
		var selectedRub = this.getContentform().selectedRub;
		selectedRub.beginEdit();
		selectedRub.set('statut', response.result.inline_version>0?1:0);
		selectedRub.set('iconCls',data.type+(response.result.inline_version>0?'Offline':''));
		selectedRub.set('qtip',data.name+' - '+(response.result.inline_version>0?'Hors ligne':'En ligne'));
		selectedRub.endEdit();
		selectedRub.commit();
		
		this.reselectNode(selectedRub);
		
		
		//this.getUnpublishBtn().setDisabled(response.result.status!=1);
		if(this.getRemoveBtn())this.getRemoveBtn().setDisabled(Number(response.result.status)!=0);
		
		data.keywords=response.result.keywords;
		data.description=response.result.description;
		data.permalink=response.result.permalink;
		this.getContentform().getForm().setValues(data);
		this.getContentform().getForm().reset();
		
		//if(response.result.inline_version)
		
		var result = response.result;
  	   var data ={
        "Statut":Number(result.inline_version>0)?"En ligne":"Hors ligne",
        'Version':result.version_id,
        'Cr&eacute;&eacute; le':TextoCMS.Utils.formatDate(result.creation_date)
};
  	   
  	   if(result.inline_version!=result.version_id)data["Version en ligne"] = result.inline_version;
  	   if(result.update_date!==null)data['Modifi&eacute; le']=TextoCMS.Utils.formatDate(result.update_date);
  	   data['Par']=result.userName;
  	   if(result.status=="1")data['Publi&eacute; le']=TextoCMS.Utils.formatDate(result.publication_date);
  	   data['Template']= result.templateRef;
  	 
  	   
  	   this.getInfoPanel().setSource(data);
  	   this.getInfoPanel().getStore().sort();
  	   
  	   var folder=selectedRub.get('type')=="folder";
  	   
  	   var msg = folder?"Le r&eacute;pertoire":"La page";
  	   
  	   switch(Number(this.action)){
  	   case -1 :
  		   msg+=" a bien &eacute;t&eacute; d&eacute;publi&eacute;"+(folder ?"":"e");
  		   break;
  	   case 4 :
  		   msg+=" a bien &eacute;t&eacute; publi&eacute;"+(folder ?"":"e");
  		   break;
  	 case 1 :
		   msg+=" a bien &eacute;t&eacute; enregistr&eacute;"+(folder ?"":"e");
		   break;
  	   case 2:
  		   msg="Une nouvelle version a &eacute;t&eacute; cr&eacute;&eacute;e.";
  		   break;
  	   case 3:
  
		   msg="Une nouvelle version a &eacute;t&eacute; cr&eacute;&eacute;e et mise en ligne.";
		   
		   break;
  		   
  		break;
  		   
  	   }
  	   
  	   TextoCMS.Utils.displayNotification("Succ&egrave;s", msg, null, 'contentForm');
  	 },
  	 /**
  	  * handler du bouton de refresh
  	  * @see TextoCMS.controller.ContentController
  	  * @param btn
  	  */
  	refreshForm:function(btn){
  		
  		var contentController = this.getContentController();
  		contentController.checkCMSFormDirty(contentController.loadFormData.bind(contentController,contentController.selectedRub), contentController.selectedRub, null, contentController.selectedRub);
  		
  		
  		
  	},
  	/**
  	 * handler des boutons ajout ou modification de l'arbo 
  	 * @param btn
  	 */
  	addArboItems:function(btn){
    	
    	var view = new Ext.widget('arboedit',{isNew:btn.text!="Modifier"});
    	//view.isNew=
    	
    	var templateCombo=view.down('form').form.findField('id_template');
    	
    	if(btn.text=="Modifier"){
    		view.setTitle('Editer');
    			if(!this.getContentform().selectedRub.isRoot())view.down('form').loadRecord(this.getContentform().selectedRub.store.findRecord("id_rubrique",this.getContentform().selectedRub.data.id_rubrique));
    			view.down('form').remove(templateCombo);
    			
    			
    		
    	}else {
    		
    		templateCombo.store.proxy.extraParams.templateId=this.getContentform().selectedRub.data.id_template;
    		templateCombo.store.load();
    		view.setTitle('Ajouter');
    	}
  	},
  	/**
  	 * mise à jour de l'arborescence modifie le noeud courant ou ajoute le noeud nouvellement cr&eacute;e
  	 * @param button
  	 */
  	updateArbo:function(button){
		var win = button.up('window');
		var form = win.down('tabpanel')?win.down('tabpanel').getActiveTab().getForm():win.down('form');
		var fields= form.getValues();
 		var record=form.getRecord();
 		var contentController = this.getContentController();
 		var selectedRub = contentController.selectedRub;
 	
 		fields.API="Application_Model_ArboMapper";

 		fields.APICall="addOrModify";
 		fields.id_site = TextoCMS.siteId;
  		
 	
 		
 		
 		
 		if(Number(fields.id_rubrique)==0||!fields.id_rubrique)fields.ordre=selectedRub.childNodes.length;
		
		
 		

 		if(!record)fields.parentID=selectedRub.data.id_rubrique;
 			     	 		
 		this.ajax('/admin/getjsondata?format=json',fields,function(response){
 			

 	 		if(record){
 	 			
 	 			 record.beginEdit();
 	 			 record.set('title',fields.title);
 	 			 record.set('text',fields.title);
 	 			 record.endEdit();
 	 			 record.commit();
 	 			 var msg = (record.get('type')=="folder"?"Le r&eacute;pertoire":"La page")+" a &eacute;t&eacute; modifi&eacute;"+(record.get('type')=="folder"?"":"e"); 
 	 			 this.reselectNode(record);
 	 	 		}
 			
 	 		else if(fields.parentID){
 				
 				var obj = response.result;
     			obj.children=[];
     			obj.text=obj.title;
     			
     			obj.iconCls=obj.type+(obj.active==0)?'Offline':'';
     			
     			     			
     			var newNode=Ext.ModelManager.create(obj, 'TextoCMS.model.cms.ArboTreeModel');
     	 		newNode.children=[];		
     	 		selectedRub.appendChild(newNode);
     	 		if(!selectedRub.isExpanded()) selectedRub.expand();
     	 		
     	 		var msg = (newNode.get('type')=="folder"?"Le r&eacute;pertoire":"La page")+" '"+newNode.get('text')+"\' a &eacute;t&eacute; ajout&eacute;"+(selectedRub.get('type')=="folder"?"":"e")+" au r&eacute;pertoire "+selectedRub.get('text');
     	 		
 			}
 			win.close();
 			TextoCMS.Utils.displayNotification("Succ&egrave;s", msg, null, 'contentForm');
 			
 		}.bind(this));

	},
	/**
	 * handler du bouton de suppression d'un folder
	 * @param btn
	 */
	deleteFolder:function(btn){
		
		var contentController = this.getContentController();
 		var selectedRub = contentController.selectedRub;
 	
		
		var intitule=selectedRub.data.type=="folder"?"un r&eacute;pertoire":"une page";
		
		Ext.Msg.show({
		     title:'Suppression d\''+intitule,
		     msg: 'Attention, la suppression d\''+intitule+' est d&eacute;finitive !<br />Voulez-vous continuer ?',
		     buttons: Ext.Msg.YESNO,
		     icon: Ext.Msg.WARNING,
		     fn:function(btn){
		    	 if(btn=='no') return;
		    	 this.ajax('/admin/getjsondata?format=json',{API:'Application_Model_ArboMapper',APICall:'delete', id_rubrique:selectedRub.data.id_rubrique}, this.deleteRub.bind(this));
		    	  
		     },
		     scope:this
		     
		});
		
		
	},
	/**Callback de suppression d'un folder
	 * @see deleteFolder
	 * 
	 */
	deleteRub:function(){
		
		var contentController = this.getContentController();
 		var selectedRub = contentController.selectedRub;
 		
 		var newNode=selectedRub.parentNode;
		newNode.removeChild(selectedRub);
		var tree=contentController.selectedTree;
		contentController.selectedRub = newNode;
    	tree.getSelectionModel().select(newNode);
    	contentController.loadFormData(newNode);
		
		
	},
	/**
	 * fix le bug sencha de déselction d'un noeud après mise à jour
	 * @see http://www.sencha.com/forum/showthread.php?239674-BUG-selected-node-lose-CSS-selection-class-after-editing
	 * @param selectedRub
	 */
	reselectNode:function(selectedRub){
		return;
		var contentController = this.getContentController();
		contentController.selectedTree.getView().getNode(selectedRub).addClassName('x-grid-row-selected x-grid-row-focused');
		
		
	},
	previewPage:function(btn){
		
		this.getContentform().getForm().standardSubmit=true;
		this.getContentform().getForm().target="previewPage";
		//this.getContentform().url="admin/preview";

		this.getContentform()
		.getForm()
		.submit({url:'/admin/preview?id_rubrique='+this.getContentform().selectedRub.get('id_rubrique')+'&id_site='+TextoCMS.siteId, target:'previewPage'});
		
		
	//	this.getContentform().submit();
		
		
		
	}


	}// eo controller

);