DEFAULT_ADMIN_URL = "/admin/getjsondata/format/json";
Ext.Loader.setConfig({enabled:true,paths:{'TextoCMS':'/admin/app/','Ext':'/admin/ext/'}});

Ext.application({
	 
	    name: 'TextoCMS',
	    controllers:[],
	    requires: ['TextoCMS.classes.Ajax','TextoCMS.classes.Utils','TextoCMS.model.Proxy', 'Ext.ux.window.Notification', 'TextoCMS.components.cms.Loader'],
	    autoCreateViewport:false,
	    appFolder: '/admin/app',
	    
	    launch: function() {
	    		    	
	    	TextoCMS.app=this;
	    	
	    	this.addController('liveeditor.MenuEdit');
	    	this.addController('liveeditor.AdminSideBar');
	    	
	    },
	    init:function(){},
	    
	    addController: function(name){
	    	    
	    	  var controller = this.getController(name); //controller will be created automatically by name in this getter 
	    	  controller.init(this);
	    	  controller.onLaunch(this);
	    	}
	
});


