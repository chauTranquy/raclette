Ext.define('TextoCMS.view.siteadmin.siteParamsTab.GoogleAnalyticsForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.GoogleAnalyticsForm',
	border : false,
	id : 'GoogleAnalyticsForm',
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
	items : [ 
	{
		xtype : 'checkbox',
		fieldLabel : 'Activer Google Analytics',
		name : 'googleActivated',
		inputValue : 1,
		uncheckedValue:0
	}, {
		xtype : 'text',
		fieldLabel : 'Client Id',
		allowBlank : true,
		name : 'googleClientID'

		
	},
	{
		xtype : 'text',
		fieldLabel : 'Api key',
		allowBlank : true,
		name : 'googleClientSecret'

		
	},
	{
		xtype : 'text',
		fieldLabel : 'Profile Id',
		allowBlank : true,
		name : 'googleProfileId'

		
	},
	{
		xtype : 'text',
		fieldLabel : 'Account Id',
		allowBlank : true,
		name : 'googleAccountId'

		
	},
	{
		xtype : 'text',
		fieldLabel : 'Web Property Id',
		allowBlank : true,
		name : 'googleWebPropertyId'

		
	},
	{
		xtype : 'text',
		fieldLabel : 'url Google Analytics',
		allowBlank : true,
		name : 'googleUrl'

		
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
			if(fieldId=="googleActivated")field.fireEvent('change', field);
			if (me.trackResetOnLoad) {
	
				field.resetOriginalValue();
			}
		}
	}
});