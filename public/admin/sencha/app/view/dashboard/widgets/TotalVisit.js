Ext
		.define(
				'TextoCMS.view.dashboard.widgets.TotalVisit',
				{
					extend : 'TextoCMS.view.dashboard.widgets.WidgetAnalytics',
					requires : [ 'TextoCMS.store.dashboard.AnalyticsStore',
							'TextoCMS.view.widgets.Infogrid' ],
					alias : 'widget.totalvisit',
					width : 400,
					height : 600,
					layout : 'vbox',
					// autoScroll:true,
					initComponent : function() {
						this.callParent(arguments);
						this.params = {
							'start-date' : Ext.Date.format(this.firstDay,
									'Y-m-d'),
							'end-date' : Ext.Date.format(new Date(), 'Y-m-d'),
							'metrics' : 'ga:percentNewVisits,ga:visitors,ga:avgTimeOnSite,ga:visitBounceRate,ga:newVisits,ga:pageviews,ga:pageviewsPerVisit,ga:visits'
						};

					},
					makeChart : function(response) {
						this.callParent(response);

						var data = [];

						var result = response.totalsForAllResults;
						data.push([ 'Nouveaux visiteurs',
								parseInt(result['ga:newVisits']) ], [
								'Visiteurs connus',
								parseInt(result['ga:visits'])
										- parseInt(result['ga:newVisits']) ]);
						var store = Ext.create('Ext.data.ArrayStore', {
							fields : [ {
								name : 'type'
							}, {
								name : 'visits',
								type : 'int'
							} ],// , 'data2', 'data3', 'data4', 'data5',
								// 'data6', 'data7', 'data9', 'data9'],
							data : data
						});

						var chart = Ext
								.create(
										'Ext.chart.Chart',
										{
											style : 'background:#fff',
											xtype : 'chart',
											animate : true,
											shadow : true,
											store : store,
											legend : false,
											width : 350,
											height : 350,
											insetPadding : 60,
											theme : 'Base:gradients',
											series : [ {
												type : 'pie',
												field : 'visits',
												tips : {
													trackMouse : true,
													width : 130,
													height : 50,
													renderer : function(
															storeItem, item) {
														var total = 0;
														store
																.each(function(
																		rec) {
																	total += rec
																			.get('visits');
																});
														this
																.setTitle(storeItem
																		.get('type')
																		+ '<br />'
																		+ storeItem
																				.get('visits')
																		+ ' visite'
																		+ (storeItem
																				.get('visits') > 1 ? 's'
																				: '')
																		+ ' ('
																		+ (storeItem
																				.get('visits')
																				/ total * 100)
																				.toFixed(2)
																		+ '%)');
													}
												},
												highlight : {
													segment : {
														margin : 20
													}
												},
												label : {
													field : 'type',
													display : 'rotate',
													contrast : true,
													font : '18px Arial'
												}
											} ]
										});

						this.setTitle('Statistiques globales');

						this.add({
							xtype : 'panel',
							width : 350,
							margin : '5 25',
							height : 350,
							items : [ chart ],
							border : false
						});

						var source = {
							'Visites' : result['ga:visits'],
							'Visiteurs uniques' : result['ga:visitors'],
							'Pages vues' : result['ga:pageviews'],
							'Pages/visites' : parseFloat(
									result['ga:pageviewsPerVisit']).toFixed(2),
							'Dur&eacute;e moy. de la visite' : this
									.secondToMinute(result['ga:avgTimeOnSite']),
							'Taux de rebond' : this
									.convertPercentage(result['ga:visitBounceRate'])

						};

						var infogrid = Ext.create('Ext.grid.property.Grid', {
							height : 150,
							source : source,
							border : false,
							listeners : {
								beforeedit : function(e) {
									return false;
								}
							},
							enableColumnMove : false,
							enableColumnHide : false,
							nameColumnWidth : 130,
							layout : {

							},
							width : 350,
							// height:150,
							margin : '5 25',
							// forceFit:true,
							hideHeaders : true
						});

						this.add(infogrid);

						this.doLayout();

					}

				});