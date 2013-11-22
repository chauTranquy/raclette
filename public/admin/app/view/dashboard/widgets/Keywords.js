Ext
		.define(
				'TextoCMS.view.dashboard.widgets.Keywords',
				{
					extend : 'TextoCMS.view.dashboard.widgets.WidgetAnalytics',
					alias : 'widget.keywords',
					width : 600,
					autoScroll : true,
					enableColumnMove : false,
					title : 'Mots cl&eacute;s',
					analyticsCall : Ext.emptyFn,
					initComponent : function() {

						this.callParent(arguments);
						this.params = {
							'start-date' : Ext.Date.format(this.firstDay,
									'Y-m-d'),
							'end-date' : Ext.Date.format(this.date, 'Y-m-d'),

							'metrics' : 'ga:organicSearches,ga:visits,ga:entranceBounceRate,ga:visitBounceRate,ga:avgTimeOnSite,ga:newVisits,ga:pageviewsPerVisit',
							'dimensions' : 'ga:keyword', // 'filters':'organicSearches>0',
							'sort' : '-ga:visits'
						};
						this.store = Ext.create('Ext.data.Store', {
							fields : [ {
								name : 'keyword'
							}, {
								name : 'organicSearch',
								type : 'int'
							}, {
								name : 'visits',
								type : 'int'
							}, {
								name : 'entranceBounceRate',
								convert : this.convertPercentage
							}, {
								name : 'visitBounceRate',
								convert : this.convertPercentage
							}, {
								name : 'avgTimeOnSite',
								convert : this.secondToMinute
							}, {
								name : 'newVisits',
								type : 'int'
							}, {
								name : 'pageviewsPerVisit'
							} ]

						});

					},
					makeChart : function(response) {
						this.callParent(response);

						var data = [];
						response.rows.each(function(item) {
							data.push(item);
						}, this);
						this.totalVisits = response.totalsForAllResults['ga:visits'];

						this.totalResults = response.totalsForAllResults;

						this.store.loadData(data);

						// if(!this.grid)
						this.buildGrid();
						this.body.unmask();
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
														text : 'Mot Cl&eacute;',
														dataIndex : 'keyword',
														flex : 1,
														summaryRenderer : function() {
															return '<strong>Total</strong>';
														}
													},
													{
														text : 'Visites',
														dataIndex : 'visits',
														width : 75,
														align : 'center',
														summaryType : 'sum'
													},
													{
														text : '% n<sup>elles</sup> visites',
														dataIndex : 'newVisits',
														width : 75,
														align : 'center',
														renderer : function(v,
																meta, record) {
															return this
																	.convertPercentage(v
																			/ record
																					.get('visits')
																			* 100);

														},
														scope : this,
														summaryType : 'count',
														summaryRenderer : function(
																v) {
															return this
																	.convertPercentage(this.totalResults['ga:newVisits']
																			/ this.totalVisits
																			* 100);

														}
													},
													{
														text : 'Pages/visites',
														dataIndex : 'pageviewsPerVisit',
														width : 75,
														align : 'center',
														renderer : function(v) {
															return parseFloat(v)
																	.toFixed(2);

														},
														summaryType : 'sum',
														summaryRenderer : function(
																v) {
															return parseFloat(
																	this.totalResults['ga:pageviewsPerVisit'])
																	.toFixed(2);

														},
														scope : this
													},
													{
														text : 'Tps moy.',
														tooltip : 'Temps moyen d\'une visite',
														dataIndex : 'avgTimeOnSite',
														width : 75,
														align : 'center',
														summaryType : 'sum',
														summaryRenderer : function(
																v) {
															return this
																	.secondToMinute(this.totalResults['ga:avgTimeOnSite']);

														},
														scope : this
													},
													{
														text : 'Tx de rebond',
														dataIndex : 'entranceBounceRate',
														width : 75,
														tooltip : 'Taux de Rebond',
														align : 'center',
														summaryType : 'sum',
														summaryRenderer : function(
																v) {
															return this
																	.convertPercentage(this.totalResults['ga:entranceBounceRate']);

														},
														scope : this
													} ]
										});

						this.add(this.grid);

					}

				});