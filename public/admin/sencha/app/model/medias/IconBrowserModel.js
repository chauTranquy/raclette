Ext.define('TextoCMS.model.medias.IconBrowserModel', {
	extend : 'Ext.data.Model',
	fields : [
			'path',
			'ext',
			'type',
			'name',
			'baseFolder',
			{
				name : 'utilisation',
				type : 'int'
			},
			{
				name : 'width',
				type : 'int'
			},
			{
				name : 'sortName',
				mapping : 'name',
				convert : function(v) {
					return v.toLowerCase();
				}
			},
			{
				name : 'height',
				type : 'int'
			},
			{
				name : 'url',
				mapping : 'path',
				convert : function(v, record) {
					var v= record.get('path');
					
					v = v.replace('\\','/');
									
					if (record.get('type') == "file")url='/image/thumb/90/' + record.get('ext') + '/'
					+ (v.replace('.' + record.get('ext'), ''))+(record.get('baseFolder')!==null&&record.get('baseFolder')!==''?'?base='+record.get('baseFolder'):'');

					else url='/medias' + v;
					return record.get('sitePath')+url;

				}
			}, 'size', 'date','sitePath' ],
			proxy:{type:'texto'}
});