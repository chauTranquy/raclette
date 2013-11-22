Ext.define('TextoCMS.view.liveeditor.Palette',{
	 
	alias:'widget.palette',
	extend:'Ext.window.Window',
	collapsible:true,
	collapseDirection:'top',
	closable:false,
	title:'Ma palette',
	layout:'hbox',
	width:200,
	height:200,
	
	
	items   : [ {  xtype: 'button', text : 'Contenu Page' , id:"Contenu" ,  margin:'5 10 10 5' },
	            {  xtype: 'button', text : 'ferme' , id:"ferme" ,  margin:'5 10 10 5' },
	            {xtype:'richtext', closable:true, title:'ok', value:'jkljljljlkjl'}  ]

	

});