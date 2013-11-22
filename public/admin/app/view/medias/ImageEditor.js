Ext
		.define(
				'TextoCMS.view.medias.ImageEditor',
				{
					extend : 'Ext.window.Window',
					alias : 'widget.ImageEditor',
					layout : 'fit',
					modal : true,
					maximized : true,
					maximizable : true,
					title : 'Editer l\'image',
					width : 600,
					height : 600,

					style : "width:100%; height:100%",
					bbar : [ {
						xtype : 'label',
						id : 'info'
					}, '-', {
						xtype : 'label',
						id : 'ratio'
					}, {
						xtype : 'slider',
						width : 160,
						id : 'ratioSlider',
						value : 50,
						increment : 1,
						minValue : 0,
						maxValue : 100,
						hidden : true

					} ],
					defaults : {
						border : false

					},

					initComponent : function() {
						this.setTitle('Editer ' + this.record.get('name'));

						var menuItem = {
							title : 'Fichier',
							xtype : 'buttongroup',
							columns : 5,
							defaults : {
								margin : '5 auto'

							},
							items : [
									{
										tooltip : 'Sauvegarder l\'image',
										id : 'saveBtn',
										html : '<i class="icon-save">&nbsp;</i>&nbsp;Sauver',
										xtype : 'button'
									},
									{
										tooltip : 'Pr&eacute;visualiser l\'image',
										id : 'previewImageBtn',
										html : '<i class="icon-eye-open">&nbsp;</i>&nbsp;Voir',
										xtype : 'button'
									} ]
						};

						var sizeMenu = Ext.create('Ext.menu.Menu', {
							id : 'sizeMenu',
							plain : true,
							items : [ {
								value : '1',
								text : '100%'
							}, {
								value : '0.75',
								text : '75%'
							}, {
								value : '0.5',
								text : '50%'
							}, {
								value : '0.25',
								text : '25%'
							} ]

						});

						var menuItem2 = {
							title : 'Transformation manuelle',
							xtype : 'buttongroup',
							columns : 5,
							defaults : {
								enableToggle : true,
								toggleGroup : 'tools',
								margin : '5 auto'

							},
							items : [
									{
										tooltip : 'Redimensionner l\'image manuellement',
										id : 'resizeBtn',
										html : '<i class="icon-fullscreen">&nbsp;</i>&nbsp;Redimensionner',
										xtype : 'button'
									},
									{
										tooltip : 'Cadrer l\'image',
										html : '<i class="icon-crop">&nbsp;</i>&nbsp;Recadrer',

										id : 'cropBtn',
										xtype : 'button'
									} ]
						};

						var menuItem3 = {
							title : 'Outils',
							xtype : 'buttongroup',
							columns : 5,
							defaults : {
								margin : '5 auto'

							},
							items : [ {
								html : '<i class="icon-zoom-in">&nbsp;</i>&nbsp;Dimensions',
								tooltip : 'redimensionner automatiquement l\'image',
								menu : sizeMenu
							} ]
						};

						var menuItem4 = {
								style:'margin-left:20px',
								title : '&nbsp;',
								xtype : 'buttongroup',
								columns : 5,
								defaults : {
									margin : '5 auto'

								},
								items : [ {
									html : '<i class="icon-mail-reply">&nbsp;</i>&nbsp;Retour',
									tooltip : 'Revenir en arri&egrave;re',
									id:'stepBack',
									disabled:true
								},
								{
									html : '<i class="icon-mail-forward">&nbsp;</i>&nbsp;Avance',
									tooltip : 'Etape suivante',
									id:'stepForward',
									disabled:true
								}]
							};

						
						this.mainPanel = Ext.widget('panel', {
							id : 'mainEditorPanel',
							region : 'center',
							layout : 'fit',
							tbar : [ menuItem, menuItem3, menuItem2,menuItem4, '->', {
								xtype : 'button',
								text : 'Valider',
								icon : 'img/icons/accept.png',
								id : 'doTransformImage',
								tooltip : 'Valider la modification',
								hidden:true
							}, {
								xtype : 'button',
								text : 'Annuler',
								icon : 'img/icons/cross.png',
								id : 'cancelTransformImage',
								tooltip : 'Annuler la modification',
								hidden:true
							} ]
						});

					

						this.items = [ this.mainPanel ]

						this.callParent(arguments);
						this.on('show', this.displayImage, this);
						// this.on('resize', this.resizeWin, this);

					},
					displayImage : function() {

						var bgUrl = this.record.get('sitePath') + '/'
								+ TextoCMS.site.raw.media_dir
								+ this.record.get('path');

						var w = this.mainPanel.getWidth();
						var h = this.mainPanel.body.getHeight();

						var dim = TextoCMS.Utils.calculateRatio(w, h,
								this.record.get('width'), this.record
										.get('height'));

						this.image = new Element('img', {
							src : bgUrl,
							id : "ImageEditorAsset",
							style : 'width:' + parseInt(dim.width)
									+ 'px; height:' + parseInt(dim.height)
									+ 'px;position:absolute;'
						});

						this.div = new Element('div', {
							id : "ImageEditorDiv",
							style : 'width:' + parseInt(dim.width)
									+ 'px; height:' + parseInt(dim.height)
									+ 'px; top:' + (h - parseInt(dim.height))
									/ 2 + 'px; left:'
									+ (w - parseInt(dim.width)) / 2
									+ 'px; position:absolute;'
						});
						
						this.imgOverlay=new Element('img', {
							src:'img/blank.png',
							id : "ImageEditorOverlay",
							style : 'width:' + parseInt(dim.width)
									+ 'px; height:' + parseInt(dim.height)
									+ 'px; position:absolute;overflow:hidden; background:url('+bgUrl+') no-repeat left top; background-size:cover'+ parseInt(dim.width)
									+ 'px ' + parseInt(dim.height)+'px'
						});
						
						//this.imgOverlay.appendChild(this.image)
						this.div.appendChild(this.imgOverlay);
						this.mainPanel.body.dom.appendChild(this.div);// ,

						this.draggable = new Draggable('ImageEditorDiv');
						// resizable:true,
						// width:'auto',
						// height:'100%'});
						// //style:'background:url('+bgUrl+')
						// no-repeat 50% 50%;
						// background-size:contain'});
						// this.cropper = new Cropper.Img('ImageEditorAsset');

						Ext.getCmp('info').update(
								' Taille r&eacute;elle : '
										+ this.record.get('width') + 'px * '
										+ this.record.get('height') + 'px');
						Ext.getCmp('ratio').update(
								'Taille actuelle : ' + parseInt(dim.width)
										+ '*' + parseInt(dim.height) + 'px ('
										+ parseInt(dim.ratio * 100) + '%)');
						Ext.getCmp('ratioSlider').setValue(
								parseInt(dim.ratio * 100));
						// resizeWin;

					}

				});