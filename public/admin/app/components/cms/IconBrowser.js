Ext.define('TextoCMS.components.cms.IconBrowser', {
    extend: 'Ext.view.View',
    alias: 'widget.iconbrowser',
    requires:['TextoCMS.store.medias.IconBrowserStore','TextoCMS.tpl.medias.DefaultBrowserTpl'],
     cls:'img-chooser-view',
	singleSelect: true,
	autoHeight:true,
	bodyStyle:'background-color:transparent',
    overItemCls: 'x-view-over',
    itemSelector: '.thumb-wrap',
    root:null,
    shrinkWrap:1,
    filter:'all',
    baseFolder:null,
    displayAllFile:false,
    displayFile:true,
    tpl: Ext.create('TextoCMS.tpl.medias.DefaultBrowserTpl'),
            

initComponent: function() {

        this.store = Ext.create('TextoCMS.store.medias.IconBrowserStore');
        this.store.model.getProxy().setExtraParam('API', 'Application_Model_FileManager',{autoLoad:true});
		this.store.model.getProxy().setExtraParam('APICall', 'getFolderDetail');
		this.store.model.getProxy().setExtraParam('folder', this.root);
		this.store.model.getProxy().setExtraParam('filter', this.filter);
		this.store.model.getProxy().setExtraParam('displayFile', this.displayFile);
		this.store.model.getProxy().setExtraParam('baseFolder', this.baseFolder);
		this.store.model.getProxy().setExtraParam('displayAllFile', this.displayAllFile);
		this.store.model.getProxy().setExtraParam('id_site', TextoCMS.siteId);
		
		this.store.model.getProxy().setReader({type: 'json',root: 'result'});
		
	//	console.log(this.store.model.getProxy());
		
		
    

        this.callParent(arguments);
       this.store.load();
        this.store.sort();
    },
    centerImage:function(e){
    	Event.stop(e);
    	    	
    	var elt = Event.findElement(e,'img');
    	var offsetLeft=(elt.up('.thumb').getDimensions().width-elt.getDimensions().width)/2;
    	var offsetTop=(elt.up('.thumb').getDimensions().height-elt.getDimensions().height)/2;
    	elt.setStyle({position:'absolute',left:offsetLeft+'px',top:offsetTop+'px'});
    	
    }
});