Ext.define('TextoCMS.view.medias.FileReaderDataview',{
	extend:'Ext.view.View',
	requires:['TextoCMS.store.medias.FileReaderStore'],
	alias:'widget.FileReaderDataview',
		
		height : 350,
		width : 550,
		//id : "dragload",
		cls:'dragload',
		multiSelect: true,
		autoScroll:true,
		 plugins: [
	                Ext.create('Ext.ux.DataView.DragSelector', {})
	                ],
	                
	    html:'<input type="file" multiple="multiple" name="fileUploadField" id="fileUploadField" style="opacity:0; position:absolute;left:-50000px;"/>',
		itemSelector : 'div.thumb-wrapUpload',
		tpl : new Ext.XTemplate(
				'<tpl for="."><div class="thumb-wrapUpload" style="background-image:url({bgImage});" data-qtip="{[this.displayQtip(values.fileData)]}" id="tpl_{fileName}"></div></tpl>',{
					displayQtip:function(data, xindex){
						return data.name+' '+Ext.util.Format.fileSize(data.size);
					}
					
					
				}),
				initComponent:function(){
				
					var store= Ext.create('TextoCMS.store.medias.FileReaderStore');
					this.store=store;
					this.callParent(arguments);
					

					
				}

	
	
});