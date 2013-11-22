Ext
		.define(
				'TextoCMS.controller.dashboard.DashboardController',
				{
					description : 'Tableau de bord',
					extend : 'TextoCMS.controller.BaseController',
					requires : [ 'TextoCMS.components.cms.IconBrowser',
							'TextoCMS.components.cms.InfoPanel',
							'TextoCMS.components.cms.BrowserTree' ],
					views : [ 'TextoCMS.view.dashboard.DashboardTab',
							'TextoCMS.view.dashboard.Analytics',
							'TextoCMS.view.dashboard.widgets.Pages',
							'TextoCMS.view.dashboard.widgets.Referer',
							'TextoCMS.view.dashboard.widgets.TotalVisit',
							'TextoCMS.view.dashboard.widgets.DailyVisits',
							'TextoCMS.view.dashboard.widgets.Keywords' ],
					refs : [ {
						ref : 'analyticsPanel',
						selector : 'analytics'
					}, {
						ref : 'analyticsHeader',
						selector : 'analytics [region=north]'
					}, {
						ref : 'analyticsBody',
						selector : 'analytics [region=center]'
					}, {
						ref : 'fromdate',
						selector : '#fromdate'
					}, {
						ref : 'todate',
						selector : '#todate'
					}, {
						ref : 'dateBtn',
						selector : '#changeAnalyticsRange'
					}, {
						ref : 'connectGoogle',
						selector : 'analytics #connectGoogle'
					}, {
						ref : 'googleAccount',
						selector : '#googleAccount'
					}, {
						ref : 'seeGoogle',
						selector : '#seeGoogle'
					} ],
					defaultView : 'dashboard',
					init : function() {
console.log('init');
						this.control({
							'analytics [region=center] tool[type=refresh]' : {
								click : this.refreshData
							},
							'#changeAnalyticsRange' : {
								click : this.changeAnalyticsRange
							},
							'analytics #connectGoogle' : {
								click : this.getAnalyticsData
							}
						});
						this.callParent(arguments);
						this.getFromdate().hide();
						this.getTodate().hide();
						this.getSeeGoogle().on('click', this.openGoogleAnalyticsSite, this);
						

					},
					initController : function() {

						// this.getAnalyticsPanel().setMasked({text:'chargement
						// des param&egrave;tres'});
						this.ajax(DEFAULT_ADMIN_URL, {
							API : 'Admin_Model_SitesMapper',
							APICall : 'getGoogleData',
							id_site : TextoCMS.siteId
						}, Ext.bind(this.checkAnalyticsData, this), false);
						// this.getAnalyticsData();

					},
					checkAnalyticsData : function(response) {
						if (this.getAnalyticsBody())
							this.getAnalyticsBody().removeAll();
						if (response.result.googleActivated == 0
								|| response.result.googleActivated == null) {
							this.getConnectGoogle().hide();
							this.getFromdate().hide();
							this.getTodate().hide();
							this.getDateBtn().hide();
							this.getGoogleAccount().setText('');
							this.getAnalyticsHeader().up('panel').setTitle('');
							this.getSeeGoogle().hide();
							this
									.getAnalyticsBody()
									.add(
											{
												xtype : 'panel',
												tdAttrs : {
													colspan : 3,
													valign : 'center',
													align : 'center'
												},
												layout : {
													type : 'fit',
													pack : 'center'
												},
												style : "text-align:center;",
												width : '100%',
												flex : 1,
												html : '<strong>Google Analytics n\'est pas activ&eacute; pour ce site!</strong>',
												border : false
											});
							return;
						}

						this.Gapi.setParams(response.result);
						this.getAnalyticsData();
					},
					getAnalyticsData : function(response) {

						this.Gapi
								.getAccountProperties(this.displayAccountDetail
										.bind(this));

					},
					displayAccountDetail : function(result) {
						this.getGoogleAccount().setText('');

						if (result.error) {
							this.getSeeGoogle().hide();

							return this.getConnectGoogle().show();
						}

						this.getGoogleAccount().update(
								'Connect&eacute; en tant que '
										+ result.username);

						this.getFromdate().show();
						this.getTodate().show();
						this.getDateBtn().show();

						
						this.getSeeGoogle().show();
						
						this.getConnectGoogle().hide();

						var data = result.items[0];

						var date = new Date(data.created);
						this.getFromdate().setMinValue(date);
						this.getTodate().setValue(new Date());
						this.firstDay = Ext.Date
								.getFirstDateOfMonth(new Date());

						this.getFromdate().setValue(this.firstDay);

						this.getAnalyticsHeader().up('panel').setTitle(
								'Statistiques  des visites pour ' + data.name
										+ ' - ' + data.websiteUrl);

						this.startDate = Ext.Date.format(date, 'd/m/y');

						// stats globales sur la période

						this.getAnalyticsBody().add({

							xtype : 'totalvisit'

						}, {
							xtype : 'panel',
							border : false,
							items : [ {
								xtype : 'dailyvisits'// , colspan:'2'
							}, {
								xtype : 'referer'
							} ]
						}, {
							xtype : 'panel',
							border : false,
							items : [ {
								xtype : 'keywords'
							}, {
								xtype : 'analyticspages'
							} ]
						});

					},
					refreshData : function(btn) {
						btn.up('panel').execAnalyticsCall();

					},
					changeAnalyticsRange : function() {
						var startDate = Ext.Date.format(this.getFromdate()
								.getValue(), 'Y-m-d');
						var endDate = Ext.Date.format(this.getTodate()
								.getValue(), 'Y-m-d');

						this.getAnalyticsBody().query('widgetanalitycs').each(
								function(item) {
									item.params['start-date'] = startDate;
									item.params['end-date'] = endDate;
									item.execAnalyticsCall();
								}, this);

					},
					getRightsItems : function() {
					},
					openGoogleAnalyticsSite:function(btn){
						window.open(this.Gapi.googleUrl,'googleWin');
						
					}

				});