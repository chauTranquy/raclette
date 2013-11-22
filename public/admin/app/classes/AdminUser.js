Ext.define("TextoCMS.classes.AdminUser",{
	singleton:true,
	requires:['TextoCMS.classes.Ajax','TextoCMS.store.classes.AdminUserStore'],
	
	constructor:function(){
		this.ajax=	Ext.bind(TextoCMS.Ajax.ajaxRequest, TextoCMS.Ajax);
		
		this.store = Ext.create('TextoCMS.store.classes.AdminUserStore');
	
		this.store.on('load',this.getAdminRecord,this);
		this.store.load();
		

	},
	loadUserModule:function(cb){
		this.loadMask = Ext.create('Ext.ProgressBar', {
		       text:'Initialisation des modules...',
		       id:'pbar3',
		        width:300,
		        floating:true,
		        animate:true,
		        renderTo:Ext.getBody()
		    });
	
		if(cb==undefined||typeof cb!=='function')cb = Ext.emptyFn;
		
		this.ajax(DEFAULT_ADMIN_URL, {
			API : 'Admin_Model_UsersRightsMapper',
			APICall : 'checkAdminUserModules',
			id_site:TextoCMS.siteId
		}, Ext.bind(function(response){
			this.modules=response;
			cb(response);
			
		}, this), false);
		
	},
	getAdminRecord:function(){
		
		this.UserRecord = this.store.getAt(0);
		
	},
	isSuperAdmin:function(){
		return this.UserRecord.get('superAdmin');
		
		
	}
	
}, function(){
	
	TextoCMS.AdminUser=this;
	
});