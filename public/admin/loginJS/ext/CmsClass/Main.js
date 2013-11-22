/**
 * 
 */

Ext.define('CmsClass.Main', {
	extend:'CmsClass.BaseClass',
	centerRegion:null,
	arboRegion:null,
	plugins:{},
	panelTitle:'Gestion de contenu',
	constructor:function(plugins){
		
		if(typeof plugins=='object'){
		
		
		plugins.each(function(plugin){
			
					
			var pluginClass=Ext.ClassManager.get(plugin.name);

			
			if(pluginClass==null)return;
				
				this.plugins[plugin.name]={instance:Ext.ClassManager.instantiate(plugin.name),pos:plugin.pos, rights:plugin.rights, name:plugin.name};
			
			
		},this);
		
		}
		
		Ext.tip.QuickTipManager.init();		
		this.arboRegion=Ext.create('Ext.panel.Panel',{region:'west',
	            layout:'accordion',
	            split:true,
	            trees:[],
	            width:300,
	            minWidth:150,
	            maxWidth:450,
	            id:'arboregion'
	            });
				

		
		this.centerRegion=Ext.create('Ext.panel.Panel',{region:'west',
            //layout:'fit',
            region:'center',
            id:'centerregion',
            tbar:[{xtype:'label', html:'&nbsp;'}],
            items:[{xtype:'panel', id:'breadCrumb',height:30}],
            defaults:{
            	border:false
            	
            }
            });
		
		Event.observe('logoutLink','click', function(e){
			Event.stop(e);
			
			var cb=function(){
				document.location.href='/admin/logout';
				
			}
			
			if(this.selectedRub&&!this.checkCMSFormDirty(cb, null, Ext.getCmp(this.selectedRub.data.treeRef).getView(), this.selectedRub)) return;
			cb();

			
			
		}.bind(this));
		
		Event.observe('myAccountBtn','click', this.openUserWindow.bindAsEventListener(this));
		
		
		this.viewPort=Ext.create('Ext.container.Viewport', {
		    layout: 'border',
		    renderTo: Ext.getBody(),
		    items: [
		            this.centerRegion,
		            this.arboRegion,
		            {region:'south', border:false, id:'footerAdmin', html:'&copy; agence texto 2011'},
		            {region:'north', height:50, border:false, contentEl:'headerAdmin'}
		            
		            ]
		    });
		this.arboPanel=Ext.create('Ext.panel.Panel',{layout:'accordion',title:this.panelTitle, iconCls:'cmsIcon'});
		this.arboRegion.add(this.arboPanel);
				
		for(pluginName in this.plugins){
		
			plugin = this.plugins[pluginName];

			
		plugin.instance.arboRegion=this.arboRegion;
		plugin.instance.centerRegion=this.centerRegion;
		plugin.instance.viewPort=this.viewPort;
		plugin.instance.cmsClass=this;
		
		if(plugin.pos!='before')this.arboRegion.add(plugin.instance.panel);
		else this.arboRegion.insert(0,plugin.instance.panel);
		
		if(plugin.instance.isTree)this.arboRegion.trees.push(plugin.instance.panel);
		//},this)
		
		}
		this.breadCrumbCallBack=this.selectNode.bind(this);

		this.getRootsList();
		
		// Task Runner
		
		Ext.TaskManager.start({
		    run: this.callUserCheckConnect,
		    interval: 300000,
		    scope:this
		});
		
	},
	
	callUserCheckConnect:function(){
		
		this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_AdminUsersMapper',APICall:'checkConnect'}, this.checkConnectCB.bind(this), false)
		
	},
	
	checkConnectCB:function(){
		
		
	},
	
	getRootsList:function(){
		
		this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ArboMapper',APICall:'getRoots'}, this.buildContentTrees.bind(this))
		
		
	},
	
	buildContentTrees:function(response){
		
		if(response.roots.length==0){
			this.arboRegion.child("treepanel").expand();
			return this.arboPanel.hide();
		}
		
		response.roots.each(function(elt){
			
			var panel=this.buildArboTree(elt.id_rubrique, elt.title,  elt.title);
			
			this.arboPanel.add(panel);
			this.arboRegion.trees.push(panel);
			
		}, this);
		
	},
	
	buildArboTree:function(rootID, title, rootTitle){
		
		Ext.define('model_'+rootID, {
		    extend: 'Ext.data.Model',
		    idProperty:'id_rubrique',	
		    
			fields: ['type','title','templateRef',{name:'callback', convert:function(v,record){
				
				if(v==null||v.empty()) return null;
				
				var classArray = v.split('|');
				
								
				var instanceName=Ext.ClassManager.get(classArray[0]);

				if(!instanceName)return null;
				
				if(!Ext.ClassManager.isCreated(classArray[0]))instanceName=Ext.ClassManager.instantiate(classArray[0]);
				
				
				if(this.plugins[classArray[0]].instance[classArray[1]]=="undefined"||typeof this.plugins[classArray[0]].instance[classArray[1]]!="function") return null;
				
				return this.plugins[classArray[0]].instance[classArray[1]].bind(this.plugins[classArray[0]].instance);
				
				
			}.bind(this)},{name:'id_template', type:'int'},{name:'statut',type:'int'},{name:'id_rubrique', type:'int'}, {name:'text', mapping:'title'},{name:'id_template', type:'int'},{name:'iconCls', mapping:'type', 
			convert:function(v,record){
				
				var v=record.data.type;
				
				if(record.data.statut==0)v+='Offline';
				return v;
			}
		},{name:'qtip', mapping:'title',convert:function(v,record){
			v=record.data.title+' - '+(record.data.statut==0?'Hors ligne':'En ligne');
			return v;
			
		}}, {name:'treeRef', convert:function(){
			
			return 'treeArbo_'+rootID;
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
			model:'model_'+rootID,
			storeId:'storeArbo_'+rootID,
			
			listeners:{
				scope:this,
				load:function(st){
					var tree=Ext.getCmp('treeArbo_'+rootID);
					if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
					
				}
				
			}
		  });
 
		var treeMenu=Ext.create('Ext.tree.Panel',{
			border:true,
			layout:'fit',
			collapseFirst:true,
			title:title,
			id:'treeArbo_'+rootID,
			autoWidth:true,
			viewConfig: {
				plugins: {
		            ptype: 'treeviewdragdrop',
		            dragText:'{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}'
		        }
		    },
		    store:store2,
		    tools:[{type:'refresh', scope:this, handler:this.refreshTree}],
		    loadMask:true,
    		loadingText:'Chargement de l\'arborescence',
    		singleSelect:true,
    		root:{expanded:true, text:title, selected:true, id_rubrique:rootID},
    		rootVisible: false,
    		listeners:{
    		scope:this,
    		
    		afterlayout:function(tree){
    		
    			if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
    			
    		},
    		itemmove:this.updateTree,
    		itemclick:this.selectNode
    		
    	}
});

		return treeMenu;
		
	},
	
	/**
	 * selectNode
	 */
	
	selectNode:function(view,record,htmlElement,index,e){
    	
	if(this.selectedRub==record)return;
	
	
	if(this.deleteAction==null&&this.selectedRub&&!this.checkCMSFormDirty(this.openForm.bind(this,record), record, view, this.selectedRub)) return;

	this.deleteAction=null;
	
	this.arboRegion.expand();
	
	Ext.getCmp(record.get('treeRef')).expand();
	
	this.openForm(record);
	},
	
	/**
	 * 
	 */
	
	openForm:function(record){
		if(record==undefined)record=this.selectedRub;
		
		this.unselectTreeNode(record, this.selectedRub);
		
    	this.selectedRub=record;
          	
    	this.cleanPanels();
    	this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ContentMapper',APICall:'getContentData',templateRef:this.selectedRub.data.templateRef, id_element:this.selectedRub.data.id_rubrique},this.loadForm.bind(this));
     	
    },
    /**
     * 
     */
    
    loadForm:function(response){
    	
    	
this.infoLabel=Ext.create('Ext.toolbar.TextItem',{html:''})
    	
    	//items2.push(this.infoLabel);
    	
this.rights=response.rights;
this.isLocked=response.isLocked;

    	this.centerRegion.getDockedItems()[0].add('->',this.infoLabel);
    	
    	this.publishBtn=Ext.create('Ext.button.Button',{xtype:'button', text:'Publier', id:'publishBtn', iconCls:'publishBtn', scope:this, handler:this.saveForm, action:4, disabled:this.rights.edit==0||this.isLocked})
    	this.saveBtn=Ext.create('Ext.button.Button',{
            xtype:'splitbutton',
            text: 'Enregistrer',
            iconCls: 'saveBtn',
            disabled:true,
            scope:this,
            menu: [{text: 'Enregistrer la version actuelle', handler:this.saveForm, scope:this, action:1},{text: 'Cr&eacute;er une nouvelle version',handler:this.saveForm, scope:this, action:2},{text: 'Cr&eacute;er une nouvelle version et publier',handler:this.saveForm, scope:this, action:3}]
        });
    	
    	this.unpublishBtn=Ext.create('Ext.button.Button',{xtype:'button', text:'D&eacute;publier', iconCls:'unpublishBtn',disabled:true, scope:this, handler:this.saveForm, action:-1});
    	
    	var items=[];
    	
    	this.refreshBtn = Ext.create('Ext.button.Button',{text:'Recharger',iconCls:'refreshBtn', disabled:true, scope:this, handler:function(){
    	
    		this.checkCMSFormDirty(this.openForm.bind(this,this.selectedRub), this.selectedRub, null, this.selectedRub)
    		
    	}});
    	
    	var items2=[this.saveBtn,this.publishBtn,this.unpublishBtn, this.refreshBtn];
    	
    	if(this.selectedRub.data.type=="folder")items.push( {xtype:'button',text:'Nouveau', iconCls:'addBtn', handler:this.addArboItems, scope:this, tooltip:'Ajouter un &eacute;l&eacute;ment', disabled:this.rights.edit==0||this.isLocked});
    	if(!this.selectedRub.isRoot()&&!this.selectedRub.parentNode.isRoot())items.push({xtype:'button', iconCls:'editBtn',text:'Modifier', handler:this.addArboItems, scope:this, tooltip:'Modifier l\'&eacute;l&eacute;ment', disabled:this.rights.edit==0||this.isLocked},
    	           {xtype:'button',text:'Supprimer', handler:this.deleteArboItems, scope:this, iconCls:'removeBtn',tooltip:'Supprimer l\'&eacute;l&eacute;ment s&eacute;lectionn&eacute;',disabled:this.rights.edit==0||this.isLocked||this.selectedRub.childNodes.length>0});
    	
    	var menuItem={
    			title:'&Eacute;l&eacute;ment',
                xtype: 'buttongroup',
                columns: 3,
                defaults: {
                    scale: 'small'
                }, items:items};
    	
    	var menuItem2={
    			title:'Contenu',
                xtype: 'buttongroup',
                columns: 4,
                defaults: {
                    scale: 'small'
                }, items:items2};

    	
    	var items=response.fields;
    	
    	var data=response.result!=false?Ext.JSON.decode(response.result.data):null;
    	
    	this.version_id= response.result.version_id;
    	
    	this.unpublishBtn.setDisabled(response.result.inline_version==null||this.rights.edit==0||this.isLocked);
    	
    		
    	Ext.define('versionModel', {
		    extend: 'Ext.data.Model',
		    idProperty:'id_content',			
			fields: [{name:'status',type:'int'},{name:'creation_date', convert:function(v){
				var date=Ext.Date.parseDate(v,'Y-m-d H:i:s');
				return date;
				
			}},{name:'update_date', convert:function(v){
				
				if (v==null) return null;
							var date=Ext.Date.parseDate(v,'Y-m-d H:i:s');
				return date;
//				
			}},{name:'version_id', type:'int'}, 'userName'],
		proxy: {
			actionMethods:'post',
		    extraParams: {
		       API: 'Application_Model_ContentMapper',
		        APICall: 'getVersionsList',
		        id_rubrique:this.selectedRub.data.id_rubrique
		    },
		    type: 'ajax',
		    url: '/admin/getjsondata?format=json'
		}
});
    		
    	this.versionStore=Ext.create('Ext.data.Store',{
    		model:'versionModel',
			storeId:'versionStore',
		   
			listeners:{
				scope:this				
			}
		  });
    	
    	
    	
    	sm = Ext.create('Ext.selection.CheckboxModel',{
    		renderer:function(v,p,record){
    			
	    		if(record.store.getCount()==1||record.get('status')==1||this.version_id==record.get('version_id'))return '';
	    		return '<div class="x-grid-row-checker">&nbsp;</div>';
	    		
	    	}.bind(this),
    		checkOnly:true,
            listeners: {
            	scope:this,
                selectionchange: this.filterVersionSelection,
                select:this.filterVersionSelection,
                deselect:this.filterVersionSelection
                	
            }
    	
    });
    	
    	 this.deleteVersionBtn=Ext.create('Ext.button.Button',
 		    	{text:'Supprimer',tooltip:'Supprimer la s&eacute;lection', scope:this, handler:this.deleteVersion.bind(this, sm), disabled:true,iconCls:'removeBtn'}
 		    	
 		    );
    	
    	actionVersionCol=Ext.create('Ext.grid.column.Action',{
            xtype:'actioncolumn', 
            menuDisabled :true, 
            sortable:false,
            width:50,
            
            bodyStyle:'cursor:pointer',
            align:'center',
            items: [{
                icon: 'img/icons/pencil.png',  // Use a URL in the icon config
                tooltip: 'Editer l\'&eacute;l&eacute;ment',
                scope:this,
                getClass:function(v,meta,record){
                	if(record.get('version_id')==this.version_id) meta.style='display:none';
              	
                },
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    this.cleanPanels();
                    this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ContentMapper',APICall:'getContentData',templateRef:this.selectedRub.data.templateRef, id_element:this.selectedRub.data.id_rubrique, version_id:rec.get('version_id')},this.loadForm.bind(this));
                }
            }]});
    	
    		this.versionGrid=Ext.create('Ext.grid.Panel',{
    			tbar:[this.deleteVersionBtn],
    			selModel:sm,
    			title:'Versions',
    			border:false,
    			store:this.versionStore,
    			columns:[{header:'Version', dataIndex:'version_id', align:'center'}, {header:'Date de cr&eacute;ation',width:150, align:'center',dataIndex:'creation_date', renderer:function(v){

    				return Ext.Date.format(v,'d-m-Y H:i');
    				
    				
    			}}, {header:'Derni&egrave;re mise &agrave; jour', width:150,dataIndex:'update_date', align:'center',renderer:function(v){
    				
    				if(v==null) return;
  				return Ext.Date.format(v,'d-m-Y H:i');
    				
    				
    			}},
    			{header:'Statut', dataIndex:'status', align:'center',renderer:function(v){
    				
    				if(v==1) return '<img src="img/icons/accept.png" data-qtip="En ligne" />';
    				return '<img src="img/icons/stop.png" data-qtip="Hors ligne" />';
    				
    			}},
    			{header:'Utilisateur', dataIndex:'userName', align:'center'},actionVersionCol],
    			listeners:{
    				scope:this,
    				activate:function(tabPanel){
    					this.versionStore.load();
    					
    					
    				}
    				
    			}
    			
    			
    		});
    		
    		this.cmsLabel=Ext.create('Ext.toolbar.TextItem',{html:''})
    		

    
    	   
    	leftCol=Ext.create('Ext.panel.Panel',{region:'center',border:false, width:720,
    		autoScroll:true, 
    		minWidth:700,
    		split:true,
    		defaults:{
    		labelWidth:150,
    		width:700,
    		labelStyle:'text-align:right;'   		
    	}})
    	
    	items.each(function(elt,index){
    	    		
    		extraParams={};

    		
    		if(elt.extra_params!=null){
    			
    			extraParams=Ext.JSON.decode(elt.extra_params);
    			
    			
    			
    		}
    		
    		if(elt.field_type=="checkbox")var field={xtype:elt.field_type.toLowerCase(), extraParams:extraParams, rights:this.rights,fieldLabel:elt.label, allowBlank:elt.compulsary==0,name:elt.field_name, value:data?Number(data[elt.field_name]):null, inputValue:1, checked:data&&data[elt.field_name]};
    		else if(elt.field_type!="combo") var field={xtype:elt.field_type.toLowerCase(), extraParams:extraParams, rights:this.rights,fieldLabel:elt.label, allowBlank:elt.compulsary==0,name:elt.field_name, value:data?data[elt.field_name]:null};
    		
    		else{
    			var dataStore = extraParams ;
    			
    			var cbStore = Ext.create('Ext.data.Store', {
    			    fields: ['value', 'label'],
    			    data : dataStore
    			});
    			
    			var field={xtype:elt.field_type.toLowerCase(), extraParams:extraParams, rights:this.rights,fieldLabel:elt.label, allowBlank:elt.compulsary==0,name:elt.field_name, store:cbStore, queryMode: 'local',
    				    displayField: 'label',
    				    valueField: 'value',value:data?data[elt.field_name]:null};
    		}
    		
    		if(elt.field_type=="datefield"||elt.field_type=="numberfield"||elt.field_type=="combo")field.width="auto";

    		
    		if(elt.field_type=="datefield"&&extraParams){
    			field.order=extraParams.order;
    			field.format="d/m/Y";
    			field.listeners={'change':function(value){
    			
    				var elt = this.cmsFormPanel.getForm().findField(field.name);
    				
    				var fields=this.cmsFormPanel.query('datefield').without(elt);
    				fields.each(function(datefield){
    					var order=datefield.order||this.cmsFormPanel.query('datefield').length;
    					var fieldValue=datefield.getValue();
    					datefield.clearInvalid();
    					if(elt.getValue()!=null) value=elt.getValue();
    					else value=null;
    						
    						if(order>field.order)datefield.setMinValue(Ext.Date.add(value, Ext.Date.DAY, 1));
    						else datefield.setMaxValue(Ext.Date.add(value, Ext.Date.DAY, -1));
    					
    						datefield.validate();
    					
    				},this);
    			
    			},
    			scope:this};
    			
    		}
    		leftCol.add(field);
    		
    	},this);

    	
    	var refPanel =Ext.create('Ext.panel.Panel',{
    		region:'east', 
    		collapsible:true,
    		title:'Référencement',
    		minWidth:150,
    		width:250,
    		
    		defaults:{
    			labelAlign:'top',
    			width:220
    			
    		},
    		items:[{xtype:'text',allowBlank:false,fieldLabel:'Permalink',name:'permalink', readOnly:this.rights.write==0,maskRe:/([a-zA-Z0-9\/\.\-_]+)$/,regex:/^\/([a-zA-Z0-9\/\.\-_]+)$/, regexText:'Le permalink doit commencer par / et doit uniquement comporter des caract&egrave;res alphanum&eacute;riques,<br />des \'-\', des \'_\' ou des / et aucun espace', value:response.result.permalink, listeners:{
    			scope:this,
    			blur:this.checkPermalink
    		}
    		},{xtype:'textareafield', fieldLabel:'Mots cl&eacute;s', name:'keywords',readOnly:this.rights.write==0, value:response.result.keywords}, {xtype:'textareafield', readOnly:this.rights.write==0,fieldLabel:'Description', name:'description', value:response.result.description}]
    		}); 
    	
    			this.cmsFormPanel = Ext.create('Ext.form.Panel',{xtype:'form', id:'cmsFormPanel',border:false, margin:5, 
			
			autoHeight:true,
			title:'Contenu',
        	layout:'border',
        	trackResetOnLoad:true,
        	tbar:[menuItem, menuItem2,'->',this.cmsLabel],
        	 listeners: {
	            	scope:this,
	            	validitychange:function(form, isValid){
	            		            		
	            		if(!form.isDirty()) return this.saveBtn.setDisabled(true);
	            		this.saveBtn.setDisabled(!isValid||this.rights.write==0);
	            		this.publishBtn.setDisabled(!isValid||this.rights.write==0);
	            		
	            		
	            	},
	            	dirtychange:function(form, dirty){

	            		this.refreshBtn.setDisabled(false);
	            		this.publishBtn.setDisabled(!form.isValid());
	            		
	            		if(dirty&&form.isValid()&&this.rights.write==1){
	            			
	            			return this.saveBtn.setDisabled(false);
	            		}
	            		
	            		            		this.saveBtn.setDisabled(true);
	            		
	            		
	            	}
	            },
	            defaults:{
	            	bodyStyle:"padding:5px"
	            	
	            },
	            items:[refPanel,leftCol]
        });
    	
    			for(pluginName in this.plugins){
        			
        			plugin = this.plugins[pluginName];
        		plugin.instance.cmsFormPanel=this.cmsFormPanel;
        		
        		
        		}
    	
    	var tabs = Ext.create('Ext.tab.Panel', {
    	  height:'95%',
    	  border:false,
    	    activeTab: 0,
    	    items:[this.cmsFormPanel, this.versionGrid],
    	    listeners:{
    	    	scope:this,
    	    	afterrender:function(panel){
    	    		
    	    		if(this.selectedRub.get('callback')==null) return;
    	    		this.selectedRub.get('callback')(this.selectedRub.data.id_rubrique,data);
    	    	}
        	}
    	}
    	
    	
    	);
    	
    	this.centerRegion.add(tabs);
    	this.updateLabelInfo(response);
    	this.centerRegion.doLayout();
    	
//    	this.plugins.each(function(plugin){
    	
    		
 //   		},this)
    	
    	
    	this.displayBreadCrumb(this.selectedRub);
    	
    },
    
    checkPermalink:function(tf){
    	
    	if(!tf.isValid()) return;
    	value=tf.getValue();
    	this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ContentMapper',APICall:'checkPermalink', id_article:this.selectedRub.data.id_rubrique, permalink:value}, this.checkPermalinkCB.bind(this, tf), false)
    	tf.setDisabled(true);
    	
    	
    },
    
    checkPermalinkCB:function(tf, response){
    	
    	tf.setDisabled(false);
    	
    	tf.setValue(response.permalink);
    	
    },
    
    updateLabelInfo:function(response){
    	    	
    	var version_id=response.result.version_id;
    	if(version_id==undefined||!version_id)version_id=1;
    	var infoHTML="";//;
    	var labelHTML="Version "+version_id+ '<img src="/admin/img/icons/information.png" align="absmiddle" style="padding:0 5px" data-qtip="Gabarit utilis&eacute; : '+this.selectedRub.get('templateRef');
    	if(response.result.inline_version)infoHTML+='Version actuellement en ligne '+response.result.inline_version;
    	if(response.result.publication_date){
    		var publicationDate = Ext.Date.parseDate(response.result.publication_date,'Y-m-d H:i:s');
    		infoHTML+='<br /> Publi&eacute;e le '+Ext.Date.format(publicationDate,'D. d M Y')+' &agrave; '+Ext.Date.format(publicationDate,'H:i')
    }
    	
    	if(response.result.update_date){
    		var updateCreation = Ext.Date.parseDate(response.result.update_date,'Y-m-d H:i:s');
    		labelHTML+='<br />Mise &agrave; jour le '+Ext.Date.format(updateCreation,'D. d M Y')+' &agrave; '+Ext.Date.format(updateCreation,'H:i')+' par '+response.result.userName;
    	
    	}
    	
    	labelHTML+='" />';
    	
    	rightsHTML=(this.isLocked?'<strong style="font-weight:bold; color:red"><img src="/admin/img/icons/error.png" align="absmiddle" />Cet &eacute;l&eacute;ment est en cours de modification par un autre utilisateur !</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;':'' )+'Vos droits : ';
    	if(this.rights.write==0)rightsHTML+='<img src="/admin/img/icons/pencil_delete.png" data-qtip="Vous n\'avez pas les droits de modification" />';
    	else rightsHTML+='<img src="/admin/img/icons/pencil.png" data-qtip="Vous avez les droits de modification" />';
    	
    	if(this.rights.edit==0)rightsHTML+='<img src="/admin/img/icons/world_delete.png" data-qtip="Vous n\'avez pas les droits d\'&eacute;dition (publication, d&eacute;publication, ajout d\'&eacute;l&eacute;ments)" style="padding:0 5px" />';
    	else rightsHTML+='<img src="/admin/img/icons/world.png" data-qtip="Vous n\'avez pas les droits d\'&eacute;dition (publication, d&eacute;publication, ajout d\'&eacute;l&eacute;ments)" style="padding:0 5px" />';
    	
    	
    	
    	this.infoLabel.update('<div class="infoLabel">'+infoHTML+'</div>');
    	this.cmsLabel.update('<div class="infoLabel">'+rightsHTML+'<br />'+labelHTML+'</div>');
    	
    },
    
    /**
     * 
     */
    
    saveForm:function(btn){
    	var params=this.cmsFormPanel.form.getValues();
    	
    	
    	   	
    	params.API="Application_Model_ContentMapper";
    	params.APICall="addOrModify";
    	params.actionType=btn.action==4?1:btn.action;
    	params.id_element=this.selectedRub.data.id_rubrique;
    	params.version_id=this.version_id;
    	params.statut=0;
    	
    	if(btn.action==4)params.statut=1;

    	this.ajaxRequest('/admin/getjsondata?format=json',params, function(response){
    		
    		var data=Ext.JSON.decode(response.result.data);
    		this.version_id=response.result.version_id;
    		this.selectedRub.beginEdit();
    		this.selectedRub.set('statut', response.result.inline_version>0?1:0)
    		this.selectedRub.set('iconCls',data.type+(response.result.inline_version>0?'Offline':''));
    		this.selectedRub.set('qtip',data.name+' - '+(response.result.inline_version>0?'Hors ligne':'En ligne'));
    		this.unpublishBtn.setDisabled(response.result.status!=1);
    		this.selectedRub.endEdit();
    		this.selectedRub.commit();
    		data.keywords=response.result.keywords;
    		data.description=response.result.description;
    		data.permalink=response.result.permalink;
    		this.cmsFormPanel.form.setValues(data);
    		this.cmsFormPanel.form.reset();
    		this.updateLabelInfo(response);
    		
    	}.bind(this));
    	

    	
    	
    },
    
 
      
    
	/**
	 * updateTree
	 */
	
	 updateTree:function(curNode, oldParent, newParent, index,node){
	   
	    	var items=newParent.childNodes;
	    	
	    	var queryString="";
	    	items.each(function(it,index){
	    		queryString+='items['+index+']='+it.data.id_rubrique+'&';
	    		
	    		
	    	},this);
	    	
	    	queryString+='&parentID='+newParent.data.id_rubrique;
	    	this.ajaxRequest('/admin/getjsondata?format=json',queryString+'&API=Application_Model_ArboMapper&APICall=moveRub');
	    	
	    	this.displayBreadCrumb(curNode);
	    	
	    },
	    
	    /**
	     * 
	     */
	    addArboItems:function(btn){
	    	
	    	var view = new Ext.widget('arboedit',{isNew:btn.text!="Modifier"});
	    	//view.isNew=
	    	
	    	var templateCombo=view.down('form').form.findField('id_template');
	    	
	    	if(btn.text=="Modifier"){
	    		view.setTitle('Editer');
	    			if(!this.selectedRub.isRoot())view.down('form').loadRecord(this.selectedRub.store.findRecord("id_rubrique",this.selectedRub.data.id_rubrique));
	    			view.down('form').remove(templateCombo);
	    			
	    			
	    		
	    	}else {
	    		
	    		templateCombo.store.proxy.extraParams.templateId=this.selectedRub.data.id_template;
	    		templateCombo.store.load();
	    		view.setTitle('Ajouter');
	    	}
	    	
	    	Ext.getCmp("saveArboBtn").on('click', this.updateArbo, this);
	    },
	    
	    updateArbo:function(button){
    		var win = button.up('window');
    		var form = win.down('tabpanel')?win.down('tabpanel').getActiveTab().getForm():win.down('form');
    		var fields= form.getValues();
     		var record=form.getRecord();
     		
     	
     		fields.API="Application_Model_ArboMapper";

     		fields.APICall="addOrModify";
      		
     	
     		
     		if(Number(fields.id_rubrique)==0||!fields.id_rubrique)fields.ordre=this.selectedRub.childNodes.length;
    		
    		
     		
     		if(record){
    		
    		 record.beginEdit();
    		 record.set('title',fields.title);
    		 record.set('text',fields.title);
    		 record.endEdit();
    		 record.commit();
     		}
     		else{
     			
     			fields.parentID=this.selectedRub.data.id_rubrique;
     			     			
     		}
    		  
     		
     		
     		this.ajaxRequest('/admin/getjsondata?format=json',fields,function(response){
     			

     			if(fields.parentID){
     				
     				var obj = response.result;
         			obj.children=[];
         			obj.text=obj.title;
         			
         			obj.iconCls=obj.type+(obj.active==0)?'Offline':'';
         			
         		
         			
         			var newNode=Ext.ModelManager.create(obj, 'model_'+this.selectedRub.data.treeRef.split('_')[1]);
         		         newNode.children=[];		
     				this.selectedRub.appendChild(newNode)
     				this.selectedRub.expand();
     			}
     			win.close();
     			
     		}.bind(this));

    	},
    	
    	deleteArboItems:function(btn){
    		
    		var intitule=this.selectedRub.data.type=="folder"?"un r&eacute;pertoire":"une page";
    		
    		Ext.Msg.show({
			     title:'Suppression d\''+intitule,
			     msg: 'Attention, la suppression d\''+intitule+' est d&eacute;finitive !<br />Voulez-vous continuer ?',
			     buttons: Ext.Msg.YESNO,
			     icon: Ext.Msg.WARNING,
			     fn:function(btn){
			    	 if(btn=='no') return;
			    	 this.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ArboMapper',APICall:'delete', id_rubrique:this.selectedRub.data.id_rubrique}, this.deleteRub.bind(this));
			    	 
			    	 
			     },
			     scope:this
			     
			});
    		
    		
    	},
    	
    	deleteRub:function(btn){
    		
    		var newNode=this.selectedRub.parentNode;
    		newNode.removeChild(this.selectedRub);
    		var tree=Ext.getCmp(newNode.data.treeRef);
    		this.deleteAction=true;
        	tree.getSelectionModel().select(newNode);
    		this.selectNode(null,newNode);
    		
    	},

    	
    	filterVersionSelection:function(sm){
    		var selection=this.getVersionSelection(sm);
    		
    		this.deleteVersionBtn.setDisabled(selection.length==0);
    		
    		if(selection.length==0)sm.deselectAll();
    	},
    	getVersionSelection:function(sm){
    		
    		var selection = sm.getSelection();
    		var selection2=[];
    		
    		selection.each(function(elt,index){
    			    			
    			if(elt.store.getCount()!=1&&elt.data.status!=1&&elt.data.version_id!=this.version_id)selection2.push(elt);
    			else sm.deselect(elt); 			
    			
    		}, this);
    		
    		return selection2;
    		
    	},
    	
    	deleteVersion:function(sm){
    		
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
			    	 this.ajaxRequest('/admin/getjsondata?format=json',params, function(response){
			    	
			    		 if(response.result)this.version_id=response.result.version_id;
			    		 this.versionStore.load();
			    		 this.versionGrid.doLayout();			    		 
			    	 }.bind(this));	    	 
			    	 
			     }.bind(this),
			     scope:this
			     
			});
    		
    		
    	},
    	openUserWindow:function(e){
    		
    		Event.stop(e);
    		
    		var form = Ext.create('Ext.form.Panel',{
    			bodyStyle:'background:transparent',
    			margin:5,
    			trackResetOnLoad:true,
    			listeners:{
    				scope:this,
    				validitychange:function(form, isValid){
	            		var saveBtn=form.owner.down('button[action=submit]');
    					
	            		if(!form.isDirty()) return saveBtn.setDisabled(true);
	            		saveBtn.setDisabled(!isValid);
	            		
	            	},
	            	dirtychange:function(form, dirty){
	            		
	            		var saveBtn=form.owner.down('button[action=submit]');
	            		
	            		if(dirty&&form.isValid())return saveBtn.setDisabled(false);
	            		
	            		saveBtn.setDisabled(true);
	            		
	            		
	            	}
	            },
    			 fieldDefaults: {
    			        labelAlign: 'left',
    			        labelWidth: 100,
    			        labelStyle:'text-align:right'
    			    },
    			    defaults:{
    			    	width:310
    			    	
    			    },
    			border:false,
    			items:[
    			       {xtype:'textfield', fieldLabel:'Nom *', name:'lastname',allowBlank:false, minLength:3},
    			       {xtype:'textfield', fieldLabel:'Pr&eacute;nom *', name:'firstname', allowBlank:false, minLength:3},
    			       {xtype:'textfield', fieldLabel:'Email *', readOnly:true,name:'email', allowBlank:false, minLength:3, vtype:'email'},
    			       {xtype:'fieldset', title:'Nouveau mot de passe', collapsible:true, collapsed:true, width:330,
    			    defaults:{
    			    	width:300
    			    	
    			    },
    			    items:[
    			           {xtype:'textfield', labelWidth: 90,fieldLabel:'Mot de passe', name:'newPass',minLength:6, inputType:'password',
    			        	   validator:function(value){
    			        		   
    			        		  if(form.getForm().findField('newPassConfirm').getValue().empty()&&value.empty()){
    			        			  
    			        			  form.getForm().findField('newPassConfirm').clearInvalid();
    			        			  return true;
    			        		  }
    			        		  if(form.getForm().findField('newPassConfirm').getValue().empty())return "Veuillez saisir la v&eacute;rification de votre mot de passe";
    			        		   if(form.getForm().findField('newPassConfirm').getValue()!=value) return "Les mots de passe ne correspondent pas";
    			        		   form.getForm().findField('newPassConfirm').clearInvalid();
    			        		   return true;
    			        	   }, scope:this},
    			           {xtype:'textfield',labelWidth: 90, fieldLabel:'V&eacute;rification', name:'newPassConfirm',minLength:6, inputType:'password',
    			        		   validator:function(value){
    	    			        		  if(form.getForm().findField('newPass').getValue().empty()&&value.empty()){
    	    			        			  form.getForm().findField('newPass').clearInvalid();
    	    			        			  return true;
    	    			        		  }
    	    			        		  if(form.getForm().findField('newPass').getValue().empty())return "Veuillez saisir votre mot de passe";
    	    			        		   if(form.getForm().findField('newPass').getValue()!=value) return "Les mots de passe ne correspondent pas";
    	    			        		   form.getForm().findField('newPass').clearInvalid();
    	    			        		   return true;
    	    			        		   
    	    			        	   }, scope:this}
    			           
    			           ]}
    			    
    			       ],
    			       buttons:[{text:'Enregistrer', disabled:true, action:'submit',
    			    	scope:this,
    			    	handler:function(btn){
    			    		if(!form.getForm().isValid()) return;
    			    		
    			    		form.getForm().submit({
    			    			url:'/admin/getjsondata?format=json',
    			    			params:{
    			    				API:'Application_Model_AdminUsersMapper',
    			    				APICall:'updateUserData'
    			    				},
    			    				method:'post',
    			    				waitMsg:'Mise &agrave; jour des informations',
    			    				success:function(f, action){
    			    					
    			    					$('nameWrapper').update('Bonjour, '+action.result.data.firstname+' '+action.result.data.lastname);
    			    					form.up('window').close();
    			    					
    			    				},
    			    				failure: function(form, action) {
    			        		        Ext.Msg.alert("Erreur", action.result.msg);
    			        		    }
    			    			
    			    		});
    			    		
    			    	}
    			       }, {text:'Annuler', handler:function(btn){
    			    	   var win = btn.up('window');
    			    	   win.close();
    			    	   
    			       }, scope:this}]
    			
    			
    		});
    		
    		var winContact = Ext.create('Ext.window.Window',{
    			title:'Modification de vos informations',
    			modal:true,
    			
    			width:350,
    			items:[form]
    			});
    		
    		winContact.show();
    		
    		form.getForm().load({
    			url:'/admin/getjsondata?format=json',
    			params:{API:'Application_Model_AdminUsersMapper', APICall:'getUserInfo'},
    			waitMsg:'Chargement des informations',
    			failure: function(form, action) {
    		        Ext.Msg.alert("Erreur", action.result.msg);
    		    }

    		})
    		
    	}
	
});

