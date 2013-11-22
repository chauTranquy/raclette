Ext.define('TextoCMS.store.medias.IconBrowserStore',{
	extend:'Ext.data.Store',
	requires:['TextoCMS.model.medias.IconBrowserModel'],
	model:'TextoCMS.model.medias.IconBrowserModel',
	 sorters: [
               {
                   property : 'type',
                   direction: 'DESC'
               },
               {
                   property : 'sortName',
                   direction: 'ASC'
               }
           ]
	
});