Ext.define('TextoCMS.view.dashboard.DashboardTab',{
	extend:'Ext.panel.Panel',
	title:'Statistiques',
	iconCls:'whiteboard',
	layout: {
	    type: 'fit'
	},
	//bodyPadding:10,
	//defaults:{margin:5, bodyPadding:10},
	requires:['TextoCMS.view.dashboard.Analytics'],
	alias:'widget.dashboard',
	initComponent:function(){
		
		
		this.items=[{xtype:'analytics', region:'center', layout:'border', bodyPadding:10}];//, {title:'OK', region:'east', collapsible:true}];
		
		this.callParent(arguments);
		
	}
	
});