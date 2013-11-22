Ext.define('TextoCMS.view.siteadmin.siteParamsTab.JsCssFilesForm', {
	extend : 'Ext.form.Panel',
	id : 'JsCssFilesForm',
	alias : 'widget.jscssform',
	layout : 'hbox',
	border : false,
	buttonAlign : 'left',
	autoDestroy:true,
	trackResetOnLoad : true,
	buttons : [ {
		text : 'Enregistrer',
		disabled : true,
		iconCls : 'saveBtn',
		action : 'save',
		style : 'margin-left:250px;'
	}, {
		text : 'Annuler',
		iconCls : 'refreshBtn',
		action : 'refresh',
		disabled : true
	} ],
	defaults : {
		padding : 10
	},
		initComponent : function() {

		this.callParent(arguments);
		
		this.add([

		        	{
		        		xtype : 'itemsmenu',
		        		name : 'jsFiles',
		        		fieldLabel : 'Fichiers js',
		        		extraParams : {
		        			fields : [ {
		        				xtype : 'combofield',
		        				fieldLabel : 'Type',
		        				name : 'type',
		        				extraParams : Ext.JSON.encode({
		        					data : [ {
		        						value : 1,
		        						label : 'Fichier Interne'
		        					}, {
		        						value : 2,
		        						label : 'Fichier Externe'
		        					} ]
		        				})
		        			}, 
		        			{
		        				field_type:'text',
		        				hidden:true,
		        				name:'file',
		        				label:'Url du script',
		        				showCol:true,
		        				compulsary:1
		        			},
		        			{
		        				field_type : 'file',
		        				name : 'url',
		        				displayAllFile : true,
		        				baseFolder : '/',
		        				label : 'Fichier',
		        				compulsary : 1,
		        				filter : 'js'
		        			}, {
		        				xtype : 'text',
		        				name : 'urlFile',
		        				fieldLabel : 'Url',
		        				//vtype:'url',
		        				allowBlank : false
		        			},{
		        				field_type : 'text',
		        				name : 'conditionale',
		        				label : 'Conditions',
		        				allowBlank : true
		        			},  {
		        				field_type : 'check',
		        				name : 'minify',
		        				label : 'Minifier',
		        				allowBlank : true, 
		        				inputValue:1
		        			}

		        			]
		        		},
		        		flex : 1
		        	}, {

		        		xtype : 'itemsmenu',
		        		name : 'cssFiles',
		        		fieldLabel : 'Feuilles de style',
		        		extraParams : {
		        			fields : [{
		        				xtype : 'combofield',
		        				fieldLabel : 'Type',
		        				name : 'type',
		        				extraParams : Ext.JSON.encode({
		        					data : [ {
		        						value : 1,
		        						label : 'Fichier Interne'
		        					}, {
		        						value : 2,
		        						label : 'Fichier Externe'
		        					} ]
		        				})
		        			}, 
		        			{
		        				field_type:'text',
		        				hidden:true,
		        				name:'file',
		        				label:'Url du fichier css',
		        				showCol:true,
		        				compulsary:1
		        			},
		        			{
		        				field_type : 'file',
		        				name : 'url',
		        				displayAllFile : true,
		        				baseFolder : '/',
		        				label : 'Fichier',
		        				compulsary : 1,
		        				filter : 'css'
		        			}, {
		        				xtype : 'text',
		        				name : 'urlFile',
		        				fieldLabel : 'Url',
		        				vtype:'url',
		        				allowBlank : false
		        			}, {
		        				field_type : 'check',
		        				name : 'screen',
		        				label : 'Media screen',
		        				allowBlank : true,
		        				inputValue:1
		        			}, {
		        				field_type : 'check',
		        				name : 'print',
		        				label : 'Media print',
		        				allowBlank : true, 
		        				inputValue:1
		        			}, 
		        			{
		        				field_type : 'text',
		        				name : 'othermedia',
		        				label : 'Autres medias',
		        				allowBlank : true
		        			}, 
		        			{
		        				field_type : 'text',
		        				name : 'conditionale',
		        				label : 'Conditions',
		        				allowBlank : true
		        			}, 
		        			
		        			{
		        				field_type : 'check',
		        				name : 'minify',
		        				label : 'Minifier',
		        				allowBlank : true, 
		        				inputValue:1
		        			}

		        			]
		        		},
		        		flex : 1
		        	} ]);
		
		//this.callAjax();
		
		// this.getForm().setValues = Ext.bind(this.setValues, this);

	},
	callAjax:function(){
		TextoCMS.Ajax.ajaxRequest(DEFAULT_ADMIN_URL, {
			API : 'Admin_Model_ParamsMapper',
			APICall : 'getParam',
			key : 'jsFiles',
			id_site:TextoCMS.siteId
		}, Ext.bind(this.setGridValue, this, [ 'jsFiles' ], true));
		TextoCMS.Ajax.ajaxRequest(DEFAULT_ADMIN_URL, {
			API : 'Admin_Model_ParamsMapper',
			APICall : 'getParam',
			key : 'cssFiles',
			id_site:TextoCMS.siteId
		}, Ext.bind(this.setGridValue, this, [ 'cssFiles' ], true));
		
	},
	setGridValue : function(response, field) {
		
		var item = this.getForm().findField(field);
	
		item.mainFieldCT.setValue(response.value!==undefined?response.value:'[]', false);
		item.resetOriginalValue();

	}

});