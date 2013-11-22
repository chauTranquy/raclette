/**
 * @class Ext.chooser.InfoPanel
 * @extends Ext.panel.Panel
 * @author Ed Spencer
 * 
 * This panel subclass just displays information about an image. We have a simple template set via the tpl property,
 * and a single function (loadRecord) which updates the contents with information about another image.
 */
Ext.define('TextoCMS.components.cms.InfoPanel', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.infopanel',
    id: 'img-detail-panel',
    tpl: new Ext.XTemplate(
        '<div class="details">',
            '<tpl for=".">',
            '<tpl if="this.isImage(ext)">',
                    (!Ext.isIE6? '<img src="{[this.displayURL(values.ext,values.path)]}" />' : 
                    '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'inc/imageResize.php?path=medias/{path}&thumbWidth=200\')"></div>'),
                    '</tpl>',
                    '<tpl if="this.isImage(ext)==false">',
                    (!Ext.isIE6? '<img src="img/{ext}Big.gif" />' : 
                    '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.gif\')"></div>'),
                    '</tpl>',
                '<div class="details-info">',
                    '<b></b>',
                    '<tpl if="this.isFile(type)">',
                    '<span><a href="/medias{path}" target="_blank">{name}</a></span>',
                    '<br />',
                    '</tpl>',
                    '<tpl if="this.isFile(type)&&width">',
                    '<span>Dimensions : {width}x{height}px</span>',
                    '<br />',
                    '</tpl>',
                    '<tpl if="size">{size}<br /></tpl>',
                    'Cr&eacute;e le {date}','</div>',
            '</tpl>',
        '</div>',{
        	compiled:true,
        	displayURL:function(ext,path){
        		
        		
        		return "/image/thumb/200/"+ext+"/"+path.replace("."+ext,"");
        		
        		
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
        	
        this.body.hide();
        this.tpl.overwrite(this.body, image.data);
        this.body.slideIn('l', {
            duration: 250
        });
    }
});