Ext.define('TextoCMS.view.siteadmin.templatesAdminViews.GridTemplates',{
	extend:'Ext.grid.Panel',
	alias:'widget.gridtemplates',
	tbar:[{text:'Ajouter', iconCls:'addBtn'}],
	bodyStyle:'cursor:pointer',
	columns:[
             {dataIndex:'templateRef', header:'Nom du gabarit',align:"center",sortable:true, draggable:false,menuDisabled:true},
             {dataIndex:'description', header:'<div style="text-align:center">Descriptif</div>',sortable:true, flex:1, draggable:false,menuDisabled:true},
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
 	                iconCls:'editBtn'
 	            },{
 	                icon: '/admin/img/icons/delete.png',
 	                tooltip: 'Supprimer',
 	                scope:this,
 	                iconCls:'removeBtn'
 	                }
 	            ]
             }],
	initComponent:function(){
		this.store = Ext.getStore('TemplatesRefStore');
		this.callParent(arguments);
	}
	
});