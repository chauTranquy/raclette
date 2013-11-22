Ext.define('TextoCMS.tpl.medias.ListeBrowserTpl',{
	extend: "TextoCMS.tpl.medias.DefaultBrowserTpl",
	tpl:['<table><thead><tr>',
         '<th colspan="2">Nom</th>',
         '<th>Date</th>',
         '<th>Type</th>',
         '<th>Poids</th>',
         '<th>Dimensions</th>',
         '</tr></thead>',
         '<tbody><tpl for=".">',
         '<tr class="thumb-wrap" data-qtip="{[this.qtip(values.name,values.size)]}">',
         '<td class="tdImage"><div class="thumb">',
         '<tpl if="this.isImage(ext)">',
             (!Ext.isIE6? '<img src="{[this.imageURL(values.url)]}" />' : 
             '<div style="width:150px;height:150px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{[this.imageURL(values.url)]}\')"></div>'),
             '</tpl>',
             '<tpl if="this.isImage(ext)==false">',
             (!Ext.isIE6? '<img src="img/{ext}Big.gif" />' : 
             '<div style="width:150px;height:150px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'img/{ext}Big.gif\')"></div>'),
             '</tpl>',                    
             '</div></td>',
             '<td>{name}</td>',
             '{[this.fileInfo(values)]}',
         '</tr>',
     '</tpl></tbody></table>'],
	
	constructor:function(config){

        // '<div class="details">',
           this.callParent(this.tpl);
	},
            	scope:this,
            	compiled:true,
            	fileInfo:function(values){
            		
            		var html = '<td>'+values.date+'</td>'+
            					'<td>'+(values.ext=="folder"?"Dossier":"Fichier "+values.ext.toUpperCase())+'</td>'+
            					'<td>'+values.size+'</td>'+
            					'<td>'+(values.ext=="folder"||values.width==0?"":values.width+'x'+values.height+'px')+'</td>';
            		return html;
            		
            		
            		
            	},
            	imageURL:function(url){
            		return url.replace('90','90');
            		
            	}
});