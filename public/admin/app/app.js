/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
Ext.onReady(function () {
//	Ext.Loader.setConfig({enabled:true,paths:{'TextoCMS':'/admin/sencha/app/'}});
   
});
Ext.application({
	//controllers:['BaseController'],
    requires: ['Ext.tree.plugin.TreeViewDragDrop','Ext.window.MessageBox','Ext.data.Request','TextoCMS.proxy.Proxy','TextoCMS.tpl.medias.DefaultBrowserTpl','TextoCMS.view.Viewport','TextoCMS.view.widgets.Infogrid', 'TextoCMS.classes.Ajax','TextoCMS.classes.Gapi','TextoCMS.classes.Utils','TextoCMS.proxy.Proxy', 'Ext.ux.window.Notification', 'TextoCMS.components.cms.Loader','TextoCMS.classes.AdminUser'],
    name: 'TextoCMS',
    
    autoCreateViewport: false,
    appFolder: '',

    launch: function() {
    	TextoCMS.app=this;
    	TextoCMS.app.modules=[];
    	TextoCMS.app.moduleLoaded=0;
    	Shadowbox.init();
    	Ext.Loader.setPath('TextoCMS.Modules','js/modules/');
    	this.getView('Viewport').create();
    	
    	
    	/*this.modules = CMSModules;//['cms.ContentController', 'medias.MediasController', 'siteadmin.SiteAdminController', 'dashboard.DashboardController'];
    	this.modules.each(function(module){
    		this.addController(module);
    		
    	}, this);
    	*/
    	this.addController('BaseController');
    	
    	if(window.File && window.FileReader && window.FileList
		&& window.Blob){
		document.body.addEventListener("drop",function(e){
			  e = e || event;
e.preventDefault();
});
    	
		document.body.addEventListener("dragover",function(e){
			  e = e || event;
e.preventDefault();
return false;
}, false);
		
    	}
    	
    	Ext.TaskManager.start({
		    run: this.callUserCheckConnect,
		    interval: 300000,
		    scope:this
		});
    	
        
        Ext.apply(Ext.form.VTypes, {
            daterange : function(val, field) {
                var date = field.parseDate(val);

                if(!date){
                    return;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } 
                else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
            }
        });
    },
    init:function(){
    

    	
    	
    },
   

    
	callUserCheckConnect:function(){
		
		TextoCMS.Ajax.ajaxRequest(DEFAULT_ADMIN_URL,{API:'Application_Model_AdminUsersMapper',APICall:'checkConnect'}, null, false);
		
	},

    
    addController: function(name){
    	 
    	  var controller = this.getController(name); //controller will be created automatically by name in this getter 
    //	  controller.init(this);
    	//  controller.onLaunch(this);
    	  
    	  return controller;
    	}
});


/*override*/

Ext.define('Ext.form.SubmitFix', {
    override: 'Ext.ZIndexManager',


    register : function(comp) {
        var me = this,
            compAfterHide = comp.afterHide;
        
        if (comp.zIndexManager) {
            comp.zIndexManager.unregister(comp);
        }
        comp.zIndexManager = me;

        me.list[comp.id] = comp;
        me.zIndexStack.push(comp);
        
        // Hook into Component's afterHide processing
        comp.afterHide = function() {
            compAfterHide.apply(comp, arguments);
            me.onComponentHide(comp);
        };
    },

    /**
     * Unregisters a {@link Ext.Component} from this ZIndexManager. This should not
     * need to be called. Components are automatically unregistered upon destruction.
     * See {@link #register}.
     * @param {Ext.Component} comp The Component to unregister.
     */
    unregister : function(comp) {
        var me = this,
            list = me.list;
        
        delete comp.zIndexManager;
        if (list && list[comp.id]) {
            delete list[comp.id];
            
            // Relinquish control of Component's afterHide processing
            delete comp.afterHide;
            Ext.Array.remove(me.zIndexStack, comp);

            // Destruction requires that the topmost visible floater be activated. Same as hiding.
            me._activateLast();
        }
    }
});