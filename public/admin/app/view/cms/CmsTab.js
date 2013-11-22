Ext.define('TextoCMS.view.cms.CmsTab',{
	extend:'Ext.panel.Panel',
	alias:'widget.cmstab',
	layout:'border',
	border:false,
	iconCls:'contentPanel',
	tooltip:'G&eacute;rer le contenu du site',
	title:'Gestion de contenu',
	 defaults : {
        split : true
     },
	items:[
	       {region:'west', collapsible:true, minWidth:250, width:250, frame : true, layout:'accordion'},
	       {region:'center', layout:'fit', border:false, style:'background-color:transparent'}]
		
	
	
});