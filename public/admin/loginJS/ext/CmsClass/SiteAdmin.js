/**
 * 
 */
Ext.define('CmsClass.SiteAdmin', {
	extend:'CmsClass.BaseClass',
	isTree:true,
	uses:['Ext.ux.CheckColumn'],
	panelTitle:'Administration',
	subMenus:null,
	selectedRub:null,
	constructor:function(){
		
		this.initSiteAdminPanel();
		this.breadCrumbCallBack=this.itemClick.bind(this);
		
		Ext.define('templateRefModel', {
		    extend: 'Ext.data.Model',
		    fields: [
		        {type: 'int', name: 'id_templateRef'},
		        {type: 'string', name: 'templateRef'},
		        {type: 'string', name: 'description'},
		        {type: 'string', name: 'callback'},
		        {type: 'string', name: 'type'},
	            {name:'publiable', type:'bool'},
		        {type: 'int', name: 'numFields'}
		    ],
		    proxy: {
		           type: 'ajax',
		           root:'result',
		           url: '/admin/getjsondata/format/json',
		           actionMethods:'post',
		           extraParams:{API:"Application_Model_TemplateMapper", APICall:"getTemplateRefList"}
		        }
		});

		
	},
	
	initSiteAdminPanel:function(){
	
		Ext.define('siteAdminTreeModel', {
		    extend: 'Ext.data.Model',
		    fields: [{name:'qtip', mapping:'qtip'},'isLeaf','text',{name:'treeRef',convert:function(){return "siteAdminTree";}}, 'callback'],
		    proxy: {
		        type: 'memory',
		        reader:{
		        type:'json',
		        root:'rows'
		        }
		        
			}
			
		});
		
		
		treeItems=[
//		           {"text":"Param&egrave;tres du site", "leaf": "true", "callback":this.displayParamsForm.bind(this),iconCls:'editSite', qtip:'Editer les param&egrave;tres du site' },	
					{"text":"Utilisateurs", "leaf": "true", "callback":this.displayUsersForm.bind(this),iconCls:'userPanel', qtip:'Gestion des utilisateurs et des droits utilisateurs' },
		           {"text":"Templates", "leaf": "true", "callback":this.displayTemplatesForm.bind(this),iconCls:'templatesIcon', qtip:'Administration des templates' }]
		
		var store = Ext.create('Ext.data.TreeStore', {
			model:'siteAdminTreeModel',
			autoLoad:true,
		
			listeners:{
				scope:this,
				load:function(st){
					treeItems.each(function(item){					
					var newNode=Ext.ModelManager.create(item, 'siteAdminTreeModel');
					st.getRootNode().appendChild(newNode);
					},this);
				}
				
			}
			 
		    
		});     

		
		this.panel = Ext.create('Ext.tree.Panel',{
			title:this.panelTitle,
			iconCls:'siteAdminPanel',
			id:'siteAdminTree',
			store:store,
			rootVisible:false,
			lines:false,
			listeners:{
	    		scope:this,
	    		
	    		afterlayout:function(tree){

	    			if($$('#'+tree.body.dom.id+' table.x-grid-table-resizer').length>0)$$('#'+tree.body.dom.id+' table.x-grid-table-resizer')[0].setStyle({width:'100%'});
	    			
	    		},

	    		itemclick:this.itemClick
	    	}
			
		});
		
		
		
		
		
	},
	itemClick:function(view,record,htmlElement,index,e){
		
		if(record==undefined)record=this.selectedRub;
		
		
		
		var callBack=record.get('callback');
		
			var cb=(callBack!=undefined&& typeof callBack=="function"?callBack:Ext.emptyFn)
		if(this.cmsClass.selectedRub!=null&&!this.checkCMSFormDirty(callBack.bind(this,record), record, view, this.cmsClass.selectedRub)) return;

			cb(record);
		
	},
	displayParamsForm:function(elt){
		
	},
	
	displayTemplatesForm:function(record){
	
		this.initTreeNode(record);
		
		
		Ext.define('templatesModel', {
	        extend: 'Ext.data.Model',
	        fields: [
	            {name: 'id_template',     type: 'int'},
	            {name: 'template_name',     type: 'string'},
	            {name: 'parent_id', type: 'int'},
	            {name: 'templateRef', type: 'string'},
	            {name: 'child_required', type: 'int'},
	            {name:'iconCls', mapping:'type'},

	            {name:'treeRef', convert:function(){return "treeTpl"}}
	        ]
	    });

	    var store = Ext.create('Ext.data.TreeStore', {
	        model: 'templatesModel',
	       
	        proxy: {
	           type: 'ajax',
	           url: '/admin/getjsondata?format=json',
	           actionMethods:'post',
	           extraParams:{API:"Application_Model_TemplateMapper", APICall:"getTemplates"}
	        }
	        
	    });

	    
	    var tree = Ext.create('Ext.tree.Panel', {
	        title:'Organisation des templates',
	        tbar:[{xtype:'button', iconCls:'addBtn', text:'Ajouter', scope:this, handler:function(){this.openAddTemplateForm(null)}}],
	       id:'treeTpl',
	    	border:false, 
	    	loadMask:true,
	        useArrows: true,
	        rootVisible: false,
	        store: store,
	        multiSelect: false,
	        viewConfig: {
	        	allowCopy: true,
		           listeners:{
		        	   scope:this,
		        	   beforedrop:function(node, data,overModel, dropPosition, dropFn){

		        		   
		        		   if(overModel.isRoot()||overModel.parentNode.isRoot()&&dropPosition!='append') return false;
		        		  
		        		  if(data.records[0].parentNode==overModel&&dropPosition!="before")return false;
		        		   		        		   
		        	Ext.Msg.confirm('D&eacute;placer le template', 'Attention, si vous d&eacute;placer ce template, cela peut avoir des r&eacute;percussions sur la gestion de contenu.<br />Souhaitez-vous continuer ?',function(btn){
		        			   if(btn=='yes')tree.view.plugins[0].dropZone.handleNodeDrop(data,overModel, dropPosition);
		        			   
		        		   }, this)
		        	
		        		   return false;
		        	
		        		   
		        	   }
		           } ,
				plugins: {
		           ptype: 'treeviewdragdrop',
		           dragText:'{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}',
		           dropZone:{
		        	   invalidHandleIds:{root:true}
		        	   
		           }
		        }
		    },

	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: '<div style="text-align:center">Nom</div>',
	           sortable: false,
	           draggable:false,
	           menuDisabled:true,
	           dataIndex: 'template_name',
	           width:250,
	           fixed: true
	        },{
	            text: 'Template associ&eacute;',
	            dataIndex: 'templateRef',
	            sortable: false,
	            align:'center',
		       draggable:false,
		       menuDisabled:true,
		       fixed: true
	        },
	        {
	            xtype:'actioncolumn', 
	            width:50,
	            align:'center',
	            sortable:false,
	            draggable:false,
		           menuDisabled:true,
	            items: [{
	                icon: '/admin/img/icons/pencil.png',  // Use a URL in the icon config
	                tooltip: 'Editer',
	                scope:this,
	                handler: function(grid, rowIndex, colIndex) {
	                    var rec = grid.getStore().getAt(rowIndex);
	                   this.openAddTemplateForm(rec);
	                }
	            },{
	                icon: '/admin/img/icons/delete.png',
	                tooltip: 'Supprimer',
	                scope:this,
	                handler: function(tree, rowIndex, colIndex) {
	                    var rec = tree.getStore().getAt(rowIndex);
	                   
	                    if(rec.hasChildNodes())return Ext.Msg.alert('Suppression d\'un template','Vous ne pouvez pas supprimer ce template car il a des templates enfants');
	                    
	                    Ext.Msg.confirm('Suppression d\'un template','Souhaitez-vous supprimer ce template ?<br />Cela peut entrainer des probl&egrave;mes dans la gestion de contenu.', function(btn){
	                    	if(btn!='yes') return;
	                    	
	                    	this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_TemplateMapper',APICall:'deleteTemplate', id_template:rec.get('id_template')}, function(){
	                    		
	                    		if(rec!=this.selectedTemplate||!this.selectedTemplate) return rec.parentNode.removeChild(rec);
	                    		
	                    	this.selectedTemplate=rec.parentNode;
	                    	
	                    	var tree=Ext.getCmp(this.selectedTemplate.data.treeRef);
	                    	tree.getSelectionModel().select(this.selectedTemplate);
	                    	
	                    		rec.parentNode.removeChild(rec);
	                    		
	                    		
		                    		
	                    		
	                    	}.bind(this))
	                    	
	                    	
	                    	
	                    }, this)
	                    
	                    
	                }                
	            }]
	        }

	        ],
	        listeners:{
	        	scope:this,
	        	itemClick:function(view, record){
	        		tree.down('button[iconCls=addBtn]').setDisabled(false);
	        		this.selectedTemplate=record;
	        		
	        	},
	        	itemmove:this.moveNode
	        	
	        }
	    });
	    
	    /*
	     * tab gabarits
	     */
	    

		var store = Ext.create('Ext.data.Store', {
		    model: 'templateRefModel',
		    autoLoad:true,
		    listeners:{
		    	scope:this,
		    	load:function(st){
		    	//console.log(st);
		    	}
		    	
		    }
		    
		});

	    this.gabaritStore=store;
		
		
	    
	    
	    var tabgabarit=Ext.create('Ext.grid.Panel',{title:'Gestion des gabarits', store:store, 
	    	tbar:[{text:'Ajouter', iconCls:'addBtn', scope:this, handler:function(){this.openEditGabaritForm(null);}}],
	    	bodyStyle:'cursor:pointer',
	    	columns:[
	                 {dataIndex:'templateRef', header:'Nom du gabarit',align:"center",sortable:true, draggable:false,menuDisabled:true},
	                 {dataIndex:'description', header:'<div style="text-align:center">Descriptif</div>',sortable:true, draggable:false,menuDisabled:true},
	                 {dataIndex:'numFields', header:'Champs',align:"center",sortable:true, draggable:false,menuDisabled:true},
	                 {
	     	            xtype:'actioncolumn', 
	     	            width:50,
	     	            align:'center',
	     	            sortable:false,
	     	            draggable:false,
	     		           menuDisabled:true,
	     	            items: [{
	     	                icon: '/admin/img/icons/pencil.png',  // Use a URL in the icon config
	     	                tooltip: 'Editer',
	     	                scope:this,
	     	                handler: function(grid, rowIndex, colIndex) {
	     	                    var rec = grid.getStore().getAt(rowIndex);
	     	                    this.openEditGabaritForm(rec);
	     	                   
	     	                }
	     	            },{
	     	                icon: '/admin/img/icons/delete.png',
	     	                tooltip: 'Supprimer',
	     	                scope:this,
	     	                handler: function(grid, rowIndex, colIndex) {
	     	                    var rec = grid.getStore().getAt(rowIndex);

	     	                   
	    	                    Ext.Msg.confirm('Suppression d\'un gabarit','Souhaitez-vous supprimer ce gabarit ?<br />Cela peut entrainer des probl&egrave;mes dans la gestion de contenu.', function(btn){
	    	                    	if(btn!='yes') return;
	    	                    	
	    	                    	this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_TemplateMapper',APICall:'deleteTemplateRef', id_templateRef:rec.get('id_templateRef')}, function(){
	    	                    		grid.getStore().remove(rec);
	    	                    	}.bind(this))
	    	                    	
	     	                    
	     	                    
	     	                }, this);
	     	                }
	     	            }]}]});
		
	    var tabs = Ext.create('Ext.tab.Panel', {
	    	  height:'100%',
	    	  border:false,
	    	    activeTab: 0,
	    	    items:[tree, tabgabarit]
	    	}
	    	);
	    
	    this.centerRegion.add(tabs);
	    
	    
	},
	openEditGabaritForm:function(record){
		
		
		
		Ext.define('fieldModel',{extend: 'Ext.data.Model',
		    fields: [
		             {type: 'string', name: 'title'},
				        {type: 'string', name: 'name'}
				    ]});
	

	var fieldTypeStore = Ext.create('Ext.data.Store', {
	    model: 'fieldModel',
	    data: this.fieldsArray,
	    sorters: [
	              {
	                  property : 'title',
	                  direction: 'ASC'
	              }]
	});
		
		
		Ext.define('fieldType',{extend: 'Ext.data.Model',
		    fields: [{type: 'string', name: 'name'},{type: 'string', name: 'title'}]});
	

	var storeType = Ext.create('Ext.data.Store', {
	    model: 'fieldType',
	    autoLoad:true,
	    data:  [{name:'folder', title:'Répertoire'}, {name:'page', title:'Page'}],
	    sorters: [
	              {
	                  property : 'title',
	                  direction: 'ASC'
	              }]
	              
	});

	var typeCombo = Ext.create('Ext.form.field.ComboBox', {
	    fieldLabel: 'Type de gabarit',
	    displayField: 'title',
	    valueField:'name',
	    name:'type',
	    allowBlank:false,
	    store: storeType,
	    queryMode: 'local',
	    typeAhead: true
	});
		

	Ext.define('templateFieldModel', {
	    extend: 'Ext.data.Model',
	    fields: [
	        {type: 'int', name: 'id_field'},
	        {type: 'string', name: 'field_type'},
	        {type: 'boolean', name: 'compulsary'},
	        {type: 'string', name: 'templateRef'},
	        {type: 'string', name: 'label'},
	        {type: 'int', name: 'ordre'},
	        {type: 'string', name: 'field_name'},
	        {type: 'string', name: 'label'},
	        {name:'extra_params', convert:function(v){

	        	//if(v==null||v.empty()) return [];
	        	return (v);
	        	
	        }}
	    ],
	    proxy: {
	           type: 'ajax',
	           reader: {
	                type: 'json',
	                root: 'result'
	            },
	           url: '/admin/getjsondata/format/json',
	           actionMethods:'post',
	           extraParams:{API:"Application_Model_TemplateMapper", APICall:"getTemplateFields", templateRef:record?record.get('templateRef'):null}
	        }
	});
	
	var storeFields= Ext.create('Ext.data.Store', {
	    model: 'templateFieldModel',
	    autoLoad:true,
	    listeners:{
	    	scope:this,
	    	add:this.updateFieldStoreState,
	        update:this.updateFieldStoreState,

	        	remove:this.updateFieldStoreState
	        
	    }
	              
	});
	
	var grid=Ext.create('Ext.grid.Panel',{title:'Champs du gabarit', store:storeFields, 
		width:400,
		region:'east',
		tbar:[{iconCls:"addBtn", text:"Ajouter", scope:this, handler:function(){
			this.openFieldsForm(null, storeFields);
			
		}}],
		viewConfig:{
		plugins: {
	           ptype: 'gridviewdragdrop',
	           dragText:'{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}'
	        }
		},
		columns:[
		         {dataIndex:'label', header:'Label', sortable:false, draggable:false,menuDisabled:true},
		         {dataIndex:'field_name', header:'Nom du champ', sortable:false, draggable:false,menuDisabled:true},
		         {dataIndex:'field_type', header:'Type de champ', sortable:false, draggable:false,menuDisabled:true, renderer:function(v, record){
		        	 
		        	var index=fieldTypeStore.find('name', v);
		        	if(index==-1) return;
		        	
		        	rec=fieldTypeStore.getAt(index);
		        	
		        	 return rec.get('title');
		        	 
		         }.bind(this)},
		         {
		             xtype: 'booleancolumn', 
		             text: 'Obl.',
		             width:40,
		             fixed:true,
		             sortable:false, draggable:false,menuDisabled:true,
		             qtip:'Champ obligatoire',
		             trueText: '<img src="/admin/img/icons/accept.png" />',
		             falseText: '<img src="/admin/img/icons/stop.png" />',
		             dataIndex: 'compulsary'},
		             {
		     	            xtype:'actioncolumn', 
		     	            width:50,
		     	            align:'center',
		     	            sortable:false,
		     	            draggable:false,
		     		           menuDisabled:true,
		     	            items: [{
		     	                icon: '/admin/img/icons/pencil.png',  // Use a URL in the icon config
		     	                tooltip: 'Editer',
		     	                scope:this,
		     	                handler: function(grid, rowIndex, colIndex) {
		     	                    var rec = grid.getStore().getAt(rowIndex);
		     	                 
		     	                    this.openFieldsForm(rec, grid.getStore());
		     	                    
		     	                   
		     	                }
		     	            },{
		     	                icon: '/admin/img/icons/delete.png',
		     	                tooltip: 'Supprimer',
		     	               getClass:function(v, metadata, record, rowIndex, colIndex, store){
		     	            	   
		     	            	 
		     	            	   
		     	               },
		     	                
		     	                scope:this,
		     	                handler: function(grid, rowIndex, colIndex) {
		     	                    var rec = grid.getStore().getAt(rowIndex);
		     	                   
		     	                   Ext.Msg.confirm('Suppression d\'un champ','Souhaitez-vous supprimer ce champ ?<br />Cela peut entrainer des probl&egrave;mes dans la gestion de contenu.', function(btn){
		   	                    	if(btn!='yes') return;
		   	                    	
		   	                    	this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_TemplateMapper',APICall:'deleteTemplateFields', id_field:rec.get('id_field')}, function(){
	   	                    		grid.getStore().remove(rec);
		   	                    		
		   	                    		
		   		                    		
		   	                    		
		   	                    	}.bind(this))
		   	                    	
		   	                    	
		   	                    	
		   	                    }, this)
		     	                    
		     	                    
		     	                }                
		     	            }]}

		         
		         ]})
	
		var form= Ext.create('Ext.form.Panel',{
			trackResetOnLoad:true,
			width:380,
			margin:5,
			border:false,
			id:'fieldsGrid',
			
			region:'center',
			bodyStyle:'background:transparent',
			defaults:{
				border:false,
					fieldDefaults: {
				        labelAlign: 'left',
				        labelWidth: 100,
				        labelStyle:'text-align:right'
				    },
				    width:330
				    },
			items:[
			       {xtype:'textfield',name:'templateRef', allowBlank:false, fieldLabel:'Nom du gabarit *',readOnly:record?true:false,regex:/^[a-zA-Z]+$/, regexText:'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques', minLength:3 },
			       {xtype:'textfield',name:'callback', allowBlank:true, fieldLabel:'Callback administration',regex:/^[a-zA-Z\.|]+$/, regexText:'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques', minLength:3 },
			       {xtype:'textarea', name:'description', allowBlank:false, fieldLabel:'Description'},
			       typeCombo,
			       {xtype:'checkbox', inputValue:1,name:"publiable", fieldLabel:"Publiable"}],
			       listeners:{
			                  scope:this,
			                  validitychange:function(form, isValid){
			              		
			              		var saveBtn = form.owner.up('window').down('button[action=save]');
			              		
			              		storeDirty=storeFields.getUpdatedRecords().length>0||storeFields.getNewRecords().length>0;
			              		
			              		if(!form.isDirty()&&!storeDirty) return saveBtn.setDisabled(true);
			              		saveBtn.setDisabled(!isValid);
			              		
			              	},
			              	dirtychange:function(form, dirty){
			              		
			              		storeDirty=storeFields.getUpdatedRecords().length>0||storeFields.getNewRecords().length>0
			              			            		
			              		var saveBtn = form.owner.up('window').down('button[action=save]');
			              		if((dirty||storeDirty)&&form.isValid())return saveBtn.setDisabled(false);
			              		saveBtn.setDisabled(true);
			              		
			              		
			              	}
			       }
		});
		
		var win = Ext.create("Ext.window.Window",{
			modal:true,
			width:780,
			height:300,
			border:false,
			
			buttonAlign:'center',
			layout:'border',
			title:(record ? 'Modifier un':'Nouveau')+' gabarit',
			items:[form, grid],
			buttons:[{text:'Enregistrer', action:'save', disabled:true, scope:this, handler:function(btn){
				
				values=form.getForm().getValues();
				
				var storeData=[];
				
				var array=storeFields.getRange(0, storeFields.getCount()-1);
				
				array.each(function(elt, index){
					
					elt.data.templateRef=values.templateRef;
					elt.data.ordre=index;
					elt.data.compulsary = elt.data.compulsary==true ?"1":"0";
					elt.data.ordre=''+elt.data.ordre+'';
					elt.data.id_field=''+elt.data.id_field+'';
					elt.data.extra_params = elt.data.extra_params==null||elt.data.extra_params=="" ?"null":Ext.JSON.decode(elt.data.extra_params);
			
					storeData.push(elt.data);
					
				},this);
				
				
				values.fields=Ext.JSON.encode(storeData);
				values.API='Application_Model_TemplateMapper';
				values.APICall='addOrModifyTemplateRef'
				
					values.id_templateRef=record? record.get('id_templateRef'):0;
					
				
				
				
				this.ajaxRequest('/admin/getjsondata/format/json', values, function(response){
					this.gabaritStore.load();
					
					btn.up('window').close();
					
				}.bind(this));
				
				
			}},{'text':'Annuler', handler:function(){
				this.up('window').close();
				
			}}]
			
		});
		
		
		if(record) form.loadRecord(record);
		
		win.show();
		
	},
	updateFieldStoreState:function(store){
		if(store.getUpdatedRecords().length>0||store.getNewRecords().length>0)Ext.getCmp('fieldsGrid').fireEvent('dirtychange',Ext.getCmp('fieldsGrid').getForm(),Ext.getCmp('fieldsGrid').getForm().isDirty());
		
	},
	openFieldsForm:function(record, storeFields){
		
		
		Ext.define('fieldModel2',{extend: 'Ext.data.Model',
		    fields: [
		             {type: 'string', name: 'title'},
				        {type: 'string', name: 'name'},
				        {type:'bool', name:'hasExtraParams'},
				        {name:'extraParamsConfig'}
				    ]});
		
	var fieldTypeStore = Ext.create('Ext.data.Store', {
	    model: 'fieldModel2',
	    data: this.fieldsArray,
	    sorters: [
	              {
	                  property : 'title',
	                  direction: 'ASC'
	              }]
	});
	
	
	//if(record)extraItems=this.displayExtraParams(fieldTypeStore,record.get('field_type'), record);
	
	var fieldsCombo = Ext.create('Ext.form.field.ComboBox', {
	    fieldLabel: 'Type de champs',
	    displayField: 'title',
	    valueField:'name',
	    name:'field_type',
	    store: fieldTypeStore,
	    queryMode: 'local',
	    typeAhead: true
	});
	
	var formFields = Ext.create('Ext.form.Panel',{
		border:false,
		bodyStyle:'background:transparent',
		trackResetOnLoad:true,
		margin:5,
		defaults:{
			width:350,
			allowBlank:false
		},
		fieldDefaults:{
			labelWidth: 100,
	        labelStyle:'text-align:right'
			
		},
		items:[{xtype:'textfield', name:'label', fieldLabel:'label'}, 
		       {xtype:'textfield', name:'field_name', fieldLabel:'Nom du champ', validator:function(value){
		    	   var store=storeFields;
		    	   
		    	   var index = store.find('field_name', value, 0, false,true,true);
		    	   
		    	   if(index==-1) return true;
		    	   
		    	   
		    	   
		    	   var rec=store.getAt(index);
		    	   
		    	   if(rec!=record) return 'Le nom du champ doit &ecirc;tre unique';
		    	   return true;
		    	   
		    	   
		       },regex:/^[a-zA-Z]+$/, regexText:'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques', minLength:3},
		       fieldsCombo, 
		       {xtype:'checkbox', autoWidth:true, name:'compulsary', inputValue:1, fieldLabel:'Obligatoire '},
		       {xtype:'textarea', name:'extra_params', fieldLabel:'Param&egrave;tres optionnels', allowBlank:true, validator:function(value){
		    	   if(value.empty()||value==null)return true;
		    	   
		    	   if(Ext.JSON.decode(value, true)==null) return 'JSON mal form&eacute;';
		    	   return true;
		    	   
		       }}],
		buttons:[{text:'Enregistrer', action:'save', disabled:true, scope:this, handler:function(btn){
			
			var result = formFields.getForm().getValues();
			
			if(result.compulsary==1)result.compulsary=true;
			else result.compulsary=false;
			
			if(record){
				record.beginEdit();
					for(key in result){
						record.set(key, result[key]);
					}
					
					record.endEdit();
					record.commit();
					
				}
				else {
					
					var newRecord=Ext.ModelManager.create(result, 'templateFieldModel');
					storeFields.add(newRecord);
					
				}
			
					btn.up('window').close();
			
		}}, {text:'Fermer', handler:function(){
			this.up('window').close();
			
		}}],
		listeners:{
        	scope:this,
        	validitychange:function(form, isValid){
        		
        		var saveBtn = form.owner.down('button[action=save]');
        		
        		if(!form.isDirty()) return saveBtn.setDisabled(true);
        		saveBtn.setDisabled(!isValid);
        		
        	},
        	dirtychange:function(form, dirty){

        			            		
        		var saveBtn = form.owner.down('button[action=save]');
        		if(dirty&&form.isValid())return saveBtn.setDisabled(false);
        		saveBtn.setDisabled(true);
        		
        		
        	}

        	
        }
		
	});
		
		
	var win = Ext.create('Ext.window.Window',{
		title:(record?'Modifier un ':'Nouveau ')+'champ',
		width:400,
		modal:true,
		items:formFields
		
	});
	
	win.show();
	
	if(record)formFields.loadRecord(record);
	
	},
	
	displayExtraParams:function(store,fieldType, record){
		
				
		var index= store.find('name',fieldType,0,false, true, true);
		
		var fieldData=store.getAt(index);
		
		if(!fieldData.get('hasExtraParams')) return;
		
		var extraParams =[]; 
		
		fieldData.get('hasExtraParamsConfig').each(function(field){
			console.log(field);
			
		}, this)
		
		
		
		
		
	},
	
	moveNode:function(node,oldParent, newParent, index){

		var items=newParent.childNodes;
    	
		node.beginEdit();
		
		node.set('parent_id',newParent.get('id_template'));
		node.endEdit();
		node.commit();
    	var queryString="";
    	items.each(function(it,index){
    		queryString+='items['+index+']='+it.get('id_template')+'&';
    		
    		
    	},this);
    	
    	
    	this.sortTpl(newParent);
    	
    	queryString+='&parentID='+newParent.get('id_template');
    	
    	this.ajaxRequest('/admin/getjsondata?format=json',queryString+'&API=Application_Model_TemplateMapper&APICall=moveTemplate');	
		
		
	},
	sortTpl:function(node){
		node.sort(function(a,b){
    		return a.get('text')>b.get('text');
    		
    		
    	}, true, true);
		
	},
	openAddTemplateForm:function(record){
	
		if(record==undefined) record=null;
		

		var store = Ext.create('Ext.data.Store', {
		    model: 'templateRefModel',
		    autoLoad:true,
		    listeners:{
		    	scope:this,
		    	load:function(st){
		    	if(record) Ext.getCmp('formTpl').loadRecord(record);
		    	}
		    	
		    }
		    
		});

		var templateCombo = Ext.create('Ext.form.field.ComboBox', {
		    fieldLabel: 'Gabarit',
		    emptyText:'veuillez choisir un gabarit',
		    displayField: 'templateRef',
		    allowBlank:false,
		    store: store,
		    name:'templateRef',
		   
		    queryMode: 'local',
		    typeAhead: true
		    
		});
		
		var form = Ext.create('Ext.form.Panel',{
			bodyStyle:'background:transparent',
			border:false,
			id:'formTpl',
			margin:5,
			defaults:{
				width:350
			},
			trackResetOnLoad:true,
			 listeners:{
		        	scope:this,
		        	validitychange:function(form, isValid){
		        		
	            		var saveBtn = form.owner.down('button[action=save]');
		        		
	            		if(!form.isDirty()) return saveBtn.setDisabled(true);
	            		saveBtn.setDisabled(!isValid);
	            		
	            	},
	            	dirtychange:function(form, dirty){

	            			            		
	            		var saveBtn = form.owner.down('button[action=save]');
	            		if(dirty&&form.isValid())return saveBtn.setDisabled(false);
	            		saveBtn.setDisabled(true);
	            		
	            		
	            	}

		        	
		        },
			 fieldDefaults: {
			        labelAlign: 'left',
			        labelWidth: 100,
			        labelStyle:'text-align:right'
			    },
			items:[{xtype:'textfield', fieldLabel:'Intitul&eacute;', allowBlank:false, name:'template_name'},templateCombo, 
			       {xtype:'hiddenfield', name:'id_template'}],
			buttons:[{text:'Enregistrer', action:'save', disabled:true, scope:this, handler:function(btn){
				var params = form.getForm().getValues();
				
				if(!record)params.parent_id = this.selectedTemplate&&this.selectedTemplate.get('id_template')?this.selectedTemplate.get('id_template'):0;
				
				
				
				params.API = 'Application_Model_TemplateMapper';
				params.APICall = 'addOrModify';
				
				this.ajaxRequest('/admin/getjsondata/format/json',params, function(response){
					
					result=response.result;
					
					
					
					if(record){
					record.beginEdit();
						for(key in result){
							record.set(key, result[key]);
						}
						record.set('iconCls',result.type);
						record.endEdit();
						record.commit();
					}
					else {
						result.isLeaf=true;
						result.children=[];
						result.iconCls=result.type;
						var newNode=Ext.ModelManager.create(result, 'siteAdminTreeModel');
						newNode.set('isLeaf',true);
						if(!this.selectedTemplate) this.selectedTemplate= Ext.getCmp('treeTpl').getRootNode();

						
						this.selectedTemplate.appendChild(newNode);
					}
					
					this.sortTpl(this.selectedTemplate);
					
					this.selectedTemplate.expand();
					
					var win = btn.up('window');
					win.close();
				}.bind(this));
				
				
			}}, {text:'Annuler', action:'save',handler:function(btn){
				var win = btn.up('window');
				win.close();
				
			}}]
			
		});
		
		var win = Ext.create('Ext.window.Window', {
			title:(record?'Modifier un ':'Nouveau ')+'template',
			modal:true,
			items:form
			
			
		})
		
		win.show();
		
	},
	
	displayUsersForm:function(record){
		this.initTreeNode(record);
		
		Ext.define('adminUserModel', {
		    extend: 'Ext.data.Model',
		    fields: [
		             {name:'text', type:'string', convert:function(v, record){
		            	 if(record.data.type=="user") return record.data.firstname+' '+record.data.lastname;		            	 
//		            	 var extraText = record.data.children.length==0?"aucun utilisateur":record.data.children.length+' utilisateur'+(record.data.children.length>1?"s":"");
		            	 
		            	 return "<strong>"+record.data.group_name+'</strong>';// ('+extraText+')';
		            	 
		             }},
		             'firstname','lastname','group_name',{name:'id_user_group', type:'int'},
		             {name:'isLeaf'},
		             'children','type',{name:'id_user', type:'int'},
		             {name:'iconCls', mapping:'type', convert:function(v){
		            	 
		            	 return v+'Icon';
		            	 
		             }},
		             {name:'superadmin', type:'boolean'},
		             'pseudo',
		             'email',{name:'active', type:'boolean'},{name:'creation_date', type:'date', dateFormat:'Y-m-d H:i:s'}, {name:'last_connexion', type:'date', dateFormat:'Y-m-d H:i:s'}

		    ],
		    proxy: {
		           type: 'ajax',
//		           reader: {
//		                type: 'json',
//		                root: 'result'
//		            },
		           url: '/admin/getjsondata?format=json',
		           actionMethods:'post',
		           extraParams:{API:"Application_Model_AdminUsersMapper", APICall:"getUsers"}
		        }

		});
		
		
		 var store = Ext.create('Ext.data.TreeStore', {
		        model: 'adminUserModel',
		        autoLoad:true,
		        sorters: [
		                  {
		                      property : 'superadmin',
		                      direction: 'DESC'
		                  },
		                  {
		                      property : 'group_name',
		                      direction: 'ASC',
		                      transform:function(value){
		                    	  return value.toLowerCase();
		                    	  
		                      }
		                  },
		                  {
		                      property : 'firstname',
		                      direction: 'ASC',
		                      transform:function(value){
		                    	  return value.toLowerCase();
		                    	  
		                      }
		                  }
		              ]
		    });
		
		
		 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		        groupHeaderTpl: '{name} ({rows.length} utilisateur{[values.rows.length > 1 ? "s" : ""]})'
		    });
		 
		 
		 var userGrid = Ext.create('Ext.tree.Panel', {
		        store: store,
		        rootVisible: false,
		        root:{text:'.'},
		        tbar:[{text:'Nouveau',iconCls:'addUserGroupBtn', tooltip:'Ajouter un groupe utilisateur', scope:this,handler:function(btn){
		        	var userGrid=btn.up('treepanel');
		        	this.openGroupForm(null, userGrid.getView());
		        	
		        }},'-',{text:'Nouveau', tooltip:'Ajouter un utilisateur',iconCls:'addUserBtn', scope:this, handler:function(btn){
		        	var userGrid=btn.up('treepanel');
		        	
		        	this.openUserForm(null, userGrid.getView())}}],
//		        features: [groupingFeature],
		        columns:[{
		            xtype: 'treecolumn', //this is so we know which column will show the tree
		            menuDisabled:true,
		            width:300,
		            fixed:true,
		            sortable: false,
		            dataIndex: 'text'
		        },
		        {
		        	dataIndex:'creation_date',
		        	sortable:false, draggable:false,menuDisabled:true,
			         fixed:true, width:150,
			         text:'Date de cr&eacute;ation',
			         align:'center',
			         renderer:function(v,meta,record){
			            	 if(v==null) return "";
			            	 return Ext.Date.format(v,'d/m/Y'); 
			        	
			        }
		        	
		        },
		        {
		        	dataIndex:'last_connexion',
		        	sortable:false, draggable:false,menuDisabled:true,
			         fixed:true, width:150,
			         text:'Derni&egrave;re connexion',
			         align:'center',
			         renderer:function(v,meta,record){
			            	 if(v==null) return "";
			            	return Ext.Date.format(v,'d/m/Y \\&\\a\\gr\\ave; H:i');
			        	
			        }
		        	
		        }
		        ,
		        {dataIndex:'active',
		         sortable:false, draggable:false,menuDisabled:true,
		         fixed:true, width:50,
		         text:'Statut',
		         align:'center',
		         renderer:function(v,meta,record){
		            	 if(v==null) return "";
		            	 if(v==1) return'<div style="width:16px; margin:auto"><img src="/admin/img/icons/accept.png" /></div>';
		            	 return '<div style="width:16px; margin:auto"><img src="/admin/img/icons/stop.png" /></div>';
		         }
		        },
		        {
	 	            xtype:'actioncolumn', 
	 	            width:20,
	 	            align:'center',
	 	            sortable:false,
	 	            draggable:false,
	 	            fixed:true,
	 		        menuDisabled:true,
	 	            items: [{
	 	               
	 	                tooltip: 'Gestion des droits',
	 	                scope:this,
	 	                
	 	               getClass:function(v, meta, record){
	 	            	   
	 	            	   
//		 	                console.log();
	 	            	  if(record.get('type')=='group'&&record.get('superadmin')==1||record.parentNode.get('superadmin')==true) meta.attr="style='display:none'";         	   
	 	            	  else meta.css='actionGroup rights';
		 	                	
		 	                	
		 	                },
	 	                
	 	                handler: function(grid, rowIndex, colIndex) {
	 	                	
	 	                	
	 	                    var rec = grid.getStore().getAt(rowIndex);
	 	                   if(rec.get('superadmin')==1) return;
	 	                    return this.editRights(rec, grid);
	 	                   
	 	                    
	 	                }
	 	            }]},
		        {
	 	            xtype:'actioncolumn', 
	 	            width:20,
	 	            align:'center',
	 	            sortable:false,
	 	            draggable:false,
	 	            fixed:true,
	 		        menuDisabled:true,
	 	            items: [{
	 	               
	 	                tooltip: 'Editer',
	 	                scope:this,
	 	                
	 	               getClass:function(v, meta, record){
		 	                
	 	            	  if(record.get('type')=='group'&&record.get('superadmin')==1) meta.attr="style='display:none'";         	   
	 	            	  else if(record.get('type')=='group') meta.css='actionGroup edit';
		 	                	
		 	                	else meta.css='actionUser edit';
		 	                },
	 	                
	 	                handler: function(grid, rowIndex, colIndex) {
	 	                    var rec = grid.getStore().getAt(rowIndex);
	 	                  
	 	                    if(rec.get('type')=='user')return this.openUserForm(rec, grid);
	 	                   if(rec.get('superadmin')==1) return;
	 	                    
	 	                    return this.openGroupForm(rec, grid);
	 	                    
	 	                }
	 	            }]},
	 	           {
		 	            xtype:'actioncolumn', 
		 	            width:20,
		 	            align:'center',
		 	            sortable:false,
		 	            draggable:false,
		 	            fixed:true,
		 		        menuDisabled:true,
		 	            items: [{
		 	               
		 	                tooltip: 'Supprimer',
		 	                scope:this,
		 	                
		 	               getClass:function(v, meta, record){
			 	                
		 	            	  if(record.get('type')=='group'&&record.get('superadmin')==1) meta.attr="style='display:none'";         	   
		 	            	  else if(record.get('type')=='group') meta.css='actionGroup delete';
			 	                	
			 	                	else meta.css='actionUser delete';
			 	                },
		 	                
		 	                handler: function(grid, rowIndex, colIndex) {
		 	                    var rec = grid.getStore().getAt(rowIndex);
		 	                   if(rec.get('superadmin')==1) return;
		 	                    return this.deleteUserGridElement(rec, grid);
		 	                   
		 	                    
		 	                }
		 	            }]}
		        ]

		 });
		        
		 
		var tabs = Ext.create('Ext.tab.Panel', {
	    	  height:'100%',
	    	  border:false,
	    	    activeTab: 0,
	    	    items:[userGrid]
	    	}
	    	);
	    
	    this.centerRegion.add(tabs);
		
		
	},
	
	openUserForm:function(record, grid){
		var store=grid.getStore();
		
		Ext.define('groupModel',{extend: 'Ext.data.Model',
		    fields: [{type: 'int', name: 'id_group'},{type: 'string', name: 'title'}]});
	
		arrayGroup=[];

		
		store.node.childNodes.each(function(node){
			arrayGroup.push({id_user_group:node.get('id_user_group'), title:node.get('group_name')});
			
		}, this);
		

	var storeGroup = Ext.create('Ext.data.Store', {
	    model: 'groupModel',
	    autoLoad:true,
	    data:  arrayGroup,
	    sorters: [
	              {
	                  property : 'title',
	                  direction: 'ASC'
	              }]
	              
	});

	
	var groupCombo = Ext.create('Ext.form.field.ComboBox', {
	    fieldLabel: 'Groupe',
	    displayField: 'title',
	    valueField:'id_user_group',
	    name:'id_user_group',
	    allowBlank:false,
	    store: storeGroup,
	    queryMode: 'local',
	    typeAhead: true
	});
		
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
			       {xtype:'textfield', fieldLabel:'Email *', readOnly:record!=undefined,name:'email', allowBlank:false, minLength:3, vtype:'email'},
			       groupCombo,
			       {xtype:'checkbox', fieldLabel:'Actif', name:'active', inputValue:1},
			       {xtype:'fieldset', title:!record?'Mot de passe':'Nouveau mot de passe', collapsible:true, collapsed:record!=undefined, width:330,
			    defaults:{
			    	width:300
			    	
			    },
			    items:[
			           {xtype:'textfield', labelWidth: 90,fieldLabel:'Mot de passe', name:'newPass',minLength:6, inputType:'password',
			        	   validator:function(value){
			        		   
			        		   form.getForm().findField("sendMail").hide();
			        		   
			        		  if(form.getForm().findField('newPassConfirm').getValue().empty()&&value.empty()){
			        			  
			        			  form.getForm().findField('newPassConfirm').clearInvalid();
			        			  return true;
			        		  }
			        		  if(form.getForm().findField('newPassConfirm').getValue().empty())return "Veuillez saisir la v&eacute;rification de votre mot de passe";
			        		   if(form.getForm().findField('newPassConfirm').getValue()!=value) return "Les mots de passe ne correspondent pas";
			        		   form.getForm().findField('newPassConfirm').clearInvalid();
			        		   form.getForm().findField("sendMail").show();
			        		   return true;
			        	   }, scope:this},
			           {xtype:'textfield',labelWidth: 90, fieldLabel:'V&eacute;rification', name:'newPassConfirm',minLength:6, inputType:'password',
			        		   validator:function(value){
			        			   
			        			   form.getForm().findField("sendMail").hide();
	    			        		  if(form.getForm().findField('newPass').getValue().empty()&&value.empty()){
	    			        			  form.getForm().findField('newPass').clearInvalid();
	    			        			  return true;
	    			        		  }
	    			        		  if(form.getForm().findField('newPass').getValue().empty())return "Veuillez saisir votre mot de passe";
	    			        		   if(form.getForm().findField('newPass').getValue()!=value) return "Les mots de passe ne correspondent pas";
	    			        		   form.getForm().findField('newPass').clearInvalid();
	    			        		   
	    			        		   form.getForm().findField("sendMail").show();
	    			        		   return true;
	    			        		   
	    			        	   }, scope:this},
	    			        	   {xtype:"checkbox", name:"generatePass", inputValue:1, fieldLabel:"G&eacute;n&eacute;rer",autoWidth:true, 
	    			        		   scope:this, 
	    			        			   handler:function(tf, checked){
	    			        				   
	    			        				    form.getForm().findField("newPass").setDisabled(checked);
	    			        				    form.getForm().findField("newPassConfirm").setDisabled(checked);
	    			        				    if(checked) {
	    			        				    	form.getForm().findField('newPass').setValue(null);
	    			        				    	 form.getForm().findField('newPassConfirm').setValue(null);
	    			        				    	 form.getForm().findField('newPass').clearInvalid();
	    			        				    	 form.getForm().findField('newPassConfirm').clearInvalid();
	    			        				    	 
	    			        				    	return form.getForm().findField("sendMail").show();
	    			        				    }
	    			        				    form.getForm().findField("sendMail").hide();
	    			        				   
	    			        			   }},
	    			        	   {xtype:"checkbox", name:"sendMail", inputValue:1, fieldLabel:"Envoyer un mail", hidden:record!=undefined,autoWidth:true, checked:!record}
			           
			           ]}
			    
			       ],
			       buttons:[{text:'Enregistrer', disabled:true, action:'submit',
			    	scope:this,
			    	handler:function(btn){
			    		if(!form.getForm().isValid()) return;
			    		
			    	var rec= record;
			    		
			    		var values = form.getForm().getValues();
			    
			    		if(!record&&((values.newPass&&values.newPassConfirm&&(values.newPass.empty()||values.newPassConfirm.empty()))||!values.newPass&&!values.newPassConfirm&&!values.generatePass)) return Ext.Msg.alert('Erreur', 'Vous devez pr&eacute;ciser un mot de passe');

			    		    
			    		
			    	if(record)values.id_user=record.get('id_user');
			    	
			    	values.API="Application_Model_AdminUsersMapper";
			    	values.APICall="addOrModifyUser";
			    	
			    				    	
			    	var action=function(){
			    		
			    		
			    		this.ajaxRequest('/admin/getjsondata/format/json',values, function(response){
			    	
			    		
			    		result = response.result;
			    		
			    		record=rec;
			    		var initialGroupId=null;
			    		
			    		if(record){
			    			
			    			initialGroupId=record.get('id_user_group');
			    			
			    			record.beginEdit();
			    		
						for(key in result){
							record.set(key, result[key]);
						}
						
						record.set('text', record.get('firstname'+' '+record.get('lastname')));
						
						record.endEdit();
						record.commit();
						
						
			    		}
			    		else{
			    			
			    			result.isLeaf=true;
							result.children=[];
							
							
							
							var record=Ext.ModelManager.create(result, 'adminUserModel');
							
							record.beginEdit();
							record.set('type', 'user');
							record.set('text', record.get('firstname'+' '+record.get('lastname')));
							record.set('iconCls','user');
							record.endEdit();
							
							record.commit();
			    		}
			    		
			    		
			    		initialGroup= record.get('id_user_group');
		    			
		    			var parentIndex=store.findBy(function(record,id){
		    				if(record.get('id_user_group')==values.id_user_group&&record.get('type')=='group') return true;
		    				return false;
		    				
		    			}, this)
		    			
		    			var newParent=store.getAt(parentIndex);	    			
		    			if(newParent.get('id_user_group')!=initialGroupId)newParent.appendChild(record);
		    			
		    			 var win = btn.up('window');
				    	   win.close();
		    			
			    	}.bind(this));}.bind(this);
			    	
			    	if(record&&record.get('id_user_group')!=values.id_user_group)return Ext.Msg.show({
					     title:'Modification du groupe utilisateur',
					     msg: 'Attention, le groupe utilisateur a &eacute;t&eacute; modifi&eacute; !<br />'+record.get('firstname')+' '+record.get('lastname')+' h&eacute;ritera par d&eacute;faut des droits par d&eacute;faut de sont nouveau groupe.<br />Souhaitez-vous continuer ?',
					     buttons: Ext.Msg.OKCANCEL,
					     fn:function(btn){
					    	 if(btn=="ok") action();
					    	 
					     },
					     scope:this,
					     icon: Ext.Msg.ERROR
					});
			    	
			    	else action();
			    	
			    	
			    	}
			       }, {text:'Annuler', handler:function(btn){
			    	   var win = btn.up('window');
			    	   win.close();
			    	   
			       }, scope:this}]
			
			
		});
		
		var winContact = Ext.create('Ext.window.Window',{
			title:record?'Modification de l\'utilisateur '+record.get('firstname')+' '+record.get('lastname'):'Nouvel utilisateur',
			modal:true,
			
			width:350,
			items:[form]
			});
		
		winContact.show();
		
		if(record)form.loadRecord(record);
		
	},
	
	openGroupForm:function(rec, grid){

		
		var form = Ext.create('Ext.form.Panel',{
			bodyStyle:'background:transparent',
			margin:5,
			border:false,
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
			bodyStyle:'background:transparent',
			items:[{xtype:'textfield', name:'group_name', fieldLabel:'Nom du groupe'}],
			  buttons:[{text:'Enregistrer', disabled:true, action:'submit',
			    	scope:this,
			    	handler:function(btn){
			    		if(!form.getForm().isValid()) return;
			    		
			    		var record= rec;
			    		
			    		var values = form.getForm().getValues();
			    	if(record)values.id_user_group=record.get('id_user_group');			    	
			    	values.API="Application_Model_AdminUsersMapper";
			    	values.APICall="addOrModifyUserGroup";
			    	
			    				    	
			    	this.ajaxRequest('/admin/getjsondata/format/json',values, function(response){
			    		
			    		result = response.result;
			    		
			    		var record=rec;
			    					    		
			    		if(record){
			    			record.beginEdit();
			    		
						for(key in result){
							record.set(key, result[key]);
						}
						
						record.set('text', record.get('group_name'));
						
						record.endEdit();
						record.commit();
						
					
						
			    		}
			    		else{
			    			
			    			result.isLeaf=true;
							result.children=[];
							
							
							
							var record=Ext.ModelManager.create(result, 'adminUserModel');
							
							record.beginEdit();
							record.set('type', 'group');
							record.set('text', record.get('group_name'));
							record.set('iconCls','group');
							record.endEdit();
							
							record.commit();
													
							grid.node.appendChild(record);
			    			
			    			
			    		}
			    		
			    				    		
		    			 var win = btn.up('window');
				    	   win.close();
		    			
			    	}.bind(this));
			    					    	}.bind(this)
			       }, {text:'Annuler', handler:function(btn){
			    	   var win = btn.up('window');
			    	   win.close();
			    	   
			       }, scope:this}]
			
			
		});
		
		
		var winContact = Ext.create('Ext.window.Window',{
			title:rec?'Modification du groupe '+rec.get('group_name'):'Nouveau groupe utilisateur',
			modal:true,
		
			width:350,
			items:[form]
			});
		
		winContact.show();
		
		if(rec)form.getForm().loadRecord(rec);
		
		
	},
	deleteUserGridElement:function(rec, grid){
		
		var type=rec.get('type');
		
		if(type=='group'&&rec.childNodes.length>0)return Ext.Msg.show({
		     title:'Suppression d\'un groupe',
		     msg: 'Vous ne pouvez pas supprimer ce groupe car il contient des utilisateurs',
		     buttons: Ext.Msg.OK,
		     icon: Ext.Msg.ERROR
		});

		
		
		if (type=="user"&&rec.parentNode.get('superadmin')==1&&rec.parentNode.childNodes.length==1)return Ext.Msg.show({
		     title:'Suppression d\'un super administrateur',
		     msg: 'Le groupe SuperAdmin doit toujours avoir au moins un utilisateur',
		     buttons: Ext.Msg.OK,
		     icon: Ext.Msg.ERROR
		});
		
		var fn =this.doDeleteUserGridElement.bind(this,rec,grid);
		
		if(type=="user"&&rec.parentNode.get('superadmin')==1&&rec.parentNode.childNodes.length>1){
			msgTitle='Suppression d\'un super administrateur';
			msgContent='Attention, vous allez supprimer un super administrateur.<br />Souhaitez-vous continuer ?';
			
		}else if(type=="user"){
			
			msgTitle='Suppression d\'un utilisateur';
			msgContent='Attention, vous allez supprimer un utilisateur.<br />Souhaitez-vous continuer ?';
		}else{
			msgTitle='Suppression d\'un groupe d\'utilisateurs';
			msgContent='Attention, vous allez supprimer un groupe.<br />Souhaitez-vous continuer ?';
		}
			
			return Ext.Msg.show({
		     title:msgTitle,
		     msg: msgContent,
		     buttons: Ext.Msg.OKCANCEL,
		     fn: function(btn){
		    	 
		    	 if(btn=='ok') fn();
		     },
		     scope:this,
		     
		     icon: Ext.Msg.QUESTION
		}); 
		
	},
	doDeleteUserGridElement:function(rec, grid){
		
		var params={
				type:rec.get('type'),
				id_user_group:rec.get('type')=='group'?rec.get('id_user_group'):null,
				id_user:rec.get('type')=='group'?null:rec.get('id_user'),
				API:'Application_Model_AdminUsersMapper',
				APICall:'deleteAdminElement'
				};
		
		this.ajaxRequest('/admin/getjsondata/format/json',params, function(response){
			rec.remove();
			
			
		}.bind(this))
		
		
		
	},
	editRights:function (rec, grid){
		
		
		
		var data=new Array();
	
		var cmsObj={text:this.cmsClass.panelTitle,moduleName:'CmsClass.Main', type:'plugin',children:[], read:0, write:0, edit:0};
		
		
		
		this.cmsClass.arboPanel.items.each(function(elt, index){
			
		var modelname=elt.view.store.node.modelName;
		var model = Ext.ModelManager.getModel(modelname);
		
		children=this.getCmsTreeNodes(elt.view.store.node.firstChild);
		cmsObj.children.push({text:elt.header.title,moduleName:'CmsClass.Main', type:'tree',plugin:'', rubId:elt.view.store.node.get('id_rubrique'), read:0, write:0, edit:0, children:children})
			
		}, this);
	
		data.push(cmsObj);
		
		
		
		for(pluginName in this.cmsClass.plugins){
		
			plugin = this.cmsClass.plugins[pluginName];
		
		
	
		
		var obj={text:plugin.instance.panelTitle,moduleName:plugin.name, type:'plugin', read:0, write:0, edit:0, children:[]};
		
		if(plugin.rights){
			
			if(plugin.rights.length){
				plugin.rights.each(function(plug){
					plug.moduleName=plugin.name;
					
				}, this);
				
				obj.children=plugin.rights;
				
			}
			else obj.rights=plugin.rights;
			
			
		}
			data.push(obj);
		
	};
	
	Ext.define('rightsModel', {
	    extend: 'Ext.data.Model',
//	    proxy:{
//	    	type:'memory',
//	    	reader:{type:'json', root:'modules'},
//	    	data:{modules:data}
//	    },
	    fields: [
	        
	        {name:'text'},
	        {name:'moduleName'},
	        {name:'plugin'},
	        {type: 'string', name: 'type'},
	        {name:'children',convert:function(v, record){
	        	var children=[];
	        	if(typeof v=="array"||typeof v=="object") return v;
	        	return children;
	        
	        }
	        },
	        {name:'rubId', type:'int'},
	        {name:'isLeaf', mapping:'children', convert:function(v,record){
	    
	        if(record.get('children')==null) return true; 
	        
	        return record.get('children').length==0?true:false;	
	        
	        }
	        },{name:'leaf',mapping:'children', convert:function(v, record){
	        	if(record.get('children')==null) return true; 
		        
		        return record.get('children').length==0?true:false;
	        	
	        }},
	        {name:'iconCls', mapping:'type', convert:function(v){
	        	
	        	
	        	if(v=="folder") return 'folder';
	        	if(v=="page") return 'page';
	        	if(v=="plugin") return 'pluginIcon';
	        	
	        	return 'moduleIcon';
	        	
	        }},
	        {type:'bool', name:'read'},
	        {type:'bool', name:'write'},
	        {type:'bool', name:'edit'}
//	        'rights'
	    ]});
	
	
	var dataModules={modules:data};
	
	store=Ext.create('Ext.data.TreeStore',{
		model:'rightsModel',
		autoLoad:true,
		
		   root:{text:'ok', expanded:true, children:data},
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json'
	        }
	    },
		storeId:'versionStore',
		listeners:{
			scope:this,
			datachanged:function(st){
				
				this.gridRights.up('window').down('button[action=save]').setDisabled(false);
				
			}
			
		}
	  
	  });
	
		
	this.gridRights = Ext.create('Ext.tree.Panel', {
        store: store,
       rootVisible: false,
     
       
        columns: [
            {
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: '<div style="text-align:center">Nom</div>',
	           sortable: false,
	           draggable:false,
	           menuDisabled:true,
	           dataIndex: 'text',
	           width:250,
	           fixed: true
	        }
            ,
            {
                xtype: 'checkcolumn',
                header: 'Voir',
                draggable:false,
 	           menuDisabled:true,
                align:'center',
                fixed:true,
               dataIndex:'read',
                width: 55,
                renderer:function(value, meta,record){
                	
                	//if(record.get('type')=='tree') return;
                	var cssPrefix = Ext.baseCSSPrefix,
                    cls = [cssPrefix + 'grid-checkheader'];

                if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
                	
                },
                listeners:{
                	scope:this,
                	'checkchange':this.rightsCheckChange
                }
            } ,
            {
                xtype: 'checkcolumn',
                header: 'Modifier',
                draggable:false,
 	           menuDisabled:true,
                align:'center',
                fixed:true,
               dataIndex:'write',
                width: 55,
                renderer:function(value, meta,record){
                	
                	//if(record.get('type')=='tree') return;
                	var cssPrefix = Ext.baseCSSPrefix,
                    cls = [cssPrefix + 'grid-checkheader'];

                if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
                	
                },
                listeners:{
                	scope:this,
                	'checkchange':this.rightsCheckChange
                }
            },
            {
                xtype: 'checkcolumn',
                header: 'Cr&eacute;er/Supprimer',
                align:'center',
                draggable:false,
 	           menuDisabled:true,
 	           fixed:true,
               dataIndex:'edit',
                width: 150,
                renderer:function(value, meta,record){
                	
                	//if(record.get('type')=='tree') return;
                	var cssPrefix = Ext.baseCSSPrefix,
                    cls = [cssPrefix + 'grid-checkheader'];

                if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
                	
                },
                listeners:{
                	scope:this,
                	'checkchange':this.rightsCheckChange
                }
            }
        ],
        width: 600,
        height: 300
      
    });
	
	
	var win = Ext.create('Ext.window.Window',{
		items:[this.gridRights],
		modal:true,
		buttons:[{text:'Enregistrer', scope:this, disabled:true, action:"save", handler:function(btn){
			
			var params="API=Application_Model_UsersRightsMapper&APICall=updateRights&id_user_group="+rec.get('id_user_group')+'&id_user='+rec.get('id_user');
			
			var index=0;
			this.gridRights.store.getRootNode().cascadeBy(function(node){
				if(index>0)params+="&items["+index+"][rubId]="+node.get('rubId')+"&items["+index+"][plugin]="+node.get('plugin')+"&items["+index+"][module]="+node.get('moduleName')+"&items["+index+"][read]="+(node.get('read')?1:0)+"&items["+index+"][write]="+(node.get('write')?1:0)+"&items["+index+"][edit]="+(node.get('edit')?1:0);
				index++;
			},this);
			
			this.ajaxRequest('/admin/getjsondata/format/json', params);
			btn.up('window').close();
			
			
		}}, {text:'Fermer',handler:function(btn){btn.up('window').close();}}]
		
	});
	
	this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_UsersRightsMapper', APICall:'loadUsersRights', id_user_group:rec.get('id_user_group'), id_user:rec.get('id_user')}, this.updateGridRights.bind(this));
	
	
	
	},
	
	updateGridRights:function(response){
		var result=response.result;
		
		result.each(function(elt){
			this.gridRights.store.getRootNode().cascadeBy(function(node){
				
				
				if(node.get('moduleName')==elt.module&&node.get('plugin')==elt.plugin&&node.get('rubId')==elt.rubId){
					
					node.beginEdit();
					node.set('read',elt.read);
					node.set('write',elt.write);
					node.set('edit',elt.edit);
					node.endEdit();
					node.commit();
				}
				
				
			}, this);
			
			
		}, this)
		
		
		
		
		this.gridRights.up('window').show();
		
	},
	rightsCheckChange:function(cb, recordIndex, checked){
		
		var record=this.gridRights.view.store.getAt(recordIndex);
		displayAncestor=false;
		var node=record;
		var parentSearch=false;
		if(!node.parentNode.isRoot()){
			parentSearch=true;
			do{
		
			
			node=node.parentNode;
			
		}
		while(!node.parentNode.isRoot())
		}
		if(checked&&cb.dataIndex=="read"&&node.parentNode.isRoot()&&parentSearch){
			displayAncestor=true;
			node=node;	
		}else node=record;
			
	
		
		node.cascadeBy(function(child){
			
						
			if(displayAncestor==true&&!record.isAncestor(child)&&child!=record)return;
			
			child.beginEdit();
			child.set(cb.dataIndex, checked);
			
			if(cb.dataIndex=="read"&&!checked){
				
				
				child.set('edit', checked);
				child.set('write', checked);
				
			}
			
			if(cb.dataIndex!="read"&&checked){
				child.set('read', checked);
				
				
			}
			
			child.endEdit();
			child.commit();
			
		}, this);
		
		this.gridRights.store.fireEvent('datachanged',this.gridRights.store);
				
		
	},
	getCmsTreeNodes:function(node) {
		
		
		var children=[];
		if(node.childNodes.length>0){
			node.childNodes.each(function(child){
				children.push(this.getCmsTreeNodes(child))
				
			},this);
			
			
			
			
		}
		
		var obj ={text:node.get('text'), children:children,moduleName:'CmsClass.Main', rubId:node.internalId, type:node.get('type')};
		
		return obj;
		
	},
	initTreeNode:function(record){
		
		this.cleanPanels();
		
		this.unselectTreeNode(record, this.selectedRub);
		this.cmsClass.selectedRub=null;
	
		this.displayBreadCrumb(record);	
	
	this.panel.expand();
		
	}
	
	
});
