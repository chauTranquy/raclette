Ext.define('TextoCMS.classes.Utils',{
	alias:'widget.textoutils',
	singleton: true,
	 formatDate:function(v){
		  var date = Ext.Date.parse(v, "Y-m-d H:i:s");
		  return Ext.Date.format(date, 'd M Y')+' - '+ Ext.Date.format(date, 'H:i');
		   
	   },
	   displayNotification:function(title, msg, pos, containerId){
		   
		   
			 Ext.create('widget.uxNotification', {
					position: pos||'t',
					manager:containerId||null,
					cls: 'ux-notification-light',
					iconCls: 'infoPanel',
					closable: false,
					title: title||'',
					html: msg||'pas de message',//'Using elasticIn animation effect. No title and closable: false.',
					//slideInDuration: 800,
					//slideBackDuration: 1500,
					autoCloseDelay: 4000,
					slideInAnimation: 'elasticIn',
					slideBackAnimation: 'easeIn'
				}).show();
		   
		   
	   },
	   validateIP:function(value){
		   
		   
		   var regExp=new RegExp(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
		   
		   return regExp.exec(value);
		   
	   }
			
			
	
	
},
function() {
    TextoCMS.Utils= this;

    
});
