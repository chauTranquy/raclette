Ext.define('TextoCMS.view.cms.VersionTab',{
	extend:'Ext.grid.Panel',
	requires:['TextoCMS.store.cms.VersionStore'],
	title:'Versions',
	id:'versionTab',
	iconCls:'versionTab',
	alias:'widget.versiontab',
	loadMask:true,
	id_rubrique:null,
	version_id:null,
	initComponent:function(){
		
		var store = Ext.create('TextoCMS.store.cms.VersionStore');
		store.model.getProxy().setExtraParam('id_rubrique', this.id_rubrique);
		store.model.getProxy().setExtraParam('API', 'Admin_Model_ContentMapper');
		store.model.getProxy().setExtraParam('APICall', 'getVersionsList');
		this.store =store;
		
		sm = Ext.create('Ext.selection.CheckboxModel',{
    		renderer:function(v,p,record){
    			
	    		if(record.store.getCount()==1||record.get('status')==1||this.version_id==record.get('version_id'))return '';
	    		return '<div class="x-grid-row-checker">&nbsp;</div>';
	    		
	    	}.bind(this),
    		checkOnly:true
    	
    });
		var deleteVersionBtn=Ext.create('Ext.button.Button',
 		    	{text:'Supprimer',tooltip:'Supprimer la s&eacute;lection', disabled:true,iconCls:'removeBtn'});
		this.tbar=[deleteVersionBtn];
		var actionVersionCol=Ext.create('Ext.grid.column.Action',{
            xtype:'actioncolumn', 
            menuDisabled :true, 
            sortable:false,
            width:50,
            
            bodyStyle:'cursor:pointer',
            align:'center',
            items: [{
                icon: 'img/icons/pencil.png',
                tooltip: 'Editer cette version',
                scope:this,
                getClass:function(v,meta,record){
                	if(record.get('version_id')==this.version_id) meta.style='display:none';
              	
                }
            }]});
		
		this.selModel = sm;
		this.columns=[
		              {header:'Version', dataIndex:'version_id', align:'center'}, {header:'Date de cr&eacute;ation',flex:2, align:'center',dataIndex:'creation_date', renderer:function(v){
		            	  return Ext.Date.format(v,'d-m-Y H:i');}
		              }, {header:'Derni&egrave;re mise &agrave; jour',  flex:2,dataIndex:'update_date', align:'center',renderer:function(v){
		            	  if(v==null) return;
		            	  return Ext.Date.format(v,'d-m-Y H:i');}
		              },
		              {header:'Statut', dataIndex:'status', align:'center',renderer:function(v){
		            	  if(v==1) return '<img src="img/icons/accept.png" data-qtip="En ligne" />';
		            	  return '<img src="img/icons/stop.png" data-qtip="Hors ligne" />';}
		              },
		              {header:'Utilisateur', dataIndex:'userName', align:'center', flex:1}, actionVersionCol];
		
		
		
		
		this.callParent(arguments);
	},
	
	afterShow:function(){
		this.store.load();
		
	}
	
	
});