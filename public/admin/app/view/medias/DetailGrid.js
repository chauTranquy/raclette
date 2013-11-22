Ext.define('TextoCMS.view.medias.DetailGrid', {
	extend : 'Ext.grid.Panel',
	alias:'widget.mediadetailGrid',
	
	border:false,
	enableColumnHide:false,
	enableColumnMove:false,
	columnLines :false,
	rowLines:false,
	autoScroll:true,
	forceFit:true,
	columns :{
		defaults:{
			menuDisabled:true,
			align:'center',
			fixed:true
		},
		items:[{
		align:'center',
		text : '',
		dataIndex : 'ext',
		width:150,
		
		sortable:false,
		renderer:function(v, meta,record){

			
			var  arrayImageExt=['jpg','jpeg','png','gif'];
			
			if(arrayImageExt.indexOf(v)>-1)url = record.get('url');
			else {

				var extArray =$H(arrayExt).toArray().flatten();
        		extArray=Ext.Array.merge(extArray, otherFileExt);

        		extArray.push('folder');
        		if(extArray.indexOf(v)>-1){
        			
	
        			url='img/'+v+'Big.png';
        			
        		}
        		
        		else if(arrayTTF.indexOf(v)>-1) url='img/'+'fontBig.png';
        		else url='img/'+'otherBig.png';
        		

			}
			
			
			
			return '<div class="thumb" style="align:center; height:75px; width:150px;"><div style="background:url('+url+') no-repeat 50% 50%;width:100%; height:100%;"></div></div>';
			
			
		}
	},
	{text:'Nom', dataIndex:'name'},
	{text:'Date', dataIndex:'date'},
	{text:'Type', dataIndex:'ext', renderer:function(v,record){
		return v=="folder"?"Dossier":"Fichier "+v.toUpperCase();
		
	}},
	{text:'Poids', dataIndex:'size'},
	{text:'Dimensions', dataIndex:'width', renderer:function(v, meta, record){
		
		if(v==0) return "";
		return v+'x'+record.get('height')+'px';
		
	}}]
	}

});