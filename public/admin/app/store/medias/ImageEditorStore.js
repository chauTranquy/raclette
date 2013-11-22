Ext.define('TextoCMS.store.medias.ImageEditorStore',{
	requires:['TextoCMS.model.medias.ImageEditorModel'],
	extend:'Ext.data.Store',
		storeId:'ImageEditorStore',
		model : 'TextoCMS.model.medias.ImageEditorModel',
		proxy:{
			type:'memory'
		}
	
})