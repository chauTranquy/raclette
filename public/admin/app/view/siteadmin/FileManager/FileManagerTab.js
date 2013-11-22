Ext.define('TextoCMS.view.siteadmin.FileManager.FileManagerTab', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.filemanagertab',
	layout : 'border',
	border : false,
	title : 'Edition des fichiers',
	iconCls : 'fileManager',
	layout : 'border',
	border : false,

	items : [ {
		xtype : 'panel',
		region : 'west',
		width : 300,
		cls : 'fileBrowser',
		layout : 'accordion',
		autoScroll : true,

		items : [ Ext.widget('browsertree',{
			border : false,
			tools : [ {
				type : 'refresh',
				tooltip : 'recharger'
			} ],
			extraParams : {
				type : 1
			},
			APICall : 'getFileEditorFolderList',
			title : 'backOffice',
			id:'boTree'
				

		}),Ext.widget('browsertree',{
			border : false,
			tools : [ {
				type : 'refresh',
				tooltip : 'recharger'
			} ],
			extraParams : {
				type : 2
			},
			APICall : 'getFileEditorFolderList',
			title : 'frontOffice',
			id:'foTree'

		}) ]
	}, {
		hidden : true,
		xtype : 'panel',
		region : 'center',
		layout : 'fit',
		margin : '0 0 0 10',
		tbar : [ {
			iconCls : 'saveBtn',
			text : "Sauvegarder",
			xtype : 'button'
		}, '->', {
			xtype : 'label',
			id : 'fileEditorInfo'
		} ],
		items : [ {
			border : false,
			xtype : 'textarea',
			displayLabel : false,
			name : 'codeEditor',
			id : 'code'

		} ],
		bbar : [ {
			xtype : 'label',
			id : 'codeMirrorNotification'
		} ]

	} ]
});