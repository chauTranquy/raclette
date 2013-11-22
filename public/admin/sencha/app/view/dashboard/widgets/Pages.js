Ext
		.define(
				'TextoCMS.view.dashboard.widgets.Pages',
				{
					extend : 'TextoCMS.view.dashboard.widgets.WidgetAnalytics',
					alias : 'widget.analyticspages',
					width : 600,
					title : 'Pages',
					autoScroll : true,
					enableColumnMove : false,
					analyticsCall : Ext.emptyFn,
					initComponent : function() {
						this.callParent(arguments);
						this.params = {
							'start-date' : Ext.Date.format(this.firstDay,
									'Y-m-d'),
							'end-date' : Ext.Date.format(this.date, 'Y-m-d'),

							'metrics' : 'ga:visits,ga:newVisits,ga:entrances,ga:visitBounceRate,ga:pageviews,ga:avgTimeOnPage,ga:uniquePageviews,ga:exitRate',
							'dimensions' : 'ga:pagePath', // 'filters':'organicSearches==0',
							'sort' : '-ga:pageviews'
						};
						this.store = Ext.create('Ext.data.Store', {
							groupField : 'type',
							sorters : [ 'type', {
								property : 'visits',
								direction : 'DESC'
							} ],
							fields : [ {
								name : 'page'
							}, {
								name : 'visits',
								type : 'int'
							}, {
								name : 'newvisits',
								type : 'int'
							}, {
								name : 'entrances',
								type : 'int'
							}, {
								name : 'visitBounceRate',
								convert : this.convertPercentage
							}, {
								name : 'pageviews',
								type : 'int'
							}, {
								name : 'avgTimeOnPage',
								convert : this.secondToMinute
							}, {
								name : 'uniquePageviews',
								type : 'int'
							}, {
								name : 'exitRate',
								convert : this.convertPercentage
							} ]
						});
					},
					makeChart : function(response) {
						this.body.unmask();
						if (!this.evalError(response))
							return;

						var data = [];
						response.rows.each(function(item) {
							data.push(item);
						}, this);
						this.totalVisits = response.totalsForAllResults['ga:visits'];

						this.totalResults = response.totalsForAllResults;

						this.store.loadData(data);
						if (!this.grid)
							this.buildGrid();

						return;

					},
					buildGrid : function() {

						this.grid = Ext
								.create(
										'Ext.grid.Panel',
										{
											header : false,
											store : this.store,
											border : false,
											features : [ {
												ftype : 'summary'
											} ],
											columns : [
													{
														text : 'Page',
														dataIndex : 'page',
														flex : 1,
														align : 'center',
														summaryRenderer : function() {
															return '<strong>Total</strong>';
														}
													},

													{
														text : 'Vues',
														align : 'center',
														width : 75,
														dataIndex : 'pageviews',
														summaryType : 'sum'
													},
													{
														text : 'Vues uniques',
														align : 'center',
														width : 75,
														dataIndex : 'uniquePageviews',
														summaryType : 'sum'
													},
													{
														text : 'Tps moy.',
														tooltip : 'Temps moyen d\'une visite',
														dataIndex : 'avgTimeOnPage',
														width : 75,
														align : 'center',
														summaryType : 'average',
														summaryRenderer : function() {
															return this
																	.secondToMinute(this.totalResults['ga:avgTimeOnPage']);

														},
														scope : this
													},
													{
														text : 'Entr&eacute;es',
														align : 'center',
														width : 75,
														dataIndex : 'entrances',
														summaryType : 'average',
														summaryRenderer : function(
																value,
																summaryData,
																dataIndex) {

															return this.totalResults['ga:entrances'];
														}.bind(this)
													},
													{
														text : 'Tx de rebond',
														dataIndex : 'visitBounceRate',
														width : 75,
														tooltip : 'Taux de Rebond',
														align : 'center',
														summaryType : 'count',
														summaryRenderer : function(
																value,
																summaryData,
																dataIndex) {

															return this
																	.convertPercentage(this.totalResults['ga:visitBounceRate']);
														}.bind(this)
													},
													{
														text : 'Sorties',
														dataIndex : 'exitRate',
														width : 75,
														align : 'center',
														summaryRenderer : function(
																value,
																summaryData,
																dataIndex) {

															return this
																	.convertPercentage(this.totalResults['ga:exitRate']);
														}.bind(this)
													}]
										});

						this.add(this.grid);

					}

				});