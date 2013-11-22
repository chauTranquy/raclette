/**
 * IconBrowser V1.0
 * CTR Mai 2011
 */

Ext.define('CMS.components.cms.fields.File', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.file',
    rights:{
    	write:1
    },
    layout:'column',
    selectedRecord:null,
    border:false,
	margin:'0 0 5 0',
	value:null,
	cb:Ext.emptyFn,
	filter:null,
	defaults:{
		border:false,
		bodyStyle:'background-color:transparent',
		defaults:{
			bodyStyle:'background-color:transparent',
			border:false
			
		}
	},
	tpl:new Ext.XTemplate(
		    
			'<tpl for=".">',
            '<div data-qtip="{[this.qtip(values.name,values.size)]} <br />cliquez pour visualiser le fichier">',
           '<tpl if="this.isImage(ext)"><a href="/medias/{path}" class="file lightbox" title="{[this.qtip(values.name,values.size)]}">',
                (!Ext.isIE6? '<img src="{[this.makeThumbUrl(values.path, values.ext)]}" border="0" />' : 
                '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{[this.makeThumbUrl(values.path, values.ext)]}\')"></div>'),
                '</a></tpl>',
                '<tpl if="this.isImage(ext)==false"><a href="/medias/{path}" target="_blank">',
                (!Ext.isIE6? '<img src="img/{ext}Big.gif" border="0" />' : 
                '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.gif\')"></div>'),
                '</a></tpl>',                    
           '</div>',
        '</tpl>',
			{compiled: true,
				makeThumbUrl:function(path,ext){
					
					return '/image/thumb/150/'+ext.toLowerCase()+'/'+path.replace('.'+ext,'');
					
				},
		        isImage:function(ext){
            		 arrayImageExt=['jpg','jpeg','png','gif'];           		
            		return(arrayImageExt.indexOf(ext.toLowerCase())>-1);
            		
            	}.bind(this),
            	qtip:function(name,size){
            		return name;
            }
            }

		),
	
		
//		{fields:[{"type":"Text""compulsary":"1", "label":"Titre"},{"type":"File","filter":"pdf","compulsary":"1", "label":"fichier PDF"}]}
		
	initComponent:function(){
		this.classInstance = new CmsClass.BaseClass();
		
		var me=this;
		if(this.extraParams&&this.extraParams.filter){
			this.filter=this.extraParams.filter;
			this.fieldLabel+="("+this.filter+")";
		}
		
		
		
		this.addButton=Ext.create('Ext.button.Button',{
			iconCls:'addBtn',
			tooltip:'Ajouter un fichier',
			scope:this,
			hidden:this.rights.write==0,
			handler:this.openBrowser
			
		});
		
		this.removeButton=Ext.create('Ext.button.Button',{
			iconCls:'removeBtn',
			tooltip:'Supprimer le fichier',
			hidden:this.value==null,
			scope:this,
			hidden:this.rights.write==0,
			handler:this.resetValue
				
			
		});
		
		this.textField=Ext.create('Ext.form.field.Text',{
			name:this.name,
			hidden:true,
			allowBlank:this.allowBlank,
			value:this.value,
			listeners:{
				scope:this,
				change:this.displayMini
			}
			
		});
	
		html=this.tpl.apply(null);
		if(this.value){
			
						
			var regExp=new RegExp('([a-zA-Z0-9_-]+)(\.([a-zA-Z]+))$','i')
			
			var fileNameArray=this.value.split('/');
			
			
			
			var ext=regExp.exec(this.value)[3];
			this.selectedRecord={data:{
				path:this.value,
				ext:ext,
				name:fileNameArray[fileNameArray.length-1]
				
			}};
			
			
			html=this.tpl.apply(this.selectedRecord.data);
			
			

		}

		
		this.contentPanel=Ext.create('Ext.panel.Panel',{xtype:'panel',bodyPadding:5,border:false,html:html, width:160, height:100,  margin:'0 5'});
		this.width=750;
		this.items=[{width:150,items:[{xtype:'panel', html:this.fieldLabel+(this.allowBlank?'':'*')+' :', width:150, style:'text-align:right'}]},
		            {width:170,items:[this.textField, this.contentPanel]},
		            {width:100, height:50,layout: {                        
		                type: 'vbox',
		                align: 'center'
		            },defaults:{
		            	border:false
		            },
		            items:[{items:[this.addButton]}, {items:[this.removeButton]}]}
		            ];
		
		this.listeners={scope:this,
				afterrender:function(panel){
					$$('.file.lightbox').invoke('observe','click', this.openLightBox.bindAsEventListener(this));
					
				}}
		
		this.callParent(arguments);
	
		
		
	},
	
	
	openBrowser:function(){
		if(this.rights.write==0) return;
		
		this.createFolderBtn=Ext.create('Ext.button.Button',{tooltip:'cr&eacute;er un r&eacute;pertoire', iconCls:'addFolder',scope:this, handler:this.makeDir, disabled:true});
		var items=[this.createFolderBtn];
		

    	
		this.deleteFolderBtn=Ext.create('Ext.button.Button',{xtype:'button',tooltip:'Supprimer le r&eacute;pertoire',iconCls:'deleteFolder', scope:this, tooltip:'Supprimer',scope:this, handler:this.deleteFolder, disabled:true});
		
	   	
	

	
	this.deleteFileBtn=Ext.create('Ext.button.Button',{tooltip:'Supprimer le fichier',disabled:true,iconCls:'deleteFile', scope:this, handler:this.deleteFile});
	
	this.uploadFileBtn=Ext.create('Ext.button.Button',{tooltip:'Nouveau fichier', scope:this, handler:this.displayUploadForm,disabled:true, iconCls:'addFile'});
		
	items.push(this.deleteFolderBtn) 
	var items2=[this.uploadFileBtn,this.deleteFileBtn];
		
	this.panel=Ext.create('CMS.components.cms.BrowserTree',{
			xtype:'browsertree',
			region:'west',
			width:150,
			layout:'fit',
			tbar:items,
			autoWidth:true,
			loadMask:true,
			root:{expanded:true, text:'Gestionnaire de m&eacute;dia', selected:true},
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
	
		this.win = Ext.create('Ext.window.Window', {
			modal:true,
			layout:'border',
			width:500,
			height:400,
			title:'Choisissez un fichier ' + (this.filter!=null?this.filter:''),
			items:[this.panel,{xtype:'panel', region:'center', width:350, autoScroll:true, tbar:items2}],
			buttons:[
			         {text:'Choisir',action:'save',handler:this.selectFile,disabled:true, scope:this}, {text:'Fermer',scope:this, handler:function(){this.win.close();}}
			         ]
			
		});
		
		this.win.show();
		
		
	},
	getFolderDetail:function(view,record){
		
		
		
		
		
			
			 var panel=this.win.query('browsertree')[0];
				var store = panel.store;
				var node = store.getRootNode().findChild("path", record.get("path"), true);
				this.selectedRub=node; 
				
				this.createFolderBtn.setDisabled(false);
				this.win.query('button[action=save]')[0].setDisabled(true);
				this.deleteFolderBtn.setDisabled(node.parentNode.isRoot());
				this.uploadFileBtn.setDisabled(false);
		
		var panel=this.win.query('panel[region=center]')[0];
	
		panel.removeAll()
		
		panel.add({
        	url:'/admin/getjsondata?format=json',root:record.get('path'),
             xtype: 'iconbrowser',
            layout:'fit',
            filter:this.filter,
             bodyStyle:'background-color:transparent',
             id: 'img-chooser-view2',
             listeners:{scope:this, 
            	 itemclick:function(view,record){
            		 if(record.get('type')=='file'){
            			 this.selectedRecord=record;
            			 }else if(record.get('type')=='folder'){
            				
            			 }
            		 
            		 this.deleteFileBtn.setDisabled(record.get('type')=='folder');
            		            		 
            		 this.win.query('button[action=save]')[0].setDisabled(record.get('type')=='folder');
            		 },
            	 itemdblclick:this.navigateBrowser
             }});
		
	},
	navigateBrowser:function(view,record){
		if(!record.get('type')=="folder") return;
		var panel=this.win.query('browsertree')[0];
		var store = panel.store;
		var node = store.getRootNode().findChild("path", record.get("path"), true);
		node.parentNode.expand();
		
		this.selectedRub=node;
		
		this.deleteFolderBtn.setDisabled(node.isRoot());
		this.deleteFileBtn.setDisabled(true);
		this.uploadFileBtn.setDisabled();
		
		panel.selModel.select(node);
		this.getFolderDetail(view,node);
		},
	selectFile:function(){
			this.textField.setValue(this.selectedRecord.get('path'));
			this.textField.validate();
			this.win.close();
			this.removeButton.show();
			this.cb(this.selectedRecord);
		},
		resetValue:function(){
			
			this.selectedRecord=null;
			this.textField.setValue(null);
			this.textField.validate();
			this.removeButton.hide();
		},
		displayMini:function(){
			this.contentPanel.update();
			if(!this.selectedRecord) return;
				this.tpl.overwrite(this.contentPanel.body, this.selectedRecord.data);
				$$('.file.lightbox').invoke('observe','click', this.openLightBox.bindAsEventListener(this));
		},
		openLightBox:function(e){
			Event.stop(e);
			
			var elt = Event.findElement(e,'a');
			
			Shadowbox.open({player:'img', title:elt.title, content:elt.href});
			
			
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
						
						var panel=this.win.query('browsertree')[0];
						var store = panel.store;
						store.sort();
						
						//if(this.panel&&this.panel.body&&$$('#'+this.panel.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+this.panel.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
						this.getFolderDetail(null,this.selectedRub);
						this.selectedRub.expand();
												
						win.close();
						
					}.bind(this), failure:function(form, action){

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
			    	 
			    	 if(btn=='ok')this.classInstance.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_FileManager', APICall:'deleteFolder',folderPath:this.selectedRub.get('path')},function(response){
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
			            iconCls: 'upload-icon',
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
			            	 
			            	if(Ext.getCmp('img-chooser-view2').store.findExact('name',val)>-1){
			            		
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
			
			switch(this.selectedRecord.get('type')){
			case "folder":
				title='Suppression du r&eacute;pertoire "'+this.selectedRecord.get('name')+'"';
				params.APICall="deleteFolder";
				params.folderPath=this.selectedRecord.get('path');
				
				cb=function(response){
					var node = this.panel.store.getRootNode().findChild("path", this.selectedRecord.get("path"), true);
					this.selectedRub.removeChild(node,true, false, false);
	    			this.getFolderDetail(null,this.selectedRub);
				}.bind(this)
				
			break;

			default:
				
			title='Suppression du fichier "'+this.selectedRecord.get('name')+'"';
			params.APICall="deleteFile";
			params.path=this.selectedRecord.get('path');
			
			
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
					
					  if(btn=='ok')this.classInstance.ajaxRequest('/admin/getjsondata?format=json',params,cb);
					  
					  
				  }});
			
			
		}
	
});