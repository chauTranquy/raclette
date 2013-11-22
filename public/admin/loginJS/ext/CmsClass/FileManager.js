/**
 * 
 */

Ext.define('CmsClass.FileManager', {
	extend:'CmsClass.BaseClass',
//	require:['CMS.components.cms.IconBrowser'],
	 uses: ['CMS.components.cms.IconBrowser',
	        'CMS.components.cms.InfoPanel','CMS.components.cms.BrowserTree'],
	arrayExt:{"image":["jpg","jpeg","gif","png"],"pdf":["pdf"],"flash":["flv","swf"]},
	isTree:true,
	panelTitle:'Gestionnaire de m&eacute;dia',
	subMenus:null,
	constructor:function(isModal){
		
		this.isModal=isModal==undefined?false:true;
			this.initFileManagerPanel();
			this.breadCrumbCallBack=this.getFolderDetail.bind(this);
	},
	
	initFileManagerPanel:function(){
				
		this.panel=Ext.create('CMS.components.cms.BrowserTree',{
			title:this.panelTitle,
			modelName:'model_fileManager',
			id:'treeFileManager',
			iconCls:'fileManagerIcon',
			autoWidth:true,
			tools:[{type:'refresh', scope:this, handler:this.refreshTree}],
		    loadMask:true,
    		//root:{expanded:true, text:'Gestionnaire de m&eacute;dia', selected:true},
    		rootVisible: false,
    		listeners:{
    		scope:this,
    		
    		afterlayout:function(tree){

    			if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
    			
    		},

    		itemclick:this.getFolderDetail,
    		remove:function(){
    			
    			return false;
    			
    			
    		}
    		
    	}
});
		
		this.panel.store.addListener('load',function(store){
					if(this.panel&&this.panel.body&&$$('#'+this.panel.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+this.panel.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
					
				}, this);
		
	},
	
	getFolderDetail:function(view,record,htmlElement,index,e){
		
		if(record==undefined)record=this.selectedRub;
		
		
		if(this.cmsClass.selectedRub!=null&&!this.checkCMSFormDirty(this.loadFolderDetail.bind(this,record), record, view, this.cmsClass.selectedRub)) return;
		this.loadFolderDetail(record);
		this.panel.expand();
		
	},
	loadFolderDetail:function(record){
		
		this.cleanPanels();
		this.unselectTreeNode(record, this.selectedRub);
		this.cmsClass.selectedRub=null;
		
		this.displayBreadCrumb(record);
		
		this.selectedRub=record;
		
		var items=[{text:'Nouveau', iconCls:'addFolder',scope:this, handler:this.makeDir}];
		

    	
    	   	if(!this.selectedRub.isRoot()&&!this.selectedRub.parentNode.isRoot())items.push({xtype:'button',text:'Supprimer',iconCls:'deleteFolder', scope:this, tooltip:'Supprimer',scope:this, handler:this.deleteFolder, disabled:this.selectedRub.childNodes.length>0});
		
		var menuItem={
    			title:'R&eacute;pertoire',
                xtype: 'buttongroup',
                columns: 3,
                defaults: {
                    scale: 'small'
                }, items:items};
		this.centerRegion.getDockedItems()[0].add(menuItem);
		
		
		this.deleteFileBtn=Ext.create('Ext.button.Button',{text:'Supprimer',disabled:true,iconCls:'deleteFile', scope:this, handler:this.deleteFile});
		
		var menuItem={
    			title:'Fichier',
                xtype: 'buttongroup',
                columns: 3,
                defaults: {
                    scale: 'small'
                }, items:[{text:'Nouveau', scope:this, handler:this.displayUploadForm, iconCls:'addFile'}, this.deleteFileBtn]};
		
		this.centerRegion.getDockedItems()[0].add(menuItem);
		
		this.centerRegion.add(
				{xtype:'panel',autoScroll:false,height:this.centerRegion.getHeight()-100,border:false, width:this.centerRegion.getWidth()-50,bodyStyle:'background-color:transparent',layout:'border',items:[
				                                       
	{region:'center',height:this.centerRegion.getHeight()-100, width:this.centerRegion.getWidth()-300,bodyStyle:'background-color:transparent', autoScroll:true, 
		autoScroll: true,
        items: [{
        	url:'/admin/getjsondata?format=json',root:record.get('path'),
             xtype: 'iconbrowser',
            layout:'fit',
             bodyStyle:'background-color:transparent',
             id: 'img-chooser-view',
             listeners:{scope:this, 
            	 itemclick:this.displayFileInfo,
            	 itemdblclick:this.navigateBrowser
             }}]},
             {
                 xtype: 'infopanel',
                 region: 'east',
                
                 bodyStyle:'padding:5px',
                 margin:'0 5',
                 width:300
             }]});
		
		
	},
	displayFileInfo:function(view, record){
		
		this.deleteFileBtn.enable();
		this.selectedFile=record;
		
		this.centerRegion.down('infopanel').loadRecord(record);
	},
	navigateBrowser:function(view,record){
		if(!record.get('type')=="folder") return;
		var node = this.panel.store.getRootNode().findChild("path", record.get("path"), true);
		node.parentNode.expand();
		this.panel.selModel.select(node);
		this.getFolderDetail(view,node);
		},
		makeDir:function(){
			
			var win = Ext.create("Ext.window.Window",{
				modal:true,
				
				autoHeight:true,
				layout:'fit',
				title:"Nouveau r&eacute;pertoire",
				items:[{
					xtype:'form',
					bodyStyle:'background-color:transparent',
					border:false,
					
					listeners:{
						scope:this,
						validitychange:function(form,isValid){
							
							var btn = win.query('button[action=save]')[0];
							btn.setDisabled(!isValid);
							
							
							
							
						}
						
					},
					autoHeight:true,
					padding:'5',
					//height:250,
					items:[{xtype:'textfield',name:'folderName', labelWidth:120, labelStyle:'text-align:right', width:300, allowBlank:false, fieldLabel:'Nom du r&eacute;pertoire', minLengh:3,regex:/^([a-zA-Z]{1}[a-zA-Z0-9_-]+)$/, regexText:'Le nom du r&eacute;pertoire doit uniquement comporter des caract&egrave;res alphanum&eacute;riques,<br />des \'-\' ou des \'_\' et aucun espace'}]	
				}],
				buttons:[{text:'Cr&eacute;er', disabled:true, scope:this,handler:function(){
					var form = win.down('form');
					
					var params=form.getForm().getValues();
					params.API='Application_Model_FileManager';
					params.APICall='makeFolder';
					params.parentFolder=this.selectedRub.get('path');
					
					form.getForm().submit({scope:this,url:'/admin/getjsondata?format=json', params:params, waitMsg:'Cr&eacute;ation en cours', success:function(form, action){
						var result=action.result.result[0];
						result.qtip=result.name;
						result.text=result.name;
						result.isLeaf=true;
						result.treeRef="treeFileManager";

						
						var newNode=Ext.ModelManager.create(result, 'model_fileManager');
						this.selectedRub.appendChild(newNode);
						this.panel.store.sort();
						
						if(this.panel&&this.panel.body&&$$('#'+this.panel.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+this.panel.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
						
						this.getFolderDetail(null,this.selectedRub);
						this.selectedRub.expand();
						win.close();
						
					}, failure:function(form, action){

						Ext.Msg.show({
						     title:'Erreur lors de la cr&eacute;tion du r&eacute;pertoire',
						     msg: action.result.error,
						     buttons: Ext.Msg.OK,
						     icon: Ext.Msg.ERROR
						     
						});
						
					}
					})
					
				}, action:'save'},{text:"Fermer", handler:function(){win.close();}}]
				
			});
			
			win.show();
			
			
		},
		deleteFolder:function(){
			
			if(this.selectedRub.childNodes.length>0)return Ext.Msg.show({
			     title:'Suppression du r&eacute;pertoire "'+this.selectedRub.get('name')+'"',
			     msg: 'le r&eacute;pertoire n\'est pas vide !',
			     buttons: Ext.Msg.OK,
			     icon: Ext.Msg.ERROR
			     
			});
			
			Ext.Msg.show({
			     title:'Suppression du r&eacute;pertoire "'+this.selectedRub.get('name')+'"',
			     msg: 'Attention, la suppression est irr&eacute;versible.<br />Souhaitez-vous continuer ?',
			     buttons: Ext.Msg.OKCANCEL,
			     icon: Ext.Msg.WARNING,
			     scope:this,
			     fn:function(btn){
			    	 
			    	 if(btn=='ok')this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_FileManager', APICall:'deleteFolder',folderPath:this.selectedRub.get('path')},function(response){
			    		 var parentNode=this.selectedRub.parentNode;
			    		 
			    		 
			    		 	parentNode.removeChild(this.selectedRub,true, false, false);
			    			this.panel.selModel.select(parentNode);
			    			this.getFolderDetail(null,parentNode);
			    		 
			    		 
			    	 }.bind(this))
			    	 
			     }
			     
			});
			
			
		},
		displayUploadForm:function(){
			
			
			this.uploadForm= Ext.create('Ext.form.Panel', {
			      baseParams:{
			    	  API:'Application_Model_FileManager',
           		   APICall:'uploadFile',
           		   parentRoot:this.selectedRub.get('path'),
           		   overwrite:0
			    	  
			      },
			     
			      method:'post',
			      url:'/admin/doupload',
			        
			        bodyPadding: '10 10 0',
			        defaults: {
			            allowBlank: false,
			            //msgTarget: 'side',
			            labelWidth: 120,
			            labelStyle:'text-align:right'
			        },

			        items: [{
			            xtype: 'filefield',
			            id: 'form-file',
			            scope:this,
			            fieldLabel: 'Choisissez un fichier',
			            validator:function(value){
			            	
			            	var regExtension="";
			            	
			            	var extArray=[];
			            	for(key in this.arrayExt){
			            		
			            		extArray.push(this.arrayExt[key].join('|'));
			            		
			            	}
			            	
			            	regExtension=extArray.join('|');
			            				            	
			            	var regExp=new RegExp('([a-zA-Z0-9_-]+)(\.('+regExtension+'))$','i')
			            	

			            	if(!regExp.test(value))return "format de fichier incorrect";
			            	
			            	
			            	
			            	
			            	return true;
			            	
			            	
			            	
			            	
			            	
			            }.bind(this),
			            name: 'fichier',
			            buttonText: '',
			            buttonConfig: {
			            	tooltip:'Choisir',
			                iconCls: 'upload-icon'
			            }
			        }],
			        listeners:{
			        	scope:this,
			        	validitychange:function(form, isValid){
			        		var btn = win.query('button[action=save]')[0];
							btn.setDisabled(!isValid);
			        		
			        		
			        	}
			        	
			        }

			        			    });
			
			 var win=Ext.create('Ext.window.Window',{
				 title: 'Nouveau fichier',
				 modal:true,
				 layout:'fit',
				 bodyStyle:'background:transparent',
				 defaults:{
					 bodyStyle:'background:transparent',
				 },
				 items:[this.uploadForm],
				 buttons: [{
			            text: 'Charger',
			            disabled:true,
			            scope:this,
			            action:'save',
			            handler: function(){
			            	
			            	var val=Ext.getCmp('form-file').getValue();
			            
			            	 var form = win.down('form').getForm();
			            	
			            	 var cb=function(){form.doAction('submit',{
				            	 scope:this,
				            	 reset:false,
				            	 waitMsg:'T&eacute;l&eacute;chargement en cours',
				            	   success:function(form1, action){
			            		   var result=action.result;

			            		   
			            		   if(result.success=="true"){
			            			   win.close();
			            			   return this.getFolderDetail(null,this.selectedRub);
			            		   }
			            		   
			            		   win.close();	            		   
			            		   Ext.Msg.show({
			            				  title:'Nouveau fichier',
			            				  msg: result.error,
			            				  buttons: Ext.Msg.OK,
			            				  icon: Ext.Msg.ERROR,
			            				  scope:this});
				            	   },
				            	   failure:function(form,action){}
				               })}.bind(this)
			            	 
			            	if(Ext.getCmp('img-chooser-view').store.findExact('name',val)>-1){
			            		
			            		 Ext.Msg.show({
		            				  title:'Nouveau fichier',
		            				  msg: 'le fichier existe d&eacute;j&agrave;<br />Voulez-vous &eacute;craser la version actuelle ?',
		            				  buttons: Ext.Msg.OKCANCEL,
		            				  icon: Ext.Msg.WARNING,
		            				  scope:this,
		            				  fn:function(btn){
		            					  form.baseParams.overwrite=1;
		            					  if(btn=='ok')cb();
		            					  
		            					  
		            				  }});
			            		 
			            		 return;
			            		
			            		
			            	};
			            	cb();
			            }
			        },{
			            text: 'Annuler',
			            scope:this,
			            handler: function() {
			                win.close();
			            }
			        }]

				 
				 
			 }).show();
			
		},
		deleteFile:function(btn){
	
			msg='Attention, la suppression est irr&eacute;versible.<br />Souhaitez-vous continuer ?';
			
			params={API:'Application_Model_FileManager'};
			
			switch(this.selectedFile.get('type')){
			case "folder":
				title='Suppression du r&eacute;pertoire "'+this.selectedFile.get('name')+'"';
				params.APICall="deleteFolder";
				params.folderPath=this.selectedFile.get('path');
				
				cb=function(response){
					var node = this.panel.store.getRootNode().findChild("path", this.selectedFile.get("path"), true);
					this.selectedRub.removeChild(node,true, false, false);
	    			this.getFolderDetail(null,this.selectedRub);
				}.bind(this)
				
			break;

			default:
				
			title='Suppression du fichier "'+this.selectedFile.get('name')+'"';
			params.APICall="deleteFile";
			params.path=this.selectedFile.get('path');
			
			
			cb=function(){
				this.getFolderDetail(null,this.selectedRub);
			}.bind(this);
				
			break;
			}
		
			
			Ext.Msg.show({
				  title:title,
				  msg: msg,
				  buttons: Ext.Msg.OKCANCEL,
				  icon: Ext.Msg.WARNING,
				  scope:this,
				  fn:function(btn){
					
					  if(btn=='ok')this.ajaxRequest('/admin/getjsondata?format=json',params,cb);
					  
					  
				  }});
			
			
		}
	
	
});