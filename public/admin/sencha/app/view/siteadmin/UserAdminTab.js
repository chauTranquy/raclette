Ext.define('TextoCMS.view.siteadmin.UserAdminTab',{
	extend:'Ext.tree.Panel',
	requires:['TextoCMS.model.siteadmin.AdminUserModel', 'TextoCMS.store.siteadmin.AdminUserStore'],
	//layout:'border',
	alias:'widget.useradmintab',
	title:'Gestion des utilisateurs',
	iconCls:'userIcon',
	rootVisible: false,
	border:true,
    root:{text:'.'},
    tbar:[{text:'Nouveau',iconCls:'addUserGroupBtn', tooltip:'Ajouter un groupe utilisateur'},
          '-',
          {text:'Nouveau', tooltip:'Ajouter un utilisateur',iconCls:'addUserBtn'}],
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
    	
        	 if(v==null||record.get('group_name')) return "";
        	 if(v==1) return'<div style="width:16px; margin:auto"><img src="/admin/img/icons/accept.png" /></div>';
        	 return '<div style="width:16px; margin:auto"><img src="/admin/img/icons/stop.png" /></div>';
     }
    },
    {
         xtype:'actioncolumn', 
         width:60,
         align:'center',
         sortable:false,
         draggable:false,
         fixed:true,
	        menuDisabled:true,
         items: [{
            
             tooltip: 'Gestion des droits',
             scope:this,
             
            getClass:function(v, meta, record){
         	     
         	  if(record.get('type')=='group'&&record.get('superadmin')==1||record.parentNode.get('superadmin')==true) meta.attr="style='display:none'";         	   
         	  else return 'actionGroup rights';
	                	
	                	
	                }
         /*,
             
             handler: function(grid, rowIndex, colIndex) {
                /* var rec = grid.getStore().getAt(rowIndex);
                if(rec.get('superadmin')==1) return;
                 return this.editRights(rec, grid);
           
                 
             }*/
         },
         {
             
             tooltip: 'Editer',
             scope:this,
             
            getClass:function(v, meta, record){
	                
         	  if(record.get('type')=='group'&&record.get('superadmin')==1) meta.attr="style='display:none'";         	   
         	  else if(record.get('type')=='group')return 'actionGroup edit';
         	  else return 'actionUser edit';
	                }
         /*,handler: function(grid, rowIndex, colIndex) {
                 var rec = grid.getStore().getAt(rowIndex);
               /*
                 if(rec.get('type')=='user')return this.openUserForm(rec, grid);
                if(rec.get('superadmin')==1) return;
                 
                 return this.openGroupForm(rec, grid);
                 
             }*/
         },
         {
             
             tooltip: 'Supprimer',
             scope:this,
             
            getClass:function(v, meta, record){
              
         	  if(record.get('type')=='group'&&record.get('superadmin')==1) meta.attr="style='display:none'";         	   
         	  else if(record.get('type')=='group')return 'actionGroup delete';
              	
              	else return 'actionUser delete';
              }
         /*,
             
             handler: function(grid, rowIndex, colIndex) {
                 var rec = grid.getStore().getAt(rowIndex);
                if(rec.get('superadmin')==1) return;
               //  return this.deleteUserGridElement(rec, grid);
                
                 
             }*/
         }
         ]}
    ],
    
    initComponent:function(){
    
    	var store = Ext.create('TextoCMS.store.siteadmin.AdminUserStore');
    	
		store.model.getProxy().setExtraParam('API', 'Application_Model_AdminUsersMapper');
		store.model.getProxy().setExtraParam('APICall', 'getUsers');
		
    	this.store=store;
    	this.callParent(arguments);
    	//this.store.load();
    	
    }
	
});/**
 * 
 */