Ext.define('TextoCMS.model.medias.FileReaderModel',{

extend : 'Ext.data.Model',
								fields : [ {
									name : 'fileName',
									type : 'string'
								}, {
									name : 'fileData'
								},
								{
									name:'bgImage'
								}]
});