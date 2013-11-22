Ext.define('TextoCMS.view.siteadmin.templatesAdminViews.GridTemplatesFields',{
	extend:'Ext.grid.Panel',
	alias:'widget.gridtemplatesfields',
	requires:['TextoCMS.store.siteadmin.TemplatesFieldsStore'],
	templateRef:null,
	width:500,
	maxHeight:500,
	autoScroll:true,
	title:'Champs du template',
	loadMask:true,
	tbar:[{iconCls:"addBtn", text:"Ajouter", scope:this}],
	viewConfig:{
		plugins: {
	           ptype: 'gridviewdragdrop',
	           dragText:'{0} &eacute;l&eacute;ment s&eacute;lectionn&eacute;{1}'
	        }
		},
		columns:[
		         {dataIndex:'label', header:'Label', sortable:false, draggable:false,menuDisabled:true, flex:3, align:'center'},
		         {dataIndex:'field_name', header:'Nom du champ', sortable:false, draggable:false,menuDisabled:true, flex:1, align:'center'},
		         {dataIndex:'field_type', header:'Type de champ', sortable:false, draggable:false,menuDisabled:true, flex:2, align:'center',renderer:function(v, record){
		        	 
		        	var index=Ext.getStore('TemplatesStore').find('name', v);
		        	if(index==-1) return;
		        	
		        	rec=Ext.getStore('TemplatesStore').getAt(index);
		        	
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
		     	               iconCls:'editBtn'
		     	            },{
		     	                icon: '/admin/img/icons/delete.png',
		     	                tooltip: 'Supprimer',
		     	                iconCls:'deleteBtn'
		     	             	     	                    
		     	                    
		     	                                
		     	            }]}

		         
		         ],
		         
		        initComponent:function(){
		        	
		        	this.store = Ext.create('TextoCMS.store.siteadmin.TemplatesFieldsStore');
		        	this.store.model.getProxy().setExtraParam('API', 'Admin_Model_TemplateMapper');
		        	this.store.model.getProxy().setExtraParam('APICall', 'getTemplateFields');
		        	this.store.model.getProxy().setExtraParam('templateRef', this.templateRef);
		        	this.store.model.getProxy().setReader({type: 'json',root: 'result'});
		        	
		        	
		        	this.store.load();
		        	
		        	this.callParent(arguments);
		        	
		        	
		        }
	
	
});