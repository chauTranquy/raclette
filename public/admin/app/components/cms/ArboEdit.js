Ext.define('TextoCMS.components.cms.ArboEdit' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.arboedit',
    layout: 'fit',
    autoShow: true,
    modal:true,
    isNew:true,
    initComponent:function(){
    	
    	
    	// Define the model for a State
    	Ext.define('TemplateType', {
    		extend:'Ext.data.Model',
    	    fields: [
    	        {type: 'string', name: 'template_name'},
    	        {type: 'int', name: 'id_template'}
    	    ]
    	});

    	// The data store holding the states
    	var store = Ext.create('Ext.data.Store', {
    	    model: 'TemplateType',
    	    proxy: {
				actionMethods:'post',
			    extraParams: {
			    	API: 'Application_Model_TemplateMapper',
			        APICall: 'getTemplateList',
			        templateId:0,
			        id_site:TextoCMS.siteId
			    },
			    type: 'ajax',
			    url: '/admin/getjsondata?format=json'
			}
    	});

    	// Simple ComboBox using the data store
    	var comboTemplate = Ext.create('Ext.form.field.ComboBox', {
    	    fieldLabel: 'Template*',
    	    name:'id_template',
    	    allowBlank:false,
    	    hidden_name:'id_template',
    	    displayField: 'template_name',
    	    valueField:'id_template',
    	    store: store,
    	    queryMode: 'local',
    	    typeAhead: true
    	});
    	
    	this.form = {
	            xtype:'form',
	            trackResetOnLoad :true,
	            border:false,
	            bodyStyle:'background:transparent',
	            padding:10,
	            clientValidation:true,
	            defaults:{
	            	labelWidth: 100,
	            	labelStyle:' text-align:right;',
	            	width:350
	            	
	            },
	            listeners: {
	            	scope:this,
	            	validitychange:this.checkValidity.bind(this),
	            	dirtychange:this.checkDirty.bind(this)
	            },
	            items: [
	                    {
	                        xtype: 'textfield',
	                        name : 'title',
	                        fieldLabel: 'Libell&eacute;',
	                        allowBlank:false
	                    },
	                    {
	                    	xtype:'hiddenfield',
	                    	name:'id_rubrique'
	                    	
	                    },
	                    comboTemplate
	                    ]
	            
	};
    	
    	if(this.isNew){
    		this.form.title="Nouveau gabarit";
    		this.form.listeners.activate = function(tab){
    			
    			
    			this.checkValidity(tab.getForm(), tab.getForm().isValid());
    			
    			
    		};
    	
    	this.items=[
    	            {
    	            	
                    	xtype:'tabpanel',
                    	activeTab:0,
                    	border:false,
                    	items:[this.form,
                    	       {
    		title:'Copier un &eacute;l&eacute;ment',
    		xtype:'form',
    		 trackResetOnLoad :true,
	            border:false,
	            listeners: {
	            	scope:this,
	            	activate:function(tab){
            			
	            		this.checkValidity(tab.getForm(), tab.getForm().isValid());
            			
            		},
	            	validitychange:this.checkValidity.bind(this),
	            	dirtychange:this.checkDirty.bind(this)
	            },
	            bodyStyle:'background:transparent',
	            padding:10,
	            clientValidation:true,
	            defaults:{
	            	labelWidth: 100,
	            	labelStyle:' text-align:right;',
	            	width:350
	            	
	            },
    		items:[{
                xtype: 'textfield',
                name : 'title',
              
                fieldLabel: 'Libell&eacute;',
                allowBlank:false
            },
            {xtype:'contentbrowser', fieldLabel:'Choisir', name:'originalId'}]
    		
    	}]
    	            }];
    	}
    	else this.items=this.form;
    	
    	this.buttons = [
    	                {
    	                    text: 'Enregistrer',
    	                    id: 'saveArboBtn',
    	                    disabled:true,
    	                   action:'save'
    	                },
    	                {
    	                    text: 'Annuler',
    	                    scope: this,
    	                    handler: this.close
    	                }
    	            ];
    	            this.callParent(arguments);
    	
    },
    checkValidity:function(form, isValid){
    	 
    	if(this.isNew){
		 var tab = this.query('tabpanel')[0].getActiveTab();
		 var formTab = form.owner;
				 
		 if(!form.isDirty()&&tab==formTab) return Ext.getCmp('saveArboBtn').setDisabled(true);
		 else if(tab==formTab){
			 Ext.getCmp('saveArboBtn').setDisabled(!isValid);
			
			 
		 }
		 return;
    	}

    		if(!form.isDirty()) return Ext.getCmp('saveArboBtn').setDisabled(true);
   		 Ext.getCmp('saveArboBtn').setDisabled(!isValid);
	},
	checkDirty:function(form, dirty){
		
		if(this.isNew){
		 var tab = this.query('tabpanel')[0].getActiveTab();
		 var formTab = form.owner;
		if(dirty&&form.isValid()&&tab==formTab)return Ext.getCmp('saveArboBtn').setDisabled(false);
		else if(tab==formTab)Ext.getCmp('saveArboBtn').setDisabled(true);
		return;
		}
		
		if(dirty&&form.isValid())return Ext.getCmp('saveArboBtn').setDisabled(false);
		Ext.getCmp('saveArboBtn').setDisabled(true);
		
		
	}
});