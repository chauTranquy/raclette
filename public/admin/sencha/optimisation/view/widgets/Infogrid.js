Ext.define('TextoCMS.view.widgets.Infogrid',{alias:'widget.infogrid',extend:'Ext.grid.property.Grid',listeners:{beforeedit:function(e){return false}},enableColumnMove:false,enableColumnHide:false,nameColumnWidth:130,hideHeaders:true,initComponent:function(){this.callParent(arguments)}});