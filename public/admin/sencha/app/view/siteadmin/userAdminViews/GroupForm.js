Ext.define('TextoCMS.view.siteadmin.userAdminViews.GroupForm',{
	extend:'Ext.form.Panel',
	alias:'widget.admingroupform',
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

		this.isRecord = this.record.get('id_user_group')>0;
	this.items=[{xtype:'textfield', name:'group_name', fieldLabel:'Nom du groupe', allowBlank:false}];
		
		this.callParent(arguments);
		
		if(this.isRecord) this.loadRecord(this.record);
		
	}
	
});