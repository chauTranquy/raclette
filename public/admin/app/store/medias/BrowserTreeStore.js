Ext.define('TextoCMS.store.medias.BrowserTreeStore',
		{	
	extend:'Ext.data.TreeStore',
	requires:['TextoCMS.model.medias.BrowserTreeModel'],
	model:'TextoCMS.model.medias.BrowserTreeModel',
	//type:'memory',
	proxy: {
        type: 'memory'},
	autoLoad:false,
	sorters: [{
                  property : 'text',
                  direction: 'ASC'
              }]
	
		}
		
			
		);