Ext.define('TextoCMS.view.siteadmin.userAdminViews.UserForm',{
	extend:'Ext.form.Panel',
	alias:'widget.adminuserform',
	bodyStyle:'background:transparent',
	margin:5,
	record:null,
	trackResetOnLoad:true,
	fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 100,
        labelStyle:'text-align:right'
    },
    defaults:{
    	width:310
    	
    },
border:false,
buttons:[{text:'Enregistrer', disabled:true, action:'submit'}, {text:'Annuler',action:'close'}],
	
	initComponent:function(){

		this.isRecord = this.record.get('id_user')>0;
		
		this.groupCombo = Ext.create('Ext.form.field.ComboBox', {
		    fieldLabel: 'Groupe',
		    displayField: 'title',
		    valueField:'id_user_group',
		    name:'id_user_group',
		    allowBlank:false,
		    store: this.groupStore,
		    queryMode: 'local',
		    typeAhead: true
		});
			
		
		this.items=[
		       {xtype:'textfield', fieldLabel:'Nom', name:'lastname',allowBlank:false, minLength:3},
		       {xtype:'textfield', fieldLabel:'Pr&eacute;nom', name:'firstname', allowBlank:false, minLength:3},
		       {xtype:'textfield', fieldLabel:'Email', readOnly:this.isRecord!=undefined,name:'email', allowBlank:false, minLength:3, vtype:'email'},
		       this.groupCombo,
		       {xtype:'checkbox', fieldLabel:'Actif', name:'active', inputValue:1},
		       {xtype:'fieldset', title:!this.isRecord?'Mot de passe':'Nouveau mot de passe', collapsible:true, 
		    		   collapsed:this.isRecord, width:330,
		    defaults:{
		    	width:300
		    	
		    },
		    items:[
		           {xtype:'textfield', labelWidth: 90,fieldLabel:'Mot de passe', name:'newPass',minLength:6, inputType:'password',
		        	   validator:function(value){
		        		 
		        		   this.getForm().findField("sendMail").hide();
		        		   
		        		  if(this.getForm().findField('newPassConfirm').getValue().empty()&&value.empty()){
		        			  
		        			  this.getForm().findField('newPassConfirm').clearInvalid();
		        			  return true;
		        		  }
		        		  if(this.getForm().findField('newPassConfirm').getValue().empty())return "Veuillez saisir la v&eacute;rification de votre mot de passe";
		        		   if(this.getForm().findField('newPassConfirm').getValue()!=value) return "Les mots de passe ne correspondent pas";
		        		   this.getForm().findField('newPassConfirm').clearInvalid();
		        		   this.getForm().findField("sendMail").show();
		        		   return true;
		        	   }.bind(this), scope:this},
		           {xtype:'textfield',labelWidth: 90, fieldLabel:'V&eacute;rification', name:'newPassConfirm',minLength:6, inputType:'password',
		        		   validator:function(value){
		        			   
		        			   this.getForm().findField("sendMail").hide();
				        		  if(this.getForm().findField('newPass').getValue().empty()&&value.empty()){
				        			  this.getForm().findField('newPass').clearInvalid();
				        			  return true;
				        		  }
				        		  if(this.getForm().findField('newPass').getValue().empty())return "Veuillez saisir votre mot de passe";
				        		   if(this.getForm().findField('newPass').getValue()!=value) return "Les mots de passe ne correspondent pas";
				        		   this.getForm().findField('newPass').clearInvalid();
				        		   
				        		   this.getForm().findField("sendMail").show();
				        		   return true;
				        		   
				        	   }.bind(this), scope:this},
				        	   {xtype:"checkbox", name:"generatePass", inputValue:1, fieldLabel:"G&eacute;n&eacute;rer",autoWidth:true, 
				        		   scope:this, 
				        			   handler:function(tf, checked){
				        				   
				        				    this.getForm().findField("newPass").setDisabled(checked);
				        				    this.getForm().findField("newPassConfirm").setDisabled(checked);
				        				    if(checked) {
				        				    	this.getForm().findField('newPass').setValue(null);
				        				    	 this.getForm().findField('newPassConfirm').setValue(null);
				        				    	 this.getForm().findField('newPass').clearInvalid();
				        				    	 this.getForm().findField('newPassConfirm').clearInvalid();
				        				    	 
				        				    	return this.getForm().findField("sendMail").show();
				        				    }
				        				    this.getForm().findField("sendMail").hide();
				        				   
				        			   }},
				        	   {xtype:"checkbox", name:"sendMail", inputValue:1, fieldLabel:"Envoyer un mail", hidden:this.isRecord!=undefined,autoWidth:true, checked:!this.isRecord}
		           
		           ]}
		    
		       ];
		
		this.callParent(arguments);
		
		if(this.isRecord) this.loadRecord(this.record);
		
	}
	
});