Ext.define('TextoCMS.view.medias.UploadForm', {
	requires : [ 'TextoCMS.view.medias.FileReaderDataview',
			'Ext.ux.statusbar.StatusBar'],
	extend : 'Ext.window.Window',
	alias : 'widget.uploadform',
	modal : true,
	width : 380,
	items : [ {
		xtype : 'form',
		bodyStyle : 'background-color:transparent',
		border : false,
		baseParams : {
			API : 'Application_Model_FileManager',
			APICall : 'uploadFile',
			parentRoot : null,
			overwrite : 0

		},
		method : 'post',
		url : '/admin/doupload',
		autoHeight : true,
		padding : '5',
		items : []
	} ],
	buttons : [ {
		text : 'T&eacute;l&eacute;charger',
		disabled : true,
		iconCls : 'addFileUpload',
		action : 'add'
	}, {
		text : "Fermer",
		action : 'closeupload',
		iconCls : 'closeupload'
	} ],
	initComponent : function() {
		
		this.arrayExt=arrayExt;
		
		this.callParent(arguments);
		this.fileSupport = window.File && window.FileReader && window.FileList
				&& window.Blob;
		//this.fileSupport=false;
		if (!this.fileSupport){
			this.down('form').add(
					{
						xtype : 'filefield',
						id : 'form-file',
						scope : this,
						labelWidth : 120,
						width : 350,
						fieldLabel : 'Choisissez un fichier',
						validator : function(value) {

							var regExtension = "";
							var extArray = [];
							for (key in this.arrayExt) {

								extArray.push(this.arrayExt[key].join('|'));

							}

							regExtension = extArray.join('|');

							var regExp = new RegExp('([a-zA-Z0-9_-]+)(\.('
									+ regExtension + '))$', 'i');

							if (!regExp.test(value))
								return "format de fichier incorrect";
							return true;
						}.bind(this),
						name : 'fichier',
						buttonText : '',
						buttonConfig : {
							tooltip : 'Choisir',
							iconCls : 'upload-icon'
						}
					});
		
		this.setTitle('Ajouter un fichier'+(this.filter!=null?' (format '+this.filter.split(';').join(',')+')':''));
		
		}
		else {
			this.setWidth(550);
			this.statusBar = new Ext.ux.StatusBar({
				dock : 'bottom',
				cls : 'form-statusbar',
				defaultText : ''
			});

			this.setTitle('Ajouter des fichiers'+(this.filter!=null?' (format '+this.filter.split(';').join(',')+')':''));

			this.dataView = Ext.widget('FileReaderDataview');

			this.down('form').add([ {
				xtype : 'toolbar',
				docked : 'top',
				items : [ {
					xtype : 'button',
					text : 'supprimer la s&eacute;lection',
					cls : 'deleteUploadSelection',
					disabled:true
				}, '->', {
					xtype : 'label',
					html : 'Glissez/d&eacute;posez vos fichiers ou ',
					style : {
						top : '4px'
					}
				}, {
					xtype : 'button',
					iconCls : 'openUploadBrowser',
					text : 'S&eacute;lectionner des fichiers'
				} ]
			}, this.dataView, this.statusBar ]);

		}

	}

});
