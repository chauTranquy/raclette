Ext.define('TextoCMS.view.dashboard.Analytics', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.analytics',
	title : 'Statistiques des visites',
	tbar : [ {
		text : 'Se connecter &agrave; Google',
		id : 'connectGoogle',
		iconCls : 'gAnalytics',
		margin : '0 10'
	}, {
		xtype : 'label',
		id : 'googleAccount',
		iconCls : 'gAnalytics'
	},'->',{
		text : 'Voir toutes les statistiques Google Analytics',
		id : 'seeGoogle',
		iconCls : 'gAnalytics',
		hidden:true,
		margin : '0 10'
	} ],
	initComponent : function() {

		this.items = [ {
			region : 'north',
			border : false,
			height : 50,
			layout : 'hbox',
			defaults : {
				margin : '0 5'
			},
			items : [ {
				xtype : 'datefield',
				hidden : true,
				id : 'fromdate',
				maxValue : Ext.Date.add(new Date(), Ext.Date.DAY, -1),
				vtype : 'daterange',
				endDateField : 'todate',
				fieldLabel : 'P&eacute;riode du ',
				allowBlank : false
			}, {
				xtype : 'datefield',
				id : 'todate',
				maxValue : new Date(),
				fieldLabel : ' au ',
				allowBlank : false,
				vtype : 'daterange',
				startDateField : 'fromdate',
				hidden : true
			}, {
				xtype : 'button',
				text : 'Modifier',
				id : 'changeAnalyticsRange',
				hidden : true
			} ]
		}, {
			region : 'center',
			border : false,
			autoScroll : true,
			bodyCls : 'mainAnalytics',
			layout : {
				type : 'table',
				// The total column count must be specified here
				columns : 3,
				tdAttrs : {
					valign : 'top'
				}
			}
		} ];

		this.callParent(arguments);
	}

});