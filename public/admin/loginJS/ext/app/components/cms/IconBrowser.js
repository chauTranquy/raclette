/**
 * @class Ext.chooser.IconBrowser
 * @extends Ext.view.View
 * @author Ed Spencer
 * 
 * This is a really basic subclass of Ext.view.View. All we're really doing here is providing the template that dataview
 * should use (the tpl property below), and a Store to get the data from. In this case we're loading data from a JSON
 * file over AJAX.
 */
Ext.define('CMS.components.cms.IconBrowser', {
    extend: 'Ext.view.View',
    alias: 'widget.iconbrowser',
    
    uses: 'Ext.data.Store',
   cls:'img-chooser-view',
	singleSelect: true,
	autoHeight:true,
	bodyStyle:'background-color:transparent',
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    
    tpl: new Ext.XTemplate(
        // '<div class="details">',
            '<tpl for=".">',
                '<div class="thumb-wrap" data-qtip="{[this.qtip(values.name,values.size)]}">',
                '<div class="thumb">',
                '<tpl if="this.isImage(ext)">',
                    (!Ext.isIE6? '<img src="{url}" />' : 
                    '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{url}\')"></div>'),
                    '</tpl>',
                    '<tpl if="this.isImage(ext)==false">',
                    (!Ext.isIE6? '<img src="img/{ext}Big.gif" />' : 
                    '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.gif\')"></div>'),
                    '</tpl>',                    
                    '</div>',
                    '<span>{name}</span>',
                '</div>',
            '</tpl>',{
            	scope:this,
            	compiled:true,
            	isImage:function(ext){
            		 arrayImageExt=['jpg','jpeg','png','gif'];           		
            		return(arrayImageExt.indexOf(ext.toLowerCase())>-1);
            		
            	}.bind(this),
            	qtip:function(name,size){
            		
            		return name+(size?' - '+size:'');
            		
            	}
            
            	
            	
            }),
            

initComponent: function() {
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['path','ext','type','name',{name:'width', type:'int'},{name:'height', type:'int'},{name:'url', mapping:'path',convert:function(v, record){
            	var path=v;
            
            	if(record.get('type')=="file")return '/image/thumb/90/'+record.get('ext')+'/'+(v.replace('.'+record.get('ext'),''));
            	
            	//if(record.ext=='.pdf'&&record.ext!='.flash')
            	
            	return '/medias'+v;
            	
            }},'size','date'],
            proxy: {
                type: 'ajax',
                url : this.url,
                actionMethods:'post',
                reader: {
                    type: 'json',
                    root: 'result'
                }, 
                extraParams: {
     		       API: 'Application_Model_FileManager',
     		        APICall: 'getFolderDetail',
     		        folder:this.root,
     		       filter:this.filter
            }
            },
            sorters: [
                      {
                          property : 'type',
                          direction: 'DESC'
                      },
                      {
                          property : 'name',
                          direction: 'ASC'
                      }
                  ]
        });
        
     this.on('refresh',function(view){
    	 $$('#'+view.container.dom.id+' img').invoke('observe','load',this.centerImage.bindAsEventListener(this));
    	 
     },this);

        this.callParent(arguments);
       
        this.store.sort();
    },
    centerImage:function(e){
    	Event.stop(e);
    	
    	var elt = Event.findElement(e,'img');
    	var offsetLeft=(elt.up('div.thumb').getDimensions().width-elt.getDimensions().width)/2;
    	var offsetTop=(elt.up('div.thumb').getDimensions().height-elt.getDimensions().height)/2;
    	elt.setStyle({position:'absolute',left:offsetLeft+'px',top:offsetTop+'px'});
    	
    }
});