Ext.define('TextoCMS.tpl.medias.IconeBrowserTpl',{
	extend: "TextoCMS.tpl.medias.DefaultBrowserTpl",
	tpl:['<tpl for=".">',
         '<div class="thumb-wrap big" data-qtip="{[this.qtip(values.name,values.size)]}">',
         '<div class="thumb">',
         '<tpl if="this.isImage(ext)">',
             (!Ext.isIE6? '<img src="{[this.imageURL(values.url)]}" />' : 
             '<div style="width:150px;height:150px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{[this.imageURL(values.url)]}\')"></div>'),
             '</tpl>',
             '<tpl if="this.isImage(ext)==false">',
             (!Ext.isIE6? '<img src="img/{[this.iconUrl(values.ext)]}" />' : 
             '<div style="width:150px;height:150px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.png\')"></div>'),
             '</tpl>',                    
             '</div>',
             '<span>{name}</span>',
         '</div>',
     '</tpl>'],
	constructor:function(config){
           this.callParent(this.tpl);
	},
            	scope:this,
            	compiled:true,
            	imageURL:function(url){
            		return url.replace('90','150');
            		
            	}

            
	
});