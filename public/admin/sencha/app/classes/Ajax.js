Ext.define('TextoCMS.classes.Ajax',{
	alias:'widget.textoajax',
	singleton: true,
	ajaxRequest:function(url,params, callBack, showMask){
			if(showMask==undefined)showMask=true;
			var cb=callBack!=undefined&&typeof callBack=="function"?callBack:Ext.emptyFn;
			
			this.ajaxMask=null;
				
			if(showMask){
				this.ajaxMask = new Ext.LoadMask(Ext.getBody(), {msg:"Veuillez patienter...", title:"Envoi des don&eacute;es"});
				this.ajaxMask.show();
			}
				Ext.Ajax.request({
					url:url,
					params:params,
					method:'post',
					success:Ext.bind(this.evalError, this, cb, true)
						
				});
				
				
			},
			evalError:function(response, objRequest, cb){
				
				var JSON=Ext.JSON.decode(response.responseText);
				if(this.ajaxMask)this.ajaxMask.hide();
								
				if(JSON.success==false){
					
					
					if(JSON.error)var msg=JSON.error;
					else if(JSON.msg)var msg=JSON.msg;
					else var msg="Une erreur inconnue est intervenue.";
				
						var handler=Ext.emptyFn;
						
					if(JSON.errorCode<0)Ext.TaskManager.stopAll();
					
						if(JSON.errorCode==-1)handler=function(){document.location.href='/admin/login';};
						if(JSON.errorCode==-2)handler=function(btn){
							
							if(btn=="yes")return this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_AdminUsersMapper', APICall:'connectNewSession'}, Ext.bind(function(){
								document.location.reload();
								
							},this));
						
							return this.ajaxRequest('/admin/getjsondata/format/json',{API:'Application_Model_AdminUsersMapper', APICall:'killIdentity'}, Ext.bind(function(){
								document.location.reload();
								
							},this));
							
							
						}.bind(this);
						Ext.Msg.show({
						     title:'Erreur',
						     msg: msg,
						     buttons: JSON.errorCode==-2?Ext.Msg.YESNO:Ext.Msg.OK,
						     icon: Ext.Msg.ERROR,
						     scope:this, fn:handler
						});

					return false;
					
				}
				
				cb(JSON);
				
				
			}
			
			
	
	
},
function() {
	

    TextoCMS.Ajax= this;
});