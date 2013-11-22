/**
 * 
 */
Ext.define('CmsClass.LoginClass', {
	extend:'CmsClass.BaseClass',
	
	constructor:function(){
		
		this.loginInput=Ext.create('Ext.form.field.Text',{name:'email', contentEl:'loginInput', vtype:'email', fieldLabel:'Votre email*', allowBlank:false});
		this.passInput=Ext.create('Ext.form.field.Text',{name:'pass', contentEl:'passInput', minLength:5,allowBlank:false, inputType:'password', fieldLabel:'Votre mot de passe*'});
		
		var form=Ext.create('Ext.form.Panel',{
			title:'Connexion',
			standardSubmit:false,
			url:'/admin/getjsondata?format=json',
			baseParams:{API:'Application_Model_AdminUsersMapper', APICall:'authenticate'},
			method:'post',
			
			style:'margin:auto; top:20%',
			bodyPadding:10,
			width:450,
			fieldDefaults: {
		        labelAlign: 'right',
		        labelWidth: 150
		    },
			defaults:{
				width:300
			},
			renderTo:'loginForm', items:[this.loginInput, this.passInput,{xtype:'panel', border:false, style:'text-align:center; width:400px; margin:auto;', html:'<a href="#" id="lostPassLink">Mot de passe oubli&eacute; ?</a>', listeners:{
				scope:this,
				afterrender:function(){
					Event.observe($('lostPassLink'),'click',this.openLostPassForm.bindAsEventListener(this));
					$(this.loginInput.inputEl.id).setAttribute('autocomplete','on');
					
					}
				
			}}], buttons:[{xtype:'button', text:'Se connecter',formBind:true, handler:function(btn){
				 var form = this.up('form').getForm();

				
				if(!form.isValid()) return;
				 form.submit({
					 waitTitle:'Veuillez patienter',
						waitMsg:'V&eacute;rification en cours',
	                    success: function(form, action) {
	                    	
	                    	Ext.Msg.wait({
			    			     title:'Connexion en cours',
			    			     wait:true,
			    		           waitConfig: {interval:200}
			    			});
	                    	document.location.href="/admin/index";
	                    	
	                     
	                    },
	                    failure: function(form, action) {
	                    	
	                    	var handler=Ext.emptyFn;
	                    	if(action.result.errorCode&&action.result.errorCode==-2) handler=function(btn){
	                    		if(btn!='yes')	return;
	                    		form.baseParams.newConnection=1;
	                    		form.submit({waitTitle:'Veuillez patienter',
						waitMsg:'V&eacute;rification en cours',
	                    success: function(form, action) {
	                    	
	                    	Ext.Msg.wait({
			    			     title:'Connexion en cours',
			    			     wait:true,
			    		           waitConfig: {interval:200}
			    			});
	                    	document.location.href="/admin/index";
	                    	
	                     
	                    }});
	                    		
	                    	}
	                    	
	                    	Ext.Msg.show({
	       				     title:'Erreur',
	       				     msg: action.result.msg,
	       				     buttons: action.result.errorCode==-2?Ext.Msg.YESNO:Ext.Msg.OK,
	       				     fn:handler,
	       				     scope:this,
	       				     icon: Ext.Msg.ERROR
	       				   
	       				});

	                    }
	                });

				
			}}]})
			
		
		
		Ext.tip.QuickTipManager.init();		
		
		
		this.centerRegion=Ext.create('Ext.panel.Panel',{region:'west',
            //layout:'fit',
			border:false,
            region:'center',
            id:'centerregion',
           
            items:[form],
            defaults:{
            	border:false
            	
            }
            });
		

		
		this.viewPort=Ext.create('Ext.container.Viewport', {
		    layout: 'border',
		    renderTo: Ext.getBody(),
		    items: [
		            this.centerRegion,
		            {region:'south', border:false, id:'footerAdmin', html:'&copy; agence texto 2011'},
		            {region:'north', height:50, border:false, contentEl:'headerAdmin'}
		            
		            ]
		    });
		
	},
	
	openLostPassForm:function(e){
		Event.stop(e);
		
		var form=Ext.create('Ext.form.Panel',{
			border:false,
			bodyStyle:'background:transparent',
			standardSubmit:false,
			url:'/admin/getjsondata?format=json',
			baseParams:{API:'Application_Model_AdminUsersMapper', APICall:'lostPass'},
			method:'post',
		
		
			bodyPadding:10,
			width:450,
			fieldDefaults: {
		        labelAlign: 'right',
		        labelWidth: 150
		    },
		    items:[{xtype:'textfield',allowBlank:false,fieldLabel : 'Votre adresse mail', vtype:'email', name:'email'}],
		    buttons:[{text:'Envoyer', formBind:true, scope:this, handler:function(btn){
		    	
		    	var form = btn.up('form').getForm();
		    	if(!form.isValid()) return;
		    	form.submit({
		    		waitTitle:'Veuillez patienter',
		    		waitMsg:'Traitement en cours',
		    		success: function(form, action) {
                    	
		    			Ext.Msg.show({
		    			     title:'Mot de passe oubli&eacute;',
		    			     msg: action.result.msg,
		    			     buttons: Ext.Msg.OK,
		    			     scope:this,
		    			  fn:function(){
		    				  this.winLost.close();
		    				  
		    				  
		    			  }.bind(this),
		    			   icon: Ext.window.MessageBox.INFO
		    			});
                     
                    }.bind(this),
                    failure: function(form, action) {
                        Ext.Msg.alert('Erreur', action.result.msg);
                    }
		    		
		    	});
		    	
		    	
		    }},{text:'Fermer', scope:this, handler:function(btn){
		    	
		    	var win= btn.up('form').up('window');
		    	win.close();
		    	
		    }}]
			
		});
		
		this.winLost = Ext.create('Ext.window.Window',{
			modal:true,
			bodyStyle:'background:transparent',
			autoHeight:true,
			title:'Mot de passe perdu',
			items:[form]
			
		});
		
		this.winLost.show();
	}
	
});
