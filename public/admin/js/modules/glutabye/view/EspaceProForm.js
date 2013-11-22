Ext.define('TextoCMS.Modules.glutabye.view.EspaceProForm',{
	extend:'Ext.form.Panel',
	alias:'widget.espaceproform',
	trackResetOnLoad:true,
	layout:'form',
	border:false,
	bodyPadding:10,
	 defaults: {
	        labelAlign: 'right',
	        labelWidth: 150,
	        width:400,
	        xtype:'textfield',
	        allowBlank:false
	        
	    },
	items:[{
		
		fieldLabel:'Nom du groupe',
		name:'name'
		
	},
	
	{
		fieldLabel:'Description',
		xtype:'textareafield',
		name:'description'
		
	},
	{xtype:'checkbox',
		fieldLabel:'Statut',
		allowBlank:true,
		name:'status',
		inputValue:1
	},
	{name:'id_espacepro',type:"hidden"}
	],
	initComponent:function(){
		
		this.callParent(arguments);
		this.loadRecord(this.record);
		
	}
	
	
});