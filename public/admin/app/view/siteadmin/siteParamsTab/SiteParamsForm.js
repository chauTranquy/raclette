Ext.define('TextoCMS.view.siteadmin.siteParamsTab.SiteParamsForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.siteparamsform',
	border : false,
	id : 'SiteParamsForm',
	buttonAlign : 'left',
	bodyPadding : 10,
	fieldDefaults : {
		labelWidth : 250,
		labelStyle : 'text-align:right'

	},
	trackResetOnLoad : true,
	buttons : [ {
		text : 'Enregistrer',
		disabled : true,
		iconCls : 'saveBtn',
		action : 'save',
		style : 'margin-left:250px;'
	}, {
		text : 'Annuler',
		iconCls : 'refreshBtn',
		action : 'refresh',
		disabled : true
	} ],
	items : [ {
		xtype : 'text',
		fieldLabel : 'Nom du site',
		allowBlank : false,
		name : 'site_name'
	}, {
		xtype : 'text',
		fieldLabel : 'Url du site',
		allowBlank : false,
		vtype : 'url',
		name : 'site_url'
	}, {
		xtype : 'file',
		displayFile : false,
		baseFolder : '/',
		labelWidth : 250,
		fieldLabel : 'R&eacute;pertoire m&eacute;dia',
		allowBlank : false,
		name : 'media_dir'
	}, {
		xtype : 'file',
		fieldLabel : 'Icone',
		baseFolder : '/',
		allowBlank : false,
		labelWidth : 250,
		displayAllFile : true,
		name : 'site_logo'
	},
	{
		xtype : 'text',
		fieldLabel : 'Chemin',
		allowBlank : false,
		name : 'path'
	},
	{
        xtype: 'displayfield',
        fieldLabel: 'Chemin de l\'application',
       
        name: 'currentPath',
        value: '10'
    },
    
    {
		xtype : 'file',
		baseFolder : '/../application/',
		labelWidth : 250,
		fieldLabel : 'Layout associ&eacute;',
		allowBlank : false,
		filter:'phtml',
		name : 'layout'
	},
/*	{
		xtype : 'text',
		fieldLabel : 'Compte Google Analytics',
		allowBlank : true,
		name : 'googleAnalytics'
	},
	*/
	{
		xtype : 'checkbox',
		fieldLabel : 'Activer le mode maintenance',
		name : 'maintenance',
		inputValue : 1
	}, {
		xtype : 'text',
		fieldLabel : 'Adresses IP de maintenance',
		allowBlank : true,
		name : 'allowed_ip',
		maskRe : /([0-9\.;]+)$/,
		validator : function(value) {
			
			if(value.empty()) return true;
			msg=true;
			var iprange=value.split(';');
			
			iprange.each(function(ip){ 
				if(TextoCMS.Utils.validateIP(ip)===null) {
					
					msg="Adresse IP invalide.";
					throw $break;
				};
				
			}, this);
			
			return msg;
		}
	},
	{
        xtype: 'displayfield',
        fieldLabel: 'Votre adresse IP',
       
        name: 'currentIp',
        value: '10'
    }],

	// 

	initComponent : function() {
		this.callParent(arguments);
		this.getForm().setValues = Ext.bind(this.setValues, this);

	},
	
	
	/**
	 * Set values for fields in this form in bulk.
	 * 
	 * @param {Object/Object[]}
	 *            values Either an array in the form:
	 * 
	 * [{id:'clientName', value:'Fred. Olsen Lines'}, {id:'portOfLoading',
	 * value:'FXT'}, {id:'portOfDischarge', value:'OSL'} ]
	 * 
	 * or an object hash of the form:
	 *  { clientName: 'Fred. Olsen Lines', portOfLoading: 'FXT',
	 * portOfDischarge: 'OSL' }
	 * 
	 * @return {Ext.form.Basic} this
	 */
	setValues : function(values) {
		var me = this.getForm(), v, vLen, val;
	
		if (Ext.isArray(values)) {
			// array of objects
			vLen = values.length;

			for (v = 0; v < vLen; v++) {
				val = values[v];

				this.setVal(val.id, val.value);
			}
		} else {
			// object hash
			Ext.iterate(values, this.setVal, this);
		}
		return me;
	},

	setVal : function(fieldId, val) {
		var me = this.getForm();
		var field = me.findField(fieldId);
		if (field) {

			field.setValue(val);
			if (field.mainFieldCT)
				field.mainFieldCT.setValue(val);

			if (me.trackResetOnLoad) {
				field.resetOriginalValue();
			}
		}
	}
});