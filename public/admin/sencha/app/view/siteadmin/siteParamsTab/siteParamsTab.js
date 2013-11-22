Ext.define('TextoCMS.view.siteadmin.siteParamsTab.siteParamsTab', {
	extend : 'Ext.panel.Panel',
	layout : 'accordion',
	alias : 'widget.siteparams',
	iconCls : 'siteAdminPanel',
	title : 'Param&egravetres du site',
	initComponent : function() {
		this.items = [ {
			xtype : 'panel',
			iconCls : 'siteAdminPanel',
			title : 'Param&egravetres du site',
			items : [ {
				xtype : 'siteparamsform'
			} ]
		}, {xtype:'panel',	title : 'Fichier Javascripts et Css',flex : 1, items:{xtype:'jscssform'}},
		{xtype:'panel',title:'Google Analytics', items:[{xtype:'GoogleAnalyticsForm'}]}];

		this.callParent(arguments);

	}

});