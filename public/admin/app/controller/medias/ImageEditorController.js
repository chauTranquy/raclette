Ext
		.define(
				'TextoCMS.controller.medias.ImageEditorController',
				{
					description : 'Editeur d\'images',
					extend : 'TextoCMS.controller.BaseController',
					views : [ 'medias.ImageEditor' ],
					stores : [ 'medias.ImageEditorStore' ],
					models : [ 'medias.ImageEditorModel' ],
					refs : [ {
						ref : 'ImageEditor',
						selector : 'ImageEditor'
					}, {
						ref : 'modifyFileBtn',
						selector : 'browsertoolbar [iconCls=modifyFile]'
					}, {
						ref : 'infoPanel',
						selector : 'mediastab infopanel'
					}, {
						ref : 'toolbar',
						selector : 'browsertoolbar'
					}, {
						ref : 'ratioSlider',
						selector : '#ratioSlider'
					}, {
						ref : 'resizeBtn',
						selector : '#resizeBtn'
					}, {
						ref : 'cropBtn',
						selector : '#cropBtn'
					}, {
						ref : 'doTransformImage',
						selector : '#doTransformImage'
					}, {
						ref : 'cancelTransformImage',
						selector : '#cancelTransformImage'
					},
					{ref:'stepBack', selector:'#stepBack'},
					{ref:'stepForward', selector:'#stepForward'}
					],

					init : function() {
						this.control({
							'browsertoolbar [iconCls=modifyFile]' : {
								click : this.openImageEditor

							},
							'#ratioSlider' : {
								change : this.changeSliderRatio

							},
							'ImageEditor' : {
								resize : this.resizeWin,
								afterlayout : this.initDraggable

							},
							'#resizeBtn, #cropBtn' : {
								toggle : this.toolsToogled

							},
							'#sizeMenu menuitem' : {
								click : this.resizeImage

							},
							'#cancelTransformImage' : {
								click : this.cancelTransformation

							},
							'#doTransformImage' : {
								click : this.transformImage

							},
							'#stepBack':{
								click:this.rollBack
								
							},
							'#stepForward':{
								click:this.rollBack
								
							}
						});

						this.callParent(arguments);

						this.loadScript('/admin/js/cropper/cropper.js');
						this.loadStyleSheet('/admin/js/cropper/cropper.css');

					},
					openImageEditor : function() {

						this.currentImage = this.getInfoPanel().record;
						this.currentIndex =0;
						this.curCrop = null;

						this.store = Ext
								.create('TextoCMS.store.medias.ImageEditorStore');
						//this.store.on('add', this.storeUpdated, this);
						if (!this.getImageEditor())
							Ext.widget('ImageEditor', {
								record : this.currentImage
							});

						this.getImageEditor().show();
						this.addStep();

					},
					changeSliderRatio : function(slider, newValue) {
						return;
						var newWidth = parseInt(this.currentImage.get('width')
								* newValue / 100);
						var newHeight = parseInt(this.currentImage
								.get('height')
								* newValue / 100);

						Ext.getCmp('ratio').update(
								'Taille actuelle : ' + parseInt(newWidth) + '*'
										+ parseInt(newHeight) + 'px ('
										+ newValue + '%)');

						$('ImageEditorOverlay').setStyle(
								{
									width : parseInt(newWidth) + 'px',
									height : parseInt(newHeight) + 'px',
									top : (this.getImageEditor().mainPanel
											.getHeight() - newHeight)
											/ 2 + 'px',
									left : (this.getImageEditor().mainPanel
											.getWidth() - newWidth)
											/ 2 + 'px'
								});

					},
					resizeWin : function() {

						if ($('ImageEditorDiv'))
							$('ImageEditorDiv')
									.setStyle(
											{
												top : (this.getImageEditor().mainPanel.body
														.getHeight() - $(
														'ImageEditorDiv')
														.getHeight())
														/ 2 + 'px',
												left : (this.getImageEditor().mainPanel
														.getWidth() - $(
														'ImageEditorDiv')
														.getWidth())
														/ 2 + 'px'
											});

					},
					initDraggable : function() {

						this.draggable = this.getImageEditor().draggable;
						this.getImageEditor().draggable.startDrag = Ext.bind(
								this.startDrag, this);
						this.getImageEditor().draggable.endDrag = Ext.bind(
								this.endDrag, this);

					},

					toolsToogled : function(btn) {
						if (btn.id == "resizeBtn") {

							if (btn.pressed)
								this.initResizer();
							else
								this.destroyResizer();
							return;
						}
						;

						if (btn.pressed)
							this.initCropper();
						else
							this.removeCropper();

					},
					updateResizeInfos : function(record) {// resizer, width,
						var width = record.get('width'), height = record
								.get('height'), coords = record.get('coords'), imgWidth = record
								.get('imgWidth'), imgHeight = record
								.get('imgHeight'), left=record.get('left'), top=record.get('top');
					
						$('ImageEditorDiv').setStyle({
							width : width + 'px',
							height : height + 'px'
						});

						if ($('ImageEditorOverlay')){
							
							$('ImageEditorOverlay').setStyle({
								width : width + 'px',
								height : height + 'px'
								//backgroundSize:imgWidth+'px '+imgHeight+'px'
							});

						
							$('ImageEditorOverlay').setStyle({
								backgroundPosition : left + 'px '+top + 'px',
								
							});
							
							
						}
						

						Ext.getCmp('ratio').update(
								'Taille actuelle : ' + parseInt(width) + '*'
										+ parseInt(height) + 'px ');

					},

					startDrag : function() {

					},
					endDrag : function() {
						console.log(this.draggable);

					},
					destroyResizer : function() {
						if (this.resizer)
							this.resizer.destroy();
						this.resizer = null;

					},

					initResizer : function() {
						this.removeCropper();

						this.displayValidationButtons(false);

						this.resizer = Ext
								.create(
										'Ext.resizer.Resizer',
										{
											target : 'ImageEditorDiv',
											minWidth : 50,
											minHeight : 50,
											preserveRatio : true,
											preserveRatio : true,
											dynamic : true,
											handles : 'all',
											pinned : true,
											listeners : {
												scope : this,
												resizedrag : function(resizer,
														width, height) {
													this
															.displayValidationButtons(true);
													this.getCurrentStep().set(
															'width', width);
													this.getCurrentStep().set(
															'height', height);
													this.getCurrentStep().set(
															'imgWidth', width);
													this.getCurrentStep()
															.set('imgHeight',
																	height);
													this.updateResizeInfos(this
															.getCurrentStep());
												}
											}
										});
						
						Ext.get('ImageEditorOverlay').addCls('resize');
						

					},
					resizeImage : function(item, e) {
						var ratio = item.value, newWidth = this.currentImage
								.get('width')
								* ratio, newHeight = this.currentImage
								.get('height')
								* ratio;

						if (this.resizer)
							this.resizer.resizeTo(newWidth, newHeight);
						this.getCurrentStep().set('width', newWidth);
						this.getCurrentStep().set('height', newHeight);

						this.updateResizeInfos(this.getCurrentStep());

					},
					initCropper : function() {
						this.displayValidationButtons(false);
						this.destroyResizer();
						var dims = $('ImageEditorOverlay').getDimensions();
						
						
						
						
						if (this.curCrop == null)
							this.curCrop = new Cropper.Img('ImageEditorOverlay',
									{
										displayOnInit : true,
										onloadCoords : {
											x1 : 0,
											y1 : dims.height / 4,
											x2 : dims.width,
											y2 : dims.height / 4 + dims.height
													/ 2
										},
										minWidth : 10,
										minHeight : 10,
										onEndCrop : Ext.bind(this.onEndCrop,
												this)
									});
						else
							this.curCrop.reset();

					},
					removeCropper : function() {

						if (this.curCrop != null)
							this.curCrop.remove();
						this.curCrop = null;

					},
					onEndCrop : function(coords, dimensions) {

						this.displayValidationButtons(true);

					},

					displayValidationButtons : function(display) {

						if (display) {
							this.getDoTransformImage().show();
							this.getCancelTransformImage().show();
						} else {
							this.getDoTransformImage().hide();
							this.getCancelTransformImage().hide();
						}

					},

					addStep : function() {

						var coords = {}, imgWidth = width = $(
								'ImageEditorOverlay').getWidth(), imgHeight = height = $(
								'ImageEditorOverlay').getHeight(), bgPos=$('ImageEditorOverlay').getStyle('backgroundPosition').split(' '),left = isNaN(parseInt(bgPos[0]))?0:parseInt(bgPos[0]), top = isNaN(parseInt(bgPos[1]))?0:parseInt(bgPos[1]);
						
						if(isNaN(left)) left=0;
						if(isNaN(top)) top=0;
						if (this.curCrop !== null) {
							coords = this.curCrop.areaCoords;
							var width = coords.x2 - coords.x1;

							var height = coords.y2 - coords.y1;
							top = -1 * coords.y1+top;
							left = -1 * coords.x1+left;

						}
						
	
						this.store.add({
							width : width,
							height : height,
							imgWidth : imgWidth,
							imgHeight : imgHeight,
							left : left,
							top : top

						});
						this.currentIndex = this.store.getCount() - 1;
						
						this.storeUpdated();

					},
					cancelTransformation : function() {

						this.displayValidationButtons(false);
						this.getCropBtn().toggle(false);
						this.getResizeBtn().toggle(false);

						var data = this.getCurrentStep();

						this.processImage(data);
						this.storeUpdated();

					},
					processImage : function(record) {

						this.updateResizeInfos(record);
						this.resizeWin();

					},
					transformImage : function(btn,confirm) {

						if(confirm==undefined) confirm=false;
						console.log(confirm);
						if(this.currentIndex<this.store.getCount()-1)return Ext.Msg.confirm('Attention','Si vous modifiez l\'image &agrave; ce stade, vous allez perdre les modifications faites aux &eacute;tapes suivantes.<br />Voulez-vous continuer ?', function(btn){
							console.log(btn);
							
							if(btn=="no") return;
							var records = this.store.getRange(this.currentIndex+1, this.store.getCount()-1);
							console.log(records);
							this.store.remove(records);
							this.transformImage(true);
							
						}, this);
						
						
						this.addStep();
						var data = this.getCurrentStep();
						this.processImage(data);
						this.displayValidationButtons(false);
						this.getCropBtn().toggle(false);
						this.getResizeBtn().toggle(false);

					},

					getCurrentStep : function() {

						return this.store.getAt(this.currentIndex);

					},
					storeUpdated:function(st){
					
						this.getStepForward().setDisabled(this.currentIndex==this.store.getCount()-1||this.store.getCount()==1);
						this.getStepBack().setDisabled(this.currentIndex==0);
						
					},
					rollBack:function(btn){
						if(btn.id=="stepBack"){
						
						if(this.currentIndex==0) return;
						this.currentIndex--;
						
						}
						else{
							if(this.currentIndex==this.store.getCount()-1) return;
							this.currentIndex++;
							
						}
						
						this.cancelTransformation();
						
						
						
					}

				});
