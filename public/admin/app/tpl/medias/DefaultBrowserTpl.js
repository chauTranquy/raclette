Ext.define('TextoCMS.tpl.medias.DefaultBrowserTpl',{
	extend: "Ext.XTemplate",
	tpl:['<tpl for=".">',
         '<div class="thumb-wrap" data-qtip="{[this.qtip(values.name,values.size)]}">',
         '<div class="thumb">',
         '<tpl if="this.isImage(ext)">',
             (!Ext.isIE6? '<div style="background:url({url}) no-repeat 50% 50%;width:100%; height:100%;"></div>' : 
             '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{url}\')"></div>'),
             '</tpl>',
             '<tpl if="this.isImage(ext)==false">',
             (!Ext.isIE6? '<div style="background:url(img/{[this.iconUrl(values.ext)]}) no-repeat 50% 50%;width:100%; height:100%;"></div>' : 
             '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.png\')"></div>'),
             '</tpl>',                    
             '</div>',
             '<span>{name}</span>',
         '</div>',
     '</tpl>'],
	constructor:function(config){


		
        // '<div class="details">',
           this.callParent(this.tpl);
	},
            	scope:this,
            	compiled:true,
            	isImage:function(ext){
                       if(!ext) return false;
            		 arrayImageExt=arrayExt.image;           		
            		return(arrayImageExt.indexOf(ext.toLowerCase())>-1);
            		
            	}.bind(this),
            	qtip:function(name,size){
            		if(name=="...")name="retour au r&eacute;pertoire parent";
            		return name+(size?' - '+size:'');
            		
            	},
            	iconUrl:function(ext){
            		var extArray =$H(arrayExt).toArray().flatten();
            		extArray=Ext.Array.merge(extArray, otherFileExt);
            		
            		extArray.push('folder');
            		if(extArray.indexOf(ext)>-1){
            			return ext+'Big.png';
            			
            		}
            		
            		if(arrayTTF.indexOf(ext)>-1) return 'fontBig.png';
            		return 'otherBig.png';
            		
            		
            		
            		
            		
            	}

            
	
});