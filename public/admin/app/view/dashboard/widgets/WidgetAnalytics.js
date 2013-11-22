Ext.define('TextoCMS.view.dashboard.widgets.WidgetAnalytics',{
	extend:'Ext.panel.Panel',
	alias:'widget.widgetanalitycs',
	requires:['Ext.chart.*'],
	Gapi:TextoCMS.classes.Gapi,
	params:{},
	collapsible:true,
	loadMask:true,
    layout:'fit',
    collapseFirst:false,
    cls:'left',
    tools:[{type:'refresh', tooltip:'Rafra&icirc;chir'}],
    margin:'5 5 0 0',
    height:450,

	 initComponent:function(){
		 this.date= new Date();
		 this.firstDay = Ext.Date.getFirstDateOfMonth(this.date);
    	this.callParent(arguments);
    	this.addListener('afterlayout',this.execAnalyticsCall, this);
    	     	 
    	 
     },
     
     execAnalyticsCall:function(){
    	 this.removeListener('afterlayout',this.execAnalyticsCall,this);
    	 this.body.mask("Chargement des donn&eacute;es");
    	 this.Gapi.query(this.params,this.makeChart.bind(this));
    	 
     },
     makeChart:function(response){
    	 this.body.unmask();
    	 this.removeAll();
    	 if(!this.evalError(response))return;
    	 //this.getEl().unmask();
     },
     secondToMinute:function(v){
      	var secs=parseInt(v);
     	var hours = Math.floor(secs / (60 * 60));
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
                
        return (hours>0?hours+':':'')+(minutes<10?'0':'')+minutes+':'+(seconds<10?'0':'')+seconds;
     	
     },
     convertPercentage:function(v){
    	 
      	  return parseFloat(v).toFixed(2)+'%';
      	  },
      	  evalError:function(result){
      		  
      		  
      		  
if(result&&result.error) {
   				
				if(parseInt(result.error.code)==401) this.connect(cb, false);
				
				else if(parseInt(result.error.code)== 403) Ext.Msg.alert('Erreur !', 'Vous n\'avez pas les autorisations requises pour visualiser les statistiques Google Analytics.<br />Veuillez contacter l\'administrateur du site'+' [code '+result.error.code+']');
				else Ext.Msg.alert('Erreur Gapi', result.error.message+' [code '+result.error.code+']');
				return false;
    	 }
return true;
      		  
      		  
      	  }
	
});