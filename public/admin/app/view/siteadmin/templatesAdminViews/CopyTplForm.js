Ext.define('TextoCMS.view.siteadmin.templatesAdminViews.CopyTplForm',{
	extend:'Ext.form.Panel',
	alias:'widget.copytplform',
	bodyStyle:'background:transparent',
	margin:5,
	record:null,
	trackResetOnLoad:true,
	fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 100,
        labelStyle:'text-align:right',
        allowBlank:false
    },
    defaults:{
    	width:310
    	
    },
border:false,
buttons:[{text:'Enregistrer', disabled:true, action:'submit'}, {text:'Annuler',action:'close'}],
	
	initComponent:function(){


	this.items=[{xtype:'textfield', name:'tpl_name', fieldLabel:'Nom du gabarit', allowBlank:false,regex : /^[a-zA-Z]+$/,
		regexText : 'Vous ne pouvez saisir que des caract&egrave;res alphab&eacute;tiques',
		minLength : 3}];
		
		this.callParent(arguments);
		

		
	}
	
});