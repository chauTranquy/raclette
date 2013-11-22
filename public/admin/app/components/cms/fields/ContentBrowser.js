/**
 * 
 * 
 */
Ext.define('TextoCMS.components.cms.fields.ContentBrowser' ,{
    extend: 'Ext.panel.Panel',
    fieldName:'Navigateur de contenu',
    alias : 'widget.contentbrowser',
    layout:'column',
    selectedRecord:null,
    border:false,
	margin:'0 0 5 0',
	value:null,
	rights:{
		write:1
	},
	extraParams:{},
        displayRoots:true,
	cb:Ext.emptyFn,
	rootIDs:[],
	defaults:{
		border:false,
		bodyStyle:'background-color:transparent',
		defaults:{
			bodyStyle:'background-color:transparent',
			border:false
			
		}
	},
	initComponent:function(){
		
		
		this.addButton=Ext.create('Ext.button.Button',{
			iconCls:'addBtn',
			tooltip:'Ajouter un fichier',
			scope:this,
			hidden:this.rights.write==0,
			disabled:this.rights.write==0,
			handler:this.openBrowserWin
			
		});
		
		this.removeButton=Ext.create('Ext.button.Button',{
			iconCls:'removeBtn',
			tooltip:'Supprimer le fichier',
			hidden:this.value==null,
			scope:this,
			hidden:this.rights.write==0,
			disabled:this.rights.write==0,
			handler:this.deleteValue
			
				
			
		});
		

		
		this.textField=Ext.create('Ext.form.field.Text',{
			name:this.name,
			hidden:true,
			allowBlank:this.allowBlank,
			value:this.value,
			mainFieldCT:this,
			listeners:{
				scope:this
			}
			
		});
			
		
		this.statusPanel = Ext.create('Ext.panel.Panel',{width:20, html:"&nbsp;", border:false, height:20});
		
		this.contentPanel=Ext.create('Ext.panel.Panel',{xtype:'panel',border:false,html:'', width:150, height:50,  margin:'0 5'});
		if(!this.width)this.width=750;
		this.items=[{width:this.labelWidth?this.labelWidth:150,items:[{xtype:'panel', html:this.fieldLabel+(this.allowBlank?'':'*')+' :', width:this.labelWidth?this.labelWidth:150, style:'text-align:right'}]},
		            {width:150,items:[this.textField, this.contentPanel]},
		            this.statusPanel,
		            {width:70, height:50,layout: {                        
		                type: 'vbox',
		                align: 'center'
		            },defaults:{
		            	border:false
		            },
		            items:[{items:[this.addButton]}, {items:[this.removeButton]}]}
		            ];
		
		var classInstance = TextoCMS.classes.Ajax;	

		
		
		if(null!=this.value&&!this.value.empty()){
	
			
			classInstance.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ArboMapper', APICall:'getElement',id_rubrique:this.value,isJSONCall:1}, function(response){
				this.contentPanel.update(response.result.title);
				this.statusPanel.update(response.result.status==1?'<img src="img/icons/accept.png" data-qtip="En ligne" />':'<img src="img/icons/stop.png" data-qtip="Hors Ligne" />');
				
			}.bind(this), false);
			
		};


        this.displayRoots=this.extraParams&&this.extraParams.displayRoots!==null&&this.extraParams.displayRoots!==undefined?this.extraParams.displayRoots:this.displayRoots;
       
        if(this.extraParams&&this.extraParams.rootIDs)this.rootIDs=this.extraParams.rootIDs;
		
                
        if(this.rootIDs.length==0&&this.displayRoots)classInstance.ajaxRequest('/admin/getjsondata?format=json',{API:'Application_Model_ArboMapper',APICall:'getRoots',id_site:TextoCMS.siteId}, this.getRootsID.bind(this), false);
		 this.callParent(arguments);
		
	},
    
	getRootsID:function(response){

		response.roots.each(function(elt){
			
			this.rootIDs.push(elt.id_rubrique);
			
		},this);
		
	},
	
openBrowserWin:function(){
	
	if(this.rights.write==0) return;
	
	this.selectBtn=Ext.create('Ext.button.Button',{text:'S&eacute;lectionner', action:'select', disabled:true, scope:this, handler:this.displaySelection});
	
	var browserTree=Ext.widget('contentbrowsertree',{rootIDs:this.rootIDs,extraParams:this.extraParams, selectCB:this.doSelect.bind(this)});
	
	this.win=Ext.create('Ext.window.Window',{
		title:'Navigateur de contenu',
		modal:true,
		layout:'fit',
		width:350,
		height:450,
		autoShow: true,
		items:[browserTree],
		buttons:[this.selectBtn,{text:"Fermer",scope:this, handler:function(){this.win.close();}}],
		listeners:{scope:this,
			close:function(){
				
				browserTree.destroy();
				this.win.destroy();
			}}
	});//.show();
	
	
},
doSelect:function(view,record,htmlElement,index,e){
	this.selectedRecord=record;
	this.selectBtn.setDisabled(false);
},
displaySelection:function(){
	if(this.win)this.win.close();
	
	this.textField.setValue(this.selectedRecord.get('id_rubrique'));
	this.contentPanel.update(this.selectedRecord.get('text'));
	this.statusPanel.update(this.selectedRecord.get('statut')==1?'<img src="img/icons/accept.png" data-qtip="En ligne" />':'<img src="img/icons/stop.png" data-qtip="Hors Ligne" />');
	this.removeButton.show();
	
},
deleteValue:function(){
	this.contentPanel.update();
	this.statusPanel.update();
	
	this.textField.setValue(null);
	this.removeButton.hide();
	
}

    });