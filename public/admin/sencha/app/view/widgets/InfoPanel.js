/**
 * @class Ext.chooser.InfoPanel
 * @extends Ext.panel.Panel
 * @author Ed Spencer
 * 
 * This panel subclass just displays information about an image. We have a simple template set via the tpl property,
 * and a single function (loadRecord) which updates the contents with information about another image.
 */
Ext.define('TextoCMS.view.widgets.InfoPanel', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.infopanel',
    id: 'img-detail-panel',
    tpl: new Ext.XTemplate(
        '<div class="details">',
            '<tpl for=".">',
            '<tpl if="this.isImage(ext)">',
                    (!Ext.isIE6? '<div class="loader2" width:200px; height:200px;"><div style="width:200px; height:200px; background:url({[this.displayURL(values.ext,values.path, values)]}) no-repeat 50% 50%; background-size:contain"></div></div>' : 
                    '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'inc/imageResize.php?path=medias/{path}&thumbWidth=200\')"></div>'),
                    '</tpl>',
                    '<tpl if="this.isImage(ext)==false">',
                    (!Ext.isIE6? '<img src="img/{ext}Big.png" />' : 
                    '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.png\')"></div>'),
                    '</tpl>',
                '<div class="details-info">',
                    '<b></b>',
                    '<tpl if="this.isFile(type)">',
                    '<span><a href="{sitePath}/medias{path}" target="_blank" {[this.displayLinkClass(values.ext)]}>{name}</a></span>',
                    '<br />',
                    '</tpl>',
                    '<tpl if="!this.isFile(type)">',
                    '<span>{name}</span>',
                    '<br />',
                    '</tpl>',
                    '<tpl if="this.isFile(type)&&width">',
                    '<span>Dimensions : {width}x{height}px</span>',
                    '<br />',
                    '</tpl>',
                    '<tpl if="size">{size}<br /></tpl>',
                    'Cr&eacute;e le {date}',
                    '<tpl if="this.isFile(type)">',
                    '<br />Utilis&eacute; {utilisation} fois</div>',
                    '</tpl>',
            '</tpl>',
        '</div>',{
        	compiled:true,
        	displayLinkClass:function(ext){
        		if(this.isImage(ext))return 'class="popinLink"';
        		
        	},
        	displayURL:function(ext,path, values){
        	        		
        		return values.sitePath+"/image/thumb/200/"+ext+"/"+path.replace("."+ext,"");
        		
        		
        	},
        	isImage:function(ext){
        		arrayImageExt=['jpg','jpeg','png','gif'];           		
        		return(arrayImageExt.indexOf(ext.toLowerCase())>-1);
       	},
       	isFile:function(type){
       		
       		return type=="file";
       	
       	}
        	
        }) ,

    /**
     * Loads a given image record into the panel. Animates the newly-updated panel in from the left over 250ms.
     */
    loadRecord: function(image) {
        	
        
        if(!image||image.get('type')=="folderBack") return this.body?this.body.hide().update():null;
        if(this.record==image) return
        this.record=image;
        
        this.tpl.overwrite(this.body, image.data);
       this.fireEvent('afterlayout', this);
        this.body.slideIn('l', {
            duration: 250
        });
    }
});