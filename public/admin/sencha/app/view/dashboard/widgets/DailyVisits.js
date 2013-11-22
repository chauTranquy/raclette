Ext.define('TextoCMS.view.dashboard.widgets.DailyVisits',{
	extend:'TextoCMS.view.dashboard.widgets.WidgetAnalytics',
	alias:'widget.dailyvisits',
	width:800,
	height:450,
    analyticsCall:Ext.emptyFn,
    initComponent:function(){
    	
    	 this.callParent(arguments);
		this.params={ 'start-date': Ext.Date.format(this.firstDay,'Y-m-d'),
		    'end-date': Ext.Date.format(this.date,'Y-m-d'),
		   
		 'metrics': 'ga:visits, ga:newVisits','dimensions':'ga:date'
	    };
    	
    	
    	  
     },
     
     execAnalyticsCall:function(){
    	 
    	 this.startDate = Ext.Date.parse(this.params['start-date'], 'Y-m-d');
    	 endDate = Ext.Date.parse(this.params['end-date'], 'Y-m-d');
    	 var ONE_DAY = 1000 * 60 * 60 * 24;
    	 this.dif=Math.round(Ext.Date.getElapsed(this.startDate, endDate)/ONE_DAY);
    	 
    	 this.isWeek=(Math.round(this.dif)>45);
    	 if(this.isWeek)this.weekNum=Ext.Date.format(this.startDate,'W');
    	 else this.weekNum=null;
    	 this.params.dimensions=(Math.round(this.dif)>45)?'ga:week':'ga:date';
    	 this.callParent();

    	 
    	 
     },
     makeChart:function(response){
    	 this.callParent(response);
    	 
    	 var data = [];

 		var days =  Ext.Date.getDaysInMonth(this.date);
 		
 		response.rows.each(function(item){data.push(item);},this);
 	
 		if(response.rows.length<days&&!this.isWeek&&this.dif<46){
 			$R(response.rows.length+1, days).each(function(index){data.push([index,null,null]);}, this);
 			
 			
 		}
 		
 		
 		var store = Ext.create('Ext.data.ArrayStore', {
 	        fields: [{name:'jour', convert:function(v){
 	        	var date = this.isWeek?Ext.Date.add(this.startDate,Ext.Date.DAY,(parseInt(v)-this.weekNum)*7):Ext.Date.parse(v, "Ymd");
 	      
 	        	if(!date) return ' ';
 	        	return Ext.Date.format(date,'d M');
 	        	
 	        }.bind(this)}, {name:'visit', type:'int'},{name:'newvisit', type:'int'}],//, 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
 	        
 	        data: data
 	    });
 		
 	
 		
 		 var chart = Ext.create('Ext.chart.Chart', {
 	            style: 'background:#fff',
 	            animate: true,
 	            store: store,
 	            shadow: true,
 	            theme: 'Category1',
 	            legend: {
 	                position: 'bottom'
 	            },
 	            axes: [{
 	                type: 'Numeric',
 	                minimum: 0,
 	                position: 'left',
 	                fields: ['visit', 'newvisit'],
 	                title: 'Nbre de visites',
 	                minorTickSteps: 1,
 	                grid: true
 	            }, {
 	                type: 'Category',
 	                position: 'bottom',
 	                fields: ['jour'],
 	                title: 'Jour'
 	            }],
 	            series: [{
 	                type: 'line',
 	                tips: {
 	                    trackMouse: true,
 	                    width:160,
 	                  height: 28,
 	                    renderer: function(storeItem, item) {
 	                      this.setTitle(storeItem.get('jour')+' ('+storeItem.get('visit') + ' visite'+(storeItem.get('visit')>0?'s':'')+')');
 	                    }
 	                  },
 	                highlight: {
 	                    size: 7,
 	                    radius: 7
 	                },
 	                title:'Visites Totales ('+response.totalsForAllResults['ga:visits']+')',
 	                axis: 'left',
 	                xField: 'jour',
 	                yField: 'visit',
 	                markerConfig: {
 	                    type: 'cross',
 	                    size: 4,
 	                    radius: 4,
 	                    'stroke-width': 0
 	                }
 	            }, {
 	                type: 'line',
 	                highlight: {
 	                    size: 7,
 	                    radius: 7
 	                },
 	                tips: {
 	                    trackMouse: true,
 	                  height: 28,
 	                  width:160,
 	                    renderer: function(storeItem, item) {
 	                      this.setTitle(storeItem.get('jour')+' ('+storeItem.get('newvisit') + ' visite'+(storeItem.get('newvisit')>0?'s':'')+')');
 	                    }
 	                  },
 	                title:'Nouvelle visites ('+response.totalsForAllResults['ga:newVisits']+')',
 	                axis: 'left',
 	                smooth: true,
 	                xField: 'jour',
 	                yField: 'newvisit',
 	                markerConfig: {
 	                    type: 'circle',
 	                    size: 4,
 	                    radius: 4,
 	                    'stroke-width': 0
 	                }
 	            }]
 	        });
    	
 		this.setTitle('Visites Totales');
 		
 		this.add(chart);
 		//this.doLayout();
 		
     }
	
});