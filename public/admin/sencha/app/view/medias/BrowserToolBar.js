Ext.define('TextoCMS.view.medias.BrowserToolBar',{
	extend:'Ext.toolbar.Toolbar',
	alias:'widget.browsertoolbar',
	initComponent:function(){
		
		var createFolderBtn=Ext.create('Ext.button.Button',{tooltip:'Cr&eacute;er un r&eacute;pertoire', iconCls:'addFolder', text:'Nouveau'});
		var items=[createFolderBtn];
		
			var deleteFolderBtn=Ext.create('Ext.button.Button',{xtype:'button',tooltip:'Supprimer le r&eacute;pertoire',iconCls:'deleteFolder', tooltip:'Supprimer le r&eacute;pertoire courant', disabled:true, text:'Supprimer'});
			items.push(deleteFolderBtn);
		
			var menuItem={
	    			title:'R&eacute;pertoire',
	                xtype: 'buttongroup',
	                columns: 4,
	                defaults: {
	                    scale: 'small'
	           }, items:items};
			
	var deleteFileBtn=Ext.create('Ext.button.Button',{tooltip:'Supprimer le fichier',disabled:true,iconCls:'deleteFile', text:'Supprimer'});
	var uploadFileBtn=Ext.create('Ext.button.Button',{tooltip:'T&eacute;l&eacute;charger un nouveau fichier', iconCls:'addFile', text:'Ajouter'});

	var items2=[ uploadFileBtn,deleteFileBtn];
	
	var menuItem2={
			title:'Fichiers',
            xtype: 'buttongroup',
            columns: 4,
            defaults: {scale: 'small'}, items:items2};
		
	var toggle1={xtype:'button', toggleGroup:'affiche', text:'Classique', iconCls:'toggleClassique', pressed:true};
	var toggle2={xtype:'button', toggleGroup:'affiche', text:'Icones', iconCls:'toggleIcone'};
	var toggle3={xtype:'button', toggleGroup:'affiche', text:'D&eacute;tail', iconCls:'toggleListe'};

	var menuItem3={
			title:'Affichage',
            xtype: 'buttongroup',
            columns: 4,
            defaults: {scale: 'small'}, items:[toggle1,toggle2, toggle3]};
	
	
	this.items=[menuItem, menuItem2, menuItem3,'-','->',{xtype:'trigger', triggerCls:'search', id:'searchFolder',emptyText:'Chercher',tooltip:'Rechercher', listeners:{buffer:50}}];
		
		this.callParent(arguments);
		
	}
	
});