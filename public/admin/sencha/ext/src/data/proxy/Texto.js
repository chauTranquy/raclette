Ext.define('Ext.data.proxy.Texto',{
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
	
		console.log(DEFAULT_ADMIN_URL);
this.callParent(arguments);
		
	}
	
});

// override proxy server processResponse pour traitement des erreurs


