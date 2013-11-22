Ext.define('TextoCMS.proxy.Proxy',{
	extend:'Ext.data.proxy.Ajax',
	alias: 'proxy.texto',
	//requires:[' Ext.data.Request'],
	actionMethods : 'post',
	extraParams : {
		API : '',
		APICall : ''
		
	},
	type : 'ajax',
	url : DEFAULT_ADMIN_URL,
	constructor:function(){
	
		
		Ext.override(Ext.data.proxy.Server, 
				{
			processResponse: function (success, operation, request, response, callback, scope) 
				    {
				var base = TextoCMS.classes.Ajax;
				if(base.evalError(response, request, Ext.emptyFn)===false) return;
				this.callOverridden([success, operation, request, response, callback, scope]);
				    }
				});
		this.callParent(arguments);
		
	}
	
});

// override proxy server processResponse pour traitement des erreurs


