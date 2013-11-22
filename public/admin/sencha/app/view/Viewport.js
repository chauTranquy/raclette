Ext.define('TextoCMS.view.Viewport',{
	extend:'Ext.container.Viewport',
	alias:'widget.textoviewport',
	//requires:['TextoCMS.view.cms.CmsTab', 'TextoCMS.view.medias.MediasTab','TextoCMS.view.dashboard.DashboardTab','TextoCMS.view.siteadmin.SiteAdminTab'],
	layout:'border',
	
	defaults:{
		border:false
		
	},
	
	items:[
	       {region:'north', height:50, contentEl :'headerAdmin', id:'headerRegion'},
	       
	       {region:'center', xtype:'tabpanel',
	    	 //  tabPosition:'bottom',
	    	   activeTab:0,
	    	  plain: true,
	    	  defaults:{
	    		  bodyStyle:'background-color:white',
	    			border:false,
	    			 bodyPadding:'10'
	    		},
	    	   items: []
	    	   /*listeners:{afterrender:function(tabpanel){
	    		 
	    		   tabpanel.setActiveTab(0);
	    		   
	    	   }}*/
	       
	       },
	       {region:'south', border:false, height:50}]
	
});