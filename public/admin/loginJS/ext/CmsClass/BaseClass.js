/**
 * 
 */
Ext.define('CmsClass.BaseClass', {
	
	fieldsArray:[{name:'RichText',title:'Texte enrichi', hasExtraParams:true,extraParamsConfig:[{fieldLabel:'Autoriser les images', xtype:'checkbox', inputValue:1}, {fieldLabel:'Autoriser les liens', xtype:'checkbox', inputValue:1}]},
	             {name:'Text',title:'Champ texte', hasExtraParams:false},
	             {name:'File',title:'Champ fichier', hasExtraParams:true,extraParamsConfig:[{label:'Type de fichier', xtype:'textfield'}]},
	             {name:'ItemsMenu',title:'Eléments multiples', hasExtraParams:true,extraParamsConfig:[{label:'&Eacute;l&eacute;ments', xtype:'ItemsMenu'}]},
	             {name:'ContentBrowser',title:'Navigateur de contenu',hasExtraParams:true,extraParamsConfig:[{label:'R&acute;pertoires autoris&eacute;s', xtype:'textfield'}]},
	             {name:'datefield',title:'Champ de date'},
	             {name:'textareafield',title:'Zone de texte'},
	             {name:'numberfield',title:'Champ nombre'},
	             {name:'combo',title:'Liste de sélection', hasExtraParams:true,extraParamsConfig:[{label:'Valeurs', xtype:'textfield'}]},
	             {name:'checkbox',title:'Case a cocher'}
	             ],
	             
	
	constructor:function(){
		
				
		
	},
ajaxRequest:function(url,params, callBack, showMask){
		
	if(showMask==undefined) showMask=true;
	
	
		var cb=callBack!=undefined&&typeof callBack=="function"?callBack:null;
	
		var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Veuillez patienter...", title:"Envoi des don&eacute;es"});
		if(showMask) myMask.show();

		Ext.Ajax.request({
		url:url,
			params:params,
			method:'post',
			success:function(response){
				
				var JSON=Ext.JSON.decode(response.responseText);
				myMask.hide();
				if(!this.evalError(JSON)) return;
				if(cb)cb(JSON);
				
			}.bind(this)
			
			
		});
		
		
	},
	evalError:function(JSON){
		
		if(JSON.success==false){
			
			
			if(JSON.error)var msg=JSON.error;
			else if(JSON.msg)var msg=JSON.msg;
			else var msg="Une erreur inconnue est intervenue."
		
				var handler=Ext.emptyFn;
				
			if(JSON.errorCode<0)Ext.TaskManager.stopAll();
			
				if(JSON.errorCode==-1)handler=function(){document.location.href='/admin/';}
				if(JSON.errorCode==-2)handler=function(btn){
					
					if(btn=="yes")return this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_AdminUsersMapper', APICall:'connectNewSession'}, function(){
						document.location.reload();
						
					}.bind(this));
				
					return this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_AdminUsersMapper', APICall:'killIdentity'}, function(){
						document.location.reload();
						
					}.bind(this));
					
					
				}.bind(this);
				Ext.Msg.show({
				     title:'Erreur',
				     msg: msg,
				     buttons: JSON.errorCode==-2?Ext.Msg.YESNO:Ext.Msg.OK,
				     icon: Ext.Msg.ERROR,
				     scope:this, fn:handler
				});

			return false;
			
		}
		
		return JSON.success;
		
		
	},	/**
	 * refreshTree
	 */
	refreshTree:function(e,elt,panel, tool){
		
	panel.up("treepanel").store.load();//.store.reload();
	},
	
	unselectTreeNode:function(record, selectedRub){
		
		if(record!=selectedRub){
		
			this.arboRegion.selectedRub=selectedRub;
			this.arboRegion.trees.each(function(elt, index){
				
			if(elt.id!=record.get('treeRef'))elt.getSelectionModel().deselectAll();
			},this);
			
		}
		
	},
	checkCMSFormDirty:function(callBack, currRub, view, selectedRub){
		
		var cb=(callBack!=undefined&& typeof callBack=="function"?callBack:Ext.emptyFn)
				
		if(this.cmsFormPanel&&!this.cmsFormPanel.form.isDirty()) return true
		
		
		Ext.Msg.show({
		     title:'Attention !',
		     msg: 'Vous n\'avez pas sauvegard&eacute; vos modifications !<br />Souhaitez-vous continuer ?',
		     buttons: Ext.Msg.YESNO,
		     icon: Ext.Msg.WARNING,
		     fn:function(btn,text){if(btn!='yes') {
		    	 
		    	if(currRub&&view) view.deselect(currRub);
		    	 var tree=Ext.getCmp(selectedRub.data.treeRef);
		    		tree.getSelectionModel().select(selectedRub);
		    		tree.expand();
		    	 return;
		     }
		     cb();},
		     scope:this
		});
		
		
		return false;
	},
	cleanPanels:function(){
		
		this.centerRegion.getDockedItems()[0].removeAll();
		this.centerRegion.items.each(function(elt, index){
			if(index>0) this.centerRegion.remove(elt);
			
			
		}, this)
		
		Ext.getCmp("breadCrumb").update();
		
	}
	,displayBreadCrumb:function(node, level){
    	if(level==undefined) level=0;

    	
    	
    	
    	var array=[];//node.data.text];
    	
    	if(node.parentNode){
    		
    		var currNode=node.parentNode;
    		
    		
    		
    		if(!currNode.isRoot()){
    		var elt=new Element("a",{className:'linkBreadcrumb'});
    		elt.update(currNode.data.text)
    		
    		Event.observe($(elt),'click', this.navigateBreadCrumb.bindAsEventListener(this,level));
    		}
    		else if(currNode.data.text!="Root"){
    			var elt=new Element('div',{className:'breadcrumbSpacer'});
        		elt.update(currNode.data.text);
    			
    		}
    		if(elt)array.push(elt);
    		
    		if(currNode.parentNode)array.push(this.displayBreadCrumb(currNode, level+1));
    	}
    	
    	
		
    	array.reverse();
    	array=array.flatten();
    	if(level>0)return array;
    	
    	Ext.getCmp("breadCrumb").update();
    	
    	var elt=new Element('div',{className:'breadcrumbSpacer'});
		elt.update("<strong>"+this.panelTitle+"</strong>");
		
		Ext.getCmp("breadCrumb").body.appendChild(elt);
    
		var spacer=new Element('div',{className:'breadcrumbSpacer'});
		spacer.update("&raquo;");
		Ext.getCmp("breadCrumb").body.appendChild(spacer);
    	
    	array.each(function(elt){
    		

    		Ext.getCmp("breadCrumb").body.appendChild(elt);
    		
    		var spacer=new Element('div',{className:'breadcrumbSpacer'});
    		spacer.update("&raquo;");
    		Ext.getCmp("breadCrumb").body.appendChild(spacer);
    		
    		
    	},this);
    	
    	var spacer=new Element('div',{className:'breadcrumbSpacer'});
		spacer.update(node.data.text);
		Ext.getCmp("breadCrumb").body.appendChild(spacer);
		
    	return ;//Ext.getCmp("breadCrumb").update(array);
    	
    },navigateBreadCrumb:function(e,lvl){
    	Event.stop(e);
    	
    	var node=this.selectedRub;
    	
    	$R(0,lvl).each(function(index){
    		    		
    		node=node.parentNode;
    		
    	},this);
    	
    	var tree=Ext.getCmp(this.selectedRub.data.treeRef);
    	tree.getSelectionModel().select(node);
    	
    	if(this.breadCrumbCallBack) this.breadCrumbCallBack(tree.getView(), node);
    	//
    }

	
});

// override proxy server processResponse pour traitement des erreurs

Ext.override(Ext.data.proxy.Server, 
		{
	processResponse: function (success, operation, request, response, callback, scope) 
		    {
		
		var JSON=Ext.JSON.decode(response.responseText);
		
		var base = new CmsClass.BaseClass();
		
		
		if(base.evalError(JSON)==false) return;
		
		this.callOverridden([success, operation, request, response, callback, scope]);

		    }

		});
