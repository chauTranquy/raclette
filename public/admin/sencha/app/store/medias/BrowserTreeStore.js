Ext.define('TextoCMS.store.medias.BrowserTreeStore',
		{	
	extend:'Ext.data.TreeStore',
	requires:['TextoCMS.model.medias.BrowserTreeModel'],
	model:'TextoCMS.model.medias.BrowserTreeModel',
	
	autoLoad:false,
	sorters: [{
                  property : 'text',
                  direction: 'ASC'
              }]
	
		});