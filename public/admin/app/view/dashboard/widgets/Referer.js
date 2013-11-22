Ext
		.define(
				'TextoCMS.view.dashboard.widgets.Referer',
				{
					extend : 'TextoCMS.view.dashboard.widgets.WidgetAnalytics',
					alias : 'widget.referer',
					width : 600,
					title : 'Sources de trafic',
					autoScroll : true,
					enableColumnMove : false,
					analyticsCall : Ext.emptyFn,
					initComponent : function() {

						this.callParent(arguments);
						this.params = {
							'start-date' : Ext.Date.format(this.firstDay,
									'Y-m-d'),
							'end-date' : Ext.Date.format(this.date, 'Y-m-d'),

							'metrics' : 'ga:organicSearches,ga:visits,ga:entranceBounceRate,ga:visitBounceRate,ga:avgTimeOnSite,ga:newVisits,ga:pageviewsPerVisit',
							'dimensions' : 'ga:source', // 'filters':'organicSearches==0',
							'sort' : '-ga:visits'
						};

						this.store = Ext
								.create(
										'Ext.data.Store',
										{
											groupField : 'type',
											sorters : [ 'type', {
												property : 'visits',
												direction : 'DESC'
											} ],
											fields : [
													{
														name : 'source'
													},
													{
														name : 'organicSearch',
														type : 'int'
													},
													{
														name : 'visits',
														type : 'int'
													},
													{
														name : 'entranceBounceRate',
														type : 'float'
													},
													{
														name : 'visitBounceRate',
														type : 'float'
													},
													{
														name : 'avgTimeOnSite',
														type : 'float'
													},
													{
														name : 'newVisits',
														type : 'int'
													},
													{
														name : 'pageviewsPerVisit',
														type : 'float',
														convert : function(v) {
															return parseFloat(v);
														}
													},
													{
														name : 'percentVisit',
														type : 'float',
														convert : function(v,
																record) {

															return parseInt(record
																	.get('visits'))
																	/ this.totalVisits;

														}.bind(this)
													},
													{
														name : 'type',
														convert : function(v,
																record) {
															return record
																	.get('organicSearch') > 0 ? 'Moteurs de recherche'
																	: 'Site R&eacute;f&eacute;rents';

														}
													}

											]

										});

					},
					makeChart : function(response) {
						this.body.unmask();
						if (!this.evalError(response))
							return;

						var data = [];

						// var days = Ext.Date.getDaysInMonth(this.date);

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
												groupHeaderTpl : Ext
														.create(
																'Ext.XTemplate',
																'<strong>{name} ({rows.length} R&eacute;sultat{[values.rows.length > 1 ? "s" : ""]}) - {[this.getPercentageVisit(values.rows)]}</strong>',
																{
																	scope : this,
																	getPercentageVisit : function(
																			values) {
																		var visits = 0;
																		values
																				.each(
																						function(
																								col) {
																							visits += parseInt(col.data.visits);
																						},
																						this);
																		return this
																				.convertPercentage(visits
																						/ parseInt(this.totalVisits)
																						* 100)
																				+ ' des visites';
																	}
																			.bind(this)
																}),
												ftype : 'groupingsummary'
											} ],

											columns : [
													{
														text : 'Source',
														dataIndex : 'source',
														flex : 1,
														align : 'center',
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
														summaryType : 'average',
														summaryRenderer : function(
																value,
																summaryData,
																dataIndex) {

															return this
																	.convertPercentage(value);

														},
														scope : this
													},
													{
														text : '% visites',
														align : 'center',
														width : 75,
														dataIndex : 'percentVisit',
														summaryType : 'average',
														scope : this,
														renderer : function(v) {

															return this
																	.convertPercentage(v * 100);

														},
														summaryRenderer : function(
																v) {
															return this
																	.convertPercentage(v * 100);
														}
													},
													{
														text : 'Pages/visites',
														dataIndex : 'pageviewsPerVisit',
														width : 75,
														align : 'center',
														scope : this,
														renderer : function(v) {

															return parseFloat(v)
																	.toFixed(2);

														},
														summaryType : 'average',
														summaryRenderer : function(
																v) {
															return parseFloat(v)
																	.toFixed(2);
														}
													},
													{
														text : 'Tps moy.',
														tooltip : 'Temps moyen d\'une visite',
														dataIndex : 'avgTimeOnSite',
														width : 75,
														align : 'center',
														renderer : function(v) {
															return this
																	.secondToMinute(v);

														},
														scope : this,
														summaryType : 'average',
														summaryRenderer : function(
																v) {

															return this
																	.secondToMinute(v);

														}
													},
													{
														text : 'Tx de rebond',
														dataIndex : 'entranceBounceRate',
														width : 75,
														tooltip : 'Taux de Rebond',
														align : 'center',
														summaryType : 'average',
														renderer : function(v) {
															return this
																	.convertPercentage(v);

														},
														summaryRenderer : function(
																v) {

															return this
																	.convertPercentage(v);

														},
														scope : this
													} ]
										});

						this.add(this.grid);

					}

				});