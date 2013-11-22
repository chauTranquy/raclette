Ext
		.define(
				'TextoCMS.view.dashboard.widgets.SearchTools',
				{
					extend : 'TextoCMS.view.dashboard.widgets.WidgetAnalytics',
					alias : 'widget.searchtools',
					width : 450,
					title : 'Moteurs de recherche',
					autoScroll : true,
					enableColumnMove : false,
					analyticsCall : Ext.emptyFn,
					initComponent : function() {

						this.callParent(arguments);
						this.params = {
							'start-date' : Ext.Date.format(this.firstDay,
									'Y-m-d'),
							'end-date' : Ext.Date.format(this.date, 'Y-m-d'),

							'metrics' : 'organicSearches,visits,entranceBounceRate,visitBounceRate,avgTimeOnSite,newVisits,pageviewsPerVisit',
							'dimensions' : 'source',
							'filters' : 'organicSearches>0',
							'sort' : '-visits'
						};
						var store = Ext.create('Ext.data.Store', {
							fields : [ {
								name : 'source'
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
							}

							]

						});
						this.grid = Ext.create('Ext.grid.Panel', {
							header : false,
							store : store,
							border : false,
							columns : [
									{
										text : 'Source',
										dataIndex : 'source',
										flex : 1,
										align : 'center'
									},
									{
										text : 'Visites',
										dataIndex : 'visits',
										width : 75,
										align : 'center'
									},
									{
										text : '% n<sup>elles</sup> visites',
										dataIndex : 'newVisits',
										width : 75,
										align : 'center',
										renderer : function(v, meta, record) {
											return this.convertPercentage(v
													/ record.get('visits')
													* 100);

										},
										scope : this
									}, {
										text : 'Pages/visites',
										dataIndex : 'pageviewsPerVisit',
										width : 75,
										align : 'center',
										renderer : function(v) {
											return parseFloat(v).toFixed(2);

										}
									}, {
										text : 'Tps moy.',
										tooltip : 'Temps moyen d\'une visite',
										dataIndex : 'avgTimeOnSite',
										width : 75,
										align : 'center'
									}, {
										text : 'Tx de rebond',
										dataIndex : 'entranceBounceRate',
										width : 75,
										tooltip : 'Taux de Rebond',
										align : 'center'
									} ]
						});

						this.add(this.grid);

					},
					makeChart : function(response) {
						// this.callParent();

						var data = [];

						// var days = Ext.Date.getDaysInMonth(this.date);

						response.rows.each(function(item) {
							data.push(item);
						}, this);
						/*
						 * , convert:function(v){ return
						 * parseFloat(v).toFixed+'%';
						 *  }
						 */

						this.grid.store.loadData(data);
						// this.grid.doLayout();
						this.body.unmask();
						return;

					}

				});