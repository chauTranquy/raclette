Ext.define('TextoCMS.view.siteadmin.templatesAdminViews.TemplatesTreeForm',{
	extend:'Ext.form.Panel',
	alias:'widget.templatestreeform',
	bodyStyle:'background:transparent',
	margin:5,
	border:false,
	record:null,
	trackResetOnLoad:true,
	fieldDefaults: {
		width:300,
        labelAlign: 'left',
        labelWidth: 100,
        labelStyle:'text-align:right'
    },
	buttons:[{text:'Enregistrer', action:'submit', disabled:true},{text:'Annuler', action:'close'}],
	initComponent:function(){
		
		var combo=Ext.create('Ext.form.field.ComboBox', {
		    fieldLabel: 'Gabarit',
		    emptyText:'veuillez choisir un gabarit',
		    displayField: 'templateRef',
		    allowBlank:false,
		    store: this.templatesRefStore,
		    name:'templateRef',
		   
		    queryMode: 'local',
		    typeAhead: true
		    
		});
		
		
	
		this.items=[{xtype:'textfield', fieldLabel:'Intitul&eacute;', allowBlank:false, name:'template_name'},combo, 
	       {xtype:'hiddenfield', name:'id_template'}];
		
	this.callParent(arguments);
	
	if(this.record) this.loadRecord(this.record);
	}
	
});