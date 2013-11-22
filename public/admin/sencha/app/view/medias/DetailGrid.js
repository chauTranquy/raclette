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
		width:90,
		sortable:false,
		renderer:function(v, meta,record){
			

			
			var  arrayImageExt=['jpg','jpeg','png','gif'];
			
			if(arrayImageExt.indexOf(v)>-1)url = record.get('url');
			else url='img/'+v+'Big.gif';
			return '<div class="thumb" style="align:center"><img src="'+url+'" /></div>';
			
			
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